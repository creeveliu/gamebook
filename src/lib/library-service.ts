import {
  type ConnectedAccount,
  type OwnershipStatus,
  Prisma,
} from "@prisma/client";
import { buildCanonicalGameKey, mergeLibraryEntries } from "./domain/library";
import { getCurrentUser } from "./demo-user";
import { getAdapter } from "./platforms/adapters";
import {
  platformMap,
  platformToSlug,
  type ExternalGame,
  type PlatformSlug,
} from "./platforms/types";
import { prisma } from "./prisma";

export type LibrarySort = "recent-played" | "recent-sync" | "recent-notes";

function parsePlatform(platform: PlatformSlug) {
  return platformMap[platform];
}

function mapOwnership(input: "owned" | "played"): OwnershipStatus {
  return input === "played" ? "PLAYED" : "OWNED";
}

function compareBySort(sort: LibrarySort) {
  return (
    a: { lastSyncedAt: string; lastNoteAt?: string | null; recentRank?: number | null },
    b: { lastSyncedAt: string; lastNoteAt?: string | null; recentRank?: number | null },
  ) => {
    if (sort === "recent-played") {
      if (a.recentRank != null && b.recentRank != null) {
        return a.recentRank - b.recentRank || b.lastSyncedAt.localeCompare(a.lastSyncedAt);
      }

      if (a.recentRank != null) return -1;
      if (b.recentRank != null) return 1;
      return b.lastSyncedAt.localeCompare(a.lastSyncedAt);
    }

    if (sort === "recent-notes") {
      return (b.lastNoteAt ?? "").localeCompare(a.lastNoteAt ?? "") || b.lastSyncedAt.localeCompare(a.lastSyncedAt);
    }

    return b.lastSyncedAt.localeCompare(a.lastSyncedAt);
  };
}

export async function getConnectedAccounts() {
  const user = await getCurrentUser();

  return prisma.connectedAccount.findMany({
    where: { userId: user.id },
    orderBy: { platform: "asc" },
  });
}

export async function connectPlatformAccount(platform: PlatformSlug, externalAccountId: string) {
  const user = await getCurrentUser();
  const adapter = getAdapter(platform);
  const connected = await adapter.connect({ externalAccountId });

  return prisma.connectedAccount.upsert({
    where: {
      userId_platform: {
        userId: user.id,
        platform: parsePlatform(platform),
      },
    },
    update: {
      externalAccountId: connected.externalAccountId,
      displayName: connected.displayName,
      status: "CONNECTED",
      lastSyncError: null,
      metadata: connected.metadata ? JSON.parse(JSON.stringify(connected.metadata)) : Prisma.JsonNull,
    },
    create: {
      userId: user.id,
      platform: parsePlatform(platform),
      externalAccountId: connected.externalAccountId,
      displayName: connected.displayName,
      metadata: connected.metadata ? JSON.parse(JSON.stringify(connected.metadata)) : Prisma.JsonNull,
    },
  });
}

export async function connectResolvedPlatformAccount(input: {
  platform: PlatformSlug;
  externalAccountId: string;
  displayName: string;
  metadata?: Record<string, unknown>;
}) {
  const user = await getCurrentUser();

  return prisma.connectedAccount.upsert({
    where: {
      userId_platform: {
        userId: user.id,
        platform: parsePlatform(input.platform),
      },
    },
    update: {
      externalAccountId: input.externalAccountId,
      displayName: input.displayName,
      status: "CONNECTED",
      lastSyncError: null,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : Prisma.JsonNull,
    },
    create: {
      userId: user.id,
      platform: parsePlatform(input.platform),
      externalAccountId: input.externalAccountId,
      displayName: input.displayName,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : Prisma.JsonNull,
    },
  });
}

async function upsertExternalGame(
  connectedAccount: ConnectedAccount,
  externalGame: ExternalGame,
) {
  const canonicalKey = buildCanonicalGameKey(externalGame.title);

  const game = await prisma.game.upsert({
    where: { canonicalKey },
    update: {
      title: externalGame.title,
      coverUrl: externalGame.coverUrl,
    },
    create: {
      title: externalGame.title,
      canonicalKey,
      coverUrl: externalGame.coverUrl,
    },
  });

  const userGame = await prisma.userGame.upsert({
    where: {
      userId_gameId: {
        userId: connectedAccount.userId,
        gameId: game.id,
      },
    },
    update: {
      ownership: mapOwnership(externalGame.ownership),
      recentRank: externalGame.recentRank ?? null,
      playtimeForeverMinutes: externalGame.playtimeForeverMinutes ?? null,
      playtimeLastTwoWeeksMinutes: externalGame.playtimeLastTwoWeeksMinutes ?? null,
      lastSyncedAt: new Date(externalGame.lastSyncedAt),
    },
    create: {
      userId: connectedAccount.userId,
      gameId: game.id,
      ownership: mapOwnership(externalGame.ownership),
      recentRank: externalGame.recentRank ?? null,
      playtimeForeverMinutes: externalGame.playtimeForeverMinutes ?? null,
      playtimeLastTwoWeeksMinutes: externalGame.playtimeLastTwoWeeksMinutes ?? null,
      firstSyncedAt: new Date(externalGame.lastSyncedAt),
      lastSyncedAt: new Date(externalGame.lastSyncedAt),
    },
  });

  await prisma.userGameSource.upsert({
    where: {
      connectedAccountId_platformGameId: {
        connectedAccountId: connectedAccount.id,
        platformGameId: externalGame.platformGameId,
      },
    },
    update: {
      userGameId: userGame.id,
      platform: parsePlatform(externalGame.platform),
      rawData: JSON.parse(JSON.stringify(externalGame.raw)),
      lastSyncedAt: new Date(externalGame.lastSyncedAt),
    },
    create: {
      userGameId: userGame.id,
      connectedAccountId: connectedAccount.id,
      platform: parsePlatform(externalGame.platform),
      platformGameId: externalGame.platformGameId,
      rawData: JSON.parse(JSON.stringify(externalGame.raw)),
      lastSyncedAt: new Date(externalGame.lastSyncedAt),
    },
  });
}

export async function syncPlatformAccount(platform: PlatformSlug) {
  const user = await getCurrentUser();
  const connectedAccount = await prisma.connectedAccount.findUnique({
    where: {
      userId_platform: {
        userId: user.id,
        platform: parsePlatform(platform),
      },
    },
  });

  if (!connectedAccount) {
    throw new Error("请先绑定平台账号。");
  }

  const adapter = getAdapter(platform);

  try {
    const externalGames = await adapter.sync(connectedAccount);

    for (const game of externalGames.map((item) => adapter.normalize(item))) {
      await upsertExternalGame(connectedAccount, game);
    }

    await prisma.connectedAccount.update({
      where: { id: connectedAccount.id },
      data: {
        lastSyncedAt: new Date(),
        status: "CONNECTED",
        lastSyncError: null,
      },
    });

    return {
      syncedCount: externalGames.length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "同步失败";

    await prisma.connectedAccount.update({
      where: { id: connectedAccount.id },
      data: {
        status: "ERROR",
        lastSyncError: message,
      },
    });

    throw error;
  }
}

export async function getLibrary(options?: {
  platform?: PlatformSlug | "all";
  sort?: LibrarySort;
}) {
  const user = await getCurrentUser();
  const sort = options?.sort ?? "recent-played";
  const filterPlatform = options?.platform && options.platform !== "all" ? parsePlatform(options.platform) : null;

  const userGames = await prisma.userGame.findMany({
    where: {
      userId: user.id,
      ...(filterPlatform
        ? {
            sources: {
              some: {
                platform: filterPlatform,
              },
            },
          }
        : {}),
    },
    include: {
      game: true,
      sources: true,
      notes: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  const entries = mergeLibraryEntries(
    userGames.map((userGame) => ({
      id: userGame.id,
      gameId: userGame.gameId,
      title: userGame.game.title,
      coverUrl: userGame.game.coverUrl,
      canonicalKey: userGame.game.canonicalKey,
      platforms: [...new Set(userGame.sources.map((source) => platformToSlug(source.platform)))],
      lastSyncedAt: userGame.lastSyncedAt.toISOString(),
      noteCount: userGame.notes.length,
      recentRank: userGame.recentRank,
      playtimeForeverMinutes: userGame.playtimeForeverMinutes,
      playtimeLastTwoWeeksMinutes: userGame.playtimeLastTwoWeeksMinutes,
    })),
  );

  const lastNoteMap = new Map(
    userGames.map((userGame) => [userGame.game.canonicalKey, userGame.notes[0]?.updatedAt.toISOString() ?? null]),
  );

  return entries
    .map((entry) => ({
      ...entry,
      lastNoteAt: lastNoteMap.get(entry.canonicalKey) ?? null,
      recentRank: entry.recentRank ?? null,
    }))
    .sort(compareBySort(sort));
}

export async function getLibraryItem(userGameId: string) {
  const user = await getCurrentUser();

  return prisma.userGame.findFirst({
    where: {
      id: userGameId,
      userId: user.id,
    },
    include: {
      game: true,
      sources: {
        include: {
          connectedAccount: true,
        },
        orderBy: { lastSyncedAt: "desc" },
      },
      notes: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}

export async function createNote(userGameId: string, content: string) {
  const user = await getCurrentUser();
  const trimmed = content.trim();

  if (!trimmed) {
    throw new Error("笔记内容不能为空。");
  }

  return prisma.gameNote.create({
    data: {
      userId: user.id,
      userGameId,
      content: trimmed,
      visibility: "PRIVATE",
    },
  });
}

export async function updateNote(noteId: string, content: string) {
  const user = await getCurrentUser();
  const trimmed = content.trim();

  if (!trimmed) {
    throw new Error("笔记内容不能为空。");
  }

  return prisma.gameNote.update({
    where: {
      id_userId: {
        id: noteId,
        userId: user.id,
      },
    },
    data: { content: trimmed },
  });
}

export async function deleteNote(noteId: string) {
  const user = await getCurrentUser();

  return prisma.gameNote.delete({
    where: {
      id_userId: {
        id: noteId,
        userId: user.id,
      },
    },
  });
}
