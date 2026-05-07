import mongoose from "mongoose";

export const connectDb = async (url) => {
    return await mongoose.connect(url)
    .then(()=>console.log("connected"))
    .catch((err)=>console.log("something went wrong in db", err))
}