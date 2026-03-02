"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBootStore } from "@/stores/bootStore";
import CrtPowerOn from "./CrtPowerOn";
import BiosPost from "./BiosPost";

export default function BootScreen() {
  const phase = useBootStore((s) => s.phase);
  const setPhase = useBootStore((s) => s.setPhase);
  const hasBooted = useBootStore((s) => s.hasBooted);
  const skipBoot = useBootStore((s) => s.skipBoot);

  // Check sessionStorage on mount — skip boot if already booted this session
  useEffect(() => {
    if (hasBooted()) {
      skipBoot();
    }
  }, [hasBooted, skipBoot]);

  const startBoot = useCallback(() => {
    setPhase("power-on");
  }, [setPhase]);

  // Listen for keypress on idle screen to start boot
  useEffect(() => {
    if (phase !== "idle") return;

    const handleKey = (e: KeyboardEvent) => {
      // Ignore modifier-only keys
      if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      startBoot();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, startBoot]);

  const handlePowerOnComplete = useCallback(() => {
    setPhase("bios-post");
  }, [setPhase]);

  const handleBiosComplete = useCallback(() => {
    setPhase("loading-desktop");

    // Brief loading-desktop phase, then ready
    setTimeout(() => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tejas-os-booted", "true");
      }
      setPhase("ready");
    }, 600);
  }, [setPhase]);

  if (phase === "ready") return null;

  return (
    <AnimatePresence mode="wait">
      {phase === "idle" && (
        <motion.div
          key="idle"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-accent-green glow-green font-mono text-4xl md:text-6xl mb-8 tracking-widest">
            TejasOS
          </h1>
          <button
            onClick={startBoot}
            className="font-mono text-accent-green border border-accent-green px-8 py-3 text-sm tracking-wider
              hover:bg-accent-green hover:text-black transition-colors duration-200 focus:outline-none
              focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-black"
          >
            BOOT SYSTEM
          </button>
          <p className="text-text-secondary font-mono text-xs mt-6">
            Press any key to boot
          </p>
        </motion.div>
      )}

      {phase === "power-on" && (
        <motion.div
          key="power-on"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <CrtPowerOn onComplete={handlePowerOnComplete} />
        </motion.div>
      )}

      {phase === "bios-post" && (
        <motion.div
          key="bios-post"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <BiosPost onComplete={handleBiosComplete} />
        </motion.div>
      )}

      {phase === "loading-desktop" && (
        <motion.div
          key="loading-desktop"
          className="fixed inset-0 z-50 bg-black crt-flicker"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  );
}
