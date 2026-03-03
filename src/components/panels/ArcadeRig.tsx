"use client";

import GameLauncher from "@/components/arcade/GameLauncher";

export default function ArcadeRig() {
  return (
    <div>
      <h3 className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--accent-cyan)" }}>
        Arcade Rig
      </h3>
      <p className="font-mono text-[11px] mb-4" style={{ color: "var(--text-secondary)" }}>
        a few fun games i coded when i should&apos;ve been doing something productive. pick one and try to beat my high score.
      </p>
      <div style={{ height: "calc(70vh)", position: "relative" }}>
        <GameLauncher windowId="arcade-panel" />
      </div>
    </div>
  );
}
