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
  skills: "Device Manager \u2014 Skills",
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
