const base = (process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3010").replace(/\/$/, "");
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

async function fetchText(path, expectedType, expectedStatus = 200) {
  const response = await fetch(`${base}${path}`, { redirect: "manual" });
  const body = await response.text();
  assert(response.status === expectedStatus, `${path}: expected ${expectedStatus}, got ${response.status}`);
  if (expectedType) assert(response.headers.get("content-type")?.includes(expectedType), `${path}: wrong content type ${response.headers.get("content-type")}`);
  return { response, body };
}

const routes = ["/", "/about", "/work", "/research", "/investing", "/blog", "/blog/nespresso-jailbreak", "/blog/wifi-cantenna", "/cv"];
for (const route of routes) {
  const { body } = await fetchText(route, "text/html");
  assert(body.includes('rel="canonical"'), `${route}: missing canonical`);
  assert(body.includes('rel="describedby"'), `${route}: missing llms.txt discovery`);
  assert(body.includes('type="text/markdown"'), `${route}: missing Markdown alternate`);
  assert(body.includes('type="application/ld+json"'), `${route}: missing JSON-LD`);
}

const work = await fetchText("/work", "text/html");
assert(work.body.includes("R0 Systems") && work.body.includes("OpenTrade"), "/work: raw HTML is missing work records");
const research = await fetchText("/research", "text/html");
assert(research.body.includes("MTEB-Gym") && research.body.includes("AgentBreed"), "/research: raw HTML is missing research records");

const profile = await fetchText("/profile.json", "application/json");
assert(JSON.parse(profile.body).identity.id === "person:tejas-naladala", "/profile.json: wrong canonical identity");
await fetchText("/profile.md", "text/markdown");
await fetchText("/llms.txt", "text/plain");
await fetchText("/sitemap.xml", "xml");
await fetchText("/feed.xml", "xml");
await fetchText("/manifest.webmanifest", "application/manifest+json");
await fetchText("/blog/this-story-does-not-exist", "text/html", 404);

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`HTTP audit passed for ${routes.length} canonical routes at ${base}.`);
