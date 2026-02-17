import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { SegmentData, YearlyData } from "@/hooks/useMarketData";
import { MainTabType } from "./MainNavigation";

interface DistributionDonutsRowProps {
  segment1Data: SegmentData[];
  segment2Data: SegmentData[];
  regionData: SegmentData[];
  segment3Data: SegmentData[];
  segment4Data: SegmentData[];
  segment5Data?: SegmentData[];
  year: number;
  onDonutClick?: (tabType: MainTabType) => void;
  onSliceClick?: (segmentName: string, segmentData: YearlyData[], color: string, donutType: MainTabType) => void;
  segment1Label?: string;
  segment2Label?: string;
  segment3Label?: string;
  segment4Label?: string;
  segment5Label?: string;
}

const chartColors = [
  "hsl(192, 95%, 55%)", "hsl(38, 92%, 55%)", "hsl(262, 83%, 58%)",
  "hsl(142, 71%, 45%)", "hsl(346, 77%, 50%)", "hsl(199, 89%, 48%)",
  "hsl(280, 65%, 60%)", "hsl(60, 70%, 50%)",
];

interface MiniDonutProps {
  data: SegmentData[];
  year: number;
  title: string;
  tabType: MainTabType;
  onClick?: (tabType: MainTabType) => void;
  onSliceClick?: (segmentName: string, segmentData: YearlyData[], color: string, donutType: MainTabType) => void;
  delay: number;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))", cursor: "pointer" }} />
    </g>
  );
};

function MiniDonut({ data, year, title, tabType, onClick, onSliceClick, delay }: MiniDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const pieData = data.map((segment, index) => ({
    name: segment.name,
    value: segment.data.find((d) => d.year === year)?.value ?? 0,
    color: chartColors[index % chartColors.length],
    fullData: segment.data,
  }));

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="rounded-lg border border-border bg-popover p-2 shadow-lg text-xs">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-muted-foreground">${item.value.toLocaleString()}M ({percentage}%)</p>
          <p className="text-primary text-[10px] mt-1">Click to drill down</p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (_data: any, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const segment = pieData[index];
    if (segment && onSliceClick) {
      onSliceClick(segment.name, segment.fullData, segment.color, tabType);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay }} onClick={() => onClick?.(tabType)} className="rounded-xl border border-border bg-card p-4 cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg">
      <h4 className="text-sm font-medium text-foreground text-center mb-2">{title}</h4>
      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="hsl(222, 47%, 6%)" strokeWidth={1} activeIndex={activeIndex} activeShape={renderActiveShape} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(undefined)} onClick={handlePieClick} style={{ cursor: "pointer" }}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-1 mt-2">
        {pieData.slice(0, 3).map((entry, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[10px] text-muted-foreground truncate max-w-[50px]">{entry.name}</span>
          </div>
        ))}
        {pieData.length > 3 && <span className="text-[10px] text-muted-foreground">+{pieData.length - 3}</span>}
      </div>
    </motion.div>
  );
}

export function DistributionDonutsRow({
  segment1Data,
  segment2Data,
  regionData,
  segment3Data,
  segment4Data,
  segment5Data,
  year,
  onDonutClick,
  onSliceClick,
  segment1Label = "Segment 1",
  segment2Label = "Segment 2",
  segment3Label = "Segment 3",
  segment4Label = "Segment 4",
  segment5Label = "Segment 5",
}: DistributionDonutsRowProps) {
  const hasSegment1 = segment1Data && segment1Data.length > 0;
  const hasSegment2 = segment2Data && segment2Data.length > 0;
  const hasRegion = regionData && regionData.length > 0;
  const hasSegment3 = segment3Data && segment3Data.length > 0;
  const hasSegment4 = segment4Data && segment4Data.length > 0;
  const hasSegment5 = segment5Data && segment5Data.length > 0;
  const donutCount = (hasSegment1 ? 1 : 0) + (hasSegment2 ? 1 : 0) + (hasRegion ? 1 : 0) + (hasSegment3 ? 1 : 0) + (hasSegment4 ? 1 : 0) + (hasSegment5 ? 1 : 0);
  const gridCols = donutCount >= 6
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
    : donutCount === 5
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
    : donutCount >= 3
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {hasSegment1 && (
        <MiniDonut data={segment1Data} year={year} title={segment1Label} tabType="segment1" onClick={onDonutClick} onSliceClick={onSliceClick} delay={0.1} />
      )}
      {hasSegment2 && (
        <MiniDonut data={segment2Data} year={year} title={segment2Label} tabType="segment2" onClick={onDonutClick} onSliceClick={onSliceClick} delay={0.15} />
      )}
      {hasRegion && (
        <MiniDonut data={regionData} year={year} title="Region" tabType="region" onClick={onDonutClick} onSliceClick={onSliceClick} delay={0.2} />
      )}
      {hasSegment3 && (
        <MiniDonut data={segment3Data} year={year} title={segment3Label} tabType="segment3" onClick={onDonutClick} onSliceClick={onSliceClick} delay={0.25} />
      )}
      {hasSegment4 && (
        <MiniDonut data={segment4Data} year={year} title={segment4Label} tabType="segment4" onClick={onDonutClick} onSliceClick={onSliceClick} delay={0.3} />
      )}
      {hasSegment5 && (
        <MiniDonut data={segment5Data} year={year} title={segment5Label} tabType="segment5" onClick={onDonutClick} onSliceClick={onSliceClick} delay={0.35} />
      )}
    </div>
  );
}
