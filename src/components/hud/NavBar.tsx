"use client";

import { useOceanStore } from "@/stores/oceanStore";
import { useDiscovery } from "@/hooks/useDiscovery";
import { STATIONS } from "@/lib/constants";

export default function NavBar() {
  const hudVisible = useOceanStore((s) => s.hudVisible);
  const setRovPosition = useOceanStore((s) => s.setRovPosition);
  const setRovVelocity = useOceanStore((s) => s.setRovVelocity);
  const { isDiscovered, allMainDiscovered } = useDiscovery();

  if (!hudVisible) return null;

  const handleNavigate = (x: number, y: number) => {
    setRovPosition(x, y);
    setRovVelocity(0, 0);
  };

  return (
    <div className="fixed top-4 right-4 z-50 font-mono select-none">
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-sm"
        style={{
          background: "rgba(10, 15, 26, 0.8)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          backdropFilter: "blur(4px)",
        }}
      >
        {STATIONS.map((station) => {
          const discovered = isDiscovered(station.id);
          // Hide trench until all main discovered
          if (station.id === "trench" && !allMainDiscovered && !discovered)
            return null;

          return (
            <button
              key={station.id}
              onClick={() =>
                handleNavigate(station.position.x, station.position.y)
              }
              className="px-2 py-1 rounded-sm text-[10px] tracking-wider uppercase transition-all duration-200"
              style={{
                color: discovered
                  ? "var(--accent-cyan)"
                  : "var(--text-secondary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                opacity: discovered ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background =
                  "rgba(0, 212, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "transparent";
              }}
              title={station.description}
              aria-label={`Navigate to ${station.label}`}
            >
              {station.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
