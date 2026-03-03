"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";

type GameState = "waiting" | "playing" | "gameOver";

const COLS = 10, ROWS = 20;
const SHAPES: number[][][] = [
  [[1,1,1,1]],                    // I
  [[1,1],[1,1]],                  // O
  [[0,1,0],[1,1,1]],              // T
  [[0,1,1],[1,1,0]],              // S
  [[1,1,0],[0,1,1]],              // Z
  [[1,0,0],[1,1,1]],              // J
  [[0,0,1],[1,1,1]],              // L
];
const COLORS = ["#00d4ff","#ffb000","#a855f7","#00ff41","#ff0040","#3b82f6","#f97316"];

function rotate(shape: number[][]): number[][] {
  const rows = shape.length, cols = shape[0].length;
  const r: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) r[x][rows - 1 - y] = shape[y][x];
  return r;
}

export default function TetrominoAI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 500 });
  const gs = useRef<GameState>("waiting");
  const board = useRef<(number | null)[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const piece = useRef({ shape: SHAPES[0], color: 0, x: 3, y: 0 });
  const nextPiece = useRef({ shape: SHAPES[0], color: 0 });
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const linesRef = useRef(0);
  const dropTimer = useRef(0);
  const started = useRef(false);

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

  const randomPiece = useCallback(() => {
    const i = Math.floor(Math.random() * SHAPES.length);
    return { shape: SHAPES[i], color: i };
  }, []);

  const collides = useCallback((shape: number[][], px: number, py: number) => {
    for (let y = 0; y < shape.length; y++)
      for (let x = 0; x < shape[y].length; x++)
        if (shape[y][x]) {
          const bx = px + x, by = py + y;
          if (bx < 0 || bx >= COLS || by >= ROWS) return true;
          if (by >= 0 && board.current[by][bx] !== null) return true;
        }
    return false;
  }, []);

  const lockPiece = useCallback(() => {
    const p = piece.current;
    for (let y = 0; y < p.shape.length; y++)
      for (let x = 0; x < p.shape[y].length; x++)
        if (p.shape[y][x]) {
          const by = p.y + y;
          if (by >= 0) board.current[by][p.x + x] = p.color;
        }
    // Clear lines
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board.current[y].every((c) => c !== null)) {
        board.current.splice(y, 1);
        board.current.unshift(Array(COLS).fill(null));
        cleared++; y++;
      }
    }
    if (cleared > 0) {
      const pts = [0, 100, 300, 500, 800];
      scoreRef.current += pts[cleared] || 800;
      linesRef.current += cleared;
      levelRef.current = Math.floor(linesRef.current / 10) + 1;
    }
    // Next piece
    piece.current = { shape: nextPiece.current.shape, color: nextPiece.current.color, x: Math.floor((COLS - nextPiece.current.shape[0].length) / 2), y: 0 };
    nextPiece.current = randomPiece();
    if (collides(piece.current.shape, piece.current.x, piece.current.y)) {
      gs.current = "gameOver";
    }
  }, [collides, randomPiece]);

  const move = useCallback((dx: number, dy: number): boolean => {
    const p = piece.current;
    if (!collides(p.shape, p.x + dx, p.y + dy)) { p.x += dx; p.y += dy; return true; }
    return false;
  }, [collides]);

  const rotatePiece = useCallback(() => {
    const p = piece.current;
    const r = rotate(p.shape);
    if (!collides(r, p.x, p.y)) { p.shape = r; return; }
    if (!collides(r, p.x - 1, p.y)) { p.shape = r; p.x -= 1; return; }
    if (!collides(r, p.x + 1, p.y)) { p.shape = r; p.x += 1; return; }
  }, [collides]);

  const hardDrop = useCallback(() => {
    while (move(0, 1)) { /* drop */ }
    lockPiece();
  }, [move, lockPiece]);

  const resetGame = useCallback(() => {
    board.current = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const np = randomPiece();
    piece.current = { shape: np.shape, color: np.color, x: Math.floor((COLS - np.shape[0].length) / 2), y: 0 };
    nextPiece.current = randomPiece();
    scoreRef.current = 0;
    levelRef.current = 1;
    linesRef.current = 0;
    dropTimer.current = 0;
  }, [randomPiece]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gs.current === "waiting") {
        resetGame();
        gs.current = "playing";
        started.current = true;
        e.preventDefault();
        return;
      }
      if (gs.current === "gameOver" && e.code === "Space") {
        resetGame();
        gs.current = "playing";
        e.preventDefault();
        return;
      }
      if (gs.current !== "playing") return;
      switch (e.code) {
        case "ArrowLeft": move(-1, 0); break;
        case "ArrowRight": move(1, 0); break;
        case "ArrowDown": move(0, 1); break;
        case "ArrowUp": rotatePiece(); break;
        case "Space": hardDrop(); break;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move, rotatePiece, hardDrop, resetGame]);

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

    const cellSize = Math.min(Math.floor((H - 20) / ROWS), Math.floor((W - 140) / COLS));
    const gridW = cellSize * COLS, gridH = cellSize * ROWS;
    const ox = 10, oy = Math.floor((H - gridH) / 2);

    // Update drop
    if (gs.current === "playing") {
      const dropSpeed = Math.max(0.05, 0.6 - (levelRef.current - 1) * 0.05);
      dropTimer.current += dt;
      if (dropTimer.current >= dropSpeed) {
        dropTimer.current = 0;
        if (!move(0, 1)) lockPiece();
      }
    }

    // Draw background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 0.5;
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(ox, oy + y * cellSize); ctx.lineTo(ox + gridW, oy + y * cellSize); ctx.stroke(); }
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(ox + x * cellSize, oy); ctx.lineTo(ox + x * cellSize, oy + gridH); ctx.stroke(); }

    // Board
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        const c = board.current[y][x];
        if (c !== null) {
          ctx.fillStyle = COLORS[c];
          ctx.fillRect(ox + x * cellSize + 1, oy + y * cellSize + 1, cellSize - 2, cellSize - 2);
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 1;
          ctx.strokeRect(ox + x * cellSize + 3, oy + y * cellSize + 3, cellSize - 6, cellSize - 6);
        }
      }

    // Current piece
    if (gs.current === "playing" || gs.current === "waiting") {
      const p = piece.current;
      for (let y = 0; y < p.shape.length; y++)
        for (let x = 0; x < p.shape[y].length; x++)
          if (p.shape[y][x] && p.y + y >= 0) {
            ctx.fillStyle = COLORS[p.color];
            ctx.fillRect(ox + (p.x + x) * cellSize + 1, oy + (p.y + y) * cellSize + 1, cellSize - 2, cellSize - 2);
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 1;
            ctx.strokeRect(ox + (p.x + x) * cellSize + 3, oy + (p.y + y) * cellSize + 3, cellSize - 6, cellSize - 6);
          }
    }

    // Side panel
    const sx = ox + gridW + 20;
    ctx.fillStyle = "#e0e0e8";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "left";
    ctx.fillText("NEXT", sx, oy + 16);

    // Next piece preview
    const np = nextPiece.current;
    const prevCell = Math.min(cellSize, 18);
    for (let y = 0; y < np.shape.length; y++)
      for (let x = 0; x < np.shape[y].length; x++)
        if (np.shape[y][x]) {
          ctx.fillStyle = COLORS[np.color];
          ctx.fillRect(sx + x * prevCell, oy + 28 + y * prevCell, prevCell - 2, prevCell - 2);
        }

    ctx.fillStyle = "#8888a0";
    ctx.font = "12px monospace";
    ctx.fillText(`Score`, sx, oy + 120);
    ctx.fillStyle = "#e0e0e8";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`${scoreRef.current}`, sx, oy + 140);
    ctx.fillStyle = "#8888a0";
    ctx.font = "12px monospace";
    ctx.fillText(`Level`, sx, oy + 170);
    ctx.fillStyle = "#e0e0e8";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`${levelRef.current}`, sx, oy + 190);
    ctx.fillStyle = "#8888a0";
    ctx.font = "12px monospace";
    ctx.fillText(`Lines`, sx, oy + 220);
    ctx.fillStyle = "#e0e0e8";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`${linesRef.current}`, sx, oy + 240);

    // Overlays
    ctx.textAlign = "center";
    if (gs.current === "waiting") {
      ctx.fillStyle = "#00ff41";
      ctx.font = "14px monospace";
      ctx.fillText("Press any key to start", ox + gridW / 2, oy + gridH / 2);
    } else if (gs.current === "gameOver") {
      ctx.fillStyle = "rgba(10,10,15,0.7)";
      ctx.fillRect(ox, oy, gridW, gridH);
      ctx.fillStyle = "#ff0040";
      ctx.font = "bold 24px monospace";
      ctx.fillText("GAME OVER", ox + gridW / 2, oy + gridH / 2 - 20);
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${scoreRef.current}`, ox + gridW / 2, oy + gridH / 2 + 16);
      ctx.fillStyle = "#8888a0";
      ctx.font = "13px monospace";
      ctx.fillText("Press SPACE to retry", ox + gridW / 2, oy + gridH / 2 + 46);
    }
  }, [size, move, lockPiece]);

  useGameLoop(update, true);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
