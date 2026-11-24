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
  positioning: "Independent software development — Android, AI, productivity, offline-first systems, web.",
  description:
    "SYTMRX — independent software development and product building. Android launchers, productivity tools, AI assistants, offline-first systems and web platforms.",
  longDescription:
    "SYTMRX is the product label of an independent software developer building Android launchers, productivity and focus tools, AI assistants, business systems and the web infrastructure that distributes them. Every project is developed end to end and open to inspection on GitHub.",
  defaultTitle: "SYTMRX — Independent Software Development & Products",
  locale: "en_US",
  url: siteUrl,
} as const;

/**
 * The developer behind SYTMRX.
 *
 * Identity is derived from public evidence: the GitHub account, the source
 * repository layout and the public contact channels already configured on
 * this site. Nothing here invents credentials, employment history or dates.
 */
export const founderConfig = {
  role: "Independent Software Developer & Product Builder",
  /** Public GitHub account that hosts all SYTMRX source and releases. */
  github: githubUsername,
  summary:
    "Building software across Android, productivity, AI, business systems, developer tools and web applications — designed, implemented, tested and shipped end to end by one developer.",
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
   * A short, true phrase naming what is being worked on. Updated from the
   * actual development focus; see src/data/current.ts for the full picture.
   */
  detail: "LumaOS Pro + TrackPro release engineering" as string | null,
};

export function githubProfileUrl(): string {
  return `https://github.com/${githubUsername}`;
}
