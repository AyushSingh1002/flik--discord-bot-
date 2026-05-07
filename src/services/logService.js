import { cacheConfig } from "./configCache.js";
import { createConfig } from "./configService.js";

export const logMaker = async (message,sent,content) => {
    const guildId = message.guild.id;
     const config = await cacheConfig(guildId)
      const logChannel = message.guild.channels.cache.get(config.logChannelId);
    
    if (!logChannel){
      
    console.log("please configure the channed and log id to use this bot")
    return
  
    };
      await logChannel.send({
        embeds: [
          {
            title: "🕶️ Anonymous Message Log",
            color: 0x5865F2, // Discord blurple
    
            fields: [
              {
                name: "👤 User",
                value: `<@${message.author?.id || message.user.id}>`,
                inline: true,
              },
              {
                name: "🆔 User ID",
                value: message?.author?.id || message.user.id,
                inline: true,
              },
              {
                name: "💬 Message",
                value: message?.content?.slice(0, 1000) || content.slice(0, 1000),
              },
              {
                name: "📍 Channel",
                value: `<#${message?.channelId || message.channel.id}>`,
                inline: true,
              },
              {
              name: "🔗 Jump",
              value: `[Click here](https://discord.com/channels/${message?.guildId}/${message?.channelId||message?.channel.id}/${sent})`,
            },
            ],
    
            footer: {
              text: `Message ID: ${message?.id}`,
            },
    
            timestamp: new Date(),
          },
        ],
      });
}
