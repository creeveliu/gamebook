import Link from "next/link";

type LibraryItem = {
  id: string;
  title: string;
  coverUrl: string;
  platforms: string[];
  noteCount: number;
  lastSyncedAt: string;
  recentRank?: number | null;
  playtimeForeverMinutes?: number | null;
  playtimeLastTwoWeeksMinutes?: number | null;
};

function formatMinutes(minutes?: number | null) {
  if (!minutes) return null;
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)}h` : `${hours.toFixed(1)}h`;
}

export function LibraryGrid({ items }: { items: LibraryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] px-8 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-white/35">
          Empty Shelf
        </p>
        <h3 className="mt-4 text-2xl font-semibold text-white">
          你的书柜还没有游戏
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
          先绑定 Steam 或 PlayStation
          账号，然后点击同步。导入后这里会自动变成一整面海报墙。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/library/${item.id}`}
          className="group relative overflow-hidden rounded-[24px] bg-white/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition-[transform,box-shadow,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_48px_rgba(0,0,0,0.34)] hover:brightness-105 motion-reduce:transform-none motion-reduce:transition-none"
        >
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/28 via-transparent to-white/10 opacity-70 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-90 motion-reduce:transition-none" />
          <div
            className="aspect-[3/4] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(6,10,18,0.08), rgba(6,10,18,0.86)), url(${item.coverUrl})`,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 z-20 p-4">
            <div className="flex flex-wrap gap-2">
              {item.platforms.map((platform) => (
                <span
                  key={platform}
                  className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-white/75"
                >
                  {platform}
                </span>
              ))}
            </div>
            <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-white">
              {item.title}
            </h3>
            <div className="mt-3 flex items-center justify-between text-xs text-white/55">
              <span>{item.noteCount} 篇笔记</span>
              <span>
                {item.recentRank != null
                  ? "最近玩过"
                  : new Date(item.lastSyncedAt).toLocaleDateString("zh-CN")}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/60">
              <span>
                总时长 {formatMinutes(item.playtimeForeverMinutes) ?? "--"}
              </span>
              <span>
                近两周 {formatMinutes(item.playtimeLastTwoWeeksMinutes) ?? "--"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
