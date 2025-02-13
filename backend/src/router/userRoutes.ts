// import { Request, Response, NextFunction } from "express";

// import passport from "passport";
import { Request, Response } from "express";
import passport from "../config/passport-config";
// import  signup  from "../controllers/authenticationController";
const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
// const userController = require("../controller/userConteroller");
const authController = require("./../controllers/authenticationController.ts");
// import { signup } from "../controllers/authenticationController";
// import authController from "../controllers/authenticationController";
// const reviewController = require("../controller/reviewController");

// router.get("/", (req: Request, res: Response, next: NextFunction) => {
//   console.log("Inside userRoutes.ts");

//   res.json({ message: "Welcome to the API!" });
//   next();
// });
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// router.get("/auth/google/callback", authController.signupWithGoogle);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  authController.signupWithGoogle
);
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);

// router.get("/auth/google/callback", authController.signupWithGoogle);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false }),
  authController.signupWithGoogle
);
router.post("/signup", authController.signup);
// router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
//   console.log("Inside signup");
//   //   res.json({ message: "signup" });
//   signup(req, res, next);
//   next();
// });
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword?:resetToken", authController.resetPassword);
// router.patch(
//   "/updateMe",
//   userController.uploadUserPhoto,
//   userController.resizeUserPhoto,
//   authController.protect,
//   userController.updateMe
// );
// router.delete("/deleteMe", authController.protect, userController.deleteMe);
// router.route("/me").get(userController.getMe, userController.getUser);
// .post(userController.createNewuser);
router.route("/updatePassword").patch(authController.updatePassword);
// router.use(authController.protect);
// router.use(authController.restrictTo("admin"));
// router.route("/").get(userController.getAllusers);
// router
//   .route("/:id")
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

// Auth Routes

module.exports = router;
// export default router;
