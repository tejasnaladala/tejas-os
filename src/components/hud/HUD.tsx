"use client";

import { useOceanStore } from "@/stores/oceanStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { OCEAN_CONFIG } from "@/lib/constants";

export default function HUD() {
  const rovX = useOceanStore((s) => s.rovX);
  const rovY = useOceanStore((s) => s.rovY);
  const isBoosting = useOceanStore((s) => s.isBoosting);
  const hudVisible = useOceanStore((s) => s.hudVisible);
  const fpvMode = useOceanStore((s) => s.fpvMode);
  const toggleFpvMode = useOceanStore((s) => s.toggleFpvMode);
  const speedMultiplier = useOceanStore((s) => s.speedMultiplier);
  const setSpeedMultiplier = useOceanStore((s) => s.setSpeedMultiplier);
  const musicPlaying = useOceanStore((s) => s.musicPlaying);
  const toggleMusic = useOceanStore((s) => s.toggleMusic);
  const startGuidedTutorial = useOceanStore((s) => s.startGuidedTutorial);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  if (!hudVisible) return null;

  const depth = Math.round(rovY);
  const depthPercent = (rovY / OCEAN_CONFIG.worldHeight) * 100;

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

        {/* Divider */}
        <div
          className="my-2"
          style={{ borderBottom: "1px solid rgba(0, 212, 255, 0.1)" }}
        />

        {/* Speed Slider */}
        <div id="speed-slider">
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "var(--text-secondary)" }}
            >
              Speed
            </span>
            <span
              className="text-[10px] tabular-nums"
              style={{ color: "var(--accent-cyan)" }}
            >
              {Math.round(speedMultiplier * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="200"
            value={Math.round(speedMultiplier * 100)}
            onChange={(e) => setSpeedMultiplier(Number(e.target.value) / 100)}
            className="w-full h-1 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--accent-cyan) 0%, var(--accent-cyan) ${((speedMultiplier - 0.3) / 1.7) * 100}%, rgba(95, 122, 148, 0.3) ${((speedMultiplier - 0.3) / 1.7) * 100}%, rgba(95, 122, 148, 0.3) 100%)`,
              accentColor: "var(--accent-cyan)",
            }}
            aria-label="Submarine speed control"
          />
        </div>

        {/* Divider */}
        <div
          className="my-2"
          style={{ borderBottom: "1px solid rgba(0, 212, 255, 0.1)" }}
        />

        {/* Toggle buttons row */}
        <div className="flex flex-wrap gap-1">
          {/* FPV Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFpvMode();
            }}
            className="font-mono text-[9px] tracking-wider uppercase cursor-pointer rounded-sm"
            style={{
              color: fpvMode ? "var(--accent-cyan)" : "var(--text-secondary)",
              background: fpvMode ? "rgba(0, 212, 255, 0.1)" : "transparent",
              border: `1px solid ${fpvMode ? "rgba(0, 212, 255, 0.3)" : "rgba(95, 122, 148, 0.2)"}`,
              padding: "2px 6px",
            }}
            id="fpv-toggle"
            title="Toggle First-Person View"
          >
            {fpvMode ? "\uD83C\uDFA5 FPV" : "\uD83D\uDC41 TOP"}
          </button>

          {/* Sound toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              useSettingsStore.getState().toggleSound();
            }}
            className="font-mono text-[9px] tracking-wider uppercase cursor-pointer rounded-sm"
            style={{
              color: soundEnabled ? "var(--accent-green)" : "var(--text-secondary)",
              background: soundEnabled ? "rgba(0, 255, 136, 0.1)" : "transparent",
              border: `1px solid ${soundEnabled ? "rgba(0, 255, 136, 0.2)" : "rgba(95, 122, 148, 0.2)"}`,
              padding: "2px 6px",
            }}
          >
            {soundEnabled ? "\uD83D\uDD0A" : "\uD83D\uDD07"}
          </button>

          {/* Music toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMusic();
            }}
            className="font-mono text-[9px] tracking-wider uppercase cursor-pointer rounded-sm"
            style={{
              color: musicPlaying ? "var(--accent-amber)" : "var(--text-secondary)",
              background: musicPlaying ? "rgba(255, 176, 0, 0.1)" : "transparent",
              border: `1px solid ${musicPlaying ? "rgba(255, 176, 0, 0.2)" : "rgba(95, 122, 148, 0.2)"}`,
              padding: "2px 6px",
            }}
            title="Toggle background music"
          >
            {musicPlaying ? "\uD83C\uDFB5" : "\uD83C\uDFB5"}
          </button>
        </div>

        {/* Guide button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            startGuidedTutorial();
          }}
          className="mt-2 w-full font-mono text-[9px] tracking-wider uppercase cursor-pointer py-1 rounded-sm"
          style={{
            color: "var(--text-secondary)",
            background: "transparent",
            border: "1px solid rgba(95, 122, 148, 0.2)",
          }}
          title="Start guided tour"
        >
          ? GUIDED TOUR
        </button>
      </div>
    </div>
  );
}
