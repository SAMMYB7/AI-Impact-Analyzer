const PullRequest = require("../models/PullRequest.model");
const PipelineRun = require("../models/PipelineRun.model");
const analyzerService = require("../services/analyzerService");
const { cancelAutoAnalysis } = require("../services/timerService");

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
// Triggers manual analysis for a PR (cancels pending auto-analysis timer)
async function analyzePR(req, res) {
  try {
    const prId = req.params.id;

    // Cancel any pending auto-analysis timer for this PR
    const wasCancelled = cancelAutoAnalysis(prId);
    if (wasCancelled) {
      console.log(
        `🛑 Manual analysis requested — cancelled auto timer for ${prId}`,
      );
    }

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

// GET /api/pr/recent
// Fetch the 20 most recent PRs
async function getRecentPRs(req, res) {
  try {
    const prs = await PullRequest.find().sort({ createdAt: -1 }).limit(20);
    res.json(prs);
  } catch (error) {
    console.error("❌ Get recent PRs error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// GET /api/pr/:id/status
// Returns PR + pipeline + logs in one shot (for polling)
async function getPRStatus(req, res) {
  try {
    const prId = req.params.id;

    const pr = await PullRequest.findOne({ prId });
    if (!pr) {
      return res.status(404).json({ error: "PR not found" });
    }

    const pipeline = await PipelineRun.findOne({ prId });
    const Log = require("../models/Log.model");
    const logs = await Log.find({ prId }).sort({ timestamp: 1 });

    res.json({
      pr: pr.toObject(),
      pipeline: pipeline || null,
      logs,
    });
  } catch (error) {
    console.error("❌ Get PR status error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllPRs, getPRById, analyzePR, getRecentPRs, getPRStatus };
