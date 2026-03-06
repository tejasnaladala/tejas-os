"use client";

import Link from "next/link";
import { useOceanStore } from "@/stores/oceanStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { OCEAN_CONFIG } from "@/lib/constants";

export default function HUD() {
  const rovY = useOceanStore((s) => s.rovY);
  const isBoosting = useOceanStore((s) => s.isBoosting);
  const hudVisible = useOceanStore((s) => s.hudVisible);
  const fpvMode = useOceanStore((s) => s.fpvMode);
  const toggleFpvMode = useOceanStore((s) => s.toggleFpvMode);
  const musicPlaying = useOceanStore((s) => s.musicPlaying);
  const toggleMusic = useOceanStore((s) => s.toggleMusic);
  const peacefulMode = useOceanStore((s) => s.peacefulMode);
  const togglePeacefulMode = useOceanStore((s) => s.togglePeacefulMode);
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
        className="px-4 py-3 rounded-sm pointer-events-auto"
        style={{
          background: "rgba(10, 15, 26, 0.85)",
          border: "1px solid rgba(0, 212, 255, 0.15)",
          backdropFilter: "blur(8px)",
          minWidth: 150,
        }}
      >
        {/* Home link */}
        <Link
          href="/"
          className="font-mono block mb-3"
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            color: "var(--accent-cyan)",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          {"< HOME"}
        </Link>

        {/* Divider */}
        <div
          className="mb-3"
          style={{ borderBottom: "1px solid rgba(0, 212, 255, 0.1)" }}
        />

        {/* Depth */}
        <div className="flex items-baseline gap-2">
          <span
            className="text-[11px] tracking-widest uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            Depth
          </span>
          <span
            className="text-base tabular-nums font-bold"
            style={{ color: "var(--accent-cyan)" }}
          >
            {depth}m
          </span>
        </div>

        {/* Zone */}
        <div className="flex items-baseline gap-2 mt-2">
          <span
            className="text-[11px] tracking-widest uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            Zone
          </span>
          <span
            className="text-[13px]"
            style={{ color: "var(--text-primary)" }}
          >
            {zone}
          </span>
        </div>

        {/* Boost indicator */}
        {isBoosting && (
          <div
            className="mt-2 text-[11px] tracking-widest uppercase font-bold"
            style={{ color: "var(--accent-green)" }}
          >
            {"\u25B6\u25B6"} BOOST
          </div>
        )}

        {/* Divider */}
        <div
          className="my-3"
          style={{ borderBottom: "1px solid rgba(0, 212, 255, 0.1)" }}
        />

        {/* Toggle buttons */}
        <div className="flex flex-wrap gap-1.5">
          {/* FPV Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFpvMode();
            }}
            className="font-mono text-[11px] tracking-wider uppercase cursor-pointer rounded-sm"
            style={{
              color: fpvMode ? "var(--accent-cyan)" : "var(--text-secondary)",
              background: fpvMode ? "rgba(0, 212, 255, 0.1)" : "transparent",
              border: `1px solid ${fpvMode ? "rgba(0, 212, 255, 0.3)" : "rgba(95, 122, 148, 0.2)"}`,
              padding: "4px 8px",
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
            className="font-mono text-[11px] tracking-wider uppercase cursor-pointer rounded-sm"
            style={{
              color: soundEnabled ? "var(--accent-green)" : "var(--text-secondary)",
              background: soundEnabled ? "rgba(0, 255, 136, 0.1)" : "transparent",
              border: `1px solid ${soundEnabled ? "rgba(0, 255, 136, 0.2)" : "rgba(95, 122, 148, 0.2)"}`,
              padding: "4px 8px",
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
            className="font-mono text-[11px] tracking-wider uppercase cursor-pointer rounded-sm"
            style={{
              color: musicPlaying ? "var(--accent-amber)" : "var(--text-secondary)",
              background: musicPlaying ? "rgba(255, 176, 0, 0.1)" : "transparent",
              border: `1px solid ${musicPlaying ? "rgba(255, 176, 0, 0.2)" : "rgba(95, 122, 148, 0.2)"}`,
              padding: "4px 8px",
            }}
            title="Toggle background music"
          >
            {musicPlaying ? "\uD83C\uDFB5" : "\uD83C\uDFB5"}
          </button>

          {/* Peaceful mode toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePeacefulMode();
            }}
            className="font-mono text-[11px] tracking-wider uppercase cursor-pointer rounded-sm"
            style={{
              color: peacefulMode ? "var(--accent-green)" : "var(--text-secondary)",
              background: peacefulMode ? "rgba(0, 255, 136, 0.1)" : "transparent",
              border: `1px solid ${peacefulMode ? "rgba(0, 255, 136, 0.2)" : "rgba(95, 122, 148, 0.2)"}`,
              padding: "4px 8px",
            }}
            title={peacefulMode ? "Disable peaceful mode" : "Enable peaceful mode"}
          >
            {peacefulMode ? "\u262E" : "\u2694"}
          </button>
        </div>
      </div>
    </div>
  );
}
