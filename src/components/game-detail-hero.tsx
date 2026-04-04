import { platformLabel, platformToSlug } from "@/lib/platforms/types";

function formatMinutes(minutes?: number | null) {
  if (!minutes) return null;
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)} 小时` : `${hours.toFixed(1)} 小时`;
}

function buildMetaItems(item: {
  playtimeForeverMinutes?: number | null;
  playtimeLastTwoWeeksMinutes?: number | null;
}) {
  return [
    {
      label: "累计游玩",
      value: formatMinutes(item.playtimeForeverMinutes),
    },
    {
      label: "近两周",
      value: formatMinutes(item.playtimeLastTwoWeeksMinutes),
    },
  ].filter((meta): meta is { label: string; value: string } => Boolean(meta.value));
}

export function GameDetailHero({
  item,
}: {
  item: {
    game: {
      title: string;
      coverUrl: string;
    };
    sources: Array<{
      id: string;
      platform: Parameters<typeof platformToSlug>[0];
    }>;
    playtimeForeverMinutes?: number | null;
    playtimeLastTwoWeeksMinutes?: number | null;
  };
}) {
  const metaItems = buildMetaItems(item);

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-stretch gap-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-5 min-[480px]:grid-cols-1 landscape:grid-cols-1">
        <div className="flex items-center">
          <div
            className="aspect-[3/4] w-full rounded-[24px] border border-white/10 bg-cover bg-center shadow-[0_18px_48px_rgba(0,0,0,0.34)] min-[480px]:mx-auto min-[480px]:w-52 landscape:mx-auto landscape:w-40 xl:w-56"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(9,12,18,0.08), rgba(9,12,18,0.72)), url(${item.game.coverUrl})`,
            }}
          />
        </div>

        <div className="flex min-w-0 flex-col justify-between min-[480px]:mt-4 landscape:mt-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/34">Game Detail</p>
          <h1 className="mt-1.5 text-[1.35rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:mt-2 sm:text-[1.7rem]">
            {item.game.title}
          </h1>

          <div className="mt-2.5 flex flex-wrap gap-2">
            {item.sources.map((source) => {
              const slug = platformToSlug(source.platform);

              return (
                <span
                  key={source.id}
                  className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/72"
                >
                  {platformLabel[slug]}
                </span>
              );
            })}
          </div>

          {metaItems.length ? (
            <dl className="mt-3 grid gap-2">
              {metaItems.map((meta) => (
                <div
                  key={meta.label}
                  className="rounded-[18px] border border-white/8 bg-black/20 px-3 py-2"
                >
                  <dt className="text-[11px] uppercase tracking-[0.22em] text-white/36">
                    {meta.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium leading-5 text-white/90">{meta.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}
