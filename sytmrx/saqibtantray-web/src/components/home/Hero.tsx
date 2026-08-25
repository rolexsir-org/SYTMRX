import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { siteConfig, statusConfig } from "@/config/site";
import { HeroAmbience } from "./HeroAmbience";

/**
 * Hero — a server component.
 *
 * The entrance animation is pure CSS (`.enter` + `animationDelay`), so the
 * markup paints immediately without waiting for hydration. Only the ambient
 * cursor gradient and the scroll-linked fade are client-side, and they live in
 * <HeroAmbience> so no interactivity leaks into this text content.
 *
 * prefers-reduced-motion is handled globally in globals.css, which collapses
 * animation durations to ~0 while `animation-fill-mode: both` guarantees the
 * final, visible state is applied.
 */

/** Company disciplines, shown as the eyebrow rule under the wordmark. */
const WORDS = ["Software", "Apps", "Games", "Digital Products"];

const FOCUS = [
  { n: "01", label: "Software" },
  { n: "02", label: "Applications" },
  { n: "03", label: "Games" },
  { n: "04", label: "Offline-first systems" },
  { n: "05", label: "Experimental technology" },
];

/** Staggered CSS entrance delay. */
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      <HeroAmbience targetId="hero" />

      <div
        data-hero-content
        className="gutter mx-auto max-w-[1600px] pt-16 pb-20 will-change-[opacity,transform] md:pt-24 md:pb-28 lg:pt-32 lg:pb-36"
      >
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Left: editorial type column */}
          <div className="lg:col-span-8 xl:col-span-7">
            {/* Status */}
            <div className="enter flex items-center gap-3" style={delay(0)}>
              <span className="relative flex size-2 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="status-ring absolute size-2 rounded-full bg-[var(--color-signal-live)]"
                />
                <span className="relative size-2 rounded-full bg-[var(--color-signal-live)]" />
              </span>
              <span className="label text-[var(--color-bone-400)]">
                {statusConfig.label}
                {statusConfig.detail ? (
                  <span className="text-[var(--color-bone-500)]">
                    {" · "}
                    {statusConfig.detail}
                  </span>
                ) : null}
              </span>
            </div>

            {/* Wordmark — the LCP element. Server-rendered, no JS dependency.
                Tracking is widened rather than tightened: a short all-caps
                wordmark needs air to read as an identity instead of a word. */}
            <h1
              id="hero-heading"
              className="enter mt-8 font-semibold text-[clamp(3.25rem,13vw,9.5rem)] leading-[0.92] tracking-[0.02em] text-[var(--color-bone-50)] uppercase"
              style={delay(0.08)}
            >
              SYTMRX
            </h1>

            {/* Role line */}
            <p
              className="enter mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-bone-400)] uppercase sm:text-[12px]"
              style={delay(0.16)}
            >
              {WORDS.map((word, index) => (
                <span key={word} className="flex items-center gap-3">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-[var(--color-bone-600)]">
                      ·
                    </span>
                  )}
                  {word}
                </span>
              ))}
            </p>

            {/* Positioning */}
            <p
              className="enter mt-10 max-w-[30ch] text-[clamp(1.5rem,4.2vw,2.5rem)] leading-[1.12] tracking-[-0.028em] text-[var(--color-bone-50)]"
              style={delay(0.24)}
            >
              We build software, games, and{" "}
              <span className="serif-accent text-[var(--color-brass-300)]">
                digital products.
              </span>
            </p>

            {/* Supporting copy */}
            <p
              className="enter mt-7 max-w-[52ch] text-[15px] leading-[1.65] text-[var(--color-bone-400)] md:text-base"
              style={delay(0.32)}
            >
              {siteConfig.longDescription}
            </p>

            {/* CTAs — 48px touch targets */}
            <div
              className="enter mt-11 flex flex-wrap items-center gap-3"
              style={delay(0.4)}
            >
              <Link
                href="/projects"
                className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-6 text-[14.5px] font-medium text-[var(--color-ink-950)] transition-colors duration-300 hover:bg-white"
              >
                View Work
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/apps"
                className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-6 text-[14.5px] font-medium text-[var(--color-bone-50)] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
              >
                Explore Products
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 opacity-60 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Right: disciplines index. Real information only — no fabricated metrics. */}
          <aside
            className="enter lg:col-span-4 lg:col-start-9 xl:col-span-4 xl:col-start-9"
            style={delay(0.34)}
            aria-label="What we build"
          >
            <div className="h-full border-t border-[var(--color-line)] pt-6 lg:border-t-0 lg:border-l lg:pt-2 lg:pl-8">
              <p className="label">What we build</p>
              <ul className="mt-5 space-y-0">
                {FOCUS.map((row) => (
                  <li
                    key={row.n}
                    className="group flex items-baseline gap-4 border-b border-[var(--color-line)] py-3.5 last:border-0"
                  >
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-bone-600)]">
                      {row.n}
                    </span>
                    <span className="text-[14.5px] text-[var(--color-bone-200)] transition-colors duration-300 group-hover:text-[var(--color-bone-50)]">
                      {row.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Scroll affordance */}
        <div
          className="enter mt-20 hidden items-center gap-3 md:flex"
          style={delay(0.55)}
          aria-hidden="true"
        >
          <ArrowDown className="size-3.5 text-[var(--color-bone-600)]" />
          <span className="label">Selected products</span>
        </div>
      </div>
    </section>
  );
}
