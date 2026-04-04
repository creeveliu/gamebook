export default function GameDetailLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(42,73,137,0.2),_rgba(6,10,18,0.95)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="h-5 w-28 animate-pulse rounded bg-white/10" />

        <section className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="aspect-[3/4] animate-pulse rounded-[32px] border border-white/10 bg-white/8" />

            <section className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-10 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="mt-4 flex gap-2">
                <div className="h-7 w-20 animate-pulse rounded-full bg-white/10" />
                <div className="h-7 w-24 animate-pulse rounded-full bg-white/10" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="h-20 animate-pulse rounded-[18px] bg-black/20" />
                <div className="h-20 animate-pulse rounded-[18px] bg-black/20" />
              </div>
            </section>
          </aside>

          <section className="min-w-0 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
            <div className="mt-6 h-36 animate-pulse rounded-[24px] bg-white/8" />
            <div className="mt-4 h-28 animate-pulse rounded-[24px] bg-white/8" />
          </section>
        </section>
      </div>
    </main>
  );
}
