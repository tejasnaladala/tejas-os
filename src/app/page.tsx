"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BootScreen from "@/components/boot/BootScreen";
import Desktop from "@/components/desktop/Desktop";
import Taskbar from "@/components/desktop/Taskbar";
import WindowManager from "@/components/windows/WindowManager";
import CrtOverlay from "@/components/shared/CrtOverlay";
import MobileShell from "@/components/mobile/MobileShell";
import { useBootStore } from "@/stores/bootStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useEasterEggStore } from "@/stores/easterEggStore";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Home() {
  const phase = useBootStore((s) => s.phase);
  const founderModeActive = useEasterEggStore((s) => s.founderModeActive);
  const [showFounderFlash, setShowFounderFlash] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Hydrate sound setting from localStorage on mount
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
  useKeyboardNav();

  // Show founder mode activation flash
  useEffect(() => {
    if (founderModeActive) {
      setShowFounderFlash(true);
      const timer = setTimeout(() => setShowFounderFlash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [founderModeActive]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg-primary">
      <BootScreen />
      {phase === "ready" && (
        <>
          {isMobile ? (
            <>
              <MobileShell />
              <CrtOverlay />
            </>
          ) : (
            <>
              <Desktop />
              <WindowManager />
              <Taskbar />
              <CrtOverlay />
            </>
          )}
        </>
      )}

      {/* Founder Mode Activation Overlay */}
      <AnimatePresence>
        {showFounderFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center"
          >
            {/* Background flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.1, 0.25, 0] }}
              transition={{ duration: 2, times: [0, 0.1, 0.3, 0.5, 1] }}
              className="absolute inset-0 bg-accent-primary"
            />

            {/* Text */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col items-center gap-2"
            >
              <div className="border border-accent-primary bg-bg-primary/90 px-8 py-4 font-mono text-sm tracking-widest text-accent-primary shadow-lg shadow-accent-primary/20 backdrop-blur-sm md:text-lg">
                <span className="animate-pulse">[</span>
                {" FOUNDER MODE ACTIVATED "}
                <span className="animate-pulse">]</span>
              </div>
              <p className="font-mono text-xs tracking-wider text-text-secondary">
                ACCESS LEVEL: CLASSIFIED
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
