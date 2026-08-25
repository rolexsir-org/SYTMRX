import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function PageHeader({
  label,
  title,
  description,
  meta,
}: {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="gutter mx-auto max-w-[1600px] pt-14 pb-12 md:pt-20 md:pb-16 lg:pt-24">
      <Reveal>
        <p className="label">{label}</p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="display mt-7 max-w-[16ch] text-[clamp(2.5rem,8vw,5.5rem)]">
          {title}
        </h1>
      </Reveal>

      {description && (
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[56ch] text-[15px] leading-[1.7] text-[var(--color-bone-400)] md:text-base">
            {description}
          </p>
        </Reveal>
      )}

      {meta && (
        <Reveal delay={0.15}>
          <div className="mt-10">{meta}</div>
        </Reveal>
      )}
    </header>
  );
}
