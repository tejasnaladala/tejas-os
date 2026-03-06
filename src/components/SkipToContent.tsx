"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
      onFocus={(e) => {
        Object.assign(e.currentTarget.style, {
          position: "fixed",
          width: "auto",
          height: "auto",
          padding: "8px 16px",
          margin: 0,
          overflow: "visible",
          clip: "auto",
          whiteSpace: "normal",
          top: "16px",
          left: "16px",
          zIndex: 999,
          background: "var(--accent-cyan)",
          color: "#0a0f1a",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          borderRadius: "4px",
        });
      }}
      onBlur={(e) => {
        Object.assign(e.currentTarget.style, {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
        });
      }}
    >
      Skip to content
    </a>
  );
}
