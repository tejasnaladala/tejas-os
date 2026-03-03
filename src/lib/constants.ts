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
  worldWidth: 3200,
  worldHeight: 2400,
  rovSpeed: 350,
  rovBoostMultiplier: 2,
  rovFriction: 0.92,
  rovAcceleration: 900,
  dockRange: 120,
  spawnPosition: { x: 500, y: 250 },
} as const;

export const STATIONS: StationConfig[] = [
  { id: "research", label: "Research Lab", icon: "\uD83D\uDD2C", position: { x: 700, y: 400 }, description: "Pilot Profile & Bio" },
  { id: "salvage", label: "Salvage Yard", icon: "\uD83D\uDCE6", position: { x: 1500, y: 700 }, description: "Recovered Project Artifacts" },
  { id: "systems", label: "Systems Bay", icon: "\uD83D\uDD27", position: { x: 2400, y: 450 }, description: "ROV Subsystem Diagnostics" },
  { id: "arcade", label: "Arcade Rig", icon: "\uD83D\uDD79\uFE0F", position: { x: 2200, y: 1300 }, description: "Recreation Module" },
  { id: "gallery", label: "Gallery", icon: "\uD83C\uDFA5", position: { x: 1100, y: 1300 }, description: "Media Showcase" },
  { id: "comms", label: "Comms Array", icon: "\uD83D\uDCE1", position: { x: 500, y: 1000 }, description: "Transmission Hub" },
  { id: "trench", label: "The Trench", icon: "\uD83C\uDF0B", position: { x: 1500, y: 2000 }, description: "Classified Zone" },
];
