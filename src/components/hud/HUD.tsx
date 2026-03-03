"use client";

import { useOceanStore } from "@/stores/oceanStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { OCEAN_CONFIG } from "@/lib/constants";

export default function HUD() {
  const rovX = useOceanStore((s) => s.rovX);
  const rovY = useOceanStore((s) => s.rovY);
  const isBoosting = useOceanStore((s) => s.isBoosting);
  const hudVisible = useOceanStore((s) => s.hudVisible);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  if (!hudVisible) return null;

  // Calculate depth as percentage of world height (0-3500 -> 0-3500m)
  const depth = Math.round(rovY);
  const depthPercent = (rovY / OCEAN_CONFIG.worldHeight) * 100;

  // Depth zone label
  let zone = "Surface";
  if (depthPercent > 80) zone = "Abyss";
  else if (depthPercent > 60) zone = "Midnight";
  else if (depthPercent > 30) zone = "Twilight";

  return (
    <div className="fixed top-4 left-4 z-50 font-mono select-none pointer-events-none">
      <div
        className="px-3 py-2 rounded-sm pointer-events-auto"
        style={{
          background: "rgba(10, 15, 26, 0.8)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Depth */}
        <div className="flex items-baseline gap-2">
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            Depth
          </span>
          <span
            className="text-sm tabular-nums"
            style={{ color: "var(--accent-cyan)" }}
          >
            {depth}m
          </span>
        </div>

        {/* Zone */}
        <div className="flex items-baseline gap-2 mt-1">
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            Zone
          </span>
          <span
            className="text-[11px]"
            style={{ color: "var(--text-primary)" }}
          >
            {zone}
          </span>
        </div>

        {/* Coordinates */}
        <div className="flex items-baseline gap-2 mt-1">
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            Pos
          </span>
          <span
            className="text-[10px] tabular-nums"
            style={{ color: "var(--text-secondary)" }}
          >
            {Math.round(rovX)}, {Math.round(rovY)}
          </span>
        </div>

        {/* Boost indicator */}
        {isBoosting && (
          <div
            className="mt-1 text-[10px] tracking-widest uppercase"
            style={{ color: "var(--accent-green)" }}
          >
            {"\u25B6\u25B6"} BOOST
          </div>
        )}

        {/* Sound toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            useSettingsStore.getState().toggleSound();
          }}
          className="mt-2 font-mono text-[10px] tracking-wider uppercase cursor-pointer"
          style={{
            color: soundEnabled ? "var(--accent-green)" : "var(--text-secondary)",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {soundEnabled ? "\uD83D\uDD0A Sound ON" : "\uD83D\uDD07 Sound OFF"}
        </button>
      </div>
    </div>
  );
}
