import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download, Info, Package } from "lucide-react";

import { allProjects } from "@/data/projects";
import { staticRelease } from "@/lib/downloads";
import { getProjectReleases } from "@/lib/project-release";
import { projectRepository } from "@/lib/repository";
import {
  categoryMeta,
  formatDate,
  formatVersion,
  platformMeta,
  sortPlatforms,
} from "@/lib/meta";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { AppIcon } from "@/components/ui/ProjectVisual";
import { StatusBadge, OfflineBadge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Software, applications and digital products built by SYTMRX. Builds are distributed through GitHub Releases.",
  alternates: { canonical: "/apps" },
  openGraph: {
    title: "Products — SYTMRX",
    description:
      "Software, applications and digital products built by SYTMRX.",
    url: "/apps",
  },
};

export const revalidate = 3600;

/**
 * /apps — a small independent software store.
 * Every value shown comes from project metadata. Nothing is invented, and
 * unpublished builds are labelled as pending rather than hidden or faked.
 */
export default async function AppsPage() {
  // The full catalogue. Products without a build still belong here — the card
  // simply shows no download action rather than hiding the product entirely.
  const apps = allProjects();
  const releases = await getProjectReleases(apps);

  return (
    <>
      <PageHeader
        label="Products"
        title={
          <>
            Software we{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">build.</span>
          </>
        }
        description="The full SYTMRX catalogue. Where a build exists it is distributed through GitHub Releases and served directly by GitHub — this site keeps no build artefacts."
        meta={
          <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-bone-500)] uppercase">
            {apps.length} {apps.length === 1 ? "product" : "products"}
          </p>
        }
      />

      <div className="gutter mx-auto max-w-[1600px] pb-24 md:pb-32">
        {apps.length === 0 ? (
          <div className="flex flex-col items-start gap-4 border-t border-[var(--color-line)] py-20">
            <Package aria-hidden="true" className="size-5 text-[var(--color-bone-600)]" />
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-[var(--color-bone-400)]">
              No downloadable builds have been published yet. Once a product defines a
              download in its metadata, it appears here automatically.
            </p>
            <Link
              href="/projects"
              className="mt-2 inline-flex items-center gap-2 text-[14px] text-[var(--color-bone-50)]"
            >
              View all work
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {apps.map((project, index) => {
              const release = releases.get(project.slug) ?? staticRelease(project);
              const downloads = release.downloads;
              const platforms = sortPlatforms(project.platforms);
              const primary = downloads.find((d) => d.published) ?? downloads[0];
              const repo = projectRepository(project);

              // Only known values become visible rows.
              const facts: { label: string; value: string; mono?: boolean }[] = [];
              if (platforms.length > 0) {
                facts.push({
                  label: "Platform",
                  value: platforms.map((pf) => platformMeta[pf].label).join(" · "),
                });
              }
              facts.push({ label: "Type", value: categoryMeta[project.category] });
              if (release.version) {
                facts.push({
                  label: "Version",
                  value: formatVersion(release.version),
                  mono: true,
                });
              }
              if (release.releaseDate) {
                facts.push({
                  label: "Released",
                  value: formatDate(release.releaseDate),
                });
              }
              if (primary?.asset.size) {
                facts.push({ label: "Size", value: primary.asset.size });
              }

              return (
                <Reveal key={project.slug} delay={index * 0.06}>
                  <article className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white/[0.015] p-6 transition-colors duration-500 hover:border-[var(--color-line-strong)] md:p-8">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <AppIcon project={project} size="lg" />
                      <div className="min-w-0 flex-1">
                        <h2 className="text-[20px] font-medium tracking-[-0.022em] text-[var(--color-bone-50)]">
                          {project.name}
                        </h2>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-bone-400)]">
                          {project.tagline}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <StatusBadge status={project.status} />
                          {project.offline && <OfflineBadge />}
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 text-[14px] leading-[1.7] text-[var(--color-bone-400)]">
                      {project.description}
                    </p>

                    {/* Store metadata.
                        Only facts that are actually known are rendered. A grid
                        of em dashes would be honest but unreadable, so unknown
                        fields are omitted and the row reflows. */}
                    <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-line)] pt-6 sm:grid-cols-4">
                      {facts.map((fact) => (
                        <div key={fact.label}>
                          <dt className="label">{fact.label}</dt>
                          <dd
                            className={
                              fact.mono
                                ? "mt-1.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-bone-200)]"
                                : "mt-1.5 text-[13.5px] text-[var(--color-bone-200)]"
                            }
                          >
                            {fact.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {/* Actions */}
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                      {!primary ? null : primary.published ? (
                        <a
                          href={primary.asset.url}
                          rel="noopener noreferrer nofollow"
                          className="inline-flex h-11 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-5 text-[14px] font-medium text-[var(--color-ink-950)] transition-colors duration-300 hover:bg-white"
                          aria-label={`Download ${project.name} for ${platformMeta[primary.platform].label}`}
                        >
                          <Download aria-hidden="true" className="size-4" />
                          Download {platformMeta[primary.platform].short}
                        </a>
                      ) : (
                        <span
                          aria-disabled="true"
                          className="inline-flex h-11 cursor-not-allowed items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line)] px-5 text-[14px] text-[var(--color-bone-600)]"
                          title="No build published yet"
                        >
                          <Download aria-hidden="true" className="size-4" />
                          Build pending
                        </span>
                      )}

                      <Link
                        href={`/projects/${project.slug}`}
                        className="group/link inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-5 text-[14px] font-medium text-[var(--color-bone-50)] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
                      >
                        View Project
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-3.5 opacity-60 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        />
                      </Link>

                      {repo && (
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 items-center px-2 text-[14px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
                        >
                          Source
                        </a>
                      )}
                    </div>

                    {/* Android sideloading notice, only when an APK is downloadable */}
                    {primary?.published &&
                      platformMeta[primary.platform].installNote && (
                        <p className="mt-5 flex items-start gap-2.5 border-t border-[var(--color-line)] pt-5 text-[12.5px] leading-relaxed text-[var(--color-bone-500)]">
                          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                          {platformMeta[primary.platform].installNote}
                        </p>
                      )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Distribution explainer */}
        <Reveal delay={0.1}>
          <div className="mt-16 border-t border-[var(--color-line)] pt-8">
            <p className="label">Distribution</p>
            <p className="mt-4 max-w-[70ch] text-[14px] leading-[1.75] text-[var(--color-bone-400)]">
              This site is the presentation layer. GitHub Releases is the distribution
              layer. Selecting a download sends you to the release asset hosted by
              GitHub. There are no download counters here, and no analytics on
              downloads — what you see is only what the project metadata declares.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}
