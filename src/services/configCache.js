import { createConfig } from "./configService.js";

export const configCache = new Map();

export const cacheConfig = async (guildId) => {

  let config;

  const cached = configCache.get(guildId);

  if (cached && cached.expiresAt > Date.now()) {

    // valid cache
    config = cached.data;

  } else {

    // expired or missing
    config = await createConfig(guildId);

    configCache.set(guildId, {
      data: config,
      expiresAt: Date.now() + 5 * 60000
    });
  }

  return config;
};