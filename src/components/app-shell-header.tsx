export function AppShellHeader({
  title,
  description,
  rightSlot,
}: {
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-white/40">Gamebook</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-6">
          <h1 className="shrink-0 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <div className="hidden lg:block">{rightSlot}</div>
        </div>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      <div className="lg:hidden">{rightSlot}</div>
    </section>
  );
}
