export type PlatformSlug = "steam" | "playstation" | "xbox" | "switch";
export type OwnershipSlug = "owned" | "played";

export type LibraryEntry = {
  id: string;
  gameId: string;
  title: string;
  coverUrl: string;
  canonicalKey: string;
  platforms: PlatformSlug[];
  lastSyncedAt: string;
  noteCount: number;
  recentRank?: number | null;
  playtimeForeverMinutes?: number | null;
  playtimeLastTwoWeeksMinutes?: number | null;
};

export type ExternalGameRecord = {
  platform: PlatformSlug;
  platformGameId: string;
  accountId: string;
  title: string;
  coverUrl: string;
  ownership: OwnershipSlug;
  lastSyncedAt: string;
  recentRank?: number | null;
  playtimeForeverMinutes?: number | null;
  playtimeLastTwoWeeksMinutes?: number | null;
};

export type GameRecord = {
  id: string;
  canonicalKey: string;
  title: string;
  coverUrl: string;
};

export type UserGameRecord = {
  id: string;
  gameId: string;
  ownership: OwnershipSlug;
  recentRank?: number | null;
  playtimeForeverMinutes?: number | null;
  playtimeLastTwoWeeksMinutes?: number | null;
  lastSyncedAt: string;
  firstSyncedAt: string;
  sources: {
    accountId: string;
    platform: PlatformSlug;
    platformGameId: string;
    lastSyncedAt: string;
  }[];
};

export function buildCanonicalGameKey(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function mergeLibraryEntries(entries: LibraryEntry[]) {
  const merged = new Map<string, LibraryEntry>();

  for (const entry of entries) {
    const existing = merged.get(entry.canonicalKey);

    if (!existing) {
      merged.set(entry.canonicalKey, {
        ...entry,
        platforms: [...entry.platforms].sort(),
      });
      continue;
    }

    merged.set(entry.canonicalKey, {
      ...existing,
      id: existing.lastSyncedAt >= entry.lastSyncedAt ? existing.id : entry.id,
      gameId: existing.lastSyncedAt >= entry.lastSyncedAt ? existing.gameId : entry.gameId,
      title: existing.title.length >= entry.title.length ? existing.title : entry.title,
      coverUrl: existing.lastSyncedAt >= entry.lastSyncedAt ? existing.coverUrl : entry.coverUrl,
      platforms: [...new Set([...existing.platforms, ...entry.platforms])].sort(),
      lastSyncedAt:
        existing.lastSyncedAt >= entry.lastSyncedAt ? existing.lastSyncedAt : entry.lastSyncedAt,
      noteCount: existing.noteCount + entry.noteCount,
      recentRank:
        existing.recentRank == null
          ? entry.recentRank ?? null
          : entry.recentRank == null
            ? existing.recentRank
            : Math.min(existing.recentRank, entry.recentRank),
      playtimeForeverMinutes:
        (existing.playtimeForeverMinutes ?? 0) + (entry.playtimeForeverMinutes ?? 0),
      playtimeLastTwoWeeksMinutes:
        (existing.playtimeLastTwoWeeksMinutes ?? 0) + (entry.playtimeLastTwoWeeksMinutes ?? 0),
    });
  }

  return [...merged.values()];
}

function createId(prefix: string, index: number) {
  return `${prefix}_${index + 1}`;
}

export function upsertSyncedLibrary(input: {
  existingGames: GameRecord[];
  existingUserGames: UserGameRecord[];
  externalGames: ExternalGameRecord[];
}) {
  const games = [...input.existingGames];
  const userGames = [...input.existingUserGames];
  let createdGameCount = 0;
  let createdUserGameCount = 0;

  for (const externalGame of input.externalGames) {
    const canonicalKey = buildCanonicalGameKey(externalGame.title);
    let game = games.find((candidate) => candidate.canonicalKey === canonicalKey);

    if (!game) {
      game = {
        id: createId("game", games.length),
        canonicalKey,
        title: externalGame.title,
        coverUrl: externalGame.coverUrl,
      };
      games.push(game);
      createdGameCount += 1;
    } else {
      game.title = externalGame.title;
      game.coverUrl = externalGame.coverUrl;
    }

    let userGame = userGames.find((candidate) => candidate.gameId === game.id);

    if (!userGame) {
      userGame = {
        id: createId("user_game", userGames.length),
        gameId: game.id,
        ownership: externalGame.ownership,
        recentRank: externalGame.recentRank ?? null,
        playtimeForeverMinutes: externalGame.playtimeForeverMinutes ?? null,
        playtimeLastTwoWeeksMinutes: externalGame.playtimeLastTwoWeeksMinutes ?? null,
        firstSyncedAt: externalGame.lastSyncedAt,
        lastSyncedAt: externalGame.lastSyncedAt,
        sources: [],
      };
      userGames.push(userGame);
      createdUserGameCount += 1;
    }

    userGame.ownership = externalGame.ownership;
    userGame.lastSyncedAt = externalGame.lastSyncedAt;
    userGame.recentRank = externalGame.recentRank ?? userGame.recentRank ?? null;
    userGame.playtimeForeverMinutes = externalGame.playtimeForeverMinutes ?? userGame.playtimeForeverMinutes ?? null;
    userGame.playtimeLastTwoWeeksMinutes =
      externalGame.playtimeLastTwoWeeksMinutes ?? userGame.playtimeLastTwoWeeksMinutes ?? null;

    const source = userGame.sources.find(
      (candidate) =>
        candidate.accountId === externalGame.accountId &&
        candidate.platformGameId === externalGame.platformGameId,
    );

    if (source) {
      source.lastSyncedAt = externalGame.lastSyncedAt;
    } else {
      userGame.sources.push({
        accountId: externalGame.accountId,
        platform: externalGame.platform,
        platformGameId: externalGame.platformGameId,
        lastSyncedAt: externalGame.lastSyncedAt,
      });
    }
  }

  return {
    games,
    userGames,
    createdGameCount,
    createdUserGameCount,
  };
}
