"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useOceanStore } from "@/stores/oceanStore";
import { STATIONS } from "@/lib/constants";
import { StationId } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface PaletteItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

export default function CommandPalette() {
  const isOpen = useOceanStore((s) => s.commandPaletteOpen);
  const close = useOceanStore((s) => s.closeCommandPalette);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build items list
  const items: PaletteItem[] = [
    // Station items — teleport + dock + open panel
    ...STATIONS.map((station) => ({
      id: `station-${station.id}`,
      label: station.label,
      description: station.description,
      icon: station.icon,
      action: () => {
        const store = useOceanStore.getState();
        // Teleport ROV to station
        store.setRovPosition(station.position.x, station.position.y);
        store.setRovVelocity(0, 0);
        // Dock at station
        store.dockAtStation(station.id as StationId);
        close();
      },
    })),
    // Action items
    {
      id: "action-resume",
      label: "View Resume",
      description: "Open resume page",
      icon: "\uD83D\uDCC4",
      action: () => {
        close();
        window.location.href = "/resume";
      },
    },
    {
      id: "action-fpv",
      label: "Toggle FPV Mode",
      description: "Switch between top-down and first-person view",
      icon: "\uD83C\uDFA5",
      action: () => {
        useOceanStore.getState().toggleFpvMode();
        close();
      },
    },
    {
      id: "action-peaceful",
      label: "Toggle Peaceful Mode",
      description: "Disable hostile creature attacks",
      icon: "\u262E",
      action: () => {
        useOceanStore.getState().togglePeacefulMode();
        close();
      },
    },
  ];

  // Fuzzy filter
  const filtered = query.trim()
    ? items.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      })
    : items;

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const executeSelected = useCallback(() => {
    if (filtered.length > 0 && selectedIndex < filtered.length) {
      filtered[selectedIndex].action();
    }
  }, [filtered, selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          executeSelected();
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, filtered.length, executeSelected, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(5, 10, 20, 0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={close}
          />

          {/* Palette */}
          <motion.div
            className="relative w-full max-w-md mx-4 font-mono rounded-sm overflow-hidden"
            style={{
              background: "rgba(10, 15, 26, 0.95)",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              boxShadow:
                "0 0 40px rgba(0, 212, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid rgba(0, 212, 255, 0.15)" }}
            >
              <span
                className="text-sm"
                style={{ color: "var(--accent-cyan)", opacity: 0.6 }}
              >
                {">"}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Navigate to station or action..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{
                  color: "var(--text-primary)",
                  caretColor: "var(--accent-cyan)",
                }}
                spellCheck={false}
              />
            </div>

            {/* Results */}
            <div
              className="max-h-[300px] overflow-y-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              {filtered.length === 0 ? (
                <div
                  className="px-4 py-6 text-center text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No results found
                </div>
              ) : (
                filtered.map((item, i) => (
                  <button
                    key={item.id}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors"
                    style={{
                      background:
                        i === selectedIndex
                          ? "rgba(0, 212, 255, 0.1)"
                          : "transparent",
                      borderLeft:
                        i === selectedIndex
                          ? "2px solid var(--accent-cyan)"
                          : "2px solid transparent",
                    }}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs font-medium truncate"
                        style={{
                          color:
                            i === selectedIndex
                              ? "var(--accent-cyan)"
                              : "var(--text-primary)",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        className="text-[10px] truncate mt-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div
              className="px-4 py-2 flex items-center gap-4 text-[10px]"
              style={{
                borderTop: "1px solid rgba(0, 212, 255, 0.1)",
                color: "var(--text-secondary)",
              }}
            >
              <span>
                <kbd
                  style={{
                    padding: "1px 4px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {"\u2191\u2193"}
                </kbd>{" "}
                navigate
              </span>
              <span>
                <kbd
                  style={{
                    padding: "1px 4px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {"\u23CE"}
                </kbd>{" "}
                select
              </span>
              <span>
                <kbd
                  style={{
                    padding: "1px 4px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "2px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  esc
                </kbd>{" "}
                close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
