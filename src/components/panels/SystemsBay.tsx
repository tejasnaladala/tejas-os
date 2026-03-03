"use client";

import { skillCategories } from "@/data/skills";

export default function SystemsBay() {
  return (
    <div className="space-y-6">
      <h3 className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent-cyan)" }}>
        Subsystem Diagnostics
      </h3>

      {skillCategories.map((category) => (
        <div key={category.name}>
          <h4 className="font-mono text-[11px] font-bold tracking-wider uppercase mb-3" style={{ color: "var(--text-primary)" }}>
            {category.name}
          </h4>
          <div className="space-y-2">
            {category.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-primary)" }}>
                    {skill.name}
                  </span>
                  <span className="font-mono text-[9px] tracking-wider uppercase" style={{ color: "var(--text-secondary)" }}>
                    {skill.level}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0, 212, 255, 0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(skill.barFill / 12) * 100}%`,
                      background: skill.barFill >= 12
                        ? "var(--accent-cyan)"
                        : skill.barFill >= 10
                          ? "var(--accent-green)"
                          : skill.barFill >= 8
                            ? "var(--accent-amber)"
                            : "var(--text-secondary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
