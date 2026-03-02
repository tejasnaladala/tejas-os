"use client";

import { useState } from "react";
import { skillCategories } from "@/data/skills";

export default function SkillsMap({ windowId }: { windowId: string }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    skillCategories.forEach((cat) => {
      initial[cat.name] = true;
    });
    return initial;
  });

  const toggleCategory = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="p-4 font-mono text-sm bg-bg-surface h-full overflow-auto">
      <div className="space-y-2">
        {skillCategories.map((category) => {
          const isExpanded = expanded[category.name];
          return (
            <div key={category.name} className="border border-border rounded-sm">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-left
                  hover:bg-bg-elevated transition-colors"
                onClick={() => toggleCategory(category.name)}
              >
                <span className="text-accent-green text-xs">
                  {isExpanded ? "\u25bc" : "\u25b8"}
                </span>
                <span className="text-text-primary text-xs">{category.name}</span>
                <span className="text-text-secondary text-[10px] ml-auto">
                  {category.skills.length} items
                </span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-2 space-y-1">
                  {category.skills.map((skill) => {
                    const filled = skill.barFill;
                    const empty = 12 - filled;
                    const bar =
                      "\u2588".repeat(filled) + "\u2591".repeat(empty);

                    return (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 pl-4"
                      >
                        <span className="text-text-primary text-[10px] w-44 shrink-0 truncate">
                          {skill.name}
                        </span>
                        <span className="text-accent-green text-[10px] font-mono tracking-tight">
                          {bar}
                        </span>
                        <span className="text-text-secondary text-[9px] shrink-0">
                          {skill.level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
