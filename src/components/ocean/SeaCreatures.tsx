"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useOceanStore } from "@/stores/oceanStore";
import { OCEAN_CONFIG } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PassiveCreature {
  id: string;
  art: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
  scale: number;
}

type HostileState = "patrol" | "chase" | "bite" | "retreat";

interface HostileCreature {
  id: string;
  kind: "anglerfish" | "squid" | "shark";
  artLeft: string;
  artRight: string;
  homeX: number;
  homeY: number;
  currentX: number;
  currentY: number;
  speed: number;
  detectionRange: number;
  state: HostileState;
  facing: "left" | "right";
  aggroTimer: number;
  biteTimer: number;
  patrolAngle: number;
  patrolRadius: number;
  glowColor: string;
  size: number;
  alive: boolean;
  dyingAt: number | null; // timestamp when creature started dying
  hp: number;
  maxHp: number;
  hitFlashAt: number | null; // timestamp when creature was last hit (non-lethal)
}

// Explosion flash rendered at a kill location
interface KillExplosion {
  id: number;
  x: number;
  y: number;
  born: number;
}

const DEATH_FADE_DURATION = 500; // 0.5s fade out
const RESPAWN_DELAY = 15000; // 15 seconds
const HIT_RANGE = 60; // px distance for projectile-creature collision
const EXPLOSION_DURATION = 400; // ms for the explosion flash

let nextExplosionId = 0;

// ---------------------------------------------------------------------------
// Passive creature definitions (decorative, CSS-animated)
// ---------------------------------------------------------------------------

const PASSIVE_CREATURES: PassiveCreature[] = [
  // Near surface - tiny fish school
  {
    id: "p0",
    art: "><>  ><>  ><>",
    x: 400,
    y: 180,
    duration: 22,
    delay: 0,
    opacity: 0.14,
    scale: 0.9,
  },
  // Upper mid - lone fish
  {
    id: "p1",
    art: "<\u00B0)))><",
    x: 2200,
    y: 350,
    duration: 28,
    delay: 4,
    opacity: 0.12,
    scale: 1.1,
  },
  // Mid depth - jellyfish
  {
    id: "p2",
    art: "(\u2022)(~)(~)",
    x: 1000,
    y: 900,
    duration: 35,
    delay: 2,
    opacity: 0.1,
    scale: 1.3,
  },
  // Mid depth - another jellyfish
  {
    id: "p3",
    art: "{\u2248\u2248\u2248}",
    x: 2800,
    y: 1100,
    duration: 40,
    delay: 7,
    opacity: 0.08,
    scale: 1.0,
  },
  // Deep - sea horse
  {
    id: "p4",
    art: "\u00A7><",
    x: 600,
    y: 1500,
    duration: 30,
    delay: 10,
    opacity: 0.07,
    scale: 1.2,
  },
  // Deep - small school
  {
    id: "p5",
    art: "><(((\u00BA>  ><>",
    x: 1800,
    y: 1800,
    duration: 32,
    delay: 5,
    opacity: 0.06,
    scale: 1.0,
  },
  // Very deep - bioluminescent dot cluster
  {
    id: "p6",
    art: "\u00B7 \u2022 \u00B7 \u2022 \u00B7",
    x: 2500,
    y: 2100,
    duration: 45,
    delay: 12,
    opacity: 0.05,
    scale: 0.8,
  },
  // Near surface - tiny fish
  {
    id: "p7",
    art: "><>",
    x: 1400,
    y: 120,
    duration: 18,
    delay: 3,
    opacity: 0.15,
    scale: 0.8,
  },
];

// ---------------------------------------------------------------------------
// Hostile creature definitions
// ---------------------------------------------------------------------------

const INITIAL_HOSTILES: Omit<
  HostileCreature,
  "currentX" | "currentY" | "state" | "facing" | "aggroTimer" | "biteTimer" | "patrolAngle" | "alive" | "dyingAt" | "hp" | "hitFlashAt"
>[] = [
  {
    id: "h-shark",
    kind: "shark",
    artLeft: "<|=====>{",
    artRight: "}<=====>|",
    homeX: 2000,
    homeY: 500,
    speed: 1.6,
    detectionRange: 350,
    patrolRadius: 200,
    glowColor: "rgba(255, 80, 60, 0.8)",
    size: 20,
    maxHp: 3,
  },
  {
    id: "h-squid",
    kind: "squid",
    artLeft: "<{{{{{{(O)=",
    artRight: "=(O)}}}}}}}>",
    homeX: 800,
    homeY: 1200,
    speed: 2.4,
    detectionRange: 280,
    patrolRadius: 150,
    glowColor: "rgba(255, 120, 0, 0.9)",
    size: 22,
    maxHp: 2,
  },
  {
    id: "h-angler",
    kind: "anglerfish",
    artLeft: "<*))><{{{{>",
    artRight: "<{{{{><))*>",
    homeX: 1600,
    homeY: 2000,
    speed: 1.1,
    detectionRange: 320,
    patrolRadius: 120,
    glowColor: "rgba(0, 255, 180, 0.9)",
    size: 26,
    maxHp: 4,
  },
  {
    id: "h-angler2",
    kind: "anglerfish",
    artLeft: "<*))>====>",
    artRight: "<====<((*>",
    homeX: 2700,
    homeY: 1900,
    speed: 1.0,
    detectionRange: 300,
    patrolRadius: 100,
    glowColor: "rgba(0, 200, 255, 0.9)",
    size: 24,
    maxHp: 3,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dist(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ---------------------------------------------------------------------------
// Constants for AI behaviour
// ---------------------------------------------------------------------------

const BITE_RANGE = 50;
const BITE_COOLDOWN = 2500; // ms the creature retreats after a bite
const CHASE_TIMEOUT = 6000; // ms before giving up the chase
const SQUID_CHASE_TIMEOUT = 3000; // squid gives up faster
const PATROL_SPEED_FACTOR = 0.3;
const RETREAT_SPEED_FACTOR = 1.8;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SeaCreatures() {
  const [hostiles, setHostiles] = useState<HostileCreature[]>(() =>
    INITIAL_HOSTILES.map((h) => ({
      ...h,
      currentX: h.homeX,
      currentY: h.homeY,
      state: "patrol" as HostileState,
      facing: "left" as const,
      aggroTimer: 0,
      biteTimer: 0,
      patrolAngle: Math.random() * Math.PI * 2,
      alive: true,
      dyingAt: null,
      hp: h.maxHp,
      hitFlashAt: null,
    }))
  );

  const [explosions, setExplosions] = useState<KillExplosion[]>([]);

  const hostileRef = useRef(hostiles);
  hostileRef.current = hostiles;

  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Track aggro indicator per creature
  const [aggroFlash, setAggroFlash] = useState<Record<string, boolean>>({});

  // -------------------------------------------------------------------------
  // Main animation loop for hostile creature AI
  // -------------------------------------------------------------------------
  const tick = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }
    const dt = Math.min(timestamp - lastTimeRef.current, 50); // cap to avoid jumps
    lastTimeRef.current = timestamp;

    const { rovX, rovY, rovAlive, peacefulMode } = useOceanStore.getState();

    const next = hostileRef.current.map((creature) => {
      const c = { ...creature };

      // Skip AI for dead/dying creatures
      if (!c.alive) return c;

      // If ROV is dead or peaceful mode is on, force aggressive creatures to retreat
      if ((!rovAlive || peacefulMode) && (c.state === "chase" || c.state === "bite")) {
        c.state = "retreat";
        c.aggroTimer = 0;
        return c;
      }

      const distToROV = dist(c.currentX, c.currentY, rovX, rovY);

      const chaseTimeout =
        c.kind === "squid" ? SQUID_CHASE_TIMEOUT : CHASE_TIMEOUT;

      // State machine
      switch (c.state) {
        // ----- PATROL -----
        case "patrol": {
          c.patrolAngle += (dt / 1000) * 0.5;
          const targetX =
            c.homeX + Math.cos(c.patrolAngle) * c.patrolRadius;
          const targetY =
            c.homeY + Math.sin(c.patrolAngle) * c.patrolRadius;
          const dx = targetX - c.currentX;
          const dy = targetY - c.currentY;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = c.speed * PATROL_SPEED_FACTOR * (dt / 16);
          c.currentX += (dx / d) * speed;
          c.currentY += (dy / d) * speed;
          c.facing = dx < 0 ? "left" : "right";

          // Check if ROV is in detection range (only chase if ROV is alive and not peaceful)
          if (rovAlive && !peacefulMode && distToROV < c.detectionRange) {
            c.state = "chase";
            c.aggroTimer = 0;
          }
          break;
        }

        // ----- CHASE -----
        case "chase": {
          c.aggroTimer += dt;
          const dx = rovX - c.currentX;
          const dy = rovY - c.currentY;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = c.speed * (dt / 16);
          c.currentX += (dx / d) * speed;
          c.currentY += (dy / d) * speed;
          c.facing = dx < 0 ? "left" : "right";

          // Bite!
          if (distToROV < BITE_RANGE) {
            c.state = "bite";
            c.biteTimer = 0;
            // Dispatch damage event
            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("rov-damage", {
                  detail: { creature: c.kind },
                })
              );
            }
          }

          // Give up chase
          if (c.aggroTimer > chaseTimeout && distToROV > c.detectionRange * 0.6) {
            c.state = "retreat";
          }
          break;
        }

        // ----- BITE -----
        case "bite": {
          c.biteTimer += dt;
          // Push back slightly from ROV
          const dx = c.currentX - rovX;
          const dy = c.currentY - rovY;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const pushSpeed = 0.8 * (dt / 16);
          c.currentX += (dx / d) * pushSpeed;
          c.currentY += (dy / d) * pushSpeed;

          if (c.biteTimer > BITE_COOLDOWN) {
            c.state = "retreat";
          }
          break;
        }

        // ----- RETREAT -----
        case "retreat": {
          const dx = c.homeX - c.currentX;
          const dy = c.homeY - c.currentY;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = c.speed * RETREAT_SPEED_FACTOR * (dt / 16);
          c.currentX += (dx / d) * speed;
          c.currentY += (dy / d) * speed;
          c.facing = dx < 0 ? "left" : "right";

          if (d < 30) {
            c.state = "patrol";
            c.aggroTimer = 0;
            c.patrolAngle = Math.random() * Math.PI * 2;
          }
          break;
        }
      }

      // Clamp to world bounds with margin
      c.currentX = clamp(c.currentX, 40, OCEAN_CONFIG.worldWidth - 40);
      c.currentY = clamp(c.currentY, 40, OCEAN_CONFIG.worldHeight - 40);

      return c;
    });

    setHostiles(next);

    // Update aggro flash map (only when state transitions to chase, skip dead)
    const newFlash: Record<string, boolean> = {};
    for (const c of next) {
      if (c.alive && (c.state === "chase" || c.state === "bite")) {
        newFlash[c.id] = true;
      }
    }
    setAggroFlash(newFlash);

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  // -------------------------------------------------------------------------
  // Projectile-hit detection: check if any projectile is near an alive hostile
  // -------------------------------------------------------------------------
  useEffect(() => {
    const handleProjectileHit = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        x: number;
        y: number;
        projectileId: number;
      };

      setHostiles((prev) => {
        // Find the first alive creature within HIT_RANGE
        const hitIndex = prev.findIndex(
          (c) =>
            c.alive &&
            c.dyingAt === null &&
            dist(c.currentX, c.currentY, detail.x, detail.y) < HIT_RANGE
        );

        if (hitIndex === -1) return prev;

        const hit = prev[hitIndex];
        const newHp = hit.hp - 1;

        // Dispatch creature-killed so OceanWorld can remove the projectile
        window.dispatchEvent(
          new CustomEvent("creature-killed", {
            detail: { projectileId: detail.projectileId },
          })
        );

        if (newHp <= 0) {
          // Creature killed — explosion + death + respawn
          setExplosions((expl) => [
            ...expl,
            {
              id: nextExplosionId++,
              x: hit.currentX,
              y: hit.currentY,
              born: Date.now(),
            },
          ]);

          // Schedule respawn with full HP
          const creatureId = hit.id;
          const creatureMaxHp = hit.maxHp;
          setTimeout(() => {
            setHostiles((current) =>
              current.map((c) =>
                c.id === creatureId
                  ? {
                      ...c,
                      alive: true,
                      dyingAt: null,
                      hp: creatureMaxHp,
                      hitFlashAt: null,
                      currentX: c.homeX,
                      currentY: c.homeY,
                      state: "patrol" as HostileState,
                      aggroTimer: 0,
                      biteTimer: 0,
                      patrolAngle: Math.random() * Math.PI * 2,
                    }
                  : c
              )
            );
          }, RESPAWN_DELAY);

          // Mark creature as dying
          const updated = [...prev];
          updated[hitIndex] = {
            ...hit,
            hp: 0,
            alive: false,
            dyingAt: Date.now(),
            state: "patrol" as HostileState,
            aggroTimer: 0,
          };
          return updated;
        } else {
          // Creature damaged but not dead — flash + knockback to retreat
          const updated = [...prev];
          updated[hitIndex] = {
            ...hit,
            hp: newHp,
            hitFlashAt: Date.now(),
            state: "retreat" as HostileState,
            aggroTimer: 0,
          };
          return updated;
        }
      });
    };

    window.addEventListener("projectile-hit", handleProjectileHit);
    return () =>
      window.removeEventListener("projectile-hit", handleProjectileHit);
  }, []);

  // Reset all creatures when ROV respawns
  useEffect(() => {
    const handleRespawn = () => {
      setHostiles(
        INITIAL_HOSTILES.map((h) => ({
          ...h,
          currentX: h.homeX,
          currentY: h.homeY,
          state: "patrol" as HostileState,
          facing: "left" as const,
          aggroTimer: 0,
          biteTimer: 0,
          patrolAngle: Math.random() * Math.PI * 2,
          alive: true,
          dyingAt: null,
          hp: h.maxHp,
          hitFlashAt: null,
        }))
      );
      setExplosions([]);
    };
    window.addEventListener("rov-respawn", handleRespawn);
    return () => window.removeEventListener("rov-respawn", handleRespawn);
  }, []);

  // Clean up dying creatures after fade completes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setHostiles((prev) =>
        prev.map((c) => {
          if (!c.alive && c.dyingAt && now - c.dyingAt > DEATH_FADE_DURATION) {
            // Move off-screen while waiting for respawn (hide it)
            return { ...c, currentX: -9999, currentY: -9999 };
          }
          return c;
        })
      );

      // Clean up old explosions
      setExplosions((prev) =>
        prev.filter((ex) => now - ex.born < EXPLOSION_DURATION)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* -------- Passive creatures -------- */}
      {PASSIVE_CREATURES.map((c) => (
        <div
          key={c.id}
          className="absolute font-mono select-none"
          style={{
            left: c.x,
            top: c.y,
            fontSize: `${14 * c.scale}px`,
            color: `rgba(200, 214, 229, ${c.opacity})`,
            animation: `drift ${c.duration}s ease-in-out infinite`,
            animationDelay: `${c.delay}s`,
            letterSpacing: "1px",
            willChange: "transform",
          }}
        >
          {c.art}
        </div>
      ))}

      {/* -------- Kill explosions -------- */}
      {explosions.map((ex) => {
        const age = Date.now() - ex.born;
        const progress = Math.min(age / EXPLOSION_DURATION, 1);
        const size = 40 + progress * 60; // expands from 40 to 100px
        const opacity = 1 - progress;

        return (
          <div
            key={ex.id}
            className="absolute pointer-events-none"
            style={{
              left: ex.x,
              top: ex.y,
              transform: "translate(-50%, -50%)",
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(0,255,255,${opacity * 0.8}) 0%, rgba(255,255,100,${opacity * 0.5}) 30%, rgba(255,100,0,${opacity * 0.3}) 60%, rgba(255,0,0,0) 100%)`,
              boxShadow: `0 0 ${20 + progress * 30}px rgba(0, 255, 255, ${opacity * 0.6}), 0 0 ${40 + progress * 40}px rgba(255, 200, 50, ${opacity * 0.3})`,
              zIndex: 20,
            }}
          />
        );
      })}

      {/* -------- Hostile creatures -------- */}
      {hostiles
        .filter((c) => c.currentX > -9000) // hide off-screen dead creatures
        .map((c) => {
        const isAggro = c.alive && (c.state === "chase" || c.state === "bite");
        const isBiting = c.alive && c.state === "bite";
        const isDying = !c.alive && c.dyingAt !== null;
        const isHitFlashing = c.hitFlashAt !== null && Date.now() - c.hitFlashAt < 300;
        const art = c.facing === "left" ? c.artLeft : c.artRight;
        const hpPercent = c.maxHp > 0 ? c.hp / c.maxHp : 0;
        const hpColor = hpPercent > 0.6 ? "#00ff88" : hpPercent > 0.3 ? "#ffb000" : "#ff3366";

        // Calculate dying fade opacity
        const dyingOpacity = isDying
          ? Math.max(0, 1 - (Date.now() - c.dyingAt!) / DEATH_FADE_DURATION)
          : 1;

        return (
          <div
            key={c.id}
            className="absolute font-mono select-none"
            style={{
              left: c.currentX,
              top: c.currentY,
              transform: `translate(-50%, -50%)`,
              fontSize: `${c.size}px`,
              letterSpacing: "2px",
              whiteSpace: "nowrap",
              transition: "text-shadow 0.2s",
              willChange: "left, top",
              opacity: dyingOpacity,
              filter: isDying
                ? "brightness(2) saturate(0)"
                : isHitFlashing
                ? "brightness(2.5) saturate(1.5)"
                : undefined,
            }}
          >
            {/* Health bar - only show when damaged */}
            {c.alive && c.hp < c.maxHp && (
              <div
                style={{
                  position: "absolute",
                  top: -32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: `${Math.max(40, c.maxHp * 16)}px`,
                  height: "6px",
                  background: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "3px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${hpPercent * 100}%`,
                    height: "100%",
                    background: hpColor,
                    borderRadius: "2px",
                    boxShadow: `0 0 6px ${hpColor}`,
                    transition: "width 0.2s ease-out",
                  }}
                />
              </div>
            )}

            {/* Aggro indicator - "!" appears when creature detects ROV */}
            {aggroFlash[c.id] && (
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#ff3333",
                  fontWeight: "bold",
                  fontSize: "18px",
                  textShadow: "0 0 8px rgba(255, 0, 0, 0.8)",
                  animation: "aggro-pulse 0.4s ease-in-out infinite",
                }}
              >
                !
              </div>
            )}

            {/* Creature body */}
            <span
              style={{
                color: isBiting
                  ? "#ff2200"
                  : isAggro
                  ? "#ff6644"
                  : c.kind === "anglerfish"
                  ? "#44ffcc"
                  : c.kind === "squid"
                  ? "#ff8844"
                  : "#aaccdd",
                textShadow: isAggro
                  ? `0 0 12px ${c.glowColor}, 0 0 24px ${c.glowColor}, 0 0 4px rgba(255,255,255,0.3)`
                  : c.kind === "anglerfish"
                  ? `0 0 8px ${c.glowColor}, 0 0 16px rgba(0, 255, 180, 0.3)`
                  : `0 0 4px rgba(150, 200, 220, 0.3)`,
                filter: isBiting ? "brightness(1.8)" : "none",
              }}
            >
              {art}
            </span>

            {/* Glowing eyes overlay - two dots positioned over the creature */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: c.facing === "left" ? "15%" : "75%",
                transform: "translateY(-50%)",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: isAggro ? "#ff0000" : c.glowColor,
                boxShadow: isAggro
                  ? `0 0 8px #ff0000, 0 0 16px #ff0000, 0 0 24px rgba(255, 0, 0, 0.5)`
                  : `0 0 6px ${c.glowColor}, 0 0 12px ${c.glowColor}`,
                animation: isAggro
                  ? "eye-flicker 0.15s ease-in-out infinite alternate"
                  : "eye-glow 2s ease-in-out infinite alternate",
                opacity: isAggro ? 1 : 0.7,
              }}
            />

            {/* Anglerfish lure - bioluminescent dangling light */}
            {c.kind === "anglerfish" && (
              <div
                style={{
                  position: "absolute",
                  top: -16,
                  left: c.facing === "left" ? "5%" : "85%",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: isAggro ? "#ff4400" : "#00ffaa",
                  boxShadow: isAggro
                    ? "0 0 12px #ff4400, 0 0 24px #ff4400, 0 0 40px rgba(255, 68, 0, 0.4)"
                    : "0 0 12px #00ffaa, 0 0 24px #00ffaa, 0 0 40px rgba(0, 255, 170, 0.3)",
                  animation: "lure-bob 1.5s ease-in-out infinite",
                }}
              />
            )}

            {/* Bite flash - red burst when biting */}
            {isBiting && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255,0,0,0.4) 0%, rgba(255,0,0,0) 70%)",
                  animation: "bite-flash 0.3s ease-out",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        );
      })}

    </div>
  );
}
