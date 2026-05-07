import { Client, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";
import { anonymusTexting, messageHandler } from "./event/messageEvent.js";
import { connectDb } from "./database/db.js";
import { configDotenv } from "dotenv";
import { regCommand } from "./commands/commandRegister.js";
import { setMode } from "./services/modeService.js";
import { checkCooldown, checkRateLimit, securityInteraction, startCleanup } from "./services/securityService.js";
import { getUserDetailedMsgHis } from "./services/messageService.js";
import { status } from "./utils/statusUtils.js";
import { createConfig, sendConfigEmbed, updateConfig } from "./services/configService.js";
import { Config } from "./model/configModel.js";

configDotenv();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

connectDb(process.env.DB);
startCleanup();
regCommand()
client.on("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);

  let lastIndex = -1;

  const setStatus = () => {
    let randomSel;

    do {
      randomSel = Math.floor(Math.random() * status.length);
    } while (randomSel === lastIndex);

    lastIndex = randomSel;

    const current = status[randomSel];

    client.user.setPresence({
      status: current.presence,
      activities: [
        {
          name: current.name,
          type: current.type,
          url: current.url,
        },
      ],
    });
  };

  setStatus(); // 🔥 run instantly
  setInterval(setStatus, 10800000); // then every 3 hours
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const guildId = interaction.guild.id;
  const userId = interaction.user.id;

  // ensure config exists
  const config = await createConfig(guildId);

  // ---------------- CONFIG COMMANDS ----------------

  if (interaction.commandName === "config_view") {
    return sendConfigEmbed(config,interaction);
  }

  if (interaction.commandName === "config_anon-channel") {

    const blocked = await securityInteraction(userId, interaction);
    if (blocked) return;

    const channel = interaction.options.getChannel("anon-channel");

    const updatedConfig = await updateConfig(guildId, {
      anonChannelId: channel.id,
    });

    return sendConfigEmbed(updatedConfig,interaction);
  }

  if (interaction.commandName === "config_anon-channel-logs") {

    const blocked = await securityInteraction(userId, interaction);
    if (blocked) return;

    const channel = interaction.options.getChannel("anon-channel-logs");

    const updatedConfig = await updateConfig(guildId, {
      logChannelId: channel.id,
    });

    return sendConfigEmbed(updatedConfig,interaction);
  }

  if (interaction.commandName === "config_cooldown") {

    const blocked = await securityInteraction(userId, interaction);
    if (blocked) return;

    const cooldownTime = interaction.options.getNumber("cooldown");

    const updatedConfig = await updateConfig(guildId, {
      cooldownTime: cooldownTime * 1000,
    });

    return sendConfigEmbed(updatedConfig,interaction);
  }

  // block anon system if channels not configured
  if (!config?.anonChannelId || !config?.logChannelId) {
    return interaction.reply({
      content:
        "⚠️ Please configure anonymous and log channels before using the bot.",
      ephemeral: true,
    });
  }

  // ---------------- ANON COMMANDS ----------------

  if (interaction.commandName === "switch_reality") {

    const blocked = await securityInteraction(userId, interaction);
    if (blocked) return;

    const mode = interaction.options.getString("mode");

    if (!["anonymous", "normal"].includes(mode)) {
      return interaction.reply({
        content: "Use: anonymous or normal",
        ephemeral: true,
      });
    }

    await setMode(userId, guildId, mode);

    return interaction.reply({
      content: `Mode set to ${mode}`,
      ephemeral: true,
    });
  }

  if (interaction.commandName === "anonymus_text") {

    const blocked = await securityInteraction(userId, interaction);
    if (blocked) return;

    // enforce anon channel
    if (interaction.channel.id !== config.anonChannelId) {
      return interaction.reply({
        content: `⚠️ Use this command in <#${config.anonChannelId}>`,
        ephemeral: true,
      });
    }

    const content = interaction.options.getString("text_area");

    await anonymusTexting(interaction, content);

    return interaction.reply({
      content: "✅ Message sent anonymously!",
      ephemeral: true,
    });
  }

  if (interaction.commandName === "user_history") {

    const blocked = await securityInteraction(userId, interaction);
    if (blocked) return;

    const uid = interaction.options.getString("uid");

    return await getUserDetailedMsgHis(uid, interaction);
  }
});

client.on("messageCreate", messageHandler);

client.login(process.env.TOKEN);

