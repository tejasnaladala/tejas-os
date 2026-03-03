"use client";

import { useEffect, useRef } from "react";
import { useOceanStore } from "@/stores/oceanStore";
import { useSettingsStore } from "@/stores/settingsStore";

/**
 * Background music and ambient sound system.
 * Uses the Web Audio API to generate a gentle ambient ocean drone.
 * This avoids needing external audio files for the ambient background.
 */
export function useBackgroundMusic() {
  const musicPlaying = useOceanStore((s) => s.musicPlaying);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // When music is toggled on, auto-enable sound so users don't need two toggles
  useEffect(() => {
    if (musicPlaying && !soundEnabled) {
      useSettingsStore.getState().toggleSound();
    }
  }, [musicPlaying, soundEnabled]);

  // Main audio engine effect
  useEffect(() => {
    if (musicPlaying) {
      // Create or resume audio
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.value = 0;
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Create layered ambient tones
        const frequencies = [55, 82.5, 110, 165]; // Low rumble frequencies
        const oscs: OscillatorNode[] = [];

        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();

          osc.type = i < 2 ? "sine" : "triangle";
          osc.frequency.value = freq;

          // Very quiet individual gain
          oscGain.gain.value = 0.03 / (i + 1);

          // Subtle LFO for movement
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.05 + i * 0.02;
          lfoGain.gain.value = 2 + i;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });

        oscillatorsRef.current = oscs;

        // Fade in
        masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
      } else if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.linearRampToValueAtTime(
            0.08,
            audioContextRef.current.currentTime + 1
          );
        }
      }
    } else {
      // Fade out and suspend (don't destroy — we'll resume if toggled back on)
      if (audioContextRef.current && gainNodeRef.current && audioContextRef.current.state === "running") {
        const ctx = audioContextRef.current;
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        setTimeout(() => {
          if (audioContextRef.current?.state === "running") {
            audioContextRef.current.suspend();
          }
        }, 600);
      }
    }
    // NO cleanup here — we manage lifecycle via suspend/resume, not destroy/recreate
  }, [musicPlaying]);

  // Full cleanup only on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        oscillatorsRef.current.forEach((osc) => {
          try { osc.stop(); } catch { /* already stopped */ }
        });
        audioContextRef.current.close();
        audioContextRef.current = null;
        oscillatorsRef.current = [];
      }
    };
  }, []);
}
