"use client";

import { useOceanStore } from "@/stores/oceanStore";
import { useDiscovery } from "@/hooks/useDiscovery";
import { StationConfig } from "@/types";

interface StationProps {
  station: StationConfig;
}

export default function Station({ station }: StationProps) {
  const nearStation = useOceanStore((s) => s.nearStation);
  const activeStation = useOceanStore((s) => s.activeStation);
  const { isDiscovered, allMainDiscovered } = useDiscovery();

  const isNear = nearStation === station.id;
  const isActive = activeStation === station.id;
  const discovered = isDiscovered(station.id);

  // The Trench is hidden until all 5 main stations are discovered
  if (station.id === "trench" && !allMainDiscovered && !discovered) {
    return null;
  }

  return (
    <div
      className="absolute flex flex-col items-center gap-2"
      style={{
        left: station.position.x,
        top: station.position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Station beacon */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: discovered
            ? "radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)"
            : "radial-gradient(circle, rgba(95, 122, 148, 0.1) 0%, transparent 100%)",
          border: `2px solid ${
            isNear
              ? "rgba(0, 212, 255, 0.8)"
              : discovered
                ? "rgba(0, 212, 255, 0.3)"
                : "rgba(95, 122, 148, 0.2)"
          }`,
          animation: isNear ? "pulse-glow 2s ease-in-out infinite" : "none",
          transition: "border-color 0.3s, background 0.3s",
        }}
      >
        {/* Icon */}
        <span
          className="text-2xl select-none"
          style={{
            filter: discovered ? "none" : "grayscale(0.8) opacity(0.5)",
            transition: "filter 0.3s",
          }}
        >
          {station.icon}
        </span>

        {/* Sonar ring when near */}
        {isNear && !isActive && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(0, 212, 255, 0.4)",
              animation: "pulse-glow 2s ease-in-out infinite 0.5s",
            }}
          />
        )}
      </div>

      {/* Label */}
      <div
        className="text-center whitespace-nowrap"
        style={{
          opacity: isNear || discovered ? 1 : 0.4,
          transition: "opacity 0.3s",
        }}
      >
        <p
          className="font-mono text-xs tracking-wider"
          style={{
            color: isNear ? "var(--accent-cyan)" : "var(--text-primary)",
            textShadow: isNear ? "0 0 8px rgba(0, 212, 255, 0.5)" : "none",
            transition: "color 0.3s, text-shadow 0.3s",
          }}
        >
          {station.label}
        </p>
        <p
          className="font-mono text-[10px]"
          style={{
            color: "var(--text-secondary)",
            marginTop: 2,
          }}
        >
          {station.description}
        </p>
      </div>

      {/* Dock prompt */}
      {isNear && !isActive && (
        <div
          className="font-mono text-[10px] tracking-widest uppercase mt-1"
          style={{
            color: "var(--accent-cyan)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        >
          [ENTER] Dock
        </div>
      )}
    </div>
  );
}
