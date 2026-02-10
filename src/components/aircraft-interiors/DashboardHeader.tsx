import { motion } from "framer-motion";
import stratviewLogoWhite from "@/assets/stratview-logo-white.png";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AircraftInteriorsDashboardHeader({
  title = "Aircraft Cabin Interior Composites Market",
  subtitle = "Global Market Research Dashboard • 2016-2034",
}: DashboardHeaderProps) {
  return <motion.header initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

      <div className="container relative mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start md:items-center gap-3 md:gap-4">
            <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            type: "spring",
            stiffness: 200,
            delay: 0.2
          }} className="shrink-0">
              <img src={stratviewLogoWhite} alt="Stratview Research" className="h-12 md:h-20 w-auto object-contain" />
            </motion.div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground break-words">
                {title}
              </h1>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                {subtitle}
              </p>
            </div>
          </div>

          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.3
        }} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2 border border-border">
            <div className="h-2 w-2 rounded-full bg-chart-4 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Data updated: Q1 2026
            </span>
          </motion.div>
        </div>
      </div>
    </motion.header>;
}