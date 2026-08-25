import type { DownloadAsset, Platform, Project } from "@/data/types";
import { isPlaceholder, placeholderKey } from "./placeholder";
import { platformOrder } from "./meta";
import { isTrustedDownloadUrl } from "./repository";

/**
 * Download resolution (isomorphic — safe in server and client components).
 *
 * A download is only "published" when its URL is an absolute https URL on a
 * GitHub-controlled host. Everything else renders as an explicit, disabled
 * "not published yet" state, so the site never shows a button that goes
 * nowhere or points somewhere untrusted.
 *
 * Live GitHub Release data is merged in by `getProjectRelease` on the server;
 * this module stays free of `server-only` imports so the same helpers can run
 * during client rendering.
 */

export interface ResolvedDownload {
  platform: Platform;
  asset: DownloadAsset;
  /** URL is real, https, GitHub-hosted and safe to link. */
  published: boolean;
  /** Config key the owner still has to fill in (when unpublished). */
  pendingKey: string;
  /** True when this entry came from the live GitHub API rather than static data. */
  live: boolean;
}

/**
 * Effective download/version metadata for a project.
 *
 * `version` and `releaseDate` prefer live release data and fall back to the
 * static values in `projects.ts`. Both stay null when neither source has them.
 */
export interface ProjectRelease {
  downloads: ResolvedDownload[];
  version: string | null;
  releaseDate: string | null;
  /** Link to the GitHub release page, when one exists. */
  releaseUrl: string | null;
  /** True when the selected release is flagged as a prerelease. */
  prerelease: boolean;
  /** True when any part of this came from the live GitHub API. */
  live: boolean;
}

function toResolved(
  platform: Platform,
  asset: DownloadAsset,
  live: boolean,
): ResolvedDownload {
  return {
    platform,
    asset,
    published: isTrustedDownloadUrl(asset.url),
    pendingKey: isPlaceholder(asset.url)
      ? placeholderKey(asset.url)
      : "RELEASE_ASSET",
    live,
  };
}

const byPlatformOrder = (a: ResolvedDownload, b: ResolvedDownload) =>
  platformOrder.indexOf(a.platform) - platformOrder.indexOf(b.platform);

/**
 * Static-only resolution, straight from `projects.ts`.
 * This is the fallback whenever live release data is unavailable.
 */
export function resolveDownloads(project: Project): ResolvedDownload[] {
  const entries = Object.entries(project.downloads) as [Platform, DownloadAsset][];
  return entries
    .filter(([, asset]) => Boolean(asset))
    .map(([platform, asset]) => toResolved(platform, asset, false))
    .sort(byPlatformOrder);
}

/** The static-only view, used as the fallback shape everywhere. */
export function staticRelease(project: Project): ProjectRelease {
  return {
    downloads: resolveDownloads(project),
    version: project.version,
    releaseDate: project.releaseDate,
    releaseUrl: null,
    prerelease: false,
    live: false,
  };
}

/**
 * Merges live release assets over the static fallback.
 *
 * Live data wins where present; static entries are kept for platforms the
 * release does not provide, so a partially-published release still shows the
 * correct pending state for the rest.
 */
export function mergeRelease(
  project: Project,
  live: {
    version: string;
    releaseDate: string | null;
    releaseUrl: string | null;
    prerelease: boolean;
    assets: (DownloadAsset & { platform: Platform })[];
  } | null,
): ProjectRelease {
  const fallback = staticRelease(project);
  if (!live) return fallback;

  const merged = new Map<Platform, ResolvedDownload>();
  for (const download of fallback.downloads) {
    merged.set(download.platform, download);
  }
  for (const { platform, ...asset } of live.assets) {
    merged.set(platform, toResolved(platform, asset, true));
  }

  return {
    downloads: [...merged.values()].sort(byPlatformOrder),
    // Live values take precedence, but never erase a known static value.
    version: live.version || fallback.version,
    releaseDate: live.releaseDate ?? fallback.releaseDate,
    releaseUrl: live.releaseUrl,
    prerelease: live.prerelease,
    live: true,
  };
}

/** Only platforms that actually have a published, downloadable build. */
export function publishedDownloads(release: ProjectRelease): ResolvedDownload[] {
  return release.downloads.filter((d) => d.published);
}

export function hasPublishedDownload(release: ProjectRelease): boolean {
  return release.downloads.some((d) => d.published);
}

/** True when the project declares downloads but none are published yet. */
export function hasPendingDownload(release: ProjectRelease): boolean {
  return (
    release.downloads.length > 0 && release.downloads.every((d) => !d.published)
  );
}
