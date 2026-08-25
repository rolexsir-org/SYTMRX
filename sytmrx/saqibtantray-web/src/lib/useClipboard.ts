"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyState = "idle" | "copied" | "error";

/**
 * Clipboard helper with a self-resetting status flag.
 *
 * `navigator.clipboard` requires a secure context (HTTPS or localhost) and can
 * still reject if the document lacks focus or permission, so there is a
 * `document.execCommand` fallback and an explicit error state. The caller
 * always gets truthful feedback rather than a silent failure.
 */
export function useClipboard(resetAfterMs = 2000) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const schedule = useCallback(
    (next: CopyState) => {
      setState(next);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState("idle"), resetAfterMs);
    },
    [resetAfterMs],
  );

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          schedule("copied");
          return true;
        }
        // Fallback for non-secure contexts / older browsers.
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        area.style.pointerEvents = "none";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(area);
        schedule(ok ? "copied" : "error");
        return ok;
      } catch {
        schedule("error");
        return false;
      }
    },
    [schedule],
  );

  return { copy, state };
}
