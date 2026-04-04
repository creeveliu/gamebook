export default function GameDetailLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(42,73,137,0.2),_rgba(6,10,18,0.95)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="h-5 w-28 animate-pulse rounded bg-white/10" />

        <section className="mt-6 grid gap-5 min-[480px]:grid-cols-[280px_minmax(0,1fr)] min-[480px]:items-start xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="min-[480px]:sticky min-[480px]:top-6">
            <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-stretch gap-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-5 min-[480px]:grid-cols-1 landscape:grid-cols-1">
                <div className="flex items-center">
                  <div className="aspect-[3/4] w-full animate-pulse rounded-[24px] border border-white/10 bg-white/8 shadow-[0_18px_48px_rgba(0,0,0,0.34)] min-[480px]:mx-auto min-[480px]:w-52 landscape:mx-auto landscape:w-40 xl:w-56" />
                </div>

                <div className="flex min-w-0 flex-col justify-between min-[480px]:mt-4 landscape:mt-3">
                  <div>
                    <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                    <div className="mt-2 h-6 w-4/5 animate-pulse rounded bg-white/10 sm:h-8 min-[480px]:w-3/4" />
                    <div className="mt-2 h-6 w-2/3 animate-pulse rounded bg-white/10 sm:h-8 min-[480px]:hidden" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="h-7 w-20 animate-pulse rounded-full bg-white/10" />
                    <div className="hidden h-7 w-24 animate-pulse rounded-full bg-white/10 min-[480px]:block" />
                  </div>

                  <div className="mt-3 grid gap-2">
                    <div className="rounded-[18px] border border-white/8 bg-black/20 px-3 py-2">
                      <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                      <div className="mt-2 h-5 w-24 animate-pulse rounded bg-white/10" />
                    </div>
                    <div className="rounded-[18px] border border-white/8 bg-black/20 px-3 py-2">
                      <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                      <div className="mt-2 h-5 w-20 animate-pulse rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="min-w-0 rounded-[32px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
              <div className="hidden h-8 w-24 animate-pulse rounded-full bg-white/10 sm:block" />
            </div>

            <div className="mt-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,9,16,0.84),rgba(11,16,28,0.74))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-5">
              <div className="h-5 w-11/12 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-5 w-full animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-5 w-5/6 animate-pulse rounded bg-white/10" />
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-10 w-24 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <article className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.16))] p-5">
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-4 w-10/12 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-white/10" />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                  <div className="flex gap-2">
                    <div className="h-8 w-14 animate-pulse rounded-full bg-white/10" />
                    <div className="h-8 w-14 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
              </article>

              <article className="hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.16))] p-5 min-[480px]:block">
                <div className="h-4 w-11/12 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                  <div className="flex gap-2">
                    <div className="h-8 w-14 animate-pulse rounded-full bg-white/10" />
                    <div className="h-8 w-14 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
              </article>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
