/**
 * "Currently Building" — active work tracks.
 *
 * Subjects are identified from actual repository activity and the current
 * status statements in each repository's own engineering documents (audited
 * 2026-11-24). No live progress percentages, no fabricated velocity — each
 * track states what is next and what evidence says is still open.
 */

export interface BuildingTrack {
  n: string;
  title: string;
  body: string;
  /** Concrete next steps, taken from the repository's own checklists. */
  next: string[];
  /**
   * The repository the track centres on. Omitted for cross-repository tracks,
   * in which case the link points at the GitHub account itself.
   */
  repo?: string;
  projectSlug?: string;
}

export const buildingTracks: BuildingTrack[] = [
  {
    n: "01",
    title: "LumaOS Pro — product refinement and release engineering",
    body: "The launcher is source-complete at 1.6.0 (versionCode 160) with a seven-step onboarding walkthrough and eight native widgets carried in the unreleased build. The remaining distance to Play is release engineering, not features.",
    next: [
      "Device verification of the Robolectric-covered flows via ./build.sh test on a real toolchain",
      "Final privacy policy to replace the publisher-review draft",
      "Store listing with real device screenshots and the data-safety form",
    ],
    repo: "lumaospro",
    projectSlug: "lumaos-pro",
  },
  {
    n: "02",
    title: "TrackPro — production readiness and monetisation",
    body: "The Flutter client and the 78/78-tested billing verification service are written and wired; the repository's own publishing status says plainly: not ready. The runbook defines exactly what remains between here and a closed test.",
    next: [
      "Deploy the Play Billing verification + RTDN service (Docker/Railway config already in repo)",
      "Create Play Console products, base plans and the annual-plan 7-day trial offer",
      "Start the 12-tester / 14-day closed-test clock required for production access",
    ],
    repo: "trackpro",
    projectSlug: "trackpro",
  },
  {
    n: "03",
    title: "SYTMRX — website and distribution infrastructure",
    body: "This site is the discovery and distribution layer for every product: typed project metadata, build-time validation, GitHub Releases resolution and hourly revalidation. It keeps evolving as products reach releasable states.",
    next: [
      "Founder identity, engineering focus and verified portfolio integration",
      "Download surfaces lighting up automatically as first releases publish",
      "Keeping the anti-fabrication validator in step with the growing catalogue",
    ],
    repo: "SYTMRX",
    projectSlug: "sytmrx-site",
  },
  {
    n: "04",
    title: "Backend reliability, API integration and application security",
    body: "The cross-project thread: activating staged CI workflows, hardening the Guardian Worker backend, keeping deterministic guarantees in ColdStore OS, and continuing the security-review passes that each repository documents.",
    next: [
      "Move ci/workflows definitions into .github/workflows with a workflows-permission token",
      "Guardian Cloudflare deployment: root-directory build fix and wrangler deploy",
      "ColdStore OS readiness checklist: acceptance and commissioning gates ahead of pilot",
    ],
  },
];
