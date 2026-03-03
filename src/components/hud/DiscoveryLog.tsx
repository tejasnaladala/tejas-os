"use client";

import { useDiscovery } from "@/hooks/useDiscovery";
import { useOceanStore } from "@/stores/oceanStore";

export default function DiscoveryLog() {
  const hudVisible = useOceanStore((s) => s.hudVisible);
  const { discoveredCount, totalStations, allMainDiscovered } = useDiscovery();

  if (!hudVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 font-mono select-none pointer-events-none">
      <div
        className="px-3 py-2 rounded-sm"
        style={{
          background: "rgba(10, 15, 26, 0.8)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          className="text-[10px] tracking-widest uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Stations Discovered
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span
            className="text-sm tabular-nums"
            style={{
              color: allMainDiscovered
                ? "var(--accent-green)"
                : "var(--accent-cyan)",
            }}
          >
            {discoveredCount}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--text-secondary)" }}
          >
            / {totalStations}
          </span>
        </div>
        {allMainDiscovered && (
          <div
            className="text-[10px] mt-1"
            style={{ color: "var(--accent-green)" }}
          >
            {"\u2713"} All stations found
          </div>
        )}
      </div>
    </div>
  );
}
