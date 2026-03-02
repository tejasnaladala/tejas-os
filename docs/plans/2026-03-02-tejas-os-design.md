# TejasOS - Personal Portfolio Website Design

**Date:** 2026-03-02
**Domain:** tejasnaladala.com
**Status:** Approved

## Overview

OS-style personal portfolio website that simulates booting into a creative desktop operating system. Combines retro CRT/BIOS aesthetics with modern web performance. Gamified with arcade games, easter eggs, and hidden interactions. Recruiter-friendly with escape hatch.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | Native Vercel deploy, SSG for SEO, metadata API |
| Language | TypeScript | Full type safety across OS simulation, games, state |
| Styling | Tailwind CSS + CSS custom properties | Utility-first + CRT variables (scanlines, glow) |
| Animation | Framer Motion + CSS keyframes | Declarative React for windows, CSS for CRT effects |
| State | Zustand | ~1KB, no re-render storms during window dragging |
| Games | Pure HTML5 Canvas API | Zero dependency, lazy-loaded, fully isolated |
| Audio | Howler.js (~7KB) | Cross-browser Web Audio wrapper, sprite support |
| SEO | Next.js metadata + JSON-LD | Server-rendered meta, OpenGraph images |

## Boot Flow

### Phase 1 - Power On (~0.5s)
Black screen. CRT turn-on effect (horizontal white line expands). POST beep.

### Phase 2 - BIOS POST (~4s, skippable)
Green monospace text on black. Sequential typewriter:
- RAM check counting up to 16384 MB
- Loading Embedded Systems Modules... OK
- Loading AI Agents... OK
- Loading Founder Mode... OK
- Initializing PlasmaX Reactor... OK
- Calibrating Underwater ROV... OK
- "All systems nominal."

### Phase 3 - Desktop Load (~1.5s)
Screen flicker. Desktop fades in. Taskbar slides up. Icons stagger pop-in.

Returning visitors: Skip to desktop via sessionStorage check.

## Desktop Environment

### Layout
- 6 desktop icons in 2x3 grid (left-aligned, Win95 style)
- Bottom taskbar: Start button | open windows | sound + social tray + clock
- Draggable, resizable, stackable windows

### Icon Map
| Icon | Opens |
|------|-------|
| Projects (folder) | Folder window with project file entries |
| Resume.exe | Formatted resume window |
| System Info | About panel (system properties style) |
| Mail (envelope) | mailto:tejas.naladala@gmail.com |
| Arcade (joystick) | Game launcher window |
| Skills (wrench) | Device manager style skill tree |

### Window System
- Draggable via title bar (desktop only)
- Minimize / maximize / close buttons
- Click to bring to front (z-index stack)
- Minimize sends to taskbar
- Max 3-4 open simultaneously

### Responsive
- Desktop (1024px+): Full OS, draggable windows
- Tablet (768-1023px): Auto-maximized windows, bottom nav
- Mobile (<768px): Full-screen card stack, bottom tab bar

### Recruiter Escape Hatch
"View as Resume" in Start menu opens /resume route - clean, traditional single-page view.

## Visual Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| --bg-primary | #0a0a0f | Desktop background |
| --bg-surface | #12121a | Window backgrounds |
| --bg-elevated | #1a1a2e | Title bars, taskbar |
| --border | #2a2a3e | Dividers |
| --text-primary | #e0e0e8 | Body text |
| --text-secondary | #8888a0 | Labels |
| --accent-green | #00ff41 | Terminal text, boot |
| --accent-amber | #ffb000 | Warnings, highlights |
| --accent-cyan | #00d4ff | Links, interactive |
| --accent-red | #ff0040 | Errors, close buttons |

### CRT Effects (Modernized)
- Scanline overlay: 1px repeating lines, 3-5% opacity
- Phosphor glow: text-shadow on terminal text only
- Screen vignette: radial gradient edge darkening
- CRT turn-on/off animation
- All effects respect prefers-reduced-motion

### Typography
- System: JetBrains Mono (400, 500, 700)
- Games: Press Start 2P (loaded on demand)
- Recruiter view: Inter

### Sound
- Audio sprite (~50KB): POST beep, boot success, window open/close, error, game sounds
- Howler.js playback
- Default: muted. User opts in via taskbar toggle.
- Persists to localStorage.

## Resume Content Mapping

### Identity
- Name: Tejas Naladala
- Location: Seattle, WA
- Email: tejas.naladala@gmail.com
- GitHub: github.com/tejasnaladala
- LinkedIn: linkedin.com/in/tejasnaladala
- Instagram: @simplytejxs

### Education
- UW Seattle, B.S. ECE + Applied Math (Double Major), GPA 3.93, Sep 2024 - Jun 2028
- Lavin Entrepreneurship Fellow

### Projects (6 entries)
1. PlasmaX (Founder & CEO, May 2023-Present): Industrial plasma water disinfection. $2M seed, $8M valuation. Patent filed. 3 publications.
2. Cerulean Robotics (Founder, Nov 2025-Present): Open-source underwater ROV, $2-5K, 80-100m depth.
3. Atticus AI (Founder, Jan 2026-Present): AI insurance policy auditor. Next.js 14, multi-model AI.
4. Forge (Feb 2026): Open-source AI agent runtime, 4,400+ LOC, 8 LLM providers, 150+ clones.
5. SEAL Lab (Research Associate, Mar-Nov 2025): Embedded sensing, PPG drowsiness detection, Navy hull sensors.
6. NIIST India (Research Intern, Jun 2024-Mar 2025): Solar cell fabrication, 20+ device architectures.

### Skills (5 categories)
- Languages & Frameworks: Python, TypeScript/JS, C/C++, Java, SQL, MATLAB, Next.js/React, FastAPI/Node
- Embedded & Hardware: Circuit design, PCB (KiCad), STM32/Arduino/RPi, Pixhawk/ArduSub, power electronics
- AI & ML: LLM orchestration, multi-agent systems, RAG, TensorFlow/OpenCV, document AI
- Design & Fabrication: Fusion360/SolidWorks, 3D printing, CNC/lathe/laser, soldering
- DevOps: Git/GitHub, Docker, Linux, ROS/Gazebo

### Achievements
- $2M raised at $8M valuation
- 3 peer-reviewed publications
- UW S&T Grand Prize + Best Pitch
- Patent filed (venturi-plasma)
- Lavin Fellow (1 of ~20/year)
- 150+ Forge clones in week 1
- 3.93 GPA double major
- Trilingual (English, Hindi, Telugu)

## Games

### Easy Mode
1. Flappy Tejas: Flappy bird with rocket/drone sprite, circuit board obstacles. ~200 LOC Canvas.
2. Tetromino.AI: Tetris with circuit/AI-themed blocks. ~350 LOC Canvas.
3. Pixel Pong: Breakout variant, circuit block patterns, power-ups. ~180 LOC Canvas.

### Hard Mode
4. Debug the Circuit: Logic puzzle, find bugs in circuit diagrams, 10 levels. ~400 LOC Canvas.
5. Train the Agent: Click-based Q-learning simulator with reward graph. ~300 LOC Canvas.
6. Hidden Challenge: Unlock via easter egg. Timed assembly instruction puzzle.

### Performance Strategy
- Each game: dynamic import with { ssr: false }
- Own requestAnimationFrame loop, isolated from React
- Own chunk, tree-shaken from main bundle
- Shared hooks: useGameLoop, useGameAudio

## Easter Eggs

1. Konami Code (up up down down left right left right B A): Activates Founder Mode - amber theme, circuit wallpaper, "Classified" folder with hidden game.
2. Hidden Terminal (Ctrl+~ or type ">_" in Start): Command-line with whoami, ls, cat, neofetch, help, sudo rm -rf / (joke response).
3. Right-click Context Menu: Refresh, Change Wallpaper, View Source (GitHub), About TejasOS.
4. Hidden Schematic: Click "Processor" in System Info 5 times to reveal ASCII circuit diagram.

## File Structure

```
tejas-os/
├── public/
│   ├── resume.pdf
│   ├── og-image.png
│   ├── favicon.ico
│   └── sounds/sprite.mp3
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── resume/page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── boot/ (BootScreen, BiosPost, CrtPowerOn)
│   │   ├── desktop/ (Desktop, Taskbar, StartMenu, DesktopIcon, ContextMenu)
│   │   ├── windows/ (Window, WindowManager, TitleBar)
│   │   ├── apps/ (SystemInfo, ProjectsFolder, ProjectDetail, ResumeApp, SkillsMap, Timeline, Achievements, Terminal)
│   │   ├── arcade/ (GameLauncher, games/*)
│   │   ├── shared/ (CrtOverlay, SoundToggle)
│   │   └── mobile/ (MobileNav, MobileShell)
│   ├── stores/ (windowStore, bootStore, settingsStore, easterEggStore)
│   ├── hooks/ (useKonamiCode, useDraggable, useResizable, useGameLoop, useSound, useMediaQuery, useKeyboardNav)
│   ├── data/ (projects, skills, timeline, achievements, terminalCommands, bio)
│   ├── lib/ (sounds, constants)
│   └── types/index.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Deployment

- Platform: Vercel
- Domain: tejasnaladala.com
- Build: next build (static export where possible)
- No environment variables needed
- Performance target: Lighthouse 95+
