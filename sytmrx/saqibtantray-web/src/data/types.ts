/**
 * Project / application metadata contracts.
 *
 * Everything the UI renders about a project comes from here. Adding a new app
 * means adding one object to `src/data/projects.ts` — never a new component.
 *
 * Rules:
 * - Unknown values are `null` (rendered as "—" or hidden), never invented.
 * - Unknown URLs use `placeholder("KEY")` (rendered as a disabled, labelled state).
 */

export type Platform = "android" | "windows" | "macos" | "linux" | "ios" | "web";

export type ProjectStatus =
  | "released"
  | "beta"
  | "in-development"
  | "experimental"
  | "concept"
  | "archived";

export type ProjectCategory =
  | "mobile-app"
  | "desktop-app"
  | "web-app"
  | "game"
  | "tool"
  | "library"
  | "experiment";

/** Visual weight of a project inside the Selected Work composition. */
export type ProjectLayout = "feature" | "horizontal" | "compact" | "showcase";

/**
 * Explicit repository mapping.
 *
 * A repository URL is never constructed from a guess. A project either declares
 * a real repository here or it has none, in which case the UI says so.
 */
export interface RepositoryRef {
  /** Defaults to the configured GitHub owner (see `src/config/site.ts`). */
  owner?: string;
  /** Repository name only, e.g. "offline-institute-management". */
  name: string;
}

/**
 * How a project's downloads are obtained.
 *
 * - "github-release": resolved automatically from published GitHub Releases.
 *   Static values below act purely as offline fallback.
 * - "static": the values in `downloads` are authoritative (for artifacts that
 *   are not distributed through GitHub Releases).
 * - "none": the project has no downloadable build.
 */
export type ReleaseSource = "github-release" | "static" | "none";

/**
 * Which releases are eligible when resolving automatically.
 * Drafts are never eligible — they are not public artifacts.
 */
export type ReleaseChannel = "stable" | "prerelease";

export interface DownloadAsset {
  /**
   * Direct download URL, or a placeholder token until published.
   * Only absolute https URLs are ever linked.
   */
  url: string;
  /** Exact asset filename, or null if not published yet. */
  filename: string | null;
  /** Human readable size exactly as reported by the release, e.g. "18 MB". */
  size: string | null;
  /** Integrity checksum, or null when none has been published. */
  sha256?: string | null;
  /** Optional per-asset note (e.g. "arm64-v8a only"). */
  note?: string | null;
}

export type Downloads = Partial<Record<Platform, DownloadAsset>>;

/**
 * Matches a release asset to a platform when resolving automatically.
 * Evaluated against the lower-cased asset filename.
 */
export interface AssetMatcher {
  platform: Platform;
  /** Filename must end with one of these, e.g. [".apk"]. */
  extensions: string[];
  /** Optional extra substring requirement, e.g. "arm64". */
  contains?: string;
}

export interface Screenshot {
  /** Path under /public, or null when no screenshot has been added yet. */
  src: string | null;
  /** Required for accessibility. Describe what the screen shows. */
  alt: string;
  /** Intrinsic dimensions. Required when `src` is set so images never distort. */
  width?: number;
  height?: number;
  /** Presentation hint. */
  frame?: "phone" | "browser" | "raw";
  caption?: string | null;
}

export interface ChangelogEntry {
  version: string;
  date: string | null;
  changes: string[];
}

export interface ArchitectureNote {
  label: string;
  value: string;
}

export interface Project {
  /** URL segment: /projects/[slug] */
  slug: string;
  name: string;
  /** One line, shown under the name. */
  tagline: string;
  /** 1–2 sentences, used in lists, cards and metadata. */
  description: string;
  /** Full paragraphs for the project page. May be empty when undocumented. */
  longDescription: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  platforms: Platform[];
  /** e.g. "1.0.0" — null until a build is published. */
  version: string | null;
  /** ISO date (YYYY-MM-DD) — null until a build is published. */
  releaseDate: string | null;
  /** Short monogram used by the generated preview when no screenshot exists. */
  icon: string;
  /** Two hex colors driving the generated preview / app icon gradient. */
  accent: [string, string];
  screenshots: Screenshot[];
  /**
   * The problem this software solves. `null` when it has not been documented
   * yet — the UI omits the section rather than inventing a rationale.
   */
  problem: string | null;
  /** How it solves it. `null` when not documented yet. */
  solution: string | null;
  features: string[];
  technologies: string[];
  architecture: ArchitectureNote[];
  requirements: string[];
  /** Works without a network connection. */
  offline: boolean;
  /**
   * Real GitHub repository, or null when the project has no public repo.
   * The URL is derived from this — never hand-written, never guessed.
   */
  repository: RepositoryRef | null;
  /** Live/demo URL, or null when there is nothing to link. */
  liveUrl: string | null;
  /** Where downloads come from. Defaults to "none" when omitted. */
  releaseSource?: ReleaseSource;
  /** Which releases are eligible for automatic resolution. Default "stable". */
  releaseChannel?: ReleaseChannel;
  /**
   * Overrides the default extension-to-platform matching when resolving
   * release assets automatically.
   */
  assetMatchers?: AssetMatcher[];
  /**
   * Static download metadata.
   *
   * When `releaseSource` is "github-release" these are only a fallback used if
   * the GitHub API is unavailable. Live release data always takes precedence.
   */
  downloads: Downloads;
  changelog: ChangelogEntry[];
  /** Show on the homepage Selected Work section. */
  featured: boolean;
  /** Composition used in Selected Work. */
  layout: ProjectLayout;
  /** Manual ordering, ascending. */
  order: number;
  /**
   * True when only the product's existence is public and its capabilities have
   * not been documented yet. The UI shows an explicit "details not published"
   * state instead of padding the page with invented features.
   */
  detailsPending?: boolean;
}

export interface Repo {
  /** Repository name only, e.g. "offline-institute-management". */
  name: string;
  /** Defaults to the configured GitHub owner. */
  owner?: string;
  description: string;
  /** Primary language, or null if you would rather not state one. */
  language: string | null;
  /** Optional: link to a project page on this site. */
  projectSlug?: string;
}
