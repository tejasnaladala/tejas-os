import { ImageResponse } from "next/og";

// 32x32 favicon: black square with mono "T" mark + small Claude-orange asterisk dot
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            color: "#f5f4ef",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.05em",
          }}
        >
          T
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#CC785C",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
