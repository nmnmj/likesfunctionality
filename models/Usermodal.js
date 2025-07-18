import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{type:String, required:true, unique:true, trim:true},
    password:{type:String, required:true, trim:true},
    googleId: { type: String },
})

const userModel = mongoose.model("user",userSchema)

export default userModel