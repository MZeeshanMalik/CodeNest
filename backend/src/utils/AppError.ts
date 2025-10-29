import { AppErrorTypes } from "./types/AppErrorTypes";

class AppError extends Error implements AppErrorTypes {
  statusCode: number;
  status: string;
  isOpreational: boolean;
  errors?: Array<any>;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOpreational = true;
    console.log(statusCode, this.isOpreational, message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
