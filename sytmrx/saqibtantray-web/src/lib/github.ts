import "server-only";

import { repos } from "@/data/projects";
import type { Repo } from "@/data/types";
import { githubFetch } from "./github-client";
import { resolveRepository } from "./repository";

/**
 * Repository metadata for the "Open source" section — server only.
 *
 * Rules enforced here:
 *  - Requests run on the server through the shared client; no token reaches
 *    the browser.
 *  - Results are cached (ISR) so we stay far inside rate limits.
 *  - Every failure path returns the static fallback from `projects.ts`; the
 *    site must never break because GitHub is unavailable.
 *  - Stats are only ever real. If the API does not answer, `stars` stays null
 *    and the UI omits it rather than inventing a number.
 */

export interface RepoView extends Repo {
  /** Real star count from the API, or null when unavailable. */
  stars: number | null;
  /** Language from the API when available, else the configured value. */
  language: string | null;
  /** Fully-qualified URL, or null when the repository is not configured. */
  url: string | null;
  /** True when the repository reference is missing or still a placeholder. */
  unconfigured: boolean;
}

interface GitHubRepoResponse {
  stargazers_count?: number;
  language?: string | null;
  html_url?: string;
}

/**
 * Returns the configured repositories, enriched with live data when GitHub
 * answers and with static fallback metadata when it does not.
 */
export async function getRepoViews(): Promise<RepoView[]> {
  return Promise.all(
    repos.map(async (repo): Promise<RepoView> => {
      const resolved = resolveRepository({ owner: repo.owner, name: repo.name });

      const fallback: RepoView = {
        ...repo,
        stars: null,
        language: repo.language,
        url: resolved?.url ?? null,
        unconfigured: resolved === null,
      };

      if (!resolved) return fallback;

      const data = await githubFetch<GitHubRepoResponse>(
        `/repos/${resolved.owner}/${resolved.name}`,
      );
      if (!data) return fallback;

      return {
        ...fallback,
        stars:
          typeof data.stargazers_count === "number" ? data.stargazers_count : null,
        language: data.language ?? repo.language,
        // Prefer the canonical URL from the API (handles renames).
        url: data.html_url ?? fallback.url,
      };
    }),
  );
}
