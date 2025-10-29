import express, { Request, Response } from "express";
const app = express();
// import {globalErrorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import fs from "fs";
import { globalErrorHandler } from "./middlewares/errorHandler";
// import userRouter from "./router/userRoutes";
const userRouter = require("./router/userRoutes");
const contactRouter = require("./router/contactRoutes");
const blogRouter = require("./router/blogRoute");
const commentRouter = require("./router/commentRoute");
const questionRouter = require("./router/questionRoute");
const voteRouter = require("./router/voteRoute");
const reportRouter = require("./router/reportRoute");
import imageRoutes from "./router/ImageRoutes";
import AppError from "./utils/AppError";
// import { isLoggedIn } from "./controllers/authenticationController";
const authController = require("./controllers/authenticationController");
const answerRouter = require("./router/AnswerRoute");
console.log("🌍 Environment:", process.env.NODE_ENV);
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://code-nest-ruby.vercel.app"
        : "http://localhost:3001", // Change this to your frontend URL
    // "http://localhost:3001",
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

app.use((req, res, next) => {
  console.log("=".repeat(50));
  console.log(`${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("=".repeat(50));
  next();
});
app.use(authController.isLoggedIn);
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  console.log("📥 Origin:", req.headers.origin);
  console.log("📥 Content-Type:", req.headers["content-type"]);
  if (req.method === "POST") {
    console.log("📥 Body:", req.body);
  }
  next();
});
// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure directories exist
const questionImagesDir = path.join(__dirname, "uploads", "questionImages");
if (!fs.existsSync(questionImagesDir)) {
  fs.mkdirSync(questionImagesDir, { recursive: true });
  console.log(`Created directory: ${questionImagesDir}`);
}
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

// emodule.exports = app;
export default app;
