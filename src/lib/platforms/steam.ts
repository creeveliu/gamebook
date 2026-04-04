import type { ConnectedAccount } from "@prisma/client";
import { getSteamEnv } from "@/lib/env";
import type { ExternalGame, PlatformAdapter } from "./types";

type SteamOwnedGamesResponse = {
  response: {
    game_count?: number;
    games?: Array<{
      appid: number;
      name?: string;
      playtime_forever?: number;
      img_icon_url?: string;
      rtime_last_played?: number;
    }>;
  };
};

type SteamRecentlyPlayedResponse = {
  response: {
    total_count?: number;
    games?: Array<{
      appid: number;
      playtime_2weeks?: number;
      playtime_forever?: number;
    }>;
  };
};

type SteamPlayerSummariesResponse = {
  response: {
    players?: Array<{
      steamid: string;
      personaname?: string;
    }>;
  };
};

export function buildSteamOpenIdUrl(input: { realm: string; returnTo: string }) {
  const url = new URL("https://steamcommunity.com/openid/login");
  url.searchParams.set("openid.ns", "http://specs.openid.net/auth/2.0");
  url.searchParams.set("openid.mode", "checkid_setup");
  url.searchParams.set("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select");
  url.searchParams.set("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select");
  url.searchParams.set("openid.return_to", input.returnTo);
  url.searchParams.set("openid.realm", input.realm);
  return url;
}

export function extractSteamIdFromClaimedId(claimedId: string) {
  const match = claimedId.match(/https:\/\/steamcommunity\.com\/openid\/id\/(\d+)/);

  if (!match) {
    throw new Error("无效的 Steam claimed_id");
  }

  return match[1];
}

export async function verifySteamOpenId(query: URLSearchParams) {
  const verification = new URLSearchParams();

  for (const [key, value] of query.entries()) {
    verification.set(key, value);
  }

  verification.set("openid.mode", "check_authentication");

  const response = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: verification.toString(),
  });

  const text = await response.text();
  return text.includes("is_valid:true");
}

export function normalizeSteamOwnedGames(input: {
  accountId: string;
  response: SteamOwnedGamesResponse["response"];
  recentGames?: SteamRecentlyPlayedResponse["response"]["games"];
}) {
  const now = new Date().toISOString();
  const fallbackRecentMap = new Map<
    number,
    {
      recentRank: number;
      playtimeForeverMinutes?: number | null;
      playtimeLastTwoWeeksMinutes?: number | null;
    }
  >(
    [...(input.response.games ?? [])]
      .filter((game) => (game.rtime_last_played ?? 0) > 0)
      .sort((a, b) => (b.rtime_last_played ?? 0) - (a.rtime_last_played ?? 0))
      .map((game, index) => [
        game.appid,
        {
          recentRank: index + 1,
          playtimeForeverMinutes: game.playtime_forever ?? 0,
          playtimeLastTwoWeeksMinutes: 0,
        },
      ]),
  );
  const recentMap = new Map(
    (input.recentGames ?? []).map((game, index) => [
      game.appid,
      {
        recentRank: index + 1,
        playtimeLastTwoWeeksMinutes: game.playtime_2weeks ?? 0,
        playtimeForeverMinutes: game.playtime_forever ?? null,
      },
    ]),
  );

  return (input.response.games ?? [])
    .filter((game) => game.name)
    .map<ExternalGame>((game) => {
      const recent = recentMap.get(game.appid) ?? fallbackRecentMap.get(game.appid);

      return {
        platform: "steam",
        platformGameId: String(game.appid),
        title: game.name ?? `Steam App ${game.appid}`,
        coverUrl: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/library_600x900_2x.jpg`,
        ownership: (game.playtime_forever ?? 0) > 0 ? "played" : "owned",
        lastSyncedAt: now,
        recentRank: recent?.recentRank ?? null,
        playtimeForeverMinutes: recent?.playtimeForeverMinutes ?? game.playtime_forever ?? 0,
        playtimeLastTwoWeeksMinutes: recent?.playtimeLastTwoWeeksMinutes ?? 0,
        raw: {
          accountId: input.accountId,
          appid: game.appid,
          playtimeForever: game.playtime_forever ?? 0,
          lastPlayedAt: game.rtime_last_played ?? 0,
          imgIconUrl: game.img_icon_url ?? null,
        },
      };
    });
}

async function fetchRecentlyPlayedGames(steamId: string) {
  const { apiKey } = getSteamEnv();
  const url = new URL("https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("count", "50");

  const response = await fetch(url);

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as SteamRecentlyPlayedResponse;
  return data.response.games ?? [];
}

async function fetchPlayerSummary(steamId: string) {
  const { apiKey } = getSteamEnv();
  const url = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamids", steamId);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("获取 Steam 用户信息失败。");
  }

  const data = (await response.json()) as SteamPlayerSummariesResponse;
  const player = data.response.players?.[0];

  return {
    externalAccountId: steamId,
    displayName: player?.personaname ?? `Steam ${steamId}`,
    metadata: {
      steamId,
      personaname: player?.personaname ?? null,
    },
  };
}

async function fetchOwnedGames(steamId: string) {
  const { apiKey } = getSteamEnv();
  const url = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("include_appinfo", "true");
  url.searchParams.set("include_played_free_games", "true");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Steam 游戏库同步失败。");
  }

  const data = (await response.json()) as SteamOwnedGamesResponse;
  const recentGames = await fetchRecentlyPlayedGames(steamId);
  const normalized = normalizeSteamOwnedGames({
    accountId: steamId,
    response: data.response,
    recentGames,
  });

  if (!normalized.length) {
    throw new Error(
      "Steam 没有返回可同步的游戏。请确认账号存在，并且 Steam 隐私中的 Game details 对外可见。",
    );
  }

  return normalized;
}

export const steamAdapter: PlatformAdapter = {
  platform: "steam",
  async connect(input) {
    const steamId = input.externalAccountId.trim();

    if (!/^\d{17}$/.test(steamId)) {
      throw new Error("Steam 绑定需要有效的 SteamID64。");
    }

    return fetchPlayerSummary(steamId);
  },
  async sync(account: ConnectedAccount) {
    return fetchOwnedGames(account.externalAccountId);
  },
  normalize(externalGame) {
    return externalGame;
  },
};
