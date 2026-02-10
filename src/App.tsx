import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import DatasetDetail from "./pages/DatasetDetail";
import AircraftInteriorsDashboard from "./pages/AircraftInteriorsDashboard";
import CabinCompositesDashboard from "./pages/CabinCompositesDashboard";
import SoftGoodsDashboard from "./pages/SoftGoodsDashboard";
import WaterWasteWaterDashboard from "./pages/WaterWasteWaterDashboard";
import GalleyMarketDashboard from "./pages/GalleyMarketDashboard";
import PSUMarketDashboard from "./pages/PSUMarketDashboard";
import LavatoryMarketDashboard from "./pages/LavatoryMarketDashboard";
import OHSBMarketDashboard from "./pages/OHSBMarketDashboard";
import StowagesMarketDashboard from "./pages/StowagesMarketDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dataset/:datasetId" element={<DatasetDetail />} />
          <Route path="/dashboard/aircraft-interiors" element={<AircraftInteriorsDashboard />} />
          <Route path="/dashboard/cabin-composites" element={<CabinCompositesDashboard />} />
          <Route path="/dashboard/soft-goods" element={<SoftGoodsDashboard />} />
          <Route path="/dashboard/water-waste-water" element={<WaterWasteWaterDashboard />} />
          <Route path="/dashboard/galley-market" element={<GalleyMarketDashboard />} />
          <Route path="/dashboard/psu-market" element={<PSUMarketDashboard />} />
          <Route path="/dashboard/lavatory-market" element={<LavatoryMarketDashboard />} />
          <Route path="/dashboard/ohsb-market" element={<OHSBMarketDashboard />} />
          <Route path="/dashboard/stowages-market" element={<StowagesMarketDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
