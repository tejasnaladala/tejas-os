"use client";

import { AnimatePresence } from "framer-motion";
import { WindowId } from "@/types";
import { useWindowStore } from "@/stores/windowStore";
import Window from "./Window";

import SystemInfo from "@/components/apps/SystemInfo";
import ProjectsFolder from "@/components/apps/ProjectsFolder";
import ProjectDetail from "@/components/apps/ProjectDetail";
import ResumeApp from "@/components/apps/ResumeApp";
import SkillsMap from "@/components/apps/SkillsMap";
import Timeline from "@/components/apps/Timeline";
import Achievements from "@/components/apps/Achievements";
import Terminal from "@/components/apps/Terminal";
import GameLauncher from "@/components/arcade/GameLauncher";

const WINDOW_CONTENT: Record<
  WindowId,
  React.ComponentType<{ windowId: string }>
> = {
  "system-info": SystemInfo,
  projects: ProjectsFolder,
  "project-detail": ProjectDetail,
  resume: ResumeApp,
  skills: SkillsMap,
  timeline: Timeline,
  achievements: Achievements,
  terminal: Terminal,
  arcade: GameLauncher,
  classified: GameLauncher, // Placeholder for classified content
};

export default function WindowManager() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <AnimatePresence>
      {windows
        .filter((w) => w.isOpen)
        .map((win) => {
          const ContentComponent = WINDOW_CONTENT[win.id];
          if (!ContentComponent) return null;

          return (
            <Window key={win.id} windowId={win.id}>
              <ContentComponent windowId={win.id} />
            </Window>
          );
        })}
    </AnimatePresence>
  );
}
