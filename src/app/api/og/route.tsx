import { ImageResponse } from "next/og";

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
          background: "#f5f4ef",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(10,10,10,0.10) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            display: "flex",
          }}
        />

        {/* Hairline frame */}
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "1px solid rgba(10,10,10,0.16)",
            display: "flex",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            color: "#777",
            fontSize: 14,
            letterSpacing: 6,
            marginBottom: 24,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Tejas Naladala / Profile 2026
        </div>

        {/* Name */}
        <div
          style={{
            color: "#0a0a0a",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 4,
            display: "flex",
          }}
        >
          TEJAS NALADALA
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#3a3a3a",
            fontSize: 22,
            letterSpacing: 3,
            marginTop: 16,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Hardware / AI Research / Verification
        </div>

        {/* Claude orange asterisk accent */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 100 100"
          style={{ marginTop: 40, display: "block" }}
        >
          <g transform="translate(50,50)" fill="#CC785C">
            <ellipse cx="0" cy="0" rx="6" ry="36" />
            <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(45)" />
            <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(90)" />
            <ellipse cx="0" cy="0" rx="6" ry="36" transform="rotate(135)" />
          </g>
        </svg>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 56,
            color: "#0a0a0a",
            fontSize: 14,
            letterSpacing: 3,
            display: "flex",
          }}
        >
          tejasnaladala.com
        </div>

        {/* Status */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 56,
            color: "#777",
            fontSize: 12,
            letterSpacing: 2,
            display: "flex",
          }}
        >
          AI SYSTEMS / PHYSICAL SYSTEMS / EMPIRICAL RESEARCH
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
