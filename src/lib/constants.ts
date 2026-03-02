export const SITE_CONFIG = {
  name: "Tejas Naladala",
  title: "TejasOS",
  description: "Hardware engineer, AI builder, startup founder. Welcome to the OS.",
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

export const BOOT_CONFIG = {
  ramTarget: 16384,
  ramStepMs: 20,
  typeSpeedMs: { min: 30, max: 80 },
  phaseDelayMs: 500,
  skipKey: "sessionStorage",
  skipKeyName: "tejas-os-booted",
} as const;

export const WINDOW_CONFIG = {
  maxOpen: 4,
  defaultWidth: 700,
  defaultHeight: 500,
  minWidth: 320,
  minHeight: 200,
  titleBarHeight: 36,
} as const;
