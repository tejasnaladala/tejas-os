"use client";

import PageLayout from "@/components/shared/PageLayout";
import GameLauncher from "@/components/arcade/GameLauncher";

export default function ArcadePage() {
  return (
    <PageLayout wide>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p
          className="font-mono"
          style={{
            color: "var(--accent-green)",
            fontSize: "11px",
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          {"> ./arcade --list-games"}
        </p>
        <h1
          className="font-mono"
          style={{
            color: "var(--text-primary)",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          Arcade
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            marginTop: "8px",
          }}
        >
          coded these when i should&apos;ve been doing something productive. try
          to beat my high score.
        </p>
      </div>

      {/* Game launcher */}
      <div style={{ height: "calc(100vh - 260px)", minHeight: "480px" }}>
        <GameLauncher windowId="arcade-page" />
      </div>
    </PageLayout>
  );
}
