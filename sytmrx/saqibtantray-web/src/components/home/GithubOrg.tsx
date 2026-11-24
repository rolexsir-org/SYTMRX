import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";

import { getOrgRepoViews, type OrgRepoView } from "@/lib/github";
import { githubProfileUrl, githubUsername } from "@/config/site";
import { repos } from "@/data/projects";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/Section";

/**
 * GitHub organisation identity — a server component.
 *
 * Repository rows come from the shared GitHub client (cached, timeout-bounded)
 * and fall back to the audited static list when the API is unreachable, in
 * which case rows are marked "stale" and say so. Only real values render:
 * stars appear only when the API returned them, dates only when the API
 * returned them. No follower counts, no contribution graphs, no invented
 * activity.
 *
 * Repositories that back a product on this site link to the product page;
 * every row also links straight to the source on GitHub.
 */

/** repo name → product slug, from the curated mapping in the project data. */
const REPO_TO_SLUG = new Map(
  repos.filter((repo) => repo.projectSlug).map((repo) => [repo.name, repo.projectSlug as string]),
);

function relativeDays(iso: string | null): string | null {
  if (!iso) return null;
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return null;
  const days = Math.floor((Date.now() - then.getTime()) / 86_400_000);
  if (days < 0) return null;
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function RepoRow({ repo }: { repo: OrgRepoView }) {
  const updated = repo.stale ? null : relativeDays(repo.pushedAt);
  const projectSlug = REPO_TO_SLUG.get(repo.name);
  const sourceUrl = repo.url ?? githubProfileUrl();

  return (
    <div className="group grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[var(--color-line)] py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 md:col-span-4">
        {projectSlug ? (
          <Link
            href={`/projects/${projectSlug}`}
            className="truncate font-[family-name:var(--font-mono)] text-[13.5px] text-[var(--color-bone-50)] underline-offset-4 hover:underline"
            title={`Open the ${repo.name} product page`}
          >
            {repo.name}
          </Link>
        ) : (
          <span className="truncate font-[family-name:var(--font-mono)] text-[13.5px] text-[var(--color-bone-50)]">
            {repo.name}
          </span>
        )}
        {repo.language && (
          <span className="label shrink-0 text-[var(--color-bone-600)]">{repo.language}</span>
        )}
      </div>

      <p className="max-w-[52ch] text-[13px] leading-[1.6] text-[var(--color-bone-500)] md:col-span-6">
        {repo.description ?? "No description set on the repository."}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:col-span-2 md:justify-end">
        {typeof repo.stars === "number" && repo.stars > 0 && (
          <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-bone-500)]">
            <Star aria-hidden="true" className="size-3" />
            {repo.stars}
          </span>
        )}
        {updated && (
          <span className="label text-[var(--color-bone-600)]">Updated {updated}</span>
        )}
        {repo.stale ? (
          <span
            className="label text-[var(--color-bone-600)]"
            title="GitHub API unreachable — static repository list shown"
          >
            Cached list
          </span>
        ) : (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/source inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-bone-500)] transition-colors hover:text-[var(--color-brass-300)]"
          >
            source
            <ArrowUpRight
              aria-hidden="true"
              className="size-3 transition-transform duration-300 group-hover/source:translate-x-0.5 group-hover/source:-translate-y-0.5"
            />
          </a>
        )}
      </div>
    </div>
  );
}

export async function GithubOrg() {
  const repos = await getOrgRepoViews(10);
  const live = repos.some((repo) => !repo.stale);

  return (
    <>
      <SectionHeader
        index="06"
        label="GitHub — rolexsir-org"
        title={
          <>
            The work is{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">public</span>
          </>
        }
        description="Every project lives in the public repositories of the GitHub account behind SYTMRX. Source, engineering documents, test suites and release history are all inspectable — this site links to them rather than paraphrasing them."
        action={
          <a
            href={githubProfileUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[13px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
          >
            @{githubUsername}
            <ArrowUpRight
              aria-hidden="true"
              className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        }
      />

      <Reveal>
        <div className="mt-10 border-x border-b border-[var(--color-line)] first-of-type:border-t">
          {repos.map((repo) => (
            <RepoRow key={repo.name} repo={repo} />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.1em] text-[var(--color-bone-600)] uppercase">
            {live ? "Live from the GitHub API · cached hourly" : "Static repository list · API unreachable at render time"}
          </p>
          <a
            href={githubProfileUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-bone-50)]"
          >
            View all repositories
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </Reveal>
    </>
  );
}
