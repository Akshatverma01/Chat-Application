import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "./ApiError.js";

export const generateToken = async (userId, res) => {
  try {
    if (!process.env.SECRET_KEY) {
      throw new ApiError(500, "SECRET_KEY is not defined in environment variables");
    }
    const user = await User.findById(userId);
    if (!user) throw new ApiError(400, "User Not found!");

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    const cookieOptions = {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
        sameSite: "Strict",
        secure: process.env.NODE_ENV != "development",
      };
    res.cookie("accessToken", token, cookieOptions);
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return new ApiError(500, error.message ||"Something went wrong | Token");
  }
};
