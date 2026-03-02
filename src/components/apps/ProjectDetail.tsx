"use client";

import { projects } from "@/data/projects";
import { useWindowStore } from "@/stores/windowStore";

export default function ProjectDetail({ windowId }: { windowId: string }) {
  const windowState = useWindowStore((s) =>
    s.windows.find((w) => w.id === windowId)
  );
  const projectId = windowState?.meta?.projectId as string | undefined;
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="p-4 font-mono text-sm bg-bg-surface h-full">
        <p className="text-text-secondary">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 font-mono text-sm bg-bg-surface h-full overflow-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-accent-green text-base mb-1">{project.title}</h2>
        <div className="text-text-secondary text-xs">
          <span>{project.role}</span>
          <span className="mx-2">|</span>
          <span>{project.date}</span>
        </div>
      </div>

      {/* Description */}
      <div className="border border-border rounded-sm p-3 mb-4">
        <p className="text-text-primary text-xs leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Metrics */}
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

      {/* Tech Tags */}
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

      {/* Links */}
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
  );
}
