import { User } from "../Models/user.model.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password:hashedPassword,
      role,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Something is missing", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }

    if (user.role !== role) {
      return res
        .status(400)
        .json({
          message: "Account does not exist with current role",
          success: false,
        });
    }

   const tokenData = { id: user._id }; // 👈 change here
const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
  expiresIn: "1d",
});


    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: "Login successful", success: true,token:token, user });
  } catch (error) {
    console.log(error);
  }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: "Logout successful", success: true });
  } catch (error) {
    console.log(error);
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const { fullname, phoneNumber, bio, skills, email } = req.body;
    const file = req.file; // file for resume or profile pic (Cloudinary later)

    let skillsArray;
    if(skills){
      skillsArray = skills.split(",");
    }
    // skills.split(",").map((skill) => skill.trim());
    const userId = req.user.userId; // from middleware
    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // update fields
    if(fullname)user.fullname = fullname;
    if(email)if (email) user.email = email;
    if(phoneNumber)user.phoneNumber = phoneNumber;
    if(bio)user.profile.bio = bio;
    if(skillsArray)user.profile.skills = skillsArray;

    // TODO: file upload with Cloudinary if needed
    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
