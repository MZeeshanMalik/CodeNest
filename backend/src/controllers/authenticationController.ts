import { promisify } from "util";
// const User = require("../Models/userModel");
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
// const AppError = require("../utils/AppError");
import AppError from "../utils/AppError";
// const Email = require("../utils/email");
import bcrypt from "bcryptjs";
// const crypto = require("crypto");
import crypto from "crypto";
import UserTypes from "../utils/types/UserTypes";
import { AppErrorTypes } from "../utils/types/AppErrorTypes";
import { NextFunction, Response, Request } from "express";
import passport from "passport";
import { sendForgotPasswordEmail } from "../utils/email";

export interface RequestWithUser extends Request {
  user: UserTypes;
}

interface JwtPayload {
  id: string;
  iat: number;
}

export const signtok = (id: string) => {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined");
  }
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

// signin token and sending to clint

const createSendToken = function (
  user: UserTypes,
  statusCode: number,
  res: Response
) {
  const token = signtok(user._id);
  const cookieOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
    sameSite?: "none" | "lax" | "strict";
    // sameSite?: "none";
  } = {
    expires: new Date(
      Date.now() +
        (Number(process.env.JWT_COOKIESEXPIRES) || 0) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // Secure in production
    secure: true, // Secure in production
    sameSite: "none",
  };
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.role = undefined;
  user.active = undefined;
  res.status(statusCode).json({
    status: "sucess",
    token,
    data: user,
  });
};

export const signupWithGoogle = (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { user, token } = req.user;
  const frontendURL = process.env.FRONTEND_URL; // Update with your frontend URL

  // Set JWT token as a cookie
  const cookieOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
    sameSite?: "none" | "lax" | "strict";
  } = {
    expires: new Date(
      Date.now() +
        (Number(process.env.JWT_COOKIESEXPIRES) || 0) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  res.cookie("jwt", token, cookieOptions);
  // Redirect to frontend with token in query params
  res.redirect(
    `${frontendURL}/?token=${token}&user=${encodeURIComponent(
      JSON.stringify(user)
    )}`
  );
};
// 2. signup with github
exports.signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      photo: req.body.photo,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,
    });

    // await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 200, res);
  }
);

exports.login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // checking email and passwors
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    //checking if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Email or Password is not correct", 401));
    }

    //if everything is ok send token
    createSendToken(user, 200, res);
  }
);

exports.logout = (req: Request, res: Response) => {
  res.cookie("jwt", "Logged out", {
    expires: new Date(Date.now() + 10 * 100),
    httpOnly: true,
  });
  res.status(200).json({
    status: "sucess",
  });
};

// Protect middleware
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    if (!process.env.SECRET_KEY) {
      return next(new AppError("Server configuration error", 500));
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    (req as RequestWithUser).user = currentUser;
    next();
  }
);

// only for checking if user is loggged in

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.jwt) {
    try {
      if (!process.env.SECRET_KEY) {
        return next();
      }

      const decoded = jwt.verify(
        req.cookies.jwt,
        process.env.SECRET_KEY
      ) as JwtPayload;

      // Check if user still exists
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }

      // Check if user changed password after token was issued
      if (freshUser.passwordChangedAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user
      res.locals.user = freshUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

interface RestrictToFunction {
  (req: RequestWithUser, res: Response, next: NextFunction): void;
}

exports.restrictTo = (...roles: string[]): RestrictToFunction => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    // roles = [admin, lead-guide]
    if (!roles.includes(req?.user?.role || "")) {
      return next(
        new AppError("you are not allowed to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("user with this email does not exists", 404));
    }
    // Genrate random token
    const resetToken = user.passwordResetToken();
    await user.save({ validateBeforeSave: false });

    //send to users email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/?resetToken=${resetToken}`;
    try {
      await sendForgotPasswordEmail(user.email, resetUrl);
      res.status(200).json({
        status: "sucess",
        message: "token send to email",
      });
    } catch (err) {
      (user.passwordResetToken = undefined),
        (user.PasswordResetExpires = undefined),
        await user.save({ validateBeforeSave: false });
      console.log(err);

      return next(new AppError("there was an error in sending email", 500));
    }
  }
);

exports.resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get user based on token
    const resetToken = req.query.resetToken as string;
    if (!resetToken) {
      return next(new AppError("Invalid or missing reset token", 400));
    }
    const hashedtoken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const user = await User.findOne({ PasswordResetToken: hashedtoken });
    const user2 = await User.findOne({
      PasswordResetExpires: { $gt: Date.now() },
    });
    //if tokekn is not expired adn there is user set the passwoed
    if (!user || !user2) {
      return next(
        new AppError(
          "Resst Token has expired or malformed.Please request another token.",
          400
        )
      );
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.PasswordResetToken = undefined;
    user.PasswordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    //update changepassword for user

    // log user in and send jwt
    createSendToken(user, 200, res);
  }
);

// Update password
export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestWithUser = req as RequestWithUser;
    if (!requestWithUser.user) {
      return next(
        new AppError("You must be logged in to update password", 401)
      );
    }

    // 1) Get user from collection
    const user = await User.findById(requestWithUser.user._id).select(
      "+password"
    );
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // 2) Check if posted current password is correct
    if (
      !(await user.correctPassword(
        requestWithUser.body.password,
        user.password
      ))
    ) {
      return next(new AppError("You entered wrong password", 401));
    }

    // 3) Check if new password matches confirm password
    if (
      requestWithUser.body.updatePassword !==
      requestWithUser.body.confirmUpdatePassword
    ) {
      return next(
        new AppError("Password and confirm password do not match", 400)
      );
    }

    // 4) Update password
    user.password = requestWithUser.body.updatePassword;
    user.confirmPassword = requestWithUser.body.confirmUpdatePassword;
    await user.save();

    // 5) Log user in, send JWT
    createSendToken(user, 200, res);
  }
);

// module.exports = exports;
