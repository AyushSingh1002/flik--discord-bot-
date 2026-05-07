import { Application, ApplicationCommandOptionType, REST, roleMention, Routes } from "discord.js";
import { configDotenv } from "dotenv";

configDotenv()
const command = [
  {
    name: "switch_reality",
    description: "change your reality",
    options: [
      {
        name: "mode",
        description: "Choose your mode",
        type: 3, // STRING
        required: true,
        choices: [
          { name: "anonymous", value: "anonymous" },
          { name: "normal", value: "normal" }
        ]
      }
    ]
  },
{
    name: "anonymus_text",
    description: "use to send anonymus text",

    options: [{
      name: "text_area",
      description: "enter the content here",
      type: ApplicationCommandOptionType.String,
      required: true,
    }]
},
{
  name: "user_history",
  description: "find user message history",
  options: [{
      name: "uid",
      description: "enter the userid here",
      type: ApplicationCommandOptionType.String,
      required: true,
    }]
},
{
  name: "config_anon-channel",
  description: "configur anonymous channel bot",
  options: [{
      name: "anon-channel",
      description: "channel id",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    }]
},
{
  name: "config_anon-channel-logs",
  description: "configur anonymous channel log",
  options: [{
      name: "anon-channel-logs",
      description: "channel id",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    }]
},
{
  name: "config_cooldown",
  description: "configur anonymous channel bot cooldown",
  options: [{
      name: "cooldown",
      description: "message cooldown",
      type: ApplicationCommandOptionType.Number,
      required: true,
    }]
},
{
  name: "config_view",
  description: "view the server config",
}
];

const rest = new REST({ version: "10"}).setToken(process.env.TOKEN)

export const regCommand = async () => {

    try {
        console.log("commands getting registered",process.env.CLIENT_ID);
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body : command }
        )

        console.log("commands are registered");

    } catch (error) {
        console.log(error);
        
    }
}
/**export const regCommand = async () => {

    try {
        console.log("commands getting registered",process.env.CLIENT_ID,process.env.GUILD_ID);
        
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID),
            { body : []}
        )

        console.log("commands are registered");

    } catch (error) {
        console.log(error);
        
    }
} */