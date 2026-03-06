"use client";

import { useEffect, useRef, useCallback } from "react";
import { useOceanStore } from "@/stores/oceanStore";
import { OCEAN_CONFIG, STATIONS } from "@/lib/constants";

// Normalize key names to prevent Shift+key casing issues
// e.g. pressing Shift+a gives 'A' on keyDown but 'A' on keyUp,
// while 'a' was already in the set from before Shift was pressed
function normalizeKey(key: string): string {
  if (key.length === 1) return key.toLowerCase();
  return key;
}

const MOVEMENT_KEYS = new Set([
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "w", "a", "s", "d", "Shift",
]);

export function useROVControls() {
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const updatePhysics = useCallback((timestamp: number) => {
    const store = useOceanStore.getState();

    // Don't update if panel is open (docked), ROV is dead, or command palette is open
    if (store.panelOpen || !store.rovAlive || store.commandPaletteOpen) {
      animationFrameRef.current = requestAnimationFrame(updatePhysics);
      return;
    }

    // Calculate delta time (cap at 50ms to prevent huge jumps)
    const dt = lastTimeRef.current
      ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
      : 0.016;
    lastTimeRef.current = timestamp;

    const keys = keysPressed.current;
    const {
      rovAcceleration,
      rovSpeed,
      rovBoostMultiplier,
      rovFriction,
      worldWidth,
      worldHeight,
    } = OCEAN_CONFIG;

    // User speed control
    const userSpeedMult = store.speedMultiplier;

    // Read input (normalized to lowercase for letters)
    let ax = 0;
    let ay = 0;
    if (keys.has("ArrowLeft") || keys.has("a")) ax -= 1;
    if (keys.has("ArrowRight") || keys.has("d")) ax += 1;
    if (keys.has("ArrowUp") || keys.has("w")) ay -= 1;
    if (keys.has("ArrowDown") || keys.has("s")) ay += 1;

    // Normalize diagonal
    if (ax !== 0 && ay !== 0) {
      const len = Math.sqrt(ax * ax + ay * ay);
      ax /= len;
      ay /= len;
    }

    // Boost
    const isBoosting = keys.has("Shift");
    const boostMultiplier = isBoosting ? rovBoostMultiplier : 1;

    // Apply acceleration (scaled by user speed multiplier)
    const effectiveAccel = rovAcceleration * userSpeedMult;
    let vx = store.rovVX + ax * effectiveAccel * dt;
    let vy = store.rovVY + ay * effectiveAccel * dt;

    // Apply friction
    vx *= rovFriction;
    vy *= rovFriction;

    // Clamp speed (scaled by user speed multiplier)
    const maxSpeed = rovSpeed * boostMultiplier * userSpeedMult;
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > maxSpeed) {
      vx = (vx / speed) * maxSpeed;
      vy = (vy / speed) * maxSpeed;
    }

    // Stop if very slow
    if (Math.abs(vx) < 0.5) vx = 0;
    if (Math.abs(vy) < 0.5) vy = 0;

    // Update position
    let newX = store.rovX + vx * dt;
    let newY = store.rovY + vy * dt;

    // Clamp to world bounds
    const padding = 20;
    newX = Math.max(padding, Math.min(worldWidth - padding, newX));
    newY = Math.max(padding, Math.min(worldHeight - padding, newY));

    // Update facing direction
    let facingDirection = store.facingDirection;
    if (ax > 0) facingDirection = "right";
    else if (ax < 0) facingDirection = "left";

    // Update store
    if (newX !== store.rovX || newY !== store.rovY) {
      store.setRovPosition(newX, newY);
    }
    if (vx !== store.rovVX || vy !== store.rovVY) {
      store.setRovVelocity(vx, vy);
    }
    if (isBoosting !== store.isBoosting) {
      store.setIsBoosting(isBoosting);
    }
    if (facingDirection !== store.facingDirection) {
      store.setFacingDirection(facingDirection);
    }

    // Check station proximity
    let nearestStation = null;
    let nearestDist = Infinity;
    for (const station of STATIONS) {
      const dx = newX - station.position.x;
      const dy = newY - station.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < OCEAN_CONFIG.dockRange && dist < nearestDist) {
        nearestDist = dist;
        nearestStation = station.id;
      }
    }

    if (nearestStation !== store.nearStation) {
      store.setNearStation(nearestStation);
    }

    // Discover station if within range
    if (nearestStation && !store.discoveredStations.has(nearestStation)) {
      store.discoverStation(nearestStation);
    }

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useOceanStore.getState();
      const key = normalizeKey(e.key);

      // Dock/undock with Enter
      if (e.key === "Enter") {
        e.preventDefault();
        if (store.panelOpen) {
          store.undock();
        } else if (store.nearStation) {
          store.dockAtStation(store.nearStation);
        }
        return;
      }

      // Undock with Escape
      if (e.key === "Escape" && store.panelOpen) {
        e.preventDefault();
        store.undock();
        return;
      }

      // Toggle command palette with K key (skip if focused on input/textarea)
      if (
        key === "k" &&
        !store.panelOpen &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        store.commandPaletteOpen
          ? useOceanStore.getState().closeCommandPalette()
          : useOceanStore.getState().openCommandPalette();
        return;
      }

      // SKIP all other key handling when panel or command palette is open
      // (so games inside panels can use arrow keys, WASD, Space, etc.)
      if (store.panelOpen || store.commandPaletteOpen) return;

      // Fire projectile on Space
      if (e.key === " " || e.key === "Space") {
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent("rov-shoot", {
            detail: {
              x: store.rovX,
              y: store.rovY,
              direction: store.facingDirection,
            },
          })
        );
        return;
      }

      // Track movement keys — normalize single letters to lowercase
      // but keep Arrow/Shift as-is since they don't change with Shift
      const trackKey = e.key === "Shift" ? "Shift"
        : e.key.startsWith("Arrow") ? e.key
        : key; // lowercase single letter

      if (MOVEMENT_KEYS.has(trackKey)) {
        e.preventDefault();
        keysPressed.current.add(trackKey);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = normalizeKey(e.key);
      const trackKey = e.key === "Shift" ? "Shift"
        : e.key.startsWith("Arrow") ? e.key
        : key;
      keysPressed.current.delete(trackKey);
    };

    const handleBlur = () => {
      keysPressed.current.clear();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) keysPressed.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [updatePhysics]);
}
