"use client";

import { useOceanStore } from "@/stores/oceanStore";
import { useDiscovery } from "@/hooks/useDiscovery";
import { OCEAN_CONFIG, STATIONS } from "@/lib/constants";

const MAP_WIDTH = 160;
const MAP_HEIGHT = 112; // Proportional to 5000:3500

export default function MiniMap() {
  const rovX = useOceanStore((s) => s.rovX);
  const rovY = useOceanStore((s) => s.rovY);
  const hudVisible = useOceanStore((s) => s.hudVisible);
  const setRovPosition = useOceanStore((s) => s.setRovPosition);
  const setRovVelocity = useOceanStore((s) => s.setRovVelocity);
  const { isDiscovered, allMainDiscovered } = useDiscovery();

  if (!hudVisible) return null;

  const scaleX = MAP_WIDTH / OCEAN_CONFIG.worldWidth;
  const scaleY = MAP_HEIGHT / OCEAN_CONFIG.worldHeight;

  const handleStationClick = (x: number, y: number) => {
    setRovPosition(x, y);
    setRovVelocity(0, 0);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono select-none">
      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          background: "rgba(10, 15, 26, 0.85)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Depth gradient preview */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(180deg, #0a2463 0%, #0d1b3e 40%, #0a1128 70%, #020408 100%)",
          }}
        />

        {/* Station dots */}
        {STATIONS.map((station) => {
          const discovered = isDiscovered(station.id);
          // Hide trench until all main discovered
          if (station.id === "trench" && !allMainDiscovered && !discovered)
            return null;

          return (
            <button
              key={station.id}
              onClick={() =>
                handleStationClick(station.position.x, station.position.y)
              }
              className="absolute z-10 cursor-pointer"
              style={{
                left: station.position.x * scaleX - 3,
                top: station.position.y * scaleY - 3,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: discovered
                  ? "var(--accent-cyan)"
                  : "rgba(95, 122, 148, 0.4)",
                border: "none",
                padding: 0,
                boxShadow: discovered
                  ? "0 0 4px rgba(0, 212, 255, 0.5)"
                  : "none",
                transition: "background 0.3s",
              }}
              title={station.label}
              aria-label={`Navigate to ${station.label}`}
            />
          );
        })}

        {/* ROV dot */}
        <div
          className="absolute z-20"
          style={{
            left: rovX * scaleX - 2,
            top: rovY * scaleY - 2,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "var(--accent-green)",
            boxShadow: "0 0 6px rgba(0, 255, 136, 0.6)",
          }}
        />

        {/* Label */}
        <div
          className="absolute bottom-1 left-1 text-[8px] tracking-wider uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          MAP
        </div>
      </div>
    </div>
  );
}
