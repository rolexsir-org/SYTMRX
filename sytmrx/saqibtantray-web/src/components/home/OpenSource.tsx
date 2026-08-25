import Link from "next/link";
import { ArrowUpRight, GitBranch, Star } from "lucide-react";

import { getRepoViews } from "@/lib/github";
import { githubProfileUrl, githubUsername } from "@/config/site";
import { isPlaceholder } from "@/lib/placeholder";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/Section";

/**
 * Open source section — a server component.
 *
 * Star counts come from the GitHub API at build/revalidate time and are only
 * rendered when the API actually returned a number. If GitHub is unreachable,
 * the section still renders from static metadata.
 */

export async function OpenSource() {
  const repoViews = await getRepoViews();
  const profileConfigured = !isPlaceholder(githubUsername);

  return (
    <>
      <SectionHeader
        index="05"
        label="Open source & experiments"
        title={
          <>
            Code in the{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">open</span>
          </>
        }
        description="Selected repositories. Source is hosted on GitHub, and compiled builds are distributed through GitHub Releases."
        action={
          profileConfigured ? (
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
          ) : (
            <span className="label" title="Set NEXT_PUBLIC_GITHUB_USERNAME">
              Profile not configured
            </span>
          )
        }
      />

      <div className="mt-12 grid gap-px md:mt-16">
        {repoViews.map((repo, index) => {
          const inner = (
            <>
              <div className="flex min-w-0 items-center gap-3 sm:col-span-5">
                <GitBranch
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-[var(--color-bone-600)]"
                />
                <span className="truncate font-[family-name:var(--font-mono)] text-[14px] text-[var(--color-bone-50)]">
                  {repo.unconfigured ? "Repository not configured" : repo.name}
                </span>
              </div>

              <p className="text-[13.5px] leading-relaxed text-[var(--color-bone-400)] sm:col-span-5">
                {repo.description}
              </p>

              <div className="flex items-center gap-5 sm:col-span-2 sm:justify-end">
                {repo.language && (
                  <span className="label text-[var(--color-bone-500)]">
                    {repo.language}
                  </span>
                )}
                {/* Only ever rendered when the API returned a real value */}
                {typeof repo.stars === "number" && (
                  <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-bone-400)]">
                    <Star aria-hidden="true" className="size-3" />
                    {repo.stars}
                  </span>
                )}
                {!repo.unconfigured && (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-[var(--color-bone-600)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-bone-200)]"
                  />
                )}
              </div>
            </>
          );

          const rowClass =
            "group grid items-center gap-3 border-t border-[var(--color-line)] py-6 transition-colors duration-300 sm:grid-cols-12 sm:gap-6";

          return (
            <Reveal key={`${repo.name}-${index}`} delay={index * 0.05}>
              {repo.url ? (
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${rowClass} hover:border-[var(--color-line-strong)]`}
                >
                  {inner}
                </a>
              ) : (
                <div className={rowClass}>{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>

      {!profileConfigured && (
        <Reveal delay={0.1}>
          <p className="mt-8 text-[13px] leading-relaxed text-[var(--color-bone-500)]">
            Set{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-bone-400)]">
              NEXT_PUBLIC_GITHUB_USERNAME
            </code>{" "}
            and the repository names in{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-bone-400)]">
              src/data/projects.ts
            </code>{" "}
            to activate these links.{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:text-[var(--color-bone-200)]">
              Contact
            </Link>
          </p>
        </Reveal>
      )}
    </>
  );
}
