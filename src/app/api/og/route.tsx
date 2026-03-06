import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0f1a",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scanline overlay effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, rgba(0, 212, 255, 0.03) 0px, rgba(0, 212, 255, 0.03) 1px, transparent 1px, transparent 3px)",
            display: "flex",
          }}
        />

        {/* Border glow */}
        <div
          style={{
            position: "absolute",
            inset: 16,
            border: "1px solid rgba(0, 212, 255, 0.3)",
            borderRadius: 4,
            display: "flex",
          }}
        />

        {/* Terminal prompt decoration */}
        <div
          style={{
            color: "rgba(0, 212, 255, 0.15)",
            fontSize: 14,
            letterSpacing: 4,
            marginBottom: 20,
            display: "flex",
          }}
        >
          {"// TEJAS OS v2.0"}
        </div>

        {/* Name */}
        <div
          style={{
            color: "#00d4ff",
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: 6,
            textShadow: "0 0 40px rgba(0, 212, 255, 0.4), 0 0 80px rgba(0, 212, 255, 0.15)",
            display: "flex",
          }}
        >
          TEJAS NALADALA
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#5f7a94",
            fontSize: 20,
            letterSpacing: 4,
            marginTop: 12,
            display: "flex",
          }}
        >
          HARDWARE ENGINEER / AI BUILDER / FOUNDER
        </div>

        {/* Terminal prompt */}
        <div
          style={{
            color: "#00ff88",
            fontSize: 16,
            letterSpacing: 2,
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#00ff88", display: "flex" }}>{">"}</span>
          <span style={{ display: "flex" }}>thesis / work / gallery / arcade / ocean_</span>
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 40,
            color: "rgba(0, 212, 255, 0.4)",
            fontSize: 14,
            letterSpacing: 3,
            display: "flex",
          }}
        >
          tejasnaladala.com
        </div>

        {/* Status indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 40,
            color: "rgba(95, 122, 148, 0.4)",
            fontSize: 12,
            letterSpacing: 2,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span style={{ display: "flex" }}>3 VENTURES / 3 PAPERS / $2M RAISED</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
