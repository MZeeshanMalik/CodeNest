import express from "express";
import multer from "multer";
import {
  compressImage,
  uploadImage,
  deleteImage,
  getAllImages,
} from "../controllers/imageController";
import AppError from "../utils/AppError";

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Upload image route
router.post(
  "/upload",
  upload.single("image"), // Handle single file upload
  compressImage, // Compress the uploaded image
  uploadImage // Save and return the image URL
);

// Delete image route
router.delete("/delete-image/:fileName", deleteImage);

// Get all images route
router.get("/", getAllImages);

// export default router;
module.exports = router;
