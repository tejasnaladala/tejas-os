# Underwater ROV Journey Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the BIOS/OS desktop simulation with a free-roam 2D underwater world where users pilot a pixel ROV through an ocean, discovering portfolio content at themed stations.

**Architecture:** DOM-based 2D world with CSS transforms for camera following. ROV stays centered on viewport, world translates around it. Zustand manages ROV position, station discovery, and panel state. Content panels slide in as overlays when docking. Mobile falls back to scroll-based ocean layout. Existing games and data files are reused unchanged.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Zustand, Howler.js, HTML5 Canvas (games only)

**Design Doc:** `docs/plans/2026-03-02-underwater-rov-design.md`

---

## Phase 1: Cleanup & Retheme

### Task 1: Delete Old OS Components + Update Theme

**Files:**
- Delete: `src/components/boot/*`, `src/components/desktop/*`, `src/components/windows/*`, `src/components/apps/*`, `src/components/mobile/*`, `src/components/shared/*`
- Delete: `src/stores/bootStore.ts`, `src/stores/windowStore.ts`
- Delete: `src/hooks/useDraggable.ts`, `src/hooks/useKeyboardNav.ts`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `src/lib/constants.ts`
- Modify: `src/types/index.ts`

**Step 1: Delete old components and stores**

```bash
rm -rf src/components/boot src/components/desktop src/components/windows src/components/apps src/components/mobile src/components/shared
rm src/stores/bootStore.ts src/stores/windowStore.ts
rm src/hooks/useDraggable.ts src/hooks/useKeyboardNav.ts
```

**Step 2: Replace globals.css with ocean theme**

Replace the entire file. Keep the Tailwind import and config directive. New CSS variables for ocean colors. Keep scrollbar styles. Replace CRT effects with underwater effects: bubble animation keyframes, light ray animation, creature drift, station pulse glow. Keep cursor-blink and reduced-motion rules.

New CSS custom properties:
```
--ocean-surface: #0a2463
--ocean-twilight: #0d1b3e
--ocean-midnight: #0a1128
--ocean-abyss: #020408
--bg-panel: #0a0f1a
--text-primary: #c8d6e5
--text-secondary: #5f7a94
--accent-cyan: #00d4ff
--accent-green: #00ff88
--accent-amber: #ffb000
--accent-red: #ff3366
--glow-cyan: rgba(0, 212, 255, 0.3)
--bubble: rgba(255, 255, 255, 0.15)
```

New keyframes needed:
- `@keyframes float-up` — bubble rising from bottom to top, 8-15s duration
- `@keyframes drift` — horizontal slow movement for sea creatures, 20-30s
- `@keyframes pulse-glow` — station marker pulsing box-shadow, 2s
- `@keyframes light-ray` — diagonal light sweep, 8s, shallow depth only
- `@keyframes bob` — gentle vertical bob for ROV idle, 3s

Body: `background: var(--ocean-surface); overflow: hidden;`

**Step 3: Update tailwind.config.ts with ocean colors**

Replace color tokens:
```ts
colors: {
  ocean: {
    surface: "var(--ocean-surface)",
    twilight: "var(--ocean-twilight)",
    midnight: "var(--ocean-midnight)",
    abyss: "var(--ocean-abyss)",
  },
  panel: "var(--bg-panel)",
  text: {
    primary: "var(--text-primary)",
    secondary: "var(--text-secondary)",
  },
  accent: {
    cyan: "var(--accent-cyan)",
    green: "var(--accent-green)",
    amber: "var(--accent-amber)",
    red: "var(--accent-red)",
  },
}
```

**Step 4: Update types/index.ts**

Remove WindowId, WindowState, DesktopIconConfig, BootPhase, WallpaperOption. Add:

```ts
export type StationId = "research" | "salvage" | "systems" | "arcade" | "comms" | "trench";

export interface StationConfig {
  id: StationId;
  label: string;
  icon: string;
  position: { x: number; y: number };
  description: string;
}

export interface ROVState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  isBoosting: boolean;
  facingDirection: "left" | "right";
}
```

Keep all existing types: Project, Skill, SkillCategory, Achievement, TimelineEntry, TerminalCommand.

**Step 5: Update constants.ts**

Keep SITE_CONFIG and BREAKPOINTS. Remove BOOT_CONFIG and WINDOW_CONFIG. Add:

```ts
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
  { id: "research", label: "Research Lab", icon: "🔬", position: { x: 1200, y: 500 }, description: "Pilot Profile & Bio" },
  { id: "salvage", label: "Salvage Yard", icon: "📦", position: { x: 2800, y: 1200 }, description: "Recovered Project Artifacts" },
  { id: "systems", label: "Systems Bay", icon: "🔧", position: { x: 4000, y: 700 }, description: "ROV Subsystem Diagnostics" },
  { id: "arcade", label: "Arcade Rig", icon: "🕹️", position: { x: 3500, y: 2100 }, description: "Recreation Module" },
  { id: "comms", label: "Comms Array", icon: "📡", position: { x: 900, y: 2600 }, description: "Transmission Hub" },
  { id: "trench", label: "The Trench", icon: "🌋", position: { x: 2500, y: 3200 }, description: "Classified Zone" },
];
```

**Step 6: Update page.tsx to a temporary placeholder**

```tsx
"use client";
export default function Home() {
  return (
    <main className="h-screen w-screen flex items-center justify-center bg-ocean-surface">
      <p className="text-accent-cyan font-mono">Rebuilding... Ocean loading.</p>
    </main>
  );
}
```

**Step 7: Verify build passes**

Run: `npm run build`
Expected: Compiles with no errors. May have warnings about unused imports — that's OK.

**Step 8: Commit**

```bash
git add -A
git commit -m "refactor: remove OS theme, add ocean design tokens and types"
```

---

## Phase 2: Ocean Store + ROV Hooks

### Task 2: Create Ocean Store

**Files:**
- Create: `src/stores/oceanStore.ts`

**Step 1: Write oceanStore**

```ts
import { create } from "zustand";
import { StationId } from "@/types";
import { OCEAN_CONFIG } from "@/lib/constants";

interface OceanState {
  // ROV
  rovX: number;
  rovY: number;
  rovVelX: number;
  rovVelY: number;
  isBoosting: boolean;
  facingRight: boolean;

  // Stations
  activeStation: StationId | null;
  discoveredStations: StationId[];
  isPanelOpen: boolean;

  // Tutorial
  hasSeenTutorial: boolean;

  // Actions
  setRovPosition: (x: number, y: number) => void;
  setRovVelocity: (vx: number, vy: number) => void;
  setBoosting: (b: boolean) => void;
  setFacingRight: (r: boolean) => void;
  dockAtStation: (id: StationId) => void;
  undock: () => void;
  discoverStation: (id: StationId) => void;
  dismissTutorial: () => void;
  fastTravel: (x: number, y: number) => void;
  isStationDiscovered: (id: StationId) => boolean;
  allDiscovered: () => boolean;
}

export const useOceanStore = create<OceanState>((set, get) => ({
  rovX: OCEAN_CONFIG.spawnPosition.x,
  rovY: OCEAN_CONFIG.spawnPosition.y,
  rovVelX: 0,
  rovVelY: 0,
  isBoosting: false,
  facingRight: true,

  activeStation: null,
  discoveredStations: [],
  isPanelOpen: false,

  hasSeenTutorial: typeof window !== "undefined"
    ? localStorage.getItem("tejas-ocean-tutorial") === "true"
    : false,

  setRovPosition: (x, y) => set({ rovX: x, rovY: y }),
  setRovVelocity: (vx, vy) => set({ rovVelX: vx, rovVelY: vy }),
  setBoosting: (b) => set({ isBoosting: b }),
  setFacingRight: (r) => set({ facingRight: r }),

  dockAtStation: (id) => {
    const s = get();
    if (!s.discoveredStations.includes(id)) {
      set({ discoveredStations: [...s.discoveredStations, id] });
    }
    set({ activeStation: id, isPanelOpen: true });
  },

  undock: () => set({ activeStation: null, isPanelOpen: false }),

  discoverStation: (id) => {
    const s = get();
    if (!s.discoveredStations.includes(id)) {
      set({ discoveredStations: [...s.discoveredStations, id] });
    }
  },

  dismissTutorial: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tejas-ocean-tutorial", "true");
    }
    set({ hasSeenTutorial: true });
  },

  fastTravel: (x, y) => set({ rovX: x, rovY: y, rovVelX: 0, rovVelY: 0 }),

  isStationDiscovered: (id) => get().discoveredStations.includes(id),

  allDiscovered: () => {
    const discovered = get().discoveredStations;
    return ["research", "salvage", "systems", "arcade", "comms"].every((s) =>
      discovered.includes(s as StationId)
    );
  },
}));
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add ocean store for ROV position, stations, discovery"
```

---

### Task 3: Create ROV Control + Camera Hooks

**Files:**
- Create: `src/hooks/useROVControls.ts`
- Create: `src/hooks/useCamera.ts`
- Create: `src/hooks/useDiscovery.ts`

**Step 1: Write useROVControls**

Hook that:
- Listens for WASD/Arrow key presses (keydown/keyup)
- Tracks which keys are currently held via a Set ref
- On each animation frame: apply acceleration based on held keys, apply friction, clamp to world bounds, update oceanStore position/velocity
- Shift key toggles boost
- Enter key: check if near a station → dockAtStation
- Escape key: if panel open → undock
- Returns: nothing (side-effect hook, all state in store)
- Uses requestAnimationFrame for physics loop
- Disabled when panel is open (no movement while docked)
- Updates facingRight based on horizontal input

**Step 2: Write useCamera**

Hook that:
- Reads rovX, rovY from oceanStore
- Computes camera transform: `translate(-(rovX - viewportW/2), -(rovY - viewportH/2))`
- Clamps camera to world bounds so you don't see outside the ocean
- Returns: `{ cameraX: number, cameraY: number, transform: string }`
- Uses window.innerWidth/Height, updates on resize

**Step 3: Write useDiscovery**

Hook that:
- On each frame (or position change), checks distance from ROV to each station
- If within OCEAN_CONFIG.dockRange, sets nearbyStation state
- Returns: `{ nearbyStation: StationConfig | null }`
- Used by DockPrompt and Station glow intensification

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add ROV controls, camera follow, and station discovery hooks"
```

---

## Phase 3: Ocean World Core

### Task 4: Build Ocean World + ROV + Depth Gradient

**Files:**
- Create: `src/components/ocean/DepthGradient.tsx`
- Create: `src/components/ocean/ROV.tsx`
- Create: `src/components/ocean/OceanWorld.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Write DepthGradient**

Fixed full-screen background that interpolates color based on ROV depth (rovY from store).
- 0-500: ocean-surface → ocean-twilight
- 500-1500: ocean-twilight → ocean-midnight
- 1500-2500: ocean-midnight → ocean-abyss
- 2500+: ocean-abyss
- Uses CSS `background` with computed color via lerp function
- Updates reactively as ROV moves

**Step 2: Write ROV**

The player's ROV sprite, positioned in world space:
- Absolutely positioned div at (rovX, rovY)
- ASCII art ROV shape or simple CSS geometric shape:
  ```
  Facing right:  ◁═══▷  or a styled div with triangle nose
  Facing left:   ◁═══▷  (mirrored)
  ```
- Subtle `bob` animation when idle (no velocity)
- Tilts slightly in movement direction (CSS rotate based on velocity angle)
- Small bubble trail divs spawned behind it when moving (2-3 dots that fade out)
- Uses accent-cyan color with glow-cyan box-shadow
- Size: approximately 40x20px

**Step 3: Write OceanWorld**

The main container:
- A wrapper div with `overflow: hidden`, fills viewport
- Inside: a "world" div sized 5000x3500, positioned via CSS transform from useCamera
- Contains: ROV, stations (added next task), ambient elements (added later)
- Renders DepthGradient behind everything

**Step 4: Wire into page.tsx**

```tsx
"use client";
import { useEffect } from "react";
import OceanWorld from "@/components/ocean/OceanWorld";
import { useROVControls } from "@/hooks/useROVControls";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BREAKPOINTS } from "@/lib/constants";

export default function Home() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
  useROVControls();
  useKonamiCode();

  if (isMobile) {
    return <div className="text-accent-cyan p-4">Mobile coming soon...</div>;
  }

  return <OceanWorld />;
}
```

**Step 5: Verify ROV moves with keyboard**

Run: `npm run dev`
Expected: Dark blue screen. ROV visible. WASD/arrows move it. Background color shifts as you go deeper.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add ocean world, ROV sprite, depth gradient, keyboard controls"
```

---

### Task 5: Build Stations

**Files:**
- Create: `src/components/ocean/Station.tsx`

**Step 1: Write Station component**

Renders a single station marker in the world:
- Positioned absolutely at station's (x, y) coordinates
- Shows emoji icon + label text below
- Pulsing glow animation (`pulse-glow` keyframe) using station-appropriate color
- When ROV is nearby (from useDiscovery): glow intensifies, border brightens
- Clickable: calls dockAtStation(id) from oceanStore
- If station is "trench" and not all other stations discovered: render as dim/hidden unless Konami/founder mode active
- Discovered stations: accent-green border. Undiscovered: dim border.

Props: `station: StationConfig`

Add all 6 stations inside OceanWorld, mapping from STATIONS constant.

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add interactive station markers in ocean world"
```

---

## Phase 4: Ambient Effects

### Task 6: Build Bubbles, Sea Creatures, Light Rays, Seafloor

**Files:**
- Create: `src/components/ocean/Bubbles.tsx`
- Create: `src/components/ocean/SeaCreatures.tsx`
- Create: `src/components/ocean/LightRays.tsx`
- Create: `src/components/ocean/Seafloor.tsx`

**Step 1: Write Bubbles**

15-20 absolutely positioned divs scattered across the world:
- Each bubble: small circle (4-12px), white, opacity 0.1-0.3
- CSS `float-up` animation: translates Y from current position upward by 600-1200px, then resets
- Random animation duration (8-15s), random delay
- Spread across the full world width, various starting depths
- `pointer-events: none`

**Step 2: Write SeaCreatures**

4-5 ASCII art creatures at fixed depths in the world:
- Small fish `><>` at y=400, drifts right slowly
- Jellyfish `{~}` at y=900, pulses opacity
- Larger fish `<°)))><` at y=1600, drifts left
- Octopus `🐙` at y=2300, subtle wobble
- Angler fish `*<{{{{><` at y=3000, bioluminescent glow pulse (accent-amber)
- Each creature: absolutely positioned, CSS `drift` animation (slow horizontal movement), `pointer-events: none`

**Step 3: Write LightRays**

2-3 diagonal gradient streaks at shallow depths (y < 800):
- `position: absolute`, angled with CSS `rotate(20deg)` etc.
- White background, 3% opacity
- Slow CSS animation (sway/pulse)
- Only rendered in the top portion of the world
- `pointer-events: none`

**Step 4: Write Seafloor**

Rendered at y=3400:
- Full-width div (5000px)
- Repeating CSS gradient simulating sandy/rocky terrain
- Dark brown/gray tones
- Maybe some ASCII coral: `🪸` or `∿∿∿` decorations

**Step 5: Add all ambient elements to OceanWorld**

Import and render Bubbles, SeaCreatures, LightRays, Seafloor inside the world div.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add ambient ocean effects — bubbles, creatures, light rays, seafloor"
```

---

## Phase 5: HUD

### Task 7: Build HUD + Mini-Map + Nav

**Files:**
- Create: `src/components/hud/HUD.tsx`
- Create: `src/components/hud/MiniMap.tsx`
- Create: `src/components/hud/NavBar.tsx`
- Create: `src/components/hud/DiscoveryLog.tsx`
- Create: `src/components/hud/DockPrompt.tsx`
- Create: `src/components/hud/Tutorial.tsx`

**Step 1: Write HUD**

Fixed top-left overlay:
- `DEPTH: {rovY}m` — updates reactively from oceanStore
- `X:{rovX} Y:{rovY}` coordinates below
- Styled: uppercase, text-xs, letter-spacing wide, text-accent-cyan, opacity 0.7
- `pointer-events: none`

**Step 2: Write MiniMap**

Fixed bottom-right overlay (~180x130px):
- Dark semi-transparent background with border
- Shows proportional positions of all stations as small dots:
  - Undiscovered: dim gray dot
  - Discovered: bright green dot
  - Active (docked): cyan dot with glow
- ROV position: small cyan triangle/dot
- Scale: world coordinates → minimap coordinates (5000→180, 3500→130)
- "DEPTH: {rovY}m" text below
- Clickable: clicking a station dot calls fastTravel to that station's position
- If trench is hidden, don't show its dot

**Step 3: Write NavBar**

Fixed top-right overlay:
- Horizontal list of section links: `about · projects · skills · arcade · contact`
- Monospace, text-xs, text-text-secondary
- Hover: text-accent-cyan
- Click: fastTravel to corresponding station position + dockAtStation
- `pointer-events: auto` (must be clickable)

**Step 4: Write DiscoveryLog**

Fixed bottom-left overlay:
- `STATIONS: {discovered.length}/6`
- Small text, accent-green if all discovered
- Shows "HADAL EXPLORER" badge text when all 6 discovered

**Step 5: Write DockPrompt**

Appears when ROV is near a station (from useDiscovery):
- Centered horizontally, positioned below center of screen
- Shows: `PRESS ENTER TO DOCK — {station.label}`
- Monospace, text-sm, accent-cyan, subtle background
- Framer Motion fade-in/out
- Only shows when nearbyStation is not null and panel is not open

**Step 6: Write Tutorial**

Overlay shown on first visit (if !hasSeenTutorial):
- Semi-transparent dark backdrop
- Centered card with:
  ```
  ╔═══════════════════════════════════╗
  ║  WASD / Arrow Keys — Navigate    ║
  ║  SHIFT — Boost                   ║
  ║  ENTER — Dock at stations        ║
  ║  ESC — Undock                    ║
  ║                                  ║
  ║  Discover all stations to        ║
  ║  unlock The Trench               ║
  ║                                  ║
  ║        [ BEGIN DIVE ]            ║
  ╚═══════════════════════════════════╝
  ```
- "BEGIN DIVE" button calls dismissTutorial()
- Framer Motion fade-in

**Step 7: Add all HUD components to page.tsx (or OceanWorld)**

Render: HUD, MiniMap, NavBar, DiscoveryLog, DockPrompt, Tutorial — all as fixed overlays on top of OceanWorld.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add HUD — depth display, mini-map, nav bar, discovery log, dock prompt, tutorial"
```

---

## Phase 6: Content Panels

### Task 8: Build Content Panel Shell

**Files:**
- Create: `src/components/panels/ContentPanel.tsx`

**Step 1: Write ContentPanel**

The slide-in overlay that appears when docked at a station:
- Fixed positioned, right side, 60% width on desktop, 100% on mobile
- Full height
- Background: bg-panel with border-left border-accent-cyan/20
- Framer Motion: slides in from right (x: "100%" → 0)
- Header: station icon + label + close button (✕)
- Scrollable content area below header
- Backdrop: semi-transparent overlay covering the ocean (click to close)
- Close: calls undock() from oceanStore
- Children: renders the appropriate station content based on activeStation

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add slide-in content panel shell"
```

---

### Task 9: Build All Station Content Panels

**Files:**
- Create: `src/components/panels/ResearchLab.tsx`
- Create: `src/components/panels/SalvageYard.tsx`
- Create: `src/components/panels/ArtifactDetail.tsx`
- Create: `src/components/panels/SystemsBay.tsx`
- Create: `src/components/panels/ArcadeRig.tsx`
- Create: `src/components/panels/CommsArray.tsx`
- Create: `src/components/panels/TheTrench.tsx`

**Step 1: Write ResearchLab (About)**

Same content as old SystemInfo but themed as "Pilot Profile":
- System info table from bio.ts (OS, Build, User, Location, Processor, Status, Uptime, Active Processes, Languages)
- Bio tagline + full description
- Hidden schematic easter egg (5 clicks on Processor)

**Step 2: Write SalvageYard (Projects)**

Projects as "recovered artifacts":
- List of projects from projects.ts
- Each shown as a clickable artifact card: icon (by extension), filename.extension, title
- Click: shows ArtifactDetail inline (replaces list with detail view, back button)

**Step 3: Write ArtifactDetail**

Detail view for a single project:
- Title, role, date
- Description
- Metrics (bulleted)
- Tech tags
- Links
- Back button to return to SalvageYard list

**Step 4: Write SystemsBay (Skills)**

Same as old SkillsMap but themed as "ROV Subsystem Diagnostics":
- Collapsible categories with ASCII progress bars
- Uses skillCategories from skills.ts

**Step 5: Write ArcadeRig (Games)**

Wrapper around existing GameLauncher component:
- Restyled header: "RECREATION MODULE" instead of generic arcade
- Imports and renders the existing GameLauncher
- The GameLauncher already handles lazy-loading games

**Step 6: Write CommsArray (Contact)**

Radio transmission themed contact panel:
- `INCOMING TRANSMISSION` header
- Email: link to mailto:tejas.naladala@gmail.com
- Social links: GitHub, LinkedIn, Instagram — each with descriptive labels
- Maybe: a fun "signal strength" ASCII bar

**Step 7: Write TheTrench (Easter Eggs)**

The classified zone:
- Terminal access (reuse existing Terminal component from terminalCommands.ts)
- ASCII circuit schematic reveal
- Achievement notification: "HADAL EXPLORER — You've reached the deepest point"
- Only accessible when all 5 other stations discovered or via Konami code

**Step 8: Wire all panels into ContentPanel**

ContentPanel reads `activeStation` from oceanStore and renders the matching content component.

**Step 9: Add ContentPanel to page.tsx**

Render ContentPanel as an overlay, visible when `isPanelOpen` is true.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: add all station content panels — about, projects, skills, arcade, contact, trench"
```

---

## Phase 7: Mobile Experience

### Task 10: Build Mobile Ocean Layout

**Files:**
- Create: `src/components/mobile/MobileOcean.tsx`
- Create: `src/components/mobile/MobileNav.tsx` (replace old one)
- Modify: `src/app/page.tsx`

**Step 1: Write MobileNav**

Bottom tab bar with 5 tabs: About, Projects, Skills, Games, Contact
- Icons + labels
- Active tab highlighted with accent-cyan
- Fixed bottom, h-14

**Step 2: Write MobileOcean**

Ocean-themed scroll experience for mobile:
- Vertical scroll page with depth gradient background
- Stations rendered as section cards at appropriate vertical positions
- Each card: station icon + label + description + "OPEN" button
- Opening a card shows the same content panel (fullscreen on mobile)
- Floating bubbles (CSS animation, fewer than desktop)
- Header: "TEJAS NALADALA" + "Founder · Engineer · Builder"

**Step 3: Update page.tsx**

Use useMediaQuery to switch:
- Desktop: OceanWorld + all HUD + ContentPanel
- Mobile: MobileOcean + MobileNav

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add mobile ocean scroll experience with bottom nav"
```

---

## Phase 8: Polish & Integration

### Task 11: Final Wiring + Easter Eggs + Sound Integration

**Files:**
- Modify: `src/app/page.tsx` (finalize)
- Modify: `src/hooks/useKonamiCode.ts` (adapt for ocean)
- Modify: `src/app/layout.tsx` (if needed)

**Step 1: Adapt useKonamiCode for ocean**

On Konami code success:
- Call `activateFounderMode()` from easterEggStore (unchanged)
- Also: make The Trench visible on mini-map immediately
- Brief visual flash: "CLASSIFIED ACCESS GRANTED" overlay (similar to old "FOUNDER MODE ACTIVATED")

**Step 2: Integrate sound hook**

Add useSound() to page.tsx or OceanWorld. Play sounds on:
- Docking at station: "windowOpen" sound
- Undocking: "windowClose" sound
- Discovery of new station: "success" sound

**Step 3: Update page.tsx with all components**

Final page.tsx structure for desktop:
```tsx
<main>
  <OceanWorld />      {/* world + ROV + stations + ambient */}
  <HUD />             {/* depth, coordinates */}
  <MiniMap />          {/* corner map */}
  <NavBar />           {/* fast-travel links */}
  <DiscoveryLog />     {/* station count */}
  <DockPrompt />       {/* dock hint */}
  <ContentPanel />     {/* slide-in content */}
  <Tutorial />         {/* first-visit overlay */}
</main>
```

**Step 4: Hydrate settings from localStorage**

Same as before: read sound setting on mount.

**Step 5: Verify everything works end-to-end**

Run: `npm run dev`
Test:
- ROV moves with WASD
- Depth gradient changes with depth
- Stations visible and glowing
- Approaching station shows dock prompt
- Enter docks, content panel slides in
- Escape undocks
- Mini-map shows positions, clickable for fast-travel
- Nav bar links fast-travel
- Discovery count updates
- The Trench hidden until all 5 discovered (or Konami)
- Konami code works
- Mobile shows scroll layout
- /resume page still works

**Step 6: Build check**

Run: `npm run build`
Expected: Clean build, zero errors.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: finalize ocean experience — sound, easter eggs, full integration"
```

---

## Summary

| Phase | Task | Description | Commits |
|-------|------|-------------|---------|
| 1 | Task 1 | Cleanup old OS, retheme to ocean | 1 |
| 2 | Tasks 2-3 | Ocean store + ROV/camera/discovery hooks | 2 |
| 3 | Tasks 4-5 | Ocean world, ROV, depth gradient, stations | 2 |
| 4 | Task 6 | Ambient effects (bubbles, creatures, seafloor) | 1 |
| 5 | Task 7 | HUD (depth, minimap, nav, discovery, tutorial) | 1 |
| 6 | Tasks 8-9 | Content panels (all 6 stations) | 2 |
| 7 | Task 10 | Mobile ocean layout | 1 |
| 8 | Task 11 | Final integration + polish | 1 |
| **Total** | **11 tasks** | | **11 commits** |
