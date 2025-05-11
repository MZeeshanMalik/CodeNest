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
} from "../controllers/questionController";
import { compressImage } from "../controllers/imageController";
import { protect } from "../controllers/authenticationController";
import { Request, Response } from "express";
import Question from "../models/questionModel";

const router = express.Router();

// Public routes - specific routes first
router.get("/search", searchQuestions);
router.get("/related", async (req: Request, res: Response) => {
  try {
    console.log("Related questions request received:", req.query);
    const { tags, excludeId } = req.query;
    const tagArray = (tags as string).split(",");

    console.log("Searching for questions with tags:", tagArray);

    let questions: any[] = await Question.find({
      tags: { $in: tagArray },
      _id: { $ne: excludeId },
    })
      .sort({ votes: -1, createdAt: -1 })
      .limit(5)
      .populate("author", "name")
      .select("title votes tags createdAt author");

    console.log("Found questions with matching tags:", questions.length);

    if (questions.length === 0) {
      console.log("No matching tags found, fetching recent questions");
      questions = await Question.find({
        _id: { $ne: excludeId },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("author", "name")
        .select("title votes tags createdAt author");

      console.log("Found recent questions:", questions.length);
    }

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
    });
  }
});

router.get("/top-voted", async (req: Request, res: Response) => {
  try {
    console.log("Top voted questions request received");
    const questions = await Question.find()
      .sort({ votes: -1, createdAt: -1 })
      .limit(5)
      .populate("author", "name")
      .select("title votes tags createdAt author");

    console.log("Found top voted questions:", questions.length);
    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching top voted questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching top voted questions",
    });
  }
});

router.get("/random", async (req: Request, res: Response) => {
  try {
    console.log("Random questions request received:", req.query);
    const { limit = 5 } = req.query;
    const questions = await Question.aggregate([
      { $sample: { size: Number(limit) } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          title: 1,
          votes: 1,
          tags: 1,
          createdAt: 1,
          "author.name": 1,
        },
      },
    ]);

    console.log("Found random questions:", questions.length);
    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching random questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching random questions",
    });
  }
});

// Dynamic route for viewing questions
router.get("/:query", getQuestion);

// Protected routes
router.use(protect);
router.post("/", upload.array("images", 5), postQuestion);
router.put("/:query", upload.array("images", 5), updateQuestion);
router.delete("/:query", deleteQuestion);

module.exports = router;
