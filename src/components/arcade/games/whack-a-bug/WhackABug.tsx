"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";

type GameState = "waiting" | "playing" | "gameOver";

interface Bug {
  x: number;
  y: number;
  spawnTime: number;
  lifespan: number;
  alive: boolean;
  hit: boolean;
  hitTime: number;
}

export default function WhackABug() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 400 });
  const state = useRef<GameState>("waiting");
  const score = useRef(0);
  const missed = useRef(0);
  const bugs = useRef<Bug[]>([]);
  const nextSpawn = useRef(0);
  const elapsed = useRef(0);
  const spawnInterval = useRef(2.0);
  const bugLifespan = useRef(1.5);
  const highScore = useRef(0);

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
    score.current = 0;
    missed.current = 0;
    bugs.current = [];
    nextSpawn.current = 0.5;
    elapsed.current = 0;
    spawnInterval.current = 2.0;
    bugLifespan.current = 1.5;
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.current === "waiting") {
        reset();
        state.current = "playing";
        return;
      }
      if (state.current === "gameOver") {
        reset();
        state.current = "playing";
        return;
      }
      if (state.current === "playing") {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = size.w / rect.width;
        const scaleY = size.h / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        const BUG_SIZE = Math.min(size.w, size.h) * 0.07;
        for (let i = bugs.current.length - 1; i >= 0; i--) {
          const bug = bugs.current[i];
          if (!bug.alive || bug.hit) continue;
          const dx = mx - bug.x;
          const dy = my - bug.y;
          if (dx * dx + dy * dy < BUG_SIZE * BUG_SIZE * 1.5) {
            bug.hit = true;
            bug.hitTime = elapsed.current;
            score.current++;
            break;
          }
        }
      }
    },
    [size, reset]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state.current === "waiting") {
          reset();
          state.current = "playing";
        } else if (state.current === "gameOver") {
          reset();
          state.current = "playing";
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reset]);

  const drawBug = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, hit: boolean) => {
      if (hit) {
        // Hit effect - green burst
        ctx.fillStyle = "#00ff41";
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, s * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#00ff41";
        ctx.font = `bold ${Math.floor(s * 0.7)}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("+1", x, y);
        return;
      }

      // Bug body (oval)
      ctx.fillStyle = "#ff4400";
      ctx.beginPath();
      ctx.ellipse(x, y, s * 0.6, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = "#cc2200";
      ctx.beginPath();
      ctx.arc(x, y - s * 0.45, s * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(x - s * 0.1, y - s * 0.5, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + s * 0.1, y - s * 0.5, s * 0.07, 0, Math.PI * 2);
      ctx.fill();

      // Legs (6 legs, 3 per side)
      ctx.strokeStyle = "#ff6633";
      ctx.lineWidth = Math.max(1, s * 0.06);
      for (let i = -1; i <= 1; i++) {
        const ly = y + i * s * 0.2;
        // Left legs
        ctx.beginPath();
        ctx.moveTo(x - s * 0.5, ly);
        ctx.lineTo(x - s * 0.85, ly - s * 0.15);
        ctx.stroke();
        // Right legs
        ctx.beginPath();
        ctx.moveTo(x + s * 0.5, ly);
        ctx.lineTo(x + s * 0.85, ly - s * 0.15);
        ctx.stroke();
      }

      // Wing lines
      ctx.strokeStyle = "#ff8844";
      ctx.lineWidth = Math.max(0.5, s * 0.03);
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.2);
      ctx.lineTo(x, y + s * 0.3);
      ctx.stroke();
    },
    []
  );

  const update = useCallback(
    (dt: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = size.w,
        H = size.h;
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }
      ctx.clearRect(0, 0, W, H);

      // Set cursor imperatively since state is a ref (not reactive in JSX)
      canvas.style.cursor = state.current === "playing" ? "crosshair" : "pointer";

      const BUG_SIZE = Math.min(W, H) * 0.07;
      const MARGIN = BUG_SIZE * 1.5;

      // Update
      if (state.current === "playing") {
        elapsed.current += dt;

        // Increase difficulty over time
        spawnInterval.current = Math.max(0.6, 2.0 - elapsed.current * 0.03);
        bugLifespan.current = Math.max(0.6, 1.5 - elapsed.current * 0.02);

        // Spawn bugs
        nextSpawn.current -= dt;
        if (nextSpawn.current <= 0) {
          nextSpawn.current = spawnInterval.current;
          const bx = MARGIN + Math.random() * (W - MARGIN * 2);
          const by = MARGIN + 40 + Math.random() * (H - MARGIN * 2 - 60);
          bugs.current.push({
            x: bx,
            y: by,
            spawnTime: elapsed.current,
            lifespan: bugLifespan.current,
            alive: true,
            hit: false,
            hitTime: 0,
          });
        }

        // Check for expired bugs
        for (const bug of bugs.current) {
          if (!bug.alive) continue;
          if (bug.hit) {
            // Keep hit bugs briefly for animation
            if (elapsed.current - bug.hitTime > 0.4) {
              bug.alive = false;
            }
          } else if (elapsed.current - bug.spawnTime > bug.lifespan) {
            bug.alive = false;
            missed.current++;
            if (missed.current >= 3) {
              if (score.current > highScore.current) {
                highScore.current = score.current;
              }
              state.current = "gameOver";
            }
          }
        }

        // Remove dead bugs
        bugs.current = bugs.current.filter((b) => b.alive);
      }

      // Draw background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, W, H);

      // Draw grid
      ctx.strokeStyle = "#141420";
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Draw bugs
      for (const bug of bugs.current) {
        if (!bug.alive) continue;

        // Flicker effect when about to expire
        const remaining = bug.lifespan - (elapsed.current - bug.spawnTime);
        if (!bug.hit && remaining < 0.5) {
          ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(elapsed.current * 12));
        } else {
          ctx.globalAlpha = 1;
        }

        drawBug(ctx, bug.x, bug.y, BUG_SIZE, bug.hit);
        ctx.globalAlpha = 1;
      }

      // HUD
      ctx.textAlign = "left";
      ctx.fillStyle = "#ff4400";
      ctx.font = "14px monospace";
      ctx.fillText(`Score: ${score.current}`, 12, 24);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ff0040";
      const hearts = 3 - missed.current;
      ctx.fillText("\u2665".repeat(Math.max(0, hearts)), W - 12, 24);

      // Overlays
      ctx.textAlign = "center";
      if (state.current === "waiting") {
        ctx.fillStyle = "#ff4400";
        ctx.font = "bold 28px monospace";
        ctx.fillText("WHACK-A-BUG", W / 2, H / 2 - 50);

        // Draw a demo bug
        drawBug(ctx, W / 2, H / 2 + 10, BUG_SIZE * 1.5, false);

        ctx.fillStyle = "#ff8844";
        ctx.font = "16px monospace";
        ctx.fillText("Click the bugs!", W / 2, H / 2 + 70);
        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText("Press SPACE or Click to Start", W / 2, H / 2 + 100);
      } else if (state.current === "gameOver") {
        ctx.fillStyle = "#ff0040";
        ctx.font = "bold 32px monospace";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 30);
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px monospace";
        ctx.fillText(`Score: ${score.current}`, W / 2, H / 2 + 10);
        if (highScore.current > 0) {
          ctx.fillStyle = "#ff8844";
          ctx.font = "14px monospace";
          ctx.fillText(`Best: ${highScore.current}`, W / 2, H / 2 + 35);
        }
        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText("Press SPACE to Retry", W / 2, H / 2 + 65);
      }
    },
    [size, drawBug]
  );

  useGameLoop(update, true);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
