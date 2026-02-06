import { Layers, Plane, Car, Building2, MoreHorizontal } from "lucide-react";

export const categories = [
  {
    id: "composites",
    title: "Composites",
    icon: Layers,
    color: "teal" as const,
    description: "Advanced composite materials market research including carbon fiber, glass fiber, and polymer matrix composites.",
    datasets: [
      {
        id: "carbon-fiber",
        name: "Carbon Fiber Market",
        dashboards: [
          { id: "cf-global", name: "Global Carbon Fiber Market Overview" },
          { id: "cf-aerospace", name: "Aerospace Carbon Fiber Applications" },
          { id: "cf-automotive", name: "Automotive Carbon Fiber Trends" },
        ],
      },
      {
        id: "glass-fiber",
        name: "Glass Fiber Composites",
        dashboards: [
          { id: "gf-market", name: "Glass Fiber Market Analysis" },
          { id: "gf-construction", name: "Construction Applications" },
        ],
      },
      {
        id: "polymer-matrix",
        name: "Polymer Matrix Composites",
        dashboards: [
          { id: "pmc-overview", name: "PMC Market Overview" },
          { id: "pmc-industrial", name: "Industrial Applications" },
          { id: "pmc-forecast", name: "Market Forecast 2025-2030" },
        ],
      },
    ],
  },
  {
    id: "aerospace-defense",
    title: "Aerospace & Defense",
    icon: Plane,
    color: "navy" as const,
    description: "Comprehensive aerospace and defense market intelligence covering aircraft, satellites, defense systems, and more.",
    datasets: [
      {
        id: "aircraft-interiors",
        name: "Aircraft Interiors",
        dashboards: [
          { id: "ai-global", name: "Global Aircraft Interiors Market" },
          { id: "ai-bfe", name: "BFE Market Analysis" },
          { id: "ai-seating", name: "Aircraft Seating Trends" },
          { id: "ai-ifec", name: "In-Flight Entertainment & Connectivity" },
        ],
      },
      {
        id: "commercial-aircraft",
        name: "Commercial Aircraft",
        dashboards: [
          { id: "ca-fleet", name: "Global Fleet Analysis" },
          { id: "ca-deliveries", name: "Aircraft Deliveries Forecast" },
          { id: "ca-oem", name: "OEM Market Share" },
        ],
      },
      {
        id: "defense-systems",
        name: "Defense Systems",
        dashboards: [
          { id: "ds-spending", name: "Global Defense Spending" },
          { id: "ds-uav", name: "UAV/Drone Market" },
        ],
      },
    ],
  },
  {
    id: "automotive-transport",
    title: "Automotive & Transport",
    icon: Car,
    color: "mint" as const,
    description: "Automotive industry insights including electric vehicles, autonomous driving, and transportation trends.",
    datasets: [
      {
        id: "electric-vehicles",
        name: "Electric Vehicles",
        dashboards: [
          { id: "ev-global", name: "Global EV Market Overview" },
          { id: "ev-battery", name: "EV Battery Market" },
          { id: "ev-charging", name: "Charging Infrastructure" },
        ],
      },
      {
        id: "autonomous-driving",
        name: "Autonomous Driving",
        dashboards: [
          { id: "ad-tech", name: "AD Technology Landscape" },
          { id: "ad-sensors", name: "Sensor Market Analysis" },
        ],
      },
      {
        id: "lightweighting",
        name: "Automotive Lightweighting",
        dashboards: [
          { id: "lw-materials", name: "Lightweight Materials Market" },
          { id: "lw-trends", name: "OEM Lightweighting Strategies" },
        ],
      },
    ],
  },
  {
    id: "building-construction",
    title: "Building & Construction",
    icon: Building2,
    color: "teal-dark" as const,
    description: "Construction industry market research covering materials, infrastructure, and building technologies.",
    datasets: [
      {
        id: "construction-composites",
        name: "Construction Composites",
        dashboards: [
          { id: "cc-rebar", name: "Composite Rebar Market" },
          { id: "cc-panels", name: "FRP Panels Analysis" },
        ],
      },
      {
        id: "smart-buildings",
        name: "Smart Buildings",
        dashboards: [
          { id: "sb-market", name: "Smart Building Market" },
          { id: "sb-hvac", name: "Smart HVAC Systems" },
          { id: "sb-lighting", name: "Smart Lighting Solutions" },
        ],
      },
    ],
  },
  {
    id: "others",
    title: "Others",
    icon: MoreHorizontal,
    color: "teal" as const,
    description: "Additional market research datasets covering emerging industries and specialized sectors.",
    datasets: [
      {
        id: "wind-energy",
        name: "Wind Energy",
        dashboards: [
          { id: "we-turbines", name: "Wind Turbine Market" },
          { id: "we-blades", name: "Blade Materials Analysis" },
        ],
      },
      {
        id: "marine",
        name: "Marine & Offshore",
        dashboards: [
          { id: "mo-vessels", name: "Marine Vessels Market" },
          { id: "mo-composites", name: "Marine Composites" },
        ],
      },
      {
        id: "sports-leisure",
        name: "Sports & Leisure",
        dashboards: [
          { id: "sl-equipment", name: "Sports Equipment Market" },
        ],
      },
    ],
  },
];
