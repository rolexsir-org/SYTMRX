import Image from "next/image";
import type { Project, Screenshot } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Renders a project's visual.
 *
 * When a real screenshot exists it is rendered with next/image at its true
 * aspect ratio (object-contain — screenshots are never distorted or cropped).
 *
 * When no screenshot has been added yet, a deterministic generated preview is
 * drawn from the project's accent colours and monogram. This is clearly a
 * generated placeholder, not a fake product shot.
 */

export function GeneratedPreview({
  project,
  className,
  label = "Preview pending",
}: {
  project: Project;
  className?: string;
  label?: string;
}) {
  const [from, to] = project.accent;
  return (
    <div
      className={cn(
        "relative isolate flex h-full w-full items-center justify-center overflow-hidden",
        "bg-[var(--color-ink-850)]",
        className,
      )}
      role="img"
      aria-label={`${project.name} — no screenshot published yet`}
    >
      {/* Soft directional gradient built from the project's own accent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.22]"
        style={{
          background: `radial-gradient(120% 90% at 15% 10%, ${from} 0%, transparent 55%), radial-gradient(90% 80% at 85% 95%, ${to} 0%, transparent 60%)`,
        }}
      />
      <div aria-hidden="true" className="texture-grid absolute inset-0 opacity-60" />
      <div aria-hidden="true" className="texture-noise absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <span
          className="flex size-16 items-center justify-center rounded-[var(--radius-md)] border border-white/10 font-[family-name:var(--font-mono)] text-lg tracking-tight text-[var(--color-bone-50)] sm:size-20 sm:text-xl"
          style={{
            background: `linear-gradient(145deg, ${from}26, ${to}14)`,
          }}
        >
          {project.icon}
        </span>
        <span className="label">{label}</span>
      </div>

      {/* Hairline inner frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]"
      />
    </div>
  );
}

export function ProjectImage({
  screenshot,
  project,
  className,
  sizes,
  priority = false,
  fill = true,
}: {
  screenshot: Screenshot | undefined;
  project: Project;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  if (!screenshot?.src) {
    return <GeneratedPreview project={project} className={className} />;
  }

  if (fill) {
    return (
      <Image
        src={screenshot.src}
        alt={screenshot.alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 60vw"}
        priority={priority}
        // Never distort: preserve aspect ratio inside the frame.
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <Image
      src={screenshot.src}
      alt={screenshot.alt}
      width={screenshot.width ?? 1200}
      height={screenshot.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full object-contain", className)}
    />
  );
}

/** Small square app icon used in the /apps store listing. */
export function AppIcon({
  project,
  size = "md",
  className,
}: {
  project: Project;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [from, to] = project.accent;
  const dims = {
    sm: "size-10 text-[11px] rounded-[10px]",
    md: "size-14 text-[13px] rounded-[14px]",
    lg: "size-20 text-base rounded-[18px]",
  }[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        "border border-white/10 font-[family-name:var(--font-mono)] font-medium tracking-tight",
        "text-[var(--color-bone-50)]",
        dims,
        className,
      )}
      style={{
        background: `linear-gradient(150deg, ${from}33, ${to}1a), var(--color-ink-800)`,
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${from}55, transparent)` }}
      />
      {project.icon}
    </span>
  );
}
