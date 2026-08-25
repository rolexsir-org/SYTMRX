"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { navItems } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/ui/BrandMark";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const items = navItems();

  /* Elevate the bar once the page has moved. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close the mobile panel on navigation.
     Adjusting state during render (rather than in an effect) avoids a
     cascading re-render, and is the pattern React recommends for deriving
     state from a prop/route change. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  /* Lock scroll, trap focus and support Escape while the panel is open. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the panel for screen reader + keyboard users.
    window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 60);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-[var(--ease-out-expo)]",
        scrolled
          ? "glass border-b border-[var(--color-line)]"
          : "border-b border-transparent",
      )}
    >
      <div className="gutter mx-auto flex h-16 max-w-[1600px] items-center justify-between md:h-18">
        {/* Wordmark.
            No aria-label: an accessible name that does not contain the visible
            text ("SYTMRX") breaks voice-control users, who say what they see.
            The visible wordmark is the accessible name; the mark is decorative
            and hidden from assistive tech. */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-[var(--radius-xs)]"
        >
          <BrandMark
            aria-hidden="true"
            className="size-7 text-[var(--color-bone-50)] transition-opacity duration-300 group-hover:opacity-85"
          />
          <span className="text-[15px] font-semibold tracking-[0.14em] text-[var(--color-bone-50)] uppercase">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const active = !item.external && isActive(item.href);
            const className = cn(
              "relative rounded-[var(--radius-xs)] px-3 py-2 text-[13.5px] transition-colors duration-300",
              active
                ? "text-[var(--color-bone-50)]"
                : "text-[var(--color-bone-400)] hover:text-[var(--color-bone-50)]",
            );

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(className, "inline-flex items-center gap-1")}
                >
                  {item.label}
                  <ArrowUpRight aria-hidden="true" className="size-3 opacity-50" />
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={className}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-px bg-[var(--color-brass-400)]"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex">
          <Link
            href="/apps"
            className="group inline-flex h-9 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-4 text-[13px] font-medium text-[var(--color-ink-950)] transition-colors duration-300 hover:bg-white"
          >
            Explore Products
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Mobile trigger — 44px touch target */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-bone-200)] transition-colors hover:bg-white/[0.04] lg:hidden"
        >
          {open ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            ref={panelRef}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            /* Near-opaque rather than the header's lighter glass: the panel
               overlays page content, so translucency would let text show
               through and destroy legibility. */
            className="gutter absolute inset-x-0 top-full border-b border-[var(--color-line)] bg-[var(--color-ink-950)]/98 shadow-2xl shadow-black/60 backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label="Mobile" className="mx-auto max-w-[1600px] py-3">
              <ul className="flex flex-col">
                {items.map((item, index) => {
                  const active = !item.external && isActive(item.href);
                  const content = (
                    <>
                      <span className="label w-6 shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-[17px]",
                          active
                            ? "text-[var(--color-bone-50)]"
                            : "text-[var(--color-bone-200)]",
                        )}
                      >
                        {item.label}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-[var(--color-bone-600)]"
                      />
                    </>
                  );

                  return (
                    <li key={item.label} className="border-b border-[var(--color-line)] last:border-0">
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-14 items-center gap-4 py-3"
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex min-h-14 items-center gap-4 py-3"
                          aria-current={active ? "page" : undefined}
                        >
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/apps"
                className="mt-4 mb-5 flex h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] text-sm font-medium text-[var(--color-ink-950)]"
              >
                Explore Products
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
