"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useROVControls } from "@/hooks/useROVControls";
import { useCamera } from "@/hooks/useCamera";
import { OCEAN_CONFIG, STATIONS } from "@/lib/constants";
import { useOceanStore } from "@/stores/oceanStore";
import ROV from "./ROV";
import DepthGradient from "./DepthGradient";
import Station from "./Station";
import Bubbles from "./Bubbles";
import SeaCreatures from "./SeaCreatures";
import LightRays from "./LightRays";
import Seafloor from "./Seafloor";
import CockpitOverlay from "./CockpitOverlay";

// ---------------------------------------------------------------------------
// Projectile types
// ---------------------------------------------------------------------------

interface Projectile {
  id: number;
  x: number;
  y: number;
  direction: "left" | "right";
  born: number;
}

const PROJECTILE_SPEED = 600; // px per second
const PROJECTILE_MAX_AGE = 800; // ms before auto-removal

let nextProjectileId = 0;

export default function OceanWorld() {
  useROVControls();
  const transform = useCamera();
  const fpvMode = useOceanStore((s) => s.fpvMode);

  // -------------------------------------------------------------------------
  // Projectile state
  // -------------------------------------------------------------------------
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  projectilesRef.current = projectiles;

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Listen for rov-shoot custom events
  useEffect(() => {
    const handleShoot = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        x: number;
        y: number;
        direction: "left" | "right";
      };
      const newProjectile: Projectile = {
        id: nextProjectileId++,
        x: detail.x,
        y: detail.y,
        direction: detail.direction,
        born: Date.now(),
      };
      setProjectiles((prev) => [...prev, newProjectile]);
    };

    window.addEventListener("rov-shoot", handleShoot);
    return () => window.removeEventListener("rov-shoot", handleShoot);
  }, []);

  // Animate projectiles with requestAnimationFrame
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min(timestamp - lastTimeRef.current, 50) / 1000; // seconds
      lastTimeRef.current = timestamp;

      const now = Date.now();
      const current = projectilesRef.current;

      if (current.length > 0) {
        const surviving: Projectile[] = [];

        for (const p of current) {
          const age = now - p.born;
          // Remove if too old or off-screen
          if (
            age > PROJECTILE_MAX_AGE ||
            p.x < -20 ||
            p.x > OCEAN_CONFIG.worldWidth + 20 ||
            p.y < -20 ||
            p.y > OCEAN_CONFIG.worldHeight + 20
          ) {
            continue;
          }

          // Move projectile
          const moved = {
            ...p,
            x: p.x + (p.direction === "right" ? 1 : -1) * PROJECTILE_SPEED * dt,
          };

          // Dispatch hit event for collision detection in SeaCreatures
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("projectile-hit", {
                detail: { x: moved.x, y: moved.y, projectileId: moved.id },
              })
            );
          }

          surviving.push(moved);
        }

        setProjectiles(surviving);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Listen for creature-killed events to remove the projectile that hit
  useEffect(() => {
    const handleCreatureKilled = (e: Event) => {
      const detail = (e as CustomEvent).detail as { projectileId: number };
      setProjectiles((prev) =>
        prev.filter((p) => p.id !== detail.projectileId)
      );
    };

    window.addEventListener("creature-killed", handleCreatureKilled);
    return () =>
      window.removeEventListener("creature-killed", handleCreatureKilled);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      role="application"
      aria-label="Interactive underwater ROV exploration — use WASD to navigate, ENTER to dock at stations, SPACE to shoot"
      aria-roledescription="game"
    >
      {/* Fixed depth gradient background */}
      <DepthGradient />

      {/* Scrollable world container */}
      <div
        className="absolute will-change-transform"
        style={{
          width: OCEAN_CONFIG.worldWidth,
          height: OCEAN_CONFIG.worldHeight,
          transform: fpvMode ? `${transform} scale(1.3)` : transform,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Ambient effects (back layer) */}
        <LightRays />

        {/* ASCII name watermark etched in the water */}
        <div
          className="absolute pointer-events-none select-none"
          style={{
            left: OCEAN_CONFIG.worldWidth / 2,
            top: OCEAN_CONFIG.worldHeight * 0.42,
            transform: "translate(-50%, -50%)",
            whiteSpace: "pre",
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            letterSpacing: "6px",
            lineHeight: "20px",
            color: "rgba(0, 212, 255, 0.04)",
            textShadow: "0 0 40px rgba(0, 212, 255, 0.02)",
            zIndex: 1,
          }}
        >
{`████████╗███████╗     ██╗ █████╗ ███████╗
╚══██╔══╝██╔════╝     ██║██╔══██╗██╔════╝
   ██║   █████╗       ██║███████║███████╗
   ██║   ██╔══╝  ██   ██║██╔══██║╚════██║
   ██║   ███████╗╚█████╔╝██║  ██║███████║
   ╚═╝   ╚══════╝ ╚════╝ ╚═╝  ╚═╝╚══════╝

███╗   ██╗ █████╗ ██╗      █████╗ ██████╗  █████╗ ██╗      █████╗
████╗  ██║██╔══██╗██║     ██╔══██╗██╔══██╗██╔══██╗██║     ██╔══██╗
██╔██╗ ██║███████║██║     ███████║██║  ██║███████║██║     ███████║
██║╚██╗██║██╔══██║██║     ██╔══██║██║  ██║██╔══██║██║     ██╔══██║
██║ ╚████║██║  ██║███████╗██║  ██║██████╔╝██║  ██║███████╗██║  ██║
╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`}
        </div>

        <Bubbles />
        <SeaCreatures />
        <Seafloor />

        {/* Stations */}
        {STATIONS.map((station) => (
          <Station key={station.id} station={station} />
        ))}

        {/* Projectiles */}
        {projectiles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              transform: "translate(-50%, -50%)",
              zIndex: 15,
            }}
          >
            {/* Projectile body - cyan dash */}
            <div
              style={{
                width: "16px",
                height: "3px",
                background:
                  "linear-gradient(90deg, rgba(0,255,255,0.2), rgba(0,255,255,1), rgba(255,255,255,1))",
                borderRadius: "2px",
                boxShadow:
                  "0 0 6px rgba(0, 255, 255, 0.9), 0 0 12px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)",
                transform:
                  p.direction === "left" ? "scaleX(-1)" : "none",
              }}
            />
            {/* Trailing glow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: p.direction === "right" ? "-8px" : "16px",
                transform: "translateY(-50%)",
                width: "10px",
                height: "2px",
                background:
                  "linear-gradient(90deg, rgba(0,255,255,0), rgba(0,255,255,0.4))",
                borderRadius: "1px",
              }}
            />
          </div>
        ))}

        {/* ROV player (hidden in FPV mode) */}
        {!fpvMode && <ROV />}
      </div>

      {/* FPV cockpit overlay */}
      <CockpitOverlay />
    </div>
  );
}
