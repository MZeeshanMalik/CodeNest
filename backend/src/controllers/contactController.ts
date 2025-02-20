import { Request, Response, NextFunction } from "express";
import Contact from "../models/contactModel";
import { stat } from "fs";

// import catchAsync from '../utils/catchAsync'
const catchAsync = require("../utils/catchAsync");

export const postContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, message } = req.body;

    await Contact.create({ name, email, message });
    return res.json({
      status: "success",
      message: "Your query has been submitted.You will be contacted soon.",
    });
  }
);
