import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
const { deflate, inflate } = require("fflate");
const catchAsync = require("../utils/catchAsync");

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to compress image
export const compressImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

  try {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800 }) // Resize if needed
      .jpeg({ quality: 60 }) // Adjust quality (60% for compression)
      .toBuffer();

    // Save the compressed image
    const filePath = path.join(
      __dirname,
      `uploads/${Date.now()}-compressed.jpg`
    );
    fs.writeFileSync(filePath, compressedBuffer);

    // Add filePath to request object
    req.file.path = filePath;
    next();
  } catch (error) {
    next(error);
  }
};

exports.compressData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const input = req.body.text;
    if (!input) return next(new AppError("Text is required", 400));

    // Convert input string to Uint8Array
    const encoded = new TextEncoder().encode(input);

    // Compress data
    const compressed = deflate(encoded);
    const compressedBase64 = Buffer.from(compressed).toString("base64");

    res.status(200).json({ compressed: compressedBase64 });
  }
);

exports.decompressData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const compressedBase64 = req.body.compressed;
    if (!compressedBase64)
      return next(new AppError("Compressed data is required", 400));

    // Convert Base64 to Uint8Array
    const compressedBuffer = Buffer.from(compressedBase64, "base64");

    // Decompress data
    const decompressed = inflate(compressedBuffer);
    const decompressedText = new TextDecoder().decode(decompressed);

    res.status(200).json({ decompressed: decompressedText });
  }
);
