import { useState, useEffect, useCallback } from "react";

// Types for the compact JSON format
interface CompactMarketData {
  years: number[];
  totalMarket: number[];
  endUser: Record<string, number[]>;
  aircraftType: Record<string, number[]>;
  region: Record<string, number[]>;
  application: Record<string, number[]>;
  furnishedEquipment: Record<string, number[]>;
  processType?: Record<string, number[]>;
  materialType?: Record<string, number[]>;
  countryDataByRegion: Record<string, Record<string, number[]>>;
  endUserByAircraftType: Record<string, Record<string, number[]>>;
  endUserByRegion: Record<string, Record<string, number[]>>;
  aircraftTypeByRegion: Record<string, Record<string, number[]>>;
  applicationByRegion: Record<string, Record<string, number[]>>;
  equipmentByRegion: Record<string, Record<string, number[]>>;
  processTypeByRegion?: Record<string, Record<string, number[]>>;
  materialTypeByRegion?: Record<string, Record<string, number[]>>;
  processTypeByApplication?: Record<string, Record<string, number[]>>;
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
  endUser: SegmentData[];
  aircraftType: SegmentData[];
  region: SegmentData[];
  application: SegmentData[];
  furnishedEquipment: SegmentData[];
  processType?: SegmentData[];
  materialType?: SegmentData[];
  countryDataByRegion: Record<string, SegmentData[]>;
  endUserByAircraftType: Record<string, SegmentData[]>;
  endUserByRegion: Record<string, SegmentData[]>;
  aircraftTypeByRegion: Record<string, SegmentData[]>;
  applicationByRegion: Record<string, SegmentData[]>;
  equipmentByRegion: Record<string, SegmentData[]>;
  processTypeByRegion?: Record<string, SegmentData[]>;
  materialTypeByRegion?: Record<string, SegmentData[]>;
  processTypeByApplication?: Record<string, SegmentData[]>;
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
        endUser: expandSegment(years, compact.endUser),
        aircraftType: expandSegment(years, compact.aircraftType),
        region: expandSegment(years, compact.region),
        application: expandSegment(years, compact.application),
        furnishedEquipment: expandSegment(years, compact.furnishedEquipment),
        processType: compact.processType ? expandSegment(years, compact.processType) : undefined,
        materialType: compact.materialType ? expandSegment(years, compact.materialType) : undefined,
        countryDataByRegion: expandNestedSegment(years, compact.countryDataByRegion || {}),
        endUserByAircraftType: expandNestedSegment(years, compact.endUserByAircraftType || {}),
        endUserByRegion: expandNestedSegment(years, compact.endUserByRegion || {}),
        aircraftTypeByRegion: expandNestedSegment(years, compact.aircraftTypeByRegion || {}),
        applicationByRegion: expandNestedSegment(years, compact.applicationByRegion || {}),
        equipmentByRegion: expandNestedSegment(years, compact.equipmentByRegion || {}),
        processTypeByRegion: compact.processTypeByRegion ? expandNestedSegment(years, compact.processTypeByRegion) : undefined,
        materialTypeByRegion: compact.materialTypeByRegion ? expandNestedSegment(years, compact.materialTypeByRegion) : undefined,
        processTypeByApplication: compact.processTypeByApplication ? expandNestedSegment(years, compact.processTypeByApplication) : undefined,
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
