"use client";

import { useEffect, useRef } from "react";
import { useEasterEggStore } from "@/stores/easterEggStore";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonamiCode() {
  const progressRef = useRef(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const { founderModeActive, activateFounderMode } =
        useEasterEggStore.getState();

      // Do nothing if already in founder mode
      if (founderModeActive) return;

      const expected = KONAMI_SEQUENCE[progressRef.current];

      if (e.key === expected) {
        progressRef.current += 1;

        if (progressRef.current === KONAMI_SEQUENCE.length) {
          // Full sequence entered
          activateFounderMode();
          progressRef.current = 0;
        }
      } else {
        // Wrong key - reset progress
        progressRef.current = 0;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
