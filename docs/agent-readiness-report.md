# Agent Readiness Report

Audit date: 2026-09-01

Scope: canonical data, generated HTML and machine endpoints, build isolation, retrieval, mobile access, and deployment checks.

## Release status

The source release is ready for production. One canonical model generates the human and machine-facing records; generation is deterministic; all graph references resolve; and the public build contains only allowlisted files.

Source readiness: **96/100**

Production readiness: **verified at https://tejasnaladala.com**

The score is an engineering assessment, not a search-ranking metric.

## Verified locally

| Check | Result |
| --- | --- |
| Canonical graph | Pass: 134 entities, 25 claims, 28 evidence records |
| Deterministic generation | Pass: 19 generated artifacts |
| Recruiter retrieval evaluation | Pass: 100/100, including two unsupported-claim refusals |
| Professional copy checks | Pass |
| JSON, JSON-LD, XML, Markdown, and local links | Pass |
| Static no-JavaScript routes | Pass |
| Mobile regression | Pass: 216 Chromium and WebKit scenarios |
| Signature regression | Pass: 12 animated and reduced-motion scenarios |
| Public bundle security review | Pass: no private files, secrets, local paths, or retired claims |
| Build output | 58 files, 4.20 MB |

## Architecture

- `data/profile.js` is the canonical professional record.
- `content.js` owns investing copy, About writing, and blog articles.
- `scripts/generate-agent-layer.mjs` generates HTML fallbacks, Markdown, JSON, JSON-LD, discovery files, and feeds.
- `scripts/check-agent-layer.mjs` validates references across the complete graph and checks generated artifacts in a temporary directory.
- `scripts/build-dist.mjs` creates a dedicated public release boundary.
- `scripts/audit-http.mjs` verifies routes, MIME types, discovery, redirects, headers, and 404 behavior.

## Public access policy

Search crawlers and user-triggered assistants are allowed. `OAI-SearchBot` and `ChatGPT-User` are named explicitly. `GPTBot` remains disallowed so model-training access is not implied by search accessibility.

## Known external limits

- LinkedIn could not be authenticated for an automated profile-copy audit.
- The GitHub account-level bio requires user-profile scope; repository content can be updated independently.
- The exact month of entry into the Lavin Entrepreneurship Program is not public, so the model does not invent one.
- Some professional outcomes remain first-party claims and retain their evidence tier in the canonical record.

## Release verification

The canonical deployment was audited with:

```powershell
$env:AUDIT_BASE_URL='https://tejasnaladala.com'
npm run audit:http
```

The canonical domain serves the generated endpoints, current homepage identity, current resume, security headers, and clean redirects.
