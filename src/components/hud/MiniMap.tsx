"use client";

import { useOceanStore } from "@/stores/oceanStore";
import { useDiscovery } from "@/hooks/useDiscovery";
import { OCEAN_CONFIG, STATIONS } from "@/lib/constants";

const MAP_SM_W = 160;
const MAP_SM_H = 120;
const MAP_LG_W = 360;
const MAP_LG_H = 270;

export default function MiniMap() {
  const rovX = useOceanStore((s) => s.rovX);
  const rovY = useOceanStore((s) => s.rovY);
  const hudVisible = useOceanStore((s) => s.hudVisible);
  const expanded = useOceanStore((s) => s.minimapExpanded);
  const toggleMinimap = useOceanStore((s) => s.toggleMinimap);
  const setRovPosition = useOceanStore((s) => s.setRovPosition);
  const setRovVelocity = useOceanStore((s) => s.setRovVelocity);
  const { isDiscovered, allMainDiscovered } = useDiscovery();

  if (!hudVisible) return null;

  const mapW = expanded ? MAP_LG_W : MAP_SM_W;
  const mapH = expanded ? MAP_LG_H : MAP_SM_H;
  const scaleX = mapW / OCEAN_CONFIG.worldWidth;
  const scaleY = mapH / OCEAN_CONFIG.worldHeight;

  const handleStationClick = (x: number, y: number) => {
    setRovPosition(x, y);
    setRovVelocity(0, 0);
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 font-mono select-none"
      id="minimap-container"
    >
      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          width: mapW,
          height: mapH,
          background: "rgba(10, 15, 26, 0.85)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          backdropFilter: "blur(4px)",
          transition: "width 0.3s ease, height 0.3s ease",
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
                left: station.position.x * scaleX - (expanded ? 5 : 3),
                top: station.position.y * scaleY - (expanded ? 5 : 3),
                width: expanded ? 10 : 6,
                height: expanded ? 10 : 6,
                borderRadius: "50%",
                background: discovered
                  ? "var(--accent-cyan)"
                  : "rgba(95, 122, 148, 0.4)",
                border: "none",
                padding: 0,
                boxShadow: discovered
                  ? "0 0 4px rgba(0, 212, 255, 0.5)"
                  : "none",
                transition: "all 0.3s",
              }}
              title={station.label}
              aria-label={`Navigate to ${station.label}`}
            >
              {expanded && (
                <span
                  className="absolute left-full ml-1.5 whitespace-nowrap text-[8px] tracking-wider uppercase pointer-events-none"
                  style={{
                    color: discovered ? "var(--accent-cyan)" : "var(--text-secondary)",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {station.label}
                </span>
              )}
            </button>
          );
        })}

        {/* ROV dot */}
        <div
          className="absolute z-20"
          style={{
            left: rovX * scaleX - (expanded ? 4 : 2),
            top: rovY * scaleY - (expanded ? 4 : 2),
            width: expanded ? 8 : 4,
            height: expanded ? 8 : 4,
            borderRadius: "50%",
            background: "var(--accent-green)",
            boxShadow: "0 0 6px rgba(0, 255, 136, 0.6)",
            transition: "width 0.3s, height 0.3s",
          }}
        />

        {/* Label + expand toggle */}
        <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
          <span
            className="text-[8px] tracking-wider uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            MAP
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimap();
            }}
            className="cursor-pointer"
            style={{
              background: "none",
              border: "none",
              padding: "0 2px",
              color: "var(--text-secondary)",
              fontSize: expanded ? "10px" : "8px",
              lineHeight: 1,
            }}
            title={expanded ? "Minimize map" : "Enlarge map"}
            aria-label={expanded ? "Minimize map" : "Enlarge map"}
          >
            {expanded ? "\u25BC" : "\u25B2"}
          </button>
        </div>
      </div>
    </div>
  );
}
