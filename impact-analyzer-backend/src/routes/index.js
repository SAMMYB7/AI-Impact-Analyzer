const express = require("express");
const router = express.Router();
const webhookRoutes = require("./webhookRoutes");
const prRoutes = require("./prRoutes");

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount route groups
router.use("/webhook", webhookRoutes); // /api/webhook/github
router.use("/pr", prRoutes);           // /api/pr/:id, /api/pr/analyze/:id

module.exports = router;
