import { bio } from "./bio";
import { projects } from "./projects";

export const TERMINAL_COMMANDS: Record<string, { description: string; execute: () => string }> = {
  help: {
    description: "List available commands",
    execute: () => {
      const cmds = Object.entries(TERMINAL_COMMANDS)
        .map(([cmd, { description }]) => `  ${cmd.padEnd(20)} ${description}`)
        .join("\n");
      return `Available commands:\n${cmds}`;
    },
  },
  whoami: {
    description: "Display current user",
    execute: () => "tejas \u2014 founder, engineer, builder of things",
  },
  ls: {
    description: "List directory contents",
    execute: () =>
      [
        "PlasmaX.sys",
        "CeruleanROV.hw",
        "AtticusAI.exe",
        "Forge.pkg",
        "SEAL_Lab.log",
        "NIIST_Solar.dat",
        "resume.pdf",
        "README.md",
      ].join("  "),
  },
  pwd: {
    description: "Print working directory",
    execute: () => "/home/tejas/portfolio",
  },
  neofetch: {
    description: "Display system information",
    execute: () => `
  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557     OS:        ${bio.systemInfo.os}
  \u255a\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255d\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d     Build:     ${bio.systemInfo.build}
     \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2557       User:      ${bio.systemInfo.user}
     \u2588\u2588\u2551   \u2588\u2588\u2554\u2550\u2550\u255d       Location:  ${bio.systemInfo.location}
     \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557     Processor: UW ECE + Applied Math
     \u255a\u2550\u255d   \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d     GPA:       3.93/4.0
                         Uptime:    ${bio.systemInfo.uptime}
  tejas@portfolio        Shell:     TejasOS Terminal v1.0
                         Ventures:  3 active
                         Papers:    3 published`,
  },
  "cat resume.txt": {
    description: "Display resume summary",
    execute: () =>
      `${bio.tagline}\n\n${bio.full}\n\nRun 'ls' to see projects or 'cat projects/<name>' for details.`,
  },
  clear: {
    description: "Clear terminal",
    execute: () => "__CLEAR__",
  },
  "sudo rm -rf /": {
    description: "Nice try",
    execute: () => "Nice try. Permission denied. Also, this is a website.",
  },
  date: {
    description: "Display current date",
    execute: () => new Date().toString(),
  },
  uname: {
    description: "Display system name",
    execute: () => "TejasOS 1.0.0 Founder-Edition x86_64",
  },
  echo: {
    description: "Echo text",
    execute: () => "Usage: echo <text>",
  },
  exit: {
    description: "Close terminal",
    execute: () => "__EXIT__",
  },
};

// Dynamic cat commands for each project
projects.forEach((p) => {
  TERMINAL_COMMANDS[`cat projects/${p.filename.toLowerCase()}.${p.extension}`] = {
    description: `View ${p.title} details`,
    execute: () =>
      `=== ${p.title} ===\nRole: ${p.role}\nDate: ${p.date}\n\n${p.description}\n\nKey Metrics:\n${p.metrics.map((m) => `  \u2022 ${m}`).join("\n")}\n\nTech: ${p.tech.join(", ")}`,
  };
});
