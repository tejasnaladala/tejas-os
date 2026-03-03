"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOceanStore } from "@/stores/oceanStore";
import { STATIONS } from "@/lib/constants";

export default function ContentPanel() {
  const panelOpen = useOceanStore((s) => s.panelOpen);
  const panelStation = useOceanStore((s) => s.panelStation);
  const closePanel = useOceanStore((s) => s.closePanel);

  const station = STATIONS.find((s) => s.id === panelStation);

  return (
    <AnimatePresence>
      {panelOpen && station && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(2, 4, 8, 0.5)" }}
            onClick={closePanel}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-[70] h-full overflow-y-auto"
            style={{
              width: "min(600px, 90vw)",
              background: "var(--bg-panel)",
              borderLeft: "1px solid rgba(0, 212, 255, 0.15)",
              boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Panel header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
              style={{
                background: "rgba(10, 15, 26, 0.95)",
                borderBottom: "1px solid rgba(0, 212, 255, 0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{station.icon}</span>
                <div>
                  <h2
                    className="font-mono text-sm tracking-wider uppercase"
                    style={{ color: "var(--accent-cyan)" }}
                  >
                    {station.label}
                  </h2>
                  <p className="font-mono text-[10px]" style={{ color: "var(--text-secondary)" }}>
                    {station.description}
                  </p>
                </div>
              </div>

              <button
                onClick={closePanel}
                className="flex items-center justify-center w-8 h-8 rounded-sm transition-colors"
                style={{
                  color: "var(--text-secondary)",
                  background: "transparent",
                  border: "1px solid rgba(95, 122, 148, 0.2)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = "rgba(0, 212, 255, 0.4)";
                  (e.target as HTMLElement).style.color = "var(--accent-cyan)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = "rgba(95, 122, 148, 0.2)";
                  (e.target as HTMLElement).style.color = "var(--text-secondary)";
                }}
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            {/* Panel content */}
            <div className="px-6 py-6">
              <PanelContent stationId={panelStation} />
            </div>

            {/* Bottom hint */}
            <div
              className="sticky bottom-0 px-6 py-3 text-center font-mono text-[10px] tracking-wider"
              style={{
                color: "var(--text-secondary)",
                background: "rgba(10, 15, 26, 0.95)",
                borderTop: "1px solid rgba(0, 212, 255, 0.1)",
              }}
            >
              Press <kbd className="px-1.5 py-0.5 mx-1 rounded text-[9px]" style={{ background: "rgba(0, 212, 255, 0.1)", border: "1px solid rgba(0, 212, 255, 0.2)" }}>ESC</kbd> to undock
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Placeholder content - will be replaced with real station components in Task 9
function PanelContent({ stationId }: { stationId: string | null }) {
  const labels: Record<string, string> = {
    research: "Research Lab \u2014 About & Bio",
    salvage: "Salvage Yard \u2014 Projects",
    systems: "Systems Bay \u2014 Skills",
    arcade: "Arcade Rig \u2014 Games",
    comms: "Comms Array \u2014 Contact",
    trench: "The Trench \u2014 Easter Eggs",
  };

  return (
    <div className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
      <p className="mb-4">{labels[stationId || ""] || "Unknown Station"}</p>
      <p className="text-[11px]">Content loading in next phase...</p>
    </div>
  );
}
