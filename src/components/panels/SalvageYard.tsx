"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { Project } from "@/types";

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  return (
    <button
      onClick={() => onSelect(project)}
      className="w-full text-left p-4 rounded-sm transition-all duration-200"
      style={{
        background: "rgba(0, 212, 255, 0.03)",
        border: "1px solid rgba(0, 212, 255, 0.1)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0, 212, 255, 0.3)";
        (e.currentTarget as HTMLElement).style.background = "rgba(0, 212, 255, 0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0, 212, 255, 0.1)";
        (e.currentTarget as HTMLElement).style.background = "rgba(0, 212, 255, 0.03)";
      }}
    >
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-mono text-xs font-bold" style={{ color: "var(--accent-cyan)" }}>
          {project.filename}.{project.extension}
        </span>
        <span className="font-mono text-[10px]" style={{ color: "var(--text-secondary)" }}>
          {project.date}
        </span>
      </div>
      <div className="font-mono text-[11px]" style={{ color: "var(--text-primary)" }}>
        {project.title} - {project.role}
      </div>
    </button>
  );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="font-mono text-[11px] tracking-wider uppercase"
        style={{ color: "var(--accent-cyan)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        &larr; Back to Artifacts
      </button>

      <div>
        <h3 className="font-mono text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          {project.title}
        </h3>
        <p className="font-mono text-[11px] mt-1" style={{ color: "var(--accent-cyan)" }}>
          {project.role} &middot; {project.date}
        </p>
      </div>

      <p className="font-mono text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {project.description}
      </p>

      <div>
        <h4 className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--accent-cyan)" }}>
          Key Metrics
        </h4>
        <div className="space-y-1.5">
          {project.metrics.map((m, i) => (
            <div key={i} className="font-mono text-[11px] flex items-start gap-2">
              <span style={{ color: "var(--accent-green)" }}>&#9656;</span>
              <span style={{ color: "var(--text-primary)" }}>{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--accent-cyan)" }}>
          Tech Stack
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] px-2 py-0.5 rounded-sm"
              style={{
                background: "rgba(0, 212, 255, 0.08)",
                color: "var(--text-primary)",
                border: "1px solid rgba(0, 212, 255, 0.15)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {project.links && project.links.length > 0 && (
        <div>
          <h4 className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--accent-cyan)" }}>
            Links
          </h4>
          <div className="space-y-1">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] block underline"
                style={{ color: "var(--accent-cyan)" }}
              >
                {link.label} &rarr;
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SalvageYard() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "var(--accent-cyan)" }}>
        Recovered Artifacts
      </h3>
      <p className="font-mono text-[10px]" style={{ color: "var(--text-secondary)" }}>
        Select an artifact to inspect details
      </p>
      <div className="space-y-2">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onSelect={setSelectedProject} />
        ))}
      </div>
    </div>
  );
}
