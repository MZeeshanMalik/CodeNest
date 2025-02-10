// type catchAsync = (fn: Function) => Function;

import { NextFunction } from "express";

interface AsyncFunction {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

const catchAsync = (
  fn: AsyncFunction
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
module.exports = catchAsync;
