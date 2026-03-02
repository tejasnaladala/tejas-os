# TejasOS v2 — Underwater ROV Journey Design

**Date:** 2026-03-02
**Domain:** tejasnaladala.com
**Status:** Approved
**Replaces:** BIOS/OS simulation (v1)

## Overview

Free-roam 2D underwater world where users pilot a pixel ROV through an ocean, discovering portfolio content at themed stations. CSS-based atmospheric effects (bubbles, sea creatures, depth gradient). Content panels slide in when docking at stations. Mobile gets a scroll-based ocean experience. Recruiter escape hatch at /resume remains.

## Tech Stack (unchanged)

Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Zustand, Howler.js, HTML5 Canvas (games only)

## The Ocean World

### World Dimensions
- Virtual space: 5000px wide × 3500px deep
- ROV spawns at approximately (800, 300) — near surface
- World rendered as DOM elements with CSS transforms
- Camera follows ROV, keeping it centered on viewport

### Depth Gradient (background)
- 0-500px: #0a2463 → #0d1b3e (sunlit blue)
- 500-1500px: #0d1b3e → #0a1128 (twilight)
- 1500-2500px: #0a1128 → #060d1a (midnight)
- 2500-3500px: #060d1a → #020408 (abyss)

### Station Positions
| Station | Position (x, y) | Depth Zone | Content |
|---------|----------------|------------|---------|
| Research Lab (🔬) | (1200, 500) | Sunlight | About/Bio |
| Salvage Yard (📦) | (2800, 1200) | Twilight | Projects |
| Systems Bay (🔧) | (4000, 700) | Sunlight | Skills |
| Arcade Rig (🕹️) | (3500, 2100) | Midnight | Games |
| Comms Array (📡) | (900, 2600) | Midnight | Contact |
| The Trench (🌋) | (2500, 3200) | Abyss | Easter Eggs |

### ROV Controls
- WASD / Arrow Keys: Move in 4 directions
- Shift: Boost (2x speed)
- Enter: Dock at nearby station
- Escape: Undock / close panel
- Momentum physics: input adds velocity, friction decelerates
- Speed: 200px/s normal, 400px/s boost
- ROV tilts slightly in direction of movement
- Bubble trail when moving

### Station Interaction
- Within ~80px: station glows + "DOCK" prompt
- Enter/Click: Content panel slides in from right (60% width desktop, fullscreen mobile)
- Ocean dims behind panel
- Escape/backdrop click: undock

## HUD (Heads-Up Display)
- Top-left: DEPTH readout + coordinates
- Top-right: Fast-travel nav links (monospace, subtle)
- Bottom-right: Mini-map (station dots, ROV position, clickable for fast-travel)
- Bottom-left: Discovery progress (X/6 stations)

## Mini-Map
- Fixed bottom-right corner
- Shows all station positions as dots
- Undiscovered: dim gray, Discovered: bright green
- ROV: green triangle
- Depth readout below
- Clickable for fast-travel (accessibility)

## Visual Design

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| --ocean-surface | #0a2463 | Top of world |
| --ocean-twilight | #0d1b3e | Mid depths |
| --ocean-midnight | #0a1128 | Deep |
| --ocean-abyss | #020408 | The Trench |
| --bg-panel | #0a0f1a | Content panel bg |
| --text-primary | #c8d6e5 | Body text |
| --text-secondary | #5f7a94 | Labels |
| --accent-cyan | #00d4ff | Primary accent, ROV, sonar |
| --accent-green | #00ff88 | Discovered, success |
| --accent-amber | #ffb000 | Warnings, achievements |
| --accent-red | #ff3366 | Danger, The Trench |
| --glow-cyan | rgba(0,212,255,0.3) | Sonar glow |

### Typography
- System: JetBrains Mono (400, 500, 700)
- HUD: uppercase, wide letter-spacing, small
- Recruiter view: Inter

### Ambient Effects (CSS-only)
- Bubbles: 15-20 divs, CSS float-up animation, random size/speed/position
- Sea creatures: ASCII art at various depths, slow drift animation
- Light rays: shallow depths only, diagonal gradient streaks, 3% opacity
- Seafloor: y=3400px, textured with repeating gradient

### Station Markers
- Pulsing box-shadow glow
- Icon + label
- Approach: glow intensifies + dock prompt
- Docked: solid cyan border

## Content Mapping

### Research Lab (About)
Same system info from bio.ts: OS version, user, location, processor, status, active processes, languages. Bio narrative below.

### Salvage Yard (Projects)
Projects from projects.ts displayed as "recovered artifacts". Each artifact clickable to open detail view within the panel. File icons based on extension.

### Systems Bay (Skills)
Skills from skills.ts displayed as "ROV subsystem diagnostics". Collapsible categories with ASCII progress bars.

### Arcade Rig (Games)
Same 5 games (FlappyTejas, TetrominoAI, PixelPong, DebugCircuit, TrainAgent). GameLauncher restyled with underwater theme.

### Comms Array (Contact)
Email link + social links (GitHub, LinkedIn, Instagram). Styled as radio transmission panel.

### The Trench (Easter Eggs)
- Hidden terminal
- ASCII circuit schematic
- Achievement for reaching it
- Only visible on mini-map after visiting all 5 other stations (or Konami code)

## Mobile Experience
- No free-roam (touch doesn't work well for this)
- Ocean-themed scroll page with depth gradient
- Stations as section cards at appropriate depth positions
- Floating bubbles/particles
- Bottom tab nav
- Same content panels

## Responsive
- Desktop (1024px+): Full free-roam 2D ocean
- Tablet (768-1023px): Free-roam with larger touch zones, simplified HUD
- Mobile (<768px): Scroll-based ocean with section cards

## Tutorial (first visit)
- Overlay with control instructions
- "Begin Dive" button
- Stored in localStorage so it only shows once

## Easter Eggs
- Konami Code: reveals The Trench immediately + amber theme shift
- The Trench: unlocks after visiting all 5 stations
- Hidden terminal (Ctrl+~): same commands as before
- Achievement system: discover all stations = "HADAL EXPLORER"

## SEO
- /resume page (server-rendered, clean layout)
- JSON-LD Person schema
- sitemap.xml, robots.txt
- Fast-travel nav ensures all content is link-accessible

## File Structure Changes

### Delete (OS theme)
- src/components/boot/*
- src/components/desktop/*
- src/components/windows/*
- src/components/apps/*
- src/components/mobile/* (replace)
- src/components/shared/* (replace)

### Keep
- src/data/* (all resume data)
- src/types/index.ts (extend)
- src/stores/settingsStore.ts, easterEggStore.ts (keep)
- src/components/arcade/games/* (all 5 games)
- src/hooks/useGameLoop.ts, useSound.ts, useKonamiCode.ts, useMediaQuery.ts
- src/lib/*
- src/app/resume/page.tsx, sitemap.ts, robots.ts

### Create
- src/components/ocean/ (OceanWorld, ROV, Camera, Station, Bubbles, SeaCreatures, LightRays, Seafloor, DepthGradient)
- src/components/hud/ (HUD, MiniMap, NavBar, DiscoveryLog, DockPrompt)
- src/components/panels/ (ContentPanel, ResearchLab, SalvageYard, ArtifactDetail, SystemsBay, ArcadeRig, CommsArray, TheTrench)
- src/components/mobile/ (MobileOcean, MobileNav)
- src/hooks/ (useROVControls, useCamera, useDiscovery)
- src/stores/oceanStore.ts

### Modify
- src/app/page.tsx (complete rewrite)
- src/app/globals.css (ocean theme)
- src/app/layout.tsx (minor metadata updates)
- tailwind.config.ts (ocean colors)
- src/stores/ (delete bootStore, windowStore)
