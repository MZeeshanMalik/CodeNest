// const contentDisposition = require("content-disposition");
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { AppErrorTypes } from "../utils/types/AppErrorTypes";
// handle cast error
const handleCastErrorDB = (err: AppErrorTypes) => {
  const message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
// handle duplicate field error
const handleDuplicateFieldDb = (err: AppErrorTypes) => {
  const val = Object.values(err.keyValue)[0];
  // console.log(val)
  const message = `Duplicate value in field: ${val}`;
  return new AppError(message, 400);
};
// handle validation error
const handleValidationErrorDB = (err: AppErrorTypes) => {
  const errors = err.errors
    ? Object.values(err.errors).map((el) => el.message)
    : [];
  const message = errors.join("/n/");
  return new AppError(message, 400);
};

const handlejwtError = (err: AppErrorTypes) => {
  const message = "json web token is not correct";
  return new AppError(message, 401);
};

// send error for development
const sendErrorDev = (err: AppErrorTypes, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    res.status(err.statusCode).render("error", {
      title: "something went wrong",
      msg: err.message,
    });
  }
};

// Handle production error
const sendErrorPro = (err: AppErrorTypes, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      // stack: err.stack,
      error: err,
    });
    // opreational trusted errors send message to clint
    if (err.isOpreational) {
      res.status(err.statusCode).render("error", {
        title: "something went wrong",
        msg: err.message,
      });
    }
    // programming errors not want to leak details of error
    else {
      // console.error(err)
      res.status(err.statusCode).render("error", {
        title: "something went wrong",
        msg: "please try again later",
      });
    }
  }
};

interface ErrorRequestHandler {
  (err: AppErrorTypes, req: Request, res: Response, next: NextFunction): void;
}

// Error handler middleware
const globalErrorHandler: ErrorRequestHandler = (
  err: AppErrorTypes,
  req,
  res,
  next
) => {
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.Node_ENV === "devolpment") {
    sendErrorDev(err, req, res);
  } else if (process.env.Node_ENV === "production") {
    let error: AppErrorTypes = { ...err };
    console.log("Name of error is", error.name);
    error.message = err.message;
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDb(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handlejwtError(error);

    sendErrorPro(error, req, res);
  }
  next();
};

module.exports = globalErrorHandler;
