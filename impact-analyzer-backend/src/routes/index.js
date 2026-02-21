const express = require("express");
const router = express.Router();
const webhookRoutes = require("./webhookRoutes");
const prRoutes = require("./prRoutes");
const logsRoutes = require("./logsRoutes");
const authRoutes = require("./authRoutes");
const githubRoutes = require("./githubRoutes");

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount route groups
router.use("/auth", authRoutes);
router.use("/webhook", webhookRoutes);
router.use("/pr", prRoutes);
router.use("/logs", logsRoutes);
router.use("/github", githubRoutes);

module.exports = router;
