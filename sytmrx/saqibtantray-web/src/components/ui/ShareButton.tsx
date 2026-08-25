"use client";

import { useSyncExternalStore } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { useClipboard } from "@/lib/useClipboard";
import { cn } from "@/lib/cn";

/**
 * Share control.
 *
 * Uses the Web Share API where the browser actually supports it (mobile,
 * Safari) and falls back to copying the URL everywhere else. The label changes
 * to match the behaviour — "Share" only appears when a real share sheet will
 * open, otherwise it says "Copy link", so the button never over-promises.
 *
 * The URL is read from `window.location` at click time rather than being
 * passed in, so it is correct on any deployment (Vercel preview URL, custom
 * domain, localhost) with no configuration.
 */
/** The Web Share API is static for the lifetime of the page. */
const subscribeNoop = () => () => {};
const getShareSnapshot = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

export function ShareButton({
  title,
  text,
  className,
}: {
  title: string;
  text?: string;
  className?: string;
}) {
  /* Feature-detection via useSyncExternalStore rather than an effect: the
     server snapshot is `false`, so SSR and the first client render match, and
     React swaps in the real value during hydration without a cascading
     setState. The capability never changes, so the subscribe function is a
     no-op. */
  const canShare = useSyncExternalStore(subscribeNoop, getShareSnapshot, () => false);
  const { copy, state } = useClipboard();

  const handleClick = async () => {
    const url = window.location.href;

    if (canShare) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        // AbortError means the user dismissed the sheet — not a failure, and
        // it must not trigger the copy fallback.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copy(url);
  };

  const copied = state === "copied";
  const Icon = copied ? Check : canShare ? Share2 : Link2;
  const label = copied ? "Link copied" : canShare ? "Share" : "Copy link";

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      className={cn(
        "group inline-flex h-11 items-center gap-2.5 rounded-[var(--radius-sm)]",
        "border border-[var(--color-line-strong)] bg-white/[0.02] px-5 text-[14px] font-medium",
        "text-[var(--color-bone-50)] transition-all duration-300",
        "hover:border-white/25 hover:bg-white/[0.06]",
        copied && "text-[var(--color-signal-live)]",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {label}
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </button>
  );
}
