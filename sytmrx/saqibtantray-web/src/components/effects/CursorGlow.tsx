"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only ambient cursor light.
 *
 * Constraints honoured:
 *  - disabled on touch / coarse pointers
 *  - disabled under prefers-reduced-motion
 *  - pointer-events: none, so it can never intercept a click
 *  - purely decorative, aria-hidden, no accessibility impact
 *  - writes a CSS variable inside rAF; no React re-render per mouse move
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => setEnabled(fine.matches && !reduce.matches);
    evaluate();

    fine.addEventListener("change", evaluate);
    reduce.addEventListener("change", evaluate);
    return () => {
      fine.removeEventListener("change", evaluate);
      reduce.removeEventListener("change", evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let visible = false;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const tick = () => {
      // Critically damped follow — the light trails the cursor slightly.
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      el.style.transform = `translate3d(${currentX - 300}px, ${currentY - 300}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 -z-10 size-[600px] opacity-0 transition-opacity duration-700 will-change-transform"
      style={{
        background:
          "radial-gradient(circle at center, rgba(201,164,105,0.055) 0%, rgba(201,164,105,0.02) 35%, transparent 68%)",
      }}
    />
  );
}
