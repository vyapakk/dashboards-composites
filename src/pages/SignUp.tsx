import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import BackgroundPattern from "@/components/BackgroundPattern";
import stratviewLogo from "@/assets/stratview-logo.png";

const industries = [
  "Aerospace & Defense",
  "Composites",
  "Automotive & Transportation",
  "Building & Construction",
  "Chemical & Materials",
  "Consumer Goods & Services",
  "Disruptive Technology",
  "Electrical & Electronics",
  "Energy & Power",
  "Engineering",
  "Healthcare",
  "Information & Communications Technology",
  "Mining, Metals & Minerals",
  "Packaging",
];

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    designation: "",
    phone: "",
    email: "",
  });
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIndustries.length === 0) {
      setError("Please select at least one industry of interest.");
      return;
    }

    setIsLoading(true);
    // Simulate signup - replace with actual auth logic
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-1/2 relative">
        <BackgroundPattern />
        
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo and Main content grouped together */}
          <div className="space-y-8">
            {/* Logo */}
            <div className="animate-fade-in-up">
              <img 
                src={stratviewLogo} 
                alt="Stratview Research" 
                className="h-16 xl:h-20 w-auto brightness-0 invert"
              />
            </div>

            {/* Main content */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="space-y-4">
                <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground leading-tight">
                  Join
                  <span className="block text-stratview-mint">Stratview One</span>
                </h1>
                <p className="text-lg xl:text-xl text-primary-foreground/80 max-w-lg leading-relaxed">
                  Get access to comprehensive market research data, industry insights, 
                  and strategic intelligence tailored to your business needs.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Stratview Research. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 xl:w-1/2 flex flex-col justify-start px-6 sm:px-12 lg:px-16 xl:px-20 py-8 bg-background overflow-y-auto">
        <div className="w-full max-w-lg mx-auto space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img 
              src={stratviewLogo} 
              alt="Stratview Research" 
              className="h-14 w-auto"
            />
          </div>

          {/* Back Link */}
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl xl:text-3xl font-bold text-foreground">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Fill in your details to get started
            </p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="h-12 bg-background border-border focus:border-secondary focus:ring-secondary/20 transition-all duration-200"
                required
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-foreground">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Your Company Name"
                value={formData.company}
                onChange={handleInputChange}
                className="h-12 bg-background border-border focus:border-secondary focus:ring-secondary/20 transition-all duration-200"
                required
              />
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation" className="text-sm font-medium text-foreground">
                Designation
              </Label>
              <Input
                id="designation"
                name="designation"
                type="text"
                placeholder="e.g. Research Analyst"
                value={formData.designation}
                onChange={handleInputChange}
                className="h-12 bg-background border-border focus:border-secondary focus:ring-secondary/20 transition-all duration-200"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-12 bg-background border-border focus:border-secondary focus:ring-secondary/20 transition-all duration-200"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleInputChange}
                className="h-12 bg-background border-border focus:border-secondary focus:ring-secondary/20 transition-all duration-200"
                required
              />
            </div>

            {/* Industries */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Interested In <span className="text-muted-foreground font-normal">(select at least one)</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <div
                    key={industry}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={industry}
                      checked={selectedIndustries.includes(industry)}
                      onCheckedChange={() => handleIndustryToggle(industry)}
                      className="border-border data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                    <Label
                      htmlFor={industry}
                      className="text-sm font-normal text-foreground cursor-pointer leading-tight"
                    >
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary hover:opacity-90 text-primary-foreground font-semibold text-base transition-all duration-200 group"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/" className="font-medium text-secondary hover:text-stratview-mint transition-colors">
                Sign in
              </Link>
            </p>
          </form>

          {/* Help text */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-center text-muted-foreground">
              Need help?{" "}
              <a href="mailto:support@stratviewresearch.com" className="text-secondary hover:text-stratview-mint transition-colors font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
