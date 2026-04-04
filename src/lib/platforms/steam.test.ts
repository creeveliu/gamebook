import { describe, expect, it } from "vitest";
import {
  buildSteamOpenIdUrl,
  extractSteamIdFromClaimedId,
  normalizeSteamOwnedGames,
} from "@/lib/platforms/steam";

describe("buildSteamOpenIdUrl", () => {
  it("builds a valid Steam OpenID redirect url", () => {
    const url = buildSteamOpenIdUrl({
      realm: "http://localhost:3000",
      returnTo: "http://localhost:3000/api/auth/steam/callback",
    });

    expect(url.origin + url.pathname).toBe("https://steamcommunity.com/openid/login");
    expect(url.searchParams.get("openid.mode")).toBe("checkid_setup");
    expect(url.searchParams.get("openid.realm")).toBe("http://localhost:3000");
    expect(url.searchParams.get("openid.return_to")).toBe(
      "http://localhost:3000/api/auth/steam/callback",
    );
  });
});

describe("extractSteamIdFromClaimedId", () => {
  it("extracts the SteamID64 from claimed_id", () => {
    expect(
      extractSteamIdFromClaimedId("https://steamcommunity.com/openid/id/76561198000000000"),
    ).toBe("76561198000000000");
  });

  it("throws on malformed claimed ids", () => {
    expect(() => extractSteamIdFromClaimedId("https://example.com/user/123")).toThrow(
      "无效的 Steam claimed_id",
    );
  });
});

describe("normalizeSteamOwnedGames", () => {
  it("maps Steam owned games into the shared external game shape", () => {
    const games = normalizeSteamOwnedGames({
      accountId: "76561198000000000",
      response: {
        game_count: 1,
        games: [
          {
            appid: 1091500,
            name: "Cyberpunk 2077",
            playtime_forever: 400,
            img_icon_url: "icon",
            rtime_last_played: 1712210000,
          },
        ],
      },
    });

    expect(games).toHaveLength(1);
    expect(games[0]).toMatchObject({
      platform: "steam",
      platformGameId: "1091500",
      title: "Cyberpunk 2077",
      ownership: "played",
      recentRank: 1,
      playtimeForeverMinutes: 400,
    });
    expect(games[0].coverUrl).toContain("/steam/apps/1091500/");
  });
});
