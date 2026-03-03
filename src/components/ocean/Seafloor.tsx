"use client";

import { OCEAN_CONFIG } from "@/lib/constants";

export default function Seafloor() {
  const floorY = OCEAN_CONFIG.worldHeight - 200;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: floorY,
        width: OCEAN_CONFIG.worldWidth,
        height: 200,
      }}
    >
      {/* Gradient fade into seafloor */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(10, 17, 40, 0.4) 30%, rgba(5, 8, 20, 0.8) 100%)",
        }}
      />

      {/* Terrain bumps (ASCII rocks/coral) */}
      <div
        className="absolute bottom-0 left-0 w-full font-mono text-[10px] select-none overflow-hidden"
        style={{ color: "rgba(95, 122, 148, 0.15)", lineHeight: "14px" }}
      >
        <div className="flex justify-between px-8">
          {[
            "\u28FF\u28F7\u28F6\u28E4",
            "\u28A0\u28E4\u28F6\u28FF",
            "\u28F6\u28FF\u28FF\u28F7",
            "\u28E4\u28FF\u28F7\u28F6",
            "\u28FF\u28F6\u28E4\u28A0",
            "\u28F7\u28FF\u28FF\u28F6",
            "\u28E4\u28F6\u28FF\u28F7",
            "\u28A0\u28FF\u28F6\u28E4",
            "\u28FF\u28F7\u28F6\u28FF",
            "\u28F6\u28E4\u28A0\u28FF",
          ].map((rock, i) => (
            <span key={i} className="inline-block" style={{ transform: `translateY(${(i * 7) % 12}px)` }}>
              {rock}
            </span>
          ))}
        </div>
      </div>

      {/* Scattered floor particles */}
      {[200, 800, 1500, 2200, 3000, 3800, 4500].map((x, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: x,
            bottom: 20 + ((i * 13) % 30),
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            background: `rgba(95, 122, 148, ${0.1 + (i % 5) * 0.02})`,
          }}
        />
      ))}
    </div>
  );
}
