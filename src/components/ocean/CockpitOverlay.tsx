"use client";

import { useOceanStore } from "@/stores/oceanStore";
import { STATIONS, OCEAN_CONFIG } from "@/lib/constants";
import { useEffect, useMemo, useState, useRef } from "react";

// ─── Depth zone labels ───────────────────────────────────────
function getDepthZone(y: number): string {
  const pct = y / OCEAN_CONFIG.worldHeight;
  if (pct < 0.15) return "SUNLIGHT ZONE";
  if (pct < 0.35) return "TWILIGHT ZONE";
  if (pct < 0.6) return "MIDNIGHT ZONE";
  if (pct < 0.8) return "ABYSSAL ZONE";
  return "HADAL ZONE";
}

// ─── Depth in "meters" (scaled for immersion) ───────────────
function depthMeters(y: number): number {
  return Math.round((y / OCEAN_CONFIG.worldHeight) * 4000);
}

// ─── O2 simulation (cosmetic flicker between 97-100) ────────
function useO2(): number {
  const [o2, setO2] = useState(99);
  useEffect(() => {
    const iv = setInterval(() => {
      setO2(98 + Math.floor(Math.random() * 3)); // 98, 99, or 100
    }, 4000);
    return () => clearInterval(iv);
  }, []);
  return o2;
}

// ─── Mission timer ──────────────────────────────────────────
function useMissionTime(active: boolean): string {
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) return;
    startRef.current = Date.now();
    const iv = setInterval(() => setElapsed(Date.now() - startRef.current), 1000);
    return () => clearInterval(iv);
  }, [active]);
  const s = Math.floor(elapsed / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function CockpitOverlay() {
  const fpvMode = useOceanStore((s) => s.fpvMode);
  const rovX = useOceanStore((s) => s.rovX);
  const rovY = useOceanStore((s) => s.rovY);
  const rovVX = useOceanStore((s) => s.rovVX);
  const rovVY = useOceanStore((s) => s.rovVY);
  const isBoosting = useOceanStore((s) => s.isBoosting);
  const nearStation = useOceanStore((s) => s.nearStation);

  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0 });
  const o2 = useO2();
  const missionTime = useMissionTime(fpvMode);

  // ─── Derived values ────────────────────────────────────────
  const speed = useMemo(
    () => Math.sqrt(rovVX * rovVX + rovVY * rovVY),
    [rovVX, rovVY]
  );

  const bearing = useMemo(() => {
    if (speed < 0.3) return 0;
    const rad = Math.atan2(rovVX, -rovVY);
    let deg = (rad * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return Math.round(deg);
  }, [rovVX, rovVY, speed]);

  const compassLabel = useMemo(() => {
    if (speed < 0.3) return "---";
    if (bearing >= 337.5 || bearing < 22.5) return "N";
    if (bearing < 67.5) return "NE";
    if (bearing < 112.5) return "E";
    if (bearing < 157.5) return "SE";
    if (bearing < 202.5) return "S";
    if (bearing < 247.5) return "SW";
    if (bearing < 292.5) return "W";
    return "NW";
  }, [bearing, speed]);

  const depthPct = useMemo(() => rovY / OCEAN_CONFIG.worldHeight, [rovY]);
  const depthM = useMemo(() => depthMeters(rovY), [rovY]);
  const depthZone = useMemo(() => getDepthZone(rovY), [rovY]);

  // Station distances & angles relative to ROV
  const stationData = useMemo(() => {
    return STATIONS.map((s) => {
      const dx = s.position.x - rovX;
      const dy = s.position.y - rovY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dx, -dy); // 0 = N, PI/2 = E
      let angleDeg = (angle * 180) / Math.PI;
      if (angleDeg < 0) angleDeg += 360;
      return { ...s, dx, dy, dist, angleDeg, distMeters: Math.round(dist * 1.25) };
    });
  }, [rovX, rovY]);

  const nearestStation = useMemo(() => {
    if (!nearStation) return null;
    return stationData.find((s) => s.id === nearStation) ?? null;
  }, [nearStation, stationData]);

  // Boost screen shake
  useEffect(() => {
    if (!fpvMode || !isBoosting) {
      setShakeOffset({ x: 0, y: 0 });
      return;
    }
    const iv = setInterval(() => {
      setShakeOffset({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
      });
    }, 50);
    return () => clearInterval(iv);
  }, [fpvMode, isBoosting]);

  if (!fpvMode) return null;

  // ─── Computed style values ─────────────────────────────────
  const depthTintOpacity = Math.min(depthPct * 0.45, 0.35);
  const causticsOpacity = Math.max(0, 0.12 - depthPct * 0.2);
  const fogOpacity = Math.min(depthPct * 0.3, 0.2);
  const speedKnots = (speed * 0.7).toFixed(1);
  const speedPct = Math.min(speed / 12, 1);
  const needleAngle = -90 + speedPct * 180; // -90 = left, 90 = right

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 25,
        transform: `translate(${shakeOffset.x}px, ${shakeOffset.y}px)`,
      }}
    >
      {/* ================================================================
          ATMOSPHERE & ENVIRONMENTAL EFFECTS
          ================================================================ */}

      {/* Depth-based blue-green tint overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(0, 20, 40, ${depthTintOpacity}) 100%)`,
          mixBlendMode: "multiply",
        }}
      />

      {/* Deep water fog */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(0, 8, 20, ${fogOpacity}) 60%, rgba(0, 5, 15, ${fogOpacity + 0.1}) 100%)`,
        }}
      />

      {/* Water caustic light patterns (shallow only) */}
      {causticsOpacity > 0.01 && (
        <div
          className="absolute inset-0"
          style={{
            opacity: causticsOpacity,
            background:
              "repeating-conic-gradient(rgba(120,200,255,0.03) 0deg, transparent 15deg, rgba(100,220,255,0.02) 30deg)",
            backgroundSize: "200px 200px",
            animation: "cockpit-caustics 8s linear infinite",
          }}
        />
      )}

      {/* Lens vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Scan line sweep */}
      <div
        className="absolute left-0 right-0"
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.06) 20%, rgba(0,212,255,0.1) 50%, rgba(0,212,255,0.06) 80%, transparent 100%)",
          animation: "cockpit-scanline 5s linear infinite",
          boxShadow: "0 0 20px 4px rgba(0,212,255,0.03)",
        }}
      />

      {/* Floating particles (sediment/plankton) */}
      <div className="absolute inset-0" style={{ overflow: "hidden" }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: `rgba(180, 210, 230, ${0.08 + depthPct * 0.15})`,
              left: `${(i * 37 + 11) % 100}%`,
              animation: `cockpit-particle-${i % 4} ${6 + (i % 5) * 2}s linear infinite`,
              animationDelay: `${(i * 0.7) % 5}s`,
            }}
          />
        ))}
      </div>

      {/* Water droplet on glass (subtle, CSS-based) */}
      <div
        className="absolute"
        style={{
          top: "18%",
          left: "72%",
          width: 6,
          height: 9,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          background:
            "radial-gradient(ellipse at 40% 30%, rgba(150,200,255,0.12), rgba(100,160,220,0.04))",
          border: "1px solid rgba(150,200,255,0.06)",
          animation: "cockpit-droplet1 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "32%",
          left: "23%",
          width: 4,
          height: 7,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          background:
            "radial-gradient(ellipse at 40% 30%, rgba(150,200,255,0.08), rgba(100,160,220,0.03))",
          border: "1px solid rgba(150,200,255,0.04)",
          animation: "cockpit-droplet2 15s ease-in-out infinite",
          animationDelay: "3s",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "55%",
          right: "15%",
          width: 5,
          height: 8,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          background:
            "radial-gradient(ellipse at 40% 30%, rgba(150,200,255,0.1), rgba(100,160,220,0.03))",
          border: "1px solid rgba(150,200,255,0.05)",
          animation: "cockpit-droplet1 18s ease-in-out infinite",
          animationDelay: "7s",
        }}
      />

      {/* Motion blur lines when moving fast */}
      {speed > 4 && (
        <div className="absolute inset-0" style={{ overflow: "hidden", opacity: Math.min((speed - 4) / 8, 0.35) }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${10 + i * 11}%`,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent 0%, rgba(140,200,255,${0.06 + (i % 3) * 0.02}) 30%, rgba(140,200,255,${0.04 + (i % 2) * 0.02}) 70%, transparent 100%)`,
                transform: `translateX(${(i % 2 === 0 ? -1 : 1) * 10}px)`,
                animation: `cockpit-motionblur ${0.3 + (i % 3) * 0.2}s linear infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* ================================================================
          HULL FRAME & GLASS
          ================================================================ */}

      {/* Top hull panel */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 48,
          background: "linear-gradient(180deg, #070e16 0%, #0a1520 70%, transparent 100%)",
          borderBottom: "1px solid rgba(80, 120, 160, 0.12)",
        }}
      />
      {/* Bottom hull panel */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 52,
          background: "linear-gradient(0deg, #070e16 0%, #0a1520 70%, transparent 100%)",
          borderTop: "1px solid rgba(80, 120, 160, 0.12)",
        }}
      />
      {/* Left hull panel */}
      <div
        className="absolute top-0 left-0 bottom-0"
        style={{
          width: 48,
          background: "linear-gradient(90deg, #070e16 0%, #0a1520 70%, transparent 100%)",
          borderRight: "1px solid rgba(80, 120, 160, 0.12)",
        }}
      />
      {/* Right hull panel */}
      <div
        className="absolute top-0 right-0 bottom-0"
        style={{
          width: 48,
          background: "linear-gradient(270deg, #070e16 0%, #0a1520 70%, transparent 100%)",
          borderLeft: "1px solid rgba(80, 120, 160, 0.12)",
        }}
      />

      {/* Corner reinforcements with rivet details */}
      {[
        { top: 0, left: 0, gx: "0%", gy: "0%" },
        { top: 0, right: 0, gx: "100%", gy: "0%" },
        { bottom: 0, left: 0, gx: "0%", gy: "100%" },
        { bottom: 0, right: 0, gx: "100%", gy: "100%" },
      ].map((pos, idx) => (
        <div key={idx}>
          <div
            className="absolute"
            style={{
              ...pos,
              width: 140,
              height: 140,
              background: `radial-gradient(ellipse at ${pos.gx} ${pos.gy}, #070e16 0%, transparent 65%)`,
            }}
          />
          {/* Rivets in corners */}
          {[0, 1, 2].map((r) => (
            <div
              key={r}
              className="absolute"
              style={{
                top: pos.top !== undefined ? 12 + r * 18 : undefined,
                bottom: pos.bottom !== undefined ? 12 + r * 18 : undefined,
                left: pos.left !== undefined ? 12 + r * 18 : undefined,
                right: pos.right !== undefined ? 12 + r * 18 : undefined,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #3a5060 0%, #1a2a35 100%)",
                border: "1px solid rgba(60, 90, 110, 0.3)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>
      ))}

      {/* Panel lines on hull */}
      <div className="absolute" style={{ top: 44, left: 44, width: 1, height: 80, background: "rgba(80,120,160,0.08)" }} />
      <div className="absolute" style={{ top: 44, right: 44, width: 1, height: 80, background: "rgba(80,120,160,0.08)" }} />
      <div className="absolute" style={{ bottom: 48, left: 44, width: 1, height: 80, background: "rgba(80,120,160,0.08)" }} />
      <div className="absolute" style={{ bottom: 48, right: 44, width: 1, height: 80, background: "rgba(80,120,160,0.08)" }} />
      {/* Horizontal panel lines */}
      <div className="absolute" style={{ top: 44, left: 44, height: 1, width: 80, background: "rgba(80,120,160,0.08)" }} />
      <div className="absolute" style={{ top: 44, right: 44, height: 1, width: 80, background: "rgba(80,120,160,0.08)" }} />
      <div className="absolute" style={{ bottom: 48, left: 44, height: 1, width: 80, background: "rgba(80,120,160,0.08)" }} />
      <div className="absolute" style={{ bottom: 48, right: 44, height: 1, width: 80, background: "rgba(80,120,160,0.08)" }} />

      {/* Inner viewport border with glass refraction */}
      <div
        className="absolute"
        style={{
          top: 38,
          left: 38,
          right: 38,
          bottom: 42,
          borderRadius: 20,
          border: "2px solid rgba(80, 130, 170, 0.18)",
          boxShadow:
            "inset 0 0 80px rgba(10, 21, 32, 0.5), inset 0 0 160px rgba(10, 21, 32, 0.2), 0 0 1px rgba(100,160,200,0.15)",
        }}
      />

      {/* Glass refraction highlight */}
      <div
        className="absolute"
        style={{
          top: "12%",
          left: "18%",
          width: "35%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.025) 25%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.025) 75%, transparent 100%)",
          transform: "rotate(-22deg)",
          transformOrigin: "center",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "20%",
          left: "22%",
          width: "28%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.015) 30%, rgba(255,255,255,0.025) 50%, rgba(255,255,255,0.015) 70%, transparent 100%)",
          transform: "rotate(-22deg)",
          transformOrigin: "center",
        }}
      />

      {/* ================================================================
          CENTER CROSSHAIR / RETICLE
          ================================================================ */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 60,
          height: 60,
        }}
      >
        {/* Outer ring */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(0,212,255,0.1)",
          }}
        />
        {/* Horizontal line */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(0,212,255,0.2) 0%, rgba(0,212,255,0.06) 35%, transparent 44%, transparent 56%, rgba(0,212,255,0.06) 65%, rgba(0,212,255,0.2) 100%)",
          }}
        />
        {/* Vertical line */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background:
              "linear-gradient(180deg, rgba(0,212,255,0.2) 0%, rgba(0,212,255,0.06) 35%, transparent 44%, transparent 56%, rgba(0,212,255,0.06) 65%, rgba(0,212,255,0.2) 100%)",
          }}
        />
        {/* Tick marks */}
        {[0, 90, 180, 270].map((rot) => (
          <div
            key={rot}
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: 1,
              height: 6,
              background: "rgba(0,212,255,0.2)",
              transform: `translate(-50%, -50%) rotate(${rot}deg) translateY(-20px)`,
              transformOrigin: "center center",
            }}
          />
        ))}
        {/* Center dot */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(0, 212, 255, 0.35)",
            boxShadow: "0 0 6px rgba(0,212,255,0.15)",
          }}
        />
      </div>

      {/* ================================================================
          TOP CENTER: FPV MODE LABEL + HEADING
          ================================================================ */}
      <div
        className="absolute"
        style={{
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Courier New', monospace",
          textAlign: "center",
        }}
      >
        <div
          className="flex items-center gap-2 justify-center"
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "#00d4ff",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#00d4ff",
              display: "inline-block",
              animation: "cockpit-blink 2s ease-in-out infinite",
            }}
          />
          FPV MODE
        </div>

        {/* Heading compass strip */}
        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 160,
              height: 20,
              borderRadius: 3,
              border: "1px solid rgba(0,212,255,0.15)",
              background: "rgba(0,10,20,0.5)",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Bearing text */}
            <span
              style={{
                fontSize: 12,
                color: "#c8d6e5",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.15em",
              }}
            >
              {bearing.toString().padStart(3, "0")}
              <span style={{ color: "#5f7a94", fontSize: 9, marginLeft: 4 }}>
                {compassLabel}
              </span>
            </span>
            {/* Center indicator notch */}
            <div
              className="absolute"
              style={{
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderBottom: "4px solid rgba(0,212,255,0.5)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ================================================================
          TOP-RIGHT: HULL + O2 INDICATORS
          ================================================================ */}
      <div
        className="absolute"
        style={{
          top: 12,
          right: 14,
          fontFamily: "'Courier New', monospace",
          fontSize: 9,
          color: "#5f7a94",
          letterSpacing: "0.08em",
        }}
      >
        {/* Hull integrity */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ textTransform: "uppercase", fontSize: 8, marginBottom: 3, letterSpacing: "0.12em" }}>
            Hull Integrity
          </div>
          <div className="flex items-center gap-1">
            <div
              style={{
                width: 64,
                height: 6,
                background: "rgba(0, 255, 136, 0.08)",
                borderRadius: 2,
                border: "1px solid rgba(0, 255, 136, 0.25)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, #00ff88 0%, #00cc6a 100%)",
                  opacity: 0.55,
                  borderRadius: 1,
                }}
              />
            </div>
            <span style={{ color: "#00ff88", fontSize: 9 }}>100%</span>
          </div>
        </div>

        {/* O2 Level */}
        <div>
          <div style={{ textTransform: "uppercase", fontSize: 8, marginBottom: 3, letterSpacing: "0.12em" }}>
            O2 Supply
          </div>
          <div className="flex items-center gap-1">
            <div
              style={{
                width: 64,
                height: 6,
                background: "rgba(0, 180, 255, 0.08)",
                borderRadius: 2,
                border: "1px solid rgba(0, 180, 255, 0.25)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${o2}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #00b4ff 0%, #0090cc 100%)",
                  opacity: 0.55,
                  borderRadius: 1,
                  transition: "width 1s ease",
                }}
              />
            </div>
            <span style={{ color: "#00b4ff", fontSize: 9 }}>{o2}%</span>
          </div>
        </div>
      </div>

      {/* ================================================================
          LEFT SIDE: DEPTH GAUGE (vertical bar)
          ================================================================ */}
      <div
        className="absolute"
        style={{
          top: "15%",
          left: 12,
          bottom: "20%",
          width: 30,
          fontFamily: "'Courier New', monospace",
        }}
      >
        {/* Label */}
        <div
          style={{
            fontSize: 7,
            color: "#5f7a94",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Depth
        </div>

        {/* Vertical bar track */}
        <div
          style={{
            position: "relative",
            height: "calc(100% - 30px)",
            width: 8,
            margin: "0 auto",
            background: "rgba(0, 100, 150, 0.08)",
            border: "1px solid rgba(0, 150, 200, 0.15)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Filled portion (from top) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${depthPct * 100}%`,
              background: `linear-gradient(180deg, rgba(0,180,255,0.3) 0%, rgba(0,100,200,0.5) 50%, rgba(0,40,120,0.7) ${100}%)`,
              borderRadius: 3,
              transition: "height 0.3s ease-out",
            }}
          />

          {/* Depth tick marks */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <div
              key={pct}
              className="absolute"
              style={{
                top: `${pct * 100}%`,
                left: 0,
                right: 0,
                height: 1,
                background: "rgba(0,150,200,0.2)",
              }}
            />
          ))}
        </div>

        {/* Depth readout */}
        <div
          style={{
            fontSize: 10,
            color: "#7ab8d6",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          {depthM}
          <span style={{ fontSize: 7, color: "#5f7a94" }}>m</span>
        </div>
      </div>

      {/* ================================================================
          LEFT SIDE: ENGINE POWER
          ================================================================ */}
      <div
        className="absolute"
        style={{
          top: "15%",
          left: 52,
          fontFamily: "'Courier New', monospace",
        }}
      >
        <div
          style={{
            fontSize: 7,
            color: "#5f7a94",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 4,
          }}
        >
          Engine
        </div>
        {/* Vertical power bars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const filled = speed > i * 0.9;
            const barColor = isBoosting ? "#00ff88" : "#00d4ff";
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column-reverse", gap: 1 }}>
                <div
                  style={{
                    width: 3,
                    height: 8 + i * 2,
                    borderRadius: 1,
                    background: filled
                      ? `${barColor}`
                      : "rgba(95, 122, 148, 0.12)",
                    opacity: filled ? (isBoosting ? 0.8 : 0.5) : 1,
                    border: `1px solid ${filled ? (isBoosting ? "rgba(0,255,136,0.5)" : "rgba(0,212,255,0.25)") : "rgba(95,122,148,0.1)"}`,
                    transition: "all 0.15s",
                    boxShadow: filled && isBoosting ? `0 0 5px ${barColor}40` : "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================
          BOTTOM-LEFT: COMPASS ROSE + BEARING
          ================================================================ */}
      <div
        className="absolute"
        style={{
          bottom: 60,
          left: 14,
          fontFamily: "'Courier New', monospace",
        }}
      >
        <div
          style={{
            fontSize: 7,
            color: "#5f7a94",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 4,
          }}
        >
          Compass
        </div>
        {/* Compass ring */}
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "1px solid rgba(0, 212, 255, 0.2)",
            position: "relative",
            background: "rgba(0,10,20,0.4)",
          }}
        >
          {/* Cardinal labels */}
          {[
            { label: "N", rot: 0 },
            { label: "E", rot: 90 },
            { label: "S", rot: 180 },
            { label: "W", rot: 270 },
          ].map(({ label, rot }) => (
            <div
              key={label}
              className="absolute"
              style={{
                fontSize: 7,
                color: label === "N" ? "#00d4ff" : "#5f7a94",
                fontWeight: label === "N" ? "bold" : "normal",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${rot}deg) translateY(-20px) rotate(-${rot}deg)`,
              }}
            >
              {label}
            </div>
          ))}
          {/* Tick marks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                width: 1,
                height: i % 3 === 0 ? 5 : 3,
                background: i % 3 === 0 ? "rgba(0,212,255,0.3)" : "rgba(0,212,255,0.12)",
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-22px)`,
                transformOrigin: "center center",
              }}
            />
          ))}
          {/* Needle */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: 2,
              height: 16,
              transformOrigin: "center bottom",
              transform: `translate(-50%, -100%) rotate(${bearing}deg)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "60%",
                background: "linear-gradient(180deg, #00d4ff 0%, rgba(0,212,255,0.15) 100%)",
                borderRadius: "1px 1px 0 0",
              }}
            />
          </div>
          {/* Center dot */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#00d4ff",
              opacity: 0.6,
              boxShadow: "0 0 4px rgba(0,212,255,0.4)",
            }}
          />
        </div>
      </div>

      {/* ================================================================
          BOTTOM CENTER: SPEED GAUGE (analog needle style)
          ================================================================ */}
      <div
        className="absolute"
        style={{
          bottom: 56,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Courier New', monospace",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 7,
            letterSpacing: "0.15em",
            color: "#5f7a94",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Speed
        </div>

        {/* Analog gauge */}
        <div
          style={{
            width: 80,
            height: 44,
            position: "relative",
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          {/* Gauge arc background */}
          <div
            className="absolute"
            style={{
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 76,
              height: 76,
              borderRadius: "50%",
              border: "2px solid rgba(0,212,255,0.15)",
              borderBottom: "none",
              background: "rgba(0,10,20,0.4)",
            }}
          />

          {/* Gauge tick marks */}
          {Array.from({ length: 9 }).map((_, i) => {
            const tickAngle = -90 + i * (180 / 8);
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  bottom: 0,
                  left: "50%",
                  width: 1,
                  height: i % 2 === 0 ? 6 : 4,
                  background: i % 2 === 0 ? "rgba(0,212,255,0.3)" : "rgba(0,212,255,0.15)",
                  transform: `translateX(-50%) rotate(${tickAngle}deg)`,
                  transformOrigin: "bottom center",
                }}
              />
            );
          })}

          {/* Needle */}
          <div
            className="absolute"
            style={{
              bottom: 0,
              left: "50%",
              width: 2,
              height: 30,
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${needleAngle}deg)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(0deg, ${isBoosting ? "#00ff88" : "#00d4ff"} 0%, transparent 90%)`,
                borderRadius: "1px 1px 0 0",
              }}
            />
          </div>

          {/* Center pivot */}
          <div
            className="absolute"
            style={{
              bottom: -3,
              left: "50%",
              transform: "translateX(-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isBoosting ? "#00ff88" : "#00d4ff",
              opacity: 0.6,
              boxShadow: isBoosting ? "0 0 8px rgba(0,255,136,0.5)" : "0 0 6px rgba(0,212,255,0.3)",
            }}
          />
        </div>

        {/* Digital speed readout */}
        <div className="flex items-baseline gap-1 justify-center" style={{ marginTop: 4 }}>
          <span
            style={{
              fontSize: 18,
              color: isBoosting ? "#00ff88" : "#c8d6e5",
              transition: "color 0.2s",
              textShadow: isBoosting ? "0 0 8px rgba(0,255,136,0.4)" : "none",
            }}
          >
            {speedKnots}
          </span>
          <span style={{ fontSize: 9, color: "#5f7a94" }}>kn</span>
        </div>

        {/* Engine power bars */}
        <div className="flex gap-0.5 justify-center" style={{ marginTop: 3 }}>
          {[1, 2, 3, 4, 5].map((i) => {
            const filled = speed > i * 1.5;
            return (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 4,
                  borderRadius: 1,
                  background: filled
                    ? isBoosting
                      ? "rgba(0, 255, 136, 0.7)"
                      : "rgba(0, 212, 255, 0.5)"
                    : "rgba(95, 122, 148, 0.15)",
                  border: `1px solid ${filled ? (isBoosting ? "rgba(0,255,136,0.5)" : "rgba(0,212,255,0.3)") : "rgba(95,122,148,0.1)"}`,
                  transition: "background 0.15s, border-color 0.15s",
                  boxShadow: filled && isBoosting ? "0 0 6px rgba(0,255,136,0.3)" : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ================================================================
          BOTTOM-RIGHT: SONAR / RADAR DISPLAY
          ================================================================ */}
      <div
        className="absolute"
        style={{
          bottom: 56,
          right: 14,
          fontFamily: "'Courier New', monospace",
        }}
      >
        <div
          style={{
            fontSize: 7,
            color: "#5f7a94",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 4,
            textAlign: "center",
          }}
        >
          Sonar
        </div>

        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1px solid rgba(0, 212, 255, 0.2)",
            background: "rgba(0, 10, 20, 0.6)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Sonar sweep */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: "50%",
              height: 2,
              transformOrigin: "left center",
              animation: "cockpit-sonar-sweep 3s linear infinite",
              background: "linear-gradient(90deg, rgba(0,212,255,0.5) 0%, rgba(0,212,255,0) 100%)",
            }}
          />

          {/* Sonar sweep trail (fading cone) */}
          <div
            className="absolute inset-0"
            style={{
              background: "conic-gradient(from 0deg at 50% 50%, rgba(0,212,255,0.08) 0deg, transparent 40deg, transparent 360deg)",
              animation: "cockpit-sonar-sweep-bg 3s linear infinite",
            }}
          />

          {/* Range rings */}
          {[0.33, 0.66, 1].map((r) => (
            <div
              key={r}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                width: `${r * 100}%`,
                height: `${r * 100}%`,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                border: "1px solid rgba(0, 212, 255, 0.08)",
              }}
            />
          ))}

          {/* Cross lines */}
          <div className="absolute" style={{ top: "50%", left: 0, right: 0, height: 1, background: "rgba(0,212,255,0.06)" }} />
          <div className="absolute" style={{ left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(0,212,255,0.06)" }} />

          {/* Station blips */}
          {stationData.map((station) => {
            // Scale distance to radar radius (max visible range ~1600px = 70px on radar)
            const maxRange = 1600;
            const radarRadius = 65;
            const clampedDist = Math.min(station.dist, maxRange);
            const radarDist = (clampedDist / maxRange) * radarRadius;
            const angleRad = (station.angleDeg * Math.PI) / 180;
            const bx = Math.sin(angleRad) * radarDist;
            const by = -Math.cos(angleRad) * radarDist;
            const isNear = station.dist < OCEAN_CONFIG.dockRange * 2;
            const isDockable = station.id === nearStation;

            return (
              <div
                key={station.id}
                className="absolute"
                style={{
                  top: `calc(50% + ${by}px)`,
                  left: `calc(50% + ${bx}px)`,
                  transform: "translate(-50%, -50%)",
                  width: isDockable ? 8 : isNear ? 6 : 4,
                  height: isDockable ? 8 : isNear ? 6 : 4,
                  borderRadius: "50%",
                  background: isDockable
                    ? "#ffb000"
                    : isNear
                    ? "#00ff88"
                    : "#00d4ff",
                  opacity: isDockable ? 1 : isNear ? 0.8 : 0.45,
                  boxShadow: isDockable
                    ? "0 0 8px rgba(255,176,0,0.6), 0 0 16px rgba(255,176,0,0.2)"
                    : isNear
                    ? "0 0 6px rgba(0,255,136,0.4)"
                    : "0 0 3px rgba(0,212,255,0.2)",
                  animation: isDockable
                    ? "cockpit-blip-pulse 1s ease-in-out infinite"
                    : isNear
                    ? "cockpit-blip-pulse 2s ease-in-out infinite"
                    : "none",
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}

          {/* Center ROV indicator */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              border: "1px solid #00d4ff",
              background: "rgba(0,212,255,0.3)",
            }}
          />

          {/* N indicator */}
          <div
            className="absolute"
            style={{
              top: 4,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 7,
              color: "#00d4ff",
              fontWeight: "bold",
            }}
          >
            N
          </div>
        </div>

        {/* Distance to nearest station */}
        {nearestStation && (
          <div
            style={{
              marginTop: 4,
              textAlign: "center",
              fontSize: 8,
              color: "#ffb000",
              letterSpacing: "0.1em",
            }}
          >
            {nearestStation.distMeters}m to {nearestStation.label}
          </div>
        )}
        {!nearestStation && stationData.length > 0 && (
          <div
            style={{
              marginTop: 4,
              textAlign: "center",
              fontSize: 8,
              color: "#5f7a94",
              letterSpacing: "0.08em",
            }}
          >
            {Math.min(...stationData.map((s) => s.distMeters))}m nearest
          </div>
        )}
      </div>

      {/* ================================================================
          STATION APPROACH EXPERIENCE
          ================================================================ */}
      {nearStation && nearestStation && (
        <>
          {/* Pulsing amber warning border */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: 20,
              border: "2px solid rgba(255, 176, 0, 0.3)",
              margin: 36,
              animation: "cockpit-amber-border 1.5s ease-in-out infinite",
            }}
          />

          {/* Station glow in center of viewport */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,176,0,0.06) 0%, transparent 70%)",
              animation: "cockpit-station-glow 2s ease-in-out infinite",
            }}
          />

          {/* Station detection panel */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, calc(-50% - 80px))",
              fontFamily: "'Courier New', monospace",
              textAlign: "center",
            }}
          >
            {/* STATION DETECTED header */}
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.25em",
                color: "#ffb000",
                textTransform: "uppercase",
                marginBottom: 4,
                animation: "cockpit-blink 1.5s ease-in-out infinite",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ffb000",
                  marginRight: 6,
                  verticalAlign: "middle",
                  animation: "cockpit-blink 0.8s ease-in-out infinite",
                }}
              />
              Station Detected
            </div>

            {/* Station name + icon */}
            <div
              style={{
                fontSize: 16,
                color: "#e8dcc8",
                marginBottom: 2,
              }}
            >
              <span style={{ marginRight: 6 }}>{nearestStation.icon}</span>
              {nearestStation.label}
            </div>

            {/* Station description */}
            <div
              style={{
                fontSize: 9,
                color: "#8a7a66",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              {nearestStation.description}
            </div>

            {/* Distance */}
            <div
              style={{
                fontSize: 10,
                color: "#ffb000",
                letterSpacing: "0.08em",
              }}
            >
              {nearestStation.distMeters}m
            </div>
          </div>

          {/* Dock prompt */}
          <div
            className="absolute"
            style={{
              bottom: 120,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#ffb000",
              textTransform: "uppercase",
              padding: "8px 20px",
              border: "1px solid rgba(255, 176, 0, 0.4)",
              borderRadius: 4,
              background: "rgba(255, 176, 0, 0.06)",
              animation: "cockpit-dock-prompt 2s ease-in-out infinite",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 9, opacity: 0.7, display: "block", marginBottom: 2 }}>
              Docking Available
            </span>
            Press ENTER to Dock
          </div>
        </>
      )}

      {/* ================================================================
          BOTTOM STATUS BAR
          ================================================================ */}
      <div
        className="absolute"
        style={{
          bottom: 4,
          left: 0,
          right: 0,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          fontFamily: "'Courier New', monospace",
          fontSize: 8,
          color: "#4a6478",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: "linear-gradient(0deg, rgba(7,14,22,0.6) 0%, transparent 100%)",
        }}
      >
        {/* Coordinates */}
        <div>
          <span style={{ color: "#5f7a94", marginRight: 3 }}>Pos</span>
          <span style={{ color: "#7ab8d6" }}>
            {Math.round(rovX)},{Math.round(rovY)}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 12, background: "rgba(80,120,160,0.15)" }} />

        {/* Depth zone */}
        <div>
          <span style={{ color: "#5f7a94", marginRight: 3 }}>Zone</span>
          <span style={{ color: depthPct > 0.6 ? "#ff6b6b" : depthPct > 0.35 ? "#ffb000" : "#7ab8d6" }}>
            {depthZone}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 12, background: "rgba(80,120,160,0.15)" }} />

        {/* Mission time */}
        <div>
          <span style={{ color: "#5f7a94", marginRight: 3 }}>Mission</span>
          <span style={{ color: "#7ab8d6" }}>{missionTime}</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 12, background: "rgba(80,120,160,0.15)" }} />

        {/* Depth */}
        <div>
          <span style={{ color: "#5f7a94", marginRight: 3 }}>Depth</span>
          <span style={{ color: "#7ab8d6" }}>{depthM}m</span>
        </div>
      </div>

      {/* ================================================================
          KEYFRAME ANIMATIONS (injected <style> tag)
          ================================================================ */}
      <style>{`
        @keyframes cockpit-scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        @keyframes cockpit-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes cockpit-caustics {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-10px, 5px) rotate(3deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes cockpit-sonar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes cockpit-sonar-sweep-bg {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes cockpit-blip-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: inherit; }
          50% { transform: translate(-50%, -50%) scale(1.6); opacity: 1; }
        }

        @keyframes cockpit-amber-border {
          0%, 100% {
            border-color: rgba(255, 176, 0, 0.15);
            box-shadow: inset 0 0 30px rgba(255, 176, 0, 0.02);
          }
          50% {
            border-color: rgba(255, 176, 0, 0.45);
            box-shadow: inset 0 0 60px rgba(255, 176, 0, 0.06);
          }
        }

        @keyframes cockpit-station-glow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.9); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes cockpit-dock-prompt {
          0%, 100% {
            border-color: rgba(255, 176, 0, 0.3);
            box-shadow: 0 0 10px rgba(255, 176, 0, 0.05);
          }
          50% {
            border-color: rgba(255, 176, 0, 0.7);
            box-shadow: 0 0 20px rgba(255, 176, 0, 0.15);
          }
        }

        @keyframes cockpit-droplet1 {
          0%, 100% { transform: translateY(0px); opacity: 1; }
          40% { transform: translateY(3px); opacity: 0.9; }
          80% { transform: translateY(8px); opacity: 0.3; }
          81% { transform: translateY(0px); opacity: 0; }
          95% { opacity: 1; }
        }

        @keyframes cockpit-droplet2 {
          0%, 100% { transform: translateY(0px); opacity: 0.8; }
          50% { transform: translateY(5px); opacity: 0.6; }
          85% { transform: translateY(12px); opacity: 0.2; }
          86% { transform: translateY(0px); opacity: 0; }
          95% { opacity: 0.8; }
        }

        @keyframes cockpit-motionblur {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }

        @keyframes cockpit-particle-0 {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
        @keyframes cockpit-particle-1 {
          0% { top: 105%; opacity: 0; transform: translateX(0px); }
          10% { opacity: 1; }
          50% { transform: translateX(20px); }
          90% { opacity: 1; }
          100% { top: -5%; opacity: 0; transform: translateX(0px); }
        }
        @keyframes cockpit-particle-2 {
          0% { top: -5%; opacity: 0; transform: translateX(0px); }
          10% { opacity: 0.7; }
          50% { transform: translateX(-15px); }
          90% { opacity: 0.7; }
          100% { top: 105%; opacity: 0; transform: translateX(0px); }
        }
        @keyframes cockpit-particle-3 {
          0% { top: 50%; left: -5%; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 60%; left: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
