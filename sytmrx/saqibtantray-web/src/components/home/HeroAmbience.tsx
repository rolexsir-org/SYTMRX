"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's two interactive layers, isolated into the smallest possible
 * client component:
 *   1. a cursor-reactive gradient
 *   2. a scroll-linked fade of the hero content
 *
 * Both are driven by direct style writes inside requestAnimationFrame, so they
 * never trigger a React render. Keeping them out of the hero itself means the
 * hero's text is server-rendered and paints before any JS executes — which is
 * what keeps LCP low.
 *
 * Both layers are skipped entirely for coarse pointers and reduced motion.
 */
export function HeroAmbience({ targetId }: { targetId: string }) {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const section = document.getElementById(targetId);
    if (!section) return;

    let frame = 0;
    const cleanups: (() => void)[] = [];

    /* 1 — cursor-reactive gradient (desktop, motion-allowed only) */
    if (fine && !reduce) {
      const glow = glowRef.current;
      if (glow) {
        const onMove = (event: PointerEvent) => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            const rect = section.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            glow.style.setProperty("--mx", `${x.toFixed(2)}%`);
            glow.style.setProperty("--my", `${y.toFixed(2)}%`);
            frame = 0;
          });
        };
        section.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => section.removeEventListener("pointermove", onMove));
      }
    }

    /* 2 — scroll-linked fade + drift of the hero content */
    if (!reduce) {
      const content = section.querySelector<HTMLElement>("[data-hero-content]");
      if (content) {
        let scrollFrame = 0;
        const onScroll = () => {
          if (scrollFrame) return;
          scrollFrame = requestAnimationFrame(() => {
            const height = section.offsetHeight || 1;
            const progress = Math.min(Math.max(window.scrollY / height, 0), 1);
            content.style.opacity = String(1 - progress * 0.8);
            content.style.transform = `translate3d(0, ${(progress * 14).toFixed(2)}%, 0)`;
            scrollFrame = 0;
          });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("scroll", onScroll);
          if (scrollFrame) cancelAnimationFrame(scrollFrame);
          // Leave the content fully visible if this unmounts mid-scroll.
          content.style.opacity = "";
          content.style.transform = "";
        });
      }
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      cleanups.forEach((fn) => fn());
    };
  }, [targetId]);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        ["--mx" as string]: "50%",
        ["--my" as string]: "40%",
        background:
          "radial-gradient(46rem 32rem at var(--mx) var(--my), rgba(201,164,105,0.07), transparent 62%)",
      }}
    />
  );
}
