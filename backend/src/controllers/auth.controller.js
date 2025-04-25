import express from "express";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { generateToken } from "../utils/GenerateToken.js";
import { uploadFileOnCloudinary } from "../lib/cloudinary.js";
import fs from "fs";

export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, "User already existed!");
      // return res.status(400).json({message:"User already existed!"})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }
    if (!password || !email || !fullName) {
      throw new ApiError(400, "All fields are required!");
    }
    if (password.trim().length < 6) {
      throw new ApiError(400, "Password must be stleast 6 character long.");
      // return res.status(400).json({message:"Password must be stleast 6 character long."})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const token = await generateToken(newUser._id, res);
      //   const cookieOptions = {
      //     httpOnly: true,
      //     maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      //     sameSite: "Strict",
      //     secure: process.env.NODE_ENV != "development",
      //   };

      const createdUser = await User.findById(newUser._id).select("-password");

      if (createdUser) {
        res
          .status(201)
          // .cookie("accessToken", token, cookieOptions)
          .json({
            data: createdUser,
            message: "User created successfully",
          });
      } else {
        throw new ApiError(404, "Created User not found!");
      }
    } else {
      throw new ApiError(400, "Failed to create user!");
    }
  } catch (error) {
    // throw new ApiError(400,"Failed to create user!",{message:"Failed to create user"})
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error." });
  }
};

export const login = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!(fullName || email) || !password) {
      throw new ApiError(400, "Please provide all required fields!");
    }

    const existedUser = await User.findOne({ $or: [{ fullName }, { email }] });
    if (!existedUser) {
      throw new ApiError(404, "User not found!");
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      existedUser.password
    );
    if (!isPasswordMatched) {
      throw new ApiError(401, "Invalid password!");
    }

    const userData = existedUser.toObject();
    delete userData.password;

    await generateToken(existedUser._id, res);
    res.status(200)
      .json({ data: userData, message: "User logged in successfully" });
      
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("accessToken", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // const {profilePic }  = req.body;
    const profilePic = req?.file?.path;
    const userId = req?.user?._id;

    if (!profilePic) {
      // throw new ApiError(400, "Please provide profile picture");
      return res
        .status(400)
        .json({ message: "Please provide profile picture" });
    }
    let updatedResponse;
    try {
      updatedResponse = await uploadFileOnCloudinary(profilePic);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to upload the profile picture" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profilePic: updatedResponse?.url } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    fs.unlink(profilePic, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });
    return res
      .status(200)
      .json({ data: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong!",
    });
  }
};

export const checkUserAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
