# SYTMRX — Company Website & Software Hub

Website and software distribution hub for **SYTMRX** — an independent
technology and digital-product company building software, applications, games,
offline-first systems and experimental digital products.

**Repository:** https://github.com/rolexsir-org/SYTMRX

The site is the **presentation layer**. GitHub Releases is the **distribution
layer**. No binaries are stored in this repository.

```
Website
  ↓  project metadata (src/data/projects.ts)
  ↓  GitHub repository (rolexsir-org/<repo>)
  ↓  published GitHub Release
  ↓  real release asset
  ↓  validated download metadata
  ↓  user download

GitHub unavailable
  ↓  static project metadata
  ↓  honest "not published yet" state
```

---

## Quick start

```bash
npm ci          # install (reproducible; requires package-lock.json)
npm run dev     # http://localhost:3000
npm run validate # data + lint + types + production build
```

No environment variables are required. The site builds, runs and deploys with
none set — GitHub features simply fall back to static metadata.

---

## Table of contents

1. [Architecture](#1-architecture)
2. [Rendering & revalidation model](#2-rendering--revalidation-model)
3. [Environment variables](#3-environment-variables)
4. [Automatic release resolution](#4-automatic-release-resolution)
5. [Fallback behaviour](#5-fallback-behaviour)
6. [Checksums & release integrity](#6-checksums--release-integrity)
7. [Adding a product](#7-adding-a-product)
8. [Mapping a product to a repository](#8-mapping-a-product-to-a-repository)
9. [Adding screenshots](#9-adding-screenshots)
10. [The release workflow](#10-the-release-workflow)
11. [Validation & CI](#11-validation--ci)
12. [Deploying to Vercel](#12-deploying-to-vercel)
13. [Custom domain](#13-custom-domain)
14. [Security expectations](#14-security-expectations)
15. [Design system](#15-design-system)
16. [The placeholder system](#16-the-placeholder-system)
17. [Current data state](#17-current-data-state)

---

## 1. Architecture

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Motion | Framer Motion |
| Icons | Lucide React (+ inline brand marks) |
| Hosting | Vercel |
| Source & distribution | GitHub (`rolexsir-org`) |
| Database | **None** — content is typed data in the repo |
| Backend | **None** — no API routes, no forms, no tracking |

```
src/
├── app/                       Routes (App Router)
│   ├── page.tsx               Home
│   ├── projects/              Index + /projects/[slug] (SSG)
│   ├── apps/                  Product catalogue
│   ├── about/  contact/
│   ├── opengraph-image.tsx    Default OG image
│   ├── sitemap.ts  robots.ts  manifest.ts
│   └── error.tsx  not-found.tsx  loading.tsx
│
├── config/
│   ├── site.ts                Brand, contact, GitHub owner
│   └── nav.ts                 Navigation model
│
├── data/
│   ├── projects.ts            ← SINGLE SOURCE OF TRUTH for products
│   └── types.ts               Strict contracts
│
├── lib/
│   ├── placeholder.ts         Placeholder tokens (anti-fabrication)
│   ├── repository.ts          Repo resolution + URL safety   [isomorphic]
│   ├── downloads.ts           Download/merge logic           [isomorphic]
│   ├── github-client.ts       Cached, timeout-bounded fetch  [server-only]
│   ├── releases.ts            Release → asset resolution     [server-only]
│   ├── project-release.ts     Live-over-static merge         [server-only]
│   ├── github.ts              Repo metadata for Open Source  [server-only]
│   └── meta.ts  cn.ts  useClipboard.ts
│
└── components/                layout · home · projects · downloads · ui · motion
```

**One project object drives everything**: project card, detail page, catalogue
listing, page metadata, per-project Open Graph image, sitemap entry, download
UI, platform info, screenshots, changelog, repository links and status.
Adding a product means editing `src/data/projects.ts` — never adding a page.

---

## 2. Rendering & revalidation model

This is deliberately precise, because "static" is not the whole story:

| Content | How it renders |
| --- | --- |
| All pages/routes | **Prerendered at build time** (SSG). 18 routes. |
| Project/product data | **Fully static** — compiled from `projects.ts`. |
| GitHub release + repo data | **Fetched on the server and cached for 1 hour** (ISR). |

Pages marked `Revalidate 1h` in the build output are prerendered but their
GitHub-derived fragments are refreshed in the background after an hour. So a
newly published release appears **within about an hour**, without a redeploy —
it is not literally frozen at build time.

Client JavaScript is minimal: only the header, hero ambience, gallery
lightbox, cursor glow, copy and share controls are client components.
Everything else is a server component.

---

## 3. Environment variables

**All optional.** The site builds and deploys with none set.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_GITHUB_USERNAME` | `rolexsir-org` | GitHub owner for repos and releases. |
| `NEXT_PUBLIC_SITE_URL` | auto-detected | Canonical base URL. **Leave unset on Vercel** — the deployment URL is detected automatically. Set only for a custom domain. |
| `GITHUB_TOKEN` | *(none)* | **Server-only.** Raises the API rate limit. Never sent to the browser. |

`.env.local` is git-ignored. Copy `.env.example` to start.

---

## 4. Automatic release resolution

The old workflow required pasting release asset URLs into `projects.ts`.
That is no longer necessary.

When a project has:

```ts
repository: { name: "my-app" },
releaseSource: "github-release",
```

the site queries `rolexsir-org/my-app`'s releases on the server and derives:

- **version** — from the release tag (`v1.2.0` → `1.2.0`)
- **release date** — from `published_at`
- **filename**, **file size**, **download URL** — from the matching asset
- **SHA-256** — from the asset digest, when GitHub publishes one
- **channel** — stable vs prerelease

Assets map to platforms by extension: `.apk`/`.aab` → Android, `.exe`/`.msi` →
Windows, `.dmg`/`.pkg` → macOS, `.appimage`/`.deb`/`.rpm` → Linux. Override per
project with `assetMatchers`. Checksum/signature files (`.sha256`, `.sig`,
`.asc`, …) are never mistaken for downloadable builds.

Rules enforced:

- **Drafts are never eligible** — they are not public artifacts.
- **Prereleases are excluded** unless the project sets
  `releaseChannel: "prerelease"`.
- Incomplete uploads (`state !== "uploaded"`) are skipped.
- Every asset URL must be on a GitHub-controlled host or it is discarded.

**Verified against real repositories** during development: the resolver
correctly read version, date, filename, size and genuine SHA-256 digests from
live public releases.

---

## 5. Fallback behaviour

Every GitHub failure mode resolves to the static view. The site never shows a
fatal error because GitHub is unavailable:

| Situation | Result |
| --- | --- |
| API unreachable / offline build | static metadata |
| Rate limit (429) or auth failure | static metadata |
| Repository does not exist (404) | static metadata |
| No releases, or no matching asset | "not published yet" |
| Request exceeds 8s | aborted → static metadata |
| Malformed JSON | static metadata |
| No token configured | works (public, lower rate limit) |

Live data is merged **over** static data per platform, so a partially published
release still shows the correct pending state for the platforms it lacks.

---

## 6. Checksums & release integrity

For every real downloadable artifact the UI shows application, version,
platform, file size, release date, channel, and SHA-256 **when one exists**.

When no checksum is published, the card says so plainly:

> No SHA-256 checksum has been published for this asset, so its integrity
> cannot be verified from this page.

There are no fake security indicators, and no verification is implied that did
not happen. When a checksum is present the card shows the exact
`sha256sum <file>` command to verify it.

`DownloadAsset` is deliberately open for extension, so signature/provenance
fields (e.g. Sigstore) can be added later without restructuring the download
system.

---

## 7. Adding a product

Append one object to `projects` in `src/data/projects.ts`. A copy-paste
template sits directly below the array.

```ts
{
  slug: "my-product",                 // → /projects/my-product
  name: "My Product",
  tagline: "One line describing what it does.",
  description: "One or two sentences for cards and metadata.",
  longDescription: ["Paragraph one."],
  category: "mobile-app",             // mobile-app | desktop-app | web-app | game | tool | library | experiment
  status: "in-development",           // released | beta | in-development | experimental | concept | archived
  platforms: ["android"],
  version: null,                      // resolved from GitHub once released
  releaseDate: null,
  icon: "MP",
  accent: ["#c9a469", "#6a5b3f"],
  screenshots: [{ src: null, alt: "Describe the screen", frame: "phone" }],
  problem: null,
  solution: null,
  features: [],                       // only real, implemented capabilities
  technologies: [],                   // only stacks actually known
  architecture: [],
  requirements: [],
  offline: false,
  repository: { name: "my-product" }, // or null if no public repo
  liveUrl: null,
  releaseSource: "github-release",    // github-release | static | none
  releaseChannel: "stable",
  downloads: {},                      // static fallback only
  changelog: [],
  featured: false,
  layout: "compact",
  order: 7,
}
```

Everything else — routing, catalogue listing, OG image, sitemap, static
generation, download UI — happens automatically.

---

## 8. Mapping a product to a repository

Repository URLs are **never** constructed from a guess. A project either
declares a real repository or shows no repository link at all.

```ts
repository: { name: "my-app" }                    // → rolexsir-org/my-app
repository: { owner: "other-org", name: "app" }   // explicit owner
repository: null                                   // no public repo
```

Owner defaults to `NEXT_PUBLIC_GITHUB_USERNAME`, falling back to
`rolexsir-org`. Names are validated against GitHub's character rules, so a
malformed value produces no link rather than a broken one.

---

## 9. Adding screenshots

1. Save images under `public/screenshots/<slug>/`.
2. Reference them with their **true** intrinsic dimensions:

```ts
screenshots: [
  {
    src: "/screenshots/my-app/capture.png",
    alt: "My App — main screen",
    width: 1080,      // real pixel width
    height: 2340,     // real pixel height
    frame: "phone",   // "phone" | "browser" | "raw"
  },
]
```

Images render with `object-contain`, so correct dimensions guarantee they are
never cropped or distorted. Click any screenshot for the fullscreen viewer
(Escape closes, arrow keys navigate). Until `src` is set, a labelled
"Screenshot pending" placeholder is shown.

`npm run validate:data` **fails** if a screenshot has a `src` without
width/height, or is missing alt text.

---

## 10. The release workflow

```
1. BUILD          produce the artifact (e.g. ./gradlew assembleRelease)
2. CHECKSUM       sha256sum <artifact>
3. TAG            git tag v1.0.0 && git push origin v1.0.0
4. RELEASE        GitHub → Releases → publish, attaching the artifact
5. DONE           the website resolves it automatically
```

Step 5 is the change: no URL, size, date or checksum is copied by hand. Within
the revalidation window (1 hour) the download activates on its own.

`.github/workflows/release.yml` is a **reference workflow to copy into an
artifact repository** — it builds, computes SHA-256 for each artifact, and
publishes a GitHub Release. It is not used by this website (which ships no
binaries), and its build step is intentionally left to be filled in.

Manual releases work exactly the same way; automation is optional.

---

## 11. Validation & CI

```bash
npm run validate:data   # semantic checks on project metadata
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
npm run build           # production build
npm run validate        # all four, in order
```

`validate:data` enforces what types cannot:

- required fields present and non-empty
- unique, URL-safe slugs; unique ordering
- screenshots have alt text; real images declare true dimensions
- **placeholder tokens never leak into user-visible copy**
- external URLs are absolute https
- download URLs point only at trusted GitHub hosts
- SHA-256 values are valid 64-char hex
- versions/dates are well-formed and internally consistent
- a changelog cannot present unreleased work as released
- declared downloads match declared platforms

CI (`.github/workflows/ci.yml`) runs all four on pushes and pull requests to
`main`, using the Node version from `.nvmrc`. **It runs without a GitHub
token**, which is deliberate: it proves the unconfigured fallback path stays
green.

---

## 12. Deploying to Vercel

`vercel.json` pins the framework, install and build commands; `.nvmrc` and
`engines` pin Node 20; `.vercelignore` keeps the upload lean.
**No environment variables are required for the first deploy.**

1. Push to GitHub (see `PUSH.md`).
2. [vercel.com/new](https://vercel.com/new) → import `rolexsir-org/SYTMRX`.
3. Keep every build setting at its default.
4. Deploy.

Optionally add `NEXT_PUBLIC_GITHUB_USERNAME` (only if the owner differs from
`rolexsir-org`) or `GITHUB_TOKEN` (only if you hit rate limits).

Leaving `NEXT_PUBLIC_SITE_URL` unset is correct: the app falls back to Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`, so canonical tags, `sitemap.xml`,
`robots.txt` and Open Graph images all resolve to the real deployment URL.
This is verified — a build with zero environment variables emits fully
qualified absolute URLs.

Pushes to `main` deploy to production; pull requests get preview deployments.

---

## 13. Custom domain

No redesign or restructuring is needed.

1. Vercel → Settings → Domains → add your domain.
2. Follow the DNS instructions at your registrar.
3. Set `NEXT_PUBLIC_SITE_URL=https://your-domain` and redeploy so canonical
   tags, sitemap, robots and OG metadata pick it up.

---

## 14. Security expectations

- **`GITHUB_TOKEN` is server-only.** It has no `NEXT_PUBLIC_` prefix and is
  read exclusively inside modules that `import "server-only"`, which makes it a
  build error for any client component to reach it. Verified absent from the
  client bundle.
- **URL allow-listing.** Every external link must be absolute https;
  downloads must additionally be on a GitHub-controlled host. `javascript:`,
  `data:`, `http:`, relative paths and malformed values are rejected before
  they can reach an `href`.
- **No arbitrary URL construction.** Repository URLs come only from validated
  owner/name pairs.
- **Safe rendering.** The only `dangerouslySetInnerHTML` usage injects
  developer-authored JSON-LD objects serialised with `JSON.stringify` — no user
  or remote input.
- **External links** carry `rel="noopener noreferrer"`.
- **Security headers** (CSP, HSTS, X-Frame-Options, Referrer-Policy,
  Permissions-Policy) are set in `next.config.ts`.
- **No analytics, no tracking cookies, no download counters.**

---

## 15. Design system

Tokens live in `src/app/globals.css` under `@theme`.

- **Surfaces** — cool near-black ramp (`ink-950 … ink-500`), never pure black.
- **Text** — `bone-50` → `bone-200` → `bone-400` → `bone-500`/`600`. Every step
  is contrast-verified at **≥ 4.5:1** against the darkest surface.
- **Accent** — `brass-*`, a restrained warm brass. Never neon, never red.
- **Signals** — `signal-live / beta / work / idle`, used only for status.
- **Spacing** — 8px system. **Radius** — `xs 4 / sm 8 / md 14 / lg 22`.
- **Type** — Instrument Sans (UI), Instrument Serif (italic accents),
  JetBrains Mono (metadata). Self-hosted via `next/font`, zero layout shift.

Accessibility: semantic landmarks, skip link, visible focus rings,
focus-trapped mobile menu and lightbox, correct heading order, meaningful alt
text, and full `prefers-reduced-motion` support (the hero entrance is CSS-based
with `animation-fill-mode: both`, so reduced-motion users never see hidden
content). Verified with axe-core: **0 violations across all routes.**

---

## 16. The placeholder system

`src/lib/placeholder.ts` is what keeps the site honest.

```ts
url: placeholder("RELEASE_URL_ANDROID")   // → "REPLACE_ME:RELEASE_URL_ANDROID"
```

The UI detects these tokens and renders a disabled, clearly-labelled state
instead of a dead link or an invented value. `validate:data` fails the build if
a token ever reaches user-visible prose.

Nothing on this site is fabricated: unknown values render as `—`,
"Not published yet", or a labelled generated preview.

---

## 17. Current data state

Honest snapshot of what is and is not configured:

| Item | State |
| --- | --- |
| GitHub owner | `rolexsir-org` (configured) |
| Repositories in Open Source | `offlinemesh`, `crispy-system` — the two that actually exist |
| Product → repository mapping | **`repository: null` for all six products** |
| Published releases | none in the organisation |
| Downloads | all show "Not published yet" |
| Screenshots | none added; placeholders shown |
| Contact | `sytmrx.dev@gmail.com`, `@saqibtantrayy` (real) |

Product repositories are `null` because no repository in the organisation could
be confidently matched to a product. Set `repository: { name: "<repo>" }` for a
product and — once a release with a matching asset is published — its download
activates automatically with no further code changes.

`npm run validate:data` currently emits 6 warnings for exactly this, which is
the intended, honest signal.

---

## Licence

All rights reserved unless a `LICENSE` file states otherwise.

---

SYTMRX — Software · Apps · Games · Digital Products

---

## Appendix — build-time network dependencies

The **GitHub layer is fully offline-tolerant**: with `api.github.com`
unreachable, all 18 routes still build and the site falls back to static
metadata (verified by intercepting and failing every GitHub request).

One separate build-time dependency remains: `next/font/google` downloads and
self-hosts the three fonts **during the build**. On a machine with no internet
at all, `next build` fails at the font step, before any application code runs.
This is standard Next.js behaviour, not a fault in the release layer, and it
does not affect runtime — the fonts are self-hosted in the output, so the
deployed site makes no external font requests.

Vercel and GitHub Actions both have network access, so this only matters for
fully air-gapped builds. To remove the dependency entirely, switch
`src/app/layout.tsx` to `next/font/local` with the font files committed under
`public/fonts/`.
