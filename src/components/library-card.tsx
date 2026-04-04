import Link from "next/link";
import { getLibraryCardStats, getLibraryCardStatus } from "@/components/library-card-meta";

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

export function LibraryCard({
  item,
  isPending,
  onClick,
}: {
  item: LibraryItem;
  isPending: boolean;
  onClick?: () => void;
}) {
  const status = getLibraryCardStatus(item.recentRank);
  const stats = getLibraryCardStats(item);

  return (
    <Link
      href={`/library/${item.id}`}
      onClick={onClick}
      aria-busy={isPending}
      className={`group relative overflow-hidden rounded-[24px] bg-white/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition-[transform,box-shadow,filter,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_18px_48px_rgba(0,0,0,0.34)] hover:brightness-105 motion-reduce:transform-none motion-reduce:transition-none ${
        isPending ? "scale-[0.985] opacity-80" : ""
      }`}
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
        <div className="mt-3 flex items-center gap-3 text-xs text-white/55">
          <span>{item.noteCount} 篇笔记</span>
          {status ? <span>{status}</span> : null}
        </div>
        {stats.length ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
            {stats.map((stat) => (
              <span key={stat.label}>
                {stat.label} {stat.value}
              </span>
            ))}
          </div>
        ) : null}
        {isPending ? (
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-white/78">
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin rounded-full border border-white/35 border-t-white"
            />
            <span>正在打开</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
