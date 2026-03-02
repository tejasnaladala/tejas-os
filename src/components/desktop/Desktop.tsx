"use client";

import { useState, useCallback } from "react";
import { DesktopIconConfig } from "@/types";
import { useEasterEggStore } from "@/stores/easterEggStore";
import { useSettingsStore } from "@/stores/settingsStore";
import DesktopIcon from "./DesktopIcon";
import ContextMenu from "./ContextMenu";

const DESKTOP_ICONS: DesktopIconConfig[] = [
  { id: "projects", label: "Projects", icon: "\ud83d\udcc1", action: "window" },
  { id: "resume", label: "Resume.exe", icon: "\ud83d\udcc4", action: "window" },
  { id: "system-info", label: "System Info", icon: "\u2139\ufe0f", action: "window" },
  { id: "mail", label: "Mail", icon: "\ud83d\udce7", action: "mailto" },
  { id: "arcade", label: "Arcade", icon: "\ud83d\udd79\ufe0f", action: "window" },
  { id: "skills", label: "Skills", icon: "\ud83d\udd27", action: "window" },
];

const CLASSIFIED_ICON: DesktopIconConfig = {
  id: "classified",
  label: "CLASSIFIED",
  icon: "\ud83d\udd12",
  action: "window",
};

export default function Desktop() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const founderModeActive = useEasterEggStore((s) => s.founderModeActive);
  const wallpaper = useSettingsStore((s) => s.wallpaper);

  const icons = founderModeActive ? [...DESKTOP_ICONS, CLASSIFIED_ICON] : DESKTOP_ICONS;

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  const wallpaperClass =
    wallpaper === "circuit"
      ? "bg-circuit-board"
      : wallpaper === "matrix"
        ? "bg-matrix-rain"
        : "";

  return (
    <div
      className={`absolute inset-0 bottom-12 ${wallpaperClass}`}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <div className="grid grid-cols-2 gap-1 p-4 content-start h-full">
        {icons.map((icon, i) => (
          <DesktopIcon key={icon.id} config={icon} index={i} />
        ))}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
