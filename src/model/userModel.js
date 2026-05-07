
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId:String,
    guildId:String,
    mode:{
        type: String,
        enum:["normal","anonymous"],
        default:"normal"
    }
})
export const User = mongoose.model("User",userSchema)