import { useState, useEffect, useCallback } from "react";

// Types for the compact JSON format
interface CompactMarketData {
  years: number[];
  totalMarket: number[];
  segment1?: Record<string, number[]>;
  segment2?: Record<string, number[]>;
  region?: Record<string, number[]>;
  segment3?: Record<string, number[]>;
  segment4?: Record<string, number[]>;
  segment5?: Record<string, number[]>;
  segment6?: Record<string, number[]>;
  countryDataByRegion?: Record<string, Record<string, number[]>>;
  segment1BySegment2?: Record<string, Record<string, number[]>>;
  segment1ByRegion?: Record<string, Record<string, number[]>>;
  segment2ByRegion?: Record<string, Record<string, number[]>>;
  segment3ByRegion?: Record<string, Record<string, number[]>>;
  segment4ByRegion?: Record<string, Record<string, number[]>>;
  segment5ByRegion?: Record<string, Record<string, number[]>>;
  segment6ByRegion?: Record<string, Record<string, number[]>>;
  segment5BySegment3?: Record<string, Record<string, number[]>>;
}

// Types for the expanded format
export interface YearlyData {
  year: number;
  value: number;
}

export interface SegmentData {
  name: string;
  data: YearlyData[];
}

export interface MarketData {
  years: number[];
  totalMarket: YearlyData[];
  segment1: SegmentData[];
  segment2: SegmentData[];
  region: SegmentData[];
  segment3: SegmentData[];
  segment4: SegmentData[];
  segment5?: SegmentData[];
  segment6?: SegmentData[];
  countryDataByRegion: Record<string, SegmentData[]>;
  segment1BySegment2: Record<string, SegmentData[]>;
  segment1ByRegion: Record<string, SegmentData[]>;
  segment2ByRegion: Record<string, SegmentData[]>;
  segment3ByRegion: Record<string, SegmentData[]>;
  segment4ByRegion: Record<string, SegmentData[]>;
  segment5ByRegion?: Record<string, SegmentData[]>;
  segment6ByRegion?: Record<string, SegmentData[]>;
  segment5BySegment3?: Record<string, SegmentData[]>;
}

interface UseMarketDataResult {
  data: MarketData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * USAGE:
 * Each dashboard should have its own JSON file in /public/data/
 * named after the dashboard (e.g., "global-aircraft-interiors-market.json").
 *
 * Example:
 *   useMarketData("/data/global-aircraft-interiors-market.json")
 *   useMarketData("/data/aircraft-cabin-interior-composites-market.json")
 */

function expandValues(years: number[], values: number[]): YearlyData[] {
  return years.map((year, index) => ({
    year,
    value: values[index] ?? 0,
  }));
}

function expandSegment(years: number[], segment: Record<string, number[]>): SegmentData[] {
  return Object.entries(segment).map(([name, values]) => ({
    name,
    data: expandValues(years, values),
  }));
}

function expandNestedSegment(
  years: number[],
  nested: Record<string, Record<string, number[]>>
): Record<string, SegmentData[]> {
  const result: Record<string, SegmentData[]> = {};
  for (const [key, segment] of Object.entries(nested)) {
    result[key] = expandSegment(years, segment);
  }
  return result;
}

export function useMarketData(dataUrl: string = "/data/global-aircraft-interiors-market.json"): UseMarketDataResult {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(dataUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.statusText}`);
      }
      const compact: CompactMarketData = await response.json();
      const { years } = compact;

      const expanded: MarketData = {
        years,
        totalMarket: expandValues(years, compact.totalMarket),
        segment1: compact.segment1 ? expandSegment(years, compact.segment1) : [],
        segment2: compact.segment2 ? expandSegment(years, compact.segment2) : [],
        region: compact.region ? expandSegment(years, compact.region) : [],
        segment3: compact.segment3 ? expandSegment(years, compact.segment3) : [],
        segment4: compact.segment4 ? expandSegment(years, compact.segment4) : [],
        segment5: compact.segment5 ? expandSegment(years, compact.segment5) : undefined,
        segment6: compact.segment6 ? expandSegment(years, compact.segment6) : undefined,
        countryDataByRegion: expandNestedSegment(years, compact.countryDataByRegion || {}),
        segment1BySegment2: expandNestedSegment(years, compact.segment1BySegment2 || {}),
        segment1ByRegion: expandNestedSegment(years, compact.segment1ByRegion || {}),
        segment2ByRegion: expandNestedSegment(years, compact.segment2ByRegion || {}),
        segment3ByRegion: expandNestedSegment(years, compact.segment3ByRegion || {}),
        segment4ByRegion: expandNestedSegment(years, compact.segment4ByRegion || {}),
        segment5ByRegion: compact.segment5ByRegion ? expandNestedSegment(years, compact.segment5ByRegion) : undefined,
        segment6ByRegion: compact.segment6ByRegion ? expandNestedSegment(years, compact.segment6ByRegion) : undefined,
        segment5BySegment3: compact.segment5BySegment3 ? expandNestedSegment(years, compact.segment5BySegment3) : undefined,
      };

      setData(expanded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load market data");
    } finally {
      setIsLoading(false);
    }
  }, [dataUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}
