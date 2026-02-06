import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2, ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import BackgroundPattern from "@/components/BackgroundPattern";
import stratviewLogo from "@/assets/stratview-logo.png";
import stratviewLogoWhite from "@/assets/stratview-logo-white.png";

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
    password: "",
    confirmPassword: "",
  });
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { label: "One special character (!@#$%^&*)", test: (p: string) => /[!@#$%^&*]/.test(p) },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.test(formData.password));
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

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

  /**
   * BACKEND INTEGRATION POINT: User Registration
   * 
   * Replace the simulated delay with your actual registration API call.
   * Expected payload: {
   *   name: string,
   *   company: string,
   *   designation: string,
   *   phone: string,
   *   email: string,
   *   password: string,
   *   industries: string[]
   * }
   * 
   * Example integration:
   * const response = await fetch('/api/auth/register', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ ...formData, industries: selectedIndustries })
   * });
   * 
   * On success: redirect to login or auto-login user
   * On error: display validation errors to user
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (selectedIndustries.length === 0) {
      setError("Please select at least one industry of interest.");
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await authService.register({
      //   ...formData,
      //   industries: selectedIndustries
      // });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated delay
      
      console.log('Registration attempt:', { ...formData, industries: selectedIndustries });
      // TODO: Handle successful registration (redirect, show success message, etc.)
    } catch (error) {
      // TODO: Handle registration error (show validation errors, etc.)
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                src={stratviewLogoWhite} 
                alt="Stratview Research" 
                className="h-16 xl:h-20 w-auto"
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
          <div className="animate-fade-in-up mt-auto pt-12" style={{ animationDelay: "0.4s" }}>
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Create Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 bg-background border-border focus:border-secondary focus:ring-secondary/20 transition-all duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Password Rules */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {rule.test(formData.password) ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={rule.test(formData.password) ? "text-success" : "text-muted-foreground"}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="h-12 bg-background border-border focus:border-secondary focus:ring-secondary/20 transition-all duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  {passwordsMatch ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-success">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-destructive" />
                      <span className="text-destructive">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
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
