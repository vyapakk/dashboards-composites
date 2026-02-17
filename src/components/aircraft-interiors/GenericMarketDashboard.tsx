import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, ArrowLeft, BarChart3, Users, Plane, Globe, Layers, Settings, Wrench, Boxes } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AircraftInteriorsDashboardHeader } from "@/components/aircraft-interiors/DashboardHeader";
import { MainNavigation, MainTabType, TabConfig } from "@/components/aircraft-interiors/MainNavigation";
import { DashboardSkeleton } from "@/components/aircraft-interiors/DashboardSkeleton";
import { ScrollToTop } from "@/components/aircraft-interiors/ScrollToTop";
import { MarketOverviewTab } from "@/pages/tabs/MarketOverviewTab";
import { SegmentDetailTab } from "@/pages/tabs/SegmentDetailTab";
import { useMarketData, MarketLabels } from "@/hooks/useMarketData";
import { Button } from "@/components/ui/button";
import stratviewLogoWhite from "@/assets/stratview-logo-white.png";

const SEGMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "End User": Users,
  "End-User": Users,
  "End-User Type": Users,
  "End-Use Industry": Users,
  "Aircraft Type": Plane,
  "Aircraft": Plane,
  "Region": Globe,
  "Application": Layers,
  "Application Type": Layers,
  "Lavatory Type": Layers,
  "Lining Type": Layers,
  "Panel Type": Layers,
  "Liner Type": Layers,
  "Equipment": Settings,
  "Furnished Equipment": Settings,
  "Furnished Equipment Type": Settings,
  "Process Type": Wrench,
  "Manufacturing Process": Wrench,
  "Material Type": Boxes,
  "Resin Type": Boxes,
  "Material": Boxes,
  "Plastic Type": Boxes,
  "Product Type": Boxes,
  "Fiber Type": Boxes,
};

function getIconForLabel(label: string): React.ComponentType<{ className?: string }> {
  return SEGMENT_ICONS[label] || Layers;
}

interface GenericMarketDashboardProps {
  dataUrl: string;
  /** Override labels from JSON if needed */
  labelOverrides?: Partial<MarketLabels>;
}

export function GenericMarketDashboard({ dataUrl, labelOverrides }: GenericMarketDashboardProps) {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [activeTab, setActiveTab] = useState<MainTabType>("overview");
  const { data: marketData, labels: jsonLabels, isLoading, error, refetch } = useMarketData(dataUrl);

  // Merge JSON labels with any overrides
  const labels: MarketLabels = { ...jsonLabels, ...labelOverrides };

  const segment1Label = labels.segment1 || "Segment 1";
  const segment2Label = labels.segment2 || "Segment 2";
  const segment3Label = labels.segment3 || "Segment 3";
  const segment4Label = labels.segment4 || "Segment 4";
  const segment5Label = labels.segment5 || "Segment 5";
  const segment6Label = labels.segment6 || "Segment 6";
  const useMillions = labels.useMillions !== false; // default true
  const title = labels.title || "Market Dashboard";
  const subtitle = labels.subtitle;
  const backRoute = labels.backRoute || "/dashboard";
  const backLabel = labels.backLabel || "Back";
  const footerText = labels.footerText || title;

  if (isLoading) return <DashboardSkeleton />;

  if (error || !marketData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">Failed to Load Data</h1>
        <p className="text-muted-foreground">{error || "Unable to load market data"}</p>
        <Button onClick={refetch} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  // Auto-build tabs from available data
  const tabs: TabConfig[] = [
    { id: "overview", label: "Market Overview", icon: BarChart3 },
  ];

  if (marketData.segment1.length > 0) {
    tabs.push({ id: "segment1", label: segment1Label, icon: getIconForLabel(segment1Label) });
  }
  if (marketData.segment2.length > 0) {
    tabs.push({ id: "segment2", label: segment2Label, icon: getIconForLabel(segment2Label) });
  }
  tabs.push({ id: "region", label: "Region", icon: Globe });
  if (marketData.segment3.length > 0) {
    tabs.push({ id: "segment3", label: segment3Label, icon: getIconForLabel(segment3Label) });
  }
  if (marketData.segment4.length > 0) {
    tabs.push({ id: "segment4", label: segment4Label, icon: getIconForLabel(segment4Label) });
  }
  if (marketData.segment5 && marketData.segment5.length > 0) {
    tabs.push({ id: "segment5", label: segment5Label, icon: getIconForLabel(segment5Label) });
  }
  if (marketData.segment6 && marketData.segment6.length > 0) {
    tabs.push({ id: "segment6", label: segment6Label, icon: getIconForLabel(segment6Label) });
  }

  const years = marketData.years;
  const baseYear = years.find(y => y >= 2025) || years[0];
  const forecastYear = years[years.length - 1];

  const getSegmentInfo = () => {
    switch (activeTab) {
      case "segment1": return { data: marketData.segment1, title: segment1Label };
      case "segment2": return { data: marketData.segment2, title: segment2Label };
      case "region": return { data: marketData.region, title: "Region" };
      case "segment3": return { data: marketData.segment3, title: segment3Label };
      case "segment4": return { data: marketData.segment4, title: segment4Label };
      case "segment5": return { data: marketData.segment5 || [], title: segment5Label };
      case "segment6": return { data: marketData.segment6 || [], title: segment6Label };
      default: return { data: marketData.segment1, title: segment1Label };
    }
  };

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <MarketOverviewTab
          marketData={marketData}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onNavigateToTab={setActiveTab}
          segment1Label={segment1Label}
          segment2Label={segment2Label}
          segment3Label={segment3Label}
          segment4Label={segment4Label}
          segment5Label={segment5Label}
          useMillions={useMillions}
          baseYear={baseYear}
          forecastYear={forecastYear}
        />
      );
    }
    const segmentInfo = getSegmentInfo();
    return (
      <SegmentDetailTab
        segmentType={activeTab}
        segmentData={segmentInfo.data}
        totalMarket={marketData.totalMarket}
        marketData={marketData}
        title={segmentInfo.title}
        selectedYear={selectedYear}
        segment1Label={segment1Label}
        segment2Label={segment2Label}
        segment3Label={segment3Label}
        segment4Label={segment4Label}
        segment5Label={segment5Label}
        segment6Label={segment6Label}
        useMillions={useMillions}
        baseYear={baseYear}
        forecastYear={forecastYear}
      />
    );
  };

  return (
    <div className="aircraft-interiors-theme min-h-screen">
      <ScrollToTop />
      <AircraftInteriorsDashboardHeader title={title} subtitle={subtitle} />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(backRoute)}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
        </Button>
        <div className="mb-8">
          <MainNavigation
            value={activeTab}
            onChange={setActiveTab}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            showYearSelector
            tabs={tabs}
            years={years}
          />
        </div>
        {renderTabContent()}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 border-t border-border pt-6"
        >
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <p className="text-sm text-muted-foreground">{footerText}</p>
              <p className="text-xs text-muted-foreground/70">
                All values in US$ {useMillions ? "Million" : "Billion"} unless otherwise specified
              </p>
            </div>
            <img src={stratviewLogoWhite} alt="Stratview Research" className="h-10 w-auto" />
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
