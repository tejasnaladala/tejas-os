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
