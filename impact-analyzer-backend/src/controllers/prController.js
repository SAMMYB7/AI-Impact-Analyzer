const PullRequest = require("../models/PullRequest.model");
const PipelineRun = require("../models/PipelineRun.model");
const Log = require("../models/Log.model");
const analyzerService = require("../services/analyzerService");
const { cancelAutoAnalysis } = require("../services/timerService");

// GET /api/pr
// Fetch all PRs for the logged-in user, newest first
async function getAllPRs(req, res) {
  try {
    const prs = await PullRequest.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(prs);
  } catch (error) {
    console.error("❌ Get all PRs error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// GET /api/pr/:id
// Fetch a single PR by its prId (must belong to user)
async function getPRById(req, res) {
  try {
    const pr = await PullRequest.findOne({ prId: req.params.id, userId: req.user._id });

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

    // Verify the user owns this PR
    const prCheck = await PullRequest.findOne({ prId, userId: req.user._id });
    if (!prCheck) {
      return res.status(404).json({ error: "PR not found or unauthorized" });
    }

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
// Fetch the 20 most recent PRs for the logged-in user
async function getRecentPRs(req, res) {
  try {
    const prs = await PullRequest.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
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

    const pr = await PullRequest.findOne({ prId, userId: req.user._id });
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

// DELETE /api/pr/:id
// Delete a PR and its associated pipeline + logs
async function deletePR(req, res) {
  try {
    const prId = req.params.id;

    // Verify the user owns this PR
    const pr = await PullRequest.findOne({ prId, userId: req.user._id });
    if (!pr) {
      return res.status(404).json({ error: "PR not found or unauthorized" });
    }

    // Don't allow deleting PRs that are currently analyzing
    if (pr.status === "analyzing") {
      return res.status(409).json({ error: "Cannot delete a PR that is currently being analyzed" });
    }

    // Cancel any pending auto-analysis timer
    cancelAutoAnalysis(prId);

    // Delete associated pipeline run
    await PipelineRun.deleteMany({ prId });

    // Delete associated logs
    await Log.deleteMany({ prId });

    // Delete the PR itself
    await PullRequest.deleteOne({ prId, userId: req.user._id });

    console.log(`🗑️ PR ${prId} deleted by user ${req.user._id}`);

    res.json({ message: "PR deleted successfully", prId });
  } catch (error) {
    console.error("❌ Delete PR error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// PUT /api/pr/:id
// Update editable fields of a PR
async function updatePR(req, res) {
  try {
    const prId = req.params.id;

    // Verify the user owns this PR
    const pr = await PullRequest.findOne({ prId, userId: req.user._id });
    if (!pr) {
      return res.status(404).json({ error: "PR not found or unauthorized" });
    }

    // Don't allow editing PRs that are currently analyzing
    if (pr.status === "analyzing") {
      return res.status(409).json({ error: "Cannot edit a PR that is currently being analyzed" });
    }

    // Only allow updating certain fields
    const allowedFields = ["author", "branch", "commitMessage", "repo"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Apply updates
    Object.assign(pr, updates);
    await pr.save();

    console.log(`✏️ PR ${prId} updated:`, Object.keys(updates).join(", "));

    res.json({ message: "PR updated successfully", pr });
  } catch (error) {
    console.error("❌ Update PR error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllPRs, getPRById, analyzePR, getRecentPRs, getPRStatus, deletePR, updatePR };
