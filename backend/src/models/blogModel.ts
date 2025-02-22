import { model, Schema } from "mongoose";
import { commentSchema, IComment } from "./commentModel";

interface Blog {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  tags: string[];
  comments: IComment[];
  featuredImage?: string;
  meta: {
    views: number;
    likes: Schema.Types.ObjectId[];
  };
}
const blogSchema = new Schema<Blog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
    comments: [commentSchema],
    featuredImage: String,
    meta: {
      views: { type: Number, default: 0 },
      likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true }
);

// Add indexes for optimized queries
blogSchema.index({ title: "text", tags: "text" });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ "meta.views": -1 });

export const Post = model<Blog>("Post", blogSchema);
