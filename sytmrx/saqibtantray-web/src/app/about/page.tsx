import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { founderConfig, githubProfileUrl, githubUsername, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "SYTMRX is the independent software practice of a single developer — building Android apps, productivity tools, AI assistants, business systems and web platforms end to end.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${siteConfig.name}`,
    description:
      "Independent software development: real products built end to end, from the launcher on the phone to the infrastructure that distributes them.",
    url: "/about",
  },
};

/**
 * /about — the engineering story.
 *
 * States only what is true: who builds SYTMRX, how the work is approached and
 * where it can be inspected. No degrees, no employment history, no clients,
 * no awards, no years-of-experience claims — the repositories are the record.
 */

const PRINCIPLES = [
  {
    n: "01",
    title: "Real products over demos",
    body: "The fastest way to learn is to finish something someone could actually install. Most of what exists here came from shipping a product and fixing what broke.",
  },
  {
    n: "02",
    title: "Learning through implementation",
    body: "Every subsystem — billing verification, launchers, encrypted storage, telemetry pipelines — was learned by building it, then documenting what it does and does not do.",
  },
  {
    n: "03",
    title: "Full stack, honestly scoped",
    body: "Frontend, backend, mobile and infrastructure all get worked on — by the same person, which forces each layer to stay as small as the problem allows.",
  },
  {
    n: "04",
    title: "Privacy as a default, not a feature",
    body: "Local-first data, explicit consent gates, published threat models and telemetry stripped out of dependencies. Stating what software cannot do is part of building it well.",
  },
  {
    n: "05",
    title: "Independent product development",
    body: "One developer sets the direction, writes the code, writes the checks, and writes down the status — including the parts that are not ready.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About"
        title={
          <>
            An independent developer,{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">building real software.</span>
          </>
        }
        description={founderConfig.summary}
      />

      <div className="gutter mx-auto max-w-[1600px] pb-24 md:pb-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-16 lg:col-span-7">
            <Reveal>
              <section aria-labelledby="who">
                <h2 id="who" className="label">
                  01 — The developer
                </h2>
                <div className="mt-6 flex flex-col gap-5">
                  <p className="text-[clamp(1.25rem,2.8vw,1.75rem)] leading-[1.4] tracking-[-0.022em] text-[var(--color-bone-50)]">
                    {founderConfig.role} — the person and the practice behind{" "}
                    {siteConfig.name}.
                  </p>
                  <p className="max-w-[62ch] text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    SYTMRX is the software practice of{" "}
                    <span className="text-[var(--color-bone-50)]">Saqib Tantray</span> — not
                    a team, an agency or a company with headcount. One independent
                    developer designing, implementing, testing and shipping software end
                    to end: Android launchers and apps, productivity and focus tools, AI
                    assistants, business and inventory systems, developer tooling, and the
                    web platform that distributes all of it.
                  </p>
                  <p className="max-w-[62ch] text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    Everything is developed in the open. The{" "}
                    <a
                      href={githubProfileUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-bone-50)] underline decoration-[var(--color-line-strong)] underline-offset-4 transition-colors hover:decoration-[var(--color-brass-300)]"
                    >
                      github.com/{githubUsername}
                    </a>{" "}
                    repositories carry the source, the engineering documents, the test
                    suites and the honest status of each project — which is why this site
                    links to them instead of paraphrasing them.
                  </p>
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section aria-labelledby="approach">
                <h2 id="approach" className="label">
                  02 — How the work is approached
                </h2>
                <div className="mt-6 flex max-w-[62ch] flex-col gap-5">
                  <p className="text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    Start from the conditions a product has to survive rather than from
                    the feature list. If something will be used where the network is
                    unreliable, that decides the architecture before anything else does.
                    If a paywall exists, its purchase verification fails closed. If a
                    permission is needed, it is requested when the feature needs it — and
                    its absence degrades the feature instead of faking success.
                  </p>
                  <p className="text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    After that it is mostly restraint: keep the dependency list short,
                    keep the state model obvious, write the threat model, and finish the
                    parts that usually get skipped — empty states, failures, slow devices,
                    and the second time someone opens the product.
                  </p>
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section aria-labelledby="now">
                <h2 id="now" className="label">
                  03 — Right now
                </h2>
                <div className="mt-6 flex max-w-[62ch] flex-col gap-5">
                  <p className="text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    The active work is release engineering: taking LumaOS Pro and TrackPro
                    from source-complete to published, standing up the billing
                    verification backend, and continuing to grow this site as the
                    discovery and distribution layer for everything that ships.
                  </p>
                </div>
              </section>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-6 text-[14.5px] font-medium text-[var(--color-ink-950)] transition-colors hover:bg-white"
                >
                  See the work
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <a
                  href={githubProfileUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-6 text-[14.5px] font-medium text-[var(--color-bone-50)] transition-all hover:border-white/25 hover:bg-white/[0.06]"
                >
                  Inspect the source
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Principles rail */}
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <h2 className="label">04 — Principles</h2>
              <dl className="mt-6 grid gap-0">
                {PRINCIPLES.map((item) => (
                  <div
                    key={item.n}
                    className="border-t border-[var(--color-line)] py-5 last:border-b"
                  >
                    <dt className="flex items-baseline gap-3">
                      <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-bone-600)]">
                        {item.n}
                      </span>
                      <span className="text-[14px] font-medium text-[var(--color-bone-50)]">
                        {item.title}
                      </span>
                    </dt>
                    <dd className="mt-2 pl-8 text-[13.5px] leading-[1.7] text-[var(--color-bone-400)]">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
