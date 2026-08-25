"use client";

import { Check, Copy, X } from "lucide-react";
import { useClipboard } from "@/lib/useClipboard";
import { cn } from "@/lib/cn";

/**
 * Copies a value to the clipboard and reports the real outcome.
 *
 * The status is announced through an aria-live region so screen reader users
 * get the same confirmation sighted users do, and the label reflects failure
 * honestly rather than always claiming success.
 */
export function CopyButton({
  value,
  label,
  className,
  variant = "ghost",
}: {
  value: string;
  /** Describes what is being copied, e.g. "email address". */
  label: string;
  className?: string;
  variant?: "ghost" | "outline";
}) {
  const { copy, state } = useClipboard();

  const Icon = state === "copied" ? Check : state === "error" ? X : Copy;
  const text =
    state === "copied" ? "Copied" : state === "error" ? "Press Ctrl+C" : "Copy";

  return (
    <button
      type="button"
      onClick={() => void copy(value)}
      aria-label={`Copy ${label}`}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-sm)] text-[13px]",
        "sm:h-9 sm:w-auto sm:justify-start sm:px-3",
        "transition-colors duration-300",
        variant === "outline"
          ? "border border-[var(--color-line-strong)] bg-white/[0.02] text-[var(--color-bone-200)] hover:border-white/25 hover:bg-white/[0.06]"
          : "text-[var(--color-bone-400)] hover:bg-white/[0.04] hover:text-[var(--color-bone-50)]",
        state === "copied" && "text-[var(--color-signal-live)]",
        state === "error" && "text-[var(--color-bone-200)]",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {/* The text label is decorative on narrow screens: the button already
          has an aria-label, so hiding it avoids clipping the control while
          keeping a 44px touch target. */}
      <span className="hidden sm:inline">{text}</span>
      <span aria-live="polite" className="sr-only">
        {state === "copied"
          ? `${label} copied to clipboard`
          : state === "error"
            ? `Could not copy ${label} automatically`
            : ""}
      </span>
    </button>
  );
}
