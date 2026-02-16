const PullRequest = require("../models/PullRequest.model");
const analyzerService = require("../services/analyzerService");

// GET /api/pr/:id
// Fetch a single PR by its prId
async function getPRById(req, res) {
  try {
    const pr = await PullRequest.findOne({ prId: req.params.id });

    if (!pr) {
      return res.status(404).json({ error: "PR not found" });
    }

    res.json(pr);
  } catch (error) {
    console.error("❌ Get PR error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// POST /api/pr/analyze/:id
// Triggers analysis for a PR
async function analyzePR(req, res) {
  try {
    const prId = req.params.id;

    const updatedPR = await analyzerService.analyzePullRequest(prId);

    res.json({
      message: "Analysis complete",
      pr: updatedPR,
    });
  } catch (error) {
    console.error("❌ Analyze PR error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getPRById, analyzePR };
