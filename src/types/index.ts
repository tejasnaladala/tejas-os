export type StationId = "research" | "salvage" | "systems" | "arcade" | "comms" | "gallery" | "trench";

export interface StationConfig {
  id: StationId;
  label: string;
  icon: string;
  position: { x: number; y: number };
  description: string;
}

export interface ROVState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  isBoosting: boolean;
  facingDirection: "left" | "right";
}

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
