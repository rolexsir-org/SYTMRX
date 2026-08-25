import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  History,
  Layers,
  Target,
} from "lucide-react";

import { getProject, projectSlugs } from "@/data/projects";
import { siteConfig } from "@/config/site";
import { hasPublishedDownload } from "@/lib/downloads";
import { getProjectRelease } from "@/lib/project-release";
import { projectRepository } from "@/lib/repository";
import {
  categoryMeta,
  formatDate,
  formatVersion,
  orDash,
  platformMeta,
  sortPlatforms,
  statusMeta,
} from "@/lib/meta";
import { Reveal } from "@/components/motion/Reveal";
import { Gallery } from "@/components/projects/Gallery";
import { ShareButton } from "@/components/ui/ShareButton";
import { DownloadSection } from "@/components/downloads/DownloadCard";
import { StatusBadge, OfflineBadge, Chip } from "@/components/ui/Badge";
import { GeneratedPreview, AppIcon } from "@/components/ui/ProjectVisual";

/* Static generation for every known project. */
export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

/* Per-project metadata, including project-specific OG images. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project not found",
      description: "This project does not exist.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${project.name} — ${project.tagline}`;
  const url = `/projects/${project.slug}`;

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: project.description,
      url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
    },
  };
}

function SectionBlock({
  id,
  index,
  title,
  icon: Icon,
  children,
}: {
  id?: string;
  index: string;
  title: string;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`section-${index}-heading`} className="scroll-mt-28">
      <Reveal>
        <div className="flex items-center gap-4 border-b border-[var(--color-line)] pb-4">
          <span className="label text-[var(--color-bone-600)]">{index}</span>
          {Icon && (
            <Icon aria-hidden={true} className="size-3.5 text-[var(--color-bone-500)]" />
          )}
          <h2 id={`section-${index}-heading`} className="label text-[var(--color-bone-400)]">
            {title}
          </h2>
        </div>
      </Reveal>
      <div className="pt-8">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const platforms = sortPlatforms(project.platforms);
  const repo = projectRepository(project);
  // Live GitHub Release data merged over static fallback (never throws).
  const release = await getProjectRelease(project);
  const downloads = release.downloads;
  const downloadable = hasPublishedDownload(release);
  const heroShot = project.screenshots.find((s) => s.src);

  /* Section numbers are derived from what actually renders, so a product with
     undocumented sections still reads 01, 02, 03 rather than skipping numbers. */
  const showProblem = Boolean(project.problem || project.solution);
  const showFeatures = project.features.length > 0;
  const showShots = project.screenshots.length > 0;
  const showArchitecture = project.architecture.length > 0;

  let sectionCounter = 0;
  const nextIndex = () => String(++sectionCounter).padStart(2, "0");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    applicationCategory: categoryMeta[project.category],
    operatingSystem: platforms.map((p) => platformMeta[p].label).join(", "),
    author: { "@type": "Person", name: siteConfig.name },
    // Version / date only asserted when they genuinely exist.
    ...(release.version ? { softwareVersion: release.version } : {}),
    ...(release.releaseDate ? { datePublished: release.releaseDate } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ------------------------------------------------------------- hero */}
      <div className="gutter mx-auto max-w-[1600px] pt-8 md:pt-12">
        <Reveal>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-[13px] text-[var(--color-bone-500)] transition-colors hover:text-[var(--color-bone-200)]"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            All projects
          </Link>
        </Reveal>
      </div>

      <header className="gutter mx-auto max-w-[1600px] pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <AppIcon project={project} size="sm" />
                <StatusBadge status={project.status} />
                {project.offline && <OfflineBadge />}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="display mt-7 text-[clamp(2.5rem,7.5vw,5rem)]">
                {project.name}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[40ch] text-[clamp(1.125rem,2.6vw,1.5rem)] leading-[1.35] tracking-[-0.02em] text-[var(--color-bone-200)]">
                {project.tagline}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                {downloadable && (
                  <a
                    href="#download"
                    className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-6 text-[14.5px] font-medium text-[var(--color-ink-950)] transition-colors duration-300 hover:bg-white"
                  >
                    <Download aria-hidden="true" className="size-4" />
                    Download
                  </a>
                )}

                {repo ? (
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-6 text-[14.5px] font-medium text-[var(--color-bone-50)] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <Code2 aria-hidden="true" className="size-4" />
                    View Source
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 opacity-50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ) : (
                  <span
                    className="inline-flex h-12 cursor-not-allowed items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line)] px-6 text-[14.5px] text-[var(--color-bone-600)]"
                    aria-disabled="true"
                    title="No public repository is configured for this product"
                  >
                    <Code2 aria-hidden="true" className="size-4" />
                    Source not published
                  </span>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] px-2 text-[14.5px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
                  >
                    <ExternalLink aria-hidden="true" className="size-4" />
                    Live
                  </a>
                )}

                <ShareButton
                  title={`${project.name} — ${siteConfig.name}`}
                  text={project.description}
                  className="h-12 px-6 text-[14.5px]"
                />
              </div>
            </Reveal>
          </div>

          {/* Spec rail */}
          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-[var(--color-line)] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              {[
                { label: "Type", value: categoryMeta[project.category] },
                {
                  label: "Platform",
                  value: orDash(platforms.map((p) => platformMeta[p].label).join(" · ")),
                },
                { label: "Version", value: formatVersion(release.version) },
                { label: "Released", value: formatDate(release.releaseDate) },
                { label: "Status", value: statusMeta[project.status].label },
                { label: "Connectivity", value: project.offline ? "Offline capable" : "Requires network" },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-1.5">
                  <dt className="label">{row.label}</dt>
                  <dd className="text-[13.5px] text-[var(--color-bone-200)]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </header>

      {/* --------------------------------------------------- full-bleed hero */}
      <Reveal>
        <div className="gutter mx-auto max-w-[1600px]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-ink-900)] md:aspect-[21/9]">
            {heroShot?.src ? (
              <Image
                src={heroShot.src}
                alt={heroShot.alt}
                fill
                priority
                sizes="100vw"
                // object-contain guarantees the screenshot is never cropped or stretched
                className="object-contain"
              />
            ) : (
              <GeneratedPreview project={project} label="Product preview pending" />
            )}
          </div>
        </div>
      </Reveal>

      {/* ---------------------------------------------------------- content */}
      <div className="gutter mx-auto max-w-[1600px] py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-20 lg:col-span-8 md:gap-24">
            {/* Overview.
                When a product has no published description yet we say exactly
                that, rather than padding the page with invented copy. */}
            <SectionBlock index={nextIndex()} title="Overview">
              <div className="flex max-w-[62ch] flex-col gap-5">
                {project.longDescription.length > 0 ? (
                  project.longDescription.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-[15.5px] leading-[1.75] text-[var(--color-bone-200)] md:text-[16.5px]"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-[15.5px] leading-[1.75] text-[var(--color-bone-200)] md:text-[16.5px]">
                      {project.description}
                    </p>
                    <p className="text-[14.5px] leading-[1.75] text-[var(--color-bone-500)]">
                      Full details for {project.name} have not been published yet. This
                      page will be updated as the product is documented.
                    </p>
                  </>
                )}
              </div>
            </SectionBlock>

            {/* Problem / Solution — omitted entirely when undocumented. */}
            {showProblem && (
              <SectionBlock index={nextIndex()} title="Problem & solution" icon={Target}>
                <div className="grid gap-10 md:grid-cols-2 md:gap-12">
                  {project.problem && (
                    <div>
                      <h3 className="text-[15px] font-medium text-[var(--color-bone-50)]">
                        The problem
                      </h3>
                      <p className="mt-3.5 text-[14.5px] leading-[1.75] text-[var(--color-bone-400)]">
                        {project.problem}
                      </p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="border-t border-[var(--color-line)] pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-12">
                      <h3 className="text-[15px] font-medium text-[var(--color-bone-50)]">
                        The approach
                      </h3>
                      <p className="mt-3.5 text-[14.5px] leading-[1.75] text-[var(--color-bone-400)]">
                        {project.solution}
                      </p>
                    </div>
                  )}
                </div>
              </SectionBlock>
            )}

            {/* Features */}
            {showFeatures && (
              <SectionBlock index={nextIndex()} title="Features">
                <ul className="grid gap-px sm:grid-cols-2 sm:gap-x-10">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 border-b border-[var(--color-line)] py-4"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-[var(--color-brass-500)]"
                      />
                      <span className="text-[14.5px] leading-relaxed text-[var(--color-bone-200)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}

            {/* Screenshots — omitted when none have been added. */}
            {showShots && (
              <SectionBlock index={nextIndex()} title="Screenshots">
                <Gallery project={project} />
              </SectionBlock>
            )}

            {/* Architecture */}
            {showArchitecture && (
              <SectionBlock index={nextIndex()} title="Architecture" icon={Layers}>
                <dl className="grid gap-0">
                  {project.architecture.map((note) => (
                    <div
                      key={note.label}
                      className="grid gap-2 border-b border-[var(--color-line)] py-5 sm:grid-cols-12 sm:gap-6"
                    >
                      <dt className="text-[13.5px] font-medium text-[var(--color-bone-50)] sm:col-span-3">
                        {note.label}
                      </dt>
                      <dd className="text-[14px] leading-relaxed text-[var(--color-bone-400)] sm:col-span-9">
                        {note.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </SectionBlock>
            )}

            {/* Download */}
            <SectionBlock id="download" index={nextIndex()} title="Download" icon={Download}>
              <DownloadSection project={project} release={release} />
              {downloads.length > 0 && (
                <p className="mt-5 text-[12.5px] leading-relaxed text-[var(--color-bone-500)]">
                  Builds are distributed through GitHub Releases. Files are served
                  directly by GitHub — this site stores no binaries.
                </p>
              )}
            </SectionBlock>

            {/* Changelog */}
            <SectionBlock index={nextIndex()} title="Changelog" icon={History}>
              {project.changelog.length === 0 ? (
                <p className="text-[14.5px] text-[var(--color-bone-500)]">
                  No releases have been published yet. Changelog entries appear here
                  once versions are added to the project metadata.
                </p>
              ) : (
                <ol className="grid gap-0">
                  {project.changelog.map((entry) => (
                    <li
                      key={entry.version}
                      className="grid gap-4 border-b border-[var(--color-line)] py-7 sm:grid-cols-12 sm:gap-6"
                    >
                      <div className="sm:col-span-3">
                        <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-bone-50)]">
                          {formatVersion(entry.version)}
                        </p>
                        <p className="mt-1 text-[12.5px] text-[var(--color-bone-500)]">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <ul className="grid gap-2 sm:col-span-9">
                        {entry.changes.map((change, index) => (
                          <li
                            key={index}
                            className="text-[14px] leading-relaxed text-[var(--color-bone-400)]"
                          >
                            {change}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
            </SectionBlock>
          </div>

          {/* -------------------------------------------------------- aside */}
          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="flex flex-col gap-10 lg:sticky lg:top-28">
              {project.technologies.length > 0 && (
                <div>
                  <h2 className="label">Technology</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </div>
                </div>
              )}

              {project.requirements.length > 0 && (
                <div>
                  <h2 className="label">Requirements</h2>
                  <ul className="mt-4 grid gap-2.5">
                    {project.requirements.map((requirement) => (
                      <li
                        key={requirement}
                        className="text-[13.5px] leading-relaxed text-[var(--color-bone-400)]"
                      >
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h2 className="label">Availability</h2>
                <ul className="mt-4 grid gap-2.5">
                  {downloads.length === 0 && (
                    <li className="text-[13.5px] text-[var(--color-bone-500)]">
                      {repo ? "Source only" : "No build published"}
                    </li>
                  )}
                  {downloads.map((download) => (
                    <li
                      key={download.platform}
                      className="flex items-center justify-between gap-3 text-[13.5px]"
                    >
                      <span className="text-[var(--color-bone-200)]">
                        {platformMeta[download.platform].label}
                      </span>
                      <span
                        className={
                          download.published
                            ? "text-[var(--color-signal-live)]"
                            : "text-[var(--color-bone-600)]"
                        }
                      >
                        {download.published ? "Available" : "Pending"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
