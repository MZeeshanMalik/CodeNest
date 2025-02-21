// const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Stores HTML content including code blocks
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String }], // Array of image URLs
  tags: [{ type: String }], // Array of tags for categorization
  votes: { type: Number, default: 0 }, // Upvotes/downvotes
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], // References Answer model
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", QuestionSchema);
