const express = require("express");
const router = express.Router();
const webhookRoutes = require("./webhookRoutes");
const prRoutes = require("./prRoutes");
const logsRoutes = require("./logsRoutes");
const authRoutes = require("./authRoutes");

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount route groups
router.use("/auth", authRoutes); // /api/auth/register, /api/auth/login, /api/auth/github, /api/auth/me
router.use("/webhook", webhookRoutes); // /api/webhook/github
router.use("/pr", prRoutes); // /api/pr, /api/pr/:id, /api/pr/analyze/:id
router.use("/logs", logsRoutes); // /api/logs/:prId

module.exports = router;
