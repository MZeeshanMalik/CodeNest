import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../utils/types";
import Report from "../models/reportModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

// Create a new report
export const createReport = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { targetType, targetId, reason } = req.body;

    if (!res.locals.user) {
      return next(
        new AppError("Please login or signup first to report content", 401)
      );
    }

    if (!targetType || !targetId || !reason) {
      return next(
        new AppError(
          "Please provide target type, target ID, and reason for reporting",
          400
        )
      );
    }

    // Check if user has already reported this content
    const existingReport = await Report.findOne({
      targetType,
      targetId,
      reportedBy: res.locals.user._id,
    });

    if (existingReport) {
      return next(new AppError("You have already reported this content", 400));
    }

    const report = await Report.create({
      targetType,
      targetId,
      reason,
      reportedBy: res.locals.user._id,
    });

    return res.status(201).json({
      status: "success",
      message: "Report submitted successfully",
      data: {
        report,
      },
    });
  }
);

// Get all reports (admin only)
export const getAllReports = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      return next(
        new AppError("You are not authorized to access this resource", 403)
      );
    }

    const { status, targetType, page = 1, limit = 10 } = req.query;
    const skipAmount = (Number(page) - 1) * Number(limit);

    const query: any = {};
    if (status) query.status = status;
    if (targetType) query.targetType = targetType;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(Number(limit))
      .populate("reportedBy", "name email")
      .populate({
        path: "targetId",
        select: "title content",
      });

    const totalReports = await Report.countDocuments(query);

    return res.status(200).json({
      status: "success",
      results: reports.length,
      data: {
        reports,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalReports / Number(limit)),
          totalReports,
        },
      },
    });
  }
);

// Update report status (admin only)
export const updateReportStatus = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!res.locals.user || !res.locals.user.isAdmin) {
      return next(
        new AppError("You are not authorized to access this resource", 403)
      );
    }

    if (!status || !["pending", "reviewed", "resolved"].includes(status)) {
      return next(
        new AppError(
          "Please provide a valid status (pending, reviewed, or resolved)",
          400
        )
      );
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return next(new AppError("No report found with that ID", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        report,
      },
    });
  }
);
