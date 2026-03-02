"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TERMINAL_COMMANDS } from "@/data/terminalCommands";
import { useWindowStore } from "@/stores/windowStore";

interface TerminalLine {
  type: "input" | "output";
  text: string;
}

const WELCOME_MESSAGE = "TejasOS Terminal v1.0\nType 'help' for available commands.\n";

export default function Terminal({ windowId }: { windowId: string }) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      const newLines: TerminalLine[] = [
        ...lines,
        { type: "input", text: `tejas@portfolio:~$ ${trimmed}` },
      ];

      // Check for echo command
      if (trimmed.startsWith("echo ")) {
        const echoText = trimmed.slice(5);
        newLines.push({ type: "output", text: echoText });
        setLines(newLines);
        return;
      }

      // Exact match
      if (TERMINAL_COMMANDS[trimmed]) {
        const result = TERMINAL_COMMANDS[trimmed].execute();

        if (result === "__CLEAR__") {
          setLines([]);
          return;
        }

        if (result === "__EXIT__") {
          closeWindow("terminal");
          return;
        }

        newLines.push({ type: "output", text: result });
        setLines(newLines);
        return;
      }

      // Partial matching for cat commands
      if (trimmed.startsWith("cat projects/")) {
        const partial = trimmed.toLowerCase();
        const matchingKey = Object.keys(TERMINAL_COMMANDS).find(
          (key) => key.toLowerCase().startsWith(partial) || key.toLowerCase().includes(partial.replace("cat projects/", ""))
        );
        if (matchingKey) {
          const result = TERMINAL_COMMANDS[matchingKey].execute();
          newLines.push({ type: "output", text: result });
          setLines(newLines);
          return;
        }
      }

      // Unknown command
      newLines.push({
        type: "output",
        text: `${trimmed}: command not found. Type 'help' for available commands.`,
      });
      setLines(newLines);
    },
    [lines, closeWindow]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        executeCommand(input);
        setHistory((prev) => [input, ...prev]);
        setHistoryIndex(-1);
        setInput("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput("");
        }
      }
    },
    [input, history, historyIndex, executeCommand]
  );

  return (
    <div
      className="h-full bg-bg-primary font-mono text-xs cursor-text flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-3">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap break-words ${
              line.type === "input"
                ? "text-accent-green"
                : "text-text-primary"
            }`}
          >
            {line.text}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-accent-green shrink-0">tejas@portfolio:~$&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-accent-green outline-none border-none flex-1 font-mono text-xs caret-accent-green"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
