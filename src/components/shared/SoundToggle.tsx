"use client";

import { useSettingsStore } from "@/stores/settingsStore";

export default function SoundToggle() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  return (
    <button
      onClick={toggleSound}
      className="text-sm hover:text-accent-green transition-colors px-1"
      aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
      title={soundEnabled ? "Mute" : "Unmute"}
    >
      {soundEnabled ? "\ud83d\udd0a" : "\ud83d\udd07"}
    </button>
  );
}
