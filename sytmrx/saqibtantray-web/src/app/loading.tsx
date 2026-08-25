export default function Loading() {
  return (
    <div className="gutter mx-auto max-w-[1600px] py-20 md:py-28" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="h-3 w-24 rounded-full skeleton" />
      <div className="mt-8 h-16 w-[min(100%,32rem)] rounded-[var(--radius-sm)] skeleton md:h-24" />
      <div className="mt-6 h-4 w-[min(100%,26rem)] rounded-full skeleton" />
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="aspect-[16/10] rounded-[var(--radius-md)] skeleton" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-2/3 rounded-[var(--radius-sm)] skeleton" />
          <div className="h-4 w-full rounded-full skeleton" />
          <div className="h-4 w-5/6 rounded-full skeleton" />
        </div>
      </div>
    </div>
  );
}
