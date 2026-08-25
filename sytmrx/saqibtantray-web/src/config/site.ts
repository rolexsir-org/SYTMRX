/**
 * Global site configuration for SYTMRX.
 *
 * SYTMRX is an independent technology and digital-product company building
 * software, applications, games, offline-first systems and experimental
 * digital products.
 *
 * Anything not yet known is a placeholder — the UI degrades honestly instead of
 * rendering a fabricated link. Search for "REPLACE_ME" to find everything that
 * still needs real information.
 */

/**
 * Public base URL of the deployment.
 * - Local dev falls back to http://localhost:3000
 * - Vercel provides VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL automatically,
 *   so the site works on the Vercel URL with zero configuration.
 * - Set NEXT_PUBLIC_SITE_URL later to override with a custom domain.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit && explicit.trim().length > 0) {
    return explicit.replace(/\/$/, "");
  }
  const vercelProd = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/**
 * GitHub owner (user or organisation) that hosts SYTMRX source and releases.
 *
 * Configurable via NEXT_PUBLIC_GITHUB_USERNAME so forks and preview
 * environments can point elsewhere without a code change. The default is the
 * real SYTMRX organisation, so the site works with no environment set.
 */
export const DEFAULT_GITHUB_OWNER = "rolexsir-org";

export const githubUsername: string =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME?.trim() || DEFAULT_GITHUB_OWNER;

export const siteConfig = {
  name: "SYTMRX",
  shortName: "SYTMRX",
  /** Category line used under the wordmark and in the footer. */
  disciplines: "Software · Apps · Games · Digital Products",
  positioning: "We build software, games, and digital products.",
  description:
    "SYTMRX builds software, applications, games, and digital products.",
  longDescription:
    "An independent technology company building software, applications, games, offline-first systems, and experimental digital products.",
  defaultTitle: "SYTMRX — Software, Apps & Games",
  locale: "en_US",
  url: siteUrl,
} as const;

/**
 * Contact channels.
 *
 * Only channels that genuinely exist are listed here. Anything left as a
 * placeholder renders as "not published yet" rather than a broken link.
 */
export const contactConfig = {
  email: "sytmrx.dev@gmail.com",
  instagramHandle: "saqibtantrayy",
  instagram: "https://instagram.com/saqibtantrayy",
  github: githubUsername,
  /** Optional extra links: { label, url } — url may be a placeholder. */
  other: [] as { label: string; url: string }[],
};

export const mailtoUrl = `mailto:${contactConfig.email}`;

/** Status pill in the hero. Keep it truthful — no specific claims by default. */
export const statusConfig = {
  label: "Currently building",
  /**
   * Optional. Set to a short, true phrase once you want to name what is being
   * worked on. Leave null to stay generic.
   */
  detail: null as string | null,
};

export function githubProfileUrl(): string {
  return `https://github.com/${githubUsername}`;
}
