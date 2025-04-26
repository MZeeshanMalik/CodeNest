import mongoose, { Document } from "mongoose";

interface IReport {
  user: mongoose.Types.ObjectId;
  reason: string;
  createdAt: Date;
}

interface IAnswer extends Document {
  content: string;
  user: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
  reports: IReport[];
}

const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  }, // Link to Question
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Answered by
  content: { type: String, required: true }, // Stores HTML content including code blocks
  codeBlocks: { type: String, default: "" },
  images: [{ type: String }], // Array of image URLs
  votes: { type: Number, default: 0 }, // Upvotes/downvotes
  createdAt: {
    type: Date,
    default: () => new Date(),
    required: true,
  },
  updatedAt: { type: Date, default: Date.now },
  reports: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      reason: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Answer = mongoose.model<IAnswer>("Answer", AnswerSchema);
export default Answer;
