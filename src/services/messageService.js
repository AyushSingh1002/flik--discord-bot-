import { Message } from "../model/messageModel.js";

export const MessageDb = async (anonMessageId,originalUserId,channelId,content) => {
    if (!anonMessageId,!originalUserId,!channelId,!content) {
        console.log("something went wrong in message service");
        return false;
    }
    try {
        await Message.insertOne({
        anonMessageId,originalUserId,channelId,content
    })
    
    return true
    } catch (error) {
        console.log("something went wrong in message service", error);
        return false;
    }
}

export const getUserDetailedMsgHis = async (uid, interaction) => {
  const data = await Message.find({ originalUserId: uid })
    .select("anonMessageId channelId content")
    .limit(10); // prevent spam

  if (!data.length) {
    return interaction.reply({
      content: "No anonymous messages found for this user.",
      ephemeral: true,
    });
  }

  const fields = data.map((msg, index) => ({
    name: `🧾 Message ${index + 1}`,
    value:
      `💬 ${msg.content.slice(0, 100)}\n` +
      `📍 <#${msg.channelId}>\n` +
      `🆔 ${msg.anonMessageId}`,
  }));

  await interaction.reply({
    embeds: [
      {
        title: "🕶️ User Anonymous Message History",
        color: 0x5865F2,

        fields,

        footer: {
          text: `User ID: ${uid}`,
        },

        timestamp: new Date(),
      },
    ],
    ephemeral: true,
  });
};