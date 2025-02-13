import { NextFunction } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [5, "minimum length should be 5"],
    // maxlength: [10, 'maximum length should be 10'],
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please provide email"],
    validate: [validator.isEmail, "please provide a valid email"],
  },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    // minlength: [8, 'minimum length should be 8'],
    maxlength: [1000, "maximum length should be 20"],
    select: false,
    required: function (this: any) {
      // Require password only if not signing up via Google
      return !this.googleId;
    },
  },
  confirmPassword: {
    type: String,
    require: [true, "confirm password is required"],
    //this works on only save
    validate: {
      validator: function (this: any, el: string): boolean {
        return el === this.password;
      },
      message: "passwords are not same",
    },
  },
  passwordChangedAt: Date,
  PasswordResetToken: String,
  PasswordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
// document middleware to hash the password before saving
userSchema.pre("save", async function (this: any, next: NextFunction) {
  // only run this password when password is modified
  if (!this.isModified("password")) return next();
  // it actually hash the password
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
// document middleware to update passwordChangedAt property
userSchema.pre(/^find/, function (this: any, next: NextFunction) {
  this.find({ active: true });
  next();
});
// middleware to compare the password with the hashed password
userSchema.methods.correctPassword = async function (
  candidatePass: string,
  userPass: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePass, userPass);
};

// middleware to check if the password is changed after the token is issued
userSchema.methods.passwordChangedAfter = function (
  this: any,
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );
    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
// middleware to create password reset token
userSchema.methods.passwordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.PasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);

// module.exports = User;
export default User;
