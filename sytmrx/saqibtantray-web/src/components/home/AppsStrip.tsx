import Link from "next/link";
import { ArrowUpRight, Download, Package } from "lucide-react";

import { allProjects } from "@/data/projects";
import { hasPublishedDownload, staticRelease } from "@/lib/downloads";
import { getProjectReleases } from "@/lib/project-release";
import { formatVersion, orDash, platformMeta, sortPlatforms } from "@/lib/meta";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { AppIcon } from "@/components/ui/ProjectVisual";
import { StatusBadge, OfflineBadge } from "@/components/ui/Badge";

/**
 * Homepage software strip — a compact preview of /apps.
 * Distinct composition from Selected Work: icon-led rows, store-like.
 */
export async function AppsStrip() {
  const apps = allProjects();
  const releases = await getProjectReleases(apps);

  return (
    <>
      <SectionHeader
        index="02"
        label="Products"
        title={
          <>
            The product{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">catalogue</span>
          </>
        }
        description="Everything SYTMRX is building. Compiled builds are distributed through GitHub Releases, and only platforms with a published build show a download."
        action={
          <Link
            href="/apps"
            className="group inline-flex items-center gap-1.5 text-[13px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
          >
            All products
            <ArrowUpRight
              aria-hidden="true"
              className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        }
      />

      {apps.length === 0 ? (
        <Reveal>
          <div className="mt-12 flex items-center gap-4 border-t border-[var(--color-line)] py-10">
            <Package aria-hidden="true" className="size-4 text-[var(--color-bone-600)]" />
            <p className="text-[14.5px] text-[var(--color-bone-400)]">
              No products have been added yet.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-12 grid gap-px md:mt-16">
          {apps.map((project, index) => {
            const platforms = sortPlatforms(project.platforms)
              .map((p) => platformMeta[p].label)
              .join(" · ");
            const release = releases.get(project.slug) ?? staticRelease(project);
            const ready = hasPublishedDownload(release);

            return (
              <Reveal key={project.slug} delay={index * 0.05}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 border-t border-[var(--color-line)] py-7 transition-colors duration-300 hover:border-[var(--color-line-strong)] lg:grid-cols-12"
                >
                  <div className="lg:col-span-1">
                    <AppIcon project={project} size="md" />
                  </div>

                  <div className="min-w-0 lg:col-span-4">
                    <h3 className="text-[17px] font-medium tracking-[-0.02em] text-[var(--color-bone-50)]">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-bone-500)]">
                      {project.tagline}
                    </p>
                  </div>

                  <div className="col-span-2 flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-4">
                    <span className="text-[13.5px] text-[var(--color-bone-400)]">
                      {orDash(platforms)}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-bone-500)]">
                      {formatVersion(release.version)}
                    </span>
                    {project.offline && <OfflineBadge />}
                  </div>

                  <div className="col-span-2 flex items-center justify-between gap-4 lg:col-span-3 lg:justify-end">
                    <StatusBadge status={project.status} />
                    <span
                      className={
                        ready
                          ? "inline-flex items-center gap-1.5 text-[13px] text-[var(--color-brass-300)]"
                          : "inline-flex items-center gap-1.5 text-[13px] text-[var(--color-bone-600)]"
                      }
                    >
                      <Download aria-hidden="true" className="size-3.5" />
                      {ready ? "Download" : "Pending"}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </>
  );
}
