"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const games = {
  "flappy-tejas": {
    name: "Flappy Tejas",
    description: "Dodge the pillars with my headshot as the bird",
    component: dynamic(() => import("./games/flappy-tejas/FlappyTejas"), { ssr: false }),
  },
  "tetromino-ai": {
    name: "Tetromino.AI",
    description: "Stack circuit-themed blocks before they overflow",
    component: dynamic(() => import("./games/tetromino-ai/TetrominoAI"), { ssr: false }),
  },
  "pixel-pong": {
    name: "Pixel Pong",
    description: "Break the circuit blocks with your paddle",
    component: dynamic(() => import("./games/pixel-pong/PixelPong"), { ssr: false }),
  },
  "whack-a-bug": {
    name: "Whack-a-Bug",
    description: "Click the bugs before they scurry away",
    component: dynamic(() => import("./games/whack-a-bug/WhackABug"), { ssr: false }),
  },
  "memory-grid": {
    name: "Memory Grid",
    description: "Remember the pattern and reproduce it",
    component: dynamic(() => import("./games/memory-grid/MemoryGrid"), { ssr: false }),
  },
  "reaction-test": {
    name: "Reaction Test",
    description: "How fast can you click when it turns green?",
    component: dynamic(() => import("./games/reaction-test/ReactionTest"), { ssr: false }),
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
          background: "var(--accent-cyan)",
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
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Focus the game container when a game is launched (once, not every render)
  useEffect(() => {
    if (activeGame) gameContainerRef.current?.focus();
  }, [activeGame]);

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
        <div
          style={{ flex: 1, position: "relative", overflow: "hidden" }}
          tabIndex={0}
          ref={gameContainerRef}
        >
          <GameComponent />
        </div>
      </div>
    );
  }

  const allGames = Object.keys(games) as GameId[];

  return (
    <div style={{ padding: 20, fontFamily: "var(--font-mono)", overflowY: "auto", height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {allGames.map((id) => (
          <GameCard key={id} id={id} onPlay={setActiveGame} />
        ))}
      </div>
    </div>
  );
}
