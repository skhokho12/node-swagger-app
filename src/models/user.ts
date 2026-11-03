import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, default: "User" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Boolean, required: false, default: false }, 
    verificationToken: { type: String, required: false },
    verificationTokenExpires: { type: Date, required: false },
    password: { type: String, required: true },
    type: { type: String, required: false, default: "user" },
    status: { type: String, required: false, default: "active" },
    createdAt: { type: Date, required: false, default: Date.now },
    updatedAt: { type: Date, required: false, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

