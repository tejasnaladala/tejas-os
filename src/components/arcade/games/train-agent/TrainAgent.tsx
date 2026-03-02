"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";

const GRID = 6;
const ACTIONS = ["up", "down", "left", "right"] as const;
type Action = (typeof ACTIONS)[number];

function stateKey(x: number, y: number) { return `${x},${y}`; }

function moveAgent(x: number, y: number, action: Action): [number, number] {
  switch (action) {
    case "up": return [x, Math.max(0, y - 1)];
    case "down": return [x, Math.min(GRID - 1, y + 1)];
    case "left": return [Math.max(0, x - 1), y];
    case "right": return [Math.min(GRID - 1, x + 1), y];
  }
}

export default function TrainAgent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 500 });

  const qTable = useRef<Record<string, Record<Action, number>>>({});
  const agentPos = useRef({ x: 0, y: 0 });
  const episode = useRef(1);
  const totalReward = useRef(0);
  const successes = useRef(0);
  const consecutiveSuccesses = useRef(0);
  const rewardHistory = useRef<number[]>([]);
  const lastAction = useRef<Action | null>(null);
  const lastState = useRef<string | null>(null);
  const moveTimer = useRef(0);
  const [won, setWon] = useState(false);
  const needsFeedback = useRef(false);
  const epsilon = useRef(0.3);
  const stepCount = useRef(0);

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

  const getQ = useCallback((s: string, a: Action): number => {
    return qTable.current[s]?.[a] ?? 0;
  }, []);

  const setQ = useCallback((s: string, a: Action, v: number) => {
    if (!qTable.current[s]) qTable.current[s] = { up: 0, down: 0, left: 0, right: 0 };
    qTable.current[s][a] = v;
  }, []);

  const bestAction = useCallback((s: string): Action => {
    let best: Action = "up", bestVal = -Infinity;
    for (const a of ACTIONS) {
      const v = getQ(s, a);
      if (v > bestVal) { bestVal = v; best = a; }
    }
    return best;
  }, [getQ]);

  const chooseAction = useCallback((): Action => {
    const s = stateKey(agentPos.current.x, agentPos.current.y);
    if (Math.random() < epsilon.current) return ACTIONS[Math.floor(Math.random() * 4)];
    return bestAction(s);
  }, [bestAction]);

  const step = useCallback(() => {
    if (needsFeedback.current || won) return;
    const s = stateKey(agentPos.current.x, agentPos.current.y);
    const a = chooseAction();
    const [nx, ny] = moveAgent(agentPos.current.x, agentPos.current.y, a);
    agentPos.current = { x: nx, y: ny };
    lastAction.current = a;
    lastState.current = s;
    stepCount.current++;
    needsFeedback.current = true;

    // Auto-reward when reaching goal
    if (nx === GRID - 1 && ny === GRID - 1) {
      applyReward(1);
      successes.current++;
      consecutiveSuccesses.current++;
      if (consecutiveSuccesses.current >= 3) setWon(true);
      // Reset for new episode
      agentPos.current = { x: 0, y: 0 };
      episode.current++;
      epsilon.current = Math.max(0.05, epsilon.current * 0.95);
    }
  }, [chooseAction, won]);

  const applyReward = useCallback((reward: number) => {
    if (lastState.current === null || lastAction.current === null) return;
    const s = lastState.current;
    const a = lastAction.current;
    const ns = stateKey(agentPos.current.x, agentPos.current.y);
    const maxNextQ = Math.max(...ACTIONS.map((na) => getQ(ns, na)));
    const oldQ = getQ(s, a);
    setQ(s, a, oldQ + 0.1 * (reward + 0.9 * maxNextQ - oldQ));
    totalReward.current += reward;
    rewardHistory.current.push(reward);
    if (rewardHistory.current.length > 20) rewardHistory.current.shift();
    needsFeedback.current = false;
  }, [getQ, setQ]);

  const handleReward = useCallback(() => {
    if (!needsFeedback.current) return;
    applyReward(1);
  }, [applyReward]);

  const handlePunish = useCallback(() => {
    if (!needsFeedback.current) return;
    applyReward(-1);
    // If punished too far from goal, reset episode
    if (stepCount.current > 50) {
      agentPos.current = { x: 0, y: 0 };
      episode.current++;
      consecutiveSuccesses.current = 0;
      stepCount.current = 0;
    }
  }, [applyReward]);

  const handleReset = useCallback(() => {
    qTable.current = {};
    agentPos.current = { x: 0, y: 0 };
    episode.current = 1;
    totalReward.current = 0;
    successes.current = 0;
    consecutiveSuccesses.current = 0;
    rewardHistory.current = [];
    lastAction.current = null;
    lastState.current = null;
    needsFeedback.current = false;
    epsilon.current = 0.3;
    stepCount.current = 0;
    setWon(false);
  }, []);

  const update = useCallback((dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = size.w, H = size.h;
    canvas.width = W; canvas.height = H;

    // Auto-step
    if (!needsFeedback.current && !won) {
      moveTimer.current += dt;
      if (moveTimer.current >= 0.8) {
        moveTimer.current = 0;
        step();
      }
    }

    const cellSize = Math.min(Math.floor((W - 40) / GRID), Math.floor((H - 180) / GRID));
    const ox = Math.floor((W - cellSize * GRID) / 2);
    const oy = 20;

    // Background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, W, H);

    // Grid
    for (let y = 0; y < GRID; y++)
      for (let x = 0; x < GRID; x++) {
        ctx.fillStyle = "#12121a";
        ctx.fillRect(ox + x * cellSize + 1, oy + y * cellSize + 1, cellSize - 2, cellSize - 2);
        ctx.strokeStyle = "#2a2a3e";
        ctx.lineWidth = 1;
        ctx.strokeRect(ox + x * cellSize, oy + y * cellSize, cellSize, cellSize);
      }

    // Goal
    const gx = ox + (GRID - 1) * cellSize + cellSize / 2;
    const gy = oy + (GRID - 1) * cellSize + cellSize / 2;
    ctx.fillStyle = "#ffb000";
    const sr = cellSize * 0.3;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = angle + Math.PI / 5;
      if (i === 0) ctx.moveTo(gx + Math.cos(angle) * sr, gy + Math.sin(angle) * sr);
      else ctx.lineTo(gx + Math.cos(angle) * sr, gy + Math.sin(angle) * sr);
      ctx.lineTo(gx + Math.cos(innerAngle) * sr * 0.5, gy + Math.sin(innerAngle) * sr * 0.5);
    }
    ctx.closePath();
    ctx.fill();

    // Agent
    const ax = ox + agentPos.current.x * cellSize + 2;
    const ay = oy + agentPos.current.y * cellSize + 2;
    ctx.fillStyle = "#00ff41";
    ctx.fillRect(ax, ay, cellSize - 4, cellSize - 4);

    // Q-value arrows (subtle)
    for (let y = 0; y < GRID; y++)
      for (let x = 0; x < GRID; x++) {
        const s = stateKey(x, y);
        const ba = bestAction(s);
        const bv = getQ(s, ba);
        if (bv === 0) continue;
        const cx = ox + x * cellSize + cellSize / 2;
        const cy = oy + y * cellSize + cellSize / 2;
        ctx.strokeStyle = "rgba(0,255,65,0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const dx = ba === "right" ? 10 : ba === "left" ? -10 : 0;
        const dy = ba === "down" ? 10 : ba === "up" ? -10 : 0;
        ctx.lineTo(cx + dx, cy + dy);
        ctx.stroke();
      }

    // Stats
    const statsY = oy + cellSize * GRID + 20;
    ctx.font = "12px monospace";
    ctx.fillStyle = "#8888a0";
    ctx.textAlign = "left";
    ctx.fillText(`Episode: ${episode.current}`, ox, statsY);
    ctx.fillText(`Total Reward: ${totalReward.current}`, ox, statsY + 18);
    ctx.fillText(`Successes: ${successes.current} (${consecutiveSuccesses.current}/3 consecutive)`, ox, statsY + 36);

    // Reward history bar chart
    const chartY = statsY + 56;
    const chartH = 40;
    const barW = Math.max(4, Math.floor((cellSize * GRID) / 20));
    ctx.fillStyle = "#8888a0";
    ctx.font = "10px monospace";
    ctx.fillText("Recent rewards:", ox, chartY - 4);
    for (let i = 0; i < rewardHistory.current.length; i++) {
      const v = rewardHistory.current[i];
      const bh = Math.abs(v) * (chartH / 2);
      ctx.fillStyle = v > 0 ? "#00ff41" : "#ff0040";
      const by = v > 0 ? chartY + chartH / 2 - bh : chartY + chartH / 2;
      ctx.fillRect(ox + i * (barW + 2), by, barW, bh);
    }

    // Feedback indicator
    if (needsFeedback.current) {
      ctx.fillStyle = "#ffb000";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Waiting for feedback...", W / 2, statsY - 4);
    }

    if (won) {
      ctx.fillStyle = "rgba(10,10,15,0.8)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#00ff41";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("AGENT TRAINED!", W / 2, H / 2 - 20);
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px monospace";
      ctx.fillText(`Reached goal 3 times in a row!`, W / 2, H / 2 + 12);
      ctx.fillText(`Episodes: ${episode.current}`, W / 2, H / 2 + 34);
    }
  }, [size, step, bestAction, getQ, won]);

  useGameLoop(update, true);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      <canvas ref={canvasRef} style={{ flex: 1, display: "block", width: "100%" }} />
      <div style={{ display: "flex", gap: 8, padding: "10px 16px", background: "var(--bg-surface)", borderTop: "1px solid var(--border)", justifyContent: "center", flexShrink: 0 }}>
        <button onClick={handleReward} style={{ background: "#00ff41", color: "#0a0a0f", border: "none", borderRadius: 4, padding: "8px 20px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: needsFeedback.current ? 1 : 0.4 }}>REWARD (+1)</button>
        <button onClick={handlePunish} style={{ background: "#ff0040", color: "#ffffff", border: "none", borderRadius: 4, padding: "8px 20px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: needsFeedback.current ? 1 : 0.4 }}>PUNISH (-1)</button>
        <button onClick={handleReset} style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: 4, padding: "8px 20px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>RESET</button>
      </div>
    </div>
  );
}
