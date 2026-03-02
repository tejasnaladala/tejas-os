export type WindowId =
  | "projects"
  | "resume"
  | "system-info"
  | "skills"
  | "arcade"
  | "project-detail"
  | "terminal"
  | "achievements"
  | "timeline"
  | "classified";

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  meta?: Record<string, unknown>;
}

export interface DesktopIconConfig {
  id: WindowId | "mail";
  label: string;
  icon: string;
  action: "window" | "mailto";
}

export type BootPhase = "idle" | "power-on" | "bios-post" | "loading-desktop" | "ready";

export interface Project {
  id: string;
  filename: string;
  extension: string;
  title: string;
  role: string;
  date: string;
  description: string;
  metrics: string[];
  tech: string[];
  links?: { label: string; url: string }[];
}

export interface Skill {
  name: string;
  level: "Expert" | "Advanced" | "Proficient" | "Capable";
  barFill: number;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  type: "venture" | "research" | "education" | "project";
}

export interface TerminalCommand {
  command: string;
  description: string;
  execute: () => string;
}

export type WallpaperOption = "default" | "circuit" | "matrix";
