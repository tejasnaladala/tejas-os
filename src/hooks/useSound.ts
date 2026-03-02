"use client";

import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { SOUND_SPRITES, SoundName } from "@/lib/sounds";
import { useSettingsStore } from "@/stores/settingsStore";

// Build the sprite map in the format Howler expects: [start_ms, duration_ms]
const spriteMap: Record<string, [number, number]> = {};
for (const [key, value] of Object.entries(SOUND_SPRITES)) {
  spriteMap[key] = [value.start, value.duration];
}

export function useSound() {
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    try {
      howlRef.current = new Howl({
        src: ["/sounds/sprite.mp3"],
        sprite: spriteMap,
        preload: true,
        onloaderror: () => {
          // Gracefully handle missing or invalid audio file
          console.warn("TejasOS: Could not load sound sprite. Sounds disabled.");
          howlRef.current = null;
        },
      });
    } catch {
      // Gracefully handle any initialization errors
      console.warn("TejasOS: Sound system initialization failed.");
      howlRef.current = null;
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
  }, []);

  const play = useCallback((name: SoundName) => {
    try {
      const soundEnabled = useSettingsStore.getState().soundEnabled;
      if (!soundEnabled) return;
      if (!howlRef.current) return;
      howlRef.current.play(name);
    } catch {
      // Silently fail - sounds are non-critical
    }
  }, []);

  return { play };
}
