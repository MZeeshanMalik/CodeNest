import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../utils/types";
import slugify from "slugify";
import AppError from "../utils/AppError";
import path from "path";
// import { fstat } from "fs";
import fs from "fs";

const Question = require("../models/questionModel");
const catchAsync = require("../utils/catchAsync");

//create a question
export const postQuestion = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, content, codeBlocks, tags } = req.body;
    // if (!req.user || !req.user.id) {
    // console.log(req);

    if (!res.locals.user) {
      return next(
        new AppError("Please login or signup fist to post a question", 401)
      );
    }
    if (!title || !content || !tags) {
      return next(new AppError("please send title content and tags", 400));
    }

    // Extract image paths from req.files
    let images: string[] = [];
    if (req.files) {
      // Save the compressed image
      (req.files as Express.Multer.File[]).forEach((file) => {
        const fileName = `${Date.now()}-questoin_image.jpg`;
        const filePath = path.join(
          __dirname,
          "../uploads/questionIMages",
          fileName
        );
        fs.writeFileSync(filePath, file.buffer);
        images.push(filePath);
      });
    }
    const question = await Question.create({
      title,
      content,
      codeBlocks,
      user: res.locals.user._id,
      images,
      tags,
    });

    return res.status(201).json({
      status: "success",
      data: question,
    });
  }
);

// get question by id or slug
export const getQuestion = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { query } = req.params;

    // Check if query is a valid ObjectId (ID search)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
    const searchQuery = isObjectId ? { _id: query } : { slug: query };

    const question = await Question.findOne(searchQuery);

    if (!question) {
      return res
        .status(404)
        .json({ status: "fail", message: "Question not found" });
    }

    return res.status(200).json({ status: "success", data: question });
  }
);

// 🔴 DELETE a Question
export const deleteQuestion = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { query } = req.params;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
    const searchQuery = isObjectId ? { _id: query } : { slug: query };

    const question = await Question.findOne(searchQuery);

    if (!question) {
      return res
        .status(404)
        .json({ status: "fail", message: "Question not found" });
    }

    if (question.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ status: "fail", message: "Not authorized" });
    }

    await Question.findByIdAndDelete(question._id);

    return res.status(200).json({
      status: "success",
      message: "Question deleted successfully",
    });
  }
);

// 🟡 UPDATE a Question
export const updateQuestion = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { query } = req.params;
    const { title, content, codeBlocks, images, tags } = req.body;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
    const searchQuery = isObjectId ? { _id: query } : { slug: query };

    const question = await Question.findOne(searchQuery);

    if (!question) {
      return res
        .status(404)
        .json({ status: "fail", message: "Question not found" });
    }

    if (question.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ status: "fail", message: "Not authorized" });
    }

    question.title = title || question.title;
    question.content = content || question.content;
    question.codeBlocks = codeBlocks || question.codeBlocks;
    question.images = images || question.images;
    question.tags = tags || question.tags;

    if (title) {
      question.slug = slugify(title, { lower: true }) + "-" + question._id;
    }

    await question.save();

    return res.status(200).json({
      status: "success",
      data: question,
    });
  }
);
