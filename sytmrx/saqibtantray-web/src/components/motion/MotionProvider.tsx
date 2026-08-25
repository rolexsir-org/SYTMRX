"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global motion policy.
 *
 * `reducedMotion="user"` makes Framer Motion respect the OS setting at the
 * library level: transform and layout animations are dropped, while opacity
 * still resolves to its target.
 *
 * This matters for correctness, not just taste. Branching on a JS
 * `useReducedMotion()` value to skip animations entirely leaves the
 * server-rendered `opacity: 0` initial state in the DOM with nothing to clear
 * it — reduced-motion users end up with invisible content. Delegating to
 * MotionConfig guarantees every element still settles on its visible state.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
