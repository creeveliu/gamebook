import Link from "next/link";
import { notFound } from "next/navigation";
import { NotePanel } from "@/components/note-panel";
import { getLibraryItem } from "@/lib/library-service";
import { platformLabel, platformToSlug } from "@/lib/platforms/types";

export const dynamic = "force-dynamic";

function formatMinutes(minutes?: number | null) {
  if (!minutes) return "--";
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)} 小时` : `${hours.toFixed(1)} 小时`;
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ userGameId: string }>;
}) {
  const { userGameId } = await params;
  const item = await getLibraryItem(userGameId);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(42,73,137,0.2),_rgba(6,10,18,0.95)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-white/60 transition hover:text-white">
          ← 返回游戏书柜
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div
            className="aspect-[3/4] rounded-[32px] border border-white/10 bg-cover bg-center shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(9,12,18,0.04), rgba(9,12,18,0.72)), url(${item.game.coverUrl})` }}
          />

          <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">Game Detail</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{item.game.title}</h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.sources.map((source) => {
                const slug = platformToSlug(source.platform);

                return (
                  <span
                    key={source.id}
                    className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-white/72"
                  >
                    {platformLabel[slug]}
                  </span>
                );
              })}
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <dt className="text-xs uppercase tracking-[0.24em] text-white/38">首次入库</dt>
                <dd className="mt-2 text-lg text-white">{item.firstSyncedAt.toLocaleString("zh-CN")}</dd>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <dt className="text-xs uppercase tracking-[0.24em] text-white/38">最近同步</dt>
                <dd className="mt-2 text-lg text-white">{item.lastSyncedAt.toLocaleString("zh-CN")}</dd>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <dt className="text-xs uppercase tracking-[0.24em] text-white/38">累计游玩</dt>
                <dd className="mt-2 text-lg text-white">{formatMinutes(item.playtimeForeverMinutes)}</dd>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <dt className="text-xs uppercase tracking-[0.24em] text-white/38">近两周游玩</dt>
                <dd className="mt-2 text-lg text-white">{formatMinutes(item.playtimeLastTwoWeeksMinutes)}</dd>
              </div>
            </dl>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 p-4">
              <h2 className="text-sm font-medium text-white">来源平台</h2>
              <div className="mt-3 space-y-3">
                {item.sources.map((source) => {
                  const slug = platformToSlug(source.platform);

                  return (
                    <div
                      key={source.id}
                      className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/70"
                    >
                      <div>
                        <p className="font-medium text-white">{platformLabel[slug]}</p>
                        <p className="text-white/45">{source.connectedAccount.displayName}</p>
                      </div>
                      <span>{source.lastSyncedAt.toLocaleString("zh-CN")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </section>

        <div className="mt-8">
          <NotePanel
            userGameId={item.id}
            notes={item.notes.map((note) => ({
              id: note.id,
              content: note.content,
              updatedAt: note.updatedAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </main>
  );
}
