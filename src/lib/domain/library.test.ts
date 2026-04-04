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
  it("sorts by recent note activity, then falls back to sync time", () => {
    const sorted = sortLibraryEntries(
      [
        {
          id: "late_sync",
          lastSyncedAt: "2026-04-04T12:00:00.000Z",
          lastNoteAt: null,
        },
        {
          id: "noted_first",
          lastSyncedAt: "2026-04-04T08:00:00.000Z",
          lastNoteAt: "2026-04-04T13:00:00.000Z",
        },
        {
          id: "noted_second",
          lastSyncedAt: "2026-04-04T09:00:00.000Z",
          lastNoteAt: "2026-04-04T11:00:00.000Z",
        },
      ],
      "recent-notes",
    );

    expect(sorted.map((entry) => entry.id)).toEqual([
      "noted_first",
      "noted_second",
      "late_sync",
    ]);
  });

  it("sorts by two-week playtime first, then total playtime", () => {
    const sorted = sortLibraryEntries(
      [
        {
          id: "more_total",
          lastSyncedAt: "2026-04-04T08:00:00.000Z",
          playtimeLastTwoWeeksMinutes: 120,
          playtimeForeverMinutes: 600,
        },
        {
          id: "more_recent",
          lastSyncedAt: "2026-04-04T09:00:00.000Z",
          playtimeLastTwoWeeksMinutes: 240,
          playtimeForeverMinutes: 300,
        },
        {
          id: "same_recent_lower_total",
          lastSyncedAt: "2026-04-04T10:00:00.000Z",
          playtimeLastTwoWeeksMinutes: 120,
          playtimeForeverMinutes: 400,
        },
      ],
      "two-week-playtime",
    );

    expect(sorted.map((entry) => entry.id)).toEqual([
      "more_recent",
      "more_total",
      "same_recent_lower_total",
    ]);
  });

  it("sorts by total playtime first, then two-week playtime", () => {
    const sorted = sortLibraryEntries(
      [
        {
          id: "highest_total",
          lastSyncedAt: "2026-04-04T08:00:00.000Z",
          playtimeLastTwoWeeksMinutes: 0,
          playtimeForeverMinutes: 1200,
        },
        {
          id: "same_total_more_recent",
          lastSyncedAt: "2026-04-04T09:00:00.000Z",
          playtimeLastTwoWeeksMinutes: 240,
          playtimeForeverMinutes: 600,
        },
        {
          id: "same_total_less_recent",
          lastSyncedAt: "2026-04-04T10:00:00.000Z",
          playtimeLastTwoWeeksMinutes: 120,
          playtimeForeverMinutes: 600,
        },
      ],
      "total-playtime",
    );

    expect(sorted.map((entry) => entry.id)).toEqual([
      "highest_total",
      "same_total_more_recent",
      "same_total_less_recent",
    ]);
  });
});
