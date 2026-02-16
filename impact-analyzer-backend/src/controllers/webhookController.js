const PullRequest = require("../models/PullRequest.model");
const pipelineService = require("../services/pipelineService");
const logService = require("../services/logService");
const analyzerService = require("../services/analyzerService");

// POST /api/webhook/github
// Handles both simulated payloads and real GitHub webhook payloads
async function handleGithubWebhook(req, res) {
  try {
    let repo, author, branch, commitMessage, filesChanged, prId;

    // ── Detect payload type ────────────────────────────────
    if (req.body.pull_request) {
      // GitHub-style payload (real webhook OR simulated from frontend)
      const { repository, pull_request, files_override } = req.body;

      repo = repository?.full_name || repository?.name || "unknown/repo";
      author = pull_request.user.login;
      branch = pull_request.head.ref;
      commitMessage = pull_request.title || "";
      prId = "PR-" + Date.now();

      // Use files_override if provided (from Simulate modal),
      // otherwise use placeholder (real webhook — files fetched later)
      if (files_override && files_override.length > 0) {
        filesChanged = files_override;
      } else {
        filesChanged = ["placeholder.js"];
      }

      console.log(`🔔 Webhook received for PR by ${author} on ${branch}`);
    } else {
      // Simulated payload from frontend
      repo = req.body.repo;
      author = req.body.author;
      branch = req.body.branch;
      commitMessage = req.body.commitMessage || "";
      filesChanged = req.body.filesChanged;
      prId = "PR-" + Date.now();

      // Validate required fields for simulated payload
      if (!repo || !author || !branch || !filesChanged) {
        return res.status(400).json({
          error: "Missing required fields: repo, author, branch, filesChanged",
        });
      }
    }

    // ── Create PullRequest document ────────────────────────
    const pr = await PullRequest.create({
      prId,
      repo,
      author,
      branch,
      commitMessage,
      filesChanged,
      status: "received",
    });

    // ── Create PipelineRun ─────────────────────────────────
    const pipeline = await pipelineService.createPipeline(prId);

    // Link pipeline to PR
    pr.pipelineRunId = pipeline._id.toString();
    await pr.save();

    // Log the event
    await logService.addLog(
      prId,
      "fetch_changes",
      `PR received from ${author} on ${branch}`,
    );

    console.log(`📥 PR ingested: ${prId}`);

    // ── Auto-analyze if enabled ────────────────────────────
    if (process.env.AUTO_ANALYZE === "true") {
      console.log(`⚡ Auto-analyze enabled — running analysis for ${prId}`);
      // Run in background so webhook responds fast
      analyzerService.analyzePullRequest(prId).catch((err) => {
        console.error(`❌ Auto-analyze failed for ${prId}:`, err.message);
      });
    }

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
