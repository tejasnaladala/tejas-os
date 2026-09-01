import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const html = readdirSync(root)
  .filter((name) => name.endsWith(".html"))
  .map((name) => readFileSync(resolve(root, name), "utf8"))
  .join("\n");
const content = readFileSync(resolve(root, "content.js"), "utf8");
const professionalContent = content.split("export const archiveEntries")[0];
const section = readFileSync(resolve(root, "section.js"), "utf8");
const copy = `${html}\n${professionalContent}\n${section}`;

const checks = [
  ["stale degree", /Electrical\s*&\s*Computer Engineering|Applied Mathematics|Applied Math/i],
  ["retired company name", /PlasmaX/i],
  ["stale funding claim", /\$450K|\$2M seed/i],
  ["withdrawn manuscript claim", /Nature Communications/i],
  ["unfinished outcome claim", /r\s*=\s*0\.53|rank(?:ed)?\s+91|0\.912\s+AUC/i],
  ["stale citation count", /35 citations/i],
  ["unsupported MTEB artifact", /public leaderboard/i],
  ["unreconciled maze headline", /4,200\+|97\.4%|97\.2%/i],
  ["unpublished MTEB conclusion", /16 retrieval datasets|task-definition mismatch/i],
  ["retired Parchment scale claim", /150-agent|5,000\+ papers|900 training runs/i],
  ["stale Mimic test count", /103 tests/i],
  ["stale AgentBreed run count", /700\+ runs/i],
  ["canned contrast", /\bsits between\b|\bthe throughline\b|\brather than\b|\bnot just\b|\bisn't just\b|\bmore than just\b/i],
  ["generic positioning copy", /\bat the intersection of\b|\ba testament to\b|\bseamlessly\b|\bleverag(?:e|es|ed|ing)\b|\bever-evolving\b/i],
  ["generic scope claim", /\bend[- ]to[- ]end\b|\bfull[- ]stack\b/i],
];

const failures = checks.filter(([, pattern]) => pattern.test(copy));
if (failures.length) {
  for (const [label, pattern] of failures) console.error(`${label}: ${pattern}`);
  process.exitCode = 1;
} else {
  console.log("Professional copy check passed.");
}
