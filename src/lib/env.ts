function readEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`缺少环境变量 ${name}`);
  }

  return value;
}

export function getSteamEnv() {
  return {
    apiKey: readEnv("STEAM_WEB_API_KEY"),
  };
}
