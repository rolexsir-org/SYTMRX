import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { focusAreas } from "@/data/focus";
import { getProject } from "@/data/projects";

/**
 * Engineering Focus — nine areas of work, each explained in practical terms
 * and backed by one source-level proof point from the audited repositories.
 * Deliberately not a technology-name wall: every area answers what gets built,
 * how it is approached, and where the evidence lives.
 */
export function FocusAreas() {
  return (
    <>
      <SectionHeader
        label="Engineering focus"
        title={
          <>
            What I{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">build</span>
          </>
        }
        description="Nine areas of work. Each one exists because working source in the organisation demonstrates it — the proof line under every area says where."
      />

      <div className="mt-14 grid gap-x-12 gap-y-px md:mt-20 md:grid-cols-2">
        {focusAreas.map((area, index) => (
          <Reveal key={area.n} delay={(index % 2) * 0.06}>
            <article className="group h-full border-t border-[var(--color-line)] py-8 transition-colors duration-500 hover:border-[var(--color-line-strong)] md:py-10">
              <div className="flex items-center gap-4">
                <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-bone-600)]">
                  {area.n}
                </span>
                <h3 className="text-[clamp(1.2rem,2.4vw,1.5rem)] font-medium tracking-[-0.02em] text-[var(--color-bone-50)]">
                  {area.title}
                </h3>
              </div>
              <p className="mt-4 max-w-[52ch] text-[14.5px] leading-[1.7] text-[var(--color-bone-400)]">
                {area.body}
              </p>
              <p className="mt-5 max-w-[56ch] border-l-2 border-[var(--color-brass-600)] pl-4 text-[13px] leading-[1.65] text-[var(--color-bone-500)]">
                <span className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.12em] text-[var(--color-brass-300)] uppercase">
                  Evidence ·{" "}
                </span>
                {area.evidence}
              </p>
              {area.projects.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {area.projects.map((slug) => {
                    const project = getProject(slug);
                    if (!project || project.repository === null) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/projects/${slug}`}
                        className="group/link inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--color-bone-500)] transition-colors hover:text-[var(--color-bone-50)]"
                      >
                        {project.name}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-3 opacity-0 transition-all duration-300 group-hover/link:opacity-100"
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
