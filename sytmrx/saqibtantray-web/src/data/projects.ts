import type { Project, Repo } from "./types";
import { placeholder } from "@/lib/placeholder";

/**
 * ============================================================================
 * PRODUCT DATA — the single source of truth for this website.
 * ============================================================================
 *
 * Adding a product = adding one object to this array. No new components needed.
 *
 * IMPORTANT — nothing here may be invented:
 *   • `version` / `releaseDate` stay `null` until a build is actually published.
 *   • download `url` stays `placeholder(...)` until a real release asset exists.
 *   • `size` / `sha256` stay `null` until read off the real asset.
 *   • `screenshots[].src` stays `null` until a real image is added to /public.
 *   • `technologies` lists only stacks that are actually known.
 *   • `features` lists only capabilities that genuinely exist.
 *   • `highlights` states one implemented subsystem per entry, backed by the
 *     repository's own source, tests or engineering documents.
 *   • `detailsPending: true` marks a product whose capabilities have not been
 *     documented yet — the UI then shows an honest "details not published"
 *     state instead of padded, invented copy.
 *
 * Provenance (audited 2026-11-24 against the public repositories): every
 * project below with a `repository` was verified by reading its source tree,
 * README, engineering documents and test suites. Descriptions state what the
 * source confirms — not what is planned.
 */

export const projects: Project[] = [
  /* ---------------------------------------------------------------------- */
  /* Verified portfolio — audited against the actual repositories.           */
  /* ---------------------------------------------------------------------- */

  {
    slug: "lumaos-pro",
    name: "LumaOS Pro",
    tagline: "A standalone Android launcher and performance platform for older, low-resource phones.",
    description:
      "A standalone, lightweight Android launcher with its own home, drawer, themes, widgets, an encrypted Vault and a three-level Focus Protection system. Runs its own launcher logic — no third-party launcher or optimizer underneath.",
    longDescription: [
      "LumaOS Pro is a standalone Android launcher and performance platform aimed at older and low-resource phones. It runs its own launcher logic, resource monitoring and optimization routines, and does not depend on another launcher or a third-party optimizer to function.",
      "The home and drawer are built on platform Views while the settings, wallpaper studio and onboarding surfaces use Jetpack Compose, sharing one semantic design-token system (Luma Glass). State lives in DataStore Preferences with no DI framework; the diagnostics store is the only component that touches SQLite.",
      "Focus Protection keeps restricted apps closed during Work or Study sessions through three distinct enforcement levels: launcher interception always runs, an optional accessibility-assisted layer reads only the foreground package (window content is never retrieved), and the managed-device level is documented as an explicit gap rather than claimed.",
      "The Vault is an encrypted, offline private space for files, notes, a gallery, a recorder and a scanner, with a published threat model stating what it defends and what it does not. The current source is version 1.6.0 (versionCode 160) — source-complete and covered by a JVM/Robolectric regression suite, but not yet published to Google Play.",
    ],
    highlights: [
      {
        label: "Vault",
        detail:
          "Encrypted offline private space — 217 @Test methods across 21 vault test sources; storage under noBackupFilesDir",
      },
      {
        label: "Focus Protection",
        detail:
          "Three enforcement levels; the accessibility service reads only the foreground package — screen content is unobservable even in principle",
      },
      {
        label: "Native widgets",
        detail:
          "Clock, calendar, weather, storage, screen-time, music and battery widgets sharing Theme Lab-styled tokens",
      },
      {
        label: "Views + Compose",
        detail:
          "Home and drawer in platform Views; settings, Wallpaper Studio and onboarding in Jetpack Compose over shared tokens",
      },
    ],
    category: "mobile-app",
    status: "in-development",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "LP",
    accent: ["#8b7cf8", "#39315e"],
    screenshots: [
      {
        src: "/screenshots/lumaos-pro/onboarding-welcome.png",
        alt: "LumaOS Pro first-run walkthrough, step 1 of 7 — welcome step listing profile spaces, Focus Protection and Living Icons",
        width: 1170,
        height: 2346,
        frame: "phone",
        caption:
          "Getting-started walkthrough, step 1 of 7. Static design rendering generated from the app's own string resources and layout values — not a device screenshot.",
      },
      {
        src: "/screenshots/lumaos-pro/onboarding-focus-protection.png",
        alt: "LumaOS Pro walkthrough step 4 — Focus Protection setup screen",
        width: 1170,
        height: 2514,
        frame: "phone",
        caption:
          "Focus Protection setup, step 4 of 7. Static design rendering from the app's string resources — not a device screenshot.",
      },
    ],
    problem:
      "Older and low-resource phones are usually stuck with heavy stock launchers or launcher apps that depend on other launchers and third-party optimizers — and focus features, where they exist at all, tend to overstate what they can actually enforce.",
    solution:
      "A launcher that runs its own logic end to end, keeps state local, sizes its effects to the device, and documents the exact boundary of every enforcement mechanism instead of implying more than the OS allows.",
    features: [
      "Own launcher logic: home, drawer, folders, smart folders, gestures and voice launches",
      "Luma Glass theme system with automatic per-theme launcher icon artwork",
      "Eight native widgets with Theme Lab styling and configurable corners",
      "Focus Protection with three documented enforcement levels",
      "Vault: encrypted private files, notes, gallery, recorder and scanner",
      "Optional kiosk / managed-device deployment path via Android DevicePolicyManager",
      "Optional accessibility service with prominent disclosure, consent gate and revocation flow",
      "Backup and restore of launcher settings with Android Auto Backup rules",
    ],
    technologies: ["Kotlin", "Jetpack Compose", "Android Views", "DataStore", "Robolectric", "Gradle"],
    architecture: [
      { label: "UI", value: "Views (home/drawer) + Jetpack Compose (settings), Luma Glass token system" },
      { label: "State", value: "Hand-written holder (LumaCore) + DataStore Preferences; no DI framework" },
      { label: "Persistence", value: "DataStore only; SQLite confined to the diagnostics store" },
      { label: "Signing", value: "Upload-key driven; release variants are never debug-key fallbacks" },
      { label: "Testing", value: "74 JVM/Robolectric test classes plus focused vault suites" },
    ],
    requirements: ["Android 8.0+ (minSdk 26)", "Targets Android 16 / API 36"],
    offline: true,
    repository: { name: "lumaospro" },
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {
      android: {
        url: placeholder("RELEASE_URL_ANDROID"),
        filename: null,
        size: null,
        sha256: null,
        note: null,
      },
    },
    changelog: [],
    featured: true,
    layout: "feature",
    order: 1,
  },

  {
    slug: "trackpro",
    name: "TrackPro",
    tagline: "One app for everything you track — with focus sessions that actually lock the phone down.",
    description:
      "A Flutter habit and productivity app: commitments, water, mood, expenses, sleep, calories, steps, cycle and screen time, plus Focus Lock sessions, a home-screen widget, Health Connect sync and a Play Billing paywall with a verification backend.",
    longDescription: [
      "TrackPro is one app for everything you track daily — commitments (habits), water, mood, expenses, sleep, calories, steps, cycle, screen time and weight — plus Focus Lock sessions, a Glance home-screen widget, Health Connect sync (read-only: steps, sleep, weight) and a Play Billing paywall.",
      "All data lives in a Drift (SQLite) schema at version 4, with generated code committed fresh and enforced by CI gates. The Focus Lock bridge is built on an explicit rule: absence is not success — when a capability cannot be confirmed, every method reports it as unavailable rather than pretending something was blocked.",
      "Monetisation is a real subscription architecture, not a stub: the Flutter client is written and wired (plan merging, a paywall screen, a 7-day trial offer on the annual plan), and a zero-runtime-dependency Node 20 verification service implements Play Billing verification plus realtime developer notifications — 78/78 tests passing locally, not yet deployed.",
      "Publishing status is honest and stated in the repository itself: no Flutter artifact has ever been built, CI is staged but not active, no upload keystore exists and the Play Console listing has no assets yet. The engineering is ahead of the release; the release is not being claimed.",
    ],
    highlights: [
      {
        label: "Focus Lock",
        detail:
          "Android enforcement service with usage-access and overlay checks read fresh — never cached, never claimed when unconfirmed",
      },
      {
        label: "Play Billing paywall",
        detail:
          "Client wired end to end; Node 20 verification + RTDN service at 78/78 tests, deployment pending",
      },
      {
        label: "Drift schema v4",
        detail: "SQLite via Drift with build_runner codegen; format, analyze, test and codegen-freshness gates",
      },
      {
        label: "Health Connect",
        detail: "Read-only steps, sleep and weight permissions — nothing is written back",
      },
    ],
    category: "mobile-app",
    status: "in-development",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "TP",
    accent: ["#7fd1a6", "#2f5c46"],
    screenshots: [],
    problem:
      "Habit and productivity apps tend to track everything and enforce nothing — and the paywalls on top of them are often a trust problem rather than a billing problem.",
    solution:
      "A single tracker with a focus engine that reports enforcement state honestly, a local-first database that survives offline use, and a subscription whose purchase verification is verifiable in the open.",
    features: [
      "Nine daily trackers: commitments, water, mood, expenses, sleep, calories, steps, cycle, weight",
      "Focus Lock sessions backed by a monotonic-clock countdown and an Android enforcement service",
      "Application blocking with a per-session app picker",
      "Glance home-screen widget",
      "Health Connect read-only sync (steps, sleep, weight)",
      "Play Billing subscriptions: monthly, annual with 7-day trial offer, lifetime one-time product",
      "Fail-closed Pro entitlement: without a verification backend, Pro stays locked",
      "Local notifications and boot-persistent scheduling",
    ],
    technologies: ["Flutter", "Dart", "Kotlin", "Drift (SQLite)", "Google Play Billing", "Node.js", "Docker"],
    architecture: [
      { label: "App", value: "Flutter + provider, Android-only host (Health Connect, Billing, notifications)" },
      { label: "Data", value: "Drift (SQLite) schema v4, generated code committed fresh" },
      { label: "Billing backend", value: "Node 20, zero runtime dependencies; Docker + Railway deployment config" },
      { label: "Testing", value: "Flutter unit/widget suites (focus engine, billing, repositories) + 78 server tests" },
    ],
    requirements: ["Android 13/14/15 supported in Play testing plans", "Health Connect for health metrics"],
    offline: true,
    repository: { name: "trackpro" },
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {
      android: {
        url: placeholder("RELEASE_URL_ANDROID"),
        filename: null,
        size: null,
        sha256: null,
        note: null,
      },
    },
    changelog: [],
    featured: true,
    layout: "horizontal",
    order: 2,
  },

  {
    slug: "coldstore-os",
    name: "ColdStore OS",
    tagline: "Management platform for a controlled-atmosphere apple cold-storage facility — 50+ chambers.",
    description:
      "A FastAPI management platform for a large CA apple cold-storage facility: verified inventory, deterministic billing, RBAC, audited mutations and monitoring-only telemetry. Implemented as a tested vertical slice; not yet certified for production.",
    longDescription: [
      "ColdStore OS is a production-targeted management platform for a large Controlled-Atmosphere (CA) apple cold-storage facility of 50+ chambers. The authoritative server is FastAPI on Python 3.13 with SQLAlchemy 2, Alembic migrations and SQLite WAL; a desktop-optimised office web app and an installable offline-capable Android PWA are served by the same server.",
      "The engineering rules are strict and enforced by tests: every mutation is transactional, audited with before/after values, RBAC-enforced server-side and idempotent via client-supplied operation IDs. Billing is deterministic — rates are snapshotted onto invoice lines, money is stored as integer paise, quantities as NUMERIC(14,3) kg, and all line math is quantized ROUND_HALF_UP so no float ever accumulates.",
      "Stock conservation is enforced by database constraints plus a movement ledger; corrections never overwrite — receipts supersede in a chain and stock deltas become approved adjustments with maker ≠ checker. Two-factor auth (RFC 6238 TOTP) is implemented for all accounts.",
      "Status per the repository readiness checklist: Milestone 0 (audit + architecture) complete and Milestone 1 (verified inventory + billing) implemented as a tested vertical slice — 76 pytest tests covering inventory math, billing determinism, RBAC, idempotency and concurrency. The system is not yet certified for production use.",
    ],
    highlights: [
      {
        label: "Deterministic billing",
        detail: "Integer paise, quantized ROUND_HALF_UP, tariff snapshots on every invoice line",
      },
      {
        label: "Audited mutations",
        detail: "Transactional, RBAC-enforced, idempotent via client-supplied operation IDs; audit_log with before/after",
      },
      {
        label: "76 pytest tests",
        detail: "Inventory math, billing determinism, RBAC, idempotency, concurrency and a p95-perf guard at 18k lots",
      },
      {
        label: "TOTP 2FA",
        detail: "RFC 6238 enrollment per user; pilot policy requires it for manager/admin",
      },
    ],
    category: "web-app",
    status: "in-development",
    platforms: ["web"],
    version: null,
    releaseDate: null,
    icon: "CS",
    accent: ["#9db8e8", "#31405c"],
    screenshots: [],
    problem:
      "Cold-storage facilities run on spreadsheets and paper ledgers where billing disputes, stock drift and silent data overwrites are routine — and generic inventory software assumes a reliable network and forgiving money math.",
    solution:
      "An authoritative local facility server whose billing is deterministic, whose stock is conserved by database constraints and a movement ledger, and whose every change is audited and idempotent — with an offline-capable PWA for intake and dispatch.",
    features: [
      "Facility, zone, chamber and party masters with season and tariff configuration",
      "Verified inventory with a movement ledger and non-negative stock constraints",
      "Deterministic billing with superseding corrections and approved adjustments (maker ≠ checker)",
      "Monitoring-only CA telemetry: ingest, thresholds, alerts, quarantine — no control path, enforced by a static source scan",
      "Offline-capable installable PWA with an intake/dispatch outbox",
      "Role-based access control with audit log and idempotent operations",
      "Printable documents from audited data",
    ],
    technologies: ["Python", "FastAPI", "SQLAlchemy 2", "Alembic", "SQLite (WAL)", "pytest", "PWA"],
    architecture: [
      { label: "Server", value: "FastAPI (Python 3.13), SQLAlchemy 2, Alembic migrations, SQLite WAL" },
      { label: "Money", value: "Integer minor units (paise); NUMERIC(14,3) kg; quantized ROUND_HALF_UP" },
      { label: "Telemetry", value: "Isolated DB, device-token ingest, monitoring-only — control verbs statically banned" },
      { label: "Client", value: "Vanilla JS office app + installable Android PWA served by the facility server" },
    ],
    requirements: ["Local facility server (authoritative)", "Modern browser for the office app and PWA"],
    offline: true,
    repository: { name: "coldstore-" },
    liveUrl: null,
    releaseSource: "none",
    downloads: {},
    changelog: [],
    featured: true,
    layout: "showcase",
    order: 3,
  },

  {
    slug: "brain",
    name: "Brain",
    tagline: "A private, offline-first personal assistant PWA that never leaves the device.",
    description:
      "A natural-language personal assistant PWA: tasks, reminders, notes, people, expenses, debts, inventory, habits, journal and photos — all stored in the browser on the device. No account, no cloud sync, no analytics, no application server.",
    longDescription: [
      "Brain is a private, offline-first personal assistant PWA. Personal information stays in the browser on the device being used — there is no Brain account, cloud sync service, analytics or application server.",
      "Ordinary language creates and finds tasks, reminders, notes, people, expenses, debts, inventory, habits, journal entries, events and photos. External actions hand off through standard device or web APIs; Brain never silently sends messages, publishes posts or changes a third-party account.",
      "It is a static ES-module web app with a service-worker-cached shell, so the core interface and local data keep working offline after the first load. The current 2.5.0 iteration redesigned the workspace (responsive layouts, desktop sidebar, mobile navigation, a real-data home dashboard and module views) behind an automated test suite with release gates: npm test, npm run build and npm run audit.",
      "The documentation is unusually blunt about limits: local-only does not mean encrypted, installation does not turn a web app into a background alarm service, and browser support caveats are stated rather than hidden.",
    ],
    highlights: [
      {
        label: "Ten record types",
        detail: "Tasks, reminders, notes, people, expenses, debts, inventory, habits, journal, photos — via natural language",
      },
      {
        label: "Zero backend",
        detail: "Static ES modules + service worker; no account, no cloud sync, no analytics",
      },
      {
        label: "Honest limits",
        detail: "Threat model, privacy audit and browser-support caveats published alongside the code",
      },
    ],
    category: "web-app",
    status: "built",
    platforms: ["web"],
    version: null,
    releaseDate: null,
    icon: "BR",
    accent: ["#e6c894", "#6a5b3f"],
    screenshots: [],
    problem:
      "Personal assistants require accounts, sync and analytics by default — which means your tasks, finances and journal live on someone else's server, and the assistant stops working when the network does.",
    solution:
      "Keep everything in the browser profile on the device, hand external actions through standard APIs with explicit confirmation, and document what the app stores, what it refuses and what it cannot promise.",
    features: [
      "Natural-language capture and lookup across ten record types",
      "One-time and recurring tasks and reminders with snooze and calendar export",
      "Backup and restore of all local data",
      "Optional Instagram exchange service as an explicitly confirmed, separate flow",
      "Installable PWA with offline app-shell caching",
      "Security headers (CSP, HSTS, nosniff) in the production static server",
    ],
    technologies: ["JavaScript", "ES Modules", "Service Workers", "PWA", "node:test"],
    architecture: [
      { label: "Runtime", value: "Static ES-module web app; no build step, no framework runtime" },
      { label: "Storage", value: "Browser-local site data only; nothing transmitted without an explicit action" },
      { label: "Serving", value: "Static server with headers, allowlist, gzip and ETags" },
      { label: "Testing", value: "Automated suite + audit gate; release checklist for offline and install checks" },
    ],
    requirements: ["Modern browser with service-worker support", "HTTPS for install, notifications and device APIs"],
    offline: true,
    repository: { name: "brain" },
    liveUrl: null,
    releaseSource: "none",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 4,
  },

  {
    slug: "guardian",
    name: "Guardian",
    tagline: "A personal-safety Android app: one-button SOS, a trusted circle and an encrypted evidence vault.",
    description:
      "A personal-safety Android app built on an offline-first core — emergency calling, SMS, medical ID and local records work with no network and no account — with a Cloudflare Worker backend for family groups, live presence, SOS dispatch and encrypted evidence storage.",
    longDescription: [
      "Guardian is a personal-safety Android application: one-button emergency alerts, live location sharing with a trusted circle, community safety reporting, encrypted on-device records and an optional Guardian Pro subscription.",
      "It is offline-first and local-first: emergency calling, emergency SMS, medical ID, contacts and local records keep working with no network and no account. The Cloudflare backend adds the parts that genuinely need a server — family groups, live presence, remote SOS dispatch and an encrypted evidence vault.",
      "The backend is a single Cloudflare Worker: email + password auth with PBKDF2 and HMAC tokens, relational data in D1, live presence and realtime fan-out in a Durable Object, evidence files under server-generated keys in a private R2 bucket, and a cron sweep for stale presence and retention. Authorization is enforced server-side — a client cannot read another family's data by editing an id.",
      "Built as a Shipaton 2026 submission (Next Gen category) and released under the MIT license. The Kotlin app uses Jetpack Compose with biometric-protected screens, an audio black-box recorder, sensor-based safety monitoring and voice emergency detection.",
    ],
    highlights: [
      {
        label: "Offline-first SOS",
        detail: "Emergency call, SMS compose, medical ID and records with no network and no account",
      },
      {
        label: "Single-Worker backend",
        detail: "Cloudflare Worker + D1 + Durable Objects + R2; 57 backend tests",
      },
      {
        label: "Server-side authz",
        detail: "PBKDF2 + HMAC tokens; evidence written under server-generated keys in a non-public bucket",
      },
      {
        label: "Encrypted device records",
        detail: "SecureEncryptedPreferences + biometric-protected screens + audio black-box recorder",
      },
    ],
    category: "mobile-app",
    status: "built",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "GD",
    accent: ["#8fb8a8", "#31473f"],
    screenshots: [],
    problem:
      "Safety apps usually assume connectivity, accounts and cloud storage — precisely the things that fail in an emergency, and the things that put sensitive evidence on third-party servers.",
    solution:
      "Keep the emergency path fully local, put only what must be shared on a minimal server, and enforce authorization server-side so a tampered client cannot reach another family's data.",
    features: [
      "One-button SOS with a hardware-alert manager and voice emergency detection",
      "Emergency calling and SMS composition via native managers",
      "Live location sharing with a trusted circle (foreground location service)",
      "Encrypted on-device records with biometric lock",
      "Audio black-box recorder",
      "Family groups, live presence and remote SOS dispatch (Durable Object SafetyHub)",
      "Encrypted evidence vault in a private R2 bucket",
      "Optional Guardian Pro subscription (Play Billing subscription manager)",
    ],
    technologies: ["Kotlin", "Jetpack Compose", "Room (SQLite)", "Cloudflare Workers", "D1", "Durable Objects", "R2", "TypeScript", "Vitest"],
    architecture: [
      { label: "App", value: "Kotlin + Jetpack Compose; local database with encrypted preferences" },
      { label: "Backend", value: "One Cloudflare Worker: auth, D1 relational data, SafetyHub Durable Object, R2 evidence" },
      { label: "Auth", value: "Email + password (PBKDF2 + HMAC tokens), server-side authorization" },
      { label: "Maintenance", value: "Cron sweep for stale presence and retention purge" },
    ],
    requirements: ["Android device", "Optional Cloudflare deployment for the family/presence features"],
    offline: true,
    repository: { name: "guardian-" },
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {
      android: {
        url: placeholder("RELEASE_URL_ANDROID"),
        filename: null,
        size: null,
        sha256: null,
        note: null,
      },
    },
    changelog: [],
    featured: false,
    layout: "compact",
    order: 5,
  },

  {
    slug: "puck",
    name: "Puck",
    tagline: "One button. Four gestures. No menus — the one thing you need to know, a joke, SOS, or an answer.",
    description:
      "A gesture-driven assistant: tap for the one thing worth knowing, double-tap for a joke, hold for SOS, swipe-up to ask. Works offline on first launch; the optional open-ended answer path is gated behind an explicit privacy switch and a default build that sends nothing.",
    longDescription: [
      "Puck is one button with four gestures and no menus, onboarding or configuration. Tap gives the one thing worth knowing, ranked by actionability; double tap gives a dry line from a persisted shuffle bag of 100 jokes; holding three seconds starts a cancellable SOS that turns on the torch and opens Messages with your location pre-filled — Puck never sends anything itself; swipe up answers anything, with coin, dice, arithmetic and dates computed exactly on device.",
      "The intelligence split is deliberate: things that must be correct or instant are computed locally with no network; things that must be open-ended go to one model (Groq, gpt-oss-20b) through a single seam — LlmProvider in, a stream of text out — with one gate the privacy switch controls. The model can only sharpen a line the device already chose; it is never allowed to originate facts, and a bad model day degrades to the local answer.",
      "Voice is on-device: Silero VAD and a Moonshine tiny recogniser feed a hand-written parser that does phone commands itself (volume, torch, apps, battery, time, arithmetic, timers) and deliberately refuses to send messages, place calls, delete things or share location — with a spoken reason. Models download on demand from Settings, never bundled, never fetched silently.",
      "Ships completely in English and Spanish with RTL groundwork, a browser-runnable gesture preview, and a tested but undeployed Cloudflare Worker for the optional shared answer service. The voice pipeline and physical-device checklist have not yet been run on hardware — stated in the repository rather than smoothed over.",
    ],
    highlights: [
      {
        label: "Four gestures",
        detail: "One custom recogniser owns the bubble — a state machine classifies by distance, time and velocity",
      },
      {
        label: "On-device voice",
        detail: "Silero VAD + Moonshine ASR in isolates; hand-written command parser; refusals are deliberate",
      },
      {
        label: "Gated cloud",
        detail: "One LLM seam behind the privacy switch; default build sends nothing; cost bounded on device",
      },
      {
        label: "EN + ES",
        detail: "Complete localisation from one keyed map; ARB regenerated by tooling and enforced by tests",
      },
    ],
    category: "experiment",
    status: "experimental",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "PK",
    accent: ["#d8d8e0", "#3c3c46"],
    screenshots: [
      {
        src: "/screenshots/puck/gesture-hero.png",
        alt: "Puck hero graphic — a phone with one button and the four gestures labelled: tap, double tap, hold 3 seconds, swipe up",
        width: 1408,
        height: 768,
        frame: "raw",
        caption:
          "The four gestures, from the project's own hero graphic. Tap, double tap and hold work offline in airplane mode with nothing configured.",
      },
    ],
    problem:
      "Assistants demand configuration, accounts and constant connectivity for things a device can decide on its own — and SOS flows that send automatically are dangerous in a pocket.",
    solution:
      "Collapse the assistant into one button and four gestures, compute the correct-or-instant answers locally, gate the open-ended path behind one explicit switch, and make the emergency path manual, cancellable and honest.",
    features: [
      "Tap: the one actionable card (calendar, battery, weather, time) painted on the same frame as the touch",
      "Double tap: a dry line from a persisted 100-joke shuffle bag",
      "Hold 3s: cancellable SOS — torch on, Messages opened with location pre-filled, never sent automatically",
      "Swipe up: exact offline answers for coin, dice, arithmetic and dates; optional streamed answers when a key is set",
      "On-device voice commands with a hand-written parser and deliberate refusals",
      "English and Spanish localisation with RTL groundwork",
      "Everything works offline on first launch with no configuration",
    ],
    technologies: ["Flutter", "Dart", "Silero VAD", "Moonshine ASR", "Groq API (optional)", "Cloudflare Workers", "node:test"],
    architecture: [
      { label: "Gestures", value: "One custom recogniser + spring physics; no stock recognizer arena" },
      { label: "Intelligence", value: "Local ranker + intent router; one GatedLlmProvider seam; client-side validators" },
      { label: "Voice", value: "VAD + ASR isolates; command parser outside the model; spoken output via the phone's engine" },
      { label: "Privacy", value: "Permissions requested lazily per gesture; erase-everything path; what-leaves-the-phone screen" },
    ],
    requirements: ["Android 7+ (iOS source only, never built)", "Optional Groq key for open-ended answers"],
    offline: true,
    repository: { name: "puck" },
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {
      android: {
        url: placeholder("RELEASE_URL_ANDROID"),
        filename: null,
        size: null,
        sha256: null,
        note: null,
      },
    },
    changelog: [],
    featured: false,
    layout: "compact",
    order: 6,
  },

  {
    slug: "ascend",
    name: "ASCEND",
    tagline: "A privacy-first, on-device personal improvement coach.",
    description:
      "A Flutter coach app that keeps everything on the device: consent-led onboarding, rule-based 90-day plans, a camera scan gated by on-device MediaPipe landmarks, AES-GCM-encrypted captures and a published source audit stating exactly what is and is not verified.",
    longDescription: [
      "ASCEND is a privacy-first, on-device personal improvement coach built with Flutter. Consent onboarding, local rule-based coaching and 90-day plans, scan capture with quality gates, a native MediaPipe Face Landmarker bridge, local SQLite migrations, encrypted private photos and structured payloads, progress and deletion controls, and RevenueCat integration scaffolding.",
      "No generated AI results, no diagnosis, no identity or ethnicity inference, no attractiveness ranking — the coaching is rule-based and local by design. Front-camera-only scan consent, pixel checks and capture-geometry checks gate the scan; accepted photos are AES-GCM encrypted before app-private persistence, and rejected captures are deleted.",
      "The repository contains a published source implementation audit with an unusual level of honesty: acceptance is explicitly not verified (no Flutter/Gradle/device run in that environment), and the audit documents a supply-chain mitigation where the MediaPipe telemetry logger is stripped from the pinned AAR, SHA-256-checked, and fail-closed if the class layout changes.",
    ],
    highlights: [
      {
        label: "On-device coaching",
        detail: "Rule-based 90-day plans; no generated AI results, diagnosis or ranking claims",
      },
      {
        label: "Encrypted captures",
        detail: "AES-GCM before app-private persistence; key-loss handling; typed whole-data erasure",
      },
      {
        label: "Telemetry stripped",
        detail: "Pinned MediaPipe AARs, SHA-256 checked, telemetry logger removed with a fail-closed test",
      },
    ],
    category: "mobile-app",
    status: "experimental",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "AS",
    accent: ["#d9a17a", "#5c4232"],
    screenshots: [],
    problem:
      "Appearance-adjacent coach apps routinely ship facial data to servers, infer attributes they should not, and bury telemetry inside bundled ML models.",
    solution:
      "Keep the entire pipeline on the device, gate the camera with geometry and consent, encrypt captures at rest, and treat the ML dependency itself as a supply-chain problem to be audited and patched.",
    features: [
      "Consent-led 18+ onboarding with persisted preferences",
      "Rule-based local coaching with persisted 90-day free/Pro plans",
      "Front-camera scan consent, preview/discard, pixel and geometry quality gates",
      "On-device MediaPipe face landmarks (blendshapes and transform matrices disabled)",
      "AES-GCM encrypted photos and payloads with key-loss handling",
      "Individual and whole-data deletion controls",
      "RevenueCat purchase/restore/entitlement scaffolding (no default grants)",
      "Optional local reminders",
    ],
    technologies: ["Flutter", "Dart", "MediaPipe", "SQLite", "AES-GCM", "RevenueCat"],
    architecture: [
      { label: "ML", value: "Pinned MediaPipe tasks-core 1.2.2, SHA-256 checked, telemetry classes stripped, fail-closed" },
      { label: "Data", value: "SQLite schema v1/v2 with foreign keys, indexes and encrypted payloads" },
      { label: "Monetisation", value: "RevenueCat scaffolding; publisher-supplied product IDs; no default entitlements" },
      { label: "Audit", value: "Published source audit listing performed checks and not-run verification explicitly" },
    ],
    requirements: ["Android device (minSdk 24)", "No network required for core features"],
    offline: true,
    repository: { name: "ASCEND" },
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {
      android: {
        url: placeholder("RELEASE_URL_ANDROID"),
        filename: null,
        size: null,
        sha256: null,
        note: null,
      },
    },
    changelog: [],
    featured: false,
    layout: "compact",
    order: 7,
  },

  {
    slug: "kids-learning-app",
    name: "English Explorer",
    tagline: "A gamified English-learning adventure for children, with a parent dashboard.",
    description:
      "A gamified educational application for children mastering English through interactive spelling games, storytelling and creative activities — adventure-map worlds, a mascot with real-time feedback, star and coin rewards, daily quests and a parent dashboard.",
    longDescription: [
      "English Explorer is a gamified educational application designed for children to master English through interactive spelling games, storytelling and creative activities.",
      "Progress runs through themed worlds on an adventure map (Farm, Jungle, Space and more) with Barnaby Bear, an interactive mascot providing real-time feedback. Stars (XP) and coins unlock characters and stickers; daily quests keep learners engaged; a story-time mode listens to stories built from mastered words; a creative canvas offers colouring templates for every word learned.",
      "Built with React 19, TypeScript and Tailwind CSS 4, wrapped for Android with Capacitor and backed by Firebase (Auth, Firestore, Analytics). The parent dashboard tracks learning progress, accuracy and time spent. Offline-first: automatic background synchronisation with Firebase when back online.",
    ],
    highlights: [
      {
        label: "Adventure map",
        detail: "Themed worlds with progress gating and reward currency",
      },
      {
        label: "Parent dashboard",
        detail: "Learning progress, accuracy and time-spent tracking",
      },
      {
        label: "Offline-first sync",
        detail: "Local-first play with automatic background Firebase sync when back online",
      },
    ],
    category: "mobile-app",
    status: "in-development",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "KL",
    accent: ["#d9a17a", "#6b4a38"],
    screenshots: [],
    problem:
      "Children's learning apps often flatten practice into flashcards, and parents get no real visibility into what was actually practised.",
    solution:
      "Turn practice into a rewarded adventure with concrete feedback loops, and give parents a dashboard grounded in the same data the child plays with.",
    features: [
      "Adventure map with themed worlds (Farm, Jungle, Space and more)",
      "Interactive mascot (Barnaby Bear) with real-time feedback",
      "Stars (XP) and coins unlockable characters and stickers",
      "Daily quests",
      "Story time using mastered words",
      "Creative canvas colouring templates",
      "Parent dashboard: progress, accuracy, time spent",
    ],
    technologies: ["React 19", "TypeScript", "Tailwind CSS 4", "Framer Motion", "Capacitor", "Firebase", "Vite", "Vitest"],
    architecture: [
      { label: "Frontend", value: "React 19 + TypeScript + Tailwind CSS 4, animated with Framer Motion" },
      { label: "Native", value: "Capacitor Android wrapper" },
      { label: "Backend", value: "Firebase Auth, Firestore, Analytics" },
      { label: "Tooling", value: "Vite, Vitest, ESBuild" },
    ],
    requirements: ["Android device", "Firebase project for sync features"],
    offline: false,
    repository: { name: "learn" },
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {
      android: {
        url: placeholder("RELEASE_URL_ANDROID"),
        filename: null,
        size: null,
        sha256: null,
        note: null,
      },
    },
    changelog: [],
    featured: false,
    layout: "compact",
    order: 8,
  },

  {
    slug: "ludora",
    name: "Ludora",
    tagline: "A fast, premium Ludo board game — pure static PWA, no backend at runtime.",
    description:
      "A Ludo board game delivered as a pure static PWA: game engine, AI opponents, pass-and-play, a daily challenge and WebRTC peer-to-peer multiplayer with QR invite codes — all in the browser, offline-first via a service worker.",
    longDescription: [
      "Ludora is a fast, premium Ludo board game delivered as a pure static PWA. It requires no backend, no serverless functions, no Node.js at runtime and no environment variables — the game engine, AI, pass-and-play, daily challenge and peer-to-peer multiplayer run entirely in the browser, offline-first via a service worker.",
      "Peer-to-peer multiplayer uses WebRTC with QR invite codes, so two devices can play without any game server. The deployed site serves the repository root as static files with no build step.",
    ],
    highlights: [
      {
        label: "Engine + AI",
        detail: "Modular JS game engine with AI opponents, pass-and-play and a daily challenge",
      },
      {
        label: "Serverless multiplayer",
        detail: "WebRTC peer-to-peer with QR invite codes — no game server involved",
      },
      {
        label: "Deployed",
        detail: "Live as a static PWA; no runtime backend, no environment variables",
      },
    ],
    category: "game",
    status: "released",
    platforms: ["web"],
    version: "1.4.0",
    releaseDate: null,
    icon: "LD",
    accent: ["#d98f8f", "#5c3a3a"],
    screenshots: [],
    problem:
      "Board-game ports usually bolt on accounts, servers and ads for features the browser already supports natively.",
    solution:
      "Ship the entire game — engine, AI and multiplayer — as static files that install as a PWA and keep working offline, with peer-to-peer WebRTC for remote play.",
    features: [
      "Ludo game engine with AI opponents",
      "Pass-and-play local multiplayer",
      "Daily challenge",
      "WebRTC peer-to-peer multiplayer with QR invite codes",
      "Offline-first service worker",
      "Installable PWA with maskable icons",
    ],
    technologies: ["JavaScript", "WebRTC", "Service Workers", "PWA"],
    architecture: [
      { label: "Runtime", value: "Pure static files; no build step at deploy time" },
      { label: "Multiplayer", value: "WebRTC peer-to-peer; QR invite codes; no game server" },
      { label: "Deploy", value: "Static hosting (Vercel); repository root served as-is" },
    ],
    requirements: ["Modern browser with WebRTC support"],
    offline: true,
    repository: { name: "ludox" },
    liveUrl: "https://ludox-nine.vercel.app",
    releaseSource: "none",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 9,
  },

  {
    slug: "sytmrx-site",
    name: "SYTMRX Website",
    tagline: "This site — the product discovery and software distribution platform for everything above.",
    description:
      "A Next.js presentation layer with GitHub Releases as the distribution layer: typed project metadata, automatic release resolution, validated download links, security headers and honest pending states. No database, no backend, no tracking.",
    longDescription: [
      "The SYTMRX website is the presentation layer for every product above; GitHub Releases is the distribution layer, and no binaries are stored in the repository. One typed project object drives each product's card, detail page, catalogue listing, metadata, Open Graph image, sitemap entry and download UI.",
      "Release and repository data is fetched server-side through a single cached, timeout-bounded GitHub client and refreshed hourly — a newly published release appears without a redeploy. Build-time validation enforces the data semantics: placeholder tokens never leak into prose, download URLs point only at trusted GitHub hosts, and nothing can present an unreleased version as released.",
      "The site ships with a strict Content-Security-Policy, no analytics, no forms and no database. When GitHub is unreachable, every surface degrades to honest static metadata instead of breaking.",
    ],
    highlights: [
      {
        label: "Single source of truth",
        detail: "One typed project object drives cards, pages, metadata, sitemap and downloads",
      },
      {
        label: "Release automation",
        detail: "Server-side GitHub resolution, cached hourly, with validated download integrity",
      },
      {
        label: "Anti-fabrication gates",
        detail: "Build-time validator blocks placeholder leaks, bad URLs and false release claims",
      },
    ],
    category: "web-app",
    status: "in-development",
    platforms: ["web"],
    version: null,
    releaseDate: null,
    icon: "SX",
    accent: ["#c9a469", "#6a5b3f"],
    screenshots: [],
    problem:
      "Product sites drift from reality: downloads point at dead links, marketing outpaces the code, and every new product means a new hand-built page.",
    solution:
      "Make repository data the only source, validate it at build time, distribute binaries exclusively through GitHub Releases, and let every unknown value render as an honest pending state.",
    features: [
      "Product catalogue and project pages driven by typed metadata",
      "Automatic GitHub Releases resolution with hourly revalidation",
      "Checksum-validated download cards with honest pending states",
      "Per-product Open Graph images and sitemap generation",
      "Strict CSP and security headers, no analytics, no tracking",
      "Build-time data validation pipeline",
    ],
    technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Framer Motion"],
    architecture: [
      { label: "Framework", value: "Next.js App Router, fully prerendered with hourly ISR for GitHub data" },
      { label: "Data", value: "Typed project objects in-repo; no database, no backend" },
      { label: "Distribution", value: "GitHub Releases assets linked directly — no build artifacts stored here" },
      { label: "Security", value: "Strict CSP, nosniff, DENY framing, no third-party origins" },
    ],
    requirements: ["Modern browser"],
    offline: false,
    repository: { name: "SYTMRX" },
    liveUrl: "https://sytmrx.vercel.app",
    releaseSource: "none",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 10,
  },

  /* ---------------------------------------------------------------------- */
  /* Undocumented products — kept from the original site data. Their         */
  /* existence is public; their capabilities have not been documented yet,   */
  /* so they render the honest "details not published" state. No repository  */
  /* is configured for them, so no source link is claimed.                   */
  /* ---------------------------------------------------------------------- */

  {
    slug: "offline-institute-management",
    name: "Offline Institute Management",
    tagline: "Institute operations that keep working without a connection.",
    description:
      "An offline-first institute management system for students, admissions, fees, attendance, batches and records — built to run without constant internet connectivity.",
    longDescription: [
      "Offline Institute Management is a system for running the day-to-day operations of an institute: student records, admissions, fees, attendance, batches and general record keeping.",
      "It is built offline-first. The application is designed to work without a constant internet connection, so the people using it are never blocked by a network that is slow, intermittent or entirely unavailable.",
    ],
    category: "mobile-app",
    status: "in-development",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "OI",
    accent: ["#c9a469", "#6a5b3f"],
    screenshots: [
      {
        src: null,
        alt: "Offline Institute Management — student records screen",
        frame: "phone",
        caption: null,
      },
      {
        src: null,
        alt: "Offline Institute Management — attendance and batches view",
        frame: "phone",
        caption: null,
      },
    ],
    problem:
      "Institute administration often has to continue during network outages, yet most management software assumes a live connection and stops being usable the moment that assumption fails.",
    solution:
      "Keep the operational workflow local to the device so records, admissions, fees and attendance can all be handled without waiting on connectivity.",
    features: [
      "Student records management",
      "Admissions handling",
      "Fees management",
      "Attendance tracking",
      "Batch management",
      "Works without a constant internet connection",
    ],
    technologies: ["Android"],
    architecture: [
      { label: "Approach", value: "Offline-first, local to the device" },
      { label: "Network", value: "Not required for day-to-day operation" },
    ],
    requirements: [
      "Android device",
    ],
    offline: true,
    repository: null,
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {
      android: {
        url: placeholder("RELEASE_URL_ANDROID"),
        filename: null,
        size: null,
        sha256: null,
        note: null,
      },
    },
    changelog: [],
    featured: false,
    layout: "compact",
    order: 11,
  },

  {
    slug: "yourcart",
    name: "YourCart",
    tagline: "A local marketplace connecting customers and merchants.",
    description:
      "A local marketplace and commerce application built around products, merchant management, ordering and marketplace functionality.",
    longDescription: [
      "YourCart is a local marketplace and commerce application. It connects customers with merchants, covering product listings, merchant management and the ordering flow.",
    ],
    category: "mobile-app",
    status: "in-development",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "YC",
    accent: ["#8fb8a8", "#3f5a52"],
    screenshots: [
      {
        src: null,
        alt: "YourCart — marketplace product listing",
        frame: "phone",
        caption: null,
      },
      {
        src: null,
        alt: "YourCart — merchant management view",
        frame: "phone",
        caption: null,
      },
    ],
    problem:
      "Customers and nearby merchants often have no shared digital space for browsing products and placing orders locally.",
    solution:
      "Provide a marketplace where merchants manage their products and customers browse and order through a single application.",
    features: [
      "Product listings",
      "Merchant management",
      "Ordering",
      "Marketplace functionality",
    ],
    technologies: [],
    architecture: [],
    requirements: ["Android device"],
    offline: false,
    repository: null,
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 12,
  },

  {
    slug: "mesh-messenger",
    name: "Mesh Messenger",
    tagline: "Device-to-device communication without conventional infrastructure.",
    description:
      "An experimental communication project exploring direct device-to-device messaging that does not rely on conventional internet infrastructure.",
    longDescription: [
      "Mesh Messenger is an experimental project exploring device-to-device communication — messaging that works directly between devices rather than depending on conventional internet infrastructure.",
      "It is an active area of experimentation rather than a finished product. Capabilities are documented here only once they are actually implemented.",
    ],
    category: "experiment",
    status: "experimental",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "MM",
    accent: ["#93a7c9", "#3c4759"],
    screenshots: [
      {
        src: null,
        alt: "Mesh Messenger — device-to-device messaging interface",
        frame: "phone",
        caption: null,
      },
    ],
    problem:
      "Conventional messaging depends on infrastructure that is not always present — during outages, in remote areas, or wherever network coverage is unreliable.",
    solution:
      "Explore direct device-to-device communication as an alternative path for messages when conventional infrastructure is unavailable.",
    features: ["Device-to-device communication", "Operates without conventional internet infrastructure"],
    technologies: [],
    architecture: [
      { label: "Stage", value: "Experimental — under active exploration" },
    ],
    requirements: ["Android device"],
    offline: true,
    repository: null,
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 13,
  },

  {
    slug: "bloom",
    name: "Bloom",
    tagline: "A SYTMRX digital product.",
    description: "A digital product in development at SYTMRX.",
    longDescription: [],
    category: "mobile-app",
    status: "in-development",
    platforms: [],
    version: null,
    releaseDate: null,
    icon: "BL",
    accent: ["#c58fa8", "#5a3a47"],
    screenshots: [],
    problem: null,
    solution: null,
    features: [],
    technologies: [],
    architecture: [],
    requirements: [],
    offline: false,
    repository: null,
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 14,
    detailsPending: true,
  },

  {
    slug: "stack",
    name: "Stack",
    tagline: "A SYTMRX digital product.",
    description: "A digital product in development at SYTMRX.",
    longDescription: [],
    category: "mobile-app",
    status: "in-development",
    platforms: [],
    version: null,
    releaseDate: null,
    icon: "ST",
    accent: ["#9a9ac2", "#43435c"],
    screenshots: [],
    problem: null,
    solution: null,
    features: [],
    technologies: [],
    architecture: [],
    requirements: [],
    offline: false,
    repository: null,
    liveUrl: null,
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 15,
    detailsPending: true,
  },
];

/**
 * ============================================================================
 * TEMPLATE — copy this block into the array above to add a new product.
 * ============================================================================
 *
 * {
 *   slug: "my-product",
 *   name: "My Product",
 *   tagline: "One line describing what it does.",
 *   description: "One or two sentences for cards and metadata.",
 *   longDescription: ["Paragraph one.", "Paragraph two."],
 *   highlights: [{ label: "Subsystem", detail: "Source-backed implementation fact." }],
 *   category: "mobile-app",           // mobile-app | desktop-app | web-app | game | tool | library | experiment
 *   status: "in-development",         // released | built | beta | in-development | experimental | concept | archived
 *   platforms: ["android"],           // android | windows | macos | linux | ios | web
 *   version: null,                    // "1.0.0" once released
 *   releaseDate: null,                // "2026-01-31" once released
 *   icon: "MP",                       // 2-letter monogram
 *   accent: ["#c9a469", "#6a5b3f"],   // gradient for generated previews
 *   screenshots: [{ src: null, alt: "Describe the screen", frame: "phone" }],
 *   problem: null,                    // string once documented
 *   solution: null,
 *   features: [],                     // only real, implemented capabilities
 *   technologies: [],                 // only stacks that are actually known
 *   architecture: [],
 *   requirements: [],
 *   offline: false,
 *   repository: null,                 // { name: "<repo>" } once a repo exists
 *   liveUrl: null,
 *   downloads: {},
 *   changelog: [],
 *   featured: false,
 *   layout: "compact",                // feature | horizontal | compact | showcase
 *   order: 16,
 * }
 */

/**
 * Repositories surfaced in the "Open source & experiments" section.
 * Listed manually — no fabricated stats. Star counts are only ever shown when
 * the GitHub API actually returns them.
 */
export const repos: Repo[] = [
  /**
   * Repositories shown in the "Open source" section.
   *
   * These are the repositories that actually exist under the configured
   * GitHub owner (audited 2026-11-24). Descriptions and languages are filled
   * in live from the GitHub API when it is reachable; the values below are
   * only the offline fallback. `projectSlug` links each card to its product
   * page on this site.
   */
  {
    name: "lumaospro",
    description:
      "Standalone Android launcher: Luma Glass theming, native widgets, encrypted Vault and three-level Focus Protection.",
    language: "Kotlin",
    projectSlug: "lumaos-pro",
  },
  {
    name: "trackpro",
    description:
      "Flutter habit and productivity app with Focus Lock, Play Billing paywall and a Node billing-verification backend.",
    language: "Dart",
    projectSlug: "trackpro",
  },
  {
    name: "coldstore-",
    description:
      "FastAPI management platform for a CA apple cold-storage facility: deterministic billing, RBAC, audited mutations, telemetry.",
    language: "Python",
    projectSlug: "coldstore-os",
  },
  {
    name: "guardian-",
    description:
      "Personal-safety Android app with an offline-first SOS core and a Cloudflare Worker backend (D1 + Durable Objects + R2).",
    language: "Kotlin",
    projectSlug: "guardian",
  },
  {
    name: "brain",
    description:
      "Private, offline-first personal assistant PWA — natural language over ten record types, no account, no server.",
    language: "JavaScript",
    projectSlug: "brain",
  },
  {
    name: "puck",
    description:
      "One-button gesture assistant: offline first, on-device voice, one gated LLM seam. English and Spanish.",
    language: "Dart",
    projectSlug: "puck",
  },
  {
    name: "ASCEND",
    description:
      "Privacy-first on-device coach: rule-based plans, MediaPipe landmarks, AES-GCM captures, published source audit.",
    language: "Dart",
    projectSlug: "ascend",
  },
  {
    name: "learn",
    description:
      "English Explorer — gamified English learning for children: adventure map, mascot, rewards and a parent dashboard.",
    language: "TypeScript",
    projectSlug: "kids-learning-app",
  },
  {
    name: "ludox",
    description:
      "Ludora — premium Ludo as a pure static PWA: engine, AI, daily challenge and WebRTC multiplayer with QR invites.",
    language: "JavaScript",
    projectSlug: "ludora",
  },
  {
    name: "SYTMRX",
    description:
      "This website — the product discovery and software distribution platform for everything above.",
    language: "TypeScript",
    projectSlug: "sytmrx-site",
  },
  {
    name: "lumaOS-privacy",
    description: "Public privacy-policy site for LumaOS Pro, with its own audit report.",
    language: "HTML",
  },
];

/* ------------------------------------------------------------------------- */
/* Selectors                                                                   */
/* ------------------------------------------------------------------------- */

const byOrder = (a: Project, b: Project) => a.order - b.order;

export const allProjects = (): Project[] => [...projects].sort(byOrder);

export const featuredProjects = (): Project[] =>
  allProjects().filter((p) => p.featured);

export const projectSlugs = (): string[] => projects.map((p) => p.slug);

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Products that declare at least one download entry (published or pending). */
export const downloadableProjects = (): Project[] =>
  allProjects().filter((p) => Object.keys(p.downloads).length > 0);

/**
 * Projects whose capabilities are documented from an audited repository —
 * the portfolio shown on the homepage and used for repository counts.
 */
export const verifiedProjects = (): Project[] =>
  allProjects().filter((p) => p.repository !== null);
