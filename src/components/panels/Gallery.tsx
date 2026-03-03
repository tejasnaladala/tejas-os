"use client";

import { useState } from "react";

interface GalleryImage {
  src: string;
  caption: string;
}

const images: GalleryImage[] = [
  {
    src: "/gallery/headshot.jpg",
    caption: "the guy behind the submarine",
  },
  {
    src: "/gallery/showcase.jpg",
    caption: "winning the 2026 science & technology showcase at uw",
  },
  {
    src: "/gallery/welding.jpg",
    caption:
      "building plasma reactor components by hand — every founder starts somewhere",
  },
  {
    src: "/gallery/wallpaper.png",
    caption:
      "my wallpaper — so you want to be a pilot",
  },
];

export default function Gallery() {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  return (
    <div className="space-y-6">
      <h3
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: "var(--accent-cyan)" }}
      >
        Gallery
      </h3>
      <p
        className="font-mono text-xs leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        snapshots from the journey
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 20,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="rounded-sm"
            style={{
              background: "rgba(0, 212, 255, 0.03)",
              border: "1px solid rgba(0, 212, 255, 0.1)",
              overflow: "hidden",
            }}
          >
            {failedImages.has(index) ? (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  background: "rgba(10, 15, 26, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <span
                  className="font-mono text-[11px]"
                  style={{
                    color: "var(--text-secondary)",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  {image.caption}
                </span>
              </div>
            ) : (
              <img
                src={image.src}
                alt={image.caption}
                onError={() => handleImageError(index)}
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "cover",
                  aspectRatio: "16 / 9",
                }}
              />
            )}

            <div style={{ padding: "12px 14px" }}>
              <p
                className="font-mono text-[11px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {image.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* spacer */}
      <div style={{ height: 8 }} />
    </div>
  );
}
