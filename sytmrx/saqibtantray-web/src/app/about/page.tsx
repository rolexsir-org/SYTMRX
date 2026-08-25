import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.name} is an independent technology company building software, applications, games, and digital products.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${siteConfig.name}`,
    description: `${siteConfig.name} builds software, applications, games, and digital products.`,
    url: "/about",
  },
};

/**
 * /about — editorial company section.
 *
 * States only what is true: what SYTMRX is, what it builds, and how it works.
 * No team size, no founding date, no client or revenue claims, no history.
 */

const DISCIPLINES = [
  {
    n: "01",
    title: "Software",
    body: "Systems built for a specific operational job, designed to hold up under real conditions rather than ideal ones.",
  },
  {
    n: "02",
    title: "Applications",
    body: "Mobile applications built to run well on ordinary hardware, with interfaces shaped around the task rather than the framework.",
  },
  {
    n: "03",
    title: "Games",
    body: "Interactive products explored as their own discipline, with the same standards applied to performance and feel.",
  },
  {
    n: "04",
    title: "Offline-first systems",
    body: "Local-first data and deterministic state, so an absent or unreliable network does not stop the product from working.",
  },
  {
    n: "05",
    title: "Experimental technology",
    body: "Prototypes used to test an idea end to end. Shipped when they prove useful, described honestly when they are still experiments.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About"
        title={
          <>
            An independent technology{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">company.</span>
          </>
        }
        description={siteConfig.longDescription}
      />

      <div className="gutter mx-auto max-w-[1600px] pb-24 md:pb-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-16 lg:col-span-7">
            <Reveal>
              <section aria-labelledby="who">
                <h2 id="who" className="label">
                  01 — Who we are
                </h2>
                <div className="mt-6 flex flex-col gap-5">
                  <p className="text-[clamp(1.25rem,2.8vw,1.75rem)] leading-[1.4] tracking-[-0.022em] text-[var(--color-bone-50)]">
                    {siteConfig.name} is an independent technology and digital-product
                    company.
                  </p>
                  <p className="max-w-[62ch] text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    We build our own software, applications, games and experimental
                    digital products — designing, building and shipping them end to
                    end, from the initial decision about what a product should do
                    through to the build people actually install.
                  </p>
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section aria-labelledby="what">
                <h2 id="what" className="label">
                  02 — What we build
                </h2>
                <div className="mt-6 flex max-w-[62ch] flex-col gap-5">
                  <p className="text-[15.5px] leading-[1.75] text-[var(--color-bone-200)]">
                    Software, applications, games, offline-first systems and
                    experimental technology.
                  </p>
                  <p className="text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    The common thread is software with a specific job that does it
                    without ceremony. We would rather build a small product that solves
                    one problem completely than a large one that solves several
                    partially.
                  </p>
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section aria-labelledby="how">
                <h2 id="how" className="label">
                  03 — How we work
                </h2>
                <div className="mt-6 flex max-w-[62ch] flex-col gap-5">
                  <p className="text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    We start from the conditions a product has to survive rather than
                    from the feature list. If something will be used where the network
                    is unreliable, that constraint decides the architecture before
                    anything else does.
                  </p>
                  <p className="text-[15.5px] leading-[1.75] text-[var(--color-bone-400)]">
                    After that it is mostly restraint: keep the dependency list short,
                    keep the state model obvious, and finish the parts that usually get
                    skipped — empty states, failures, slow devices, and the second time
                    someone opens the product.
                  </p>
                </div>
              </section>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/apps"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-6 text-[14.5px] font-medium text-[var(--color-ink-950)] transition-colors hover:bg-white"
                >
                  Explore Products
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-6 text-[14.5px] font-medium text-[var(--color-bone-50)] transition-all hover:border-white/25 hover:bg-white/[0.06]"
                >
                  Contact
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Disciplines rail */}
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <h2 className="label">04 — Disciplines</h2>
              <dl className="mt-6 grid gap-0">
                {DISCIPLINES.map((item) => (
                  <div
                    key={item.n}
                    className="border-t border-[var(--color-line)] py-5"
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
