"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PageLayout from "@/components/shared/PageLayout";

const images = [
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
      "building plasma reactor components by hand. every founder starts somewhere",
  },
  {
    src: "/gallery/wallpaper.jpg",
    caption: "my wallpaper, so you want to be a pilot",
  },
];

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  return (
    <PageLayout wide>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <p
          className="font-mono"
          style={{
            color: "var(--accent-green)",
            fontSize: "11px",
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          {"> ls gallery/"}
        </p>
        <h1
          className="font-mono"
          style={{
            color: "var(--text-primary)",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          Gallery
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            marginTop: "8px",
          }}
        >
          Moments from the journey. Newest first.
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => !failedImages.has(i) && setLightboxIndex(i)}
            style={{
              background: "rgba(0, 212, 255, 0.03)",
              border: "1px solid rgba(0, 212, 255, 0.1)",
              padding: 0,
              cursor: failedImages.has(i) ? "default" : "pointer",
              overflow: "hidden",
              textAlign: "left",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.3)";
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(0, 212, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {failedImages.has(i) ? (
              <div
                style={{
                  width: "100%",
                  minHeight: 200,
                  background: "rgba(10, 15, 26, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "11px",
                    textAlign: "center",
                  }}
                >
                  [image not found]
                </span>
              </div>
            ) : (
              <Image
                src={img.src}
                alt={img.caption}
                width={800}
                height={0}
                quality={80}
                sizes="(max-width: 768px) 100vw, 400px"
                onError={() =>
                  setFailedImages((prev) => new Set(prev).add(i))
                }
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            )}
            <div style={{ padding: "10px 14px" }}>
              <p
                className="font-mono"
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {img.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(2, 4, 8, 0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "80vh",
              cursor: "default",
            }}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].caption}
              width={1200}
              height={0}
              quality={90}
              sizes="90vw"
              style={{
                width: "auto",
                maxWidth: "90vw",
                maxHeight: "80vh",
                height: "auto",
                display: "block",
                border: "1px solid rgba(0, 212, 255, 0.15)",
              }}
            />
          </div>

          {/* Caption */}
          <p
            className="font-mono"
            style={{
              color: "var(--text-secondary)",
              fontSize: "12px",
              marginTop: "16px",
              textAlign: "center",
              maxWidth: "600px",
              padding: "0 24px",
            }}
          >
            {images[lightboxIndex].caption}
          </p>

          {/* Nav arrows */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "24px",
              transform: "translateY(-50%)",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="font-mono"
              style={{
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(0, 212, 255, 0.2)",
                color: "var(--accent-cyan)",
                fontSize: "20px",
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              {"‹"}
            </button>
          </div>
          <div
            style={{
              position: "fixed",
              top: "50%",
              right: "24px",
              transform: "translateY(-50%)",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="font-mono"
              style={{
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(0, 212, 255, 0.2)",
                color: "var(--accent-cyan)",
                fontSize: "20px",
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              {"›"}
            </button>
          </div>

          {/* Close hint */}
          <p
            className="font-mono"
            style={{
              position: "fixed",
              top: "20px",
              right: "24px",
              color: "var(--text-secondary)",
              fontSize: "10px",
              letterSpacing: "2px",
            }}
          >
            ESC TO CLOSE
          </p>
        </div>
      )}
    </PageLayout>
  );
}
