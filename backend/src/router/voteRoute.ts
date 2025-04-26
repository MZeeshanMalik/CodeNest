import express from "express";
import { vote, getUserVote } from "../controllers/voteController";
import { protect } from "../controllers/authenticationController";

const router = express.Router();

// Protect all vote routes
router.use(protect);

// POST /api/v1/vote - Create or update a vote
router.post("/", vote);

// GET /api/v1/vote/:targetType/:targetId - Get user's vote status for a specific target
router.get("/:targetType/:targetId", getUserVote);

// GET /api/votes?targetType=question&targetId=123
router.get("/", getUserVote);

// export default router;
module.exports = router;
