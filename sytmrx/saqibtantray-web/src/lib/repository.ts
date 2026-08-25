import { githubUsername } from "@/config/site";
import type { Project, RepositoryRef } from "@/data/types";
import { isPlaceholder } from "./placeholder";

/**
 * Repository resolution and URL safety.
 *
 * Shared by both server and client code, so it must stay free of `server-only`
 * imports and must never touch a token.
 *
 * Two rules are enforced here:
 *  1. A repository URL is only ever produced from an explicitly configured
 *     owner + name. Nothing is guessed from a slug.
 *  2. Every outbound URL is validated before it reaches an href.
 */

/** GitHub owner/repo names: alphanumerics, hyphen, underscore, dot. */
const GITHUB_NAME = /^[A-Za-z0-9_.-]+$/;

export interface ResolvedRepo {
  owner: string;
  name: string;
  /** https://github.com/<owner>/<name> */
  url: string;
  /** https://github.com/<owner>/<name>/releases */
  releasesUrl: string;
}

/**
 * Resolves a repository reference to concrete, validated values.
 * Returns null when the repository is absent, placeholder or malformed.
 */
export function resolveRepository(
  ref: RepositoryRef | null | undefined,
): ResolvedRepo | null {
  if (!ref) return null;

  const owner = (ref.owner ?? githubUsername).trim();
  const name = ref.name?.trim() ?? "";

  if (isPlaceholder(owner) || isPlaceholder(name)) return null;
  if (!GITHUB_NAME.test(owner) || !GITHUB_NAME.test(name)) return null;

  const url = `https://github.com/${owner}/${name}`;
  return { owner, name, url, releasesUrl: `${url}/releases` };
}

export function projectRepository(project: Project): ResolvedRepo | null {
  return resolveRepository(project.repository);
}

/**
 * True only for absolute https URLs.
 *
 * Guards every external href and download link. Rejects http, javascript:,
 * data:, blob:, relative paths, placeholder tokens and malformed input, so a
 * bad value in project data can never become a navigable or injectable link.
 */
export function isSafeExternalUrl(value: string | null | undefined): boolean {
  if (!value || isPlaceholder(value)) return false;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  // A hostname is mandatory; `https:///path` and similar are rejected.
  return parsed.hostname.length > 0;
}

/** Returns the URL only when it is safe to link, else null. */
export function safeExternalUrl(value: string | null | undefined): string | null {
  return isSafeExternalUrl(value) ? (value as string) : null;
}

/** Hosts that may serve release binaries. */
const TRUSTED_DOWNLOAD_HOSTS = new Set([
  "github.com",
  "objects.githubusercontent.com",
  "release-assets.githubusercontent.com",
]);

/**
 * Stricter check for download links.
 *
 * Beyond being https, a binary download must come from a GitHub-controlled
 * host. This stops a malformed or tampered entry in project data from pointing
 * users at an arbitrary executable elsewhere.
 */
export function isTrustedDownloadUrl(value: string | null | undefined): boolean {
  if (!isSafeExternalUrl(value)) return false;
  const { hostname } = new URL(value as string);
  return (
    TRUSTED_DOWNLOAD_HOSTS.has(hostname) || hostname.endsWith(".githubusercontent.com")
  );
}
