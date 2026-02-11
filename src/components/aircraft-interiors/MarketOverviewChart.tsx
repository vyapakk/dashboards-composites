import { motion } from "framer-motion";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { YearlyData } from "@/hooks/useMarketData";
import { useRef, useState } from "react";
import { useChartDownload } from "@/hooks/useChartDownload";
import { ChartDownloadButton } from "./ChartDownloadButton";
import { ChartTableViewToggle, DataTable, AnimatedViewSwitch } from "./ChartTableViewToggle";

interface MarketOverviewChartProps {
  data: YearlyData[];
  title: string;
  subtitle?: string;
  useMillions?: boolean;
}

export function MarketOverviewChart({ data, title, subtitle, useMillions = false }: MarketOverviewChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { downloadChart } = useChartDownload();
  const [view, setView] = useState<"chart" | "table">("chart");

  const chartData = data.map((d, index) => {
    const previousValue = index > 0 ? data[index - 1].value : null;
    const yoyGrowth = previousValue !== null ? ((d.value - previousValue) / previousValue) * 100 : null;
    return { year: d.year, value: d.value, yoyGrowth };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const marketSize = payload.find((p: any) => p.dataKey === "value");
      const yoyGrowth = payload.find((p: any) => p.dataKey === "yoyGrowth");
      return (
        <div className="rounded-lg border border-border bg-popover p-4 shadow-lg">
          <p className="mb-2 font-semibold text-foreground">{label}</p>
          {marketSize && (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(192, 95%, 55%)" }} />
              <span className="text-muted-foreground">Market Size:</span>
              <span className="font-mono font-medium text-foreground">${marketSize.value.toLocaleString()}M</span>
            </div>
          )}
          {yoyGrowth && yoyGrowth.value !== null && (
            <div className="flex items-center gap-2 text-sm mt-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(38, 92%, 55%)" }} />
              <span className="text-muted-foreground">YoY Growth:</span>
              <span className={`font-mono font-medium ${yoyGrowth.value >= 0 ? "text-chart-4" : "text-destructive"}`}>
                {yoyGrowth.value >= 0 ? "+" : ""}{yoyGrowth.value.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => (
    <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-3 sm:gap-6">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0" style={{ backgroundColor: "hsl(192, 95%, 55%)" }} />
        <span className="text-xs sm:text-sm text-muted-foreground">Market Size (US$ M)</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0" style={{ backgroundColor: "hsl(38, 92%, 55%)" }} />
        <span className="text-xs sm:text-sm text-muted-foreground">YoY Growth (%)</span>
      </div>
    </div>
  );

  const tableHeaders = ["Year", "Market Size (US$ M)", "YoY Growth (%)"];
  const tableRows = chartData.map((d) => [
    d.year,
    `$${d.value.toLocaleString()}M`,
    d.yoyGrowth !== null ? `${d.yoyGrowth >= 0 ? "+" : ""}${d.yoyGrowth.toFixed(1)}%` : "—",
  ]);

  return (
    <motion.div ref={chartRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="rounded-xl border border-border bg-card p-3 sm:p-6">
      <div className="mb-4 sm:mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1">
          <ChartTableViewToggle view={view} onViewChange={setView} />
          <ChartDownloadButton onClick={() => downloadChart(chartRef, `market-overview-chart`)} />
        </div>
      </div>
      <AnimatedViewSwitch
        view={view}
        chart={
          <div className="h-[300px] sm:h-[350px] w-full -mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradient-market-size" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(192, 95%, 55%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(192, 95%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
                <XAxis dataKey="year" stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} interval={Math.ceil(data.length / 8)} />
                <YAxis yAxisId="left" stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} tickFormatter={(value) => useMillions ? `$${Math.round(value)}M` : `$${(value / 1000).toFixed(1)}B`} width={70} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} tickFormatter={(value) => `${value.toFixed(0)}%`} domain={['auto', 'auto']} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
                <Line yAxisId="left" type="monotone" dataKey="value" stroke="hsl(192, 95%, 55%)" strokeWidth={3} dot={{ fill: "hsl(192, 95%, 55%)", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Market Size" />
                <Line yAxisId="right" type="monotone" dataKey="yoyGrowth" stroke="hsl(38, 92%, 55%)" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "hsl(38, 92%, 55%)", strokeWidth: 0, r: 3 }} activeDot={{ r: 5, strokeWidth: 0 }} name="YoY Growth" connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        }
        table={<DataTable headers={tableHeaders} rows={tableRows} />}
      />
    </motion.div>
  );
}
