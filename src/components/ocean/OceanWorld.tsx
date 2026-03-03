"use client";

import { useROVControls } from "@/hooks/useROVControls";
import { useCamera } from "@/hooks/useCamera";
import { OCEAN_CONFIG, STATIONS } from "@/lib/constants";
import ROV from "./ROV";
import DepthGradient from "./DepthGradient";
import Station from "./Station";
import Bubbles from "./Bubbles";
import SeaCreatures from "./SeaCreatures";
import LightRays from "./LightRays";
import Seafloor from "./Seafloor";

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
        {/* Ambient effects (back layer) */}
        <LightRays />
        <Bubbles />
        <SeaCreatures />
        <Seafloor />

        {/* Stations */}
        {STATIONS.map((station) => (
          <Station key={station.id} station={station} />
        ))}

        {/* ROV player (rendered on top) */}
        <ROV />
      </div>
    </div>
  );
}
