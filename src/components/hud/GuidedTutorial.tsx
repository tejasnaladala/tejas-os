"use client";

import { useEffect, useCallback, useState } from "react";
import { useOceanStore } from "@/stores/oceanStore";

/* ─── Tutorial step definitions ─── */

interface TutorialStep {
  /** Where the spotlight + arrow points (viewport-relative) */
  target: { x: string; y: string };
  /** Where the tooltip card is placed */
  tooltip: { x: string; y: string; anchor: string };
  /** Arrow direction FROM tooltip TO target */
  arrowDir: "up" | "down" | "left" | "right" | "none";
  /** Label shown above the description */
  label: string;
  /** Description text */
  description: string;
}

const STEPS: TutorialStep[] = [
  {
    // Step 0 – Welcome (centered, no arrow)
    target: { x: "50%", y: "50%" },
    tooltip: { x: "50%", y: "50%", anchor: "translate(-50%,-50%)" },
    arrowDir: "none",
    label: "Welcome Aboard",
    description:
      "Welcome to my underwater portfolio. Use WASD or arrow keys to pilot the submarine. Let me show you around.",
  },
  {
    // Step 1 – HUD panel (top-left: fixed top-4 left-4, ~200x280px)
    target: { x: "90px", y: "100px" },
    tooltip: { x: "280px", y: "100px", anchor: "translate(0,-50%)" },
    arrowDir: "left",
    label: "HUD Panel",
    description: "Monitor your depth, zone, speed, and toggle FPV cockpit mode.",
  },
  {
    // Step 2 – Nav bar (top-right: fixed top-4 right-4)
    target: { x: "calc(100% - 120px)", y: "28px" },
    tooltip: { x: "calc(100% - 120px)", y: "100px", anchor: "translate(-50%,0)" },
    arrowDir: "up",
    label: "Nav Bar",
    description: "Quick-teleport to any discovered station by clicking its icon.",
  },
  {
    // Step 3 – Minimap (bottom-right: fixed bottom-4 right-4, 160x120)
    target: { x: "calc(100% - 96px)", y: "calc(100% - 76px)" },
    tooltip: { x: "calc(100% - 96px)", y: "calc(100% - 220px)", anchor: "translate(-50%,0)" },
    arrowDir: "down",
    label: "Minimap",
    description:
      "Navigate the ocean from here. Click any station dot to fast-travel. Click the arrow to expand.",
  },
  {
    // Step 4 – Discovery log (bottom-left: fixed bottom-4 left-4)
    target: { x: "80px", y: "calc(100% - 50px)" },
    tooltip: { x: "250px", y: "calc(100% - 50px)", anchor: "translate(0,-50%)" },
    arrowDir: "left",
    label: "Discovery Log",
    description: "Track how many stations you\u2019ve explored.",
  },
  {
    // Step 5 – Hostile creatures warning (centered, no arrow)
    target: { x: "50%", y: "50%" },
    tooltip: { x: "50%", y: "50%", anchor: "translate(-50%,-50%)" },
    arrowDir: "none",
    label: "Beware!",
    description:
      "Hostile creatures lurk in the deep. Press SPACE to shoot them! Use SHIFT to boost away from danger.",
  },
  {
    // Step 6 – Final message (centered, no arrow)
    target: { x: "50%", y: "50%" },
    tooltip: { x: "50%", y: "50%", anchor: "translate(-50%,-50%)" },
    arrowDir: "none",
    label: "You\u2019re Ready!",
    description:
      "Use WASD to move, SHIFT to boost, SPACE to shoot, ENTER to dock at stations. Go explore!",
  },
];

const TOTAL = STEPS.length;

/* ─── Component ─── */

export default function GuidedTutorial() {
  const active = useOceanStore((s) => s.guidedTutorialActive);
  const step = useOceanStore((s) => s.guidedTutorialStep);
  const nextStep = useOceanStore((s) => s.nextGuidedStep);
  const endTutorial = useOceanStore((s) => s.endGuidedTutorial);

  // Local fade state for smooth transitions
  const [visible, setVisible] = useState(false);

  // Fade in when tutorial becomes active or step changes
  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    // Brief delay so the fade-in transition plays
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, [active, step]);

  const advance = useCallback(() => {
    // Fade out, then advance
    setVisible(false);
    setTimeout(() => {
      if (step >= TOTAL - 1) {
        endTutorial();
      } else {
        nextStep();
      }
    }, 200);
  }, [step, nextStep, endTutorial]);

  const skip = useCallback(() => {
    setVisible(false);
    setTimeout(() => endTutorial(), 200);
  }, [endTutorial]);

  // Keyboard controls
  useEffect(() => {
    if (!active) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        advance();
      } else if (e.key === "Escape") {
        e.preventDefault();
        skip();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, advance, skip]);

  if (!active) return null;

  const s = STEPS[Math.min(step, TOTAL - 1)];
  const isLast = step >= TOTAL - 1;

  return (
    <>
      {/* Injected keyframes */}
      <style>{`
        @keyframes gt-arrow-bounce-v {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes gt-arrow-bounce-v-up {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes gt-arrow-bounce-h {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50%      { transform: translateY(-50%) translateX(-8px); }
        }
        @keyframes gt-arrow-bounce-h-right {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50%      { transform: translateY(-50%) translateX(8px); }
        }
        @keyframes gt-pulse-ring {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[200]"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: active ? "auto" : "none",
        }}
      >
        {/* ── Dark overlay with spotlight ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <radialGradient id="gt-spot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="70%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.75" />
            </radialGradient>
            <mask id="gt-mask">
              <rect width="100%" height="100%" fill="white" />
              <circle
                cx={s.target.x}
                cy={s.target.y}
                r="60"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(2,6,14,0.72)"
            mask="url(#gt-mask)"
          />
        </svg>

        {/* ── Pulsing ring at target ── */}
        {s.arrowDir !== "none" && (
          <div
            className="absolute rounded-full"
            style={{
              left: s.target.x,
              top: s.target.y,
              width: 80,
              height: 80,
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px solid #00d4ff",
                animation: "gt-pulse-ring 1.8s ease-out infinite",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1px solid rgba(0,212,255,0.35)",
              }}
            />
          </div>
        )}

        {/* ── Arrow ── */}
        {s.arrowDir !== "none" && (
          <Arrow
            dir={s.arrowDir}
            targetX={s.target.x}
            targetY={s.target.y}
            tooltipX={s.tooltip.x}
            tooltipY={s.tooltip.y}
          />
        )}

        {/* ── Tooltip card ── */}
        <div
          className="absolute"
          style={{
            left: s.tooltip.x,
            top: s.tooltip.y,
            transform: s.tooltip.anchor,
            pointerEvents: "auto",
          }}
        >
          <div
            className="font-mono rounded-sm px-6 py-5 max-w-xs text-center select-none"
            style={{
              background: "rgba(10, 15, 26, 0.92)",
              border: "1px solid rgba(0, 212, 255, 0.35)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 32px rgba(0,212,255,0.08)",
            }}
          >
            {/* Label */}
            <p
              className="text-[10px] tracking-[0.2em] uppercase mb-2"
              style={{ color: "#00d4ff" }}
            >
              {s.label}
            </p>

            {/* Description */}
            <p
              className="text-[12px] leading-relaxed mb-5"
              style={{ color: "#c8d6e5" }}
            >
              {s.description}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={skip}
                className="text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                style={{ color: "#5f7a94", background: "none", border: "none" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#c8d6e5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#5f7a94")
                }
              >
                Skip
              </button>

              <button
                onClick={advance}
                className="text-[11px] tracking-wider uppercase px-5 py-1.5 rounded-sm cursor-pointer transition-all"
                style={{
                  color: "#0a0f1a",
                  background: "#00d4ff",
                  border: "none",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#33dfff";
                  e.currentTarget.style.boxShadow =
                    "0 0 14px rgba(0,212,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#00d4ff";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {isLast ? "Finish" : "Next"}
              </button>
            </div>

            {/* Step counter */}
            <p
              className="text-[10px] mt-4 tabular-nums tracking-wider"
              style={{ color: "#5f7a94" }}
            >
              {step + 1} / {TOTAL}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Arrow sub-component ─── */

function Arrow({
  dir,
  targetX,
  targetY,
  tooltipX,
  tooltipY,
}: {
  dir: "up" | "down" | "left" | "right";
  targetX: string;
  targetY: string;
  tooltipX: string;
  tooltipY: string;
}) {
  // Position the arrow between tooltip and target.
  // The arrow is a line + CSS triangle pointing toward the target.

  const color = "#00d4ff";

  // For vertical arrows (up/down), place the arrow horizontally at target X,
  // vertically midway between tooltip and target.
  // For horizontal arrows (left/right), same idea but horizontally.

  const shared: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
  };

  if (dir === "down") {
    // Arrow sits below tooltip, pointing down toward target
    return (
      <div
        style={{
          ...shared,
          left: targetX,
          top: `calc(${tooltipY} + 60px)`,
          animation: "gt-arrow-bounce-v 1.4s ease-in-out infinite",
        }}
      >
        {/* Line */}
        <div
          style={{
            width: 2,
            height: 48,
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            margin: "0 auto",
          }}
        />
        {/* Triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: `10px solid ${color}`,
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  if (dir === "up") {
    // Arrow sits above tooltip, pointing up toward target
    return (
      <div
        style={{
          ...shared,
          left: targetX,
          bottom: `calc(100% - ${tooltipY} + 60px)`,
          animation: "gt-arrow-bounce-v-up 1.4s ease-in-out infinite",
        }}
      >
        {/* Triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderBottom: `10px solid ${color}`,
            margin: "0 auto",
          }}
        />
        {/* Line */}
        <div
          style={{
            width: 2,
            height: 48,
            background: `linear-gradient(to top, ${color}, transparent)`,
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  if (dir === "left") {
    // Arrow points left toward target
    return (
      <div
        style={{
          ...shared,
          top: targetY,
          left: `calc(${targetX} + 50px)`,
          display: "flex",
          alignItems: "center",
          animation: "gt-arrow-bounce-h 1.4s ease-in-out infinite",
        }}
      >
        {/* Triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "7px solid transparent",
            borderBottom: "7px solid transparent",
            borderRight: `10px solid ${color}`,
            flexShrink: 0,
          }}
        />
        {/* Line */}
        <div
          style={{
            height: 2,
            width: 48,
            background: `linear-gradient(to left, transparent, ${color})`,
            flexShrink: 0,
          }}
        />
      </div>
    );
  }

  // dir === "right"
  return (
    <div
      style={{
        ...shared,
        top: targetY,
        right: `calc(100% - ${targetX} + 50px)`,
        display: "flex",
        alignItems: "center",
        animation: "gt-arrow-bounce-h-right 1.4s ease-in-out infinite",
      }}
    >
      {/* Line */}
      <div
        style={{
          height: 2,
          width: 48,
          background: `linear-gradient(to right, transparent, ${color})`,
          flexShrink: 0,
        }}
      />
      {/* Triangle */}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "7px solid transparent",
          borderBottom: "7px solid transparent",
          borderLeft: `10px solid ${color}`,
          flexShrink: 0,
        }}
      />
    </div>
  );
}
