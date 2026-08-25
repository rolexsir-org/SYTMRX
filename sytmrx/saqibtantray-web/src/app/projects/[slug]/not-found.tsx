import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="gutter mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-center py-24">
      <p className="label">Error 404 — Project</p>

      <h1 className="display mt-8 text-[clamp(2.5rem,9vw,6rem)]">
        Project not
        <br />
        <span className="serif-accent text-[var(--color-brass-300)]">found.</span>
      </h1>

      <p className="mt-8 max-w-[52ch] text-[15px] leading-[1.7] text-[var(--color-bone-400)]">
        No project exists at this address. It may have been renamed, or it may not have
        been published yet.
      </p>

      <div className="mt-11 flex flex-wrap gap-3">
        <Link
          href="/projects"
          className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-6 text-[14.5px] font-medium text-[var(--color-ink-950)] transition-colors hover:bg-white"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          All work
        </Link>
        <Link
          href="/apps"
          className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-6 text-[14.5px] font-medium text-[var(--color-bone-50)] transition-all hover:border-white/25 hover:bg-white/[0.06]"
        >
          Explore Products
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
