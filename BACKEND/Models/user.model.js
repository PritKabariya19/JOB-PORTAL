import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Student", "Recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String, default: "" },
      skills: { type: [String], default: [] }, // ✅ array of strings
      resume: { type: String, default: "" },
      resumeOriginalName: { type: String, default: "" }, // ✅ fixed
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
