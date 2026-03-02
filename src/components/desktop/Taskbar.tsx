"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import { SITE_CONFIG } from "@/lib/constants";
import SoundToggle from "@/components/shared/SoundToggle";
import StartMenu from "./StartMenu";

export default function Taskbar() {
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");
  const windows = useWindowStore((s) => s.windows);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);

  // Update clock every second
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWindowClick = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (win?.isMinimized) {
        restoreWindow(win.id);
      } else {
        focusWindow(win!.id);
      }
    },
    [windows, focusWindow, restoreWindow]
  );

  const toggleStart = useCallback(() => {
    setStartOpen((prev) => !prev);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-bg-elevated border-t border-border z-[7000] flex items-center px-2 gap-2">
      {/* Start Menu */}
      <AnimatePresence>
        {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      </AnimatePresence>

      {/* Start Button */}
      <button
        onClick={toggleStart}
        className={`h-8 px-3 text-xs font-mono border rounded-sm transition-colors shrink-0
          ${
            startOpen
              ? "bg-accent-green/20 border-accent-green/30 text-accent-green"
              : "bg-bg-surface border-border text-text-primary hover:border-accent-green/30 hover:text-accent-green"
          }`}
      >
        {"\u26a1"} START
      </button>

      {/* Window Indicators */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto min-w-0">
        {windows
          .filter((w) => w.isOpen)
          .map((win) => (
            <button
              key={win.id}
              onClick={() => handleWindowClick(win.id)}
              className={`h-7 px-2 text-[10px] font-mono border rounded-sm truncate max-w-[140px] transition-colors
                ${
                  activeWindowId === win.id && !win.isMinimized
                    ? "bg-accent-green/10 border-accent-green/30 text-accent-green"
                    : "bg-bg-surface border-border text-text-secondary hover:text-text-primary"
                }
                ${win.isMinimized ? "opacity-50" : ""}`}
            >
              {win.title}
            </button>
          ))}
      </div>

      {/* Right: Sound + Social + Clock */}
      <div className="flex items-center gap-2 shrink-0">
        <SoundToggle />

        <div className="hidden sm:flex items-center gap-2">
          <a
            href={SITE_CONFIG.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-mono text-text-secondary hover:text-accent-green transition-colors"
          >
            GH
          </a>
          <a
            href={SITE_CONFIG.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-mono text-text-secondary hover:text-accent-green transition-colors"
          >
            LI
          </a>
          <a
            href={SITE_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-mono text-text-secondary hover:text-accent-green transition-colors"
          >
            IG
          </a>
        </div>

        <div className="text-[10px] font-mono text-text-secondary border-l border-border pl-2 ml-1 min-w-[60px] text-right">
          {clock}
        </div>
      </div>
    </div>
  );
}
