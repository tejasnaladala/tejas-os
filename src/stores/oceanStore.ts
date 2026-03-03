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

  // Actions
  setRovPosition: (x: number, y: number) => void;
  setRovVelocity: (vx: number, vy: number) => void;
  setIsBoosting: (boosting: boolean) => void;
  setFacingDirection: (dir: "left" | "right") => void;
  setNearStation: (id: StationId | null) => void;
  dockAtStation: (id: StationId) => void;
  undock: () => void;
  discoverStation: (id: StationId) => void;
  openPanel: (id: StationId) => void;
  closePanel: () => void;
  dismissTutorial: () => void;
  toggleHud: () => void;
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

  // Actions
  setRovPosition: (x, y) => set({ rovX: x, rovY: y }),
  setRovVelocity: (vx, vy) => set({ rovVX: vx, rovVY: vy }),
  setIsBoosting: (boosting) => set({ isBoosting: boosting }),
  setFacingDirection: (dir) => set({ facingDirection: dir }),

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

  resetOcean: () =>
    set({
      rovX: OCEAN_CONFIG.spawnPosition.x,
      rovY: OCEAN_CONFIG.spawnPosition.y,
      rovVX: 0,
      rovVY: 0,
      isBoosting: false,
      facingDirection: "right",
      activeStation: null,
      nearStation: null,
      discoveredStations: new Set<StationId>(),
      panelOpen: false,
      panelStation: null,
      tutorialDismissed: false,
      hudVisible: true,
    }),
}));
