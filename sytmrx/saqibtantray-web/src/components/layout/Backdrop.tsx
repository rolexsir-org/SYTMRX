/**
 * Fixed page backdrop: grid, noise and two very soft light sources.
 * Pure CSS, zero JS, non-interactive, painted once behind everything.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-[var(--color-ink-950)]" />

      {/* Fine grid, faded out toward the bottom */}
      <div
        className="texture-grid absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 92%)",
        }}
      />

      {/* Ambient light: cool top-left, warm brass bottom-right. Very restrained. */}
      <div
        className="absolute -top-[30vh] -left-[10vw] h-[70vh] w-[70vw] rounded-full opacity-[0.5]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(120,140,180,0.10) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-[35vh] -right-[15vw] h-[60vh] w-[55vw] rounded-full opacity-[0.45]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(201,164,105,0.09) 0%, transparent 65%)",
        }}
      />

      {/* Film grain */}
      <div className="texture-noise absolute inset-0" />
    </div>
  );
}
