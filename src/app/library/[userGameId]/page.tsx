import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GameDetailHero } from "@/components/game-detail-hero";
import { NotePanel } from "@/components/note-panel";
import { auth } from "@/lib/auth";
import { getLibraryItem } from "@/lib/library-service";

export const dynamic = "force-dynamic";

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
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(42,73,137,0.2),_rgba(6,10,18,0.95)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm text-white/60 transition hover:text-white"
        >
          ← 返回游戏库
        </Link>

        <section className="mt-6 grid gap-5 min-[480px]:grid-cols-[280px_minmax(0,1fr)] min-[480px]:items-start xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="min-[480px]:sticky min-[480px]:top-6">
            <GameDetailHero item={item} />
          </div>

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
