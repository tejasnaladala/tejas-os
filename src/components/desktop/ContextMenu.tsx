"use client";

import { useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { WallpaperOption } from "@/types";
import { SITE_CONFIG } from "@/lib/constants";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

const WALLPAPERS: { label: string; value: WallpaperOption }[] = [
  { label: "Default", value: "default" },
  { label: "Circuit Board", value: "circuit" },
  { label: "Matrix Rain", value: "matrix" },
];

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const [showWallpaperSub, setShowWallpaperSub] = useState(false);
  const setWallpaper = useSettingsStore((s) => s.setWallpaper);
  const currentWallpaper = useSettingsStore((s) => s.wallpaper);

  // Ensure menu doesn't go off screen
  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: Math.min(y, window.innerHeight - 220),
    left: Math.min(x, window.innerWidth - 200),
    zIndex: 9000,
  };

  const itemClass =
    "px-3 py-1.5 text-xs font-mono text-text-primary hover:bg-accent-green/10 hover:text-accent-green cursor-pointer transition-colors w-full text-left";

  return (
    <div
      className="bg-bg-elevated border border-border rounded-sm shadow-lg shadow-black/50 py-1 min-w-[180px]"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={itemClass}
        onClick={() => {
          window.location.reload();
        }}
      >
        Refresh Desktop
      </button>

      <div
        className="relative"
        onMouseEnter={() => setShowWallpaperSub(true)}
        onMouseLeave={() => setShowWallpaperSub(false)}
      >
        <button className={`${itemClass} flex justify-between items-center`}>
          <span>Change Wallpaper</span>
          <span className="text-text-secondary ml-2">{"\u25b8"}</span>
        </button>

        {showWallpaperSub && (
          <div className="absolute left-full top-0 bg-bg-elevated border border-border rounded-sm shadow-lg shadow-black/50 py-1 min-w-[140px]">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.value}
                className={`${itemClass} flex items-center gap-2`}
                onClick={() => {
                  setWallpaper(wp.value);
                  onClose();
                }}
              >
                <span className="text-[10px]">
                  {currentWallpaper === wp.value ? "\u2713" : "\u00a0\u00a0"}
                </span>
                {wp.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border my-1" />

      <button
        className={itemClass}
        onClick={() => {
          window.open(SITE_CONFIG.social.github, "_blank");
          onClose();
        }}
      >
        View Source
      </button>

      <button
        className={itemClass}
        onClick={() => {
          alert("TejasOS v1.0 — Founder Edition\nBuilt by Tejas Naladala");
          onClose();
        }}
      >
        About TejasOS
      </button>
    </div>
  );
}
