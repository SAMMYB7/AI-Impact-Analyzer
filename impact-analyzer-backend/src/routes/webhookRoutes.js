const express = require("express");
const router = express.Router();
const { handleGithubWebhook } = require("../controllers/webhookController");

// POST /api/webhook/github — receives a simulated PR event
router.post("/github", handleGithubWebhook);

module.exports = router;
