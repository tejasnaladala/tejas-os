"use client";

import { useEffect, useRef, useCallback } from "react";
import { useOceanStore } from "@/stores/oceanStore";
import { OCEAN_CONFIG, STATIONS } from "@/lib/constants";

export function useROVControls() {
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const updatePhysics = useCallback((timestamp: number) => {
    const store = useOceanStore.getState();

    // Don't update if panel is open (docked)
    if (store.panelOpen) {
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

    // Read input
    let ax = 0;
    let ay = 0;
    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) ax -= 1;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) ax += 1;
    if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) ay -= 1;
    if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) ay += 1;

    // Normalize diagonal
    if (ax !== 0 && ay !== 0) {
      const len = Math.sqrt(ax * ax + ay * ay);
      ax /= len;
      ay /= len;
    }

    // Boost
    const isBoosting = keys.has("Shift");
    const speedMultiplier = isBoosting ? rovBoostMultiplier : 1;

    // Apply acceleration
    let vx = store.rovVX + ax * rovAcceleration * dt;
    let vy = store.rovVY + ay * rovAcceleration * dt;

    // Apply friction
    vx *= rovFriction;
    vy *= rovFriction;

    // Clamp speed
    const maxSpeed = rovSpeed * speedMultiplier;
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

    // Clamp to world bounds (with padding for ROV size)
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

    // Discover station if within range (without docking)
    if (nearestStation && !store.discoveredStations.has(nearestStation)) {
      store.discoverStation(nearestStation);
    }

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useOceanStore.getState();

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

      // Track movement keys
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
          "W",
          "A",
          "S",
          "D",
          "Shift",
        ].includes(e.key)
      ) {
        e.preventDefault();
        keysPressed.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    const handleBlur = () => {
      keysPressed.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [updatePhysics]);
}
