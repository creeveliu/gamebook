import type { ConnectedAccount, Platform } from "@prisma/client";

export type PlatformSlug = "steam" | "playstation" | "xbox" | "switch";

export type AccountInput = {
  externalAccountId: string;
};

export type ExternalGame = {
  platform: PlatformSlug;
  platformGameId: string;
  title: string;
  coverUrl: string;
  ownership: "owned" | "played";
  lastSyncedAt: string;
  recentRank?: number | null;
  playtimeForeverMinutes?: number | null;
  playtimeLastTwoWeeksMinutes?: number | null;
  raw: Record<string, unknown>;
};

export type PlatformAdapter = {
  platform: PlatformSlug;
  connect(input: AccountInput): Promise<{
    externalAccountId: string;
    displayName: string;
    metadata?: Record<string, unknown>;
  }>;
  sync(account: ConnectedAccount): Promise<ExternalGame[]>;
  normalize(externalGame: ExternalGame): ExternalGame;
};

export const platformMap: Record<PlatformSlug, Platform> = {
  steam: "STEAM",
  playstation: "PLAYSTATION",
  xbox: "XBOX",
  switch: "SWITCH",
};

export const platformLabel: Record<PlatformSlug, string> = {
  steam: "Steam",
  playstation: "PlayStation",
  xbox: "Xbox",
  switch: "Switch",
};

export function platformToSlug(platform: Platform): PlatformSlug {
  if (platform === "STEAM") return "steam";
  if (platform === "PLAYSTATION") return "playstation";
  if (platform === "XBOX") return "xbox";
  return "switch";
}
