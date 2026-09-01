import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const profile = JSON.parse(await readFile(`${root}/profile.json`, "utf8"));
const llms = await readFile(`${root}/llms.txt`, "utf8");
const work = await readFile(`${root}/work.md`, "utf8");
const research = await readFile(`${root}/research.md`, "utf8");

const questions = [
  { name: "identity", pass: profile.identity.name === "Tejas Naladala" && profile.identity.canonicalId.endsWith("/#person") },
  { name: "contact", pass: profile.identity.publicEmail === "naladala@uw.edu" },
  { name: "current work", pass: profile.experience.some((item) => item.current && item.organizationId === "org:r0-systems") },
  { name: "education", pass: profile.education.some((item) => item.field === "Engineering" && item.current) },
  { name: "research status", pass: profile.research.every((item) => item.status && item.limitation) },
  { name: "claim evidence", pass: profile.claims.every((claim) => claim.evidenceIds.length && claim.confidence) },
  { name: "skill evidence", pass: profile.skills.every((skill) => skill.demonstratedBy.length) },
  { name: "work retrieval", pass: work.includes("R0 Systems") && work.includes("OpenTrade") },
  { name: "research retrieval", pass: research.includes("MTEB-Gym") && research.includes("Connectome Architecture Benchmark") },
  { name: "discovery", pass: llms.includes("Profile JSON") && llms.includes("Research") },
  { name: "unsupported Kubernetes claim refused", pass: !profile.skills.some((skill) => /kubernetes/i.test(skill.name)) },
  { name: "unsupported NeurIPS claim refused", pass: !profile.publications.some((paper) => /neurips/i.test(paper.venue)) },
];

const passed = questions.filter((question) => question.pass).length;
for (const question of questions) console.log(`${question.pass ? "PASS" : "FAIL"} ${question.name}`);
const score = Math.round((passed / questions.length) * 100);
console.log(`Agent retrieval score: ${score}/100 (${passed}/${questions.length})`);
if (passed !== questions.length) process.exit(1);
