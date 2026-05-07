import { getMode } from "../services/modeService.js";
import { getOrCreateWebhook } from "../services/webhook.js";
import { MessageDb } from "../services/messageService.js";
import { logMaker } from "../services/logService.js";

const maskNAmes = [ "ShadowFox 🦊",
"SilentWolf 🐺",
"GhostUser 👻"]
export const messageHandler = async (message) => {

  if (message.author.bot) return;

  logMaker(message,message.id,message.content)

  MessageDb(message.id,message.author.id,message.channelId,message.content.slice(0, 1000))
  
  const mode = await getMode(message.author.id, message.guild.id);

  if (mode === "anonymous") {
    try {
      const webhook = await getOrCreateWebhook(message.channel);

      const sent = await webhook.send({
        content: message.content,
        username: "anonymous",
        avatarURL: "https://i.imgur.com/7k48XQa.png",
      });

      message.delete();

    } catch (err) {
      console.error(err);
    }
  }
};

export const anonymusTexting = async (m,content) => {
  if(m.user.bot) return;

  try {
    const curIndex = Math.floor(Math.random() * 3)
    const webhook = await getOrCreateWebhook(m.channel);

      const sent = await webhook.send({
        content: content,
        username: maskNAmes[curIndex],
        avatarURL: "https://i.imgur.com/g1Lcplz.png",
      });
    logMaker(m,sent.id,content)
   
MessageDb(sent.id,m.user.id,m.channel.id,content.slice(0, 1000))
  } catch (error) {
    console.log(error)
  }
}