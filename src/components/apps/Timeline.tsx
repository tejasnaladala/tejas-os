"use client";

import { timeline } from "@/data/timeline";

const TYPE_COLORS: Record<string, string> = {
  venture: "text-accent-green",
  research: "text-accent-cyan",
  education: "text-accent-amber",
  project: "text-text-primary",
};

export default function Timeline({ windowId }: { windowId: string }) {
  return (
    <div className="p-4 font-mono text-sm bg-bg-surface h-full overflow-auto">
      <div className="space-y-3">
        {timeline.map((entry, i) => {
          const colorClass = TYPE_COLORS[entry.type] || "text-text-primary";
          return (
            <div key={i} className="flex items-start gap-3">
              <span className="text-text-secondary text-[10px] shrink-0 w-16 pt-0.5">
                [{entry.date}]
              </span>
              <div className="min-w-0">
                <div className={`text-xs ${colorClass}`}>{entry.title}</div>
                <div className="text-text-secondary text-[10px]">
                  {entry.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
