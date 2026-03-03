"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useGameLoop } from "@/hooks/useGameLoop";

type GameState = "waiting" | "ready" | "tooEarly" | "go" | "result" | "gameOver";

const TOTAL_ATTEMPTS = 5;

export default function ReactionTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 400 });
  const state = useRef<GameState>("waiting");
  const elapsed = useRef(0);
  const delayTarget = useRef(0);
  const readyStart = useRef(0);
  const goStart = useRef(0);
  const attempt = useRef(0);
  const times = useRef<number[]>([]);
  const lastTime = useRef(0);
  const tooEarlyStart = useRef(0);
  const resultStart = useRef(0);
  const bestAvg = useRef<number | null>(null);
  const pulseTime = useRef(0);

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

  const startRound = useCallback(() => {
    delayTarget.current = 2 + Math.random() * 3;
    readyStart.current = elapsed.current;
    state.current = "ready";
  }, []);

  const reset = useCallback(() => {
    attempt.current = 0;
    times.current = [];
    lastTime.current = 0;
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      const s = state.current;

      if (s === "waiting") {
        reset();
        startRound();
        return;
      }

      if (s === "ready") {
        // Clicked too early
        tooEarlyStart.current = elapsed.current;
        state.current = "tooEarly";
        return;
      }

      if (s === "tooEarly") {
        // Wait a moment before allowing retry
        if (elapsed.current - tooEarlyStart.current > 0.8) {
          startRound();
        }
        return;
      }

      if (s === "go") {
        // Record reaction time
        const reactionMs = Math.round((elapsed.current - goStart.current) * 1000);
        lastTime.current = reactionMs;
        times.current.push(reactionMs);
        attempt.current++;

        if (attempt.current >= TOTAL_ATTEMPTS) {
          const avg = Math.round(
            times.current.reduce((a, b) => a + b, 0) / times.current.length
          );
          if (bestAvg.current === null || avg < bestAvg.current) {
            bestAvg.current = avg;
          }
          state.current = "gameOver";
        } else {
          resultStart.current = elapsed.current;
          state.current = "result";
        }
        return;
      }

      if (s === "result") {
        if (elapsed.current - resultStart.current > 1.0) {
          startRound();
        }
        return;
      }

      if (s === "gameOver") {
        reset();
        startRound();
        return;
      }
    },
    [reset, startRound]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        // Simulate click for keyboard
        const fakeEvent = { preventDefault: () => {} } as React.MouseEvent<HTMLDivElement>;
        handleClick(fakeEvent);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClick]);

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
      pulseTime.current += dt;

      // State transition: ready -> go
      if (state.current === "ready") {
        if (elapsed.current - readyStart.current >= delayTarget.current) {
          goStart.current = elapsed.current;
          state.current = "go";
        }
      }

      // Background color based on state
      let bgColor = "#0a0a0f";
      const s = state.current;

      if (s === "ready") {
        bgColor = "#1a0a0a";
      } else if (s === "go") {
        bgColor = "#0a1a0a";
      } else if (s === "tooEarly") {
        bgColor = "#1a0a05";
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      // Central circle area
      const cx = W / 2;
      const cy = H / 2;
      const circleR = Math.min(W, H) * 0.2;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (s === "waiting") {
        // Title
        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 28px monospace";
        ctx.fillText("REACTION TEST", cx, cy - 70);

        // Pulsing circle
        const pulse = 0.8 + Math.sin(pulseTime.current * 2) * 0.2;
        ctx.strokeStyle = "#00d4ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy + 20, circleR * pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 20px monospace";
        ctx.fillText("?", cx, cy + 20);

        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText("Best of 5 attempts", cx, cy + 80);
        ctx.fillText("Press SPACE or Click to Start", cx, cy + 105);

        if (bestAvg.current !== null) {
          ctx.fillStyle = "#00d4ff";
          ctx.font = "13px monospace";
          ctx.fillText(`Personal Best: ${bestAvg.current}ms avg`, cx, cy + 135);
        }
      } else if (s === "ready") {
        // Red waiting state
        ctx.fillStyle = "#ff0040";
        ctx.beginPath();
        ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px monospace";
        ctx.fillText("Wait...", cx, cy);

        // Attempt indicator
        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText(
          `Attempt ${attempt.current + 1} of ${TOTAL_ATTEMPTS}`,
          cx,
          H - 40
        );
      } else if (s === "go") {
        // Green - click now!
        const glow = 0.8 + Math.sin(pulseTime.current * 8) * 0.2;
        ctx.fillStyle = "#00ff41";
        ctx.shadowColor = "#00ff41";
        ctx.shadowBlur = 30 * glow;
        ctx.beginPath();
        ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#0a0a0f";
        ctx.font = "bold 20px monospace";
        ctx.fillText("CLICK!", cx, cy);

        // Timer
        const liveMs = Math.round((elapsed.current - goStart.current) * 1000);
        ctx.fillStyle = "#00ff41";
        ctx.font = "16px monospace";
        ctx.fillText(`${liveMs}ms`, cx, cy + circleR + 30);

        // Attempt indicator
        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText(
          `Attempt ${attempt.current + 1} of ${TOTAL_ATTEMPTS}`,
          cx,
          H - 40
        );
      } else if (s === "tooEarly") {
        // Too early warning
        ctx.fillStyle = "#ff4400";
        ctx.beginPath();
        ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px monospace";
        ctx.fillText("Too early!", cx, cy - 10);
        ctx.font = "14px monospace";
        ctx.fillText("Click to try again", cx, cy + 20);
      } else if (s === "result") {
        // Show result for this attempt
        const ms = lastTime.current;
        let color = "#00ff41";
        let label = "Great!";
        if (ms < 200) {
          color = "#00d4ff";
          label = "Incredible!";
        } else if (ms < 300) {
          color = "#00ff41";
          label = "Fast!";
        } else if (ms < 400) {
          color = "#ffb000";
          label = "Good";
        } else {
          color = "#ff4400";
          label = "Slow...";
        }

        ctx.fillStyle = color;
        ctx.font = "bold 48px monospace";
        ctx.fillText(`${ms}ms`, cx, cy - 20);

        ctx.fillStyle = color;
        ctx.font = "18px monospace";
        ctx.fillText(label, cx, cy + 25);

        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText("Click for next attempt", cx, cy + 60);
        ctx.fillText(
          `Attempt ${attempt.current} of ${TOTAL_ATTEMPTS}`,
          cx,
          H - 40
        );

        // Previous times
        if (times.current.length > 0) {
          ctx.fillStyle = "#555570";
          ctx.font = "12px monospace";
          const timesStr = times.current.map((t) => `${t}ms`).join("  ");
          ctx.fillText(timesStr, cx, H - 60);
        }
      } else if (s === "gameOver") {
        // Final results
        const avg = Math.round(
          times.current.reduce((a, b) => a + b, 0) / times.current.length
        );
        const best = Math.min(...times.current);
        const worst = Math.max(...times.current);

        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 24px monospace";
        ctx.fillText("RESULTS", cx, cy - 90);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px monospace";
        ctx.fillText(`${avg}ms`, cx, cy - 40);
        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText("average", cx, cy - 10);

        // Individual times
        ctx.font = "13px monospace";
        ctx.fillStyle = "#555570";
        for (let i = 0; i < times.current.length; i++) {
          const t = times.current[i];
          let c = "#8888a0";
          if (t === best) c = "#00ff41";
          if (t === worst) c = "#ff4400";
          ctx.fillStyle = c;
          ctx.fillText(
            `#${i + 1}: ${t}ms`,
            cx,
            cy + 20 + i * 20
          );
        }

        // Best/worst labels
        ctx.fillStyle = "#00ff41";
        ctx.font = "13px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`Best: ${best}ms`, 20, H - 60);
        ctx.fillStyle = "#ff4400";
        ctx.fillText(`Worst: ${worst}ms`, 20, H - 40);

        if (bestAvg.current !== null) {
          ctx.textAlign = "right";
          ctx.fillStyle = "#00d4ff";
          ctx.fillText(`Personal Best: ${bestAvg.current}ms`, W - 20, H - 60);
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "#8888a0";
        ctx.font = "14px monospace";
        ctx.fillText("Press SPACE to Play Again", cx, H - 20);
      }

      // Top bar showing attempt dots
      if (s !== "waiting" && s !== "gameOver") {
        const dotR = 6;
        const dotGap = 24;
        const dotsX = cx - ((TOTAL_ATTEMPTS - 1) * dotGap) / 2;
        for (let i = 0; i < TOTAL_ATTEMPTS; i++) {
          const dx = dotsX + i * dotGap;
          const dy = 20;
          ctx.beginPath();
          ctx.arc(dx, dy, dotR, 0, Math.PI * 2);
          if (i < times.current.length) {
            ctx.fillStyle = "#00ff41";
            ctx.fill();
          } else if (i === attempt.current) {
            ctx.fillStyle = "#00d4ff";
            ctx.fill();
          } else {
            ctx.strokeStyle = "#333350";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }
    },
    [size]
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
