import express from "express";
import multer from "multer";
// Configure storage for uploaded images
const storage = multer.memoryStorage(); // Use diskStorage if needed
const upload = multer({ storage });
import {
  postQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestion,
} from "../controllers/questionController";
import { compressImage } from "../controllers/imageController";

const router = express.Router();

router.post("/", upload.array("images", 5), postQuestion);
router.get("/:query", getQuestion); // Fetch by ID or Slug
router.put("/:query", updateQuestion); // Update by ID or Slug
router.delete("/:query", deleteQuestion); // Delete by ID or Slug

// export default router;
module.exports = router;
