import { ArrowUpRight, Code2 } from "lucide-react";

import { founderConfig, githubProfileUrl, githubUsername } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";
import { verifiedProjects } from "@/data/projects";

/**
 * Founder identity — the developer behind SYTMRX.
 *
 * States only what is true and verifiable: the role, the span of work and
 * where the source lives. The counts below are computed from this repository's
 * own project data and the audited public repositories — no stars, followers
 * or other vanity metrics.
 */

const FACTS = [
  { label: "Role", value: founderConfig.role },
  { label: "Organisation", value: `github.com/${githubUsername}` },
  { label: "Source", value: "Public repositories — inspectable, not marketing" },
  { label: "Distribution", value: "GitHub Releases — no binaries stored here" },
];

export function Founder() {
  const verified = verifiedProjects();

  return (
    <>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <Reveal>
            <p className="max-w-[24ch] text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.18] tracking-[-0.025em] text-[var(--color-bone-50)]">
              SYTMRX is built by one{" "}
              <span className="serif-accent italic text-[var(--color-brass-300)]">
                independent developer.
              </span>
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex max-w-[58ch] flex-col gap-5 text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
              <p>{founderConfig.summary}</p>
              <p>
                The work spans {verified.length} public repositories: an Android launcher
                engineered down to its permission disclosures, habit and safety apps,
                an offline business system, assistant experiments and the web
                infrastructure that distributes all of it. What is finished is
                labelled finished. What is not is labelled honestly.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={githubProfileUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-5 text-[14px] font-medium text-[var(--color-bone-50)] transition-all hover:border-white/25 hover:bg-white/[0.06]"
              >
                <Code2 aria-hidden="true" className="size-4 text-[var(--color-bone-500)] transition-colors group-hover:text-[var(--color-brass-300)]" />
                Inspect the source
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-bone-500)] uppercase">
                {verified.length} audited repositories · 0 fabricated claims
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <dl className="grid gap-0">
            {FACTS.map((fact) => (
              <div key={fact.label} className="border-t border-[var(--color-line)] py-4 last:border-b">
                <dt className="label">{fact.label}</dt>
                <dd className="mt-1.5 text-[13.5px] leading-[1.6] text-[var(--color-bone-200)]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </>
  );
}
