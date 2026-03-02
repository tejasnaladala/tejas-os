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
