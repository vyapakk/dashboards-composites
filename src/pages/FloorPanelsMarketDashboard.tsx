import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, ArrowLeft, BarChart3, Plane, Globe, Users, Package, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AircraftInteriorsDashboardHeader } from "@/components/aircraft-interiors/DashboardHeader";
import { MainNavigation, MainTabType, TabConfig } from "@/components/aircraft-interiors/MainNavigation";
import { DashboardSkeleton } from "@/components/aircraft-interiors/DashboardSkeleton";
import { ScrollToTop } from "@/components/aircraft-interiors/ScrollToTop";
import { MarketOverviewTab } from "@/pages/tabs/MarketOverviewTab";
import { SegmentDetailTab } from "@/pages/tabs/SegmentDetailTab";
import { useMarketData } from "@/hooks/useMarketData";
import { Button } from "@/components/ui/button";
import stratviewLogoWhite from "@/assets/stratview-logo-white.png";

const floorPanelsTabs: TabConfig[] = [
  { id: "overview", label: "Market Overview", icon: BarChart3 },
  { id: "endUser", label: "End-User Type", icon: Users },
  { id: "aircraft", label: "Aircraft Type", icon: Plane },
  { id: "region", label: "Region", icon: Globe },
  { id: "application", label: "Core Type", icon: Layers },
  { id: "equipment", label: "Equipment Type", icon: Package },
];

const floorPanelsYears = Array.from({ length: 2034 - 2016 + 1 }, (_, i) => 2016 + i);

const FloorPanelsMarketDashboard = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [activeTab, setActiveTab] = useState<MainTabType>("overview");
  const { data: marketData, isLoading, error, refetch } = useMarketData("/data/aircraft-floor-panels-market.json");

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

  const getSegmentInfo = () => {
    switch (activeTab) {
      case "endUser": return { data: marketData.endUser, title: "End-User Type" };
      case "aircraft": return { data: marketData.aircraftType, title: "Aircraft Type" };
      case "region": return { data: marketData.region, title: "Region" };
      case "application": return { data: marketData.application, title: "Core Type" };
      case "equipment": return { data: marketData.furnishedEquipment, title: "Equipment Type" };
      default: return { data: marketData.endUser, title: "End-User Type" };
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
          endUserLabel="End-User Type"
          equipmentLabel="Equipment Type"
          useMillions
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
        endUserLabel="End-User Type"
        equipmentLabel="Equipment Type"
        applicationLabel="Core Type"
        useMillions
      />
    );
  };

  return (
    <div className="aircraft-interiors-theme min-h-screen">
      <ScrollToTop />
      <AircraftInteriorsDashboardHeader title="Aircraft Floor Panels Market" subtitle="Global Market Research Dashboard • 2016-2034" />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dataset/aircraft-interiors")} className="mb-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Aircraft Interiors
        </Button>

        <div className="mb-8">
          <MainNavigation
            value={activeTab}
            onChange={setActiveTab}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            showYearSelector
            tabs={floorPanelsTabs}
            years={floorPanelsYears}
          />
        </div>

        {renderTabContent()}

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <p className="text-sm text-muted-foreground">Aircraft Floor Panels Market Research Report</p>
              <p className="text-xs text-muted-foreground/70">All values in US$ Million unless otherwise specified</p>
            </div>
            <img src={stratviewLogoWhite} alt="Stratview Research" className="h-10 w-auto" />
          </div>
        </motion.footer>
      </main>
    </div>
  );
};

export default FloorPanelsMarketDashboard;
