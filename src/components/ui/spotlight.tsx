"use client";

import { useRef, useState, useCallback, useEffect, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Cursor-following spotlight (ibelick / motion-primitives variant).
 * Springs in opacity on hover. Colored with Anthropic orange by default.
 */
type SpotlightProps = {
  className?: string;
  size?: number;
  fill?: string;
};

export function Spotlight({
  className,
  size = 280,
  fill = "rgba(204, 120, 92, 0.18)",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlightLeft = useSpring(mouseX, { stiffness: 200, damping: 24 });
  const spotlightTop = useSpring(mouseY, { stiffness: 200, damping: 24 });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    parent.style.position = "relative";
    parent.style.overflow = "hidden";

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current?.parentElement) return;
      const { left, top } =
        containerRef.current.parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left - size / 2);
      mouseY.set(event.clientY - top - size / 2);
    },
    [mouseX, mouseY, size]
  );

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const onMove = (e: globalThis.MouseEvent) => {
      handleMouseMove(e as unknown as MouseEvent<HTMLDivElement>);
    };
    parent.addEventListener("mousemove", onMove);
    return () => parent.removeEventListener("mousemove", onMove);
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-3xl transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        background: `radial-gradient(circle at center, ${fill}, transparent 80%)`,
      }}
    />
  );
}

/**
 * Aceternity SVG variant used for hero/static fills.
 */
type AceSpotlightProps = {
  className?: string;
  fill?: string;
};

export function SpotlightSVG({
  className,
  fill = "white",
}: AceSpotlightProps) {
  return (
    <svg
      className={cn(
        "animate-pulse pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className
      )}
      style={{ animation: "spotlight 2.4s ease 0.2s 1 forwards" }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
}
