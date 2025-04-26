import { Response, NextFunction } from "express";
// import Post from '../models/postModel';
// const catchAsync = require("../utils/catchAsync");
import catchAsync from "../utils/catchAsync";

import { Post } from "../models/blogModel";
import { RequestWithUser } from "./authenticationController";

// Create Post
export const createPost = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { title, content, tags, featuredImage } = req.body;
    const author = req.user._id;

    const post = await Post.create({
      title,
      content,
      tags,
      featuredImage,
      author,
    });

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: {
        post,
      },
    });
  }
);

// Update Post
export const updatePost = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { title, content, tags, featuredImage } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      { title, content, tags, featuredImage },
      { new: true, runValidators: true }
    );

    if (!post) {
      return next(new Error("Post not found or unauthorized"));
    }

    res.json({
      status: "success",
      message: "Post updated successfully",
      data: {
        post,
      },
    });
  }
);

// Delete Post
export const deletePost = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findOneAndDelete({
      _id: postId,
      author: userId,
    });

    if (!post) {
      return next(new Error("Post not found or unauthorized"));
    }

    res.json({
      status: "success",
      message: "Post deleted successfully",
      data: null,
    });
  }
);

// Get Single Post
export const getPost = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate("author", "name email")
      .populate("comments.author", "name");

    if (!post) {
      return next(new Error("Post not found"));
    }

    res.json({
      status: "success",
      data: {
        post,
      },
    });
  }
);

// Get All Posts
export const getAllPosts = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author", "name email");

    const totalPosts = await Post.countDocuments();

    res.json({
      status: "success",
      results: posts.length,
      total: totalPosts,
      data: {
        posts,
      },
    });
  }
);

// Increment post views
export const incrementPostViews = async (postId: string) => {
  return Post.findByIdAndUpdate(
    postId,
    { $inc: { "meta.views": 1 } },
    { new: true }
  ).lean();
};

// Toggle post like
export const togglePostLike = async (postId: string, userId: string) => {
  return Post.findOneAndUpdate(
    { _id: postId },
    [
      {
        $set: {
          "meta.likes": {
            $cond: [
              { $in: [userId, "$meta.likes"] },
              { $setDifference: ["$meta.likes", [userId]] },
              { $concatArrays: ["$meta.likes", [userId]] },
            ],
          },
        },
      },
    ],
    { new: true }
  ).lean();
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  incrementPostViews,
  togglePostLike,
};
