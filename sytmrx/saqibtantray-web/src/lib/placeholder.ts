/**
 * Placeholder system.
 *
 * This site ships with NO invented data. Anything that must be supplied by the
 * site owner (URLs, emails, repositories, release assets, checksums) is stored
 * as a placeholder token. The UI detects placeholders and renders an honest
 * "not configured yet" state instead of a dead link or a fake value.
 *
 * To configure a value: replace the `placeholder("...")` call with a real string.
 */

export const PLACEHOLDER_PREFIX = "REPLACE_ME";

/** Create a placeholder token, e.g. placeholder("GITHUB_USERNAME"). */
export function placeholder(key: string): string {
  return `${PLACEHOLDER_PREFIX}:${key}`;
}

/** True when a value is missing or still a placeholder token. */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return value.trim().length === 0 || value.startsWith(PLACEHOLDER_PREFIX);
}

/** The configuration key behind a placeholder token (for helpful UI hints). */
export function placeholderKey(value: string | null | undefined): string {
  if (!value) return "UNCONFIGURED";
  return value.startsWith(PLACEHOLDER_PREFIX)
    ? value.slice(PLACEHOLDER_PREFIX.length + 1) || "UNCONFIGURED"
    : "UNCONFIGURED";
}

/** Returns the value only when it is real, otherwise `undefined`. */
export function resolved(value: string | null | undefined): string | undefined {
  return isPlaceholder(value) ? undefined : (value as string);
}
