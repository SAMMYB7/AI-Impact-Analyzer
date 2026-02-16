const express = require("express");
const router = express.Router();
const { getPRById, analyzePR } = require("../controllers/prController");

// GET /api/pr/:id — fetch a PR by prId
router.get("/:id", getPRById);

// POST /api/pr/analyze/:id — run analysis on a PR
router.post("/analyze/:id", analyzePR);

module.exports = router;
