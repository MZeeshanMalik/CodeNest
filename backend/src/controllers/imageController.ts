import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import AppError from "../utils/AppError";
// import catchAsync from "../utils/catchAsync";
// const catchAsync = require("../utils/catchAsync");
import catchAsync from "../utils/catchAsync";
// Compress image middleware
export const compressImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    try {
      const compressedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800 }) // Resize if needed
        .jpeg({ quality: 30 }) // Adjust quality (60% for compression)
        .toBuffer();

      // Save the compressed image
      const fileName = `${Date.now()}-image.jpg`;
      const filePath = path.join(__dirname, "../uploads", fileName);
      fs.writeFileSync(filePath, compressedBuffer);

      // Add filePath and fileName to request object
      req.file.path = filePath;
      req.file.filename = fileName;

      next();
    } catch (error) {
      next(new AppError("Failed to compress image", 500));
    }
  }
);

// Upload image
export const uploadImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new AppError("No image file uploaded", 400));
    }

    // Return the image URL
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({
      status: "success",
      message: "Image uploaded successfully",
      imageUrl,
    });
  }
);

// Delete image
export const deleteImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const fileName = req.params.fileName;

    const filePath = path.join(__dirname, "../uploads", fileName);
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return next(new AppError("Image not found", 404));
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        return next(new AppError("Failed to delete image", 500));
      }
      res.status(200).json({
        status: "success",
        message: "Image deleted successfully",
      });
    });
  }
);

// Get all images
export const getAllImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const uploadsDir = path.join(__dirname, "../uploads");

    // Read all files in the uploads directory
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        return next(new AppError("Failed to read uploads directory", 500));
      }

      // Construct image URLs
      const imageUrls = files.map(
        (file) => `${req.protocol}://${req.get("host")}/uploads/${file}`
      );

      res.status(200).json({
        status: "success",
        results: imageUrls.length,
        images: imageUrls,
      });
    });
  }
);
