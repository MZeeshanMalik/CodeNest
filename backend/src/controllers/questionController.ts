import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../utils/types";
import slugify from "slugify";
import AppError from "../utils/AppError";
import path from "path";
// import { fstat } from "fs";
import fs from "fs";
import Question from "../models/questionModel";
import catchAsync from "../utils/catchAsync";
import Answer from "../models/answerModel";

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
    console.log(req.query);
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(parseInt(page as string) || 1, 1);
    const pageSize = Math.max(parseInt(limit as string) || 10, 1);

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

    // Find the question
    const question = await Question.findOne(
      isObjectId ? { _id: query } : { slug: query }
    )
      .populate("author", "name")
      .lean();

    if (!question) {
      return res
        .status(404)
        .json({ status: "fail", message: "Question not found" });
    }

    // Get answers with pagination
    const answers = await Answer.find({ question: question._id })
      .populate("user", "name")
      .sort("-createdAt")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const totalAnswers = await Answer.countDocuments({
      question: question._id,
    });

    res.status(200).json({
      status: "success",
      data: {
        ...question,
        answers,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalAnswers / pageSize),
          totalAnswers,
          hasNextPage: pageNumber * pageSize < totalAnswers,
          hasPrevPage: pageNumber > 1,
        },
      },
    });
  }
);

// export const getQuestion = catchAsync(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const { query } = req.params;
//     console.log(query);

//     // Check if query is a valid ObjectId (ID search)
//     const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
//     const searchQuery = isObjectId ? { _id: query } : { slug: query };

//     const question = await Question.findOne(searchQuery);

//     if (!question) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Question not found" });
//     }

//     return res.status(200).json({ status: "success", data: question });
//   }
// );

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

// Search questions
export const searchQuestions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("i am in serach function");
    const { query, page = 1, limit = 10 } = req.query;
    const searchQuery = query as string;

    console.log("Search query received:", searchQuery); // Debug log

    if (!searchQuery) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a search query",
      });
    }

    const pageNumber = Math.max(parseInt(page as string) || 1, 1);
    const pageSize = Math.max(parseInt(limit as string) || 10, 1);
    const skip = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regex for the search query
    const searchRegex = new RegExp(searchQuery, "i");
    console.log("Search regex:", searchRegex); // Debug log

    try {
      // First, search in titles
      const titleQuery = { title: { $regex: searchRegex } };
      console.log("Title search query:", JSON.stringify(titleQuery)); // Debug log

      let questions = await Question.find(titleQuery)
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();

      console.log("Questions found in title search:", questions.length); // Debug log

      let totalQuestions = await Question.countDocuments(titleQuery);
      console.log("Total questions in title search:", totalQuestions); // Debug log

      // If no results found in titles, search in content
      if (questions.length === 0) {
        console.log("No results in title, searching in content..."); // Debug log
        const contentQuery = { content: { $regex: searchRegex } };
        console.log("Content search query:", JSON.stringify(contentQuery)); // Debug log

        questions = await Question.find(contentQuery)
          .populate("user", "name")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize)
          .lean();

        console.log("Questions found in content search:", questions.length); // Debug log

        totalQuestions = await Question.countDocuments(contentQuery);
        console.log("Total questions in content search:", totalQuestions); // Debug log
      }

      res.status(200).json({
        status: "success",
        data: {
          questions,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(totalQuestions / pageSize),
            totalQuestions,
            hasNextPage: pageNumber * pageSize < totalQuestions,
            hasPrevPage: pageNumber > 1,
          },
        },
      });
    } catch (error) {
      console.error("Search error:", error); // Debug log
      return next(error);
    }
  }
);
