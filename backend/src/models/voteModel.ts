import mongoose, { Document } from "mongoose";

interface IVote extends Document {
  user: mongoose.Types.ObjectId;
  targetType: "question" | "answer";
  targetId: mongoose.Types.ObjectId;
  value: 1 | -1; // 1 for upvote, -1 for downvote
  createdAt: Date;
}

const VoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetType: {
    type: String,
    enum: ["question", "answer"],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: Number,
    enum: [1, -1],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user can only vote once on a target
VoteSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

const Vote = mongoose.model<IVote>("Vote", VoteSchema);
export default Vote;
