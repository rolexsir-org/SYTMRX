import Link from "next/link";
import { ArrowUpRight, AtSign } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { contactConfig, mailtoUrl } from "@/config/site";
import { InstagramMark } from "@/components/ui/BrandIcons";

export function ContactCta() {
  return (
    <div className="relative overflow-hidden border-t border-[var(--color-line)]">
      {/* Single soft brass wash — the page's warmest moment, kept restrained */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background:
            "radial-gradient(60rem 24rem at 50% 130%, rgba(201,164,105,0.10), transparent 70%)",
        }}
      />

      <div className="gutter relative mx-auto max-w-[1600px] py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="label">06 — Contact</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="display mt-8 text-[clamp(2.25rem,7vw,4.5rem)]">
              Have a project
              <br />
              in{" "}
              <span className="serif-accent text-[var(--color-brass-300)]">mind?</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-7 max-w-[48ch] text-[15px] leading-[1.7] text-[var(--color-bone-400)] md:text-base">
              Open to conversations about software, applications, games and digital
              products.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            {/* Both channels are directly actionable here — no extra hop. */}
            <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
              <a
                href={mailtoUrl}
                className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-6 text-[14.5px] font-medium text-[var(--color-ink-950)] transition-colors duration-300 hover:bg-white"
              >
                <AtSign aria-hidden="true" className="size-4" />
                {contactConfig.email}
              </a>
              <a
                href={contactConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-6 text-[14.5px] font-medium text-[var(--color-bone-50)] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
              >
                <InstagramMark aria-hidden="true" className="size-4" />
                @{contactConfig.instagramHandle}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            <Reveal delay={0.24}>
              <p className="mt-8 text-[13.5px] text-[var(--color-bone-500)]">
                Or see the{" "}
                <Link
                  href="/contact"
                  className="underline underline-offset-4 transition-colors hover:text-[var(--color-bone-200)]"
                >
                  contact page
                </Link>
                .
              </p>
            </Reveal>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
