import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchma = new Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      requied: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      requied: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);


export const Message = mongoose.model("Message", messageSchma);