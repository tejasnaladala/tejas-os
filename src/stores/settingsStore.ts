import { create } from "zustand";

interface SettingsState {
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  soundEnabled: false, // default muted
  toggleSound: () =>
    set((s) => {
      const next = !s.soundEnabled;
      if (typeof window !== "undefined") {
        localStorage.setItem("tejas-os-sound", String(next));
      }
      return { soundEnabled: next };
    }),
}));
