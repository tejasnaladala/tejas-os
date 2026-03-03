"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";

type GameState = "waiting" | "playing" | "gameOver" | "win";

const PADDLE_H = 14, PADDLE_W = 80;
const BALL_R = 6;
const BLOCK_ROWS = 5, BLOCK_COLS = 9;
const ROW_COLORS = ["#00ff41", "#00d4ff", "#ffb000", "#ff0040", "#e0e0e8"];

export default function PixelPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 500, h: 400 });
  const gs = useRef<GameState>("waiting");
  const paddleX = useRef(250);
  const ball = useRef({ x: 250, y: 350, vx: 0, vy: 0 });
  const blocks = useRef<(number | null)[][]>([]);
  const lives = useRef(3);
  const scoreRef = useRef(0);
  const mouseX = useRef<number | null>(null);
  const launched = useRef(false);

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

  const initBlocks = useCallback(() => {
    blocks.current = Array.from({ length: BLOCK_ROWS }, (_, r) =>
      Array.from({ length: BLOCK_COLS }, () => r)
    );
  }, []);

  const resetBall = useCallback(() => {
    ball.current = { x: paddleX.current, y: size.h - 60, vx: 0, vy: 0 };
    launched.current = false;
  }, [size.h]);

  const resetGame = useCallback(() => {
    lives.current = 3;
    scoreRef.current = 0;
    paddleX.current = size.w / 2;
    initBlocks();
    resetBall();
  }, [size.w, initBlocks, resetBall]);

  const launch = useCallback(() => {
    if (!launched.current) {
      ball.current.vx = 200;
      ball.current.vy = -300;
      launched.current = true;
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gs.current === "waiting" || gs.current === "gameOver" || gs.current === "win") {
        if (e.code === "Space") {
          resetGame();
          gs.current = "playing";
          e.preventDefault();
        }
        return;
      }
      if (gs.current === "playing") {
        if (e.code === "Space") { launch(); e.preventDefault(); }
        if (e.code === "ArrowLeft") paddleX.current = Math.max(PADDLE_W / 2, paddleX.current - 30);
        if (e.code === "ArrowRight") paddleX.current = Math.min(size.w - PADDLE_W / 2, paddleX.current + 30);
      }
    };
    const handleMouse = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const scaleX = size.w / rect.width;
        mouseX.current = (e.clientX - rect.left) * scaleX;
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousemove", handleMouse);
    return () => { window.removeEventListener("keydown", handleKey); window.removeEventListener("mousemove", handleMouse); };
  }, [size.w, resetGame, launch]);

  const update = useCallback((dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = size.w, H = size.h;
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    ctx.clearRect(0, 0, W, H);

    const blockW = (W - 40) / BLOCK_COLS, blockH = 20;
    const blockOX = 20, blockOY = 50;
    const paddleY = H - 40;

    // Mouse paddle
    if (gs.current === "playing" && mouseX.current !== null) {
      paddleX.current = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, mouseX.current));
    }

    // Update ball
    if (gs.current === "playing") {
      if (!launched.current) {
        ball.current.x = paddleX.current;
        ball.current.y = paddleY - BALL_R - PADDLE_H / 2;
      } else {
        const b = ball.current;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Wall bounce
        if (b.x - BALL_R < 0) { b.x = BALL_R; b.vx = Math.abs(b.vx); }
        if (b.x + BALL_R > W) { b.x = W - BALL_R; b.vx = -Math.abs(b.vx); }
        if (b.y - BALL_R < 0) { b.y = BALL_R; b.vy = Math.abs(b.vy); }

        // Bottom - lose life
        if (b.y + BALL_R > H) {
          lives.current--;
          if (lives.current <= 0) { gs.current = "gameOver"; }
          else resetBall();
        }

        // Paddle collision
        if (b.vy > 0 && b.y + BALL_R >= paddleY - PADDLE_H / 2 && b.y + BALL_R <= paddleY + PADDLE_H / 2 + 5
            && b.x >= paddleX.current - PADDLE_W / 2 && b.x <= paddleX.current + PADDLE_W / 2) {
          b.vy = -Math.abs(b.vy);
          const off = (b.x - paddleX.current) / (PADDLE_W / 2);
          b.vx = off * 250;
          b.y = paddleY - PADDLE_H / 2 - BALL_R;
        }

        // Block collision (break after first hit to prevent double-negate)
        let anyBlock = false;
        let blockHit = false;
        for (let r = 0; r < BLOCK_ROWS && !blockHit; r++)
          for (let c = 0; c < BLOCK_COLS && !blockHit; c++) {
            if (blocks.current[r][c] === null) continue;
            anyBlock = true;
            const bx = blockOX + c * blockW, by = blockOY + r * blockH;
            if (b.x + BALL_R > bx && b.x - BALL_R < bx + blockW && b.y + BALL_R > by && b.y - BALL_R < by + blockH) {
              blocks.current[r][c] = null;
              scoreRef.current += 10;
              blockHit = true;
              // Reflect
              const overlapL = b.x + BALL_R - bx, overlapR = bx + blockW - (b.x - BALL_R);
              const overlapT = b.y + BALL_R - by, overlapB = by + blockH - (b.y - BALL_R);
              const minO = Math.min(overlapL, overlapR, overlapT, overlapB);
              if (minO === overlapL || minO === overlapR) b.vx = -b.vx; else b.vy = -b.vy;
            }
          }
        if (!anyBlock && !blockHit) gs.current = "win";
      }
    }

    // Draw
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, W, H);

    // Blocks
    for (let r = 0; r < BLOCK_ROWS; r++)
      for (let c = 0; c < BLOCK_COLS; c++) {
        if (blocks.current[r][c] === null) continue;
        const bx = blockOX + c * blockW, by = blockOY + r * blockH;
        ctx.fillStyle = ROW_COLORS[r];
        ctx.fillRect(bx + 1, by + 1, blockW - 2, blockH - 2);
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + 4, by + 4, blockW - 8, blockH - 8);
      }

    // Paddle
    ctx.fillStyle = "#00ff41";
    ctx.fillRect(paddleX.current - PADDLE_W / 2, paddleY - PADDLE_H / 2, PADDLE_W, PADDLE_H);

    // Ball
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    // HUD
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ff0040";
    ctx.fillText("\u2665".repeat(lives.current), 10, 25);
    ctx.textAlign = "right";
    ctx.fillStyle = "#e0e0e8";
    ctx.fillText(`Score: ${scoreRef.current}`, W - 10, 25);

    // Overlays
    ctx.textAlign = "center";
    if (gs.current === "waiting") {
      ctx.fillStyle = "#00ff41";
      ctx.font = "16px monospace";
      ctx.fillText("Press SPACE to Start", W / 2, H / 2);
    } else if (gs.current === "playing" && !launched.current) {
      ctx.fillStyle = "#8888a0";
      ctx.font = "13px monospace";
      ctx.fillText("Press SPACE to launch", W / 2, H - 70);
    } else if (gs.current === "gameOver") {
      ctx.fillStyle = "#ff0040";
      ctx.font = "bold 28px monospace";
      ctx.fillText("GAME OVER", W / 2, H / 2 - 20);
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${scoreRef.current}`, W / 2, H / 2 + 16);
      ctx.fillStyle = "#8888a0";
      ctx.font = "13px monospace";
      ctx.fillText("Press SPACE to retry", W / 2, H / 2 + 46);
    } else if (gs.current === "win") {
      ctx.fillStyle = "#00ff41";
      ctx.font = "bold 28px monospace";
      ctx.fillText("YOU WIN!", W / 2, H / 2 - 20);
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${scoreRef.current}`, W / 2, H / 2 + 16);
      ctx.fillStyle = "#8888a0";
      ctx.font = "13px monospace";
      ctx.fillText("Press SPACE to play again", W / 2, H / 2 + 46);
    }
  }, [size, resetBall]);

  useGameLoop(update, true);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
