import express from "express";
import {
  createReport,
  getAllReports,
  updateReportStatus,
} from "../controllers/reportController";
import { protect } from "../controllers/authenticationController";
const authController = require("../controllers/authenticationController");

const router = express.Router();

// Route to create a new report - requires authentication
router.post("/", protect, createReport);

// Admin routes - requires authentication and admin role
router.use(protect);

// Get all reports (admin only)
router.get("/", authController.restrictTo("admin"), getAllReports);

// Update report status (admin only)
router.patch(
  "/:id/status",
  authController.restrictTo("admin"),
  updateReportStatus
);

module.exports = router;
