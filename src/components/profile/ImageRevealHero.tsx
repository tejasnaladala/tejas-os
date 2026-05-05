"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Hover-reveal portrait. Two stacked images:
 *   - Bottom (z-1): studio photo - always fully visible.
 *   - Top    (z-2): tarot illustration - clipped to a circle at the cursor.
 *                   Default radius is 0 (entirely clipped, invisible). On
 *                   hover the circle scales up to ~150px so the tarot
 *                   appears UNDER the cursor, "revealing" it through the
 *                   studio photo.
 *
 * Why clip-path instead of mask-image:
 *   - `transition: clip-path` actually works. The earlier mask-image
 *     approach swapped between `none` and a radial-gradient, which CSS
 *     can't smoothly tween. Result: hover did nothing in most browsers.
 *   - `clip-path: circle(R at X Y)` is animatable in every modern engine,
 *     and we drive R via React state.
 *
 * Behavior when files are missing:
 *   - We pre-flight both URLs with `new Image()`. If the studio photo
 *     fails to load we render a polished "TN" terracotta card instead of
 *     a broken-image icon.
 *   - If only the tarot fails, the reveal is disabled (no blank circle).
 */
type Props = {
  studioSrc?: string;
  tarotSrc?: string;
  alt?: string;
  className?: string;
};

type LoadState = "ok" | "missing";

export default function ImageRevealHero({
  studioSrc = "/portrait-studio.png",
  tarotSrc,
  alt = "Tejas Naladala",
  className,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [studioState, setStudioState] = useState<LoadState>("ok");
  const [tarotState, setTarotState] = useState<LoadState>(
    tarotSrc ? "ok" : "missing",
  );
  const [reveal, setReveal] = useState({ x: 50, y: 50, r: 0 });

  // Spring-eased parallax. Reasonably damped so the frame doesn't jitter
  // when the cursor flicks across the image.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXSpring = useSpring(tiltX, { stiffness: 130, damping: 18 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 130, damping: 18 });
  const rotateY = useTransform(tiltXSpring, (v) => `${v}deg`);
  const rotateX = useTransform(tiltYSpring, (v) => `${v}deg`);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    if (studioState !== "ok") return;

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setReveal((prev) => ({ ...prev, x, y }));

      // Light parallax: tilt up to ±2deg based on cursor offset from center.
      const offX = (e.clientX - rect.left) / rect.width - 0.5;
      const offY = (e.clientY - rect.top) / rect.height - 0.5;
      tiltX.set(offX * 4);
      tiltY.set(-offY * 4);
    };
    const onEnter = () =>
      setReveal((prev) => ({
        ...prev,
        r: tarotSrc && tarotState === "ok" ? 150 : 0,
      }));
    const onLeave = () => {
      setReveal((prev) => ({ ...prev, r: 0 }));
      tiltX.set(0);
      tiltY.set(0);
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [tiltX, tiltY, studioState, tarotState, tarotSrc]);

  // Card-frame styling shared by both the real card and the fallback.
  const frameStyle = {
    position: "relative" as const,
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: 14,
    overflow: "hidden" as const,
    border: "1px solid var(--hairline-strong)",
    background:
      "linear-gradient(135deg, #d18a6c 0%, #b96d52 52%, #63301e 120%)",
    boxShadow:
      "0 1px 0 rgba(0,0,0,0.04), 0 24px 48px -24px rgba(91,42,24,0.45), 0 12px 24px -12px rgba(0,0,0,0.18)",
    rotateX,
    rotateY,
    transformPerspective: 1100,
  };

  // -------- Designed fallback when the studio image is missing --------
  if (studioState === "missing") {
    return (
      <motion.div
        className={className}
        style={{
          ...frameStyle,
          background:
            "linear-gradient(135deg, #CC785C 0%, #b86a51 60%, #5b2a18 130%)",
          color: "#fff",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 90%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 28px",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Tejas Naladala / 2026
            </span>
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 0 12px rgba(255,255,255,0.6)",
              }}
            />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(64px, 14vw, 128px)",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              TN
            </div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <p
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.78)",
                maxWidth: 320,
                lineHeight: 1.5,
              }}
            >
              Add{" "}
              <code
                style={{
                  fontSize: 10,
                  background: "rgba(0,0,0,0.18)",
                  padding: "2px 6px",
                  borderRadius: 3,
                }}
              >
                portrait-studio.png
              </code>{" "}
              to enable the reveal.
            </p>
            <svg
              width="36"
              height="36"
              viewBox="0 0 100 100"
              aria-hidden="true"
              style={{ flexShrink: 0, opacity: 0.85 }}
            >
              <g transform="translate(50,50)" fill="#fff">
                <ellipse cx="0" cy="0" rx="6" ry="36" />
                <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(45)" />
                <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(90)" />
                <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(135)" />
              </g>
            </svg>
          </div>
        </div>
      </motion.div>
    );
  }

  // -------- Normal render: studio bottom, tarot clipped on top --------
  return (
    <motion.div
      ref={wrapperRef}
      className={className}
      style={frameStyle}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          display: "grid",
          placeItems: "center",
          color: "rgba(255,255,255,0.88)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(72px, 12vw, 132px)",
          fontWeight: 700,
          letterSpacing: "0.04em",
        }}
      >
        TN
      </div>
      {/* Bottom: studio - always fully visible. */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Image
          src={studioSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 90vw, 540px"
          priority
          onError={() => setStudioState("missing")}
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Top: tarot - clipped to a circle at the cursor. Default radius 0
          means fully invisible. Hover scales the circle up so the tarot
          appears as a "lens" following the cursor. clip-path is animatable
          out of the box, unlike mask-image gradients. */}
      {tarotSrc && tarotState === "ok" && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            clipPath: `circle(${reveal.r}px at ${reveal.x}% ${reveal.y}%)`,
            WebkitClipPath: `circle(${reveal.r}px at ${reveal.x}% ${reveal.y}%)`,
            transition:
              "clip-path 280ms cubic-bezier(0.2, 0.8, 0.2, 1), -webkit-clip-path 280ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            pointerEvents: "none",
          }}
        >
          <Image
            src={tarotSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 90vw, 540px"
            priority
            onError={() => setTarotState("missing")}
            style={{ objectFit: "cover" }}
          />
          {/* Inner ring around the lens to make the reveal feel like a
              physical aperture, not a hard cut. */}
          <div
            style={{
              position: "absolute",
              left: `${reveal.x}%`,
              top: `${reveal.y}%`,
              width: reveal.r * 2,
              height: reveal.r * 2,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.55), 0 0 24px rgba(91,42,24,0.35)",
              transition:
                "width 280ms cubic-bezier(0.2,0.8,0.2,1), height 280ms cubic-bezier(0.2,0.8,0.2,1), left 80ms linear, top 80ms linear",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* Inner-card sheen */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          borderRadius: 14,
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 24px 60px -24px rgba(255,255,255,0.18)",
        }}
      />
    </motion.div>
  );
}
