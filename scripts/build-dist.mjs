import { copyFile, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = resolve(ROOT, "dist");
const distFromRoot = relative(resolve(ROOT), DIST);

if (distFromRoot !== "dist" || isAbsolute(distFromRoot) || distFromRoot.startsWith(`..${sep}`)) {
  throw new Error(`Refusing to replace unexpected output path: ${DIST}`);
}

const publicFiles = [
  "404.html",
  "about.html",
  "about.md",
  "blog.html",
  "blog.md",
  "content.js",
  "cv.html",
  "cv.md",
  "data/profile.js",
  "favicon.svg",
  "feed.xml",
  "home.js",
  "index.html",
  "investing.html",
  "investing.md",
  "llms.txt",
  "manifest.webmanifest",
  "music.js",
  "pages.css",
  "profile.json",
  "profile.md",
  "projects.md",
  "publications.md",
  "research.html",
  "research.md",
  "robots.txt",
  "section.js",
  "sitemap.xml",
  "story.js",
  "styles.css",
  "work.html",
  "work.md",
];

async function copyPublicFile(file) {
  const source = resolve(ROOT, file);
  const target = resolve(DIST, file);
  const targetFromDist = relative(DIST, target);
  if (targetFromDist === ".." || targetFromDist.startsWith(`..${sep}`) || isAbsolute(targetFromDist)) {
    throw new Error(`Refusing to write outside dist: ${file}`);
  }
  const sourceStats = await stat(source);
  if (!sourceStats.isFile()) throw new Error(`Public artifact is not a file: ${file}`);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}

async function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(join(directory, entry.name), relativePath));
    else if (entry.isFile()) files.push(relativePath);
  }
  return files;
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

for (const file of publicFiles) await copyPublicFile(file);

for (const file of await listFiles(join(ROOT, "blog"), "blog")) {
  if (new Set([".html", ".md"]).has(extname(file).toLowerCase())) await copyPublicFile(file);
}

const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".txt", ".webmanifest", ".xml"]);
const referencedAssets = new Set();
for (const file of await listFiles(DIST)) {
  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  const content = await readFile(join(DIST, file), "utf8");
  for (const match of content.matchAll(/assets\/[A-Za-z0-9._~%+\/-]*\.[A-Za-z0-9]+/g)) {
    referencedAssets.add(match[0].replace(/[.,;:!?]+$/g, ""));
  }
}

for (const asset of [...referencedAssets].sort()) await copyPublicFile(asset);

if ([...referencedAssets].some((asset) => asset.startsWith("assets/vendor/pixelarticons/"))) {
  for (const file of ["assets/vendor/pixelarticons/LICENSE.txt", "assets/vendor/pixelarticons/SOURCE.txt"]) {
    await copyPublicFile(file);
  }
}

const emittedFiles = await listFiles(DIST);
let emittedBytes = 0;
for (const file of emittedFiles) emittedBytes += (await stat(join(DIST, file))).size;

console.log(`Built dist: ${emittedFiles.length} files, ${(emittedBytes / 1024 / 1024).toFixed(2)} MB.`);
