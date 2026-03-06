"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useSettingsStore } from "@/stores/settingsStore";
import { useEasterEggStore } from "@/stores/easterEggStore";
import { useOceanStore } from "@/stores/oceanStore";
import OceanWorld from "@/components/ocean/OceanWorld";
import HUD from "@/components/hud/HUD";
import MiniMap from "@/components/hud/MiniMap";
import DiscoveryLog from "@/components/hud/DiscoveryLog";
import NavBar from "@/components/hud/NavBar";
import Tutorial from "@/components/hud/Tutorial";
import GuidedTutorial from "@/components/hud/GuidedTutorial";
import CommandPalette from "@/components/hud/CommandPalette";
import ContentPanel from "@/components/panels/ContentPanel";
import MobileOcean from "@/components/mobile/MobileOcean";

export default function OceanClient() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const founderModeActive = useEasterEggStore((s) => s.founderModeActive);
  const [showFounderFlash, setShowFounderFlash] = useState(false);
  const [showDamageFlash, setShowDamageFlash] = useState(false);
  const [loading, setLoading] = useState(true);
  const rovLives = useOceanStore((s) => s.rovLives);
  const gameOverVisible = useOceanStore((s) => s.gameOverVisible);

  // Listen for creature attack damage events — lose a life
  useEffect(() => {
    const handleDamage = () => {
      const store = useOceanStore.getState();
      if (!store.rovAlive) return;
      store.loseLife();
      setShowDamageFlash(true);
      setTimeout(() => setShowDamageFlash(false), 400);
    };
    window.addEventListener("rov-damage", handleDamage);
    return () => window.removeEventListener("rov-damage", handleDamage);
  }, []);

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

  // Background music system
  useBackgroundMusic();

  // Auto-start guided tutorial on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("tejas-os-tutorial-shown");
    if (!hasVisited) {
      const timer = setTimeout(() => {
        useOceanStore.getState().startGuidedTutorial();
        localStorage.setItem("tejas-os-tutorial-shown", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Dismiss loading screen after brief delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // When Konami code activates founder mode, reveal The Trench
  useEffect(() => {
    if (founderModeActive) {
      setShowFounderFlash(true);
      useOceanStore.getState().discoverStation("trench");
      const timer = setTimeout(() => setShowFounderFlash(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [founderModeActive]);

  if (isMobile) {
    return <MobileOcean />;
  }

  return (
    <main id="main-content" className="h-screen w-screen overflow-hidden" style={{ background: "var(--ocean-surface)" }}>
      <OceanWorld />

      {/* Back to Home button */}
      <Link
        href="/"
        className="font-mono"
        style={{
          position: "fixed",
          top: 14,
          left: 16,
          zIndex: 60,
          fontSize: "11px",
          letterSpacing: "2px",
          color: "var(--accent-cyan)",
          background: "rgba(10, 15, 26, 0.7)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          padding: "6px 14px",
          textDecoration: "none",
          backdropFilter: "blur(4px)",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.5)";
          e.currentTarget.style.background = "rgba(10, 15, 26, 0.9)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.2)";
          e.currentTarget.style.background = "rgba(10, 15, 26, 0.7)";
        }}
      >
        {"< HOME"}
      </Link>

      {/* HUD overlays (fixed position) */}
      <HUD />
      <MiniMap />
      <DiscoveryLog />
      <NavBar />
      <Tutorial />
      <GuidedTutorial />

      {/* Content panel (slide-in from right) */}
      <ContentPanel />

      {/* Command Palette overlay */}
      <CommandPalette />

      {/* Creature Damage Flash */}
      {showDamageFlash && (
        <div
          className="pointer-events-none fixed inset-0 z-[150]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,0,40,0.3) 0%, rgba(255,0,0,0.15) 40%, transparent 80%)",
            animation: "damage-flash 0.4s ease-out forwards",
            border: "3px solid rgba(255, 0, 40, 0.6)",
            borderRadius: 0,
          }}
        />
      )}

      {/* Lives display - hearts in top-right area */}
      <div
        className="pointer-events-none fixed z-[60] font-mono"
        style={{
          top: 14,
          right: 200,
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: 18,
              color: i < rovLives ? "#ff3366" : "#2a2a3e",
              textShadow: i < rovLives ? "0 0 8px rgba(255, 51, 102, 0.6)" : "none",
              transition: "color 0.3s, text-shadow 0.3s",
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameOverVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[300] flex items-center justify-center"
            style={{ background: "rgba(10, 5, 15, 0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center gap-6 px-12 py-10"
              style={{
                background: "rgba(10, 15, 26, 0.95)",
                border: "1px solid rgba(255, 51, 102, 0.4)",
                borderRadius: 12,
                boxShadow: "0 0 60px rgba(255, 51, 102, 0.15), 0 0 120px rgba(255, 51, 102, 0.05)",
                maxWidth: 500,
              }}
            >
              <div
                className="font-mono text-2xl font-bold tracking-widest"
                style={{ color: "#ff3366" }}
              >
                GAME OVER
              </div>
              <div
                className="font-mono text-center text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)", maxWidth: 360 }}
              >
                hey you&apos;re supposed to shoot them too
                <br />
                don&apos;t judge my profile too hard lol
              </div>
              <button
                onClick={() => {
                  useOceanStore.getState().respawnROV();
                  window.dispatchEvent(new CustomEvent("rov-respawn"));
                }}
                className="font-mono text-sm font-bold tracking-wider"
                style={{
                  background: "var(--accent-cyan)",
                  color: "#0a0f1a",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 32px",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 212, 255, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 212, 255, 0.3)";
                }}
              >
                RESPAWN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center"
            style={{ background: "#0a0f1a" }}
          >
            <div
              className="font-mono text-xs tracking-[6px] uppercase"
              style={{
                color: "var(--accent-cyan)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              INITIALIZING SYSTEMS...
            </div>
            <div
              className="mt-4 font-mono text-[10px] tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              {"\u2588".repeat(6)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
