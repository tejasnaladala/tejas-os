"use client";

import { bio } from "@/data/bio";
import { timeline } from "@/data/timeline";

export default function ResearchLab() {
  return (
    <div className="space-y-6">
      {/* Pilot Profile */}
      <section>
        <h3 className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent-cyan)" }}>
          Pilot Profile
        </h3>
        <p className="font-mono text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {bio.tagline}
        </p>
        <p className="font-mono text-xs leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
          {bio.full}
        </p>
      </section>

      {/* System Info */}
      <section>
        <h3 className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent-cyan)" }}>
          System Info
        </h3>
        <div className="space-y-1.5">
          {Object.entries(bio.systemInfo)
            .filter(([key]) => key !== "activeProcesses")
            .map(([key, value]) => (
              <div key={key} className="flex gap-3 font-mono text-[11px]">
                <span className="w-24 shrink-0 tracking-wider uppercase" style={{ color: "var(--text-secondary)" }}>
                  {key}
                </span>
                <span style={{ color: "var(--text-primary)" }}>{String(value)}</span>
              </div>
            ))}
        </div>
      </section>

      {/* Active Processes */}
      <section>
        <h3 className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent-cyan)" }}>
          Active Processes
        </h3>
        <div className="space-y-1">
          {bio.systemInfo.activeProcesses.map((proc, i) => (
            <div key={i} className="font-mono text-[11px] flex items-center gap-2">
              <span style={{ color: "var(--accent-green)" }}>&#9656;</span>
              <span style={{ color: "var(--text-primary)" }}>{proc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h3 className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent-cyan)" }}>
          Mission Log
        </h3>
        <div className="space-y-3">
          {timeline.map((entry, i) => (
            <div key={i} className="flex gap-3">
              <div className="font-mono text-[10px] tabular-nums w-16 shrink-0 pt-0.5" style={{ color: "var(--text-secondary)" }}>
                {entry.date}
              </div>
              <div>
                <div className="font-mono text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {entry.title}
                </div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {entry.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
