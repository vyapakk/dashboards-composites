import { useState, useEffect, useCallback } from "react";

// Labels metadata embedded in JSON
export interface MarketLabels {
  title?: string;
  subtitle?: string;
  segment1?: string;
  segment2?: string;
  segment3?: string;
  segment4?: string;
  segment5?: string;
  segment6?: string;
  useMillions?: boolean;
  backRoute?: string;
  backLabel?: string;
  footerText?: string;
}

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
  labels?: MarketLabels;
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
  labels: MarketLabels;
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

/**
 * Auto-maps domain-specific JSON keys to generic segment keys.
 * This allows JSON files to use either format:
 *   Generic: segment1, segment2, segment3, segment4, segment5, segment6
 *   Domain:  endUser, aircraftType, application, furnishedEquipment, processType, materialType
 */
function normalizeCompactData(raw: Record<string, unknown>): CompactMarketData {
  const get = (generic: string, ...fallbacks: string[]): Record<string, number[]> | undefined => {
    if (raw[generic]) return raw[generic] as Record<string, number[]>;
    for (const fb of fallbacks) {
      if (raw[fb]) return raw[fb] as Record<string, number[]>;
    }
    return undefined;
  };

  const getNested = (generic: string, ...fallbacks: string[]): Record<string, Record<string, number[]>> | undefined => {
    if (raw[generic]) return raw[generic] as Record<string, Record<string, number[]>>;
    for (const fb of fallbacks) {
      if (raw[fb]) return raw[fb] as Record<string, Record<string, number[]>>;
    }
    return undefined;
  };

  return {
    years: raw.years as number[],
    totalMarket: raw.totalMarket as number[],
    segment1: get("segment1", "endUser"),
    segment2: get("segment2", "aircraftType"),
    region: get("region") as Record<string, number[]> | undefined,
    segment3: get("segment3", "application"),
    segment4: get("segment4", "furnishedEquipment"),
    segment5: get("segment5", "processType"),
    segment6: get("segment6", "materialType"),
    countryDataByRegion: getNested("countryDataByRegion"),
    segment1BySegment2: getNested("segment1BySegment2", "endUserByAircraftType"),
    segment1ByRegion: getNested("segment1ByRegion", "endUserByRegion"),
    segment2ByRegion: getNested("segment2ByRegion", "aircraftTypeByRegion"),
    segment3ByRegion: getNested("segment3ByRegion", "applicationByRegion"),
    segment4ByRegion: getNested("segment4ByRegion", "equipmentByRegion"),
    segment5ByRegion: getNested("segment5ByRegion", "processTypeByRegion"),
    segment6ByRegion: getNested("segment6ByRegion", "materialTypeByRegion"),
    segment5BySegment3: getNested("segment5BySegment3", "processTypeByApplication"),
    labels: raw.labels as MarketLabels | undefined,
  };
}

export function useMarketData(dataUrl: string = "/data/global-aircraft-interiors-market.json"): UseMarketDataResult {
  const [data, setData] = useState<MarketData | null>(null);
  const [labels, setLabels] = useState<MarketLabels>({});
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
      const raw = await response.json();
      const compact = normalizeCompactData(raw);
      const { years } = compact;

      // Extract labels from JSON (auto-detect from keys if not provided)
      const jsonLabels: MarketLabels = compact.labels || {};
      if (!jsonLabels.segment1 && raw.endUser) jsonLabels.segment1 = "End User";
      if (!jsonLabels.segment2 && raw.aircraftType) jsonLabels.segment2 = "Aircraft Type";
      if (!jsonLabels.segment3 && raw.application) jsonLabels.segment3 = "Application";
      if (!jsonLabels.segment4 && raw.furnishedEquipment) jsonLabels.segment4 = "Furnished Equipment";
      if (!jsonLabels.segment5 && raw.processType) jsonLabels.segment5 = "Process Type";
      if (!jsonLabels.segment6 && raw.materialType) jsonLabels.segment6 = "Material Type";
      setLabels(jsonLabels);

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

  return { data, labels, isLoading, error, refetch: fetchData };
}

export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}
