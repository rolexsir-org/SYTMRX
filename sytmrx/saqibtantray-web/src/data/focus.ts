/**
 * Engineering focus areas.
 *
 * Nine areas of work, each explained in practical terms and backed by project
 * evidence from the audited repositories (see src/data/projects.ts). This is
 * not a skills grid: an area appears here because working source demonstrates
 * it, and the evidence line states where.
 */

export interface FocusArea {
  n: string;
  title: string;
  body: string;
  /** One concrete, source-backed proof point. Never invented. */
  evidence: string;
  /** Projects that demonstrate the area, matching project slugs. */
  projects: string[];
}

export const focusAreas: FocusArea[] = [
  {
    n: "01",
    title: "Android application development",
    body: "Native Kotlin and Flutter apps built to run well on ordinary hardware — not just flagship devices. Interfaces are shaped around the task, permissions are requested when a feature needs them, and every claimed capability is checked against what the OS actually grants.",
    evidence:
      "A 3.3M-character Kotlin launcher codebase (LumaOS Pro) and four Flutter/Kotlin apps, all with stated minimum SDKs, permission disclosures and test suites.",
    projects: ["lumaos-pro", "trackpro", "guardian", "ascend"],
  },
  {
    n: "02",
    title: "Custom launchers and system-level experiences",
    body: "A launcher is the OS surface people touch most. LumaOS Pro registers both HOME and LAUNCHER entry points, builds its own home, drawer, folders and gestures, and treats skipping the default-home request as a first-class outcome rather than a dark pattern.",
    evidence:
      "HomeActivity with HOME + LAUNCHER intent filters, a seven-step first-run walkthrough gated by install-state eligibility, and a device-owner deployment path documented without being claimed.",
    projects: ["lumaos-pro"],
  },
  {
    n: "03",
    title: "Productivity, habit tracking and focus protection",
    body: "Tracking is the easy half; enforcement is the hard half. Both TrackPro's Focus Lock and LumaOS Pro's Focus Protection are built on the same principle — report what is verified, never claim a block that could not be confirmed, and document exactly what each level can and cannot stop.",
    evidence:
      "TrackPro's focus engine tests assert that missing permissions render a session 'unavailable, whatever else is true'; LumaOS Pro's enforcement doc distinguishes three levels and marks the third as not implemented.",
    projects: ["trackpro", "lumaos-pro"],
  },
  {
    n: "04",
    title: "AI-powered applications and intelligent assistants",
    body: "AI sits where it earns its place: a natural-language layer over local records in Brain, on-device voice commands in Puck, and one gated model seam that can only sharpen a line the device already chose — never originate facts. Deterministic answers come from code, not from a model.",
    evidence:
      "Puck's GatedLlmProvider is one privacy-switch-controlled seam with client-side validators and a bounded request budget; Brain parses ten record types from ordinary language entirely on device.",
    projects: ["puck", "brain"],
  },
  {
    n: "05",
    title: "Offline-first software and local data architectures",
    body: "The recurring discipline across every project: state lives on the device, schemas are versioned and migrated, and an absent network is a supported condition rather than an error state. When sync exists, it is background and additive — never a dependency for core operation.",
    evidence:
      "Drift schema v4 in TrackPro, DataStore-only persistence in LumaOS Pro, a service-worker-cached PWA shell in Brain, an intake/dispatch outbox in ColdStore OS, and encrypted local records in Guardian.",
    projects: ["trackpro", "lumaos-pro", "brain", "coldstore-os", "guardian"],
  },
  {
    n: "06",
    title: "Business management, inventory and commerce systems",
    body: "Business software fails on money math and stock drift, so those parts get database-level guarantees: integer minor units, quantized rounding, non-negative stock constraints, a movement ledger, and corrections that supersede instead of overwrite.",
    evidence:
      "ColdStore OS bills with tariff snapshots on every invoice line and passes 76 pytest tests covering inventory math, billing determinism, RBAC, idempotency and concurrency.",
    projects: ["coldstore-os", "yourcart"],
  },
  {
    n: "07",
    title: "Web applications, APIs and backend systems",
    body: "Backends are kept as small as the problem allows: one Cloudflare Worker for Guardian, a zero-runtime-dependency Node service for Play Billing verification, a FastAPI authoritative server for ColdStore OS, and static-first delivery for Brain and Ludora.",
    evidence:
      "Guardian's Worker fronts auth, D1 data, a Durable Object and R2 storage behind one HTTPS contract; the TrackPro billing server ships 78/78 tests with Docker and Railway deployment config.",
    projects: ["guardian", "trackpro", "coldstore-os", "brain", "sytmrx-site"],
  },
  {
    n: "08",
    title: "Application security, authentication and privacy",
    body: "Security is implemented where it matters and documented where it doesn't reach: PBKDF2 + HMAC tokens and server-side authorization in Guardian, RFC 6238 TOTP in ColdStore OS, AES-GCM capture encryption in ASCEND, a strict CSP on this site, and threat models written in plain language.",
    evidence:
      "LumaOS Pro publishes a Vault threat model stating what it does not defend; Guardian's evidence objects live under server-generated keys in a non-public bucket; ASCEND strips and SHA-256-verifies its ML dependency to remove telemetry.",
    projects: ["guardian", "coldstore-os", "ascend", "lumaos-pro", "sytmrx-site"],
  },
  {
    n: "09",
    title: "Software monetisation, subscriptions and release infrastructure",
    body: "Subscriptions are treated as infrastructure, not a paywall sticker: product IDs, base plans, trial offers and entitlement rules are load-bearing constants, purchase verification fails closed, and release engineering — signing, keystores, version codes, store checklists — is written down instead of improvised.",
    evidence:
      "TrackPro's monetisation runbook specifies exact Play Console product and offer IDs with a fail-closed verification backend; LumaOS Pro's build refuses to sign a release with the debug key; this site resolves downloads from GitHub Releases automatically.",
    projects: ["trackpro", "lumaos-pro", "guardian", "ascend", "sytmrx-site"],
  },
];
