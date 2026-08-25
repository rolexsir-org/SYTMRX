import Link from "next/link";
import { ArrowUpRight, Code2, Download } from "lucide-react";

import type { Project } from "@/data/types";
import { categoryMeta, formatVersion, orDash, sortPlatforms, platformMeta } from "@/lib/meta";
import { hasPublishedDownload, type ProjectRelease } from "@/lib/downloads";
import { projectRepository } from "@/lib/repository";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { StatusBadge, OfflineBadge } from "@/components/ui/Badge";
import { ProjectImage } from "@/components/ui/ProjectVisual";
import { pad2 } from "@/lib/meta";

/**
 * Editorial project showcase.
 *
 * Four compositions share one data contract so no two projects in a list look
 * identical: feature (large, split), showcase (full-bleed visual), horizontal
 * (image beside a metadata rail) and compact (dense row).
 */

interface ShowcaseProps {
  project: Project;
  /**
   * Effective release state, resolved on the server. Passing it in keeps this
   * a server-rendered presentational component with no data fetching of its own.
   */
  release: ProjectRelease;
  index: number;
  /** Overrides the project's own layout, used by the /projects grid rhythm. */
  layout?: Project["layout"];
  priority?: boolean;
  /**
   * Heading level for the project name, so the document outline stays valid in
   * every context: "h3" under a section <h2> (homepage), "h2" directly under
   * the page <h1> (the /projects index).
   */
  headingLevel?: "h2" | "h3";
}

/**
 * A single metadata cell. Renders nothing when the value is unknown: a grid of
 * em dashes reads as missing data, while simply omitting the cell keeps the
 * card honest and uncluttered.
 */
function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex flex-col gap-1.5 border-t border-[var(--color-line)] pt-3">
      <dt className="label">{label}</dt>
      <dd className="text-[13.5px] text-[var(--color-bone-200)]">{value}</dd>
    </div>
  );
}

function ProjectLinks({
  project,
  release,
}: {
  project: Project;
  release: ProjectRelease;
}) {
  const repo = projectRepository(project);
  const downloadReady = hasPublishedDownload(release);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <Link
        href={`/projects/${project.slug}`}
        className="group/link inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-bone-50)]"
      >
        View Project
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
        />
      </Link>

      {repo ? (
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-2 text-[14px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
        >
          <Code2 aria-hidden="true" className="size-3.5" />
          View Source
        </a>
      ) : (
        <span
          className="inline-flex items-center gap-2 text-[14px] text-[var(--color-bone-600)]"
          title="No public repository is configured for this product"
        >
          <Code2 aria-hidden="true" className="size-3.5" />
          Source not published
        </span>
      )}

      {downloadReady && (
        <Link
          href={`/projects/${project.slug}#download`}
          className="group/link inline-flex items-center gap-2 text-[14px] text-[var(--color-brass-300)] transition-colors hover:text-[var(--color-brass-100)]"
        >
          <Download aria-hidden="true" className="size-3.5" />
          Download
        </Link>
      )}
    </div>
  );
}

function VisualFrame({
  project,
  className,
  sizes,
  priority,
}: {
  project: Project;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]",
        "bg-[var(--color-ink-900)]",
        className,
      )}
    >
      <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.025]">
        <ProjectImage
          screenshot={project.screenshots[0]}
          project={project}
          sizes={sizes}
          priority={priority}
        />
      </div>
      {/* Hover sheen — very subtle, top edge only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </div>
  );
}

export function ProjectShowcase({
  project,
  release,
  index,
  layout,
  priority,
  headingLevel = "h3",
}: ShowcaseProps) {
  const Heading = headingLevel;
  const composition = layout ?? project.layout;
  const platforms = sortPlatforms(project.platforms)
    .map((p) => platformMeta[p].label)
    .join(" · ");
  const tech = project.technologies.slice(0, 4).join(" · ");

  const header = (
    <div className="flex items-center gap-4">
      <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-bone-600)]">
        PROJECT {pad2(index)}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-line)]" />
      <StatusBadge status={project.status} />
    </div>
  );

  /* ---------------------------------------------------------------- feature */
  if (composition === "feature") {
    return (
      <Reveal as="article" className="group">
        {header}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <VisualFrame
              project={project}
              className="aspect-[4/3] sm:aspect-[16/10]"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority={priority}
            />
          </div>

          <div className="flex flex-col lg:col-span-5 lg:pt-2">
            <Heading className="display text-[clamp(1.75rem,4.5vw,2.75rem)]">
              {project.name}
            </Heading>
            <p className="mt-3 text-[15px] text-[var(--color-bone-400)]">
              {project.tagline}
            </p>
            <p className="mt-5 max-w-[46ch] text-[14.5px] leading-[1.7] text-[var(--color-bone-400)]">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.offline && <OfflineBadge />}
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4">
              <MetaRow label="Platform" value={orDash(platforms)} />
              <MetaRow label="Version" value={formatVersion(release.version)} />
              <MetaRow label="Technology" value={orDash(tech)} />
              <MetaRow label="Type" value={categoryMeta[project.category]} />
            </dl>

            <div className="mt-9">
              <ProjectLinks project={project} release={release} />
            </div>
          </div>
        </div>
      </Reveal>
    );
  }

  /* --------------------------------------------------------------- showcase */
  if (composition === "showcase") {
    return (
      <Reveal as="article" className="group">
        {header}
        <div className="mt-8">
          <VisualFrame
            project={project}
            className="aspect-[16/10] md:aspect-[21/9]"
            sizes="100vw"
            priority={priority}
          />
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <Heading className="display text-[clamp(1.75rem,4vw,2.5rem)]">
              {project.name}
            </Heading>
            <p className="mt-3 text-[15px] text-[var(--color-bone-400)]">
              {project.tagline}
            </p>
          </div>
          <div className="md:col-span-4">
            <p className="text-[14.5px] leading-[1.7] text-[var(--color-bone-400)]">
              {project.description}
            </p>
          </div>
          <div className="md:col-span-3">
            <dl className="grid gap-4">
              <MetaRow label="Platform" value={orDash(platforms)} />
              <MetaRow label="Version" value={formatVersion(release.version)} />
            </dl>
          </div>
        </div>
        <div className="mt-8">
          <ProjectLinks project={project} release={release} />
        </div>
      </Reveal>
    );
  }

  /* ------------------------------------------------------------- horizontal */
  if (composition === "horizontal") {
    return (
      <Reveal as="article" className="group">
        {header}
        <div className="mt-8 grid items-center gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <VisualFrame
              project={project}
              className="aspect-[4/3]"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div className="md:col-span-7">
            <Heading className="display text-[clamp(1.5rem,3.4vw,2.25rem)]">
              {project.name}
            </Heading>
            <p className="mt-3 max-w-[52ch] text-[14.5px] leading-[1.7] text-[var(--color-bone-400)]">
              {project.description}
            </p>
            <dl className="mt-7 grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <MetaRow label="Platform" value={orDash(platforms)} />
              <MetaRow label="Version" value={formatVersion(release.version)} />
              <MetaRow label="Type" value={categoryMeta[project.category]} />
            </dl>
            <div className="mt-8">
              <ProjectLinks project={project} release={release} />
            </div>
          </div>
        </div>
      </Reveal>
    );
  }

  /* ---------------------------------------------------------------- compact */
  return (
    <Reveal as="article" className="group">
      <Link
        href={`/projects/${project.slug}`}
        className="grid items-center gap-5 border-t border-[var(--color-line)] py-7 transition-colors duration-300 hover:border-[var(--color-line-strong)] sm:grid-cols-12 sm:gap-6"
      >
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-bone-600)] sm:col-span-1">
          {pad2(index)}
        </span>
        <div className="sm:col-span-4">
          <Heading className="text-[17px] font-medium tracking-[-0.02em] text-[var(--color-bone-50)]">
            {project.name}
          </Heading>
          <p className="mt-1 text-[13.5px] text-[var(--color-bone-500)]">
            {project.tagline}
          </p>
        </div>
        <p className="text-[13.5px] text-[var(--color-bone-400)] sm:col-span-3">
          {platforms || categoryMeta[project.category]}
        </p>
        <p className="text-[13px] text-[var(--color-bone-500)] sm:col-span-2">
          {release.version
            ? formatVersion(release.version)
            : categoryMeta[project.category]}
        </p>
        <div className="flex items-center justify-between gap-3 sm:col-span-2 sm:justify-end">
          <StatusBadge status={project.status} />
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-[var(--color-bone-600)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-bone-200)]"
          />
        </div>
      </Link>
    </Reveal>
  );
}
