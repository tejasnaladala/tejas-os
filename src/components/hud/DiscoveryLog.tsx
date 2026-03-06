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
        className="px-4 py-3 rounded-sm"
        style={{
          background: "rgba(10, 15, 26, 0.85)",
          border: "1px solid rgba(0, 212, 255, 0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="text-[11px] tracking-widest uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Stations Discovered
        </div>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span
            className="text-base tabular-nums font-bold"
            style={{
              color: allMainDiscovered
                ? "var(--accent-green)"
                : "var(--accent-cyan)",
            }}
          >
            {discoveredCount}
          </span>
          <span
            className="text-[12px]"
            style={{ color: "var(--text-secondary)" }}
          >
            / {totalStations}
          </span>
        </div>
        {allMainDiscovered && (
          <div
            className="text-[11px] mt-1.5 font-bold"
            style={{ color: "var(--accent-green)" }}
          >
            {"\u2713"} All stations found
          </div>
        )}
      </div>
    </div>
  );
}
