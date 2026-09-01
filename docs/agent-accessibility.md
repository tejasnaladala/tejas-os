# Agent Accessibility Layer

Audit date: 2026-09-01

## Purpose

The site publishes the same professional record as visual HTML, raw semantic HTML, Markdown, JSON, JSON-LD, and discovery files. `data/profile.js` is canonical for professional facts. `content.js` is canonical for personal writing, investing copy, and blog stories.

## Generation flow

```text
data/profile.js --------+
content.js -------------+-- scripts/generate-agent-layer.mjs
page HTML --------------+          |
                                  |-- profile.json and profile.md
                                  |-- page and story Markdown
                                  |-- JSON-LD and HTML discovery
                                  |-- static no-JavaScript content
                                  |-- llms.txt, sitemap, feed, robots, manifest
                                  `-- 404 page
```

Generation replaces marked `agent:head` and `agent:content` blocks and is idempotent.

## Public resources

| Resource | Purpose |
| --- | --- |
| `/profile.json` | Normalized entities, claims, evidence, skills, dates, and provenance |
| `/profile.md` | Comprehensive professional record |
| `/cv.md` | Linear CV record |
| `/work.md` | Experience and contributions |
| `/research.md` | Studies, status boundaries, reports, publications, and systems |
| `/projects.md` | Public software systems |
| `/publications.md` | Publications and citation snapshot |
| `/about.md`, `/investing.md`, `/blog.md` | Machine-readable substantial pages |
| `/blog/*.md` | Complete published stories |
| `/llms.txt` | Compact canonical index |
| `/sitemap.xml` | Indexable route inventory |
| `/feed.xml` | Atom feed |
| `/robots.txt` | Search and assistant access policy |
| `/manifest.webmanifest` | Site identity and install metadata |

## Discovery and static access

- Substantial HTML pages advertise their Markdown alternate and `/llms.txt`.
- Vercel adds an HTTP `Link` header for `/llms.txt`.
- Homepage and About publish `ProfilePage` data around the canonical person ID.
- Work publishes an `ItemList`; Research publishes `ResearchProject` and `ScholarlyArticle`; stories publish `BlogPosting`.
- Static story pages contain the complete article in raw `<main>` markup. JavaScript enhances presentation without owning the text.
- Work, Research, About, Investing, Blog, and CV include semantic no-JavaScript access.

## Editing professional data

1. Update `data/profile.js` and reuse stable IDs.
2. Record only known date precision and status.
3. Keep personal contributions and team outcomes explicit.
4. Add evidence before referencing its ID.
5. Maintain both directions of claim, skill, and evidence relationships.
6. Regenerate and validate.

```powershell
npm run build
npm run audit:http
```

## Validation

The build checks duplicate IDs, every supported reference family, date intervals, canonical identity, claim and skill edges, Markdown structure and links, root and nested JSON-LD, deterministic generation, static retrieval, unsupported-claim refusal, secrets, local paths, stale copy, and formulaic copy. External evidence URLs and live production behavior are audited separately so ordinary builds remain deterministic.

## Publishing boundary

`scripts/build-dist.mjs` copies only approved pages, runtime files, generated machine resources, and referenced assets into `dist/`. Documentation, test output, scripts, environment files, local configuration, unused media, and temporary artifacts are excluded from production.
