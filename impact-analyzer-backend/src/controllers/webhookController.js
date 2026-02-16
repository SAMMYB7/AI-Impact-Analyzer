const PullRequest = require("../models/PullRequest.model");
const pipelineService = require("../services/pipelineService");
const logService = require("../services/logService");

// POST /api/webhook/github
// Simulates receiving a GitHub PR event
async function handleGithubWebhook(req, res) {
  try {
    const { repo, author, branch, commitMessage, filesChanged } = req.body;

    // Validate required fields
    if (!repo || !author || !branch || !filesChanged) {
      return res.status(400).json({
        error: "Missing required fields: repo, author, branch, filesChanged",
      });
    }

    // Generate a unique PR ID (e.g. "PR-1707849600000")
    const prId = "PR-" + Date.now();

    // Create PullRequest document
    const pr = await PullRequest.create({
      prId,
      repo,
      author,
      branch,
      commitMessage: commitMessage || "",
      filesChanged,
      status: "received",
    });

    // Create PipelineRun for this PR
    const pipeline = await pipelineService.createPipeline(prId);

    // Link pipeline to PR
    pr.pipelineRunId = pipeline._id.toString();
    await pr.save();

    // Log the event
    await logService.addLog(prId, "fetch_changes", `PR received from ${author} on ${branch}`);

    console.log(`📥 PR ingested: ${prId}`);

    res.status(201).json({
      message: "PR received successfully",
      prId: pr.prId,
      status: pr.status,
    });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { handleGithubWebhook };
