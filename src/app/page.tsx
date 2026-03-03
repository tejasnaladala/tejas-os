"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useSettingsStore } from "@/stores/settingsStore";
import { useEasterEggStore } from "@/stores/easterEggStore";
import { useOceanStore } from "@/stores/oceanStore";
import OceanWorld from "@/components/ocean/OceanWorld";
import HUD from "@/components/hud/HUD";
import MiniMap from "@/components/hud/MiniMap";
import DiscoveryLog from "@/components/hud/DiscoveryLog";
import NavBar from "@/components/hud/NavBar";
import Tutorial from "@/components/hud/Tutorial";
import ContentPanel from "@/components/panels/ContentPanel";
import MobileOcean from "@/components/mobile/MobileOcean";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const founderModeActive = useEasterEggStore((s) => s.founderModeActive);
  const [showFounderFlash, setShowFounderFlash] = useState(false);

  // Hydrate sound setting from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tejas-os-sound");
    if (stored === "true") {
      const current = useSettingsStore.getState().soundEnabled;
      if (!current) {
        useSettingsStore.getState().toggleSound();
      }
    }
  }, []);

  // Easter egg hooks
  useKonamiCode();

  // When Konami code activates founder mode, reveal The Trench
  useEffect(() => {
    if (founderModeActive) {
      setShowFounderFlash(true);
      // Reveal The Trench by discovering it
      useOceanStore.getState().discoverStation("trench");
      const timer = setTimeout(() => setShowFounderFlash(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [founderModeActive]);

  if (isMobile) {
    return <MobileOcean />;
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <OceanWorld />

      {/* HUD overlays (fixed position) */}
      <HUD />
      <MiniMap />
      <DiscoveryLog />
      <NavBar />
      <Tutorial />

      {/* Content panel (slide-in from right) */}
      <ContentPanel />

      {/* Founder Mode Activation Overlay */}
      <AnimatePresence>
        {showFounderFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0.05, 0.15, 0] }}
              transition={{ duration: 2.5, times: [0, 0.1, 0.3, 0.5, 1] }}
              className="absolute inset-0"
              style={{ background: "var(--accent-cyan)" }}
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col items-center gap-2"
            >
              <div
                className="px-8 py-4 font-mono text-sm tracking-widest md:text-lg"
                style={{
                  border: "1px solid var(--accent-cyan)",
                  background: "rgba(10, 15, 26, 0.9)",
                  color: "var(--accent-cyan)",
                  boxShadow: "0 0 24px rgba(0, 212, 255, 0.3)",
                }}
              >
                <span className="animate-pulse">[</span>
                {" THE TRENCH UNLOCKED "}
                <span className="animate-pulse">]</span>
              </div>
              <p className="font-mono text-xs tracking-wider" style={{ color: "var(--text-secondary)" }}>
                CLASSIFIED ZONE REVEALED
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
