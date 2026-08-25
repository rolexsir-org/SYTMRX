import "server-only";

import type {
  AssetMatcher,
  DownloadAsset,
  Platform,
  Project,
} from "@/data/types";
import { githubFetch, GITHUB_REVALIDATE_SECONDS } from "./github-client";
import { projectRepository } from "./repository";
import { isTrustedDownloadUrl } from "./repository";

/**
 * GitHub Release resolution — server only.
 *
 * Replaces the old workflow of hand-copying asset URLs into `projects.ts`.
 * For a project with `releaseSource: "github-release"` and a configured
 * repository, this reads the real published releases and derives version,
 * date, filename, size, checksum and download URL.
 *
 * Guarantees:
 *  - Drafts are never eligible: they are not public artifacts.
 *  - Prereleases are only eligible when the project opts in.
 *  - Nothing is invented. A field the API does not provide stays null.
 *  - Any failure (network, rate limit, 404, timeout, malformed JSON) resolves
 *    to `null` and the caller falls back to static metadata.
 */

/* ------------------------------------------------------------------ types  */

interface GitHubAsset {
  name?: string;
  size?: number;
  browser_download_url?: string;
  digest?: string | null;
  content_type?: string;
  state?: string;
}

interface GitHubRelease {
  tag_name?: string;
  name?: string;
  draft?: boolean;
  prerelease?: boolean;
  published_at?: string | null;
  html_url?: string;
  body?: string | null;
  assets?: GitHubAsset[];
}

export interface ResolvedReleaseAsset extends DownloadAsset {
  platform: Platform;
}

export interface ReleaseInfo {
  /** Tag as published, e.g. "v1.0.0". */
  tag: string;
  /** Version without a leading "v". */
  version: string;
  /** ISO date (YYYY-MM-DD), or null when GitHub reports none. */
  publishedAt: string | null;
  prerelease: boolean;
  /** Link to the release page. */
  url: string | null;
  assets: ResolvedReleaseAsset[];
}

/* -------------------------------------------------------------- matching  */

/** Default filename-to-platform mapping. */
const DEFAULT_MATCHERS: AssetMatcher[] = [
  { platform: "android", extensions: [".apk", ".aab"] },
  { platform: "windows", extensions: [".exe", ".msi"] },
  { platform: "macos", extensions: [".dmg", ".pkg"] },
  { platform: "linux", extensions: [".appimage", ".deb", ".rpm"] },
];

/** Checksum manifests and signatures are not themselves downloadable builds. */
const NON_BINARY_SUFFIXES = [
  ".sha256",
  ".sha256sum",
  ".sha512",
  ".md5",
  ".sig",
  ".asc",
  ".pem",
  ".txt",
];

function matchPlatform(
  filename: string,
  matchers: AssetMatcher[],
): Platform | null {
  const lower = filename.toLowerCase();
  if (NON_BINARY_SUFFIXES.some((suffix) => lower.endsWith(suffix))) return null;

  for (const matcher of matchers) {
    const extensionOk = matcher.extensions.some((ext) =>
      lower.endsWith(ext.toLowerCase()),
    );
    if (!extensionOk) continue;
    if (matcher.contains && !lower.includes(matcher.contains.toLowerCase())) {
      continue;
    }
    return matcher.platform;
  }
  return null;
}

/** Formats bytes the way a release page does. Never rounds to a fake value. */
export function formatBytes(bytes: number | undefined | null): string | null {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
}

/**
 * GitHub exposes asset digests as "sha256:<hex>" on newer API versions.
 * Anything else is ignored rather than reshaped into something that looks
 * like a checksum but is not one.
 */
function parseDigest(digest: string | null | undefined): string | null {
  if (!digest || typeof digest !== "string") return null;
  const match = /^sha256:([a-f0-9]{64})$/i.exec(digest.trim());
  return match ? match[1].toLowerCase() : null;
}

/** ISO timestamp → YYYY-MM-DD. Returns null for anything unparseable. */
function toIsoDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

/* -------------------------------------------------------------- resolving */

/**
 * Picks the newest eligible release.
 * GitHub returns releases newest-first; drafts are always excluded.
 */
function selectRelease(
  releases: GitHubRelease[],
  allowPrerelease: boolean,
): GitHubRelease | null {
  const eligible = releases.filter((release) => {
    if (release.draft) return false;
    if (release.prerelease && !allowPrerelease) return false;
    return typeof release.tag_name === "string" && release.tag_name.length > 0;
  });
  return eligible[0] ?? null;
}

/**
 * Resolves the latest published release for a project.
 * Returns null when the project is not GitHub-backed, has no repository, or
 * GitHub cannot be reached — the caller then uses static fallback data.
 */
export async function resolveProjectRelease(
  project: Project,
): Promise<ReleaseInfo | null> {
  if ((project.releaseSource ?? "none") !== "github-release") return null;

  const repo = projectRepository(project);
  if (!repo) return null;

  const releases = await githubFetch<GitHubRelease[]>(
    `/repos/${repo.owner}/${repo.name}/releases?per_page=10`,
    { revalidate: GITHUB_REVALIDATE_SECONDS },
  );
  if (!releases || !Array.isArray(releases)) return null;

  const release = selectRelease(
    releases,
    project.releaseChannel === "prerelease",
  );
  if (!release) return null;

  const matchers = project.assetMatchers ?? DEFAULT_MATCHERS;
  const seen = new Set<Platform>();
  const assets: ResolvedReleaseAsset[] = [];

  for (const asset of release.assets ?? []) {
    const filename = asset.name;
    const url = asset.browser_download_url;
    if (!filename || !url) continue;
    // GitHub marks incomplete uploads as "starter".
    if (asset.state && asset.state !== "uploaded") continue;
    // Never link a download that is not on a GitHub-controlled host.
    if (!isTrustedDownloadUrl(url)) continue;

    const platform = matchPlatform(filename, matchers);
    if (!platform || seen.has(platform)) continue;
    seen.add(platform);

    assets.push({
      platform,
      url,
      filename,
      size: formatBytes(asset.size),
      sha256: parseDigest(asset.digest),
      note: null,
    });
  }

  const tag = release.tag_name as string;

  return {
    tag,
    version: tag.replace(/^v/i, ""),
    publishedAt: toIsoDate(release.published_at),
    prerelease: Boolean(release.prerelease),
    url: isTrustedDownloadUrl(release.html_url) ? (release.html_url as string) : repo.releasesUrl,
    assets,
  };
}
