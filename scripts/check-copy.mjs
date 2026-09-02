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
  ["stale citation count", /35 citations/i],
  ["stale about heading", /entrepreneurship\s+speaks\s+to\s+me/i],
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
