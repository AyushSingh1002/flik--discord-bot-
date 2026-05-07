import { after } from "node:test";
import { User } from "../model/userModel.js";

export const setMode = async (userId,guildId,mode) => {
    return await User.findOneAndUpdate({userId,guildId},{mode},{upsert:true,returnDocument:after})
}
export const getMode = async (userId, guildId) => {
   const userData = await User.findOne({userId,guildId})
   return userData?.mode || "anonymous"
}