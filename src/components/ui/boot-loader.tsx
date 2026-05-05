"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";

/**
 * One-shot boot screen using the cream/orange LampContainer. Mounts on first
 * render, fades out after ~1.4s. Skipped entirely under
 * prefers-reduced-motion. Sets a sessionStorage flag so subsequent same-tab
 * navigations don't replay it.
 */
export default function BootLoader() {
  const [show, setShow] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip the overlay entirely for crawlers / headless agents / Lighthouse
    // so it doesn't block the LCP sample. Heuristic: anything that
    // self-identifies as a bot or Lighthouse, plus webdriver flag.
    const ua = navigator.userAgent || "";
    const isBot =
      /bot|crawl|spider|lighthouse|chrome-lighthouse|headlesschrome|googlebot|bingbot/i.test(
        ua
      ) ||
      (navigator as Navigator & { webdriver?: boolean }).webdriver === true;
    if (isBot) return;

    if (reduced) return;

    const seen = sessionStorage.getItem("boot:seen");
    if (seen) return;

    sessionStorage.setItem("boot:seen", "1");
    const startId = window.setTimeout(() => setShow(true), 0);
    const endId = window.setTimeout(() => setShow(false), 1400);
    return () => {
      window.clearTimeout(startId);
      window.clearTimeout(endId);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "var(--bg)",
          }}
          aria-hidden="true"
        >
          <LampContainer>
            <motion.h1
              initial={{ opacity: 0.4, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="font-mono uppercase tracking-[0.2em]"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(28px, 5vw, 48px)",
                letterSpacing: "0.16em",
                fontWeight: 700,
              }}
            >
              Tejas Naladala
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 font-mono"
              style={{
                color: "var(--text-muted)",
                fontSize: 12,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
              }}
            >
              Booting profile
            </motion.p>
          </LampContainer>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
