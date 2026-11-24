import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { buildingTracks } from "@/data/current";
import { githubProfileUrl, githubUsername } from "@/config/site";

/**
 * Currently Building — active development tracks identified from actual
 * repository activity and each repository's own status documents. No live
 * progress bars, no fabricated velocity: each track states what is open and
 * what the repository's own checklist says comes next.
 */

function repoUrl(name: string): string {
  return `https://github.com/${githubUsername}/${name}`;
}

export function CurrentlyBuilding() {
  return (
    <>
      <SectionHeader
        label="Currently building"
        title={
          <>
            Active{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">work</span>
          </>
        }
        description="Where development actually stands, taken from repository activity and the status documents each project keeps on itself. Next steps come from the projects' own checklists — not from a roadmap written for effect."
      />

      <div className="mt-14 flex flex-col md:mt-20">
        {buildingTracks.map((track, index) => (
          <Reveal key={track.n} delay={index * 0.05}>
            <article className="grid gap-6 border-t border-[var(--color-line)] py-10 last:border-b md:grid-cols-12 md:gap-8 md:py-12">
              <div className="flex items-start gap-5 md:col-span-5">
                <span className="mt-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-bone-600)]">
                  {track.n}
                </span>
                <div>
                  <h3 className="text-[clamp(1.25rem,2.6vw,1.625rem)] font-medium leading-snug tracking-[-0.022em] text-[var(--color-bone-50)]">
                    {track.title}
                  </h3>
                  <a
                    href={track.repo ? repoUrl(track.repo) : githubProfileUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/repo mt-3 inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--color-bone-500)] transition-colors hover:text-[var(--color-brass-300)]"
                  >
                    {track.repo ?? "all repositories"}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3 transition-transform duration-300 group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5"
                    />
                  </a>
                </div>
              </div>

              <div className="md:col-span-4">
                <p className="max-w-[48ch] text-[14px] leading-[1.7] text-[var(--color-bone-400)]">
                  {track.body}
                </p>
              </div>

              <div className="md:col-span-3">
                <p className="label">Next</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {track.next.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[13px] leading-[1.6] text-[var(--color-bone-400)]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--color-brass-400)]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
