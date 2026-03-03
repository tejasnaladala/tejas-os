"use client";

import { STATIONS } from "@/lib/constants";
import { StationId } from "@/types";

interface MobileNavProps {
  activeTab: StationId;
  onNavigate: (id: StationId) => void;
  showTrench: boolean;
}

const MAIN_STATIONS = STATIONS.filter((s) => s.id !== "trench");

export default function MobileNav({
  activeTab,
  onNavigate,
  showTrench,
}: MobileNavProps) {
  const visibleStations = showTrench
    ? [...MAIN_STATIONS, STATIONS.find((s) => s.id === "trench")!]
    : MAIN_STATIONS;

  return (
    <nav
      className="shrink-0 flex items-center justify-around z-20"
      style={{
        background: "rgba(10, 15, 26, 0.95)",
        borderTop: "1px solid rgba(0, 212, 255, 0.1)",
        backdropFilter: "blur(8px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {visibleStations.map((station) => {
        const isActive = activeTab === station.id;
        return (
          <button
            key={station.id}
            onClick={() => onNavigate(station.id)}
            className="flex flex-col items-center gap-0.5 py-2 px-1 transition-colors"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              minWidth: 48,
            }}
            aria-label={station.label}
          >
            <span
              className="text-base"
              style={{
                filter: isActive ? "none" : "grayscale(0.6) opacity(0.6)",
                transition: "filter 0.2s",
              }}
            >
              {station.icon}
            </span>
            <span
              className="font-mono text-[8px] tracking-wider uppercase"
              style={{
                color: isActive
                  ? "var(--accent-cyan)"
                  : "var(--text-secondary)",
                transition: "color 0.2s",
              }}
            >
              {station.label.split(" ")[0]}
            </span>
            {/* Active indicator dot */}
            {isActive && (
              <div
                className="w-1 h-1 rounded-full mt-0.5"
                style={{ background: "var(--accent-cyan)" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
