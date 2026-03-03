import { StationConfig } from "@/types";

export const SITE_CONFIG = {
  name: "Tejas Naladala",
  title: "Deep Sea Portfolio",
  description: "Hardware engineer, AI builder, startup founder. Pilot an ROV through the deep sea to explore my work.",
  domain: "tejasnaladala.com",
  url: "https://tejasnaladala.com",
  email: "tejas.naladala@gmail.com",
  social: {
    github: "https://github.com/tejasnaladala",
    linkedin: "https://linkedin.com/in/tejasnaladala",
    instagram: "https://instagram.com/simplytejxs",
  },
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

export const OCEAN_CONFIG = {
  worldWidth: 5000,
  worldHeight: 3500,
  rovSpeed: 200,
  rovBoostMultiplier: 2,
  rovFriction: 0.92,
  rovAcceleration: 600,
  dockRange: 100,
  spawnPosition: { x: 800, y: 300 },
} as const;

export const STATIONS: StationConfig[] = [
  { id: "research", label: "Research Lab", icon: "\uD83D\uDD2C", position: { x: 1200, y: 500 }, description: "Pilot Profile & Bio" },
  { id: "salvage", label: "Salvage Yard", icon: "\uD83D\uDCE6", position: { x: 2800, y: 1200 }, description: "Recovered Project Artifacts" },
  { id: "systems", label: "Systems Bay", icon: "\uD83D\uDD27", position: { x: 4000, y: 700 }, description: "ROV Subsystem Diagnostics" },
  { id: "arcade", label: "Arcade Rig", icon: "\uD83D\uDD79\uFE0F", position: { x: 3500, y: 2100 }, description: "Recreation Module" },
  { id: "comms", label: "Comms Array", icon: "\uD83D\uDCE1", position: { x: 900, y: 2600 }, description: "Transmission Hub" },
  { id: "trench", label: "The Trench", icon: "\uD83C\uDF0B", position: { x: 2500, y: 3200 }, description: "Classified Zone" },
];
