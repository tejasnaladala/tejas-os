"use client";

import { useRef, useCallback } from "react";
import { projects } from "@/data/projects";
import { useWindowStore } from "@/stores/windowStore";

const EXTENSION_ICONS: Record<string, string> = {
  sys: "\u2699\ufe0f",
  hw: "\ud83d\udd0c",
  exe: "\ud83d\udcbb",
  pkg: "\ud83d\udce6",
  log: "\ud83d\udccb",
  dat: "\ud83d\udcca",
};

export default function ProjectsFolder({ windowId }: { windowId: string }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const lastClickTimes = useRef<Record<string, number>>({});

  const handleClick = useCallback(
    (projectId: string) => {
      const now = Date.now();
      const lastClick = lastClickTimes.current[projectId] || 0;
      if (now - lastClick < 400) {
        openWindow("project-detail", { projectId });
        lastClickTimes.current[projectId] = 0;
      } else {
        lastClickTimes.current[projectId] = now;
      }
    },
    [openWindow]
  );

  return (
    <div className="p-4 font-mono text-sm bg-bg-surface h-full overflow-auto">
      <div className="grid grid-cols-1 gap-1">
        {projects.map((project) => {
          const icon = EXTENSION_ICONS[project.extension] || "\ud83d\udcc4";
          return (
            <button
              key={project.id}
              className="flex items-center gap-3 px-3 py-2 rounded-sm
                hover:bg-accent-green/10 transition-colors text-left w-full
                cursor-pointer select-none"
              onClick={() => handleClick(project.id)}
            >
              <span className="text-lg shrink-0">{icon}</span>
              <div className="min-w-0">
                <div className="text-text-primary text-xs truncate">
                  {project.filename}.{project.extension}
                </div>
                <div className="text-text-secondary text-[10px] truncate">
                  {project.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
