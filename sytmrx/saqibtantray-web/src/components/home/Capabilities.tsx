import { Smartphone, WifiOff, Gamepad2, FlaskConical } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/Section";

/**
 * Developer capabilities — deliberately NOT a "skills" card grid.
 * A numbered editorial list: what gets built, and how it is approached.
 * No proficiency bars, no years-of-experience claims, no logos.
 */

const CAPABILITIES = [
  {
    n: "01",
    icon: Smartphone,
    title: "Applications",
    body: "Mobile applications built to be fast on ordinary hardware, not just on a flagship device. Interfaces designed around the task, not around the framework.",
  },
  {
    n: "02",
    icon: WifiOff,
    title: "Offline-first systems",
    body: "Local-first data, deterministic state and no assumption that a network is present. The product keeps working when the connection does not.",
  },
  {
    n: "03",
    icon: Gamepad2,
    title: "Games",
    body: "Interactive products treated as their own discipline, held to the same standards of performance and feel as everything else we build.",
  },
  {
    n: "04",
    icon: FlaskConical,
    title: "Experimental technology",
    body: "Prototypes used to test an idea end to end before committing to it. Shipped when they prove useful, described honestly while they are still experiments.",
  },
];

export function Capabilities() {
  return (
    <>
      <SectionHeader
        index="03"
        label="Capabilities"
        title={
          <>
            How we{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">work</span>
          </>
        }
        description="Four areas of work. Each one is a way of solving the same problem: software that has to survive contact with real conditions."
      />

      <div className="mt-14 grid gap-x-12 gap-y-px md:mt-20 md:grid-cols-2">
        {CAPABILITIES.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.n} delay={index * 0.06}>
              <article className="group h-full border-t border-[var(--color-line)] py-8 transition-colors duration-500 hover:border-[var(--color-line-strong)] md:py-10">
                <div className="flex items-center gap-4">
                  <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-bone-600)]">
                    {item.n}
                  </span>
                  <Icon
                    aria-hidden="true"
                    className="size-4 text-[var(--color-bone-500)] transition-colors duration-500 group-hover:text-[var(--color-brass-300)]"
                  />
                </div>
                <h3 className="mt-5 text-[clamp(1.25rem,2.6vw,1.625rem)] font-medium tracking-[-0.025em] text-[var(--color-bone-50)]">
                  {item.title}
                </h3>
                <p className="mt-3.5 max-w-[46ch] text-[14.5px] leading-[1.7] text-[var(--color-bone-400)]">
                  {item.body}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
