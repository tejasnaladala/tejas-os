"use client";

import { useState, useRef, useEffect } from "react";
import { achievements } from "@/data/achievements";
import { TERMINAL_COMMANDS } from "@/data/terminalCommands";

function Terminal() {
  const [history, setHistory] = useState<{ input: string; output: string }[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = currentInput.trim();
    if (!input) return;

    let output: string;

    if (input === "clear") {
      setHistory([]);
      setCurrentInput("");
      return;
    }

    // Check for echo command
    if (input.startsWith("echo ")) {
      output = input.slice(5);
    } else if (TERMINAL_COMMANDS[input]) {
      output = TERMINAL_COMMANDS[input].execute();
    } else {
      output = `command not found: ${input}. Type 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, { input, output }]);
    setCurrentInput("");
  };

  return (
    <div
      ref={scrollRef}
      className="h-64 overflow-y-auto rounded-sm p-3 font-mono text-[11px]"
      style={{
        background: "rgba(2, 4, 8, 0.8)",
        border: "1px solid rgba(0, 212, 255, 0.1)",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div style={{ color: "var(--text-secondary)" }}>
        TejasOS Terminal v1.0 - Type &apos;help&apos; for commands
      </div>
      <div className="mt-2 space-y-1">
        {history.map((h, i) => (
          <div key={i}>
            <div>
              <span style={{ color: "var(--accent-green)" }}>tejas@rov</span>
              <span style={{ color: "var(--text-secondary)" }}>:</span>
              <span style={{ color: "var(--accent-cyan)" }}>~</span>
              <span style={{ color: "var(--text-secondary)" }}>$ </span>
              <span style={{ color: "var(--text-primary)" }}>{h.input}</span>
            </div>
            <div className="whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
              {h.output}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-1">
        <span style={{ color: "var(--accent-green)" }}>tejas@rov</span>
        <span style={{ color: "var(--text-secondary)" }}>:</span>
        <span style={{ color: "var(--accent-cyan)" }}>~</span>
        <span style={{ color: "var(--text-secondary)" }}>$ </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          className="flex-1 bg-transparent outline-none font-mono text-[11px] ml-1"
          style={{ color: "var(--text-primary)", border: "none" }}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}

export default function TheTrench() {
  return (
    <div className="space-y-6">
      <h3 className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent-red)" }}>
        Classified Zone
      </h3>

      {/* Achievements */}
      <section>
        <h4 className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "var(--accent-cyan)" }}>
          Achievements Unlocked
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((a) => (
            <div
              key={a.title}
              className="p-2.5 rounded-sm"
              style={{
                background: "rgba(0, 212, 255, 0.03)",
                border: "1px solid rgba(0, 212, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{a.icon}</span>
                <span className="font-mono text-[10px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {a.title}
                </span>
              </div>
              <p className="font-mono text-[9px]" style={{ color: "var(--text-secondary)" }}>
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal */}
      <section>
        <h4 className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "var(--accent-cyan)" }}>
          Terminal Access
        </h4>
        <Terminal />
      </section>
    </div>
  );
}
