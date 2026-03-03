"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import OceanWorld from "@/components/ocean/OceanWorld";
import HUD from "@/components/hud/HUD";
import MiniMap from "@/components/hud/MiniMap";
import DiscoveryLog from "@/components/hud/DiscoveryLog";
import NavBar from "@/components/hud/NavBar";
import Tutorial from "@/components/hud/Tutorial";
import ContentPanel from "@/components/panels/ContentPanel";
import MobileOcean from "@/components/mobile/MobileOcean";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    return <MobileOcean />;
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <OceanWorld />

      {/* HUD overlays (fixed position) */}
      <HUD />
      <MiniMap />
      <DiscoveryLog />
      <NavBar />
      <Tutorial />

      {/* Content panel (slide-in from right) */}
      <ContentPanel />
    </main>
  );
}
