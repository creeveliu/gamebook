import { steamAdapter } from "./steam";
import type { PlatformAdapter, PlatformSlug } from "./types";

function createUnavailableAdapter(platform: PlatformSlug, message: string): PlatformAdapter {
  return {
    platform,
    async connect(input) {
      void input;
      throw new Error(message);
    },
    async sync() {
      throw new Error(message);
    },
    normalize(externalGame) {
      return externalGame;
    },
  };
}

export const adapters = {
  steam: steamAdapter,
  playstation: createUnavailableAdapter("playstation", "PlayStation 暂未接入真实同步。"),
};

export function getAdapter(platform: PlatformSlug) {
  const adapter = adapters[platform as keyof typeof adapters];

  if (!adapter) {
    throw new Error("该平台尚未接入。");
  }

  return adapter;
}
