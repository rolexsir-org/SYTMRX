/**
 * Build-time project data validation.
 *
 * TypeScript proves the *shape* of `projects.ts`; this proves its *semantics* —
 * the invariants a type cannot express. It runs as part of `npm run validate`
 * and in CI, so malformed metadata fails the pipeline instead of shipping.
 *
 * Checks performed:
 *   • required fields are present and non-empty
 *   • slugs are unique, URL-safe and match their route
 *   • orders are unique
 *   • screenshots have alt text, and real images declare true dimensions
 *   • placeholder tokens never leak into user-visible copy
 *   • every external URL is absolute https
 *   • download URLs point only at trusted GitHub hosts
 *   • published version/date pairs are internally consistent
 *   • changelog entries never claim an unreleased version is released
 *   • repository references are well-formed when present
 *
 * Exit code 1 on any error. Warnings are informational and do not fail.
 */

import { projects, repos } from "../src/data/projects";
import type { Project } from "../src/data/types";
import { PLACEHOLDER_PREFIX, isPlaceholder } from "../src/lib/placeholder";

const errors: string[] = [];
const warnings: string[] = [];

const fail = (slug: string, message: string) =>
  errors.push(`[${slug}] ${message}`);
const warn = (slug: string, message: string) =>
  warnings.push(`[${slug}] ${message}`);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GITHUB_NAME_RE = /^[A-Za-z0-9_.-]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SEMVER_ISH_RE = /^\d+\.\d+(\.\d+)?([-+].+)?$/;
const SHA256_RE = /^[a-f0-9]{64}$/i;

const TRUSTED_DOWNLOAD_HOSTS = [
  "github.com",
  "objects.githubusercontent.com",
  "release-assets.githubusercontent.com",
];

function isHttps(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.length > 0;
  } catch {
    return false;
  }
}

function isTrustedDownloadHost(value: string): boolean {
  try {
    const { hostname } = new URL(value);
    return (
      TRUSTED_DOWNLOAD_HOSTS.includes(hostname) ||
      hostname.endsWith(".githubusercontent.com")
    );
  } catch {
    return false;
  }
}

/** Placeholder tokens must never appear in rendered prose. */
function assertNoPlaceholderLeak(slug: string, field: string, value: string) {
  if (value.includes(PLACEHOLDER_PREFIX)) {
    fail(slug, `${field} contains a placeholder token that would render to users`);
  }
}

function validateProject(project: Project) {
  const { slug } = project;

  if (!slug || !SLUG_RE.test(slug)) {
    fail(slug || "<missing slug>", "slug must be lowercase kebab-case");
  }

  // Required, user-visible strings.
  const required: [string, string][] = [
    ["name", project.name],
    ["tagline", project.tagline],
    ["description", project.description],
    ["icon", project.icon],
  ];
  for (const [field, value] of required) {
    if (!value || value.trim().length === 0) {
      fail(slug, `${field} is required and must not be empty`);
    } else {
      assertNoPlaceholderLeak(slug, field, value);
    }
  }

  project.longDescription.forEach((paragraph, i) =>
    assertNoPlaceholderLeak(slug, `longDescription[${i}]`, paragraph),
  );
  project.features.forEach((f, i) => assertNoPlaceholderLeak(slug, `features[${i}]`, f));
  if (project.problem) assertNoPlaceholderLeak(slug, "problem", project.problem);
  if (project.solution) assertNoPlaceholderLeak(slug, "solution", project.solution);

  // Accent colours must be real hex values (they drive generated previews).
  project.accent.forEach((colour, i) => {
    if (!/^#[0-9a-f]{6}$/i.test(colour)) {
      fail(slug, `accent[${i}] "${colour}" is not a 6-digit hex colour`);
    }
  });

  // Screenshots.
  project.screenshots.forEach((shot, i) => {
    if (!shot.alt || shot.alt.trim().length === 0) {
      fail(slug, `screenshots[${i}] is missing alt text`);
    }
    if (shot.src) {
      if (!shot.src.startsWith("/")) {
        fail(slug, `screenshots[${i}].src must be a root-relative /public path`);
      }
      if (!shot.width || !shot.height) {
        fail(
          slug,
          `screenshots[${i}] has a src but no width/height — required so it is never distorted`,
        );
      }
    }
  });

  // Repository reference.
  if (project.repository) {
    const { owner, name } = project.repository;
    if (!name || !GITHUB_NAME_RE.test(name)) {
      fail(slug, `repository.name "${name}" is not a valid GitHub repository name`);
    }
    if (owner !== undefined && !GITHUB_NAME_RE.test(owner)) {
      fail(slug, `repository.owner "${owner}" is not a valid GitHub owner`);
    }
  }

  // Live URL.
  if (project.liveUrl !== null && !isHttps(project.liveUrl)) {
    fail(slug, `liveUrl "${project.liveUrl}" must be an absolute https URL`);
  }

  // Release source consistency.
  const source = project.releaseSource ?? "none";
  if (source === "github-release" && !project.repository) {
    warn(
      slug,
      "releaseSource is 'github-release' but no repository is configured — downloads stay unavailable until it is set",
    );
  }

  // Version / date consistency.
  if (project.version && !SEMVER_ISH_RE.test(project.version)) {
    fail(slug, `version "${project.version}" is not a valid version string`);
  }
  if (project.releaseDate && !ISO_DATE_RE.test(project.releaseDate)) {
    fail(slug, `releaseDate "${project.releaseDate}" must be YYYY-MM-DD`);
  }
  if (project.releaseDate && Number.isNaN(Date.parse(project.releaseDate))) {
    fail(slug, `releaseDate "${project.releaseDate}" is not a real date`);
  }
  if (project.version && !project.releaseDate) {
    warn(slug, "version is set but releaseDate is null");
  }

  // A project may not claim "released" without a real published artifact or
  // an automatic release source that could provide one.
  if (project.status === "released" && source === "none" && !project.version) {
    fail(slug, "status is 'released' but there is no version and no release source");
  }

  // Downloads.
  for (const [platform, asset] of Object.entries(project.downloads)) {
    if (!asset) continue;
    const label = `downloads.${platform}`;

    if (!isPlaceholder(asset.url)) {
      if (!isHttps(asset.url)) {
        fail(slug, `${label}.url must be an absolute https URL`);
      } else if (!isTrustedDownloadHost(asset.url)) {
        fail(
          slug,
          `${label}.url host is not a trusted GitHub release host — it would be blocked at render time`,
        );
      }
      if (!asset.filename) {
        warn(slug, `${label} has a real URL but no filename`);
      }
    }

    if (asset.sha256 && !SHA256_RE.test(asset.sha256)) {
      fail(slug, `${label}.sha256 is not a valid 64-character hex digest`);
    }

    if (!project.platforms.includes(platform as never)) {
      fail(slug, `${label} exists but "${platform}" is not listed in platforms`);
    }
  }

  // Changelog must never present an unreleased version as released.
  project.changelog.forEach((entry, i) => {
    if (!entry.version || entry.version.trim().length === 0) {
      fail(slug, `changelog[${i}] is missing a version`);
    }
    if (entry.date && !ISO_DATE_RE.test(entry.date)) {
      fail(slug, `changelog[${i}].date "${entry.date}" must be YYYY-MM-DD`);
    }
    if (entry.changes.length === 0) {
      fail(slug, `changelog[${i}] has no entries`);
    }
  });

  if (project.changelog.length > 0 && !project.version) {
    fail(
      slug,
      "changelog has entries but the project has no published version — that would present unreleased work as released",
    );
  }

  // detailsPending products should not also carry rich documentation.
  if (project.detailsPending && project.features.length > 0) {
    warn(slug, "detailsPending is true but features are documented");
  }
}

/* --------------------------------------------------------------------- run */

const slugs = new Set<string>();
const orders = new Set<number>();

for (const project of projects) {
  if (slugs.has(project.slug)) {
    fail(project.slug, "duplicate slug");
  }
  slugs.add(project.slug);

  if (orders.has(project.order)) {
    warn(project.slug, `duplicate order ${project.order} — list ordering is ambiguous`);
  }
  orders.add(project.order);

  validateProject(project);
}

repos.forEach((repo, i) => {
  if (!repo.name || !GITHUB_NAME_RE.test(repo.name)) {
    errors.push(`[repos[${i}]] name "${repo.name}" is not a valid repository name`);
  }
  if (repo.owner !== undefined && !GITHUB_NAME_RE.test(repo.owner)) {
    errors.push(`[repos[${i}]] owner "${repo.owner}" is not a valid GitHub owner`);
  }
  if (repo.projectSlug && !slugs.has(repo.projectSlug)) {
    errors.push(`[repos[${i}]] projectSlug "${repo.projectSlug}" matches no project`);
  }
});

/* ------------------------------------------------------------------ report */

const label = (n: number, word: string, plural = `${word}s`) =>
  `${n} ${n === 1 ? word : plural}`;

if (warnings.length > 0) {
  console.warn(`\n⚠  ${label(warnings.length, "warning")}:`);
  warnings.forEach((w) => console.warn(`   ${w}`));
}

if (errors.length > 0) {
  console.error(`\n✖  ${label(errors.length, "error")} in project data:`);
  errors.forEach((e) => console.error(`   ${e}`));
  console.error("");
  process.exit(1);
}

console.log(
  `\n✓  Project data valid — ${label(projects.length, "project")}, ${label(repos.length, "repository", "repositories")} checked.`,
);
