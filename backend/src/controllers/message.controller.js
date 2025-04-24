import User from "../models/user.model.js";
import { Message } from "../models/message.models.js";
import { uploadFileOnCloudinary } from "../lib/cloudinary.js";
import mongoose from "mongoose";
import fs from "fs"
import { getReceiverSocketId, io } from "../utils/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(filteredUsers);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const { ObjectId } = mongoose.Types;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: new ObjectId(userToChatId), receiverId: myId },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const createMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const myId = req.user._id;
    let imageUrl = req?.file?.path;

    let responseUrl;
    try {
      responseUrl = await uploadFileOnCloudinary(imageUrl);
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "Failed to upload the profile picture" });
    }

    const newMessage = await Message.create({
      senderId: myId,
      receiverId,
      text,
      image: responseUrl?.secure_url || responseUrl?.url ||"",
    });
    if (imageUrl) {
      fs.unlink(imageUrl, (err) => {
        if (err) console.error("Failed to delete local file:", err);
      });
    }
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

