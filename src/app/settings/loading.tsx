export default function SettingsLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(52,92,185,0.22),_rgba(8,12,20,0.98)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="flex flex-col gap-6">
          <div>
            <div className="h-4 w-28 rounded-full bg-white/10" />
            <div className="mt-3 h-14 w-72 rounded-2xl bg-white/10 sm:w-96" />
            <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-white/8" />
            <div className="mt-3 h-4 w-full max-w-xl rounded-full bg-white/8" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="h-5 w-36 rounded-full bg-white/10" />
            <div className="mt-4 h-10 w-52 rounded-full bg-white/10" />
            <div className="mt-6 h-24 rounded-[24px] bg-white/[0.04]" />
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="h-5 w-40 rounded-full bg-white/10" />
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="h-40 rounded-[24px] bg-white/[0.04]" />
              <div className="h-40 rounded-[24px] bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
