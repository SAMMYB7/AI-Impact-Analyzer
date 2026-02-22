const express = require("express");
const router = express.Router();
const {
  getAllPRs,
  getPRById,
  analyzePR,
  getRecentPRs,
  getPRStatus,
  deletePR,
  updatePR,
} = require("../controllers/prController");

const { protect } = require("../middleware/auth");

// GET /api/pr — list all PRs
router.get("/", protect, getAllPRs);

// GET /api/pr/recent — last 20 PRs
router.get("/recent", protect, getRecentPRs);

// GET /api/pr/:id/status — PR + pipeline + logs (for polling)
router.get("/:id/status", protect, getPRStatus);

// GET /api/pr/:id — fetch a PR by prId
router.get("/:id", protect, getPRById);

// POST /api/pr/analyze/:id — run analysis on a PR
router.post("/analyze/:id", protect, analyzePR);

// PUT /api/pr/:id — update editable fields of a PR
router.put("/:id", protect, updatePR);

// DELETE /api/pr/:id — delete a PR and associated data
router.delete("/:id", protect, deletePR);

module.exports = router;
