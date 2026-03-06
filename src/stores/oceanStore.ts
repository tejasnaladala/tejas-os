import { create } from "zustand";
import { StationId } from "@/types";
import { OCEAN_CONFIG } from "@/lib/constants";

interface OceanState {
  // ROV state
  rovX: number;
  rovY: number;
  rovVX: number;
  rovVY: number;
  isBoosting: boolean;
  facingDirection: "left" | "right";
  speedMultiplier: number;

  // Station state
  activeStation: StationId | null;
  nearStation: StationId | null;
  discoveredStations: Set<StationId>;

  // Panel state
  panelOpen: boolean;
  panelStation: StationId | null;

  // UI state
  tutorialDismissed: boolean;
  hudVisible: boolean;
  fpvMode: boolean;
  guidedTutorialActive: boolean;
  guidedTutorialStep: number;
  minimapExpanded: boolean;
  musicPlaying: boolean;
  peacefulMode: boolean;
  commandPaletteOpen: boolean;

  // Combat state
  rovLives: number;
  rovAlive: boolean;
  gameOverVisible: boolean;

  // Actions
  setRovPosition: (x: number, y: number) => void;
  setRovVelocity: (vx: number, vy: number) => void;
  setIsBoosting: (boosting: boolean) => void;
  setFacingDirection: (dir: "left" | "right") => void;
  setSpeedMultiplier: (mult: number) => void;
  setNearStation: (id: StationId | null) => void;
  dockAtStation: (id: StationId) => void;
  undock: () => void;
  discoverStation: (id: StationId) => void;
  openPanel: (id: StationId) => void;
  closePanel: () => void;
  dismissTutorial: () => void;
  toggleHud: () => void;
  toggleFpvMode: () => void;
  startGuidedTutorial: () => void;
  nextGuidedStep: () => void;
  endGuidedTutorial: () => void;
  toggleMinimap: () => void;
  toggleMusic: () => void;
  togglePeacefulMode: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  loseLife: () => void;
  respawnROV: () => void;
  resetOcean: () => void;
}

export const useOceanStore = create<OceanState>((set) => ({
  // Initial ROV state
  rovX: OCEAN_CONFIG.spawnPosition.x,
  rovY: OCEAN_CONFIG.spawnPosition.y,
  rovVX: 0,
  rovVY: 0,
  isBoosting: false,
  facingDirection: "right",
  speedMultiplier: 2,

  // Station state
  activeStation: null,
  nearStation: null,
  discoveredStations: new Set<StationId>(),

  // Panel state
  panelOpen: false,
  panelStation: null,

  // UI state
  tutorialDismissed: false,
  hudVisible: true,
  fpvMode: false,
  guidedTutorialActive: false,
  guidedTutorialStep: 0,
  minimapExpanded: false,
  musicPlaying: false,
  peacefulMode: typeof window !== "undefined" ? localStorage.getItem("peacefulMode") === "true" : false,
  commandPaletteOpen: false,

  // Combat state
  rovLives: 3,
  rovAlive: true,
  gameOverVisible: false,

  // Actions
  setRovPosition: (x, y) => set({ rovX: x, rovY: y }),
  setRovVelocity: (vx, vy) => set({ rovVX: vx, rovVY: vy }),
  setIsBoosting: (boosting) => set({ isBoosting: boosting }),
  setFacingDirection: (dir) => set({ facingDirection: dir }),
  setSpeedMultiplier: (mult) => set({ speedMultiplier: Math.max(0.3, Math.min(2, mult)) }),

  setNearStation: (id) => set({ nearStation: id }),

  dockAtStation: (id) =>
    set((state) => ({
      activeStation: id,
      nearStation: id,
      panelOpen: true,
      panelStation: id,
      discoveredStations: new Set([...state.discoveredStations, id]),
      rovVX: 0,
      rovVY: 0,
    })),

  undock: () =>
    set({
      activeStation: null,
      panelOpen: false,
      panelStation: null,
    }),

  discoverStation: (id) =>
    set((state) => ({
      discoveredStations: new Set([...state.discoveredStations, id]),
    })),

  openPanel: (id) =>
    set((state) => ({
      panelOpen: true,
      panelStation: id,
      discoveredStations: new Set([...state.discoveredStations, id]),
    })),

  closePanel: () =>
    set({
      panelOpen: false,
      panelStation: null,
      activeStation: null,
    }),

  dismissTutorial: () => set({ tutorialDismissed: true }),
  toggleHud: () => set((state) => ({ hudVisible: !state.hudVisible })),
  toggleFpvMode: () => set((state) => ({ fpvMode: !state.fpvMode })),

  startGuidedTutorial: () => set({ guidedTutorialActive: true, guidedTutorialStep: 0, tutorialDismissed: true }),
  nextGuidedStep: () => set((state) => ({ guidedTutorialStep: state.guidedTutorialStep + 1 })),
  endGuidedTutorial: () => set({ guidedTutorialActive: false, guidedTutorialStep: 0 }),

  toggleMinimap: () => set((state) => ({ minimapExpanded: !state.minimapExpanded })),
  toggleMusic: () => set((state) => ({ musicPlaying: !state.musicPlaying })),

  togglePeacefulMode: () =>
    set((state) => {
      const next = !state.peacefulMode;
      if (typeof window !== "undefined") localStorage.setItem("peacefulMode", String(next));
      return { peacefulMode: next };
    }),

  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  loseLife: () =>
    set((state) => {
      const newLives = Math.max(0, state.rovLives - 1);
      return {
        rovLives: newLives,
        rovAlive: newLives > 0,
        gameOverVisible: newLives <= 0,
      };
    }),

  respawnROV: () =>
    set({
      rovLives: 3,
      rovAlive: true,
      gameOverVisible: false,
      rovX: OCEAN_CONFIG.spawnPosition.x,
      rovY: OCEAN_CONFIG.spawnPosition.y,
      rovVX: 0,
      rovVY: 0,
    }),

  resetOcean: () =>
    set({
      rovX: OCEAN_CONFIG.spawnPosition.x,
      rovY: OCEAN_CONFIG.spawnPosition.y,
      rovVX: 0,
      rovVY: 0,
      isBoosting: false,
      facingDirection: "right",
      speedMultiplier: 2,
      activeStation: null,
      nearStation: null,
      discoveredStations: new Set<StationId>(),
      panelOpen: false,
      panelStation: null,
      tutorialDismissed: false,
      hudVisible: true,
      fpvMode: false,
      guidedTutorialActive: false,
      guidedTutorialStep: 0,
      minimapExpanded: false,
      musicPlaying: false,
      commandPaletteOpen: false,
      rovLives: 3,
      rovAlive: true,
      gameOverVisible: false,
    }),
}));
