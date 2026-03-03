"use client";

import { useOceanStore } from "@/stores/oceanStore";

export default function ROV() {
  const rovX = useOceanStore((s) => s.rovX);
  const rovY = useOceanStore((s) => s.rovY);
  const rovVX = useOceanStore((s) => s.rovVX);
  const rovVY = useOceanStore((s) => s.rovVY);
  const facingDirection = useOceanStore((s) => s.facingDirection);
  const isBoosting = useOceanStore((s) => s.isBoosting);

  const isMoving = Math.abs(rovVX) > 1 || Math.abs(rovVY) > 1;
  const tiltAngle = isMoving
    ? Math.atan2(rovVY, Math.abs(rovVX)) * (180 / Math.PI) * 0.3
    : 0;
  const scaleX = facingDirection === "left" ? -1 : 1;

  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: rovX - 24,
        top: rovY - 12,
        transform: `scaleX(${scaleX}) rotate(${tiltAngle}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* ROV Body */}
      <div
        className="relative"
        style={{
          animation: isMoving ? "none" : "bob 3s ease-in-out infinite",
        }}
      >
        {/* Main hull */}
        <div
          className="relative"
          style={{
            width: 48,
            height: 24,
            background: "linear-gradient(180deg, #1a3a5c 0%, #0d2137 100%)",
            borderRadius: "12px 16px 8px 8px",
            border: "1px solid rgba(0, 212, 255, 0.4)",
            boxShadow: isBoosting
              ? "0 0 16px rgba(0, 212, 255, 0.6), 0 0 32px rgba(0, 212, 255, 0.3)"
              : "0 0 8px rgba(0, 212, 255, 0.2)",
          }}
        >
          {/* Viewport window */}
          <div
            className="absolute"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isBoosting ? "#00ff88" : "#00d4ff",
              top: 4,
              right: 6,
              boxShadow: `0 0 6px ${isBoosting ? "#00ff88" : "#00d4ff"}`,
            }}
          />

          {/* Propeller area */}
          <div
            className="absolute"
            style={{
              width: 6,
              height: 16,
              background: "#0d2137",
              borderRadius: "2px",
              top: 4,
              left: -4,
              border: "1px solid rgba(0, 212, 255, 0.3)",
            }}
          />

          {/* Top fin */}
          <div
            className="absolute"
            style={{
              width: 12,
              height: 6,
              background: "#1a3a5c",
              borderRadius: "4px 4px 0 0",
              top: -5,
              left: 16,
              border: "1px solid rgba(0, 212, 255, 0.3)",
              borderBottom: "none",
            }}
          />

          {/* Bottom arm */}
          <div
            className="absolute"
            style={{
              width: 8,
              height: 4,
              background: "#0d2137",
              borderRadius: "0 0 2px 2px",
              bottom: -3,
              left: 10,
              border: "1px solid rgba(0, 212, 255, 0.2)",
              borderTop: "none",
            }}
          />
        </div>

        {/* Bubble trail when moving */}
        {isMoving && (
          <div className="absolute" style={{ left: -8, top: 4 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 4 - i,
                  height: 4 - i,
                  background: "rgba(255, 255, 255, 0.15)",
                  left: -i * 6,
                  top: i * 3 - 2,
                  animation: `float-up ${2 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
