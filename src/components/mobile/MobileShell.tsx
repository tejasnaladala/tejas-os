"use client";

import { useState } from "react";
import MobileNav, { MobileTab } from "./MobileNav";
import SystemInfo from "@/components/apps/SystemInfo";
import ProjectsFolder from "@/components/apps/ProjectsFolder";
import ProjectDetail from "@/components/apps/ProjectDetail";
import ResumeApp from "@/components/apps/ResumeApp";
import GameLauncher from "@/components/arcade/GameLauncher";
import { useSettingsStore } from "@/stores/settingsStore";
import { SITE_CONFIG } from "@/lib/constants";
import { projects } from "@/data/projects";

function ContactPanel() {
  return (
    <div className="p-4 font-mono text-sm">
      <div className="border border-border rounded-sm p-4 mb-4">
        <h3 className="text-accent-green text-base mb-3">Get In Touch</h3>
        <p className="text-text-secondary text-xs mb-4">
          Interested in working together, investing, or just want to chat about
          plasma reactors and underwater robots?
        </p>
        <a
          href={`mailto:${SITE_CONFIG.email}`}
          className="block w-full text-center px-4 py-3 bg-accent-green/10 border border-accent-green/30 rounded-sm text-accent-green text-sm hover:bg-accent-green/20 transition-colors"
        >
          {SITE_CONFIG.email}
        </a>
      </div>

      <div className="border border-border rounded-sm p-4">
        <h3 className="text-text-secondary text-xs uppercase tracking-wider mb-3">
          Links
        </h3>
        <div className="flex flex-col gap-2">
          <a
            href={SITE_CONFIG.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent-cyan text-xs hover:underline"
          >
            <span>GitHub</span>
            <span className="text-text-secondary">&rarr;</span>
          </a>
          <a
            href={SITE_CONFIG.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent-cyan text-xs hover:underline"
          >
            <span>LinkedIn</span>
            <span className="text-text-secondary">&rarr;</span>
          </a>
          <a
            href={SITE_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent-cyan text-xs hover:underline"
          >
            <span>Instagram</span>
            <span className="text-text-secondary">&rarr;</span>
          </a>
          <a
            href="/resume"
            className="flex items-center gap-2 text-accent-amber text-xs hover:underline"
          >
            <span>Clean Resume View</span>
            <span className="text-text-secondary">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function MobileProjectsView() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (selectedProjectId) {
    const project = projects.find((p) => p.id === selectedProjectId);
    if (!project) {
      setSelectedProjectId(null);
      return null;
    }
    return (
      <div className="h-full flex flex-col">
        <button
          onClick={() => setSelectedProjectId(null)}
          className="shrink-0 px-4 py-2 border-b border-border bg-bg-elevated text-accent-green font-mono text-xs text-left"
        >
          &larr; Back to Projects
        </button>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
          <div className="mb-4">
            <h2 className="text-accent-green text-base mb-1">{project.title}</h2>
            <div className="text-text-secondary text-xs">
              <span>{project.role}</span>
              <span className="mx-2">|</span>
              <span>{project.date}</span>
            </div>
          </div>
          <div className="border border-border rounded-sm p-3 mb-4">
            <p className="text-text-primary text-xs leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-text-secondary text-[10px] uppercase tracking-wider mb-2">
              Key Metrics
            </h3>
            <ul className="space-y-1">
              {project.metrics.map((metric, i) => (
                <li key={i} className="text-text-primary text-xs flex items-start gap-2">
                  <span className="text-accent-green shrink-0">{"\u2022"}</span>
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-text-secondary text-[10px] uppercase tracking-wider mb-2">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-bg-elevated border border-border rounded-sm text-[10px] text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          {project.links && project.links.length > 0 && (
            <div>
              <h3 className="text-text-secondary text-[10px] uppercase tracking-wider mb-2">
                Links
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-cyan text-xs hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 font-mono text-sm">
      <div className="grid grid-cols-1 gap-1">
        {projects.map((project) => {
          const extIcons: Record<string, string> = {
            sys: "\u2699\uFE0F",
            hw: "\u{1F50C}",
            exe: "\u{1F4BB}",
            pkg: "\u{1F4E6}",
            log: "\u{1F4CB}",
            dat: "\u{1F4CA}",
          };
          const icon = extIcons[project.extension] || "\u{1F4C4}";
          return (
            <button
              key={project.id}
              className="flex items-center gap-3 px-3 py-3 rounded-sm hover:bg-accent-green/10 transition-colors text-left w-full"
              onClick={() => setSelectedProjectId(project.id)}
            >
              <span className="text-lg shrink-0">{icon}</span>
              <div className="min-w-0">
                <div className="text-text-primary text-xs truncate">
                  {project.filename}.{project.extension}
                </div>
                <div className="text-text-secondary text-[10px] truncate">
                  {project.title} &mdash; {project.role}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MobileShell() {
  const [activeTab, setActiveTab] = useState<MobileTab>("about");
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <SystemInfo windowId="system-info" />;
      case "projects":
        return <MobileProjectsView />;
      case "resume":
        return <ResumeApp windowId="resume" />;
      case "games":
        return <GameLauncher windowId="arcade" />;
      case "contact":
        return <ContactPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-bg-primary">
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-bg-elevated px-4">
        <h1 className="font-mono text-sm font-bold tracking-widest text-accent-green">
          TejasOS
        </h1>
        <button
          onClick={toggleSound}
          className="font-mono text-lg transition-opacity hover:opacity-80"
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? "\u{1F50A}" : "\u{1F507}"}
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-14">{renderContent()}</div>

      {/* Bottom Nav */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
