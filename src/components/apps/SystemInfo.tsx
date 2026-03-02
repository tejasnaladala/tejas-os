"use client";

import { useState, useCallback } from "react";
import { bio } from "@/data/bio";
import { useEasterEggStore } from "@/stores/easterEggStore";

const ASCII_CIRCUIT = `
    ┌─────────┐   ┌──────────┐
    │  CPU     │───│  MEMORY  │
    │  3.93GHz │   │  16GB    │
    └────┬────┘   └─────┬────┘
         │              │
    ═════╪══════════════╪═════
         │              │
    ┌────┴────┐   ┌─────┴────┐
    │  GPU    │   │  PLASMA  │
    │  RTX    │   │  REACTOR │
    └─────────┘   └──────────┘

    >> SCHEMATIC UNLOCKED <<
`;

export default function SystemInfo({ windowId }: { windowId: string }) {
  const [processorClicks, setProcessorClicks] = useState(0);
  const schematicRevealed = useEasterEggStore((s) => s.schematicRevealed);
  const revealSchematic = useEasterEggStore((s) => s.revealSchematic);

  const info = bio.systemInfo;

  const handleProcessorClick = useCallback(() => {
    const next = processorClicks + 1;
    setProcessorClicks(next);
    if (next >= 5 && !schematicRevealed) {
      revealSchematic();
    }
  }, [processorClicks, schematicRevealed, revealSchematic]);

  const rows = [
    { label: "OS", value: info.os },
    { label: "Build", value: info.build },
    { label: "User", value: info.user },
    { label: "Location", value: info.location },
    { label: "Processor", value: info.processor, clickable: true },
    { label: "Status", value: info.status },
    { label: "Uptime", value: info.uptime },
  ];

  return (
    <div className="p-4 font-mono text-sm bg-bg-surface h-full overflow-auto">
      <div className="border border-border rounded-sm p-3 mb-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex py-0.5 ${
              row.clickable
                ? "cursor-pointer hover:text-accent-green transition-colors"
                : ""
            }`}
            onClick={row.clickable ? handleProcessorClick : undefined}
          >
            <span className="text-text-secondary w-24 shrink-0">{row.label}:</span>
            <span className="text-text-primary">{row.value}</span>
          </div>
        ))}

        <div className="mt-3 pt-2 border-t border-border">
          <div className="text-text-secondary mb-1">Active Processes:</div>
          {info.activeProcesses.map((proc, i) => (
            <div key={proc} className="text-text-primary pl-2">
              <span className="text-text-secondary">
                {i < info.activeProcesses.length - 1 ? " \u251c\u2500 " : " \u2514\u2500 "}
              </span>
              {proc}
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-border flex">
          <span className="text-text-secondary w-24 shrink-0">Languages:</span>
          <span className="text-text-primary">{info.languages}</span>
        </div>
      </div>

      {/* Bio section */}
      <div className="border border-border rounded-sm p-3 mb-4">
        <p className="text-accent-green text-xs mb-2">{bio.tagline}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{bio.full}</p>
      </div>

      {/* Easter egg: circuit schematic */}
      {schematicRevealed && (
        <div className="border border-accent-green/30 rounded-sm p-3 bg-bg-primary">
          <pre className="text-accent-green text-[10px] leading-tight">{ASCII_CIRCUIT}</pre>
        </div>
      )}
    </div>
  );
}
