import express, { Request, Response } from "express";
const app = express();
// import {globalErrorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import fs from "fs";
const { globalErrorHandler } = require("./middlewares/errorHandler");
// import userRouter from "./router/userRoutes";
const userRouter = require("./router/userRoutes");
const contactRouter = require("./router/contactRoutes");
const blogRouter = require("./router/blogRoute");
const commentRouter = require("./router/commentRoute");
const questionRouter = require("./router/questionRoute");
const voteRouter = require("./router/voteRoute");
const reportRouter = require("./router/reportRoute");
import imageRoutes from "./router/ImageRoutes";
// import { isLoggedIn } from "./controllers/authenticationController";
const authController = require("./controllers/authenticationController");
const answerRouter = require("./router/AnswerRoute");

app.use((req, res, next) => {
  const start = Date.now();

  console.log("➡️ Request:", req.method, req.originalUrl);
  console.log("Body:", req.body);

  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - start;
    console.log("⬅️ Response:", res.statusCode, "in", duration + "ms");
    console.log("Body:", body);
    return originalSend.call(this, body);
  };

  next();
});

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
app.use(cookieParser());
app.use(authController.isLoggedIn);
// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure directories exist
const questionImagesDir = path.join(__dirname, "uploads", "questionImages");
if (!fs.existsSync(questionImagesDir)) {
  fs.mkdirSync(questionImagesDir, { recursive: true });
  console.log(`Created directory: ${questionImagesDir}`);
}

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

app.use(express.json());

// app.use("/api/v1/users", (req: Request, res: Response, next) => {
//   res.json({
//     message: "Welcome to the users api",
//   });
// });
// app.use("/", (req: Request, res: Response, next) => {
//   res.json({ message: "Welcome to the API!" });
//   next();
// });

app.all("*", (req: Request, res: Response, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(globalErrorHandler);

// emodule.exports = app;
export default app;
