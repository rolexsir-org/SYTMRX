import { Download, Info, ShieldCheck, ShieldQuestion, Clock } from "lucide-react";

import type { Project } from "@/data/types";
import type { ProjectRelease, ResolvedDownload } from "@/lib/downloads";
import { formatDate, formatVersion, orDash, platformMeta } from "@/lib/meta";
import { projectRepository } from "@/lib/repository";
import { cn } from "@/lib/cn";

/**
 * Download presentation.
 *
 * Honesty requirements enforced here:
 *  - always states what is being downloaded: app, version, platform, size, date
 *  - shows SHA-256 only when a real checksum exists, and explicitly says when
 *    one is not published rather than implying verification happened
 *  - shows the Android sideloading warning for APK assets
 *  - never renders a download counter (there is no truthful source for one)
 *  - unpublished builds render disabled and explain what is missing
 *  - a URL is only ever linked after passing the trusted-host check in
 *    `lib/repository.ts`, so a malformed entry cannot become a live link
 */

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="label">{label}</dt>
      <dd className="text-[13.5px] text-[var(--color-bone-200)]">{value}</dd>
    </div>
  );
}

export function DownloadRow({
  project,
  release,
  download,
}: {
  project: Project;
  release: ProjectRelease;
  download: ResolvedDownload;
}) {
  const meta = platformMeta[download.platform];
  const { asset, published } = download;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border bg-white/[0.015] p-5 transition-colors duration-300 md:p-6",
        published
          ? "border-[var(--color-line-strong)] hover:border-white/25"
          : "border-[var(--color-line)]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-medium tracking-[-0.015em] text-[var(--color-bone-50)]">
            {project.name} · {meta.label}
          </h3>
          <p className="mt-1.5 text-[13.5px] text-[var(--color-bone-500)]">
            {published && asset.filename
              ? asset.filename
              : published
                ? `${meta.label} build`
                : "Build not published yet"}
          </p>
        </div>

        {published ? (
          <a
            href={asset.url}
            // Cross-origin (GitHub Releases): the download attribute is
            // advisory only, GitHub sets Content-Disposition.
            rel="noopener noreferrer nofollow"
            className="group inline-flex h-11 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-5 text-[14px] font-medium text-[var(--color-ink-950)] transition-colors duration-300 hover:bg-white"
            aria-label={`Download ${project.name} ${formatVersion(release.version)} for ${meta.label}${asset.size ? `, ${asset.size}` : ""}`}
          >
            <Download aria-hidden="true" className="size-4" />
            Download {meta.short}
          </a>
        ) : (
          <span
            className="inline-flex h-11 cursor-not-allowed items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line)] px-5 text-[14px] text-[var(--color-bone-600)]"
            aria-disabled="true"
          >
            <Clock aria-hidden="true" className="size-4" />
            Not available yet
          </span>
        )}
      </div>

      {/* Exactly what the user is getting */}
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--color-line)] pt-5 sm:grid-cols-4">
        <Fact label="Application" value={project.name} />
        <Fact label="Version" value={formatVersion(release.version)} />
        <Fact label="Platform" value={meta.label} />
        <Fact label="File size" value={orDash(asset.size)} />
        <Fact label="Release date" value={formatDate(release.releaseDate)} />
        <Fact
          label="Channel"
          value={
            !published
              ? "Unpublished"
              : release.prerelease
                ? "Prerelease"
                : "Stable"
          }
        />
        {asset.note ? <Fact label="Note" value={asset.note} /> : null}
      </dl>

      {/* Integrity. Present only when a real checksum exists; otherwise the
          absence is stated plainly rather than implying verification. */}
      {published ? (
        asset.sha256 ? (
          <div className="mt-5 flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-black/20 p-3.5">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--color-signal-live)]"
            />
            <div className="min-w-0">
              <p className="label">SHA-256</p>
              <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[11.5px] leading-relaxed break-all text-[var(--color-bone-400)]">
                {asset.sha256}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-bone-500)]">
                Verify after downloading:{" "}
                <code className="font-[family-name:var(--font-mono)] text-[11.5px]">
                  sha256sum {asset.filename ?? "<file>"}
                </code>
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-5 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[var(--color-bone-500)]">
            <ShieldQuestion aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            No SHA-256 checksum has been published for this asset, so its
            integrity cannot be verified from this page.
          </p>
        )
      ) : null}

      {/* Platform install guidance (Android sideloading notice) */}
      {published && meta.installNote ? (
        <p className="mt-4 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[var(--color-bone-500)]">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {meta.installNote}
        </p>
      ) : null}

      {/* Honest unpublished state */}
      {!published ? (
        <p className="mt-4 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[var(--color-bone-500)]">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          No {meta.label} build has been published yet. This activates
          automatically once a GitHub Release with a matching asset exists.
        </p>
      ) : null}
    </div>
  );
}

export function DownloadSection({
  project,
  release,
}: {
  project: Project;
  release: ProjectRelease;
}) {
  const downloads = release.downloads;

  if (downloads.length === 0) {
    // Only claim "source only" when a repository is actually configured —
    // otherwise there is simply nothing to distribute yet.
    const repo = projectRepository(project);
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white/[0.015] p-6">
        <p className="text-[14.5px] text-[var(--color-bone-400)]">
          {repo
            ? "This product has no downloadable builds. It is distributed as source only."
            : "No downloadable build has been published for this product yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {downloads.map((download) => (
        <DownloadRow
          key={download.platform}
          project={project}
          release={release}
          download={download}
        />
      ))}
    </div>
  );
}
