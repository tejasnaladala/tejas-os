"use client";

import { useROVControls } from "@/hooks/useROVControls";
import { useCamera } from "@/hooks/useCamera";
import { OCEAN_CONFIG } from "@/lib/constants";
import ROV from "./ROV";
import DepthGradient from "./DepthGradient";

export default function OceanWorld() {
  useROVControls();
  const transform = useCamera();

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Fixed depth gradient background */}
      <DepthGradient />

      {/* Scrollable world container */}
      <div
        className="absolute will-change-transform"
        style={{
          width: OCEAN_CONFIG.worldWidth,
          height: OCEAN_CONFIG.worldHeight,
          transform,
        }}
      >
        {/* ROV player */}
        <ROV />

        {/* Stations, effects, etc. will be added in later tasks */}
      </div>
    </div>
  );
}
