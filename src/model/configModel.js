
import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    guildId:{
        type: String,
        required: true
    },
    enabled:Boolean,
    anonChannelId:{
        type: String,
        default: null
    },
    logChannelId:{
        type: String,
        default: null
    },
    cooldownTime:{
        type: Number,
        default: 5000
    },
},{
    timestamps: true
})
export const Config = mongoose.model("Config",configSchema)


