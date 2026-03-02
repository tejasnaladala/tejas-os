"use client";

export default function GameLauncher({ windowId }: { windowId: string }) {
  return (
    <div className="p-4 font-mono text-sm">
      <h2 className="text-accent-green text-lg mb-4">{"\ud83d\udd79\ufe0f"} ARCADE</h2>
      <p className="text-text-secondary">Games loading... Check back after system update.</p>
    </div>
  );
}
