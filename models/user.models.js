import mongoose from "mongoose"
const userschema = new mongoose.Schema({
    name:{
        type:String
    }
},{timestamps:true})
export const User = mongoose.model("User",userschema); 