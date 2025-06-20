import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, "../uploads/questionImages");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-questoin_image";
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

import {
  postQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestion,
  searchQuestions,
  relatedQuestions,
  getRandomQuestions,
  getTopVotedQuestions,
} from "../controllers/questionController";
import { protect } from "../controllers/authenticationController";

const router = express.Router();

// Public routes - specific routes first
router.get("/search", searchQuestions);
router.get("/related", relatedQuestions);
router.get("/top-voted", getTopVotedQuestions);
router.get("/random", getRandomQuestions);

// Dynamic route for viewing questions
router.get("/:query", getQuestion);

// Protected routes
router.use(protect);
router.post("/", upload.array("images", 5), postQuestion);
router.put("/:query", upload.array("images", 5), updateQuestion);
router.delete("/:query", deleteQuestion);

module.exports = router;
