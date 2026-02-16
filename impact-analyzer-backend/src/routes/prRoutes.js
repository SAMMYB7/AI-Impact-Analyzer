const express = require("express");
const router = express.Router();
const {
  getAllPRs,
  getPRById,
  analyzePR,
} = require("../controllers/prController");

// GET /api/pr — list all PRs
router.get("/", getAllPRs);

// GET /api/pr/:id — fetch a PR by prId
router.get("/:id", getPRById);

// POST /api/pr/analyze/:id — run analysis on a PR
router.post("/analyze/:id", analyzePR);

module.exports = router;
