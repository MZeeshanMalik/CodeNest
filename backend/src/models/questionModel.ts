import mongoose, { Document } from "mongoose";
import { NextFunction } from "express";
import slugify from "slugify";

interface IQuestion extends Document {
  title: string;
  content: string;
  codeBlocks?: string;
  user: mongoose.Types.ObjectId;
  images: string[];
  tags: string[];
  votes: number;
  answers: mongoose.Types.ObjectId[];
  slug: string;
  createdAt: Date;
  author: mongoose.Types.ObjectId;
  isModified(field: string): boolean;
}

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Stores HTML content including code blocks
  codeBlocks: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String }], // Array of image URLs
  tags: [{ type: String }], // Array of tags for categorization
  votes: { type: Number, default: 0 }, // Upvotes/downvotes
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], // References Answer model
  slug: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Generate slug before saving
QuestionSchema.pre<IQuestion>("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true }) + "-" + this._id;
  }
  next();
});

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);
export default Question;
