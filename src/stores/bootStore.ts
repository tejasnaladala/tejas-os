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
