# tejas-os

my personal site, live at [tejasnaladala.com](https://tejasnaladala.com). a CRT/terminal-themed portfolio i built because my best friend at udub is obsessed with that aesthetic, and it stuck.

it is a Next.js app (App Router, React 19, TypeScript) deployed on Vercel. cream-and-orange palette, monospace type, hairline rules, a few easter eggs.

## what's in here

- **landing page** - a studio portrait card that swaps to an alternate image on hover, a tabbed CV (projects, skills, awards) with morphing headline text, and a technical-identity hero. full content is also rendered in a hidden `sr-only` block so screen readers and search engines get the whole thing, not just the active tab.
- **`/work`** - every project grouped into ventures, research, industry systems, competitions, and open source. pulled from one typed data file (`src/data/projects.ts`) so the work page, the landing tabs, and the resume never drift apart.
- **`/thesis`** - things i currently believe to be true about hardware, startups, and shipping.
- **`/gallery`** - photo grid with a keyboard-navigable lightbox (arrows to move, esc to close) and graceful fallbacks for images that fail to load.
- **`/stories`** - locked behind an engineering brain teaser. answer it to read.
- **`/resume`** - the clean, boring version for people who just want the PDF.

there's a contact form that posts to an API route, plus a generated Open Graph image so links unfurl nicely.

## how it works

a few things i actually care about under the hood:

- **single source of truth for content.** projects, skills, awards, thesis entries, and stories all live as typed objects in `src/data/`. the pages just render them. no copy-paste between routes.
- **contact API that degrades instead of breaking.** `src/app/api/contact/route.ts` validates input with Zod, applies a 5-requests-per-minute-per-IP in-memory rate limit, and sends through Resend. if the API key is missing or the upstream send fails, it returns a `mailto` fallback so the form never silently eats a message. the key is read from `process.env` only and is never committed.
- **OG image generated at the edge.** `src/app/api/og/route.tsx` builds the 1200x630 social card with `next/og` instead of shipping a static PNG, so the tagline and stats stay in sync with the rest of the site.
- **accessible by default.** skip-to-content link, the hidden full-content block behind the tabbed UI, reduced-motion handling, and aria labels on the interactive bits.

## stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Zustand, Three.js / Spline, Howler.js, Zod, Resend.

## running locally

```bash
npm install
npm run dev
```

opens on localhost:3000.

the contact form needs `RESEND_API_KEY` in your environment to actually send mail. without it the form still works and falls back to a `mailto:` link, so you don't need it for local dev. optional overrides: `RESEND_FROM`, `RESEND_TO`.

```bash
npm run build   # production build
npm run lint    # eslint
```

## deploy

hosted on Vercel. push to `master` and it deploys, or run `npx vercel --prod`. set `RESEND_API_KEY` (and optionally `RESEND_FROM` / `RESEND_TO`) in the Vercel project env.

## license

MIT. see [LICENSE](./LICENSE).
