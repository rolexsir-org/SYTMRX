import type { Platform, ProjectCategory, ProjectStatus } from "@/data/types";

/* ------------------------------------------------------------------------- */
/* Platforms                                                                   */
/* ------------------------------------------------------------------------- */

export const platformMeta: Record<
  Platform,
  { label: string; short: string; extension: string; installNote: string | null }
> = {
  android: {
    label: "Android",
    short: "APK",
    extension: ".apk",
    installNote:
      "Android may require permission to install apps from this source. Only install software you trust.",
  },
  windows: { label: "Windows", short: "EXE", extension: ".exe", installNote: null },
  macos: { label: "macOS", short: "DMG", extension: ".dmg", installNote: null },
  linux: { label: "Linux", short: "AppImage", extension: ".AppImage", installNote: null },
  ios: { label: "iOS", short: "iOS", extension: "", installNote: null },
  web: { label: "Web", short: "Web", extension: "", installNote: null },
};

export const platformOrder: Platform[] = [
  "android",
  "ios",
  "windows",
  "macos",
  "linux",
  "web",
];

export function sortPlatforms(platforms: Platform[]): Platform[] {
  return [...platforms].sort(
    (a, b) => platformOrder.indexOf(a) - platformOrder.indexOf(b),
  );
}

/* ------------------------------------------------------------------------- */
/* Status                                                                      */
/* ------------------------------------------------------------------------- */

export const statusMeta: Record<
  ProjectStatus,
  { label: string; dot: string; text: string }
> = {
  released: {
    label: "Released",
    dot: "bg-[var(--color-signal-live)]",
    text: "text-[var(--color-signal-live)]",
  },
  built: {
    label: "Built",
    dot: "bg-[var(--color-signal-live)]",
    text: "text-[var(--color-signal-live)]",
  },
  beta: {
    label: "Beta",
    dot: "bg-[var(--color-signal-beta)]",
    text: "text-[var(--color-signal-beta)]",
  },
  "in-development": {
    label: "In development",
    dot: "bg-[var(--color-signal-work)]",
    text: "text-[var(--color-signal-work)]",
  },
  experimental: {
    label: "Experimental",
    dot: "bg-[var(--color-signal-work)]",
    text: "text-[var(--color-signal-work)]",
  },
  concept: {
    label: "Concept",
    dot: "bg-[var(--color-signal-idle)]",
    text: "text-[var(--color-signal-idle)]",
  },
  archived: {
    label: "Archived",
    dot: "bg-[var(--color-signal-idle)]",
    text: "text-[var(--color-signal-idle)]",
  },
};

/* ------------------------------------------------------------------------- */
/* Categories                                                                  */
/* ------------------------------------------------------------------------- */

export const categoryMeta: Record<ProjectCategory, string> = {
  "mobile-app": "Mobile application",
  "desktop-app": "Desktop application",
  "web-app": "Web application",
  game: "Game",
  tool: "Tool",
  library: "Library",
  experiment: "Experiment",
};

/* ------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* ------------------------------------------------------------------------- */

/** Formats an ISO date. Returns the em dash for unknown values — never a guess. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatVersion(version: string | null | undefined): string {
  if (!version) return "—";
  return version.startsWith("v") ? version : `v${version}`;
}

/** Any unknown scalar renders as an em dash rather than a fabricated value. */
export function orDash(value: string | null | undefined): string {
  return value && value.trim().length > 0 ? value : "—";
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
