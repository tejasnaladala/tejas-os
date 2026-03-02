"use client";

export default function CrtOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none crt-scanlines crt-vignette"
      style={{ zIndex: 9990 }}
    />
  );
}
