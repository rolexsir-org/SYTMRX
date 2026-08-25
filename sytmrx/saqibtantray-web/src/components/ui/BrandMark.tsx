interface BrandMarkProps {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

/**
 * SYTMRX mark.
 *
 * An abstract geometric glyph rather than a literal monogram: two ascending
 * strokes meeting a descending one, drawn on a strict grid. It reads as a
 * layered "stack" — an umbrella mark that suits software, apps, games and
 * future products equally, without tying the identity to any one of them.
 *
 * Inherits `currentColor`, so it adapts to whatever context it sits in.
 */
export function BrandMark({ className, ...rest }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      focusable="false"
      {...rest}
    >
      <rect
        x="0.75"
        y="0.75"
        width="26.5"
        height="26.5"
        rx="7.25"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />
      {/* Ascending stroke */}
      <path
        d="M8 18.5L14 9.5L20 18.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base rule — the "stack" line */}
      <path
        d="M9.5 21.5H18.5"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
