import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { stackGroups } from "@/data/stack";

/**
 * Verified technology stack.
 *
 * Grouped, tagged and annotated with where each technology actually appears
 * in the organisation's source. Items marked "exploring" are shown as exactly
 * that — nothing is displayed without repository evidence, and the absence of
 * a technology is treated as information too.
 */
export function StackSection() {
  return (
    <>
      <SectionHeader
        label="Technology stack"
        title={
          <>
            Verified{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">stack</span>
          </>
        }
        description="Every entry is used by actual source in the public repositories — the note on each one says where. Technologies still being explored are labelled as such, and technologies without repository evidence are not listed at all."
      />

      <div className="mt-14 grid gap-x-12 gap-y-14 md:mt-20 md:grid-cols-2">
        {stackGroups.map((group) => (
          <Reveal key={group.id}>
            <section aria-labelledby={`stack-${group.id}`} className="border-t border-[var(--color-line)] pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3
                  id={`stack-${group.id}`}
                  className="text-[15px] font-medium tracking-[-0.01em] text-[var(--color-bone-50)]"
                >
                  {group.title}
                </h3>
                <p className="max-w-[38ch] text-[12.5px] leading-[1.6] text-[var(--color-bone-600)]">
                  {group.blurb}
                </p>
              </div>

              <ul className="mt-6 grid gap-0">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="grid grid-cols-1 items-baseline gap-x-6 gap-y-1 border-t border-[var(--color-line)] py-3.5 sm:grid-cols-[10.5rem_1fr]"
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span
                        aria-hidden="true"
                        title={item.level === "applied" ? "Applied in shipped source" : "Being explored"}
                        className={`size-1.5 shrink-0 translate-y-[-1px] rounded-full ${
                          item.level === "applied"
                            ? "bg-[var(--color-signal-live)]"
                            : "bg-[var(--color-signal-idle)]"
                        }`}
                      />
                      <span className="text-[13.5px] font-medium text-[var(--color-bone-50)]">
                        {item.name}
                      </span>
                      {item.level === "exploring" && (
                        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.1em] text-[var(--color-signal-idle)] uppercase">
                          exploring
                        </span>
                      )}
                    </div>
                    <span className="max-w-[52ch] text-[12.5px] leading-[1.6] text-[var(--color-bone-500)]">
                      {item.note}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </>
  );
}
