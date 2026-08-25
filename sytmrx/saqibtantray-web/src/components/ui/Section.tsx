import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";

interface SectionHeaderProps {
  /** Two-digit index, e.g. "01". */
  index?: string;
  label: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Reveal>
        <div className="flex items-center gap-4 border-b border-[var(--color-line)] pb-4">
          {index && <span className="label text-[var(--color-bone-600)]">{index}</span>}
          <span className="label text-[var(--color-bone-400)]">{label}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-line)]" />
          {action}
        </div>
      </Reveal>

      {(title || description) && (
        <div className="flex flex-col gap-5 pt-4 md:flex-row md:items-end md:justify-between md:gap-16">
          {title && (
            <Reveal delay={0.05} className="max-w-[20ch]">
              <h2 className="display text-[clamp(2rem,5.5vw,3.75rem)]">{title}</h2>
            </Reveal>
          )}
          {description && (
            <Reveal delay={0.1} className="max-w-[46ch]">
              <p className="text-[15px] leading-[1.7] text-[var(--color-bone-400)] md:text-base">
                {description}
              </p>
            </Reveal>
          )}
        </div>
      )}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("gutter mx-auto max-w-[1600px] py-20 md:py-28 lg:py-32", className)}
    >
      {children}
    </section>
  );
}
