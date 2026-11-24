/**
 * Verified technology stack.
 *
 * Every entry is used by actual source in the organisation's repositories
 * (audited 2026-11-24). `level` distinguishes technologies applied in shipped
 * source from technologies currently being explored; `note` states where the
 * technology appears in real code. Technologies with no repository evidence —
 * MongoDB, Supabase — are deliberately absent.
 */

export type StackLevel = "applied" | "exploring";

export interface StackItem {
  name: string;
  level: StackLevel;
  /** Where it is actually used — repository names in the organisation. */
  note: string;
}

export interface StackGroup {
  id: string;
  title: string;
  blurb: string;
  items: StackItem[];
}

export const stackGroups: StackGroup[] = [
  {
    id: "languages",
    title: "Languages",
    blurb: "Five languages, each pulled into use by a project that needed it.",
    items: [
      { name: "Kotlin", level: "applied", note: "LumaOS Pro launcher and Guardian app — the two largest Kotlin codebases" },
      { name: "Dart", level: "applied", note: "TrackPro, Puck and ASCEND — 2.3M+ characters of Flutter application code" },
      { name: "TypeScript", level: "applied", note: "This website, Guardian's Worker backend and English Explorer" },
      { name: "JavaScript", level: "applied", note: "Brain, Ludora and the zero-dependency TrackPro billing server" },
      { name: "Python", level: "applied", note: "ColdStore OS (FastAPI) plus release-audit and ARB tooling" },
    ],
  },
  {
    id: "frontend-mobile",
    title: "Frontend & mobile",
    blurb: "Native Android where the OS matters, Flutter where one codebase must go further, React where the browser is the platform.",
    items: [
      { name: "Android", level: "applied", note: "Native apps from minSdk 24–26 to targetSdk 36, with manifest-level permission discipline" },
      { name: "Jetpack Compose", level: "applied", note: "LumaOS Pro settings, Wallpaper Studio and onboarding; Guardian's full UI" },
      { name: "Flutter", level: "applied", note: "TrackPro, Puck and ASCEND — Android-first with Drift, Health Connect and Billing plugins" },
      { name: "React", level: "applied", note: "React 19 in English Explorer, with Framer Motion" },
      { name: "Next.js", level: "applied", note: "This website — App Router, server components, ISR" },
      { name: "Tailwind CSS", level: "applied", note: "This website (v4 CSS-first tokens) and English Explorer (v4)" },
      { name: "Capacitor", level: "applied", note: "English Explorer's Android wrapper" },
      { name: "iOS", level: "exploring", note: "Puck ships iOS as source only — never built, stated as such" },
    ],
  },
  {
    id: "backend-data",
    title: "Backend & data",
    blurb: "Small, observable backends — and local databases that do most of the real work.",
    items: [
      { name: "Node.js", level: "applied", note: "TrackPro's Play Billing verification service — zero runtime dependencies, Dockerised" },
      { name: "FastAPI", level: "applied", note: "ColdStore OS authoritative server on Python 3.13" },
      { name: "SQLAlchemy", level: "applied", note: "SQLAlchemy 2 + Alembic migrations in ColdStore OS" },
      { name: "SQLite", level: "applied", note: "Drift (schema v4) in TrackPro, WAL mode in ColdStore OS, Room in Guardian" },
      { name: "Firebase", level: "applied", note: "Auth, Firestore and Analytics in English Explorer" },
      { name: "Cloudflare Workers", level: "applied", note: "Guardian backend (D1 + Durable Objects + R2) and Puck's optional answer service" },
      { name: "DataStore", level: "applied", note: "LumaOS Pro's sole persistence layer" },
      { name: "Supabase", level: "exploring", note: "Under evaluation — no repository uses it yet, so it is not claimed" },
    ],
  },
  {
    id: "engineering-release",
    title: "Engineering & release",
    blurb: "The parts that turn source into something a person can install and trust.",
    items: [
      { name: "Git & GitHub", level: "applied", note: "All source and distribution; GitHub Releases is the only binary channel" },
      { name: "Gradle", level: "applied", note: "Kotlin builds with version catalogs; release signing never falls back to the debug key" },
      { name: "Automated testing", level: "applied", note: "pytest (76), node:test (78 + worker suites), Vitest (57), flutter test and Robolectric regression suites" },
      { name: "Google Play Billing", level: "applied", note: "Play Billing library in TrackPro and Guardian with server-side purchase verification" },
      { name: "CI/CD", level: "applied", note: "Staged workflow definitions, Cloudflare Workers Builds config, Vercel deploys, Railway billing-server config" },
      { name: "Docker", level: "applied", note: "TrackPro billing server image with entrypoint and operations runbook" },
      { name: "Linux", level: "applied", note: "Primary build environment; LumaOS Pro's toolchain bootstrap script targets it" },
      { name: "VS Code", level: "applied", note: "TrackPro's documented editor setup with Dart & Flutter extensions" },
      { name: "Play release engineering", level: "applied", note: "Store checklists, data-safety drafts, version-code schemes and 12-tester gate planning" },
    ],
  },
];
