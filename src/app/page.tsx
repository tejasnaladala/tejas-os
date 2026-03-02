"use client";

import BootScreen from "@/components/boot/BootScreen";
import { useBootStore } from "@/stores/bootStore";

export default function Home() {
  const phase = useBootStore((s) => s.phase);

  return (
    <main className="h-screen w-screen overflow-hidden bg-bg-primary">
      <BootScreen />
      {phase === "ready" && (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-accent-green glow-green font-mono">
            Desktop loading...
          </p>
        </div>
      )}
    </main>
  );
}
