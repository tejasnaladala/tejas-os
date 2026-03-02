"use client";

import { WindowId } from "@/types";
import { useWindowStore } from "@/stores/windowStore";
import { WINDOW_CONFIG } from "@/lib/constants";

interface TitleBarProps {
  windowId: WindowId;
  title: string;
  isActive: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export default function TitleBar({ windowId, title, isActive, onMouseDown }: TitleBarProps) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);

  return (
    <div
      className={`flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing ${
        isActive ? "bg-bg-elevated" : "bg-bg-surface"
      }`}
      style={{ height: WINDOW_CONFIG.titleBarHeight }}
      onMouseDown={onMouseDown}
    >
      <span className="text-xs font-mono text-text-primary truncate mr-4">
        {title}
      </span>

      <div className="flex items-center gap-1 shrink-0">
        {/* Minimize */}
        <button
          onClick={() => minimizeWindow(windowId)}
          className="w-6 h-6 flex items-center justify-center text-text-secondary
            hover:bg-bg-surface hover:text-text-primary transition-colors text-xs"
          aria-label="Minimize"
        >
          &#x2500;
        </button>

        {/* Maximize / Restore */}
        <button
          onClick={() => maximizeWindow(windowId)}
          className="w-6 h-6 flex items-center justify-center text-text-secondary
            hover:bg-bg-surface hover:text-text-primary transition-colors text-xs"
          aria-label="Maximize"
        >
          &#x25A1;
        </button>

        {/* Close */}
        <button
          onClick={() => closeWindow(windowId)}
          className="w-6 h-6 flex items-center justify-center text-accent-red
            hover:bg-accent-red hover:text-white transition-colors text-xs"
          aria-label="Close"
        >
          &#x2715;
        </button>
      </div>
    </div>
  );
}
