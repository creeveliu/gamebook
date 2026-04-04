import { describe, expect, it } from "vitest";
import {
  buildCanonicalGameKey,
  mergeLibraryEntries,
  sortLibraryEntries,
  upsertSyncedLibrary,
} from "@/lib/domain/library";

describe("buildCanonicalGameKey", () => {
  it("normalizes game names so cross-platform titles merge", () => {
    expect(buildCanonicalGameKey("Persona 5 Royal")).toBe("persona-5-royal");
    expect(buildCanonicalGameKey("Persona 5: Royal")).toBe("persona-5-royal");
  });
});

describe("mergeLibraryEntries", () => {
  it("merges entries that resolve to the same canonical game", () => {
    const merged = mergeLibraryEntries([
      {
        id: "ug_1",
        gameId: "game_1",
        title: "Persona 5 Royal",
        coverUrl: "/persona.jpg",
        canonicalKey: "persona-5-royal",
        platforms: ["steam"],
        lastSyncedAt: "2026-04-04T10:00:00.000Z",
        noteCount: 2,
      },
      {
        id: "ug_2",
        gameId: "game_2",
        title: "Persona 5: Royal",
        coverUrl: "/persona.jpg",
        canonicalKey: "persona-5-royal",
        platforms: ["playstation"],
        lastSyncedAt: "2026-04-04T12:00:00.000Z",
        noteCount: 1,
      },
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0].platforms).toEqual(["playstation", "steam"]);
    expect(merged[0].noteCount).toBe(3);
    expect(merged[0].lastSyncedAt).toBe("2026-04-04T12:00:00.000Z");
  });

  it("keeps the strongest recent-play signal and sums playtime across sources", () => {
    const merged = mergeLibraryEntries([
      {
        id: "ug_1",
        gameId: "game_1",
        title: "Hades",
        coverUrl: "/hades.jpg",
        canonicalKey: "hades",
        platforms: ["steam"],
        lastSyncedAt: "2026-04-04T10:00:00.000Z",
        noteCount: 1,
        recentRank: 3,
        playtimeForeverMinutes: 120,
        playtimeLastTwoWeeksMinutes: 30,
      },
      {
        id: "ug_2",
        gameId: "game_2",
        title: "Hades",
        coverUrl: "/hades.jpg",
        canonicalKey: "hades",
        platforms: ["playstation"],
        lastSyncedAt: "2026-04-04T12:00:00.000Z",
        noteCount: 0,
        recentRank: 1,
        playtimeForeverMinutes: 240,
        playtimeLastTwoWeeksMinutes: 0,
      },
    ]);

    expect(merged[0].recentRank).toBe(1);
    expect(merged[0].playtimeForeverMinutes).toBe(360);
    expect(merged[0].playtimeLastTwoWeeksMinutes).toBe(30);
  });
});

describe("upsertSyncedLibrary", () => {
  it("creates new games on first sync and updates existing ones idempotently", () => {
    const first = upsertSyncedLibrary({
      existingGames: [],
      existingUserGames: [],
      externalGames: [
        {
          platform: "steam",
          platformGameId: "1091500",
          accountId: "acc_steam",
          title: "Cyberpunk 2077",
          coverUrl: "/cyberpunk.jpg",
          ownership: "owned",
          lastSyncedAt: "2026-04-04T08:00:00.000Z",
        },
      ],
    });

    expect(first.games).toHaveLength(1);
    expect(first.userGames).toHaveLength(1);
    expect(first.createdGameCount).toBe(1);
    expect(first.createdUserGameCount).toBe(1);

    const second = upsertSyncedLibrary({
      existingGames: first.games,
      existingUserGames: first.userGames,
      externalGames: [
        {
          platform: "steam",
          platformGameId: "1091500",
          accountId: "acc_steam",
          title: "Cyberpunk 2077",
          coverUrl: "/cyberpunk-updated.jpg",
          ownership: "played",
          lastSyncedAt: "2026-04-04T10:00:00.000Z",
        },
      ],
    });

    expect(second.games).toHaveLength(1);
    expect(second.userGames).toHaveLength(1);
    expect(second.createdGameCount).toBe(0);
    expect(second.createdUserGameCount).toBe(0);
    expect(second.games[0].coverUrl).toBe("/cyberpunk-updated.jpg");
    expect(second.userGames[0].ownership).toBe("played");
    expect(second.userGames[0].lastSyncedAt).toBe("2026-04-04T10:00:00.000Z");
  });
});

describe("sortLibraryEntries", () => {
  it("pushes games without recent-play data behind games with recent-play data", () => {
    const sorted = sortLibraryEntries(
      [
        {
          id: "late_sync",
          lastSyncedAt: "2026-04-04T12:00:00.000Z",
          recentRank: null,
        },
        {
          id: "played_first",
          lastSyncedAt: "2026-04-04T08:00:00.000Z",
          recentRank: 1,
        },
        {
          id: "played_second",
          lastSyncedAt: "2026-04-04T09:00:00.000Z",
          recentRank: 2,
        },
      ],
      "recent-played",
    );

    expect(sorted.map((entry) => entry.id)).toEqual([
      "played_first",
      "played_second",
      "late_sync",
    ]);
  });
});
