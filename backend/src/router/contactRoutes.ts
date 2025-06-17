import express from "express";
const router = express.Router();
const contactController = require("../controllers/contactController");
router.post("/", contactController.postContact);

module.exports = router;
