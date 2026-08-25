import { WifiOff } from "lucide-react";
import type { ProjectStatus } from "@/data/types";
import { statusMeta } from "@/lib/meta";
import { cn } from "@/lib/cn";

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--color-line)]",
        "bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium tracking-wide",
        meta.text,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", meta.dot)}
      />
      {meta.label}
    </span>
  );
}

export function OfflineBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)]",
        "bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-[var(--color-bone-400)]",
        className,
      )}
      title="Works without an internet connection"
    >
      <WifiOff aria-hidden="true" className="size-3" />
      Offline capable
    </span>
  );
}

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-xs)] border border-[var(--color-line)]",
        "bg-white/[0.02] px-2 py-1 font-[family-name:var(--font-mono)] text-[11px]",
        "text-[var(--color-bone-400)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
