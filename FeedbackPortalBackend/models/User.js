import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  isAdmin: { type: Boolean, default: false },
  registerNo: { type: String, required: true, unique: true }, 
  department: { type: String, required: true }, 
  batch: { type: String, required: true }, 
     
});

const User = mongoose.model("User", userSchema);
export default User;