import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
    //   throw new Error("File path is required.");
      return null;
    }

    const response = await cloudinary.uploader
      .upload(filePath)
      .catch((err) => {
        throw err;
      });

    //  fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    fs.unlinkSync(filePath);
    return null;
  }
};
export {uploadFileOnCloudinary};
