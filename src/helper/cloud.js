import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadToCloud = async (file) => {
  try {
    let options = {
      folder: "BlogPosts",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      resource_type: "auto" // This will automatically detect if it's an image or video
    };

    const uploadedFile = await cloudinary.uploader.upload(file.path, options);
    return uploadedFile;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
