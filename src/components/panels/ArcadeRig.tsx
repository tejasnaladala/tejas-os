"use client";

import GameLauncher from "@/components/arcade/GameLauncher";

export default function ArcadeRig() {
  return (
    <div>
      <h3 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "var(--accent-cyan)" }}>
        Recreation Module
      </h3>
      <p className="font-mono text-[10px] mb-4" style={{ color: "var(--text-secondary)" }}>
        Select a game to play. Press the back button to return to the game list.
      </p>
      <div style={{ minHeight: 400 }}>
        <GameLauncher windowId="arcade-panel" />
      </div>
    </div>
  );
}
