"use client";

import { useEffect } from "react";
import BootScreen from "@/components/boot/BootScreen";
import Desktop from "@/components/desktop/Desktop";
import Taskbar from "@/components/desktop/Taskbar";
import WindowManager from "@/components/windows/WindowManager";
import CrtOverlay from "@/components/shared/CrtOverlay";
import { useBootStore } from "@/stores/bootStore";
import { useSettingsStore } from "@/stores/settingsStore";

export default function Home() {
  const phase = useBootStore((s) => s.phase);

  // Hydrate sound setting from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("tejas-os-sound");
    if (stored === "true") {
      const current = useSettingsStore.getState().soundEnabled;
      if (!current) {
        useSettingsStore.getState().toggleSound();
      }
    }
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg-primary">
      <BootScreen />
      {phase === "ready" && (
        <>
          <Desktop />
          <WindowManager />
          <Taskbar />
          <CrtOverlay />
        </>
      )}
    </main>
  );
}
