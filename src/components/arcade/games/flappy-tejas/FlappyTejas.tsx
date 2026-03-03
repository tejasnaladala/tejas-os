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
const FACE_SIZE = 36;
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
  const headshot = useRef<HTMLImageElement | null>(null);
  const headshotLoaded = useRef(false);

  // Load headshot image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      headshot.current = img;
      headshotLoaded.current = true;
    };
    img.onerror = () => {
      // Headshot not found, will draw fallback
      headshotLoaded.current = false;
    };
    img.src = "/headshot.png";
  }, []);

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

  const drawFace = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (headshotLoaded.current && headshot.current) {
      // Draw circular headshot
      ctx.beginPath();
      ctx.arc(0, 0, FACE_SIZE / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        headshot.current,
        -FACE_SIZE / 2,
        -FACE_SIZE / 2,
        FACE_SIZE,
        FACE_SIZE
      );
      // Add a glow border
      ctx.beginPath();
      ctx.arc(0, 0, FACE_SIZE / 2, 0, Math.PI * 2);
      ctx.strokeStyle = "#00d4ff";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Fallback: draw a comical face
      // Head circle
      ctx.beginPath();
      ctx.arc(0, 0, FACE_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffcc88";
      ctx.fill();
      ctx.strokeStyle = "#00d4ff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(-6, -4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(6, -4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.beginPath();
      ctx.arc(0, 2, 8, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // "T" label
      ctx.fillStyle = "#00d4ff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("T", 0, 16);
    }

    ctx.restore();
  }, []);

  const update = useCallback((dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = size.w, H = size.h;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    ctx.clearRect(0, 0, W, H);

    // Update
    if (state.current === "playing") {
      velocity.current += GRAVITY * dt;
      droneY.current += velocity.current * dt;
      distanceTraveled.current += SPEED * dt;

      // Spawn pillars
      const lastX = pillars.current.length > 0 ? pillars.current[pillars.current.length - 1].x : -1;
      if (lastX < W - PILLAR_SPACING) {
        pillars.current.push({ x: W, gapY: 80 + Math.random() * (H - 80 - GAP - 40), passed: false });
      }

      // Move pillars
      for (const p of pillars.current) {
        p.x -= SPEED * dt;
        if (!p.passed && p.x + PILLAR_W < 80) { p.passed = true; score.current++; }
      }
      pillars.current = pillars.current.filter((p) => p.x + PILLAR_W > -10);

      // Collision
      const dx = 80, dy = droneY.current;
      const halfFace = FACE_SIZE / 2;
      for (const p of pillars.current) {
        if (dx + halfFace > p.x && dx - halfFace < p.x + PILLAR_W) {
          if (dy - halfFace < p.gapY || dy + halfFace > p.gapY + GAP) {
            state.current = "gameOver";
          }
        }
      }
      if (droneY.current < 0 || droneY.current > H) state.current = "gameOver";
    }

    // Draw background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, W, H);

    // Ocean-themed background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0a1428");
    grad.addColorStop(1, "#020408");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Pillars (ocean coral/rock style)
    for (const p of pillars.current) {
      ctx.fillStyle = "#0a3a3a";
      ctx.fillRect(p.x, 0, PILLAR_W, p.gapY);
      ctx.fillRect(p.x, p.gapY + GAP, PILLAR_W, H - p.gapY - GAP);
      // Grid lines
      ctx.strokeStyle = "#0f6f6f";
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

    // Draw face/headshot
    const dy = state.current === "waiting" ? H / 2 + Math.sin(Date.now() / 300) * 10 : droneY.current;
    const rotation = state.current === "playing"
      ? Math.min(Math.max(velocity.current / 600, -0.5), 0.5)
      : state.current === "gameOver"
        ? 0.3
        : Math.sin(Date.now() / 500) * 0.1;
    drawFace(ctx, 80, dy, rotation);

    // Score
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(score.current), W / 2, 50);

    // Overlays
    ctx.font = "16px monospace";
    if (state.current === "waiting") {
      ctx.fillStyle = "#00d4ff";
      ctx.fillText("Press SPACE or Click to Start", W / 2, H / 2 + 60);
      ctx.font = "12px monospace";
      ctx.fillStyle = "#5f7a94";
      ctx.fillText("Navigate through the deep sea pillars", W / 2, H / 2 + 85);
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
  }, [size, drawFace]);

  useGameLoop(update, true);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} onClick={flap}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
