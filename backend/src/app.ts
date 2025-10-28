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
// import { isLoggedIn } from "./controllers/authenticationController";
const authController = require("./controllers/authenticationController");
const answerRouter = require("./router/AnswerRoute");
import multer from "multer"
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

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads", "questionImages");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

app.use((req, res, next) => {
  console.log("=".repeat(50));
  console.log(`${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("=".repeat(50));
  next();
});
// app.use(authController.isLoggedIn);
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
