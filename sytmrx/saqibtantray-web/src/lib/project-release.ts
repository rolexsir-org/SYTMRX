import "server-only";

import type { Project } from "@/data/types";
import { mergeRelease, staticRelease, type ProjectRelease } from "./downloads";
import { resolveProjectRelease } from "./releases";

/**
 * Server-side entry point for "what can actually be downloaded right now".
 *
 * Server components call this; it performs the cached GitHub lookup and merges
 * the result over static metadata. If GitHub is unreachable, rate-limited, or
 * the repository/release/asset does not exist, this returns the static view.
 * It never throws, so a GitHub outage cannot produce an error page.
 */
export async function getProjectRelease(project: Project): Promise<ProjectRelease> {
  try {
    const live = await resolveProjectRelease(project);
    if (!live) return staticRelease(project);

    return mergeRelease(project, {
      version: live.version,
      releaseDate: live.publishedAt,
      releaseUrl: live.url,
      prerelease: live.prerelease,
      assets: live.assets,
    });
  } catch {
    // Defensive: resolveProjectRelease is already total, but a future change
    // must not be able to turn a GitHub problem into a broken page.
    return staticRelease(project);
  }
}

/** Resolves releases for many projects concurrently. */
export async function getProjectReleases(
  projects: Project[],
): Promise<Map<string, ProjectRelease>> {
  const entries = await Promise.all(
    projects.map(
      async (project) => [project.slug, await getProjectRelease(project)] as const,
    ),
  );
  return new Map(entries);
}
