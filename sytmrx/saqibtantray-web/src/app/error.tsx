"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in server logs / browser console only. No third-party reporting.
    console.error(error);
  }, [error]);

  return (
    <div className="gutter mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-center py-24">
      <p className="label">Error</p>

      <h1 className="display mt-8 text-[clamp(2.5rem,9vw,6rem)]">
        Something
        <br />
        <span className="serif-accent text-[var(--color-brass-300)]">broke.</span>
      </h1>

      <p className="mt-8 max-w-[52ch] text-[15px] leading-[1.7] text-[var(--color-bone-400)]">
        An unexpected error occurred while rendering this page. Retrying usually
        resolves it.
      </p>

      {error.digest && (
        <p className="mt-4 font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-bone-600)]">
          Digest: {error.digest}
        </p>
      )}

      <div className="mt-11 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-6 text-[14.5px] font-medium text-[var(--color-ink-950)] transition-colors hover:bg-white"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-6 text-[14.5px] font-medium text-[var(--color-bone-50)] transition-all hover:border-white/25 hover:bg-white/[0.06]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
