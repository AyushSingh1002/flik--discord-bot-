
import { Config } from "../model/configModel.js"
import { configCache } from "./configCache.js";

export const createConfig = async (guildId) => {
  if (!guildId) {
    console.log("guildId is required");
    return null;
  }

  // check if config already exists
  let existingConfig = await Config.findOne({ guildId });

  // create default config if missing
  if (!existingConfig) {
    existingConfig = await Config.create({
      guildId,
      enabled: true,
      anonChannelId: null,
      logChannelId: null,
      cooldownTime: 5000,
    });

    console.log("Config created");
  }

  return existingConfig;
};

export const updateConfig = async (
  guildId,
  updates
) => {

  if (!guildId) {
    console.log("guildId is required");
    return null;
  }

  // ensure config exists
  let existingConfig = await Config.findOne({ guildId });

  if (!existingConfig) {
    existingConfig = await createConfig(guildId);
  }


  // update config
  const updatedConfig = await Config.findOneAndUpdate(
    { guildId },
    updates,
    { returnDocument: "after" }
  );
 await configCache.set(guildId, {
        data: updateConfig,
        expiresAt: Date.now() + 5 * 60000
      });

  return updatedConfig;
};

 export const sendConfigEmbed = async (updatedConfig, interaction) => {
    await interaction.reply({
      embeds: [
        {
          title: "⚙️ Anonymous System Configuration",
          color: 0x5865F2,

          fields: [
            {
              name: "🟢 System Status",
              value: updatedConfig.enabled ? "Enabled" : "Disabled",
              inline: true,
            },
            {
              name: "📢 Anonymous Channel",
              value: updatedConfig.anonChannelId
                ? `<#${updatedConfig.anonChannelId}>`
                : "Not Configured",
              inline: true,
            },
            {
              name: "📜 Log Channel",
              value: updatedConfig.logChannelId
                ? `<#${updatedConfig.logChannelId}>`
                : "Not Configured",
              inline: true,
            },
            {
              name: "⏱ Cooldown",
              value: `${updatedConfig.cooldownTime / 1000}s`,
              inline: true,
            },
          ],

          footer: {
            text: `Guild ID: ${updatedConfig.guildId}`,
          },

          timestamp: new Date(),
        },
      ],

      ephemeral: true,
    });
  };