import { NextResponse } from "next/server";
import { getLibraryItem } from "@/lib/library-service";
import { platformToSlug } from "@/lib/platforms/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userGameId: string }> },
) {
  const { userGameId } = await params;
  const item = await getLibraryItem(userGameId);

  if (!item) {
    return NextResponse.json({ ok: false, error: "未找到游戏。" }, { status: 404 });
  }

  return NextResponse.json({
    id: item.id,
    title: item.game.title,
    coverUrl: item.game.coverUrl,
    firstSyncedAt: item.firstSyncedAt.toISOString(),
    lastSyncedAt: item.lastSyncedAt.toISOString(),
    recentRank: item.recentRank,
    ownership: item.ownership.toLowerCase(),
    playtimeForeverMinutes: item.playtimeForeverMinutes,
    playtimeLastTwoWeeksMinutes: item.playtimeLastTwoWeeksMinutes,
    sources: item.sources.map((source) => ({
      id: source.id,
      platform: platformToSlug(source.platform),
      platformGameId: source.platformGameId,
      displayName: source.connectedAccount.displayName,
      lastSyncedAt: source.lastSyncedAt.toISOString(),
    })),
    notes: item.notes.map((note) => ({
      id: note.id,
      content: note.content,
      visibility: note.visibility.toLowerCase(),
      updatedAt: note.updatedAt.toISOString(),
    })),
  });
}
