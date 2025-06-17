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
import { deleteRemovedFiles } from "../utils/fileManagement";

//create a question
export const postQuestion = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, content, codeBlocks } = req.body;
    const tags = JSON.parse(req.body.tags);

    if (!res.locals.user) {
      return next(
        new AppError("Please login or signup fist to post a question", 401)
      );
    }
    if (!title || !content || !tags) {
      return next(new AppError("please send title content and tags", 400));
    } // Extract image paths from req.files
    let images: string[] = [];
    if (req.files) {
      // With disk storage, files are already saved to disk
      (req.files as Express.Multer.File[]).forEach((file) => {
        // Just store the filename
        images.push(file.filename);
      });
      console.log("Saved images:", images);
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
      .populate("user", "name")
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
    const { title, content, codeBlocks } = req.body;
    let { tags, existingImages } = req.body;
    console.log(req);
    // Parse tags if it's a string (JSON)
    if (tags && typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch (error) {
        console.error("Error parsing tags:", error);
      }
    }
    // Parse existingImages if it's a string (JSON)
    if (existingImages && typeof existingImages === "string") {
      try {
        existingImages = JSON.parse(existingImages);
      } catch (error) {
        console.error("Error parsing existingImages:", error);
      }
    }

    console.log("Received update data:", {
      title,
      contentLength: content?.length,
      tags,
      existingImages,
      files: req.files ? (req.files as Express.Multer.File[]).length : 0,
    });

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
    } // Handle file uploads if there are any
    const uploadedFiles = req.files as Express.Multer.File[];
    const newImagePaths: string[] = [];

    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log(`Processing ${uploadedFiles.length} new image files`);
      for (const file of uploadedFiles) {
        if (file.filename) {
          console.log(`Adding new image: ${file.filename}`);
          newImagePaths.push(file.filename);
        } else {
          console.log(
            `Skipping file without filename:`,
            file.originalname || "unnamed file"
          );
        }
      }
      console.log(`Total new images to add: ${newImagePaths.length}`);
    }

    // Update question fields
    question.title = title || question.title;
    question.content = content || question.content;
    question.codeBlocks = codeBlocks || question.codeBlocks; // Handle images - completely replace with what the client sent    if (existingImages !== undefined) {

    // Delete removed files from server
    if (question.images && question.images.length > 0) {
      // Ensure we have arrays (defensive coding)
      const oldImages = Array.isArray(question.images) ? question.images : [];
      const newImages = Array.isArray(existingImages) ? existingImages : [];

      if (oldImages.length > newImages.length) {
        // Delete files that are no longer in the existingImages list
        try {
          const deletedFiles = await deleteRemovedFiles(
            oldImages,
            newImages,
            "questionImages"
          );
          console.log("Successfully deleted files:", deletedFiles);
        } catch (error) {
          console.error("Error deleting files:", error);
        }
      }

      // Set the images directly to what the client sent (existing images)
      question.images = existingImages;
    } else {
      console.log("No existingImages provided, keeping current images");
    } // Add any newly uploaded images
    if (newImagePaths.length > 0) {
      // Make sure question.images is always an array
      const currentImages = Array.isArray(question.images)
        ? question.images
        : [];
      question.images = [...currentImages, ...newImagePaths];
    }

    // Update tags
    if (tags) {
      question.tags = tags;
    }

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
    const { query, page = 1, limit = 10, sort = "newest", tag } = req.query;
    const searchQuery = query as string;

    // Allow empty query to retrieve all questions
    const findQuery: any = {};

    // Add tag filter if provided
    if (tag) {
      findQuery.tags = { $in: [tag] };
    }

    // Add text search if query is provided
    if (searchQuery && searchQuery.trim() !== "") {
      const searchRegex = new RegExp(searchQuery, "i");
      findQuery.$or = [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
      ];
    }

    const pageNumber = Math.max(parseInt(page as string) || 1, 1);
    const pageSize = Math.max(parseInt(limit as string) || 10, 1);
    const skip = (pageNumber - 1) * pageSize;

    try {
      // Determine sort order based on the sort parameter
      let sortOptions: any = {};

      switch (sort) {
        case "votes":
          sortOptions = { votes: -1, createdAt: -1 };
          break;
        case "answers":
          sortOptions = { "answers.length": -1, createdAt: -1 };
          break;
        case "newest":
        default:
          sortOptions = { createdAt: -1 };
      }

      // Query questions with sorting, pagination, and population
      let questions = await Question.find(findQuery)
        .populate("user", "name")
        .populate("author", "name")
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean();

      const totalQuestions = await Question.countDocuments(findQuery);

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

// get related questions with each others

export const relatedQuestions = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tags, excludeId } = req.query;
      const tagArray = (tags as string).split(",");

      let questions: any[] = await Question.find({
        tags: { $in: tagArray },
        _id: { $ne: excludeId },
      })
        .sort({ votes: -1, createdAt: -1 })
        .limit(5)
        .populate("author", "name")
        .select("title votes tags createdAt author");

      if (questions.length === 0) {
        console.log("No matching tags found, fetching recent questions");
        questions = await Question.find({
          _id: { $ne: excludeId },
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("author", "name")
          .select("title votes tags createdAt author");
      }

      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      return next(new AppError("Error fetching related questions", 500));
    }
  }
);

// get top voted questions
export const getTopVotedQuestions = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const questions = await Question.find()
        .sort({ votes: -1, createdAt: -1 })
        .limit(5)
        .populate("author", "name")
        .select("title votes tags createdAt author");

      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      console.error("Error fetching top voted questions:", error);
      return next(new AppError("Error fetching top voted questions", 500));
    }
  }
);

// get random questions
export const getRandomQuestions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 5 } = req.query;
      const questions = await Question.aggregate([
        { $sample: { size: Number(limit) } },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            title: 1,
            votes: 1,
            tags: 1,
            createdAt: 1,
            "author.name": 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      console.error("Error fetching random questions:", error);
      return next(new AppError("Error fetching random questions", 500));
    }
  }
);
