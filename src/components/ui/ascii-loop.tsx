"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ASCII-art band that breathes through frames at ~10fps. Uses
 * requestAnimationFrame with a frame-skip counter so it stays cheap, and
 * pauses when the tab is hidden. Pure mono text - no canvas, no images.
 *
 * The frames spell out a slowly mutating asterisk/orbit motif that nods to
 * Anthropic's wordmark without being heavy.
 */

const FRAMES: string[] = [
  String.raw`
       . . . . . . . . .
     .   *   .   .   .   .
   .   .   .   *   .   .   .
 .   .   *   .   .   .   *   .
   .   .   .   .   *   .   .
     .   .   *   .   .   .
       . . . . . . . . .
`,
  String.raw`
       . . . . . . . . .
     .   .   *   .   .   .
   .   *   .   .   .   *   .
 .   .   .   *   .   .   .   .
   .   *   .   .   *   .   .
     .   .   .   *   .   .
       . . . . . . . . .
`,
  String.raw`
       . . . . . . . . .
     .   .   .   *   .   .
   .   .   *   .   *   .   .
 .   *   .   .   .   .   .   .
   .   .   *   .   .   *   .
     .   .   .   .   *   .
       . . . . . . . . .
`,
  String.raw`
       . . . . . . . . .
     *   .   .   .   .   .
   .   .   .   *   .   .   *
 .   *   .   .   *   .   .   .
   .   .   .   *   .   .   .
     .   *   .   .   .   .
       . . . . . . . . .
`,
];

type AsciiLoopProps = {
  className?: string;
  fps?: number;
};

export default function AsciiLoop({ className, fps = 6 }: AsciiLoopProps) {
  const [frame, setFrame] = useState(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const visibleRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const interval = 1000 / fps;

    const tick = (now: number) => {
      if (!visibleRef.current) return;
      if (now - lastRef.current >= interval) {
        lastRef.current = now;
        setFrame((f) => (f + 1) % FRAMES.length);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      visibleRef.current = !document.hidden;
      if (visibleRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(rafRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fps]);

  return (
    <pre
      aria-hidden="true"
      className={className}
      style={{
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: 11,
        lineHeight: 1.35,
        letterSpacing: "0.04em",
        color: "rgba(204, 120, 92, 0.65)",
        whiteSpace: "pre",
        margin: 0,
        userSelect: "none",
      }}
    >
      {FRAMES[frame]}
    </pre>
  );
}
