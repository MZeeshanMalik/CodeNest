import express, { Request, Response } from "express";
const app = express();
// import {globalErrorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/errorHandler";
const userRouter = require("./router/userRoutes");
const contactRouter = require("./router/contactRoutes");
const blogRouter = require("./router/blogRoute");
const commentRouter = require("./router/commentRoute");
const questionRouter = require("./router/questionRoute");
const voteRouter = require("./router/voteRoute");
const reportRouter = require("./router/reportRoute");
import imageRoutes from "./router/ImageRoutes";
import AppError from "./utils/AppError";
const authController = require("./controllers/authenticationController");
const answerRouter = require("./router/AnswerRoute");
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://code-nest-ruby.vercel.app"
        : "http://localhost:3001", // Change this to your frontend URL
    credentials: true, // Allows cookies to be sent
  })
);
// body parser raeding data from body in req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(
  express.json({
    type: ["application/json", "application/x-www-form-urlencoded"],
  })
);
app.use(cookieParser());

app.use(authController.isLoggedIn);

app.options("*", cors());

console.log("this is app.ts");
app.use("/api/v1/users", userRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/question", questionRouter);
console.log("answerRouter");
app.use("/api/v1/answer", answerRouter);
app.use("/api/v1/vote", voteRouter);
app.use("/api/v1/report", reportRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(`server cannot find ${req.originalUrl} on this adress`, 404)
  );
});
app.use(globalErrorHandler);

export default app;
