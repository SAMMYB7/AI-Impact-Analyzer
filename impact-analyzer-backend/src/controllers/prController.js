const PullRequest = require("../models/PullRequest.model");
const PipelineRun = require("../models/PipelineRun.model");
const analyzerService = require("../services/analyzerService");

// GET /api/pr
// Fetch all PRs, newest first
async function getAllPRs(req, res) {
  try {
    const prs = await PullRequest.find().sort({ createdAt: -1 }).limit(50);
    res.json(prs);
  } catch (error) {
    console.error("❌ Get all PRs error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// GET /api/pr/:id
// Fetch a single PR by its prId
async function getPRById(req, res) {
  try {
    const pr = await PullRequest.findOne({ prId: req.params.id });

    if (!pr) {
      return res.status(404).json({ error: "PR not found" });
    }

    // Include pipeline data so frontend can show stages
    const pipeline = await PipelineRun.findOne({ prId: req.params.id });
    const prObj = pr.toObject();
    prObj.pipeline = pipeline || null;

    res.json({ pr: prObj });
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

    // Return 409 for already-processed PRs instead of 500
    if (error.message.includes("already processed")) {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllPRs, getPRById, analyzePR };
