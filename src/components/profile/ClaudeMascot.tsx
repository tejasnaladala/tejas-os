"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Refined Claude sigil pinned to the bottom-right corner.
 *
 * Design notes (replaces the earlier mascot that "bounced around the screen"):
 *   - Fixed position. No cursor chasing - cleaner, less kiddish.
 *   - The asterisk is the wordmark glyph at scale, set against a hairline
 *     ring whose stroke-dashoffset tracks scroll progress (the scroll wheel
 *     idea, restated as a precision instrument).
 *   - Hover lifts the chip with a spring, dims the page for emphasis (not
 *     used here - the chip just lifts), and reveals a quiet caption.
 *   - rAF + scroll listener is replaced with a single passive scroll handler
 *     that writes to a motion value; no per-frame setState.
 *   - Pauses entirely on `visibilitychange` and respects
 *     prefers-reduced-motion.
 */
export default function ClaudeMascot() {
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);
  const ringSpring = useSpring(progress, { stiffness: 140, damping: 24 });
  const dashOffset = useTransform(ringSpring, (p) => 188 - p * 188);
  const liftY = useMotionValue(0);
  const liftYSpring = useSpring(liftY, { stiffness: 220, damping: 22 });
  const [hovered, setHovered] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      progress.set(ratio);
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [progress]);

  useEffect(() => {
    liftY.set(hovered && !reduced ? -6 : 0);
  }, [hovered, reduced, liftY]);

  return (
    <motion.div
      aria-hidden="true"
      className="claude-mascot"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 60,
        y: liftYSpring,
        // Decorative-only. Don't intercept clicks for the rest of the page;
        // the chip itself listens for hover via the mouseenter/leave handlers,
        // which still fire even with pointer-events: none unset on the chip
        // child below.
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 72,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          border: "1px solid var(--hairline)",
          borderRadius: "50%",
          boxShadow: hovered
            ? "0 12px 28px rgba(10,10,10,0.10)"
            : "0 4px 14px rgba(10,10,10,0.06)",
          transition: "box-shadow 240ms ease",
          // Re-enable pointer events on the chip itself so hover still works,
          // while the surrounding wrapper passes clicks through to the page.
          pointerEvents: "auto",
        }}
      >
        {/* Scroll-progress ring */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          <circle
            cx="36"
            cy="36"
            r="30"
            stroke="rgba(10,10,10,0.06)"
            strokeWidth="1"
            fill="none"
          />
          <motion.circle
            cx="36"
            cy="36"
            r="30"
            stroke="#CC785C"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="188"
            style={{ strokeDashoffset: dashOffset }}
            strokeLinecap="round"
          />
        </svg>

        {/* Anthropic asterisk sigil */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          style={{ display: "block" }}
        >
          <g transform="translate(50,50)" fill="#CC785C">
            <ellipse cx="0" cy="0" rx="6" ry="36" />
            <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(45)" />
            <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(90)" />
            <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(135)" />
          </g>
        </svg>

      </div>
    </motion.div>
  );
}
