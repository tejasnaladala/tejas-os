"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";

type GameState = "waiting" | "playing" | "gameOver";

interface Pillar { x: number; gapY: number; passed: boolean }

const GRAVITY = 800;
const FLAP = -300;
const PILLAR_W = 60;
const GAP = 150;
const PILLAR_SPACING = 200;
const DRONE_SIZE = 24;
const SPEED = 160;

export default function FlappyTejas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 400 });
  const state = useRef<GameState>("waiting");
  const droneY = useRef(200);
  const velocity = useRef(0);
  const pillars = useRef<Pillar[]>([]);
  const score = useRef(0);
  const distanceTraveled = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const reset = useCallback(() => {
    droneY.current = size.h / 2;
    velocity.current = 0;
    pillars.current = [];
    score.current = 0;
    distanceTraveled.current = 0;
  }, [size.h]);

  const flap = useCallback(() => {
    if (state.current === "waiting") {
      reset();
      state.current = "playing";
      velocity.current = FLAP;
    } else if (state.current === "playing") {
      velocity.current = FLAP;
    } else if (state.current === "gameOver") {
      reset();
      state.current = "playing";
      velocity.current = FLAP;
    }
  }, [reset]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); flap(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flap]);

  const update = useCallback((dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = size.w, H = size.h;
    canvas.width = W;
    canvas.height = H;

    // Update
    if (state.current === "playing") {
      velocity.current += GRAVITY * dt;
      droneY.current += velocity.current * dt;
      distanceTraveled.current += SPEED * dt;

      // Spawn pillars
      const lastX = pillars.current.length > 0 ? pillars.current[pillars.current.length - 1].x : W;
      if (lastX < W) {
        pillars.current.push({ x: W + PILLAR_SPACING, gapY: 80 + Math.random() * (H - 80 - GAP - 40), passed: false });
      }

      // Move pillars
      for (const p of pillars.current) {
        p.x -= SPEED * dt;
        if (!p.passed && p.x + PILLAR_W < 80) { p.passed = true; score.current++; }
      }
      pillars.current = pillars.current.filter((p) => p.x + PILLAR_W > -10);

      // Collision
      const dx = 80, dy = droneY.current;
      for (const p of pillars.current) {
        if (dx + DRONE_SIZE / 2 > p.x && dx - DRONE_SIZE / 2 < p.x + PILLAR_W) {
          if (dy - DRONE_SIZE / 2 < p.gapY || dy + DRONE_SIZE / 2 > p.gapY + GAP) {
            state.current = "gameOver";
          }
        }
      }
      if (droneY.current < 0 || droneY.current > H) state.current = "gameOver";
    }

    // Draw
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, W, H);

    // Pillars
    for (const p of pillars.current) {
      ctx.fillStyle = "#0a3a0a";
      ctx.fillRect(p.x, 0, PILLAR_W, p.gapY);
      ctx.fillRect(p.x, p.gapY + GAP, PILLAR_W, H - p.gapY - GAP);
      // Grid lines
      ctx.strokeStyle = "#0f5f0f";
      ctx.lineWidth = 0.5;
      for (let gy = 0; gy < H; gy += 20) {
        if (gy < p.gapY || gy > p.gapY + GAP) {
          ctx.beginPath(); ctx.moveTo(p.x, gy); ctx.lineTo(p.x + PILLAR_W, gy); ctx.stroke();
        }
      }
      for (let gx = p.x; gx < p.x + PILLAR_W; gx += 20) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, p.gapY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx, p.gapY + GAP); ctx.lineTo(gx, H); ctx.stroke();
      }
    }

    // Drone
    const dy = state.current === "waiting" ? H / 2 + Math.sin(Date.now() / 300) * 10 : droneY.current;
    ctx.fillStyle = "#00ff41";
    ctx.beginPath();
    ctx.moveTo(80 + DRONE_SIZE / 2, dy - DRONE_SIZE / 2);
    ctx.lineTo(80 - DRONE_SIZE / 2, dy + DRONE_SIZE / 2);
    ctx.lineTo(80 + DRONE_SIZE / 2 + 4, dy + DRONE_SIZE / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(80 - DRONE_SIZE / 2 + 4, dy - 2, DRONE_SIZE - 4, 6);

    // Score
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(score.current), W / 2, 50);

    // Overlays
    ctx.font = "16px monospace";
    if (state.current === "waiting") {
      ctx.fillStyle = "#00ff41";
      ctx.fillText("Press SPACE or Click to Start", W / 2, H / 2 + 60);
    } else if (state.current === "gameOver") {
      ctx.fillStyle = "#ff0040";
      ctx.font = "bold 32px monospace";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 20);
      ctx.fillStyle = "#ffffff";
      ctx.font = "18px monospace";
      ctx.fillText(`Score: ${score.current}`, W / 2, H / 2 + 20);
      ctx.font = "14px monospace";
      ctx.fillStyle = "#8888a0";
      ctx.fillText("Press SPACE to Retry", W / 2, H / 2 + 50);
    }
  }, [size]);

  useGameLoop(update, true);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} onClick={flap}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
