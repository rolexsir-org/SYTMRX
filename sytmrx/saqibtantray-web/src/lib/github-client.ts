import "server-only";

/**
 * Shared GitHub API client — server only.
 *
 * `import "server-only"` makes it a build error for any client component to
 * pull this in, which is what structurally guarantees GITHUB_TOKEN can never
 * reach the browser. The token is read from a non-NEXT_PUBLIC_ variable, so
 * it is not inlined into the client bundle either.
 *
 * Every request is:
 *  - cached via the Next.js data cache (ISR) to stay inside rate limits
 *  - bounded by an explicit timeout so a hanging request cannot stall a build
 *  - total: all failures resolve to `null`, never a thrown error
 */

export const GITHUB_API = "https://api.github.com";

/** One hour. Release metadata does not change often. */
export const GITHUB_REVALIDATE_SECONDS = 3600;

/** Abort a slow request rather than letting it block page generation. */
const REQUEST_TIMEOUT_MS = 8000;

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sytmrx-web",
  };
  // Optional. Only raises the rate limit; public data works without it.
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export interface GitHubFetchOptions {
  revalidate?: number;
}

/**
 * Performs a cached GET against the GitHub API.
 *
 * Returns the parsed body, or `null` for every failure mode:
 * network error, DNS failure, timeout, 401/403 (bad or missing token),
 * 404 (repo/release absent), 429 (rate limited), 5xx, or malformed JSON.
 */
export async function githubFetch<T>(
  path: string,
  options: GitHubFetchOptions = {},
): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${GITHUB_API}${path}`, {
      headers: buildHeaders(),
      signal: controller.signal,
      next: { revalidate: options.revalidate ?? GITHUB_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      // Surfaced in build/server logs only — never rendered to the user.
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[github] ${response.status} for ${path}`);
      }
      return null;
    }

    return (await response.json()) as T;
  } catch {
    // AbortError, network failure, offline build, invalid JSON.
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
