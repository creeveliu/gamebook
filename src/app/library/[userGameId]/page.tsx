import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { NotePanel } from "@/components/note-panel";
import { auth } from "@/lib/auth";
import { getLibraryItem } from "@/lib/library-service";
import { platformLabel, platformToSlug } from "@/lib/platforms/types";

export const dynamic = "force-dynamic";

function formatMinutes(minutes?: number | null) {
  if (!minutes) return "--";
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
  ];
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ userGameId: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { userGameId } = await params;
  const item = await getLibraryItem(userGameId);

  if (!item) {
    notFound();
  }

  const metaItems = buildMetaItems(item);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(42,73,137,0.2),_rgba(6,10,18,0.95)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm text-white/60 transition hover:text-white">
          ← 返回游戏书柜
        </Link>

        <section className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div
              className="aspect-[3/4] rounded-[32px] border border-white/10 bg-cover bg-center shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(9,12,18,0.08), rgba(9,12,18,0.72)), url(${item.game.coverUrl})` }}
            />

            <section className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-white/34">Game Detail</p>
              <h1 className="mt-2.5 text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                {item.game.title}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
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

              <dl className="mt-4 grid grid-cols-2 gap-2.5">
                {metaItems.map((meta) => (
                  <div key={meta.label} className="rounded-[18px] border border-white/8 bg-black/20 px-3 py-2.5">
                    <dt className="text-[11px] uppercase tracking-[0.22em] text-white/36">{meta.label}</dt>
                    <dd className="mt-1.5 text-sm font-medium leading-6 text-white/90">{meta.value}</dd>
                  </div>
                ))}
              </dl>

            </section>
          </aside>

          <section className="min-w-0">
            <NotePanel
              userGameId={item.id}
              notes={item.notes.map((note) => ({
                id: note.id,
                content: note.content,
                updatedAt: note.updatedAt.toISOString(),
              }))}
            />
          </section>
        </section>
      </div>
    </main>
  );
}
