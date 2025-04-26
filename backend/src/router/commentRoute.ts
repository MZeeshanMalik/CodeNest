const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// Apply authentication middleware to all comment routes

// Comment Routes
router.post("/:postId/comments", commentController.addComment); // Add comment to a post
router.put("/:postId/comments/:commentId", commentController.updateComment); // Update a comment
router.delete("/:postId/comments/:commentId", commentController.deleteComment); // Delete a comment
router.post(
  "/:postId/comments/:commentId/like",
  commentController.toggleCommentLike
); // Like/unlike a comment

// export default router;
module.exports = router;
