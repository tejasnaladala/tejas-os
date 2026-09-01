import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { profile } from "../data/profile.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const urlBase = "https://tejasnaladala.com/";
const emittedProtocols = new Set(["http:", "https:", "mailto:"]);

function checkUrl(value, label, { allowRelative = true } = {}) {
  if (typeof value !== "string" || !value || value !== value.trim()) {
    errors.push(`${label} is not a valid URL: ${JSON.stringify(value)}`);
    return null;
  }
  if (/[\s\u0000-\u001f\u007f\\]/.test(value) || /%(?![\da-f]{2})/i.test(value)) {
    errors.push(`${label} contains invalid URL characters: ${value}`);
    return null;
  }

  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(value);
  if (!allowRelative && !hasScheme) {
    errors.push(`${label} must be an absolute URL: ${value}`);
    return null;
  }

  try {
    const parsed = new URL(value, urlBase);
    if (!emittedProtocols.has(parsed.protocol)) {
      errors.push(`${label} uses an unsupported URL protocol: ${value}`);
      return null;
    }
    if (hasScheme && (parsed.protocol === "http:" || parsed.protocol === "https:") && !/^https?:\/\//i.test(value)) {
      errors.push(`${label} has a malformed absolute URL: ${value}`);
      return null;
    }
    if ((parsed.protocol === "http:" || parsed.protocol === "https:") && !parsed.hostname) {
      errors.push(`${label} lacks a URL hostname: ${value}`);
      return null;
    }
    if (parsed.protocol === "mailto:") {
      const recipients = decodeURIComponent(parsed.pathname).split(",");
      if (!recipients.length || recipients.some((recipient) => !/^[^@\s]+@[^@\s]+$/.test(recipient))) {
        errors.push(`${label} has an invalid mailto recipient: ${value}`);
        return null;
      }
    }
    return parsed;
  } catch {
    errors.push(`${label} is not a valid URL: ${value}`);
    return null;
  }
}

function checkProfileUrls(value, path = "profile", parentKey = "") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkProfileUrls(item, `${path}[${index}]`, parentKey));
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    const isUrlField =
      /url$/i.test(key) ||
      ["canonicalId", "image"].includes(key) ||
      ["externalProfiles", "contact"].includes(parentKey);
    if (isUrlField && child != null) checkUrl(child, childPath, { allowRelative: false });
    checkProfileUrls(child, childPath, key);
  }
}

function allEntityArrays() {
  return [
    profile.organizations,
    profile.education,
    profile.experience,
    profile.research,
    profile.technicalReports,
    profile.publications,
    profile.projects,
    profile.awards,
    profile.programs,
    profile.writing,
    profile.skills,
    profile.claims,
    profile.evidence,
  ];
}

const entities = allEntityArrays().flat();
const entityIds = new Set();
for (const entity of entities) {
  assert(typeof entity.id === "string" && entity.id.includes(":"), `Invalid entity ID: ${JSON.stringify(entity.id)}`);
  assert(!entityIds.has(entity.id), `Duplicate entity ID: ${entity.id}`);
  entityIds.add(entity.id);
}
entityIds.add(profile.identity.id);

const organizationIds = new Set(profile.organizations.map((item) => item.id));
const experienceIds = new Set(profile.experience.map((item) => item.id));
const evidenceIds = new Set(profile.evidence.map((item) => item.id));
const claimIds = new Set(profile.claims.map((item) => item.id));
const skillIds = new Set(profile.skills.map((item) => item.id));

const crossReferenceTargets = new Map([
  ["parentOrganizationId", organizationIds],
  ["institutionId", organizationIds],
  ["organizationId", organizationIds],
  ["organizationIds", organizationIds],
  ["associatedExperienceIds", experienceIds],
  ["associatedEntityId", entityIds],
  ["associatedEntityIds", entityIds],
  ["subjectId", entityIds],
  ["evidenceIds", evidenceIds],
  ["claimIds", claimIds],
  ["demonstrates", skillIds],
  ["demonstratedBy", entityIds],
  ["currentActivities", entityIds],
]);
const arrayReferenceKeys = new Set([
  "organizationIds",
  "associatedExperienceIds",
  "associatedEntityIds",
  "evidenceIds",
  "claimIds",
  "demonstrates",
  "demonstratedBy",
  "currentActivities",
]);

function checkAllCrossReferences(value, path = "profile") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkAllCrossReferences(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    const isReferenceField =
      !["id", "canonicalId"].includes(key) &&
      (/(?:Id|Ids)$/.test(key) || ["demonstrates", "demonstratedBy", "currentActivities"].includes(key));
    if (isReferenceField) {
      const allowed = crossReferenceTargets.get(key);
      assert(allowed, `${childPath} is not covered by cross-reference validation`);
      if (allowed) {
        const expectsArray = arrayReferenceKeys.has(key);
        assert(expectsArray ? Array.isArray(child) : typeof child === "string", `${childPath} has the wrong reference shape`);
        const references = expectsArray ? (Array.isArray(child) ? child : []) : typeof child === "string" ? [child] : [];
        for (const reference of references) {
          assert(typeof reference === "string" && allowed.has(reference), `${childPath} has unknown reference: ${JSON.stringify(reference)}`);
        }
      }
    }
    checkAllCrossReferences(child, childPath);
  }
}

checkAllCrossReferences(profile);

function checkRefs(owner, refs, allowed, label) {
  for (const ref of refs ?? []) assert(allowed.has(ref), `${owner} has unknown ${label}: ${ref}`);
}

for (const item of profile.organizations) {
  if (item.parentOrganizationId) assert(organizationIds.has(item.parentOrganizationId), `${item.id} has unknown parent organization`);
}
for (const item of profile.education) {
  assert(organizationIds.has(item.institutionId), `${item.id} has unknown institution`);
  checkRefs(item.id, item.demonstrates, skillIds, "skill");
  checkRefs(item.id, item.evidenceIds, evidenceIds, "evidence");
}
for (const item of profile.experience) {
  assert(organizationIds.has(item.organizationId), `${item.id} has unknown organization`);
  checkRefs(item.id, item.demonstrates, skillIds, "skill");
  checkRefs(item.id, item.claimIds, claimIds, "claim");
  checkRefs(item.id, item.evidenceIds, evidenceIds, "evidence");
}
for (const item of profile.research) {
  checkRefs(item.id, item.organizationIds, organizationIds, "organization");
  checkRefs(item.id, item.demonstrates, skillIds, "skill");
  checkRefs(item.id, item.claimIds, claimIds, "claim");
  checkRefs(item.id, item.evidenceIds, evidenceIds, "evidence");
  assert(item.result && item.limitation, `${item.id} must publish a result and boundary`);
}
for (const item of profile.technicalReports) {
  assert(organizationIds.has(item.advisor.organizationId), `${item.id} has unknown advisor organization`);
  checkRefs(item.id, item.demonstrates, skillIds, "skill");
  checkRefs(item.id, item.claimIds, claimIds, "claim");
  checkRefs(item.id, item.evidenceIds, evidenceIds, "evidence");
}
for (const item of [...profile.projects, ...profile.publications]) {
  checkRefs(item.id, item.demonstrates, skillIds, "skill");
  checkRefs(item.id, item.evidenceIds, evidenceIds, "evidence");
}
for (const item of profile.claims) {
  assert(entityIds.has(item.subjectId), `${item.id} has unknown subject: ${item.subjectId}`);
  checkRefs(item.id, item.evidenceIds, evidenceIds, "evidence");
  assert([1, 2, 3].includes(item.evidenceTier), `${item.id} has invalid evidence tier`);
}
for (const item of profile.skills) checkRefs(item.id, item.demonstratedBy, entityIds, "demonstration target");

const datePattern = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;
for (const entity of entities) {
  for (const key of ["date", "startDate", "endDate", "publicationDate"]) {
    const value = entity[key];
    if (value != null) assert(datePattern.test(value), `${entity.id}.${key} is not an ISO precision date: ${value}`);
  }
  if (entity.startDate && entity.endDate) assert(entity.startDate <= entity.endDate, `${entity.id} ends before it starts`);
  if (entity.current && !entity.expectedEndDate) assert(entity.endDate == null, `${entity.id} is current but has an end date`);
}

for (const entity of [profile.identity, ...entities]) {
  for (const [key, value] of Object.entries(entity)) {
    if ((key === "url" || key.endsWith("Url")) && value) {
      try {
        new URL(value);
      } catch {
        errors.push(`${entity.id ?? "identity"}.${key} is not a valid URL: ${value}`);
      }
    }
  }
}
checkProfileUrls(profile);

assert(profile.identity.canonicalId === "https://tejasnaladala.com/#person", "Canonical person ID changed");
assert(profile.education.every((item) => item.field === "Engineering"), "Education must remain Engineering, not a stale major");
assert(profile.publicationMetrics.citations === 57, "Citation snapshot is stale");
assert(profile.research.find((item) => item.id === "research:ocean-cv")?.status === "in_progress", "Ocean CV must remain in progress");

const generated = [
  "profile.json",
  "profile.md",
  "llms.txt",
  "about.md",
  "work.md",
  "research.md",
  "investing.md",
  "cv.md",
  "projects.md",
  "publications.md",
  "blog.md",
  "feed.xml",
  "manifest.webmanifest",
  "sitemap.xml",
  "robots.txt",
  "blog/nespresso-jailbreak.html",
  "blog/nespresso-jailbreak.md",
  "blog/wifi-cantenna.html",
  "blog/wifi-cantenna.md",
];
const generatedMarkdown = generated.filter((file) => file.endsWith(".md") || file === "llms.txt");
const generatorInputs = [
  "package.json",
  "content.js",
  "data/profile.js",
  "scripts/generate-agent-layer.mjs",
  "index.html",
  "about.html",
  "work.html",
  "research.html",
  "investing.html",
  "stories.html",
  "cv.html",
];

async function hashFiles(root) {
  const hashes = new Map();
  for (const file of generated) {
    const content = await readFile(join(root, file), "utf8");
    hashes.set(file, createHash("sha256").update(content).digest("hex"));
  }
  return hashes;
}

function runGenerator(root) {
  return spawnSync(process.execPath, [join(root, "scripts/generate-agent-layer.mjs")], { cwd: root, encoding: "utf8" });
}

const before = await hashFiles(ROOT);
const generationSandbox = await mkdtemp(join(tmpdir(), "tejas-agent-layer-"));
try {
  for (const file of generatorInputs) {
    const target = join(generationSandbox, file);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(join(ROOT, file), target);
  }

  const firstGeneration = runGenerator(generationSandbox);
  assert(
    firstGeneration.status === 0,
    `Generator failed: ${firstGeneration.error?.message || firstGeneration.stderr || firstGeneration.stdout}`,
  );
  if (firstGeneration.status === 0) {
    const firstPass = await hashFiles(generationSandbox);
    for (const file of generated) {
      assert(before.get(file) === firstPass.get(file), `Generation is not deterministic: ${file}`);
    }

    const secondGeneration = runGenerator(generationSandbox);
    assert(
      secondGeneration.status === 0,
      `Generator repeat failed: ${secondGeneration.error?.message || secondGeneration.stderr || secondGeneration.stdout}`,
    );
    if (secondGeneration.status === 0) {
      const secondPass = await hashFiles(generationSandbox);
      for (const file of generated) {
        assert(firstPass.get(file) === secondPass.get(file), `Repeated generation is not deterministic: ${file}`);
      }
    }
  }
} finally {
  const sandboxFromTemp = relative(resolve(tmpdir()), resolve(generationSandbox));
  if (sandboxFromTemp && sandboxFromTemp !== ".." && !sandboxFromTemp.startsWith(`..${sep}`) && !isAbsolute(sandboxFromTemp)) {
    await rm(generationSandbox, { recursive: true, force: true });
  } else {
    errors.push(`Refused to remove unexpected generation sandbox: ${generationSandbox}`);
  }
}

function markdownLinks(content) {
  return [...content.matchAll(/!?\[[^\]\r\n]*\]\(\s*(?:<([^>\r\n]+)>|([^\s)\r\n]+))/g)].map(
    (match) => match[1] ?? match[2],
  );
}

function decodeMarkupUrl(value) {
  if (typeof value !== "string") return value;
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'");
}

function trimBareUrl(value) {
  let result = value.replace(/[.,;:!?]+$/g, "");
  while (result.endsWith(")")) {
    const opening = (result.match(/\(/g) ?? []).length;
    const closing = (result.match(/\)/g) ?? []).length;
    if (closing <= opening) break;
    result = result.slice(0, -1);
  }
  return result;
}

const checkedUrlArtifacts = new Set();
function checkArtifactUrls(file, content) {
  if (checkedUrlArtifacts.has(file)) return;
  checkedUrlArtifacts.add(file);

  let absoluteIndex = 0;
  for (const match of content.matchAll(/(?:https?:\/\/|mailto:)[^\s<>"'`\\]+/gi)) {
    checkUrl(decodeMarkupUrl(trimBareUrl(match[0])), `${file} absolute URL ${++absoluteIndex}`, { allowRelative: false });
  }

  if (file.endsWith(".md") || file === "llms.txt") {
    markdownLinks(content).forEach((url, index) => checkUrl(url, `${file} Markdown link ${index + 1}`));
  }

  if (file.endsWith(".html") || file.endsWith(".xml")) {
    let attributeIndex = 0;
    for (const match of content.matchAll(/\b(?:href|src|action|poster)\s*=\s*(["'])(.*?)\1/gi)) {
      checkUrl(decodeMarkupUrl(match[2]), `${file} URL attribute ${++attributeIndex}`);
    }
  }

  if (file.endsWith(".html")) {
    const urlMetaNames = new Set(["og:url", "og:image", "og:audio", "og:video", "twitter:image", "twitter:player"]);
    for (const [index, match] of [...content.matchAll(/<meta\b[^>]*>/gi)].entries()) {
      const attributes = new Map(
        [...match[0].matchAll(/\b([:\w-]+)\s*=\s*(["'])(.*?)\2/g)].map((attribute) => [
          attribute[1].toLowerCase(),
          attribute[3],
        ]),
      );
      const metaName = (attributes.get("property") ?? attributes.get("name") ?? "").toLowerCase();
      if (urlMetaNames.has(metaName)) {
        checkUrl(decodeMarkupUrl(attributes.get("content")), `${file} URL meta ${index + 1}`);
      }
    }
  }

  if (file.endsWith(".xml")) {
    for (const [index, match] of [...content.matchAll(/<(loc|id|uri)>([^<]+)<\/\1>/gi)].entries()) {
      checkUrl(decodeMarkupUrl(match[2]), `${file} <${match[1]}> URL ${index + 1}`, { allowRelative: false });
    }
  }

  if (file === "robots.txt") {
    for (const [index, match] of [...content.matchAll(/^sitemap:\s*(\S.*?)\s*$/gim)].entries()) {
      checkUrl(match[1], `${file} sitemap URL ${index + 1}`, { allowRelative: false });
    }
  }
}

function checkStructuredUrls(value, file, urlKeys, { allowRelative = false, path = "$" } = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkStructuredUrls(item, file, urlKeys, { allowRelative, path: `${path}[${index}]` }));
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    if (urlKeys.has(key)) {
      const urls = Array.isArray(child) ? child : [child];
      for (const [index, url] of urls.entries()) {
        checkUrl(url, `${file} ${childPath}${urls.length > 1 ? `[${index}]` : ""}`, { allowRelative });
      }
    }
    checkStructuredUrls(child, file, urlKeys, { allowRelative, path: childPath });
  }
}

function collectPersonNodes(value, path = "$", people = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectPersonNodes(item, `${path}[${index}]`, people));
    return people;
  }
  if (!value || typeof value !== "object") return people;

  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  if (types.includes("Person")) people.push({ node: value, path });
  for (const [key, child] of Object.entries(value)) collectPersonNodes(child, `${path}.${key}`, people);
  return people;
}

function checkPersonGraph(file, documents) {
  const people = documents.flatMap((document, index) => collectPersonNodes(document, `$jsonLd[${index}]`));
  const canonicalPeople = people.filter(({ node }) => node["@id"] === profile.identity.canonicalId);
  assert(canonicalPeople.length === 1, `${file} JSON-LD must contain exactly one canonical Tejas Person; found ${canonicalPeople.length}`);
  if (canonicalPeople.length === 1) {
    assert(canonicalPeople[0].node.name === profile.identity.name, `${file} canonical Person has the wrong name`);
  }

  const disconnected = people.filter(({ node }) => {
    const matchesIdentity =
      node.name === profile.identity.name ||
      (node.givenName === profile.identity.givenName && node.familyName === profile.identity.familyName);
    return matchesIdentity && node["@id"] !== profile.identity.canonicalId;
  });
  assert(
    disconnected.length === 0,
    `${file} JSON-LD has disconnected duplicate Tejas Person nodes at ${disconnected.map(({ path }) => path).join(", ")}`,
  );
}

const jsonLdUrlKeys = new Set(["@context", "@id", "url", "image", "email", "sameAs"]);
function checkHtmlJsonLd(file, html, { required }) {
  const blocks = [
    ...html.matchAll(/<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi),
  ];
  if (required) assert(blocks.length > 0, `${file} lacks JSON-LD`);

  const documents = [];
  for (const [index, match] of blocks.entries()) {
    try {
      const document = JSON.parse(match[1]);
      documents.push(document);
      checkStructuredUrls(document, file, jsonLdUrlKeys, { path: `$jsonLd[${index}]` });
    } catch (error) {
      errors.push(`${file} has invalid JSON-LD: ${error.message}`);
    }
  }
  if (required) checkPersonGraph(file, documents);
}

const generatedContents = new Map();
for (const file of generated) {
  const content = await readFile(join(ROOT, file), "utf8");
  generatedContents.set(file, content);
  checkArtifactUrls(file, content);
}

for (const file of generatedMarkdown) {
  const markdown = generatedContents.get(file);
  const h1Count = (markdown.match(/^#(?!#)\s+\S.*$/gm) ?? []).length;
  assert(markdown.startsWith("# "), `${file} must begin with an H1`);
  assert(h1Count === 1, `${file} must contain exactly one H1; found ${h1Count}`);
  assert(!/\bundefined\b/i.test(markdown), `${file} contains undefined`);
  assert(!/\[object Object\]/i.test(markdown), `${file} contains [object Object]`);
}

const profileJson = JSON.parse(await readFile(join(ROOT, "profile.json"), "utf8"));
assert(profileJson.schemaVersion === profile.schemaVersion, "profile.json schema version mismatch");
assert(profileJson.identity.id === profile.identity.id, "profile.json identity mismatch");
checkProfileUrls(profileJson, "profile.json");

const manifest = JSON.parse(await readFile(join(ROOT, "manifest.webmanifest"), "utf8"));
checkStructuredUrls(manifest, "manifest.webmanifest", new Set(["start_url", "scope", "src"]), { allowRelative: true });

async function localArtifactExists(relativePath) {
  const leaf = relativePath.split("/").at(-1) ?? "";
  const candidates = relativePath
    ? [relativePath, ...(leaf.includes(".") ? [] : [`${relativePath}.html`, join(relativePath, "index.html")])]
    : ["index.html"];
  for (const candidate of candidates) {
    const target = resolve(ROOT, candidate);
    const targetFromRoot = relative(resolve(ROOT), target);
    if (targetFromRoot === ".." || targetFromRoot.startsWith(`..${sep}`) || isAbsolute(targetFromRoot)) return false;
    try {
      if ((await stat(target)).isFile()) return true;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return false;
}

const llms = generatedContents.get("llms.txt");
let canonicalOrigin = new URL(urlBase).origin;
try {
  canonicalOrigin = new URL(profile.canonicalUrl).origin;
} catch {
  // The profile URL audit above reports the malformed canonical URL.
}
let localLlmsLinks = 0;
for (const [index, url] of markdownLinks(llms).entries()) {
  const parsed = checkUrl(url, `llms.txt link ${index + 1}`);
  if (!parsed || !["http:", "https:"].includes(parsed.protocol) || parsed.origin !== canonicalOrigin) continue;
  localLlmsLinks += 1;
  try {
    const decodedPath = decodeURIComponent(parsed.pathname);
    if (decodedPath.includes("\\") || decodedPath.split("/").includes("..")) {
      errors.push(`llms.txt local link escapes the artifact root: ${url}`);
      continue;
    }
    const artifactPath = decodedPath.replace(/^\/+|\/+$/g, "");
    assert(await localArtifactExists(artifactPath), `llms.txt local artifact does not exist: ${url}`);
  } catch (error) {
    errors.push(`llms.txt local link has an invalid path: ${url} (${error.message})`);
  }
}
assert(localLlmsLinks > 0, "llms.txt does not link any local artifacts");

const htmlFiles = (await readdir(ROOT)).filter((name) => name.endsWith(".html"));
for (const file of htmlFiles) {
  const html = await readFile(join(ROOT, file), "utf8");
  const requiresAgentMetadata = file !== "404.html";
  if (requiresAgentMetadata) {
    assert(html.includes('rel="describedby"'), `${file} lacks llms.txt discovery`);
    assert(html.includes('type="text/markdown"'), `${file} lacks a Markdown alternate`);
    assert(html.includes('type="application/ld+json"'), `${file} lacks JSON-LD`);
  }
  checkArtifactUrls(file, html);
  checkHtmlJsonLd(file, html, { required: requiresAgentMetadata });
}

const nestedBlogHtmlFiles = (await readdir(join(ROOT, "blog")))
  .filter((name) => name.endsWith(".html"))
  .map((name) => `blog/${name}`);
for (const file of nestedBlogHtmlFiles) {
  const html = await readFile(join(ROOT, file), "utf8");
  checkArtifactUrls(file, html);
  checkHtmlJsonLd(file, html, { required: true });
}

const rawWork = await readFile(join(ROOT, "work.html"), "utf8");
const rawResearch = await readFile(join(ROOT, "research.html"), "utf8");
assert(rawWork.includes("R0 Systems") && rawWork.includes("OpenTrade"), "Raw work HTML lacks professional records");
assert(rawResearch.includes("MTEB-Gym") && rawResearch.includes("Connectome Architecture Benchmark"), "Raw research HTML lacks research records");
assert((await readFile(join(ROOT, "blog/nespresso-jailbreak.html"), "utf8")).includes("It is never just coffee"), "Static Nespresso story is incomplete");

const corpus = (
  await Promise.all([
    "profile.json",
    "profile.md",
    "work.md",
    "research.md",
    "cv.md",
    "projects.md",
    "publications.md",
    "index.html",
    "work.html",
    "research.html",
    "cv.html",
  ].map((file) => readFile(join(ROOT, file), "utf8")))
).join("\n");
for (const [label, pattern] of [
  ["local Windows path", /[A-Z]:\\Users\\/i],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["API secret", /(?:api[_-]?key|secret[_-]?key)\s*[:=]\s*[\"'][^\"']+/i],
  ["stale major", /Electrical\s*&\s*Computer Engineering|Applied Mathematics|Applied Math/i],
  ["stale citation count", /35 citations/i],
  ["serialized undefined value", /\bundefined\b/i],
  ["serialized object value", /\[object Object\]/i],
  ["formulaic copy", /\bsits between\b|\bthe throughline\b|\brather than\b|\bat the intersection of\b|\ba testament to\b|\bseamlessly\b/i],
]) assert(!pattern.test(corpus), `Generated corpus contains ${label}`);

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`Agent layer passed: ${entities.length} entities, ${profile.claims.length} claims, ${profile.evidence.length} evidence records, ${generated.length} deterministic artifacts.`);
