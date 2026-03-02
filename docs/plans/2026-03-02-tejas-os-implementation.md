# TejasOS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready OS-style personal portfolio website for tejasnaladala.com that boots like a retro BIOS, runs as a desktop environment with draggable windows, includes arcade games, easter eggs, and a recruiter escape hatch.

**Architecture:** Next.js 15 App Router with Zustand for window/boot/settings state, Framer Motion for animations, pure Canvas API for lazy-loaded games, Howler.js for audio sprites. Single-page app where all navigation happens via opening/closing windows on a simulated desktop. Separate /resume route for recruiter-friendly clean view.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Zustand, Howler.js, HTML5 Canvas, Vercel

**Design Doc:** `docs/plans/2026-03-02-tejas-os-design.md` — contains all colors, content, specifications.

---

## Phase 1: Project Scaffolding & Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Step 1: Scaffold Next.js 15 with TypeScript + Tailwind**

Run:
```bash
cd C:/Users/tejas/OneDrive/Desktop/tejas-os
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select: Yes to all defaults. App Router, src/ directory, import alias @/*.

**Step 2: Install dependencies**

Run:
```bash
npm install zustand framer-motion howler
npm install -D @types/howler
```

**Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Server runs on localhost:3000 with default Next.js page.

**Step 4: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 15 project with TypeScript, Tailwind, Zustand, Framer Motion"
```

---

### Task 2: Configure Design Tokens & Global Styles

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Create: `src/lib/constants.ts`

**Step 1: Write globals.css with CSS custom properties and CRT effects**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bg-primary: #0a0a0f;
  --bg-surface: #12121a;
  --bg-elevated: #1a1a2e;
  --border: #2a2a3e;
  --text-primary: #e0e0e8;
  --text-secondary: #8888a0;
  --accent-green: #00ff41;
  --accent-amber: #ffb000;
  --accent-cyan: #00d4ff;
  --accent-red: #ff0040;
  --glow-green: rgba(0, 255, 65, 0.2);
  --glow-amber: rgba(255, 176, 0, 0.2);
  --font-mono: "JetBrains Mono", monospace;
  --font-pixel: "Press Start 2P", monospace;
  --font-sans: "Inter", system-ui, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  overflow: hidden;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-mono);
}

/* Selection styling */
::selection {
  background: var(--accent-green);
  color: var(--bg-primary);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border: 2px solid var(--bg-surface);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* CRT Scanline overlay - applied via component */
.crt-scanlines::after {
  content: "";
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(0, 0, 0, 0.04) 1px,
    rgba(0, 0, 0, 0.04) 2px
  );
  pointer-events: none;
  z-index: 9999;
}

/* CRT Vignette */
.crt-vignette::before {
  content: "";
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
  z-index: 9998;
}

/* Phosphor glow for terminal text */
.glow-green {
  text-shadow: 0 0 8px var(--glow-green), 0 0 16px var(--glow-green);
}

.glow-amber {
  text-shadow: 0 0 8px var(--glow-amber), 0 0 16px var(--glow-amber);
}

/* CRT power-on animation */
@keyframes crt-power-on {
  0% {
    clip-path: inset(50% 0 50% 0);
    opacity: 1;
  }
  50% {
    clip-path: inset(2% 0 2% 0);
    opacity: 1;
  }
  100% {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}

.crt-power-on {
  animation: crt-power-on 0.4s ease-out forwards;
}

/* CRT flicker */
@keyframes crt-flicker {
  0% { opacity: 1; }
  50% { opacity: 0.95; }
  100% { opacity: 1; }
}

.crt-flicker {
  animation: crt-flicker 0.15s ease-in-out;
}

/* Typing cursor blink */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor-blink {
  animation: blink-cursor 1s step-end infinite;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .crt-power-on,
  .crt-flicker,
  .cursor-blink {
    animation: none;
  }
  .crt-scanlines::after,
  .crt-vignette::before {
    display: none;
  }
}
```

**Step 2: Update tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
        },
        border: "var(--border)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        accent: {
          green: "var(--accent-green)",
          amber: "var(--accent-amber)",
          cyan: "var(--accent-cyan)",
          red: "var(--accent-red)",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)"],
        pixel: ["var(--font-pixel)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 3: Create constants file**

Write `src/lib/constants.ts`:

```ts
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
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: configure design tokens, CRT effects, Tailwind theme"
```

---

### Task 3: Set Up Fonts

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Configure Google Fonts in layout.tsx**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.title} — ${SITE_CONFIG.name}`,
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: `${SITE_CONFIG.title} — ${SITE_CONFIG.name}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.title,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.title} — ${SITE_CONFIG.name}`,
    description: SITE_CONFIG.description,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: configure JetBrains Mono and Inter fonts"
```

---

### Task 4: Create TypeScript Types

**Files:**
- Create: `src/types/index.ts`

**Step 1: Write shared types**

```ts
export type WindowId =
  | "projects"
  | "resume"
  | "system-info"
  | "skills"
  | "arcade"
  | "project-detail"
  | "terminal"
  | "achievements"
  | "timeline"
  | "classified";

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  meta?: Record<string, unknown>;
}

export interface DesktopIconConfig {
  id: WindowId | "mail";
  label: string;
  icon: string;
  action: "window" | "mailto";
}

export type BootPhase = "idle" | "power-on" | "bios-post" | "loading-desktop" | "ready";

export interface Project {
  id: string;
  filename: string;
  extension: string;
  title: string;
  role: string;
  date: string;
  description: string;
  metrics: string[];
  tech: string[];
  links?: { label: string; url: string }[];
}

export interface Skill {
  name: string;
  level: "Expert" | "Advanced" | "Proficient" | "Capable";
  barFill: number; // 0-12 for the ASCII bar
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  type: "venture" | "research" | "education" | "project";
}

export interface TerminalCommand {
  command: string;
  description: string;
  execute: () => string;
}

export type WallpaperOption = "default" | "circuit" | "matrix";
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add shared TypeScript types"
```

---

### Task 5: Create Data Files

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/data/skills.ts`
- Create: `src/data/timeline.ts`
- Create: `src/data/achievements.ts`
- Create: `src/data/bio.ts`
- Create: `src/data/terminalCommands.ts`

**Step 1: Write projects.ts**

```ts
import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "plasmafx",
    filename: "PlasmaX",
    extension: "sys",
    title: "PlasmaX",
    role: "Founder & CEO",
    date: "May 2023 – Present",
    description:
      "Engineered the first industrial-scale continuous plasma-activated water disinfection system for post-harvest produce processing, replacing chlorine sanitation with a chemical-free process.",
    metrics: [
      "$2M seed round at $8M post-money valuation",
      "Sold first production unit ($180K) to CSIR-CFTRI India",
      "10 contracted revenue-generating system deployments",
      "Patent filed on venturi-plasma integration architecture",
      "3 peer-reviewed publications",
      "2.5 log₁₀ microbial reduction at 1.86 kW, $0.47/ton operating cost",
    ],
    tech: [
      "Plasma Physics",
      "High-Voltage Electronics",
      "Fusion360 CAD",
      "CNC/VMC Machining",
      "Injection Molding",
    ],
    links: [
      { label: "DOI: 10.1088/1361-6463/ad77de", url: "https://doi.org/10.1088/1361-6463/ad77de" },
    ],
  },
  {
    id: "cerulean",
    filename: "CeruleanROV",
    extension: "hw",
    title: "Cerulean Robotics",
    role: "Founder & Sole Engineer",
    date: "Nov 2025 – Present",
    description:
      "Architecting open-source underwater ROV platform ($2–5K) with modular sensor payload system, targeting 80–100m depth rating as accessible alternative to $10–50K commercial systems.",
    metrics: [
      "Vectored 5-thruster configuration (Pixhawk/ArduSub)",
      "Raspberry Pi 5 HD vision pipeline",
      "Custom MOSFET power distribution for 6S Li-ion",
      "$2,000 Buerk Center prototype funding secured",
      "Targeting $3.5B AUV/ROV market",
    ],
    tech: [
      "Pixhawk/ArduSub",
      "Raspberry Pi 5",
      "MOSFET Power Electronics",
      "KiCad PCB",
      "CAD/Waterproofing",
    ],
  },
  {
    id: "atticus",
    filename: "AtticusAI",
    extension: "exe",
    title: "Atticus AI",
    role: "Founder & Technical Lead",
    date: "Jan 2026 – Present",
    description:
      "Built AI-powered B2B SaaS platform that audits commercial insurance policies for SMBs, parsing PDFs through a proprietary 4-stage extraction pipeline.",
    metrics: [
      "Identifies coverage gaps, exclusions, and premium inefficiencies",
      "Multi-model AI orchestration with Protection Score™",
      "Plain-English audit reports with broker negotiation strategies",
      "Processes policies in under 60 seconds",
      "Targeting $294.6B U.S. commercial insurance market",
    ],
    tech: ["Next.js 14", "Multi-Model AI", "PDF Document AI", "RAG Pipeline", "TypeScript"],
  },
  {
    id: "forge",
    filename: "Forge",
    extension: "pkg",
    title: "Forge — Open-Source AI Agent Runtime",
    role: "Creator",
    date: "Feb 2026",
    description:
      "Provider-agnostic AI agent orchestration framework enabling declarative YAML agent definitions with automatic routing across 8 LLM providers.",
    metrics: [
      "4,400+ lines of code (Python/TypeScript)",
      "8 LLM providers (OpenAI, Anthropic, Google, Ollama, DeepSeek, Groq, Together AI, vLLM)",
      "150+ unique clones in first week",
      "Multi-agent orchestration (sequential, parallel, supervisor)",
      "FastAPI + WebSocket observability with Next.js dashboard",
    ],
    tech: [
      "Python",
      "TypeScript",
      "LiteLLM",
      "ChromaDB",
      "SQLite",
      "FastAPI",
      "WebSocket",
      "Next.js",
    ],
    links: [{ label: "GitHub", url: "https://github.com/tejasnaladala" }],
  },
  {
    id: "seal-lab",
    filename: "SEAL_Lab",
    extension: "log",
    title: "SEAL Lab — University of Washington",
    role: "Research Associate",
    date: "Mar – Nov 2025",
    description:
      "Designed embedded sensing architectures for 2 research grant proposals under Prof. Alex Mamishev.",
    metrics: [
      "PPG-based drowsiness detection wearable for real-time physiological monitoring",
      "Non-intrusive breakage-detection sensor for U.S. Navy hull integrity",
      "Authored grant sections and technical abstracts across 7-person team",
      "Literature analysis of 40+ papers on photoplethysmography signal processing",
    ],
    tech: [
      "Embedded Systems",
      "PPG Signal Processing",
      "Anomaly Detection",
      "Grant Writing",
      "STM32",
    ],
  },
  {
    id: "niist",
    filename: "NIIST_Solar",
    extension: "dat",
    title: "NIIST (CSIR) India — Solar Cell Research",
    role: "Research Intern",
    date: "Jun 2024 – Mar 2025",
    description:
      "Fabricated and optimized dye-sensitized and perovskite solar cells under Dr. Suraj Soman (world-record DSC efficiency group).",
    metrics: [
      "Engineered ruthenium-TiO₂ photoanode interfaces",
      "Characterized 20+ device architectures",
      "Used Dyenamo Toolbox, PIA spectroscopy, IPCE, XRD",
      "Validated photovoltaic performance metrics",
    ],
    tech: [
      "Perovskite Solar Cells",
      "Dye-Sensitized Solar Cells",
      "PIA Spectroscopy",
      "XRD",
      "Cleanroom Fabrication",
    ],
  },
];
```

**Step 2: Write skills.ts**

```ts
import { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages & Frameworks",
    icon: "code",
    skills: [
      { name: "Python", level: "Expert", barFill: 12 },
      { name: "TypeScript/JS", level: "Expert", barFill: 12 },
      { name: "C/C++", level: "Advanced", barFill: 10 },
      { name: "Java", level: "Proficient", barFill: 8 },
      { name: "SQL", level: "Proficient", barFill: 8 },
      { name: "MATLAB/Simulink", level: "Capable", barFill: 6 },
      { name: "Next.js / React", level: "Expert", barFill: 12 },
      { name: "FastAPI / Node.js", level: "Advanced", barFill: 10 },
    ],
  },
  {
    name: "Embedded & Hardware",
    icon: "cpu",
    skills: [
      { name: "Circuit Design (Analog/Digital)", level: "Expert", barFill: 12 },
      { name: "PCB Design (KiCad)", level: "Advanced", barFill: 10 },
      { name: "STM32 / Arduino / RPi", level: "Expert", barFill: 12 },
      { name: "Pixhawk / ArduSub", level: "Advanced", barFill: 10 },
      { name: "MOSFET Power Electronics", level: "Advanced", barFill: 10 },
      { name: "Oscilloscope / Logic Analyzer", level: "Advanced", barFill: 10 },
    ],
  },
  {
    name: "AI & Machine Learning",
    icon: "brain",
    skills: [
      { name: "LLM Orchestration", level: "Expert", barFill: 12 },
      { name: "Multi-Agent Systems", level: "Expert", barFill: 12 },
      { name: "RAG Pipelines", level: "Advanced", barFill: 10 },
      { name: "TensorFlow / OpenCV", level: "Proficient", barFill: 8 },
      { name: "Document AI / PDF Parsing", level: "Advanced", barFill: 10 },
    ],
  },
  {
    name: "Design & Fabrication",
    icon: "wrench",
    skills: [
      { name: "Fusion360 / SolidWorks / Rhino", level: "Expert", barFill: 12 },
      { name: "3D Printing", level: "Advanced", barFill: 10 },
      { name: "CNC / Lathe / Laser Cutting", level: "Advanced", barFill: 10 },
      { name: "Soldering", level: "Expert", barFill: 12 },
    ],
  },
  {
    name: "DevOps & Tools",
    icon: "terminal",
    skills: [
      { name: "Git / GitHub", level: "Expert", barFill: 12 },
      { name: "Docker", level: "Advanced", barFill: 10 },
      { name: "Linux", level: "Advanced", barFill: 10 },
      { name: "ROS / Gazebo", level: "Proficient", barFill: 8 },
    ],
  },
];
```

**Step 3: Write timeline.ts**

```ts
import { TimelineEntry } from "@/types";

export const timeline: TimelineEntry[] = [
  {
    date: "2026.02",
    title: "Forge — Open-Source AI Agent Runtime",
    description: "Shipped provider-agnostic agent orchestration framework. 150+ clones in week 1.",
    type: "project",
  },
  {
    date: "2026.01",
    title: "Atticus AI — Founded",
    description: "Built AI-powered insurance policy auditor targeting $294.6B market.",
    type: "venture",
  },
  {
    date: "2025.11",
    title: "Cerulean Robotics — Founded",
    description: "Designing open-source underwater ROV for 80-100m depth operations.",
    type: "venture",
  },
  {
    date: "2025.03",
    title: "SEAL Lab — Research Associate",
    description: "Embedded sensing architectures for wearable drowsiness detection and Navy hull integrity.",
    type: "research",
  },
  {
    date: "2024.09",
    title: "University of Washington — Started",
    description: "B.S. Electrical & Computer Engineering + Applied Mathematics. Lavin Fellow.",
    type: "education",
  },
  {
    date: "2024.06",
    title: "NIIST India — Research Intern",
    description: "Dye-sensitized and perovskite solar cell fabrication under world-record DSC group.",
    type: "research",
  },
  {
    date: "2023.05",
    title: "PlasmaX — Founded",
    description: "Started building industrial plasma water disinfection technology. Now at $8M valuation.",
    type: "venture",
  },
];
```

**Step 4: Write achievements.ts**

```ts
import { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    title: "$2M Raised",
    description: "Seed round at $8M post-money valuation",
    icon: "💰",
    unlocked: true,
  },
  {
    title: "3 Publications",
    description: "J. Phys. D + Innov. Food Sci. & Emerg. Tech.",
    icon: "📄",
    unlocked: true,
  },
  {
    title: "Grand Prize Winner",
    description: "UW S&T Showcase + Best Pitch Award",
    icon: "🏆",
    unlocked: true,
  },
  {
    title: "Patent Filed",
    description: "Venturi-plasma integration architecture",
    icon: "📜",
    unlocked: true,
  },
  {
    title: "Lavin Fellow",
    description: "1 of ~20 selected annually at UW",
    icon: "⭐",
    unlocked: true,
  },
  {
    title: "150+ Clones",
    description: "Forge framework adoption in week 1",
    icon: "🔥",
    unlocked: true,
  },
  {
    title: "3.93 GPA",
    description: "ECE + Applied Math double major",
    icon: "📊",
    unlocked: true,
  },
  {
    title: "Trilingual",
    description: "English, Hindi, Telugu + beginner Mandarin",
    icon: "🌐",
    unlocked: true,
  },
];
```

**Step 5: Write bio.ts**

```ts
export const bio = {
  tagline: "Hardware engineer who builds plasma reactors and underwater robots by day, ships AI agents by night.",
  full: "Founded 3 ventures, closed a $2M seed round, and published 3 papers — all before graduating. Currently running PlasmaX ($8M valuation), building an open-source ROV, and shipping an AI insurance auditor. Lavin Entrepreneurship Fellow at UW.",
  systemInfo: {
    os: "TejasOS v1.0",
    build: "Founder Edition",
    user: "Tejas Naladala",
    location: "Seattle, WA",
    processor: "UW ECE + Applied Math (Double Major, 3.93 GPA)",
    status: "Lavin Entrepreneurship Fellow",
    uptime: "Since May 2023",
    activeProcesses: [
      "PlasmaX (Founder & CEO)",
      "Cerulean Robotics (Founder)",
      "Atticus AI (Founder & Technical Lead)",
      "UW Class of 2028",
    ],
    languages: "English, Hindi, Telugu | Beginner Mandarin",
  },
};
```

**Step 6: Write terminalCommands.ts**

```ts
import { bio } from "./bio";
import { projects } from "./projects";

export const TERMINAL_COMMANDS: Record<string, { description: string; execute: () => string }> = {
  help: {
    description: "List available commands",
    execute: () => {
      const cmds = Object.entries(TERMINAL_COMMANDS)
        .map(([cmd, { description }]) => `  ${cmd.padEnd(20)} ${description}`)
        .join("\n");
      return `Available commands:\n${cmds}`;
    },
  },
  whoami: {
    description: "Display current user",
    execute: () => "tejas — founder, engineer, builder of things",
  },
  ls: {
    description: "List directory contents",
    execute: () =>
      [
        "PlasmaX.sys",
        "CeruleanROV.hw",
        "AtticusAI.exe",
        "Forge.pkg",
        "SEAL_Lab.log",
        "NIIST_Solar.dat",
        "resume.pdf",
        "README.md",
      ].join("  "),
  },
  pwd: {
    description: "Print working directory",
    execute: () => "/home/tejas/portfolio",
  },
  neofetch: {
    description: "Display system information",
    execute: () => `
  ████████╗███████╗     OS:        ${bio.systemInfo.os}
  ╚══██╔══╝██╔════╝     Build:     ${bio.systemInfo.build}
     ██║   █████╗       User:      ${bio.systemInfo.user}
     ██║   ██╔══╝       Location:  ${bio.systemInfo.location}
     ██║   ███████╗     Processor: UW ECE + Applied Math
     ╚═╝   ╚══════╝     GPA:       3.93/4.0
                         Uptime:    ${bio.systemInfo.uptime}
  tejas@portfolio        Shell:     TejasOS Terminal v1.0
                         Ventures:  3 active
                         Papers:    3 published`,
  },
  "cat resume.txt": {
    description: "Display resume summary",
    execute: () =>
      `${bio.tagline}\n\n${bio.full}\n\nRun 'ls' to see projects or 'cat projects/<name>' for details.`,
  },
  clear: {
    description: "Clear terminal",
    execute: () => "__CLEAR__",
  },
  "sudo rm -rf /": {
    description: "Nice try",
    execute: () => "Nice try. Permission denied. Also, this is a website.",
  },
  date: {
    description: "Display current date",
    execute: () => new Date().toString(),
  },
  uname: {
    description: "Display system name",
    execute: () => "TejasOS 1.0.0 Founder-Edition x86_64",
  },
  echo: {
    description: "Echo text",
    execute: () => "Usage: echo <text>",
  },
  exit: {
    description: "Close terminal",
    execute: () => "__EXIT__",
  },
};

// Dynamic cat commands for each project
projects.forEach((p) => {
  TERMINAL_COMMANDS[`cat projects/${p.filename.toLowerCase()}.${p.extension}`] = {
    description: `View ${p.title} details`,
    execute: () =>
      `=== ${p.title} ===\nRole: ${p.role}\nDate: ${p.date}\n\n${p.description}\n\nKey Metrics:\n${p.metrics.map((m) => `  • ${m}`).join("\n")}\n\nTech: ${p.tech.join(", ")}`,
  };
});
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add all data files — projects, skills, timeline, achievements, bio, terminal"
```

---

### Task 6: Create Zustand Stores

**Files:**
- Create: `src/stores/bootStore.ts`
- Create: `src/stores/windowStore.ts`
- Create: `src/stores/settingsStore.ts`
- Create: `src/stores/easterEggStore.ts`

**Step 1: Write bootStore.ts**

```ts
import { create } from "zustand";
import { BootPhase } from "@/types";

interface BootState {
  phase: BootPhase;
  setPhase: (phase: BootPhase) => void;
  skipBoot: () => void;
  hasBooted: () => boolean;
}

export const useBootStore = create<BootState>((set) => ({
  phase: "idle",
  setPhase: (phase) => set({ phase }),
  skipBoot: () => set({ phase: "ready" }),
  hasBooted: () => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("tejas-os-booted") === "true";
  },
}));
```

**Step 2: Write windowStore.ts**

```ts
import { create } from "zustand";
import { WindowId, WindowState } from "@/types";
import { WINDOW_CONFIG } from "@/lib/constants";

interface WindowStore {
  windows: WindowState[];
  activeWindowId: WindowId | null;
  nextZIndex: number;

  openWindow: (id: WindowId, meta?: Record<string, unknown>) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, position: { x: number; y: number }) => void;
  updateSize: (id: WindowId, size: { width: number; height: number }) => void;
  getWindow: (id: WindowId) => WindowState | undefined;
}

const WINDOW_TITLES: Record<WindowId, string> = {
  projects: "Projects",
  resume: "Resume.exe",
  "system-info": "System Properties",
  skills: "Device Manager — Skills",
  arcade: "Arcade",
  "project-detail": "Project Details",
  terminal: "Terminal",
  achievements: "Achievements",
  timeline: "Event Log",
  classified: "CLASSIFIED",
};

function getDefaultPosition(index: number): { x: number; y: number } {
  const offset = index * 30;
  return {
    x: 100 + offset,
    y: 60 + offset,
  };
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 10,

  openWindow: (id, meta) => {
    const { windows, nextZIndex } = get();
    const existing = windows.find((w) => w.id === id);

    if (existing) {
      // If already open, just focus it
      if (existing.isMinimized) {
        set({
          windows: windows.map((w) =>
            w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
          ),
          activeWindowId: id,
          nextZIndex: nextZIndex + 1,
        });
      } else {
        get().focusWindow(id);
      }
      return;
    }

    // Check max open windows
    const openCount = windows.filter((w) => w.isOpen).length;
    if (openCount >= WINDOW_CONFIG.maxOpen) {
      // Close the oldest non-active window
      const oldest = windows.find((w) => w.isOpen && w.id !== get().activeWindowId);
      if (oldest) {
        set({ windows: windows.filter((w) => w.id !== oldest.id) });
      }
    }

    const newWindow: WindowState = {
      id,
      title: WINDOW_TITLES[id] || id,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: getDefaultPosition(windows.length),
      size: { width: WINDOW_CONFIG.defaultWidth, height: WINDOW_CONFIG.defaultHeight },
      zIndex: nextZIndex,
      meta,
    };

    set({
      windows: [...get().windows, newWindow],
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    });
  },

  closeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const remaining = windows.filter((w) => w.id !== id);
    set({
      windows: remaining,
      activeWindowId: activeWindowId === id
        ? (remaining.length > 0 ? remaining[remaining.length - 1].id : null)
        : activeWindowId,
    });
  },

  minimizeWindow: (id) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId:
        get().activeWindowId === id
          ? null
          : get().activeWindowId,
    });
  },

  maximizeWindow: (id) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    });
  },

  restoreWindow: (id) => {
    const { nextZIndex } = get();
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    });
  },

  focusWindow: (id) => {
    const { nextZIndex } = get();
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    });
  },

  updatePosition: (id, position) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    });
  },

  updateSize: (id, size) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    });
  },

  getWindow: (id) => get().windows.find((w) => w.id === id),
}));
```

**Step 3: Write settingsStore.ts**

```ts
import { create } from "zustand";
import { WallpaperOption } from "@/types";

interface SettingsState {
  soundEnabled: boolean;
  wallpaper: WallpaperOption;
  toggleSound: () => void;
  setWallpaper: (wp: WallpaperOption) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  soundEnabled: false, // default muted
  wallpaper: "default",
  toggleSound: () =>
    set((s) => {
      const next = !s.soundEnabled;
      if (typeof window !== "undefined") {
        localStorage.setItem("tejas-os-sound", String(next));
      }
      return { soundEnabled: next };
    }),
  setWallpaper: (wallpaper) => set({ wallpaper }),
}));
```

**Step 4: Write easterEggStore.ts**

```ts
import { create } from "zustand";

interface EasterEggState {
  founderModeActive: boolean;
  schematicRevealed: boolean;
  konamiProgress: number[];
  activateFounderMode: () => void;
  revealSchematic: () => void;
  resetKonami: () => void;
  setKonamiProgress: (keys: number[]) => void;
}

export const useEasterEggStore = create<EasterEggState>((set) => ({
  founderModeActive: false,
  schematicRevealed: false,
  konamiProgress: [],
  activateFounderMode: () => set({ founderModeActive: true }),
  revealSchematic: () => set({ schematicRevealed: true }),
  resetKonami: () => set({ konamiProgress: [] }),
  setKonamiProgress: (keys) => set({ konamiProgress: keys }),
}));
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Zustand stores — boot, window, settings, easter eggs"
```

---

## Phase 2: Boot Sequence

### Task 7: Build CRT Power-On Effect

**Files:**
- Create: `src/components/boot/CrtPowerOn.tsx`

**Step 1: Write CRT power-on component**

This renders a horizontal white line that expands to fill the screen, simulating a CRT monitor turning on.

```tsx
"use client";

import { motion } from "framer-motion";

interface CrtPowerOnProps {
  onComplete: () => void;
}

export default function CrtPowerOn({ onComplete }: CrtPowerOnProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <motion.div
        className="bg-white w-full"
        initial={{ height: 2, opacity: 1 }}
        animate={{ height: "100vh", opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add CRT power-on effect component"
```

---

### Task 8: Build BIOS POST Screen

**Files:**
- Create: `src/components/boot/BiosPost.tsx`

**Step 1: Write BIOS POST typewriter component**

This is the core boot animation — green text typing line by line on black background.

```tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface BiosPostProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "TejasOS BIOS v1.0.28", delay: 300, speed: 20 },
  { text: "Copyright (c) 2026 Tejas Naladala. All rights reserved.", delay: 200, speed: 15 },
  { text: "", delay: 300, speed: 0 },
  { text: "CHECKING_RAM", delay: 100, speed: 0 },
  { text: "Loading Embedded Systems Modules............ OK", delay: 100, speed: 40 },
  { text: "Loading AI Agents........................... OK", delay: 100, speed: 40 },
  { text: "Loading Founder Mode........................ OK", delay: 100, speed: 40 },
  { text: "Initializing PlasmaX Reactor................ OK", delay: 100, speed: 40 },
  { text: "Calibrating Underwater ROV.................. OK", delay: 100, speed: 40 },
  { text: "", delay: 200, speed: 0 },
  { text: "All systems nominal.", delay: 300, speed: 30 },
  { text: "", delay: 200, speed: 0 },
  { text: "Press any key to continue or wait for auto-boot...", delay: 0, speed: 25 },
];

export default function BiosPost({ onComplete }: BiosPostProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [ramValue, setRamValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const skippedRef = useRef(false);

  const RAM_TARGET = 16384;

  // Skip on any keypress or click
  const handleSkip = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    setIsComplete(true);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);
    return () => {
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, [handleSkip]);

  // RAM counter animation
  useEffect(() => {
    if (currentLineIndex !== 3) return; // CHECKING_RAM line index
    if (ramValue >= RAM_TARGET) {
      setCurrentLineIndex(4);
      setCurrentCharIndex(0);
      return;
    }
    const timer = setTimeout(() => {
      setRamValue((prev) => Math.min(prev + Math.floor(Math.random() * 512) + 256, RAM_TARGET));
    }, 20);
    return () => clearTimeout(timer);
  }, [currentLineIndex, ramValue]);

  // Typewriter effect
  useEffect(() => {
    if (isComplete || currentLineIndex >= BOOT_LINES.length) return;
    if (currentLineIndex === 3) return; // RAM is handled separately

    const line = BOOT_LINES[currentLineIndex];

    // Empty line or special
    if (line.text === "" || line.speed === 0) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line.text]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, line.delay);
      return () => clearTimeout(timer);
    }

    // Type character by character
    if (currentCharIndex < line.text.length) {
      const jitter = Math.random() * 30;
      const timer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, line.speed + jitter);
      return () => clearTimeout(timer);
    }

    // Line complete
    const timer = setTimeout(() => {
      setDisplayedLines((prev) => [...prev, line.text]);
      setCurrentLineIndex((prev) => prev + 1);
      setCurrentCharIndex(0);
    }, line.delay);
    return () => clearTimeout(timer);
  }, [currentLineIndex, currentCharIndex, isComplete]);

  // Check if boot is complete
  useEffect(() => {
    if (currentLineIndex >= BOOT_LINES.length && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, isComplete, onComplete]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines, currentCharIndex, ramValue]);

  if (isComplete) return null;

  const currentLine = BOOT_LINES[currentLineIndex];
  const typingText = currentLine ? currentLine.text.slice(0, currentCharIndex) : "";

  return (
    <div className="fixed inset-0 z-50 bg-black p-8 overflow-hidden" ref={containerRef}>
      <div className="max-w-3xl font-mono text-sm leading-relaxed">
        {displayedLines.map((line, i) => (
          <div key={i} className="text-accent-green glow-green min-h-[1.5em]">
            {line === "CHECKING_RAM" ? null : line}
          </div>
        ))}

        {/* RAM counter */}
        {currentLineIndex === 3 && (
          <div className="text-accent-green glow-green">
            Checking RAM.............. {ramValue.toLocaleString()} MB
            {ramValue >= RAM_TARGET && " OK"}
          </div>
        )}

        {/* Currently typing line */}
        {currentLineIndex < BOOT_LINES.length &&
          currentLineIndex !== 3 &&
          currentCharIndex > 0 &&
          currentCharIndex < (currentLine?.text.length ?? 0) && (
            <div className="text-accent-green glow-green">
              {typingText}
              <span className="cursor-blink">█</span>
            </div>
          )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add BIOS POST typewriter boot screen"
```

---

### Task 9: Build Boot Screen Orchestrator

**Files:**
- Create: `src/components/boot/BootScreen.tsx`

**Step 1: Write BootScreen orchestrating all 3 phases**

```tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootStore } from "@/stores/bootStore";
import CrtPowerOn from "./CrtPowerOn";
import BiosPost from "./BiosPost";

export default function BootScreen() {
  const { phase, setPhase, hasBooted } = useBootStore();
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    if (hasBooted()) {
      setPhase("ready");
      setShowBoot(false);
    } else {
      setPhase("idle");
    }
  }, [hasBooted, setPhase]);

  const handleStartBoot = useCallback(() => {
    setPhase("power-on");
  }, [setPhase]);

  const handlePowerOnComplete = useCallback(() => {
    setPhase("bios-post");
  }, [setPhase]);

  const handleBiosComplete = useCallback(() => {
    setPhase("loading-desktop");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tejas-os-booted", "true");
    }
    setTimeout(() => {
      setPhase("ready");
      setShowBoot(false);
    }, 500);
  }, [setPhase]);

  if (!showBoot) return null;

  return (
    <AnimatePresence mode="wait">
      {phase === "idle" && (
        <motion.div
          key="idle"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
          onClick={handleStartBoot}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <div className="text-center">
            <div className="text-accent-green glow-green font-mono text-lg mb-8 tracking-widest">
              TejasOS
            </div>
            <button
              onClick={handleStartBoot}
              className="font-mono text-sm border border-accent-green text-accent-green px-8 py-3
                         hover:bg-accent-green hover:text-black transition-colors duration-200
                         tracking-wider uppercase"
            >
              Boot System
            </button>
            <div className="text-text-secondary text-xs mt-6 font-mono">
              Press any key or click to start
            </div>
          </div>
        </motion.div>
      )}

      {phase === "power-on" && (
        <CrtPowerOn key="power-on" onComplete={handlePowerOnComplete} />
      )}

      {phase === "bios-post" && (
        <BiosPost key="bios-post" onComplete={handleBiosComplete} />
      )}

      {phase === "loading-desktop" && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-50 bg-black crt-flicker"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        />
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Wire up in page.tsx**

Replace `src/app/page.tsx`:

```tsx
"use client";

import BootScreen from "@/components/boot/BootScreen";
import { useBootStore } from "@/stores/bootStore";

export default function Home() {
  const phase = useBootStore((s) => s.phase);

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg-primary crt-scanlines crt-vignette">
      <BootScreen />
      {phase === "ready" && (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-accent-green glow-green font-mono">
            Desktop loading...
          </p>
        </div>
      )}
    </main>
  );
}
```

**Step 3: Verify boot sequence works**

Run: `npm run dev`
Expected: Black screen → "BOOT SYSTEM" button → CRT power-on → BIOS typewriter → "Desktop loading..." text.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire up full boot sequence — idle → power-on → BIOS → desktop"
```

---

## Phase 3: Window System

### Task 10: Build Window Component

**Files:**
- Create: `src/components/windows/TitleBar.tsx`
- Create: `src/components/windows/Window.tsx`
- Create: `src/hooks/useDraggable.ts`

**Step 1: Write useDraggable hook**

```ts
"use client";

import { useRef, useCallback, useEffect } from "react";

interface DraggableOptions {
  initialPosition: { x: number; y: number };
  onDrag: (position: { x: number; y: number }) => void;
  enabled?: boolean;
}

export function useDraggable({ initialPosition, onDrag, enabled = true }: DraggableOptions) {
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const position = useRef(initialPosition);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      isDragging.current = true;
      offset.current = {
        x: e.clientX - position.current.x,
        y: e.clientY - position.current.y,
      };
      e.preventDefault();
    },
    [enabled]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newPos = {
        x: Math.max(0, e.clientX - offset.current.x),
        y: Math.max(0, e.clientY - offset.current.y),
      };
      position.current = newPos;
      onDrag(newPos);
    },
    [onDrag]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Sync position ref when prop changes
  useEffect(() => {
    position.current = initialPosition;
  }, [initialPosition]);

  return { handleMouseDown };
}
```

**Step 2: Write TitleBar component**

```tsx
"use client";

import { useWindowStore } from "@/stores/windowStore";
import { WindowId } from "@/types";

interface TitleBarProps {
  windowId: WindowId;
  title: string;
  onMouseDown: (e: React.MouseEvent) => void;
  isActive: boolean;
}

export default function TitleBar({ windowId, title, onMouseDown, isActive }: TitleBarProps) {
  const { closeWindow, minimizeWindow, maximizeWindow } = useWindowStore();

  return (
    <div
      className={`flex items-center h-9 px-2 select-none cursor-grab active:cursor-grabbing
                  ${isActive ? "bg-bg-elevated" : "bg-bg-surface"} border-b border-border`}
      onMouseDown={onMouseDown}
    >
      <span className="text-xs font-mono truncate flex-1 text-text-primary">
        {title}
      </span>
      <div className="flex gap-1 ml-2">
        <button
          onClick={(e) => { e.stopPropagation(); minimizeWindow(windowId); }}
          className="w-5 h-5 flex items-center justify-center text-text-secondary hover:bg-border rounded text-xs"
          aria-label="Minimize"
        >
          ─
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); maximizeWindow(windowId); }}
          className="w-5 h-5 flex items-center justify-center text-text-secondary hover:bg-border rounded text-xs"
          aria-label="Maximize"
        >
          □
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); closeWindow(windowId); }}
          className="w-5 h-5 flex items-center justify-center text-accent-red hover:bg-accent-red hover:text-white rounded text-xs"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

**Step 3: Write Window component**

```tsx
"use client";

import { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import { WindowId } from "@/types";
import { useDraggable } from "@/hooks/useDraggable";
import TitleBar from "./TitleBar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BREAKPOINTS } from "@/lib/constants";

interface WindowProps {
  windowId: WindowId;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export default function Window({ windowId, children, defaultWidth, defaultHeight }: WindowProps) {
  const windowState = useWindowStore((s) => s.windows.find((w) => w.id === windowId));
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const { focusWindow, updatePosition } = useWindowStore();
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.tablet}px)`);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback(
    (pos: { x: number; y: number }) => {
      updatePosition(windowId, pos);
      if (windowRef.current) {
        windowRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
    },
    [windowId, updatePosition]
  );

  const { handleMouseDown } = useDraggable({
    initialPosition: windowState?.position ?? { x: 100, y: 60 },
    onDrag: handleDrag,
    enabled: isDesktop && !windowState?.isMaximized,
  });

  if (!windowState || !windowState.isOpen || windowState.isMinimized) return null;

  const isActive = activeWindowId === windowId;
  const isMaximized = windowState.isMaximized;

  const style: React.CSSProperties = isMaximized
    ? { inset: 0, width: "100%", height: "calc(100% - 48px)", transform: "none" }
    : isDesktop
      ? {
          transform: `translate(${windowState.position.x}px, ${windowState.position.y}px)`,
          width: defaultWidth ?? windowState.size.width,
          height: defaultHeight ?? windowState.size.height,
        }
      : { inset: 0, width: "100%", height: "calc(100% - 48px)" };

  return (
    <motion.div
      ref={windowRef}
      className={`fixed bg-bg-surface border rounded-lg overflow-hidden shadow-2xl
                  ${isMaximized || !isDesktop ? "" : ""}
                  ${isActive ? "border-accent-green/30" : "border-border"}`}
      style={{ ...style, zIndex: windowState.zIndex, position: isMaximized ? "fixed" : "fixed" }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onMouseDown={() => focusWindow(windowId)}
    >
      <TitleBar
        windowId={windowId}
        title={windowState.title}
        onMouseDown={handleMouseDown}
        isActive={isActive}
      />
      <div className="overflow-auto" style={{ height: "calc(100% - 36px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
```

**Step 4: Create useMediaQuery hook**

Write `src/hooks/useMediaQuery.ts`:

```ts
"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Window system — draggable windows with title bar, minimize, maximize, close"
```

---

## Phase 4: Desktop Environment

### Task 11: Build Desktop Icons & Surface

**Files:**
- Create: `src/components/desktop/DesktopIcon.tsx`
- Create: `src/components/desktop/Desktop.tsx`

**Step 1: Write DesktopIcon**

```tsx
"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { WindowId } from "@/types";
import { useWindowStore } from "@/stores/windowStore";
import { SITE_CONFIG } from "@/lib/constants";

interface DesktopIconProps {
  id: WindowId | "mail";
  label: string;
  icon: string;
  index: number;
}

export default function DesktopIcon({ id, label, icon, index }: DesktopIconProps) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const lastClickRef = useRef(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    const isDoubleClick = now - lastClickRef.current < 400;
    lastClickRef.current = now;

    if (!isDoubleClick) return;

    if (id === "mail") {
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    } else {
      openWindow(id);
    }
  }, [id, openWindow]);

  return (
    <motion.button
      className="flex flex-col items-center gap-1.5 p-3 rounded-lg w-24
                 hover:bg-white/5 focus:bg-white/5 focus:outline-none
                 transition-colors cursor-pointer select-none"
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * index, type: "spring", stiffness: 300, damping: 20 }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (id === "mail") {
            window.location.href = `mailto:${SITE_CONFIG.email}`;
          } else {
            openWindow(id as WindowId);
          }
        }
      }}
    >
      <span className="text-3xl" role="img" aria-label={label}>
        {icon}
      </span>
      <span className="text-xs text-text-primary font-mono text-center leading-tight">
        {label}
      </span>
    </motion.button>
  );
}
```

**Step 2: Write Desktop surface**

```tsx
"use client";

import { useCallback, useState } from "react";
import DesktopIcon from "./DesktopIcon";
import ContextMenu from "./ContextMenu";
import { DesktopIconConfig, WindowId } from "@/types";
import { useEasterEggStore } from "@/stores/easterEggStore";

const ICONS: DesktopIconConfig[] = [
  { id: "projects", label: "Projects", icon: "📁", action: "window" },
  { id: "resume", label: "Resume.exe", icon: "📄", action: "window" },
  { id: "system-info", label: "System Info", icon: "ℹ️", action: "window" },
  { id: "mail", label: "Mail", icon: "📧", action: "mailto" },
  { id: "arcade", label: "Arcade", icon: "🕹️", action: "window" },
  { id: "skills", label: "Skills", icon: "🔧", action: "window" },
];

export default function Desktop() {
  const founderMode = useEasterEggStore((s) => s.founderModeActive);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const allIcons = founderMode
    ? [...ICONS, { id: "classified" as WindowId, label: "CLASSIFIED", icon: "🔒", action: "window" as const }]
    : ICONS;

  return (
    <div
      className="absolute inset-0 bottom-12 p-4"
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      {/* Icon grid */}
      <div className="grid grid-cols-2 gap-1 w-fit">
        {allIcons.map((icon, i) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            icon={icon.icon}
            index={i}
          />
        ))}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add desktop surface with icon grid and context menu support"
```

---

### Task 12: Build Context Menu

**Files:**
- Create: `src/components/desktop/ContextMenu.tsx`

**Step 1: Write ContextMenu**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { WallpaperOption } from "@/types";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const setWallpaper = useSettingsStore((s) => s.setWallpaper);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [onClose]);

  const items = [
    {
      label: "Refresh Desktop",
      action: () => window.location.reload(),
    },
    {
      label: "Change Wallpaper ▸",
      submenu: [
        { label: "Default", action: () => setWallpaper("default") },
        { label: "Circuit Board", action: () => setWallpaper("circuit") },
        { label: "Matrix Rain", action: () => setWallpaper("matrix") },
      ],
    },
    { separator: true },
    {
      label: "View Source",
      action: () => window.open("https://github.com/tejasnaladala", "_blank"),
    },
    {
      label: "About TejasOS",
      action: () => alert("TejasOS v1.0 — Founder Edition\nBuilt by Tejas Naladala"),
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bg-bg-elevated border border-border rounded-md py-1 shadow-xl min-w-48 z-[9000]"
      style={{ left: x, top: y }}
    >
      {items.map((item, i) => {
        if ("separator" in item) {
          return <div key={i} className="border-t border-border my-1" />;
        }
        if ("submenu" in item && item.submenu) {
          return (
            <div key={i} className="relative group">
              <div className="px-3 py-1.5 text-xs font-mono text-text-primary hover:bg-white/5 cursor-pointer">
                {item.label}
              </div>
              <div className="absolute left-full top-0 bg-bg-elevated border border-border rounded-md py-1 hidden group-hover:block min-w-36">
                {item.submenu.map((sub, j) => (
                  <button
                    key={j}
                    onClick={() => { sub.action(); onClose(); }}
                    className="w-full text-left px-3 py-1.5 text-xs font-mono text-text-primary hover:bg-white/5"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return (
          <button
            key={i}
            onClick={() => { item.action?.(); onClose(); }}
            className="w-full text-left px-3 py-1.5 text-xs font-mono text-text-primary hover:bg-white/5"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add right-click context menu with wallpaper options"
```

---

### Task 13: Build Taskbar

**Files:**
- Create: `src/components/desktop/Taskbar.tsx`
- Create: `src/components/desktop/StartMenu.tsx`
- Create: `src/components/shared/SoundToggle.tsx`

**Step 1: Write SoundToggle**

```tsx
"use client";

import { useSettingsStore } from "@/stores/settingsStore";

export default function SoundToggle() {
  const { soundEnabled, toggleSound } = useSettingsStore();

  return (
    <button
      onClick={toggleSound}
      className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
      aria-label={soundEnabled ? "Mute" : "Unmute"}
      title={soundEnabled ? "Sound On" : "Sound Off"}
    >
      {soundEnabled ? "🔊" : "🔇"}
    </button>
  );
}
```

**Step 2: Write StartMenu**

```tsx
"use client";

import { motion } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import { SITE_CONFIG } from "@/lib/constants";
import { WindowId } from "@/types";

interface StartMenuProps {
  onClose: () => void;
}

const MENU_ITEMS: { id: WindowId | "mail" | "resume-link" | "divider"; label: string; icon: string }[] = [
  { id: "system-info", label: "About", icon: "ℹ️" },
  { id: "projects", label: "Projects", icon: "📁" },
  { id: "resume", label: "Resume", icon: "📄" },
  { id: "skills", label: "Skills", icon: "🔧" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "timeline", label: "Event Log", icon: "📋" },
  { id: "arcade", label: "Arcade", icon: "🕹️" },
  { id: "terminal", label: "Terminal", icon: ">_" },
  { id: "divider", label: "", icon: "" },
  { id: "mail", label: "Contact", icon: "📧" },
  { id: "resume-link", label: "View as Resume", icon: "🔗" },
];

export default function StartMenu({ onClose }: StartMenuProps) {
  const openWindow = useWindowStore((s) => s.openWindow);

  const handleClick = (id: string) => {
    if (id === "mail") {
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    } else if (id === "resume-link") {
      window.open("/resume", "_blank");
    } else if (id !== "divider") {
      openWindow(id as WindowId);
    }
    onClose();
  };

  return (
    <motion.div
      className="absolute bottom-full left-0 mb-1 bg-bg-elevated border border-border rounded-md
                 py-1 shadow-xl min-w-56 z-[9000]"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-border">
        <div className="text-xs font-mono text-accent-green glow-green">TejasOS</div>
        <div className="text-[10px] font-mono text-text-secondary">Founder Edition</div>
      </div>

      {/* Menu items */}
      {MENU_ITEMS.map((item, i) => {
        if (item.id === "divider") {
          return <div key={i} className="border-t border-border my-1" />;
        }
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="w-full text-left px-3 py-1.5 text-xs font-mono text-text-primary
                       hover:bg-white/5 flex items-center gap-2"
          >
            <span className="w-5 text-center">{item.icon}</span>
            {item.label}
          </button>
        );
      })}

      {/* Social links */}
      <div className="border-t border-border mt-1 pt-1 px-3 py-2 flex gap-3">
        <a href={SITE_CONFIG.social.github} target="_blank" rel="noopener noreferrer"
           className="text-xs text-text-secondary hover:text-accent-cyan transition-colors">
          GitHub
        </a>
        <a href={SITE_CONFIG.social.linkedin} target="_blank" rel="noopener noreferrer"
           className="text-xs text-text-secondary hover:text-accent-cyan transition-colors">
          LinkedIn
        </a>
        <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer"
           className="text-xs text-text-secondary hover:text-accent-cyan transition-colors">
          Instagram
        </a>
      </div>
    </motion.div>
  );
}
```

**Step 3: Write Taskbar**

```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import StartMenu from "./StartMenu";
import SoundToggle from "../shared/SoundToggle";
import { SITE_CONFIG } from "@/lib/constants";

export default function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const { focusWindow, restoreWindow } = useWindowStore();
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-bg-elevated border-t border-border
                    flex items-center px-2 z-[8000] select-none">
      {/* Start button */}
      <div className="relative">
        <button
          onClick={() => setStartOpen((s) => !s)}
          className={`px-3 py-1.5 text-xs font-mono font-bold border rounded
                     transition-colors ${
                       startOpen
                         ? "bg-accent-green text-black border-accent-green"
                         : "text-accent-green border-accent-green/30 hover:border-accent-green"
                     }`}
        >
          ⚡ START
        </button>
        <AnimatePresence>
          {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border mx-2" />

      {/* Open windows */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {windows
          .filter((w) => w.isOpen)
          .map((w) => (
            <button
              key={w.id}
              onClick={() => (w.isMinimized ? restoreWindow(w.id) : focusWindow(w.id))}
              className={`px-3 py-1 text-xs font-mono truncate max-w-36 rounded border transition-colors ${
                w.id === activeWindowId && !w.isMinimized
                  ? "bg-white/10 border-accent-green/30 text-text-primary"
                  : "border-transparent text-text-secondary hover:bg-white/5"
              } ${w.isMinimized ? "opacity-50" : ""}`}
            >
              {w.title}
            </button>
          ))}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-3">
        <SoundToggle />
        <div className="flex gap-2">
          <a href={SITE_CONFIG.social.github} target="_blank" rel="noopener noreferrer"
             className="text-text-secondary hover:text-text-primary text-xs transition-colors" title="GitHub">
            GH
          </a>
          <a href={SITE_CONFIG.social.linkedin} target="_blank" rel="noopener noreferrer"
             className="text-text-secondary hover:text-text-primary text-xs transition-colors" title="LinkedIn">
            LI
          </a>
          <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer"
             className="text-text-secondary hover:text-text-primary text-xs transition-colors" title="Instagram">
            IG
          </a>
        </div>
        <div className="w-px h-6 bg-border" />
        <span className="text-xs font-mono text-text-secondary min-w-16 text-right">{clock}</span>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add taskbar with start menu, window indicators, system tray, and clock"
```

---

### Task 14: Build CRT Overlay & Wire Desktop Into Page

**Files:**
- Create: `src/components/shared/CrtOverlay.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Write CrtOverlay**

```tsx
"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { useEasterEggStore } from "@/stores/easterEggStore";

export default function CrtOverlay() {
  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const founderMode = useEasterEggStore((s) => s.founderModeActive);

  const bgClass = founderMode
    ? "bg-[radial-gradient(circle_at_50%_50%,#1a1000_0%,#0a0a0f_100%)]"
    : wallpaper === "circuit"
      ? "bg-[url('/wallpapers/circuit.svg')]"
      : wallpaper === "matrix"
        ? "bg-[radial-gradient(circle_at_50%_50%,#001a00_0%,#0a0a0f_100%)]"
        : "";

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9990] crt-scanlines crt-vignette ${bgClass}`}
    />
  );
}
```

**Step 2: Update page.tsx with full desktop**

Replace `src/app/page.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BootScreen from "@/components/boot/BootScreen";
import Desktop from "@/components/desktop/Desktop";
import Taskbar from "@/components/desktop/Taskbar";
import CrtOverlay from "@/components/shared/CrtOverlay";
import { useBootStore } from "@/stores/bootStore";
import { useSettingsStore } from "@/stores/settingsStore";

export default function Home() {
  const phase = useBootStore((s) => s.phase);

  // Hydrate sound setting from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tejas-os-sound");
    if (saved === "true") {
      useSettingsStore.getState().toggleSound();
    }
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg-primary">
      <BootScreen />

      <AnimatePresence>
        {phase === "ready" && (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Desktop />
            <Taskbar />
          </motion.div>
        )}
      </AnimatePresence>

      <CrtOverlay />
    </main>
  );
}
```

**Step 3: Verify desktop loads after boot**

Run: `npm run dev`
Expected: Boot sequence plays → Desktop appears with icons + taskbar + clock + CRT overlay.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: wire desktop, taskbar, CRT overlay into main page"
```

---

## Phase 5: App Windows (Content)

### Task 15: Build SystemInfo (About) Window

**Files:**
- Create: `src/components/apps/SystemInfo.tsx`

**Step 1: Write SystemInfo**

Render the system properties panel from the design doc with bio.systemInfo data. Use monospace table layout with ASCII box-drawing characters. Include the hidden schematic easter egg (5 clicks on Processor line).

Full implementation: read `src/data/bio.ts` systemInfo object, render each row as a table line. Add click counter on the processor row. When count reaches 5, call `useEasterEggStore().revealSchematic()` and show ASCII circuit art.

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add System Info (About) window with hidden schematic easter egg"
```

---

### Task 16: Build Projects Folder & Project Detail

**Files:**
- Create: `src/components/apps/ProjectsFolder.tsx`
- Create: `src/components/apps/ProjectDetail.tsx`

**Step 1: Write ProjectsFolder**

Render a folder view listing each project as a file icon with filename.extension. Double-click opens a project-detail window using `openWindow("project-detail", { projectId: p.id })`.

**Step 2: Write ProjectDetail**

Reads `meta.projectId` from the window state, looks up the project from `src/data/projects.ts`, and renders: title, role, date, description, metrics (bulleted), tech (tags), links.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Projects folder view and Project detail window"
```

---

### Task 17: Build Resume App

**Files:**
- Create: `src/components/apps/ResumeApp.tsx`

**Step 1: Write ResumeApp**

Renders a formatted view of the resume inside a window. Sections: Education, Experience (all 6 entries as collapsible items), Publications, Skills summary. Includes a "Download Resume" button that links to `/resume.pdf`.

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Resume.exe app window with download button"
```

---

### Task 18: Build Skills Map (Device Manager)

**Files:**
- Create: `src/components/apps/SkillsMap.tsx`

**Step 1: Write SkillsMap**

Renders the Device Manager-style skill tree from `src/data/skills.ts`. Each category is collapsible (▼/▸). Skills show name + ASCII progress bar (█ and ░ characters) + level label. Use the `barFill` value out of 12 to determine bar length.

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Skills (Device Manager) window with collapsible categories"
```

---

### Task 19: Build Timeline & Achievements

**Files:**
- Create: `src/components/apps/Timeline.tsx`
- Create: `src/components/apps/Achievements.tsx`

**Step 1: Write Timeline**

Render event log from `src/data/timeline.ts`. Each entry: `[date] title — description`. Color-code by type (venture=green, research=cyan, education=amber, project=white).

**Step 2: Write Achievements**

Render badge grid from `src/data/achievements.ts`. Each achievement as a card with icon, title, description. Unlocked achievements glow, locked ones are greyed out (all are unlocked for now).

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Timeline (Event Log) and Achievements windows"
```

---

### Task 20: Build Terminal

**Files:**
- Create: `src/components/apps/Terminal.tsx`

**Step 1: Write Terminal**

Interactive command-line interface. Green text on black. Shows `tejas@portfolio:~$` prompt. User types commands, press Enter to execute. Commands defined in `src/data/terminalCommands.ts`. Handle `__CLEAR__` to clear output, `__EXIT__` to close window. Support `cat projects/<name>` via dynamic matching. Handle unknown commands with "command not found" message. Auto-scroll to bottom. Focus input on open.

Support partial matching for `cat` commands: if user types `cat projects/plasmafx.sys`, match against the terminalCommands keys.

Also handle `echo <text>` dynamically: extract everything after `echo ` and return it.

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add hidden Terminal with command execution"
```

---

### Task 21: Wire All App Windows Into the Desktop

**Files:**
- Create: `src/components/windows/WindowManager.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Write WindowManager**

This component renders all open windows by mapping `useWindowStore.windows` and rendering the appropriate content component inside a `<Window>` shell based on `windowId`.

```tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import Window from "./Window";
import SystemInfo from "../apps/SystemInfo";
import ProjectsFolder from "../apps/ProjectsFolder";
import ProjectDetail from "../apps/ProjectDetail";
import ResumeApp from "../apps/ResumeApp";
import SkillsMap from "../apps/SkillsMap";
import Timeline from "../apps/Timeline";
import Achievements from "../apps/Achievements";
import Terminal from "../apps/Terminal";
import GameLauncher from "../arcade/GameLauncher";

const WINDOW_CONTENT: Record<string, React.ComponentType<{ windowId: string }>> = {
  "system-info": SystemInfo,
  projects: ProjectsFolder,
  "project-detail": ProjectDetail,
  resume: ResumeApp,
  skills: SkillsMap,
  timeline: Timeline,
  achievements: Achievements,
  terminal: Terminal,
  arcade: GameLauncher,
};

export default function WindowManager() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <AnimatePresence>
      {windows
        .filter((w) => w.isOpen && !w.isMinimized)
        .map((w) => {
          const ContentComponent = WINDOW_CONTENT[w.id];
          if (!ContentComponent) return null;
          return (
            <Window key={w.id} windowId={w.id}>
              <ContentComponent windowId={w.id} />
            </Window>
          );
        })}
    </AnimatePresence>
  );
}
```

**Step 2: Add WindowManager to page.tsx**

Add `<WindowManager />` after `<Desktop />` and before `<Taskbar />` in the ready state render.

**Step 3: Verify windows open from desktop icons**

Run: `npm run dev`
Expected: Double-click desktop icons → windows open with correct content. Dragging, minimize, maximize, close all work. Taskbar shows open windows.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add WindowManager, wire all app windows to desktop"
```

---

## Phase 6: Sound System

### Task 22: Build Sound System

**Files:**
- Create: `src/hooks/useSound.ts`
- Create: `src/lib/sounds.ts`

**Step 1: Write sound definitions**

`src/lib/sounds.ts`:
```ts
export const SOUND_SPRITES = {
  boot: { start: 0, duration: 150 },
  success: { start: 200, duration: 300 },
  windowOpen: { start: 600, duration: 80 },
  windowClose: { start: 750, duration: 60 },
  error: { start: 900, duration: 200 },
  click: { start: 1200, duration: 50 },
} as const;

export type SoundName = keyof typeof SOUND_SPRITES;
```

**Step 2: Write useSound hook**

```ts
"use client";

import { useCallback, useRef, useEffect } from "react";
import { Howl } from "howler";
import { useSettingsStore } from "@/stores/settingsStore";
import { SOUND_SPRITES, SoundName } from "@/lib/sounds";

export function useSound() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    howlRef.current = new Howl({
      src: ["/sounds/sprite.mp3"],
      sprite: Object.fromEntries(
        Object.entries(SOUND_SPRITES).map(([key, val]) => [key, [val.start, val.duration]])
      ),
      volume: 0.5,
    });
    return () => {
      howlRef.current?.unload();
    };
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!soundEnabled || !howlRef.current) return;
      howlRef.current.play(name);
    },
    [soundEnabled]
  );

  return { play };
}
```

Note: For the initial build, create a silent placeholder MP3 at `public/sounds/sprite.mp3`. The user can replace it with actual sound effects later. Generate a placeholder:

```bash
# Create a 2-second silent MP3 placeholder
# The user will replace this with actual sound sprites
mkdir -p public/sounds
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add sound system with Howler.js and audio sprite support"
```

---

## Phase 7: Easter Eggs

### Task 23: Build Konami Code Hook

**Files:**
- Create: `src/hooks/useKonamiCode.ts`

**Step 1: Write useKonamiCode**

```ts
"use client";

import { useEffect, useRef } from "react";
import { useEasterEggStore } from "@/stores/easterEggStore";
import { useWindowStore } from "@/stores/windowStore";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function useKonamiCode() {
  const indexRef = useRef(0);
  const { activateFounderMode, founderModeActive } = useEasterEggStore();

  useEffect(() => {
    if (founderModeActive) return;

    const handler = (e: KeyboardEvent) => {
      const expected = KONAMI_CODE[indexRef.current];
      if (e.key === expected) {
        indexRef.current++;
        if (indexRef.current === KONAMI_CODE.length) {
          activateFounderMode();
          indexRef.current = 0;
        }
      } else {
        indexRef.current = 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activateFounderMode, founderModeActive]);
}
```

**Step 2: Add the hook call to page.tsx**

Add `useKonamiCode()` inside the Home component.

**Step 3: Add visual feedback for founder mode activation**

When `founderModeActive` becomes true, show a brief flash overlay with "FOUNDER MODE ACTIVATED" text, then update the desktop theme (amber accents via CSS class toggle).

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Konami code easter egg for Founder Mode"
```

---

### Task 24: Add Keyboard Navigation Hook

**Files:**
- Create: `src/hooks/useKeyboardNav.ts`

**Step 1: Write keyboard navigation**

Handle `Ctrl+~` to open terminal window. Handle `Escape` to close active window. Handle `Alt+Tab` style window cycling (optional stretch).

**Step 2: Wire into page.tsx**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add keyboard navigation — Ctrl+~ terminal, Escape close"
```

---

## Phase 8: Games

### Task 25: Build Game Launcher

**Files:**
- Create: `src/components/arcade/GameLauncher.tsx`

**Step 1: Write GameLauncher**

Two sections: "EASY MODE" and "HARD MODE". Each game listed with name, description, and "PLAY" button. Play button dynamically imports the game component and renders it in the same window space, replacing the launcher. Back button to return to launcher.

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Arcade game launcher with easy/hard mode sections"
```

---

### Task 26: Build Shared Game Hooks

**Files:**
- Create: `src/hooks/useGameLoop.ts`

**Step 1: Write useGameLoop**

```ts
"use client";

import { useRef, useEffect, useCallback } from "react";

export function useGameLoop(
  callback: (deltaTime: number) => void,
  running: boolean
) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  callbackRef.current = callback;

  const loop = useCallback((time: number) => {
    const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
    lastTimeRef.current = time;
    callbackRef.current(Math.min(delta, 0.1)); // cap at 100ms
    frameRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (running) {
      lastTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [running, loop]);
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add shared useGameLoop hook for Canvas games"
```

---

### Task 27: Build Flappy Tejas Game

**Files:**
- Create: `src/components/arcade/games/flappy-tejas/FlappyTejas.tsx`
- Create: `src/components/arcade/games/flappy-tejas/engine.ts`

**Step 1: Write game engine**

Pure Canvas game: rocket/drone sprite (drawn with simple shapes, no image assets), circuit board pillar obstacles with gaps, gravity physics, score counter. Controls: Space/Click to flap. Game states: waiting, playing, game-over. ~200 LOC total.

Engine manages: player position/velocity, obstacle array generation/scrolling, collision detection (AABB), score tracking, rendering loop.

**Step 2: Write React wrapper**

`FlappyTejas.tsx`: Canvas ref, calls engine.init(canvas), handles keyboard/click input, shows score overlay, game-over screen with "Play Again" button.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Flappy Tejas arcade game"
```

---

### Task 28: Build Tetromino.AI Game

**Files:**
- Create: `src/components/arcade/games/tetromino-ai/TetrominoAI.tsx`
- Create: `src/components/arcade/games/tetromino-ai/engine.ts`

**Step 1: Write game engine**

Standard Tetris mechanics: 10x20 grid, 7 tetrominoes (I, O, T, S, Z, J, L) themed as circuit shapes. Rotation (SRS-like), line clearing, increasing speed per level, scoring. Controls: Arrow keys (left/right/rotate/soft drop), Space (hard drop).

**Step 2: Write React wrapper with score display**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Tetromino.AI tetris game"
```

---

### Task 29: Build Pixel Pong Game

**Files:**
- Create: `src/components/arcade/games/pixel-pong/PixelPong.tsx`
- Create: `src/components/arcade/games/pixel-pong/engine.ts`

**Step 1: Write breakout engine**

Paddle at bottom, ball bouncing, blocks arranged as a circuit pattern at top. Power-ups: "overclock" (faster ball speed), "debug" (reveals hidden blocks). Score = blocks destroyed. 3 lives.

**Step 2: Write React wrapper**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Pixel Pong breakout game"
```

---

### Task 30: Build Debug the Circuit Game

**Files:**
- Create: `src/components/arcade/games/debug-circuit/DebugCircuit.tsx`
- Create: `src/components/arcade/games/debug-circuit/engine.ts`
- Create: `src/components/arcade/games/debug-circuit/levels.ts`

**Step 1: Write puzzle engine**

Display a logic circuit diagram with AND/OR/NOT/XOR gates. One component is wrong (wrong gate type, broken wire, inverted output). Player clicks the buggy component to identify it, then selects the fix from 3-4 options. 10 progressive levels. Timer-based scoring.

**Step 2: Write level data**

Each level: array of gates + wires + expected output + the bug location + correct fix.

**Step 3: Write React wrapper**

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Debug the Circuit logic puzzle game"
```

---

### Task 31: Build Train the Agent Game

**Files:**
- Create: `src/components/arcade/games/train-agent/TrainAgent.tsx`
- Create: `src/components/arcade/games/train-agent/engine.ts`

**Step 1: Write Q-learning simulator**

Grid world (8x8). Agent (pixel character) starts at random position, goal at fixed position. Agent takes random actions. Player clicks "Reward" or "Punish" buttons after each action. Agent updates Q-values. Over time, agent learns to reach goal. Show real-time reward graph (simple line chart drawn on canvas). Win condition: agent reaches goal 3 times in a row.

**Step 2: Write React wrapper with reward/punish controls**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Train the Agent Q-learning game"
```

---

## Phase 9: Mobile & Responsive

### Task 32: Build Mobile Shell

**Files:**
- Create: `src/components/mobile/MobileShell.tsx`
- Create: `src/components/mobile/MobileNav.tsx`

**Step 1: Write MobileNav bottom tab bar**

5 tabs: Projects, About, Games, Resume, Contact. Fixed at bottom. Active tab highlighted with accent green.

**Step 2: Write MobileShell**

Full-screen card stack. Each tab renders its corresponding app component full-screen (no window chrome, just content with a title header). Swipe between tabs optional (CSS scroll-snap).

**Step 3: Update page.tsx**

Use `useMediaQuery` to render either Desktop+WindowManager+Taskbar (desktop) or MobileShell+MobileNav (mobile).

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add mobile-responsive layout with bottom nav and card stack"
```

---

## Phase 10: SEO, Recruiter View & Polish

### Task 33: Build Recruiter Escape Hatch

**Files:**
- Create: `src/app/resume/page.tsx`

**Step 1: Write clean resume page**

Server-rendered, no OS chrome. Uses Inter font. Clean white-on-dark professional layout. Sections: Header (name, contact, links), Education, Experience (all entries from projects data), Skills, Publications, Achievements. Download button. Link back to "Enter TejasOS" for the full experience.

This page is important for SEO — it's the static content that search engines index.

**Step 2: Add metadata for /resume route**

```ts
export const metadata = {
  title: "Tejas Naladala — Resume",
  description: "Hardware engineer, AI builder, startup founder. B.S. ECE + Applied Math at UW. Founder of PlasmaX, Cerulean Robotics, Atticus AI.",
};
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add /resume recruiter escape hatch with clean layout and SEO"
```

---

### Task 34: Add SEO, Sitemap, Robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx` (add JSON-LD)

**Step 1: Write sitemap.ts**

```ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tejasnaladala.com", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://tejasnaladala.com/resume", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
```

**Step 2: Write robots.ts**

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://tejasnaladala.com/sitemap.xml",
  };
}
```

**Step 3: Add JSON-LD Person schema to layout**

Add a `<script type="application/ld+json">` block with Person schema (name, url, sameAs for social links, jobTitle, alumniOf).

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots.txt, JSON-LD structured data"
```

---

### Task 35: Performance Optimization

**Files:**
- Modify: `next.config.ts`

**Step 1: Optimize Next.js config**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
```

**Step 2: Verify build succeeds and check bundle size**

Run: `npm run build`
Expected: Build completes with no errors. Check that game chunks are separate from main bundle.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: optimize Next.js config for production performance"
```

---

## Phase 11: Deployment

### Task 36: Deploy to Vercel

**Step 1: Initialize git remote**

```bash
cd C:/Users/tejas/OneDrive/Desktop/tejas-os
git remote add origin https://github.com/tejasnaladala/tejas-os.git
git branch -M main
```

**Step 2: Push to GitHub**

```bash
git push -u origin main
```

**Step 3: Deploy via Vercel CLI or dashboard**

```bash
npx vercel --prod
```

Or: Connect the GitHub repo in the Vercel dashboard. Set:
- Framework: Next.js (auto-detected)
- Root directory: `.` (default)
- Build command: `next build`
- Output directory: `.next`

**Step 4: Configure custom domain**

In Vercel dashboard → Settings → Domains → Add `tejasnaladala.com`. Follow DNS instructions to point A record to Vercel.

**Step 5: Verify deployment**

Visit https://tejasnaladala.com → Boot sequence → Desktop loads. Check all windows, games, terminal, easter eggs. Run Lighthouse audit targeting 95+ on Performance.

**Step 6: Commit any final fixes**

```bash
git add -A
git commit -m "chore: finalize deployment configuration"
```

---

## Post-Launch Enhancements (Optional, Not Part of Initial Build)

These are documented for future reference but NOT implemented in this plan:

1. **Leaderboard system** — Serverless function + KV store for game high scores
2. **Analytics** — Vercel Analytics or Plausible (privacy-friendly)
3. **A/B testing** — Different boot sequences or desktop layouts
4. **Game expansion** — Additional games, multiplayer modes
5. **OS updates concept** — "System update available" notification with changelog
6. **Sound sprite creation** — Replace placeholder with actual 8-bit sound effects
7. **OG image generation** — Dynamic OpenGraph image showing the desktop
8. **Wallpaper SVGs** — Create actual circuit board and matrix rain wallpaper assets

---

## Summary

| Phase | Tasks | Estimated Commits |
|-------|-------|-------------------|
| 1. Scaffolding & Foundation | 6 | 6 |
| 2. Boot Sequence | 3 | 3 |
| 3. Window System | 1 | 1 |
| 4. Desktop Environment | 4 | 4 |
| 5. App Windows | 7 | 7 |
| 6. Sound System | 1 | 1 |
| 7. Easter Eggs | 2 | 2 |
| 8. Games | 7 | 7 |
| 9. Mobile & Responsive | 1 | 1 |
| 10. SEO & Polish | 3 | 3 |
| 11. Deployment | 1 | 1 |
| **Total** | **36** | **36** |
