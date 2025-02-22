import express, { Request, Response } from "express";
const app = express();
// import {globalErrorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
const cors = require("cors");
const globalErrorHandler = require("./middlewares/errorHandler");
// import userRouter from "./router/userRoutes";
const userRouter = require("./router/userRoutes.ts");
const contactRouter = require("./router/contactRoutes");
const blogRouter = require("./router/blogRoute");
const commentRouter = require("./router/commentRoute");
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3001", // Change this to your frontend URL
    credentials: true, // Allows cookies to be sent
  })
);
// body parser raeding data from body in req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/comment", commentRouter);

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
