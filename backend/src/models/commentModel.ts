import { model, Schema } from "mongoose";

export interface IComment {
  _id?: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  content: string;
  likes: Schema.Types.ObjectId[];
  replies: IComment[];
  createdAt: Date;
}

const commentSchemaDefinition = {
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
};

export const commentSchema = new Schema<IComment>(commentSchemaDefinition);

export const Comment = model<IComment>("Comment", commentSchema);
