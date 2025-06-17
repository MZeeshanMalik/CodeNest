import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
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

// Serve images from questionImages folder
router.get("/questionImages/:filename", (req: Request, res: Response): void => {
  const filename: string = req.params.filename;
  let imagePath: string = path.join(
    __dirname,
    "../uploads/questionImages",
    filename
  );

  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.log(`Image not found: ${imagePath}`);

    // Try alternative path
    const altPath: string = path.join(
      process.cwd(),
      "src/uploads/questionImages",
      filename
    );
    console.log(`Trying alternative path: ${altPath}`);

    if (fs.existsSync(altPath)) {
      console.log(`Image found at alternative path: ${altPath}`);
      imagePath = altPath;
    } else {
      // No image found
      res.status(404).send("Image not found");
      return;
    }
  }

  // Determine MIME type based on file extension
  const ext: string = path.extname(filename).toLowerCase();
  let contentType: string = "image/jpeg";

  if (ext === ".png") contentType = "image/png";
  if (ext === ".gif") contentType = "image/gif";
  if (ext === ".webp") contentType = "image/webp";

  res.setHeader("Content-Type", contentType);

  // Stream the file to the response
  const fileStream: fs.ReadStream = fs.createReadStream(imagePath);
  fileStream.pipe(res);
});

// Upload image route
router.post("/upload", upload.single("image"), compressImage, uploadImage);

// Delete image route
router.delete("/delete-image/:fileName", deleteImage);

// Get all images route
router.get("/", getAllImages);

// Export router using ES modules
export default router;
