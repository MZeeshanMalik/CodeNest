// type catchAsync = (fn: Function) => Function;

import { NextFunction, Response, Request } from "express";
import { RequestWithUser } from "../controllers/authenticationController";
import { AuthenticatedRequest } from "../utils/types";

interface AsyncFunction<T extends Request = Request> {
  (req: T, res: Response, next: NextFunction): Promise<any>;
}

const catchAsync = <T extends Request>(
  fn: AsyncFunction<T>
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req, res, next) => {
    fn(req as T, res, next).catch(next);
  };
};

export default catchAsync;
