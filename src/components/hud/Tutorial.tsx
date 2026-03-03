"use client";

import { useEffect } from "react";
import { useOceanStore } from "@/stores/oceanStore";

export default function Tutorial() {
  const tutorialDismissed = useOceanStore((s) => s.tutorialDismissed);
  const dismissTutorial = useOceanStore((s) => s.dismissTutorial);

  useEffect(() => {
    if (tutorialDismissed) return;

    const dismiss = () => dismissTutorial();

    // Auto-dismiss after 8 seconds
    const timer = setTimeout(dismiss, 8000);

    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("click", dismiss, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("click", dismiss);
    };
  }, [tutorialDismissed, dismissTutorial]);

  if (tutorialDismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div
        className="px-8 py-6 rounded-sm text-center font-mono max-w-sm"
        style={{
          background: "rgba(10, 15, 26, 0.9)",
          border: "1px solid rgba(0, 212, 255, 0.3)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h2
          className="text-sm tracking-widest uppercase mb-4"
          style={{ color: "var(--accent-cyan)" }}
        >
          ROV Controls
        </h2>

        <div
          className="space-y-3 text-[11px]"
          style={{ color: "var(--text-primary)" }}
        >
          <div className="flex items-center gap-3">
            <kbd
              className="px-2 py-1 rounded text-[10px]"
              style={{
                background: "rgba(0, 212, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
              }}
            >
              WASD
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd
              className="px-2 py-1 rounded text-[10px]"
              style={{
                background: "rgba(0, 212, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
              }}
            >
              SHIFT
            </kbd>
            <span>Boost</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd
              className="px-2 py-1 rounded text-[10px]"
              style={{
                background: "rgba(0, 212, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
              }}
            >
              ENTER
            </kbd>
            <span>Dock at Station</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd
              className="px-2 py-1 rounded text-[10px]"
              style={{
                background: "rgba(0, 212, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
              }}
            >
              ESC
            </kbd>
            <span>Undock</span>
          </div>
        </div>

        <p
          className="text-[10px] mt-4 tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Explore the ocean to discover all stations
        </p>
        <p
          className="text-[10px] mt-2 animate-pulse"
          style={{ color: "var(--text-secondary)" }}
        >
          Press any key to begin...
        </p>
      </div>
    </div>
  );
}
