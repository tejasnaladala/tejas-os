"use client";

import { useMemo } from "react";

interface BubbleConfig {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function Bubbles() {
  const bubbles = useMemo<BubbleConfig[]>(() => {
    // Deterministic positions for SSR consistency
    const configs: BubbleConfig[] = [];
    for (let i = 0; i < 18; i++) {
      // Use a simple seeded-ish approach for consistent values
      const seed = (i * 7919 + 1231) % 1000;
      configs.push({
        id: i,
        x: (seed * 5) % 5000,
        y: 400 + ((seed * 3.7) % 3000),
        size: 3 + (seed % 6),
        duration: 8 + (seed % 12),
        delay: seed % 10,
        opacity: 0.1 + (seed % 30) / 100,
      });
    }
    return configs;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            background: `rgba(255, 255, 255, ${b.opacity})`,
            animation: `float-up ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
