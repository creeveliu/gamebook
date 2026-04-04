import Link from "next/link";

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
    <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.32em] text-white/40">Gamebook</p>
          <Link
            href="/settings"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-white/70 transition hover:bg-white/10"
          >
            设置
          </Link>
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {rightSlot}
    </section>
  );
}
