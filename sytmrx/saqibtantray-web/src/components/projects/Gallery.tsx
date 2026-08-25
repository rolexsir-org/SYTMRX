"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import type { Project, Screenshot } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Screenshot gallery with fullscreen viewing.
 *
 * - Screenshots are never distorted: object-contain everywhere.
 * - Missing screenshots render a labelled generated preview, not a fake shot.
 * - Lightbox: Escape to close, arrow keys to navigate, focus restored on close,
 *   background scroll locked, dialog semantics for screen readers.
 */

function Frame({
  shot,
  project,
  index,
  onOpen,
  priority,
}: {
  shot: Screenshot;
  project: Project;
  index: number;
  onOpen: (index: number) => void;
  priority?: boolean;
}) {
  const isPhone = shot.frame === "phone";

  if (!shot.src) {
    const [from, to] = project.accent;
    return (
      <figure
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-ink-900)]",
          isPhone ? "aspect-[9/19.5]" : "aspect-[16/10]",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25"
          style={{
            background: `radial-gradient(110% 80% at 20% 10%, ${from} 0%, transparent 55%), radial-gradient(90% 80% at 90% 100%, ${to} 0%, transparent 60%)`,
          }}
        />
        <div aria-hidden="true" className="texture-grid absolute inset-0 opacity-50" />
        <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-4 text-center">
          <span className="label text-[10px]">Screenshot pending</span>
          <span className="max-w-[24ch] text-[12px] leading-[1.5] text-balance text-[var(--color-bone-500)]">
            {shot.alt}
          </span>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="group relative">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`View full size: ${shot.alt}`}
        data-focus-ring="custom"
        className={cn(
          "relative block w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]",
          "bg-[var(--color-ink-900)] transition-colors duration-300 hover:border-[var(--color-line-strong)]",
          "focus-visible:border-[var(--color-brass-300)] focus-visible:ring-2 focus-visible:ring-[var(--color-brass-300)]/40",
          isPhone ? "aspect-[9/19.5]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
          priority={priority}
          className="object-contain transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
        />
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 inline-flex size-8 items-center justify-center rounded-[var(--radius-xs)] border border-white/10 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
        >
          <Expand className="size-3.5 text-[var(--color-bone-200)]" />
        </span>
      </button>
      {shot.caption && (
        <figcaption className="mt-3 text-[13px] text-[var(--color-bone-500)]">
          {shot.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Gallery({ project }: { project: Project }) {
  const shots = project.screenshots;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const lastFocused = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const viewable = shots.filter((s) => s.src);

  const open = useCallback((index: number) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    lastFocused.current?.focus();
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const total = shots.length;
        let next = current;
        // Skip entries without an image.
        for (let i = 0; i < total; i += 1) {
          next = (next + direction + total) % total;
          if (shots[next]?.src) return next;
        }
        return current;
      });
    },
    [shots],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Tab") {
        // Only the close button is focusable inside — keep focus trapped.
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  const active = openIndex !== null ? shots[openIndex] : null;

  return (
    <>
      <div
        className={cn(
          "grid gap-5",
          shots.some((s) => s.frame === "phone")
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "sm:grid-cols-2",
        )}
      >
        {shots.map((shot, index) => (
          <Frame
            key={`${shot.alt}-${index}`}
            shot={shot}
            project={project}
            index={index}
            onOpen={open}
            priority={index === 0}
          />
        ))}
      </div>

      <AnimatePresence>
        {active?.src && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-md"
            onClick={close}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
              <p className="max-w-[60ch] truncate text-[13px] text-[var(--color-bone-400)]">
                {active.alt}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close image viewer"
                className="inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-line)] text-[var(--color-bone-200)] transition-colors hover:bg-white/5"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div
              className="relative flex-1 px-4 pb-6 md:px-16"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-contain p-2"
              />
            </div>

            {viewable.length > 1 && (
              <div
                className="flex items-center justify-center gap-3 pb-8"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-line)] text-[var(--color-bone-200)] transition-colors hover:bg-white/5"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-line)] text-[var(--color-bone-200)] transition-colors hover:bg-white/5"
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
