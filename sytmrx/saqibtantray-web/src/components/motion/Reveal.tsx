"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  className?: string;
  as?: ElementType;
  /** Re-run every time it enters the viewport. Default: animate once. */
  repeat?: boolean;
}

/**
 * Scroll-triggered entrance.
 *
 * Reduced motion is handled globally by <MotionProvider> (MotionConfig
 * reducedMotion="user"), which strips the y-translation while still resolving
 * opacity to 1. That is deliberate: conditionally rendering a non-motion
 * element instead would leave the server-rendered `opacity: 0` in place with
 * nothing to animate it away, hiding content from the users who need it most.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
  repeat = false,
}: RevealProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
