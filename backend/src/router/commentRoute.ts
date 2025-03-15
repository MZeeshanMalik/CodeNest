import express from "express";
import {
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from "../controllers/commentController";

const router = express.Router();

// Apply authentication middleware to all comment routes

// Comment Routes
router.post("/:postId/comments", addComment); // Add comment to a post
router.put("/:postId/comments/:commentId", updateComment); // Update a comment
router.delete("/:postId/comments/:commentId", deleteComment); // Delete a comment
router.post("/:postId/comments/:commentId/like", toggleCommentLike); // Like/unlike a comment

// export default router;
module.exports = router;
