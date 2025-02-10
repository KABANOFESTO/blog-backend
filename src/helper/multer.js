import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow both images and videos
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedImageFormats = [".png", ".jpg", ".jpeg", ".gif", ".tif", ".webp", ".bmp", ".tiff"];
  const allowedVideoFormats = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

  if (![...allowedImageFormats, ...allowedVideoFormats].includes(ext)) {
    return cb(new Error("Invalid file type. Only images and videos are allowed."), false);
  }

  cb(null, true);
};

const fileUpload = multer({ storage, fileFilter });

export default fileUpload;
