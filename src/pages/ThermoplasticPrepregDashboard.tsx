import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, ArrowLeft, BarChart3, Globe, Users, Beaker, Layers, Cog, Boxes } from "lucide-react";
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

const prepregTabs: TabConfig[] = [
  { id: "overview", label: "Market Overview", icon: BarChart3 },
  { id: "endUser", label: "End-Use Industry", icon: Users },
  { id: "region", label: "Region", icon: Globe },
  { id: "aircraft", label: "Resin Type", icon: Beaker },
  { id: "application", label: "Product Form", icon: Layers },
  { id: "equipment", label: "Fiber Type", icon: Boxes },
  { id: "process", label: "Process Type", icon: Cog },
];

const prepregYears = Array.from({ length: 2026 - 2012 + 1 }, (_, i) => 2012 + i);

const ThermoplasticPrepregDashboard = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [activeTab, setActiveTab] = useState<MainTabType>("overview");
  const { data: marketData, isLoading, error, refetch } = useMarketData("/data/thermoplastic-prepreg-market.json");

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
      case "endUser": return { data: marketData.endUser, title: "End-Use Industry" };
      case "region": return { data: marketData.region, title: "Region" };
      case "aircraft": return { data: marketData.aircraftType, title: "Resin Type" };
      case "application": return { data: marketData.application, title: "Product Form" };
      case "equipment": return { data: marketData.furnishedEquipment, title: "Fiber Type" };
      case "process": return { data: marketData.processType || [], title: "Process Type" };
      default: return { data: marketData.endUser, title: "End-Use Industry" };
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
          endUserLabel="End-Use Industry"
          aircraftLabel="Resin Type"
          applicationLabel="Product Form"
          equipmentLabel="Fiber Type"
          processTypeLabel="Process Type"
          useMillions
          baseYear={2020}
          forecastYear={2026}
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
        endUserLabel="End-Use Industry"
        aircraftLabel="Resin Type"
        equipmentLabel="Fiber Type"
        applicationLabel="Product Form"
        processTypeLabel="Process Type"
        useMillions
        baseYear={2020}
        forecastYear={2026}
      />
    );
  };

  return (
    <div className="aircraft-interiors-theme min-h-screen">
      <ScrollToTop />
      <AircraftInteriorsDashboardHeader title="Global Thermoplastic Prepreg Market" subtitle="Global Market Research Dashboard • 2012-2026" />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dataset/prepreg")} className="mb-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Prepreg
        </Button>

        <div className="mb-8">
          <MainNavigation
            value={activeTab}
            onChange={setActiveTab}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            showYearSelector
            tabs={prepregTabs}
            years={prepregYears}
          />
        </div>

        {renderTabContent()}

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <p className="text-sm text-muted-foreground">Global Thermoplastic Prepreg Market Research Report</p>
              <p className="text-xs text-muted-foreground/70">All values in US$ Million unless otherwise specified</p>
            </div>
            <img src={stratviewLogoWhite} alt="Stratview Research" className="h-10 w-auto" />
          </div>
        </motion.footer>
      </main>
    </div>
  );
};

export default ThermoplasticPrepregDashboard;