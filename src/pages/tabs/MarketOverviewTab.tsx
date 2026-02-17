import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { KPICard } from "@/components/aircraft-interiors/KPICard";
import { MarketOverviewChart } from "@/components/aircraft-interiors/MarketOverviewChart";
import { DistributionDonutsRow } from "@/components/aircraft-interiors/DistributionDonutsRow";
import { DrillDownModal } from "@/components/aircraft-interiors/DrillDownModal";
import { MarketData, calculateCAGR, SegmentData, YearlyData } from "@/hooks/useMarketData";
import { MainTabType } from "@/components/aircraft-interiors/MainNavigation";
import { useDrillDown } from "@/hooks/useDrillDown";

interface MarketOverviewTabProps {
  marketData: MarketData;
  selectedYear: number;
  onYearChange: (year: number) => void;
  onNavigateToTab: (tabType: MainTabType) => void;
  segment1Label?: string;
  segment2Label?: string;
  segment3Label?: string;
  segment4Label?: string;
  segment5Label?: string;
  useMillions?: boolean;
  baseYear?: number;
  forecastYear?: number;
}

export function MarketOverviewTab({
  marketData,
  selectedYear,
  onYearChange,
  onNavigateToTab,
  segment1Label = "Segment 1",
  segment2Label = "Segment 2",
  segment3Label = "Segment 3",
  segment4Label = "Segment 4",
  segment5Label = "Segment 5",
  useMillions = false,
  baseYear = 2025,
  forecastYear = 2034,
}: MarketOverviewTabProps) {
  const { drillDownState, openDrillDown, closeDrillDown } = useDrillDown();

  const yearSpan = forecastYear - baseYear;

  // Calculate KPI values
  const currentMarketValue = marketData.totalMarket.find((d) => d.year === selectedYear)?.value ?? 0;
  const valueBase = marketData.totalMarket.find((d) => d.year === baseYear)?.value ?? 0;
  const valueForecast = marketData.totalMarket.find((d) => d.year === forecastYear)?.value ?? 0;
  const cagrValue = calculateCAGR(valueBase, valueForecast, yearSpan);

  // Handle slice click for drill-down modal
  const handleSliceClick = (
    segmentName: string,
    segmentData: YearlyData[],
    color: string,
    donutType: MainTabType
  ) => {
    let relatedSegments: { title: string; data: SegmentData[] } | undefined;
    
    switch (donutType) {
      case "segment1":
        relatedSegments = { title: "By Region", data: marketData.region };
        break;
      case "segment2":
        relatedSegments = { title: `By ${segment3Label}`, data: marketData.segment3 };
        break;
      case "region":
        relatedSegments = { title: `By ${segment1Label}`, data: marketData.segment1 };
        break;
      case "segment3":
        relatedSegments = { title: `By ${segment2Label}`, data: marketData.segment2 };
        break;
      case "segment4":
        relatedSegments = { title: `By ${segment1Label}`, data: marketData.segment1 };
        break;
      case "segment5":
        relatedSegments = { title: "By Region", data: marketData.region };
        break;
    }

    openDrillDown(segmentName, segmentData, color, relatedSegments);
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard
          title={`${selectedYear} Market Size`}
          value={useMillions ? currentMarketValue : currentMarketValue / 1000}
          suffix={useMillions ? "M" : "B"}
          icon={DollarSign}
          delay={0}
          accentColor="primary"
        />
        <KPICard
          title={`CAGR through ${forecastYear}`}
          value={cagrValue}
          prefix=""
          suffix="%"
          icon={BarChart3}
          delay={0.1}
          accentColor="chart-4"
        />
        <KPICard
          title={`${forecastYear} Forecast`}
          value={useMillions ? valueForecast : valueForecast / 1000}
          suffix={useMillions ? "M" : "B"}
          icon={TrendingUp}
          delay={0.2}
          accentColor="accent"
        />
      </div>

      {/* Dual-Axis Line Chart */}
      <MarketOverviewChart
        data={marketData.totalMarket}
        title="Market Size & YoY Growth Trend"
        subtitle={`Historical (${marketData.years[0]}-${baseYear}) and Forecast (${baseYear + 1}-${forecastYear}) data`}
        useMillions={useMillions}
      />

      {/* Distribution Donuts Row */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {selectedYear} Market Distribution
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click any slice to see detailed analysis
        </p>
        <DistributionDonutsRow
          segment1Data={marketData.segment1}
          segment2Data={marketData.segment2}
          regionData={marketData.region}
          segment3Data={marketData.segment3}
          segment4Data={marketData.segment4.length ? marketData.segment4 : (marketData.segment6 ?? [])}
          segment5Data={marketData.segment5}
          year={selectedYear}
          onDonutClick={onNavigateToTab}
          onSliceClick={handleSliceClick}
          segment1Label={segment1Label}
          segment2Label={segment2Label}
          segment3Label={segment3Label}
          segment4Label={segment4Label}
          segment5Label={segment5Label}
        />
      </div>

      {/* Drill-Down Modal */}
      <DrillDownModal
        isOpen={drillDownState.isOpen}
        onClose={closeDrillDown}
        segmentName={drillDownState.segmentName}
        segmentData={drillDownState.segmentData}
        color={drillDownState.color}
        useMillions={useMillions}
      />
    </div>
  );
}
