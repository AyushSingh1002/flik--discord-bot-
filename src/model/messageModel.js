
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    anonMessageId:String,
    originalUserId:String,
    channelId:String,
    content:String,
},{
    timestamps: true
})
export const Message = mongoose.model("Message",messageSchema)

