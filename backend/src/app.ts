import express, { Request, Response } from "express";
const globalErrorHandler = require("./middlewares/errorHandler");
// import {globalErrorHandler} from "./middlewares/errorHandler";
const userRouter = require("./router/userRoutes.ts");
// import userRouter from "./router/userRoutes";
const app = express();

// body parser raeding data from body in req.body
app.use(express.json({ limit: "10kb" }));
app.use("/api/v1/users", userRouter);

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
app.use("/", (req: Request, res: Response, next) => {
  res.json({ message: "Welcome to the API!" });
  next();
});
app.all("*", (req: Request, res: Response, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});

app.use(globalErrorHandler);

// emodule.exports = app;
export default app;
