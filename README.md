# tejasnaladala.com

Static source for [tejasnaladala.com](https://tejasnaladala.com): a personal site with separate About, Work, Research, Investing, and Blog views.

## Local development

```powershell
npm run dev
```

The local server defaults to `http://127.0.0.1:3000`. Set `PORT` to use another port.

## Build and verification

```powershell
npm run build
npm run audit:http
npm run audit:mobile
npx --yes --package=playwright node scripts/signature-regression.mjs
```

`npm run build` regenerates the machine-readable layer, validates the professional record and public copy, runs the retrieval evaluation, and creates an allowlisted `dist/` directory. Vercel publishes only `dist/`; source files, reports, screenshots, temporary files, and local configuration stay outside the deployment.

## Content model

- `data/profile.js` is the canonical professional record.
- `content.js` contains personal writing, investing copy, and blog articles.
- `scripts/generate-agent-layer.mjs` produces static HTML fallbacks, Markdown pages, JSON, JSON-LD, `llms.txt`, the sitemap, the Atom feed, and the web manifest.
- `scripts/check-agent-layer.mjs` validates graph references, discovery metadata, Markdown, JSON-LD, and deterministic generation.
- `scripts/build-dist.mjs` assembles the public release from an explicit allowlist.

The visual pages and machine-readable files are generated from the same facts. Public machine endpoints are documented in [docs/agent-accessibility.md](docs/agent-accessibility.md).

## Deployment

The repository is linked to Vercel. Production builds use `npm run build` and publish `dist/` according to `vercel.json`.
