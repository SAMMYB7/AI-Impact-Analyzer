const express = require("express");
const router = express.Router();
const Log = require("../models/Log.model");
const { protect } = require("../middleware/auth");

// GET /api/logs — fetch all logs for the current user (latest 500)
router.get("/", protect, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(500);
    res.json(logs);
  } catch (error) {
    console.error("❌ Get all logs error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/logs/:prId — fetch all logs for a specific PR belonging to the user
router.get("/:prId", protect, async (req, res) => {
  try {
    const logs = await Log.find({ prId: req.params.prId, userId: req.user._id }).sort({
      timestamp: 1,
    });
    res.json(logs);
  } catch (error) {
    console.error("❌ Get logs error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
