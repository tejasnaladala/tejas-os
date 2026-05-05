"use client";

import React, { useEffect, useRef, ReactNode, CSSProperties } from "react";

interface GlowCardProps {
  children?: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

// Hue values are degrees on the HSL wheel. The default `orange` is retuned
// to 14° (warm terracotta / Anthropic CC785C) with a tighter spread so
// pointer travel doesn't shift the hue all the way to yellow. Lightness +
// saturation are also pinned via the inline CSS vars below.
const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 14, spread: 40 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

/**
 * Pointer-tracking glow card. The glow position is computed via a global
 * `pointermove` listener (paused on `visibilitychange`). Pseudo-element
 * styles live in globals.css under `[data-glow]::before` and `::after`.
 *
 * Cleaned of markdown-link artifacts on `cardRef.current.style` from the
 * user-supplied reference.
 */
const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "orange",
  size = "md",
  width,
  height,
  customSize = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let running = true;

    const syncPointer = (e: PointerEvent) => {
      if (!running) return;
      const { clientX: x, clientY: y } = e;
      card.style.setProperty("--x", x.toFixed(2));
      card.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
      card.style.setProperty("--y", y.toFixed(2));
      card.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
    };

    const resetPointer = () => {
      card.style.setProperty("--x", "0");
      card.style.setProperty("--xp", "0");
      card.style.setProperty("--y", "0");
      card.style.setProperty("--yp", "0");
    };

    const onVisibility = () => {
      running = !document.hidden;
    };

    card.addEventListener("pointermove", syncPointer, { passive: true });
    card.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      card.removeEventListener("pointermove", syncPointer);
      card.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const getSizeClasses = () => {
    if (customSize) return "";
    return sizeMap[size];
  };

  const getInlineStyles = (): CSSProperties => {
    const baseStyles: CSSProperties & Record<string, string | number> = {
      "--base": base,
      "--spread": spread,
      "--radius": "10",
      "--border": "1",
      "--backdrop": "rgba(255, 255, 255, 0.55)",
      "--backup-border": "rgba(10, 10, 10, 0.16)",
      "--size": "300",
      "--outer": "1",
      "--saturation": "55",
      "--lightness": "52",
      "--bg-spot-opacity": "0.16",
      "--border-spot-opacity": "0.9",
      "--border-light-opacity": "0.5",
      "--border-size": "calc(var(--border, 1) * 1px)",
      "--spotlight-size": "calc(var(--size, 150) * 1px)",
      "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 14) calc(var(--saturation, 55) * 1%) calc(var(--lightness, 52) * 1%) / var(--bg-spot-opacity, 0.16)), transparent
      )`,
      backgroundColor: "var(--backdrop, transparent)",
      backgroundSize:
        "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
      backgroundPosition: "50% 50%",
      backgroundAttachment: "fixed",
      border: "var(--border-size) solid var(--backup-border)",
      position: "relative" as const,
      touchAction: "none" as const,
    };

    if (width !== undefined) {
      baseStyles.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === "number" ? `${height}px` : height;
    }

    return baseStyles;
  };

  return (
    <div
      ref={cardRef}
      data-glow=""
      style={getInlineStyles()}
      className={`
          ${getSizeClasses()}
          rounded-[10px]
          relative
          shadow-[0_1rem_2.4rem_-1.4rem_rgba(0,0,0,0.12)]
          p-7 md:p-8
          backdrop-blur-[8px]
          transition-transform duration-200
          hover:-translate-y-[2px]
          ${className}
        `}
    >
      <div ref={innerRef} data-glow="" />
      {children}
    </div>
  );
};

export { GlowCard };
