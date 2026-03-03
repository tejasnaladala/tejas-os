"use client";

import { useMemo } from "react";
import { useOceanStore } from "@/stores/oceanStore";

/**
 * Returns the CSS transform string to position the world div
 * so the ROV appears centered on screen.
 *
 * The world is a large div (5000x3500). The camera works by
 * translating the world opposite to the ROV position, centering it.
 */
export function useCamera(): string {
  const rovX = useOceanStore((s) => s.rovX);
  const rovY = useOceanStore((s) => s.rovY);

  const transform = useMemo(() => {
    // Center ROV on screen: translate world by -(rovX - 50vw, rovY - 50vh)
    // Using calc() to mix px and viewport units
    return `translate(calc(50vw - ${rovX}px), calc(50vh - ${rovY}px))`;
  }, [rovX, rovY]);

  return transform;
}
