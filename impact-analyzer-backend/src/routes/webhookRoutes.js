const express = require("express");
const router = express.Router();
const {
  handleGithubWebhook,
  handleSimulateWebhook,
} = require("../controllers/webhookController");

const { protect } = require("../middleware/auth");

// POST /api/webhook/github — receives real GitHub webhook events
router.post("/github", handleGithubWebhook);

// POST /api/webhook/simulate — receives simulated PRs from frontend
router.post("/simulate", protect, handleSimulateWebhook);

module.exports = router;
