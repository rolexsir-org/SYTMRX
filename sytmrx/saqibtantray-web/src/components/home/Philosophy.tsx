import { Reveal } from "@/components/motion/Reveal";

/**
 * Build philosophy — a full-bleed editorial statement.
 * Intentionally the least card-like section on the page.
 */

const PRINCIPLES = [
  {
    k: "Constraint first",
    v: "Decide what the software must survive — no network, old hardware, an interrupted user — before deciding what it looks like.",
  },
  {
    k: "Local by default",
    v: "Data lives with the person who created it. Sync is a feature, not a prerequisite for the product to function.",
  },
  {
    k: "Small surface",
    v: "Fewer screens, fewer settings, fewer dependencies. Every addition has to earn the maintenance it costs.",
  },
  {
    k: "Finish the edges",
    v: "Empty states, failures and slow connections are part of the product, not something handled after launch.",
  },
];

export function Philosophy() {
  return (
    <div className="relative border-y border-[var(--color-line)] bg-white/[0.012]">
      <div className="gutter mx-auto max-w-[1600px] py-20 md:py-28 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label">04 — Build philosophy</p>
            </Reveal>
            <Reveal delay={0.06}>
              <blockquote className="mt-8">
                <p className="display text-[clamp(1.875rem,4.8vw,3.25rem)]">
                  Software should be
                  <br />
                  <span className="serif-accent text-[var(--color-brass-300)]">
                    judged by what it does
                  </span>
                  <br />
                  on a bad day.
                </p>
              </blockquote>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-[44ch] text-[15px] leading-[1.75] text-[var(--color-bone-400)]">
                Most software is designed for ideal conditions — a fast connection, a
                new device, an unhurried user. Real use is rarely any of those things.
                Everything here is built for the other case.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {/* A <dl> may only directly contain <div> wrappers around each
                <dt>/<dd> pair, so the reveal animation is applied to the list
                as a whole rather than to each row. */}
            <Reveal>
              <dl className="grid gap-0">
                {PRINCIPLES.map((principle) => (
                  <div
                    key={principle.k}
                    className="group grid gap-3 border-t border-[var(--color-line)] py-7 transition-colors duration-500 hover:border-[var(--color-line-strong)] sm:grid-cols-12 sm:gap-6"
                  >
                    <dt className="text-[14.5px] font-medium tracking-[-0.01em] text-[var(--color-bone-50)] sm:col-span-4">
                      {principle.k}
                    </dt>
                    <dd className="text-[14.5px] leading-[1.7] text-[var(--color-bone-400)] sm:col-span-8">
                      {principle.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
