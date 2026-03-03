"use client";

import { useMemo } from "react";
import { useOceanStore } from "@/stores/oceanStore";
import { OCEAN_CONFIG } from "@/lib/constants";

// Ocean color stops (y position -> color)
type DepthColorStop = { readonly y: number; readonly color: readonly [number, number, number] };

const DEPTH_COLORS: readonly DepthColorStop[] = [
  { y: 0, color: [10, 36, 99] },      // surface: #0a2463
  { y: 1000, color: [13, 27, 62] },    // twilight: #0d1b3e
  { y: 2200, color: [10, 17, 40] },    // midnight: #0a1128
  { y: 3500, color: [2, 4, 8] },       // abyss: #020408
];

function interpolateColor(y: number): string {
  const maxY = OCEAN_CONFIG.worldHeight;
  const clampedY = Math.max(0, Math.min(maxY, y));

  // Find the two color stops we're between
  let lower: DepthColorStop = DEPTH_COLORS[0];
  let upper: DepthColorStop = DEPTH_COLORS[DEPTH_COLORS.length - 1];

  for (let i = 0; i < DEPTH_COLORS.length - 1; i++) {
    if (clampedY >= DEPTH_COLORS[i].y && clampedY <= DEPTH_COLORS[i + 1].y) {
      lower = DEPTH_COLORS[i];
      upper = DEPTH_COLORS[i + 1];
      break;
    }
  }

  // Interpolate
  const range = upper.y - lower.y || 1;
  const t = (clampedY - lower.y) / range;

  const r = Math.round(lower.color[0] + (upper.color[0] - lower.color[0]) * t);
  const g = Math.round(lower.color[1] + (upper.color[1] - lower.color[1]) * t);
  const b = Math.round(lower.color[2] + (upper.color[2] - lower.color[2]) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

export default function DepthGradient() {
  const rovY = useOceanStore((s) => s.rovY);

  const bgColor = useMemo(() => interpolateColor(rovY), [rovY]);

  // Create a gradient from current depth to slightly darker
  const darkerColor = useMemo(() => interpolateColor(rovY + 200), [rovY]);

  return (
    <div
      className="fixed inset-0 -z-10 transition-colors duration-300"
      style={{
        background: `linear-gradient(180deg, ${bgColor} 0%, ${darkerColor} 100%)`,
      }}
    />
  );
}
