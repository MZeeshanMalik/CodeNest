import express from "express";
import {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  reportAnswer,
  getQuestionAnswers,
  getAnswers,
} from "../controllers/answerController";
import { protect } from "../controllers/authenticationController";

const router = express.Router({ mergeParams: true });

// Protected routes (require authentication)
router.use(protect);

// Get answers by question ID
router.get("/question/:questionId", getQuestionAnswers);

// Get a specific answer
router.get("/:id", getAnswers);

// Create an answer
router.post("/", createAnswer);

// Update an answer (only the author can update)
router.patch("/:id", updateAnswer);

// Delete an answer (only the author or admin can delete)
router.delete("/:id", deleteAnswer);

// Report an answer
router.post("/:id/report", reportAnswer);

// Admin only routes
// router.use(restrictTo("admin"));

// export default router;
module.exports = router;
