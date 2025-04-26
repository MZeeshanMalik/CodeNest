import { Request, Response, NextFunction } from "express";
import Answer from "../models/answerModel";
import Question from "../models/questionModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { RequestWithUser } from "./authenticationController";
import console from "console";

// Create a new answer
export const createAnswer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestWithUser = req as RequestWithUser;
    const { content, question, codeBlocks } = requestWithUser.body;

    if (!requestWithUser.user) {
      return next(
        new AppError("You must be logged in to create an answer", 401)
      );
    }

    // Check if the question exists
    const questionDoc = await Question.findById(question);
    if (!questionDoc) {
      return next(new AppError("Question not found", 404));
    }

    const answer = await Answer.create({
      question,
      user: requestWithUser.user._id,
      content,
      codeBlocks: codeBlocks || "",
    });
    // Add the answer to the question's answers array
    questionDoc.answers.push(answer._id as any); // Type assertion to fix TypeScript error
    await questionDoc.save();

    // Populate the answer with user details
    const populatedAnswer = await Answer.findById(answer._id)
      .populate("user", "name")
      .lean();

    res.status(201).json({
      status: "success",
      data: populatedAnswer,
    });
  }
);

// Update an answer
export const updateAnswer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { answerId } = req.params;
    const { content } = req.body;
    const requestWithUser = req as RequestWithUser;

    if (!requestWithUser.user) {
      return next(
        new AppError("You must be logged in to update an answer", 401)
      );
    }

    const userId = requestWithUser.user._id;
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return next(new AppError("Answer not found", 404));
    }

    // Check if the user is the author of the answer
    if (answer.user.toString() !== userId.toString()) {
      return next(
        new AppError("You are not authorized to update this answer", 403)
      );
    }

    answer.content = content;
    answer.updatedAt = new Date();
    await answer.save();

    res.status(200).json({
      success: true,
      data: answer,
    });
  }
);

// Delete an answer
export const deleteAnswer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("deleteAnswer");
    const { answerId } = req.params;
    const requestWithUser = req as RequestWithUser;

    if (!requestWithUser.user) {
      return next(
        new AppError("You must be logged in to delete an answer", 401)
      );
    }

    const userId = requestWithUser.user._id;
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return next(new AppError("Answer not found", 404));
    }

    // Check if the user is the author of the answer
    if (answer.user.toString() !== userId.toString()) {
      return next(
        new AppError("You are not authorized to delete this answer", 403)
      );
    }

    // Remove the answer from the question's answers array
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answerId },
    });

    await answer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
    });
  }
);

// Get a single answer
export const getAnswers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const answer = await Answer.findById(req.params.id)
      .populate("user", "name photo")
      .populate("question", "title");

    if (!answer) {
      return next(new AppError("Answer not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        answer,
      },
    });
  }
);

// Get all answers for a question
export const getQuestionAnswers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate("user", "name")
      .sort("-createdAt")
      .lean();

    res.status(200).json({
      status: "success",
      results: answers.length,
      data: answers,
    });
  }
);

export const reportAnswer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestWithUser = req as RequestWithUser;
    const { answerId } = req.params;
    const { reason } = req.body;
    const userId = requestWithUser.user?._id; // Using id from User type

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return next(new AppError("Answer not found", 404));
    }

    // Check if the user has already reported this answer
    const existingReport = answer.reports.find(
      (report) => report.user.toString() === userId.toString()
    );

    if (existingReport) {
      return next(new AppError("You have already reported this answer", 400));
    }

    answer.reports.push({
      user: userId as any,
      reason,
      createdAt: new Date(),
    });

    await answer.save();

    res.status(200).json({
      success: true,
      message: "Answer reported successfully",
    });
  }
);
