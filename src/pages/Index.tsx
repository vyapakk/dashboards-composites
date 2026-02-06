import LoginForm from "@/components/LoginForm";
import BackgroundPattern from "@/components/BackgroundPattern";
import stratviewLogo from "@/assets/stratview-logo.png";
import stratviewLogoWhite from "@/assets/stratview-logo-white.png";
import { BarChart3, Globe2, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const features = [
    { icon: BarChart3, text: "Interactive Market Data" },
    { icon: Globe2, text: "Global Industry Coverage" },
    { icon: TrendingUp, text: "Real-time Insights" },
    { icon: Shield, text: "Enterprise Security" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <BackgroundPattern />
        
        <div className="relative z-10 flex flex-col justify-between p-6 lg:p-8 xl:p-12 w-full">
          {/* Logo and Main content grouped together */}
          <div className="space-y-5 xl:space-y-6">
            {/* Logo */}
            <div className="animate-fade-in-up">
              <img 
                src={stratviewLogoWhite} 
                alt="Stratview Research" 
                className="h-10 xl:h-12 w-auto"
              />
            </div>

            {/* Main content */}
            <div className="space-y-4 xl:space-y-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-2">
              <h1 className="text-xl xl:text-2xl font-bold text-primary-foreground leading-tight">
                Welcome to
                <span className="block text-stratview-mint">Stratview One</span>
              </h1>
              <p className="text-xs xl:text-sm text-primary-foreground/80 max-w-md leading-relaxed">
                Your unified platform for accessing comprehensive market research data, 
                industry insights, and strategic intelligence.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 xl:gap-2.5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 xl:p-2.5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="p-1 rounded-md bg-stratview-mint/20">
                    <feature.icon className="h-3.5 w-3.5 text-stratview-mint" />
                  </div>
                  <span className="text-[11px] xl:text-xs font-medium text-primary-foreground/90">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          </div>

          {/* Footer */}
          <div className="animate-fade-in-up mt-auto pt-8" style={{ animationDelay: "0.6s" }}>
            <p className="text-xs text-primary-foreground/60">
              © {new Date().getFullYear()} Stratview Research. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col bg-background">
        {/* Mobile/Tablet Hero Section - Constrained to ~50% viewport height */}
        <div className="lg:hidden relative overflow-hidden max-h-[50vh]">
          <BackgroundPattern />
          <div className="relative z-10 px-6 py-6 sm:py-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src={stratviewLogoWhite} 
                alt="Stratview Research" 
                className="h-14 sm:h-16 md:h-20 w-auto"
              />
            </div>
            
            {/* Heading */}
            <div className="text-center space-y-2 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground leading-tight">
                Welcome to
                <span className="text-stratview-mint"> Stratview One</span>
              </h1>
              <p className="text-xs sm:text-sm text-primary-foreground/80 max-w-sm mx-auto">
                Your unified platform for market research data and strategic intelligence.
              </p>
            </div>

            {/* Features - Compact horizontal layout */}
            <div className="flex gap-2 justify-center flex-wrap">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/10"
                >
                  <feature.icon className="h-3.5 w-3.5 text-stratview-mint" />
                  <span className="text-xs font-medium text-primary-foreground/90 whitespace-nowrap">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-6 lg:py-0">
        <div className="w-full max-w-sm mx-auto space-y-6">

          {/* Header */}
          <div className="space-y-1.5 text-center lg:text-left">
            <h2 className="text-xl xl:text-2xl font-bold text-foreground">
              Sign in to your account
            </h2>
            <p className="text-sm text-muted-foreground">
              Access your market research dashboard
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Help text */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Need help?{" "}
              <a href="mailto:support@stratviewresearch.com" className="text-secondary hover:text-stratview-mint transition-colors font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
