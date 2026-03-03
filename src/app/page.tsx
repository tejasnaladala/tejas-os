"use client";

import OceanWorld from "@/components/ocean/OceanWorld";
import HUD from "@/components/hud/HUD";
import MiniMap from "@/components/hud/MiniMap";
import DiscoveryLog from "@/components/hud/DiscoveryLog";
import NavBar from "@/components/hud/NavBar";
import Tutorial from "@/components/hud/Tutorial";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <OceanWorld />

      {/* HUD overlays (fixed position) */}
      <HUD />
      <MiniMap />
      <DiscoveryLog />
      <NavBar />
      <Tutorial />
    </main>
  );
}
