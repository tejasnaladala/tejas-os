"use client";

import { achievements } from "@/data/achievements";

export default function Achievements({ windowId }: { windowId: string }) {
  return (
    <div className="p-4 font-mono text-sm bg-bg-surface h-full overflow-auto">
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((ach) => (
          <div
            key={ach.title}
            className={`border rounded-sm p-3 transition-colors
              ${
                ach.unlocked
                  ? "border-accent-green/30 bg-bg-elevated shadow-[0_0_8px_rgba(0,255,65,0.1)]"
                  : "border-border bg-bg-primary opacity-50"
              }`}
          >
            <div className="text-xl mb-1">{ach.icon}</div>
            <div className="text-text-primary text-xs font-bold">{ach.title}</div>
            <div className="text-text-secondary text-[10px] mt-0.5">
              {ach.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
