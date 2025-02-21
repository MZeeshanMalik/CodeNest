const mongoose = require("mongoose");
const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  }, // Link to Question
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Answered by
  content: { type: String, required: true }, // Stores HTML content including code blocks
  images: [{ type: String }], // Array of image URLs
  votes: { type: Number, default: 0 }, // Upvotes/downvotes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Answer", AnswerSchema);
