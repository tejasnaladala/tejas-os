export interface Project {
  id: string;
  filename: string;
  extension: string;
  title: string;
  role: string;
  date: string;
  category: "venture" | "research" | "open-source" | "competition" | "industry";
  summary: string;
  description: string;
  metrics: string[];
  tech: string[];
  links?: { label: string; url: string }[];
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  citations?: number;
  doi?: string;
  status?: string;
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
