import "server-only";

import { githubUsername } from "@/config/site";
import { githubFetch } from "./github-client";

/**
 * GitHub repository metadata — server only.
 *
 * Rules enforced here:
 *  - Requests run on the server through the shared client; no token reaches
 *    the browser.
 *  - Results are cached (ISR) so we stay far inside rate limits.
 *  - Every failure path returns a static fallback; the site must never break
 *    because GitHub is unavailable.
 *  - Stats are only ever real. If the API does not answer, stars and dates
 *    stay null and the UI omits them rather than inventing a number.
 */

/* ------------------------------------------------------------------------- */
/* Organisation / account repositories                                         */
/* ------------------------------------------------------------------------- */

interface GitHubRepoListResponse {
  name?: string;
  description?: string | null;
  language?: string | null;
  pushed_at?: string | null;
  html_url?: string;
  stargazers_count?: number;
  fork?: boolean;
  archived?: boolean;
}

export interface OrgRepoView {
  name: string;
  description: string | null;
  language: string | null;
  /** ISO timestamp of the last push, or null when unavailable. */
  pushedAt: string | null;
  url: string | null;
  stars: number | null;
  /** True when this row came from the static fallback, not the API. */
  stale: boolean;
}

/**
 * Static fallback for the GitHub section: the audited public repositories
 * (2026-11-24). Used only when the API is unreachable, so the section still
 * renders real repositories with their real languages instead of breaking.
 */
const FALLBACK_ORG_REPOS: OrgRepoView[] = [
  { name: "trackpro", description: "Flutter habit and productivity app with Focus Lock, a Play Billing paywall and a Node billing-verification backend.", language: "Dart", pushedAt: null, url: null, stars: null, stale: true },
  { name: "lumaospro", description: "Standalone Android launcher: Luma Glass theming, native widgets, encrypted Vault and three-level Focus Protection.", language: "Kotlin", pushedAt: null, url: null, stars: null, stale: true },
  { name: "brain", description: "Private, offline-first personal assistant PWA — natural language over ten record types, no account, no server.", language: "JavaScript", pushedAt: null, url: null, stars: null, stale: true },
  { name: "learn", description: "English Explorer — gamified English learning for children: adventure map, mascot, rewards and a parent dashboard.", language: "TypeScript", pushedAt: null, url: null, stars: null, stale: true },
  { name: "lumaOS-privacy", description: "Public privacy-policy site for LumaOS Pro, with its own audit report.", language: "HTML", pushedAt: null, url: null, stars: null, stale: true },
  { name: "ASCEND", description: "Privacy-first on-device coach: rule-based plans, MediaPipe landmarks, AES-GCM captures, published source audit.", language: "Dart", pushedAt: null, url: null, stars: null, stale: true },
  { name: "puck", description: "One-button gesture assistant: offline first, on-device voice, one gated LLM seam. English and Spanish.", language: "Dart", pushedAt: null, url: null, stars: null, stale: true },
  { name: "coldstore-", description: "FastAPI management platform for a CA apple cold-storage facility: deterministic billing, RBAC, audited mutations.", language: "Python", pushedAt: null, url: null, stars: null, stale: true },
  { name: "guardian-", description: "Personal-safety Android app with an offline-first SOS core and a Cloudflare Worker backend.", language: "Kotlin", pushedAt: null, url: null, stars: null, stale: true },
  { name: "SYTMRX", description: "The SYTMRX website — product discovery and software distribution platform.", language: "TypeScript", pushedAt: null, url: null, stars: null, stale: true },
];

/**
 * Public repositories of the configured GitHub owner, most recently pushed
 * first. Fetched through the shared, cached GitHub client (no separate
 * client, no credentials in the browser) with the static fallback above on
 * every failure mode.
 */
export async function getOrgRepoViews(limit = 10): Promise<OrgRepoView[]> {
  const data = await githubFetch<GitHubRepoListResponse[]>(
    `/users/${githubUsername}/repos?sort=pushed&direction=desc&per_page=30`,
  );

  if (!Array.isArray(data)) return FALLBACK_ORG_REPOS.slice(0, limit);

  const views: OrgRepoView[] = data
    .filter((repo) => !repo.fork && !repo.archived && typeof repo.name === "string")
    .map((repo) => ({
      name: repo.name as string,
      description: repo.description ?? null,
      language: repo.language ?? null,
      pushedAt: repo.pushed_at ?? null,
      url: repo.html_url ?? `https://github.com/${githubUsername}/${repo.name}`,
      stars: typeof repo.stargazers_count === "number" ? repo.stargazers_count : null,
      stale: false,
    }));

  if (views.length === 0) return FALLBACK_ORG_REPOS.slice(0, limit);
  return views.slice(0, limit);
}
