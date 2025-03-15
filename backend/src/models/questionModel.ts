const mongoose = require("mongoose");
import { NextFunction } from "express";
import slugify from "slugify";
const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Stores HTML content including code blocks
  codeBloacks: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String }], // Array of image URLs
  tags: [{ type: String }], // Array of tags for categorization
  votes: { type: Number, default: 0 }, // Upvotes/downvotes
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], // References Answer model
  slug: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// Generate slug before saving
QuestionSchema.pre("save", function (this: any, next: NextFunction) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true }) + "-" + this._id;
  }
  next();
});

module.exports = mongoose.model("Question", QuestionSchema);
