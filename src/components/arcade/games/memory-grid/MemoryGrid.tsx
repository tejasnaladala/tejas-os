"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";

type GameState = "waiting" | "showing" | "playing" | "correct" | "gameOver";

export default function MemoryGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 400 });
  const state = useRef<GameState>("waiting");
  const level = useRef(1);
  const gridSize = useRef(3);
  const pattern = useRef<number[]>([]);
  const playerClicks = useRef<number[]>([]);
  const showStart = useRef(0);
  const showDuration = useRef(1.5);
  const elapsed = useRef(0);
  const correctStart = useRef(0);
  const highScore = useRef(0);
  const wrongCell = useRef(-1);

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

  const generatePattern = useCallback(() => {
    const totalCells = gridSize.current * gridSize.current;
    const numLit = Math.min(level.current + 2, Math.floor(totalCells * 0.6));
    const indices: number[] = [];
    while (indices.length < numLit) {
      const idx = Math.floor(Math.random() * totalCells);
      if (!indices.includes(idx)) indices.push(idx);
    }
    pattern.current = indices;
    playerClicks.current = [];
    wrongCell.current = -1;
  }, []);

  const startLevel = useCallback(() => {
    // Increase grid size every 3 levels
    gridSize.current = 3 + Math.floor((level.current - 1) / 3);
    if (gridSize.current > 6) gridSize.current = 6;
    // Slightly less time to memorize at higher levels
    showDuration.current = Math.max(0.8, 1.5 - (level.current - 1) * 0.05);
    generatePattern();
    showStart.current = elapsed.current;
    state.current = "showing";
  }, [generatePattern]);

  const reset = useCallback(() => {
    level.current = 1;
    gridSize.current = 3;
    pattern.current = [];
    playerClicks.current = [];
    wrongCell.current = -1;
    elapsed.current = 0;
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.current === "waiting" || state.current === "gameOver") {
        reset();
        startLevel();
        return;
      }
      if (state.current === "correct") return;
      if (state.current !== "playing") return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = size.w / rect.width;
      const scaleY = size.h / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      const W = size.w,
        H = size.h;
      const gs = gridSize.current;
      const cellSize = Math.min((W - 60) / gs, (H - 120) / gs);
      const gridW = gs * cellSize;
      const gridH = gs * cellSize;
      const offsetX = (W - gridW) / 2;
      const offsetY = (H - gridH) / 2 + 20;

      const col = Math.floor((mx - offsetX) / cellSize);
      const row = Math.floor((my - offsetY) / cellSize);

      if (col < 0 || col >= gs || row < 0 || row >= gs) return;

      const cellIdx = row * gs + col;

      // Ignore already clicked cells
      if (playerClicks.current.includes(cellIdx)) return;

      if (pattern.current.includes(cellIdx)) {
        playerClicks.current.push(cellIdx);
        // Check if all pattern cells clicked
        if (playerClicks.current.length === pattern.current.length) {
          correctStart.current = elapsed.current;
          state.current = "correct";
        }
      } else {
        // Wrong click
        wrongCell.current = cellIdx;
        if (level.current > highScore.current) {
          highScore.current = level.current;
        }
        state.current = "gameOver";
      }
    },
    [size, reset, startLevel]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (state.current === "waiting" || state.current === "gameOver") {
          reset();
          startLevel();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reset, startLevel]);

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

      elapsed.current += dt;

      // State transitions
      if (state.current === "showing") {
        if (elapsed.current - showStart.current > showDuration.current) {
          state.current = "playing";
        }
      }
      if (state.current === "correct") {
        if (elapsed.current - correctStart.current > 0.6) {
          level.current++;
          startLevel();
        }
      }

      const gs = gridSize.current;
      const cellSize = Math.min((W - 60) / gs, (H - 120) / gs);
      const gridW = gs * cellSize;
      const gridH = gs * cellSize;
      const offsetX = (W - gridW) / 2;
      const offsetY = (H - gridH) / 2 + 20;

      // Draw background
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, W, H);

      // Subtle ocean-like wave lines in background
      ctx.strokeStyle = "#0e1525";
      ctx.lineWidth = 1;
      for (let wy = 0; wy < H; wy += 30) {
        ctx.beginPath();
        for (let wx = 0; wx < W; wx += 5) {
          const wave = Math.sin((wx + elapsed.current * 30) * 0.02) * 4;
          if (wx === 0) ctx.moveTo(wx, wy + wave);
          else ctx.lineTo(wx, wy + wave);
        }
        ctx.stroke();
      }

      // Draw grid cells
      for (let r = 0; r < gs; r++) {
        for (let c = 0; c < gs; c++) {
          const x = offsetX + c * cellSize;
          const y = offsetY + r * cellSize;
          const cellIdx = r * gs + c;
          const pad = 3;

          const isPattern = pattern.current.includes(cellIdx);
          const isClicked = playerClicks.current.includes(cellIdx);
          const isWrong = wrongCell.current === cellIdx;

          if (state.current === "showing" && isPattern) {
            // Show pattern - cyan glow
            ctx.fillStyle = "#00d4ff";
            ctx.shadowColor = "#00d4ff";
            ctx.shadowBlur = 12;
            ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
            ctx.shadowBlur = 0;
          } else if (state.current === "gameOver" && isPattern) {
            // Reveal pattern on game over
            ctx.fillStyle = isWrong ? "#ff0040" : "#004466";
            ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
            if (isClicked) {
              ctx.fillStyle = "#00d4ff";
              ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
            }
          } else if (state.current === "gameOver" && isWrong) {
            ctx.fillStyle = "#ff0040";
            ctx.shadowColor = "#ff0040";
            ctx.shadowBlur = 10;
            ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
            ctx.shadowBlur = 0;
          } else if (isClicked) {
            // Correctly clicked - green
            ctx.fillStyle = "#00ff41";
            ctx.shadowColor = "#00ff41";
            ctx.shadowBlur = 8;
            ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
            ctx.shadowBlur = 0;
          } else if (state.current === "correct" && isPattern) {
            // Flash all correct
            ctx.fillStyle = "#00ff41";
            ctx.shadowColor = "#00ff41";
            ctx.shadowBlur = 15;
            ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
            ctx.shadowBlur = 0;
          } else {
            // Default cell
            ctx.fillStyle = "#141425";
            ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
          }

          // Cell border
          ctx.strokeStyle = "#1a2a3a";
          ctx.lineWidth = 1;
          ctx.strokeRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
        }
      }

      // HUD
      ctx.textAlign = "left";
      ctx.fillStyle = "#00d4ff";
      ctx.font = "14px monospace";
      ctx.fillText(`Level: ${level.current}`, 12, 24);
      ctx.textAlign = "right";
      ctx.fillStyle = "#8888a0";
      ctx.font = "14px monospace";
      if (state.current === "playing") {
        ctx.fillText(
          `${playerClicks.current.length}/${pattern.current.length}`,
          W - 12,
          24
        );
      }

      // State overlays
      ctx.textAlign = "center";
      if (state.current === "waiting") {
        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 28px monospace";
        ctx.fillText("MEMORY GRID", W / 2, H / 2 - 50);

        // Decorative grid preview
        const previewSize = 20;
        const previewGap = 4;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const px = W / 2 - (3 * (previewSize + previewGap)) / 2 + c * (previewSize + previewGap);
            const py = H / 2 - 20 + r * (previewSize + previewGap);
            const lit = (r + c) % 2 === 0;
            ctx.fillStyle = lit ? "#00d4ff" : "#141425";
            ctx.fillRect(px, py, previewSize, previewSize);
          }
        }

        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText("Memorize the pattern, then repeat it!", W / 2, H / 2 + 60);
        ctx.fillText("Press SPACE or Click to Start", W / 2, H / 2 + 85);
      } else if (state.current === "showing") {
        ctx.fillStyle = "#00d4ff";
        ctx.font = "16px monospace";
        ctx.fillText("Memorize!", W / 2, offsetY - 12);
        // Timer bar
        const progress = (elapsed.current - showStart.current) / showDuration.current;
        const barW = gridW;
        const barH = 4;
        const barY = offsetY + gridH + 12;
        ctx.fillStyle = "#1a2a3a";
        ctx.fillRect(offsetX, barY, barW, barH);
        ctx.fillStyle = "#00d4ff";
        ctx.fillRect(offsetX, barY, barW * (1 - progress), barH);
      } else if (state.current === "playing") {
        ctx.fillStyle = "#8888a0";
        ctx.font = "13px monospace";
        ctx.fillText("Click the cells!", W / 2, offsetY - 12);
      } else if (state.current === "correct") {
        ctx.fillStyle = "#00ff41";
        ctx.font = "bold 20px monospace";
        ctx.fillText("Correct!", W / 2, offsetY - 12);
      } else if (state.current === "gameOver") {
        ctx.fillStyle = "#ff0040";
        ctx.font = "bold 32px monospace";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 40);
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px monospace";
        ctx.fillText(`Level Reached: ${level.current}`, W / 2, H / 2);
        if (highScore.current > 0) {
          ctx.fillStyle = "#00d4ff";
          ctx.font = "14px monospace";
          ctx.fillText(`Best: Level ${highScore.current}`, W / 2, H / 2 + 28);
        }
        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText("Press SPACE to Retry", W / 2, H / 2 + 58);
      }
    },
    [size, startLevel]
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
