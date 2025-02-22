import { Request, Response, NextFunction } from "express";
import { Post } from "../models/blogModel";
import { RequestWithUser } from "./authenticationController";
// import Post from "../models/postModel";
// import catchAsync from '../utils/catchAsync';
const catchAsync = require("../utils/catchAsync");

// Add Comment
export const addComment = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            content,
            author: userId,
          },
        },
      },
      { new: true, runValidators: true }
    ).populate("comments.author", "name avatar");

    if (!post) {
      return next(new Error("Post not found"));
    }

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: {
        comment: newComment,
      },
    });
  }
);

// Update Comment
export const updateComment = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.author": userId,
      },
      {
        $set: { "comments.$.content": content },
      },
      { new: true, runValidators: true }
    ).populate("comments.author", "name avatar");

    if (!post) {
      return next(new Error("Comment not found or unauthorized"));
    }

    const updatedComment = post.comments.find(
      (c) => c && c._id && c._id.toString() === commentId
    );

    res.json({
      status: "success",
      message: "Comment updated successfully",
      data: {
        comment: updatedComment,
      },
    });
  }
);

// Delete Comment
export const deleteComment = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.author": userId,
      },
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true }
    );

    if (!post) {
      return next(new Error("Comment not found or unauthorized"));
    }

    res.json({
      status: "success",
      message: "Comment deleted successfully",
      data: null,
    });
  }
);

// Like/Unlike Comment
export const toggleCommentLike = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
      },
      [
        {
          $set: {
            "comments.$[comment].likes": {
              $cond: [
                { $in: [userId, "$comments.$[comment].likes"] },
                { $setDifference: ["$comments.$[comment].likes", [userId]] },
                { $concatArrays: ["$comments.$[comment].likes", [userId]] },
              ],
            },
          },
        },
      ],
      {
        arrayFilters: [{ "comment._id": commentId }],
        new: true,
      }
    ).populate("comments.author", "name avatar");

    if (!post) {
      return next(new Error("Comment not found"));
    }

    const updatedComment = post.comments.find(
      (c) => c && c._id && c._id.toString() === commentId
    );

    res.json({
      status: "success",
      message: "Comment like toggled successfully",
      data: {
        comment: updatedComment,
      },
    });
  }
);
