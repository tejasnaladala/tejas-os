"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const games = {
  "flappy-tejas": {
    name: "Flappy Tejas",
    description: "Dodge circuit board pillars with your drone",
    mode: "easy" as const,
    component: dynamic(() => import("./games/flappy-tejas/FlappyTejas"), { ssr: false }),
  },
  "tetromino-ai": {
    name: "Tetromino.AI",
    description: "Stack circuit-themed blocks before they overflow",
    mode: "easy" as const,
    component: dynamic(() => import("./games/tetromino-ai/TetrominoAI"), { ssr: false }),
  },
  "pixel-pong": {
    name: "Pixel Pong",
    description: "Break the circuit blocks with your paddle",
    mode: "easy" as const,
    component: dynamic(() => import("./games/pixel-pong/PixelPong"), { ssr: false }),
  },
  "debug-circuit": {
    name: "Debug the Circuit",
    description: "Find and fix bugs in logic circuits",
    mode: "hard" as const,
    component: dynamic(() => import("./games/debug-circuit/DebugCircuit"), { ssr: false }),
  },
  "train-agent": {
    name: "Train the Agent",
    description: "Teach an AI agent to reach its goal",
    mode: "hard" as const,
    component: dynamic(() => import("./games/train-agent/TrainAgent"), { ssr: false }),
  },
};

type GameId = keyof typeof games;

function GameCard({ id, onPlay }: { id: GameId; onPlay: (id: GameId) => void }) {
  const game = games[id];
  return (
    <div
      style={{
        background: "rgba(0, 212, 255, 0.05)",
        border: "1px solid rgba(0, 212, 255, 0.15)",
        borderRadius: 8,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 14 }}>{game.name}</div>
        <div style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2 }}>{game.description}</div>
      </div>
      <button
        onClick={() => onPlay(id)}
        style={{
          background: game.mode === "easy" ? "var(--accent-green)" : "var(--accent-red)",
          color: "var(--bg-panel)",
          border: "none",
          borderRadius: 4,
          padding: "6px 16px",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        PLAY
      </button>
    </div>
  );
}

export default function GameLauncher({ windowId }: { windowId: string }) {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  if (activeGame) {
    const GameComponent = games[activeGame].component;
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-panel)" }}>
        <button
          onClick={() => setActiveGame(null)}
          style={{
            background: "rgba(0, 212, 255, 0.05)",
            color: "var(--accent-green)",
            border: "none",
            borderBottom: "1px solid rgba(0, 212, 255, 0.15)",
            padding: "8px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
            flexShrink: 0,
          }}
        >
          &larr; BACK TO ARCADE
        </button>
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <GameComponent />
        </div>
      </div>
    );
  }

  const easyGames = (Object.keys(games) as GameId[]).filter((id) => games[id].mode === "easy");
  const hardGames = (Object.keys(games) as GameId[]).filter((id) => games[id].mode === "hard");

  return (
    <div style={{ padding: 20, fontFamily: "var(--font-mono)", overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            color: "var(--accent-green)",
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: 2,
          }}
        >
          // EASY MODE
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {easyGames.map((id) => (
            <GameCard key={id} id={id} onPlay={setActiveGame} />
          ))}
        </div>
      </div>
      <div>
        <h3
          style={{
            color: "var(--accent-red)",
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: 2,
          }}
        >
          // HARD MODE
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hardGames.map((id) => (
            <GameCard key={id} id={id} onPlay={setActiveGame} />
          ))}
        </div>
      </div>
    </div>
  );
}
