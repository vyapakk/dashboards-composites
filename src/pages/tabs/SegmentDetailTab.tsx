import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { KPICard } from "@/components/aircraft-interiors/KPICard";
import { MarketTrendChart } from "@/components/aircraft-interiors/MarketTrendChart";
import { SegmentPieChart } from "@/components/aircraft-interiors/SegmentPieChart";
import { RegionalBarChart } from "@/components/aircraft-interiors/RegionalBarChart";
import { ComparisonTable } from "@/components/aircraft-interiors/ComparisonTable";
import { DrillDownModal } from "@/components/aircraft-interiors/DrillDownModal";
import { StackedBarChart } from "@/components/aircraft-interiors/StackedBarChart";
import { useDrillDown } from "@/hooks/useDrillDown";
import { YearlyData, SegmentData, MarketData, calculateCAGR } from "@/hooks/useMarketData";

type SegmentType = "overview" | "segment1" | "segment2" | "region" | "segment3" | "segment4" | "segment5" | "segment6";

interface SegmentDetailTabProps {
  segmentType: SegmentType;
  segment2Label?: string;
  segmentData: SegmentData[];
  totalMarket: YearlyData[];
  marketData: MarketData;
  title: string;
  selectedYear: number;
  segment1Label?: string;
  segment4Label?: string;
  segment3Label?: string;
  segment5Label?: string;
  segment6Label?: string;
  useMillions?: boolean;
  baseYear?: number;
  forecastYear?: number;
}

export function SegmentDetailTab({
  segmentType,
  segmentData,
  totalMarket,
  marketData,
  title,
  selectedYear,
  segment1Label = "Segment 1",
  segment2Label = "Segment 2",
  segment4Label = "Segment 4",
  segment3Label = "Segment 3",
  segment5Label = "Segment 5",
  segment6Label = "Segment 6",
  useMillions = false,
  baseYear = 2025,
  forecastYear = 2034,
}: SegmentDetailTabProps) {
  const { drillDownState, openDrillDown, closeDrillDown } = useDrillDown();

  const yearSpan = forecastYear - baseYear;

  // Calculate KPI values
  const currentYearTotal = segmentData.reduce((sum, seg) => {
    const value = seg.data.find((d) => d.year === selectedYear)?.value ?? 0;
    return sum + value;
  }, 0);

  const valueBaseTotal = segmentData.reduce((sum, seg) => {
    const value = seg.data.find((d) => d.year === baseYear)?.value ?? 0;
    return sum + value;
  }, 0);

  const valueForecastTotal = segmentData.reduce((sum, seg) => {
    const value = seg.data.find((d) => d.year === forecastYear)?.value ?? 0;
    return sum + value;
  }, 0);

  const cagr = calculateCAGR(valueBaseTotal, valueForecastTotal, yearSpan);

  const SEGMENT_COLORS = [
    "hsl(192, 95%, 55%)",
    "hsl(38, 92%, 55%)",
    "hsl(262, 83%, 58%)",
    "hsl(142, 71%, 45%)",
    "hsl(346, 77%, 50%)",
    "hsl(199, 89%, 48%)",
    "hsl(28, 80%, 52%)",
    "hsl(180, 70%, 45%)",
  ];

  // Segment name arrays for reuse
  const segment2Names = marketData.segment2.map((s) => s.name);
  const regionNames = marketData.region.map((s) => s.name);
  const segment3Names = marketData.segment3.map((s) => s.name);
  const segment4Names = marketData.segment4.map((s) => s.name);
  const segment1Names = marketData.segment1.map((s) => s.name);
  const segment5Names = marketData.segment5?.map((s) => s.name) || [];
  const segment6Names = marketData.segment6?.map((s) => s.name) || [];

  // Get all countries from all regions
  const getAllCountries = (): SegmentData[] => {
    const allCountries: SegmentData[] = [];
    Object.values(marketData.countryDataByRegion).forEach((countries) => {
      allCountries.push(...countries);
    });
    return allCountries;
  };

  // Segment1 by Segment2 - uses direct data
  const getSegment1BySegment2Data = () => {
    if (!marketData.segment1BySegment2 || Object.keys(marketData.segment1BySegment2).length === 0) return [];
    
    return Object.keys(marketData.segment1BySegment2).map((s1Key) => {
      const segments = marketData.segment1BySegment2[s1Key] || [];
      const total = segments.reduce((sum, seg) => {
        return sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0);
      }, 0);

      return {
        name: s1Key,
        segments: segments.map((seg) => ({
          name: seg.name,
          value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0,
          fullData: seg.data,
        })),
        total,
      };
    });
  };

  // Segment1 by Region - uses direct data
  const getSegment1ByRegionData = () => {
    if (!marketData.segment1ByRegion) return [];
    
    return Object.keys(marketData.segment1ByRegion).map((s1Key) => {
      const segments = marketData.segment1ByRegion[s1Key] || [];
      const total = segments.reduce((sum, seg) => {
        return sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0);
      }, 0);

      return {
        name: s1Key,
        segments: segments.map((seg) => ({
          name: seg.name,
          value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0,
          fullData: seg.data,
        })),
        total,
      };
    });
  };

  // Segment2 by Region - uses direct data
  const getSegment2ByRegionData = () => {
    if (!marketData.segment2ByRegion) return [];
    
    return marketData.segment2.map((s2) => {
      const segments = marketData.segment2ByRegion[s2.name] || [];
      const total = segments.reduce((sum, seg) => {
        return sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0);
      }, 0);

      return {
        name: s2.name,
        segments: segments.map((seg) => ({
          name: seg.name,
          value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0,
          fullData: seg.data,
        })),
        total,
      };
    });
  };

  // Segment3 by Region - uses direct data
  const getSegment3ByRegionData = () => {
    if (!marketData.segment3ByRegion) return [];
    
    return marketData.segment3.map((s3) => {
      const segments = marketData.segment3ByRegion[s3.name] || [];
      const total = segments.reduce((sum, seg) => {
        return sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0);
      }, 0);

      return {
        name: s3.name,
        segments: segments.map((seg) => ({
          name: seg.name,
          value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0,
          fullData: seg.data,
        })),
        total,
      };
    });
  };

  // Segment4 by Region
  const getSegment4ByRegionData = () => {
    if (!marketData.segment4ByRegion) return [];
    
    return marketData.segment4.map((s4) => {
      let segments = marketData.segment4ByRegion[s4.name];
      if (!segments) {
        const shortName = s4.name.includes("BFE") ? "BFE" : s4.name.includes("SFE") ? "SFE" : s4.name;
        segments = marketData.segment4ByRegion[shortName] || [];
      }
      const total = segments.reduce((sum, seg) => {
        return sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0);
      }, 0);

      return {
        name: s4.name,
        segments: segments.map((seg) => ({
          name: seg.name,
          value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0,
          fullData: seg.data,
        })),
        total,
      };
    });
  };

  // Segment5 by Region
  const getSegment5ByRegionData = () => {
    if (!marketData.segment5 || !marketData.segment5ByRegion) return [];
    
    return marketData.segment5.map((s5) => {
      const segments = marketData.segment5ByRegion?.[s5.name] || [];
      const total = segments.reduce((sum, seg) => {
        return sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0);
      }, 0);

      return {
        name: s5.name,
        segments: segments.map((seg) => ({
          name: seg.name,
          value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0,
          fullData: seg.data,
        })),
        total,
      };
    });
  };

  // Segment6 by Region
  const getSegment6ByRegionData = () => {
    if (!marketData.segment6 || !marketData.segment6ByRegion) return [];
    
    return marketData.segment6.map((s6) => {
      const segments = marketData.segment6ByRegion?.[s6.name] || [];
      const total = segments.reduce((sum, seg) => {
        return sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0);
      }, 0);

      return {
        name: s6.name,
        segments: segments.map((seg) => ({
          name: seg.name,
          value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0,
          fullData: seg.data,
        })),
        total,
      };
    });
  };

  // Prepare stacked bar data
  const segment2StackedData = segmentType === "segment1" ? getSegment1BySegment2Data() : [];
  const regionStackedDataForSegment1 = segmentType === "segment1" ? getSegment1ByRegionData() : [];

  const segment2ByRegionData = segmentType === "segment2" ? getSegment2ByRegionData() : [];
  const segment2BySegment1Data = segmentType === "segment2" && Object.keys(marketData.segment1BySegment2 || {}).length > 0
    ? marketData.segment2.map((s2) => {
        const segments = segment1Names.map((s1Name) => {
          const s1Data = marketData.segment1BySegment2?.[s1Name]?.find(s => s.name === s2.name);
          const value = s1Data?.data.find(d => d.year === selectedYear)?.value ?? 0;
          return { name: s1Name, value, fullData: s1Data?.data || [] };
        });
        return {
          name: s2.name,
          segments,
          total: segments.reduce((s, seg) => s + seg.value, 0),
        };
      })
    : [];

  // For region charts
  const regionBySegment2Data = segmentType === "region" ? marketData.region.map((region) => {
    const segments = marketData.segment2.map((s2) => {
      const s2RegionData = marketData.segment2ByRegion?.[s2.name]?.find(r => r.name === region.name);
      const value = s2RegionData?.data.find(d => d.year === selectedYear)?.value ?? 0;
      return { name: s2.name, value, fullData: s2RegionData?.data || [] };
    });
    return { name: region.name, segments, total: segments.reduce((s, seg) => s + seg.value, 0) };
  }) : [];

  const regionBySegment3Data = (segmentType === "region" && marketData.segment3.length > 0 && marketData.segment3ByRegion && Object.keys(marketData.segment3ByRegion).length > 0) ? marketData.region.map((region) => {
    const segments = marketData.segment3.map((s3) => {
      const s3RegionData = marketData.segment3ByRegion?.[s3.name]?.find(r => r.name === region.name);
      const value = s3RegionData?.data.find(d => d.year === selectedYear)?.value ?? 0;
      return { name: s3.name, value, fullData: s3RegionData?.data || [] };
    });
    return { name: region.name, segments, total: segments.reduce((s, seg) => s + seg.value, 0) };
  }) : [];

  const regionBySegment1Data = segmentType === "region" ? marketData.region.map((region) => {
    const segments = segment1Names.map((s1Name) => {
      const s1RegionData = marketData.segment1ByRegion?.[s1Name]?.find(r => r.name === region.name);
      const value = s1RegionData?.data.find(d => d.year === selectedYear)?.value ?? 0;
      return { name: s1Name, value, fullData: s1RegionData?.data || [] };
    });
    return {
      name: region.name,
      segments,
      total: segments.reduce((s, seg) => s + seg.value, 0),
    };
  }) : [];

  const regionBySegment4Data = segmentType === "region" ? marketData.region.map((region) => {
    const s4Segments = marketData.segment4.map((s4) => {
      let s4RegionEntries = marketData.segment4ByRegion?.[s4.name];
      if (!s4RegionEntries) {
        const shortName = s4.name.includes("BFE") ? "BFE" : s4.name.includes("SFE") ? "SFE" : s4.name;
        s4RegionEntries = marketData.segment4ByRegion?.[shortName];
      }
      const regionEntry = s4RegionEntries?.find(r => r.name === region.name);
      const value = regionEntry?.data.find(d => d.year === selectedYear)?.value ?? 0;
      return { name: s4.name, value, fullData: regionEntry?.data || [] };
    });
    return {
      name: region.name,
      segments: s4Segments,
      total: s4Segments.reduce((s, seg) => s + seg.value, 0),
    };
  }) : [];

  const regionBySegment5Data = segmentType === "region" && marketData.segment5 ? marketData.region.map((region) => {
    const segments = (marketData.segment5 || []).map((s5) => {
      const s5RegionData = marketData.segment5ByRegion?.[s5.name]?.find(r => r.name === region.name);
      const value = s5RegionData?.data.find(d => d.year === selectedYear)?.value ?? 0;
      return { name: s5.name, value, fullData: s5RegionData?.data || [] };
    });
    return { name: region.name, segments, total: segments.reduce((s, seg) => s + seg.value, 0) };
  }) : [];

  const segment3ByRegionData = segmentType === "segment3" ? getSegment3ByRegionData() : [];

  const segment4ByRegionData = segmentType === "segment4" ? getSegment4ByRegionData() : [];

  const segment5ByRegionData = segmentType === "segment5" ? getSegment5ByRegionData() : [];

  const segment5BySegment3Data = segmentType === "segment5" && marketData.segment5BySegment3
    ? (marketData.segment5 || []).map((s5) => {
        const segments = marketData.segment5BySegment3?.[s5.name] || [];
        const total = segments.reduce((sum, seg) => {
          return sum + (seg.data.find((d) => d.year === selectedYear)?.value ?? 0);
        }, 0);
        return {
          name: s5.name,
          segments: segments.map((seg) => ({
            name: seg.name,
            value: seg.data.find((d) => d.year === selectedYear)?.value ?? 0,
            fullData: seg.data,
          })),
          total,
        };
      })
    : [];

  const segment5Segment3Names = segmentType === "segment5" && marketData.segment5BySegment3
    ? [...new Set(
        Object.values(marketData.segment5BySegment3).flatMap(segments => segments.map(s => s.name))
      )]
    : [];

  const segment6ByRegionData = segmentType === "segment6" ? getSegment6ByRegionData() : [];

  const regionBySegment6Data = segmentType === "region" && marketData.segment6 ? marketData.region.map((region) => {
    const segments = (marketData.segment6 || []).map((s6) => {
      const s6RegionData = marketData.segment6ByRegion?.[s6.name]?.find(r => r.name === region.name);
      const value = s6RegionData?.data.find(d => d.year === selectedYear)?.value ?? 0;
      return { name: s6.name, value, fullData: s6RegionData?.data || [] };
    });
    return { name: region.name, segments, total: segments.reduce((s, seg) => s + seg.value, 0) };
  }) : [];

  const allCountries = segmentType === "region" ? getAllCountries() : [];

  // Get related segments for drill-down
  const getRelatedSegmentsForDrillDown = (segmentName: string) => {
    if (segmentType === "region" && marketData.countryDataByRegion[segmentName]) {
      return { title: `Countries in ${segmentName}`, data: marketData.countryDataByRegion[segmentName] };
    }
    if (segmentType === "segment2") {
      return { title: `${segment3Label} for this ${segment2Label}`, data: marketData.segment3 };
    }
    if (segmentType === "segment1") {
      return { title: "Regions for this segment", data: marketData.region };
    }
    if (segmentType === "segment3") {
      return { title: `${segment2Label} by ${segment3Label}`, data: marketData.segment2 };
    }
    if (segmentType === "segment4") {
      let regionalData = marketData.segment4ByRegion?.[segmentName];
      if (!regionalData) {
        const shortName = segmentName.includes("BFE") ? "BFE" : segmentName.includes("SFE") ? "SFE" : segmentName;
        regionalData = marketData.segment4ByRegion?.[shortName];
      }
      if (regionalData) {
        return { title: `Regions for ${segmentName}`, data: regionalData };
      }
      return { title: "Regions", data: marketData.region };
    }
    if (segmentType === "segment5") {
      const s5RegionData = marketData.segment5ByRegion?.[segmentName];
      if (s5RegionData) {
        return { title: `Regions for ${segmentName}`, data: s5RegionData };
      }
      return { title: "Regions", data: marketData.region };
    }
    if (segmentType === "segment6") {
      const s6RegionData = marketData.segment6ByRegion?.[segmentName];
      if (s6RegionData) {
        return { title: `Regions for ${segmentName}`, data: s6RegionData };
      }
      return { title: "Regions", data: marketData.region };
    }
    return undefined;
  };

  // Handle drill-down for pie chart segments
  const handlePieSegmentClick = (segmentName: string, data: YearlyData[], color: string) => {
    openDrillDown(segmentName, data, color, getRelatedSegmentsForDrillDown(segmentName));
  };

  // Handle drill-down for bar chart
  const handleBarClick = (segmentName: string, data: YearlyData[], color: string) => {
    if (segmentType === "region" && marketData.countryDataByRegion[segmentName]) {
      openDrillDown(segmentName, data, color, { title: `Countries in ${segmentName}`, data: marketData.countryDataByRegion[segmentName] });
    } else {
      openDrillDown(segmentName, data, color, getRelatedSegmentsForDrillDown(segmentName));
    }
  };

  // Handle drill-down for trend chart legend
  const handleTrendSegmentClick = (segmentName: string, data: YearlyData[], color: string) => {
    openDrillDown(segmentName, data, color, getRelatedSegmentsForDrillDown(segmentName));
  };

  // Handle drill-down for comparison table rows
  const handleTableRowClick = (segmentName: string, data: YearlyData[], color: string) => {
    openDrillDown(segmentName, data, color, getRelatedSegmentsForDrillDown(segmentName));
  };

  // Handle drill-down for stacked bar chart
  const handleStackedBarClick = (
    parentType: string,
    segmentName: string,
    value: number,
    color: string,
    fullData?: YearlyData[]
  ) => {
    const displayName = `${segmentName} (${parentType})`;
    if (fullData) {
      openDrillDown(displayName, fullData, color, undefined);
    }
  };

  // All segment tabs hide KPI cards
  const hideKPIs = segmentType === "segment1" || segmentType === "segment2" || segmentType === "region" || segmentType === "segment3" || segmentType === "segment4" || segmentType === "segment5" || segmentType === "segment6";

  return (
    <div className="space-y-8">
      {/* KPI Cards - Hidden for specialized tabs */}
      {!hideKPIs && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KPICard
            title={`${selectedYear} Market Size`}
            value={currentYearTotal / 1000}
            suffix="B"
            icon={DollarSign}
            delay={0}
            accentColor="primary"
          />
          <KPICard
            title="10-Year CAGR"
            value={cagr}
            prefix=""
            suffix="%"
            icon={BarChart3}
            delay={0.1}
            accentColor="chart-4"
          />
          <KPICard
            title={`${forecastYear} Forecast`}
            value={valueForecastTotal / 1000}
            suffix="B"
            icon={TrendingUp}
            delay={0.2}
            accentColor="accent"
          />
        </div>
      )}

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MarketTrendChart
            data={totalMarket}
            segments={segmentData}
            title={`${title} - Market Trend`}
            subtitle="Historical and forecast data (US$ Millions) - Click legend to drill down"
            showSegments
            onSegmentClick={handleTrendSegmentClick}
            useMillions={useMillions}
          />
        </div>
        <SegmentPieChart
          data={segmentData}
          year={selectedYear}
          title={title}
          onSegmentClick={handlePieSegmentClick}
        />
      </div>

      {/* Region Tab: Country Line Chart */}
      {segmentType === "region" && allCountries.length > 0 && (
        <MarketTrendChart
          data={totalMarket}
          segments={allCountries}
          title="Countries - Market Trend"
          subtitle="All countries historical and forecast data (US$ Millions)"
          showSegments
          onSegmentClick={handleTrendSegmentClick}
          useMillions={useMillions}
        />
      )}

      {/* Segment1 Specific: Stacked Bar Charts */}
      {segmentType === "segment1" && (
        <>
          {segment2StackedData.length > 0 && segment2StackedData.some(d => d.total > 0) && (
            <StackedBarChart
              data={segment2StackedData}
              year={selectedYear}
              title={`${segment1Label} by ${segment2Label}`}
              subtitle={`${selectedYear} breakdown - bars represent ${segment1Label.toLowerCase()} segments, stacks show ${segment2Label.toLowerCase()}`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={segment2Names}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
          {regionStackedDataForSegment1.length > 0 && regionStackedDataForSegment1.some(d => d.total > 0) && (
            <StackedBarChart
              data={regionStackedDataForSegment1}
              year={selectedYear}
              title={`${segment1Label} by Region`}
              subtitle={`${selectedYear} breakdown - bars represent ${segment1Label.toLowerCase()} segments, stacks show regions`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={regionNames}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
        </>
      )}

      {/* Segment2 Specific: Stacked Bar Charts */}
      {segmentType === "segment2" && (
        <>
          {segment2ByRegionData.length > 0 && segment2ByRegionData.some(d => d.total > 0) && (
            <StackedBarChart
              data={segment2ByRegionData}
              year={selectedYear}
              title={`${segment2Label} by Region`}
              subtitle={`${selectedYear} breakdown - bars represent ${segment2Label.toLowerCase()}, stacks show regions`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={regionNames}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
          {segment2BySegment1Data.length > 0 && segment2BySegment1Data.some(d => d.total > 0) && (
            <StackedBarChart
              data={segment2BySegment1Data}
              year={selectedYear}
              title={`${segment2Label} by ${segment1Label}`}
              subtitle={`${selectedYear} breakdown - bars represent ${segment2Label.toLowerCase()}, stacks show ${segment1Label.toLowerCase()}`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={segment1Names}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
        </>
      )}

      {/* Region Specific: Stacked Bar Charts */}
      {segmentType === "region" && (
        <>
          {regionBySegment2Data.length > 0 && regionBySegment2Data.some(d => d.total > 0) && (
            <StackedBarChart
              data={regionBySegment2Data}
              year={selectedYear}
              title={`Region by ${segment2Label}`}
              subtitle={`${selectedYear} breakdown - bars represent regions, stacks show ${segment2Label.toLowerCase()}`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={segment2Names}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
          {regionBySegment3Data.length > 0 && regionBySegment3Data.some(d => d.total > 0) && (
            <StackedBarChart
              data={regionBySegment3Data}
              year={selectedYear}
              title={`Region by ${segment3Label}`}
              subtitle={`${selectedYear} breakdown - bars represent regions, stacks show ${segment3Label.toLowerCase()}`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={segment3Names}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
          {regionBySegment1Data.length > 0 && regionBySegment1Data.some(d => d.total > 0) && (
            <StackedBarChart
              data={regionBySegment1Data}
              year={selectedYear}
              title={`Region by ${segment1Label}`}
              subtitle={`${selectedYear} breakdown - bars represent regions, stacks show ${segment1Label.toLowerCase()}`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={segment1Names}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
          {regionBySegment4Data.length > 0 && regionBySegment4Data.some(d => d.total > 0) && (
            <StackedBarChart
              data={regionBySegment4Data}
              year={selectedYear}
              title={`Region by ${segment4Label}`}
              subtitle={`${selectedYear} breakdown - bars represent regions, stacks show ${segment4Label.toLowerCase()}`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={segment4Names}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
          {regionBySegment5Data.length > 0 && regionBySegment5Data.some(d => d.total > 0) && (
            <StackedBarChart
              data={regionBySegment5Data}
              year={selectedYear}
              title={`Region by ${segment5Label}`}
              subtitle={`${selectedYear} breakdown - bars represent regions, stacks show ${segment5Label.toLowerCase()}`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={segment5Names}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
           />
          )}
          {regionBySegment6Data.length > 0 && regionBySegment6Data.some(d => d.total > 0) && (
            <StackedBarChart
              data={regionBySegment6Data}
              year={selectedYear}
              title={`Region by ${segment6Label}`}
              subtitle={`${selectedYear} breakdown - bars represent regions, stacks show ${segment6Label.toLowerCase()}`}
              segmentColors={SEGMENT_COLORS}
              segmentNames={segment6Names}
              onSegmentClick={handleStackedBarClick}
              useMillions={useMillions}
            />
          )}
        </>
      )}

      {/* Segment3 Specific: Stacked Bar Charts */}
      {segmentType === "segment3" && segment3ByRegionData.length > 0 && segment3ByRegionData.some(d => d.total > 0) && (
        <StackedBarChart
          data={segment3ByRegionData}
          year={selectedYear}
          title={`${segment3Label} by Region`}
          subtitle={`${selectedYear} breakdown - bars represent ${segment3Label.toLowerCase()}, stacks show regions`}
          segmentColors={SEGMENT_COLORS}
          segmentNames={regionNames}
          onSegmentClick={handleStackedBarClick}
          useMillions={useMillions}
        />
      )}

      {/* Segment4 Specific: Stacked Bar Charts */}
      {segmentType === "segment4" && segment4ByRegionData.length > 0 && segment4ByRegionData.some(d => d.total > 0) && (
        <StackedBarChart
          data={segment4ByRegionData}
          year={selectedYear}
          title={`${segment4Label} by Region`}
          subtitle={`${selectedYear} breakdown - bars represent ${segment4Label.toLowerCase()}, stacks show regions`}
          segmentColors={SEGMENT_COLORS}
          segmentNames={regionNames}
          onSegmentClick={handleStackedBarClick}
          useMillions={useMillions}
        />
      )}

      {/* Segment5 Specific: Stacked Bar Charts */}
      {segmentType === "segment5" && segment5ByRegionData.length > 0 && segment5ByRegionData.some(d => d.total > 0) && (
        <StackedBarChart
          data={segment5ByRegionData}
          year={selectedYear}
          title={`${segment5Label} by Region`}
          subtitle={`${selectedYear} breakdown - bars represent ${segment5Label.toLowerCase()}, stacks show regions`}
          segmentColors={SEGMENT_COLORS}
          segmentNames={regionNames}
          onSegmentClick={handleStackedBarClick}
          useMillions={useMillions}
        />
      )}
      {segmentType === "segment5" && segment5BySegment3Data.length > 0 && segment5BySegment3Data.some(d => d.total > 0) && (
        <StackedBarChart
          data={segment5BySegment3Data}
          year={selectedYear}
          title={`${segment5Label} by ${segment3Label}`}
          subtitle={`${selectedYear} breakdown - bars represent ${segment5Label.toLowerCase()}, stacks show ${segment3Label.toLowerCase()}`}
          segmentColors={SEGMENT_COLORS}
          segmentNames={segment5Segment3Names}
          onSegmentClick={handleStackedBarClick}
          useMillions={useMillions}
        />
      )}

      {/* Segment6 Specific: Stacked Bar Charts */}
      {segmentType === "segment6" && segment6ByRegionData.length > 0 && segment6ByRegionData.some(d => d.total > 0) && (
        <StackedBarChart
          data={segment6ByRegionData}
          year={selectedYear}
          title={`${segment6Label} by Region`}
          subtitle={`${selectedYear} breakdown - bars represent ${segment6Label.toLowerCase()}, stacks show regions`}
          segmentColors={SEGMENT_COLORS}
          segmentNames={regionNames}
          onSegmentClick={handleStackedBarClick}
          useMillions={useMillions}
        />
      )}

      {/* Comparison Table */}
      <ComparisonTable
        data={segmentData}
        startYear={baseYear}
        endYear={forecastYear}
        title={`${title} - Growth Analysis`}
        onRowClick={handleTableRowClick}
      />

      {/* Drill-Down Modal */}
      <DrillDownModal
        isOpen={drillDownState.isOpen}
        onClose={closeDrillDown}
        segmentName={drillDownState.segmentName}
        segmentData={drillDownState.segmentData}
        color={drillDownState.color}
        useMillions={useMillions}
        baseYear={baseYear}
        forecastYear={forecastYear}
      />
    </div>
  );
}
