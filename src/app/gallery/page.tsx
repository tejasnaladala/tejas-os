"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import PageLayout from "@/components/shared/PageLayout";

const images = [
  { src: "/gallery/headshot.jpg", caption: "the guy behind the submarine" },
  { src: "/gallery/showcase.jpg", caption: "winning the 2026 science & technology showcase at uw" },
  { src: "/gallery/welding.jpg", caption: "building plasma reactor components by hand. every founder starts somewhere" },
  { src: "/gallery/wallpaper.jpg", caption: "my wallpaper. so you want to be a pilot" },
];

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
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
      <header className="page-header">
        <p className="eyebrow">Gallery</p>
        <h1 className="display">
          Moments<br /><em>from the journey.</em>
        </h1>
        <p className="body-lg">Newest first.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => !failedImages.has(i) && setLightboxIndex(i)}
            className="editorial-card overflow-hidden p-0 text-left transition-transform hover:-translate-y-[2px]"
            style={{ cursor: failedImages.has(i) ? "default" : "pointer" }}
          >
            {failedImages.has(i) ? (
              <div
                className="flex min-h-[260px] items-center justify-center p-8"
                style={{ background: "var(--bg)" }}
              >
                <span className="body-sm">[ image not found ]</span>
              </div>
            ) : (
              <Image
                src={img.src}
                alt={img.caption}
                width={800}
                height={0}
                quality={85}
                sizes="(max-width: 768px) 100vw, 600px"
                onError={() => setFailedImages((prev) => new Set(prev).add(i))}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
            <div style={{ padding: "20px 24px" }}>
              <p
                className="body-sm"
                style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.55 }}
              >
                {img.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center"
          style={{ background: "rgba(10, 10, 10, 0.96)", backdropFilter: "blur(16px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative cursor-default"
            style={{ maxWidth: "90vw", maxHeight: "82vh" }}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].caption}
              width={1400}
              height={0}
              quality={92}
              sizes="90vw"
              style={{
                width: "auto",
                maxWidth: "90vw",
                maxHeight: "82vh",
                height: "auto",
                display: "block",
                borderRadius: "var(--radius-md)",
              }}
            />
          </div>

          <p className="body-sm mt-6 max-w-[600px] px-6 text-center">
            {images[lightboxIndex].caption}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="btn-secondary fixed left-6 top-1/2 -translate-y-1/2"
            aria-label="Previous"
          >
            Prev
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="btn-secondary fixed right-6 top-1/2 -translate-y-1/2"
            aria-label="Next"
          >
            Next
          </button>

          <p
            className="body-sm fixed right-6 top-6"
            style={{ color: "var(--text-muted)" }}
          >
            ESC to close
          </p>
        </div>
      )}
    </PageLayout>
  );
}
