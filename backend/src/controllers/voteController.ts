// import { Request, Response, NextFunction } from "express";
// import { AuthenticatedRequest } from "../utils/types";
// import Vote from "../models/voteModel";
// import Question from "../models/questionModel";
// import Answer from "../models/answerModel";
// import catchAsync from "../utils/catchAsync";
// import AppError from "../utils/AppError";

// export const vote = catchAsync(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const { targetType, targetId, value } = req.body;
//     const userId = req.user?._id;

//     if (!userId) {
//       return next(new AppError("Please login to vote", 401));
//     }

//     // Validate target type and value
//     if (!["question", "answer"].includes(targetType)) {
//       return next(new AppError("Invalid target type", 400));
//     }

//     if (![1, -1].includes(value)) {
//       return next(new AppError("Invalid vote value", 400));
//     }

//     // Check if target exists
//     let target;
//     if (targetType === "question") {
//       target = await Question.findById(targetId);
//     } else {
//       target = await Answer.findById(targetId);
//     }

//     if (!target) {
//       return next(new AppError(`${targetType} not found`, 404));
//     }

//     // Check if user is trying to vote on their own content
//     if (target.user.toString() === userId.toString()) {
//       return next(new AppError("You cannot vote on your own content", 400));
//     }

//     // Find existing vote
//     const existingVote = await Vote.findOne({
//       user: userId,
//       targetType,
//       targetId,
//     });

//     let vote;
//     if (existingVote) {
//       // If vote exists and is the same value, remove it
//       if (existingVote.value === value) {
//         await Vote.findByIdAndDelete(existingVote._id);
//         // Update target vote count
//         if (targetType === "question") {
//           await Question.findByIdAndUpdate(targetId, {
//             $inc: { votes: -value },
//           });
//         } else {
//           await Answer.findByIdAndUpdate(targetId, {
//             $inc: { votes: -value },
//           });
//         }
//         return res.status(200).json({
//           status: "success",
//           message: "Vote removed",
//           data: null,
//         });
//       } else {
//         // If vote exists with different value, update it
//         existingVote.value = value;
//         await existingVote.save();
//         // Update target vote count (remove old vote, add new vote)
//         if (targetType === "question") {
//           await Question.findByIdAndUpdate(targetId, {
//             $inc: { votes: value * 2 }, // Double the change since we're reversing the vote
//           });
//         } else {
//           await Answer.findByIdAndUpdate(targetId, {
//             $inc: { votes: value * 2 },
//           });
//         }
//         vote = existingVote;
//       }
//     } else {
//       // Create new vote
//       vote = await Vote.create({
//         user: userId,
//         targetType,
//         targetId,
//         value,
//       });

//       // Update target vote count
//       if (targetType === "question") {
//         await Question.findByIdAndUpdate(targetId, {
//           $inc: { votes: value },
//         });
//       } else {
//         await Answer.findByIdAndUpdate(targetId, {
//           $inc: { votes: value },
//         });
//       }
//     }

//     res.status(200).json({
//       status: "success",
//       data: vote,
//     });
//   }
// );

// export const getUserVote = catchAsync(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const { targetType, targetId } = req.params;
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(200).json({
//         status: "success",
//         data: null,
//       });
//     }

//     const vote = await Vote.findOne({
//       user: userId,
//       targetType,
//       targetId,
//     });

//     res.status(200).json({
//       status: "success",
//       data: vote,
//     });
//   }
// );

import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../utils/types";
import mongoose from "mongoose";
import Vote from "../models/voteModel";
import Question from "../models/questionModel";
import Answer from "../models/answerModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

// Map target type to respective Mongoose model
const targetModels: Record<string, mongoose.Model<any>> = {
  question: Question,
  answer: Answer,
};

// export const vote = catchAsync(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const { targetType, targetId, value } = req.body;
//     const userId = req.user?._id;

//     // User must be authenticated
//     if (!userId) {
//       return next(new AppError("Please log in to vote", 401));
//     }

//     // Validate targetType and vote value
//     if (!["question", "answer"].includes(targetType)) {
//       return next(new AppError("Invalid target type", 400));
//     }
//     const voteValue = Number(value);
//     if (![1, -1].includes(voteValue)) {
//       return next(new AppError("Invalid vote value", 400));
//     }

//     const Model = targetModels[targetType];
//     if (!Model) {
//       return next(new AppError("Invalid target type", 400));
//     }

//     // Start transaction to avoid race conditions
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Check target exists
//       const target = await Model.findById(targetId).session(session);
//       if (!target) {
//         throw new AppError(`${targetType} not found`, 404);
//       }

//       // Prevent voting on own content
//       if (target.user.toString() === userId.toString()) {
//         throw new AppError("You cannot vote on your own content", 400);
//       }

//       // Find existing vote
//       const existingVote = await Vote.findOne(
//         { user: userId, targetType, targetId },
//         null,
//         { session }
//       );

//       let responseMessage = "";
//       if (existingVote) {
//         if (existingVote.value === voteValue) {
//           // Remove vote
//           await existingVote.({ session });
//           await Model.findByIdAndUpdate(
//             targetId,
//             { $inc: { votes: -voteValue } },
//             { session }
//           );
//           responseMessage = "Vote removed";
//         } else {
//           // Change vote
//           existingVote.value = voteValue as 1 | -1;
//           await existingVote.save({ session });
//           await Model.findByIdAndUpdate(
//             targetId,
//             { $inc: { votes: voteValue * 2 } },
//             { session }
//           );
//           responseMessage = "Vote updated";
//         }
//       } else {
//         // Create new vote
//         await Vote.create(
//           [
//             {
//               user: userId,
//               targetType,
//               targetId,
//               value: voteValue,
//             },
//           ],
//           { session }
//         );
//         await Model.findByIdAndUpdate(
//           targetId,
//           { $inc: { votes: voteValue } },
//           { session }
//         );
//         responseMessage = "Vote added";
//       }

//       await session.commitTransaction();
//       session.endSession();

//       return res.status(200).json({
//         status: "success",
//         message: responseMessage,
//       });
//     } catch (err) {
//       await session.abortTransaction();
//       session.endSession();
//       return next(err);
//     }
//   }
// );

export const vote = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { targetType, targetId, value } = req.body;
    const userId = req.user?._id;

    // Ensure user is authenticated
    if (!userId) {
      return next(new AppError("Please log in to vote", 401));
    }

    // Validate targetType
    if (!["question", "answer"].includes(targetType)) {
      return next(new AppError("Invalid target type", 400));
    }

    // Parse and validate vote value
    const voteValue = Number(value);
    if (![1, -1].includes(voteValue)) {
      return next(new AppError("Invalid vote value", 400));
    }

    const Model = targetModels[targetType];

    // Check that target exists
    const target = await Model.findById(targetId);
    if (!target) {
      return next(new AppError(`${targetType} not found`, 404));
    }

    // Prevent voting on own content
    if (target.user.toString() === userId.toString()) {
      return next(new AppError("You cannot vote on your own content", 400));
    }

    // Look for an existing vote
    const existingVote = await Vote.findOne({
      user: userId,
      targetType,
      targetId,
    });
    let responseMessage: string;

    if (existingVote) {
      // If same vote, remove it
      if (existingVote.value === voteValue) {
        await existingVote.deleteOne();
        await Model.findByIdAndUpdate(targetId, {
          $inc: { votes: -voteValue },
        });
        responseMessage = "Vote removed";
      } else {
        // Switch vote
        await Vote.findByIdAndUpdate(existingVote._id, { value: voteValue });
        await Model.findByIdAndUpdate(targetId, {
          $inc: { votes: voteValue * 2 },
        });
        responseMessage = "Vote updated";
      }
    } else {
      // Create new vote
      await Vote.create({
        user: userId,
        targetType,
        targetId,
        value: voteValue,
      });
      await Model.findByIdAndUpdate(targetId, { $inc: { votes: voteValue } });
      responseMessage = "Vote added";
    }

    res.status(200).json({
      status: "success",
      message: responseMessage,
    });
  }
);

export const getUserVote = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { targetType, targetId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(200).json({
        status: "success",
        data: { value: null },
      });
    }

    if (!["question", "answer"].includes(targetType)) {
      return next(new AppError("Invalid target type", 400));
    }

    const vote = await Vote.findOne({
      user: userId,
      targetType,
      targetId,
    }).lean();

    res.status(200).json({
      status: "success",
      data: {
        value: vote?.value || null,
      },
    });
  }
);

// export const getUserVote = catchAsync(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const { targetType, targetId } = req.params;
//     const userId = req.user?._id;

//     if (!userId) {
//       return res.status(200).json({
//         status: "success",
//         data: null,
//       });
//     }

//     if (!["question", "answer"].includes(targetType)) {
//       return next(new AppError("Invalid target type", 400));
//     }

//     const vote = await Vote.findOne({
//       user: userId,
//       targetType,
//       targetId,
//     }).lean();

//     res.status(200).json({
//       status: "success",
//       data: vote,
//     });
//   }
// );
