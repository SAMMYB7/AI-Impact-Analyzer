const PullRequest = require("../models/PullRequest.model");
const pipelineService = require("../services/pipelineService");
const logService = require("../services/logService");
const analyzerService = require("../services/analyzerService");
const { getChangedFiles, GITHUB_OWNER } = require("../services/githubService");

// ═══════════════════════════════════════════════════════════════
// POST /api/webhook/github — Real GitHub webhook handler
// Receives actual GitHub pull_request events.
// Only processes action === "opened".
// Fetches changed files via GitHub API.
// ═══════════════════════════════════════════════════════════════
async function handleGithubWebhook(req, res) {
  try {
    const event = req.headers["x-github-event"];

    // ── Handle GitHub ping event (sent when webhook is first created) ──
    if (event === "ping") {
      console.log(`🏓 GitHub ping received: ${req.body.zen || ""}`);
      return res.status(200).json({ message: "pong" });
    }

    // ── Only process pull_request events ────────────────────
    if (event && event !== "pull_request") {
      console.log(`ℹ️ Ignoring GitHub event: ${event}`);
      return res.status(200).json({ message: `Ignored event: ${event}` });
    }

    const { action, pull_request, repository } = req.body;

    // ── Validate pull_request payload ───────────────────────
    if (!pull_request) {
      console.log("ℹ️ No pull_request in payload — ignoring");
      return res.status(200).json({ message: "No pull_request in payload" });
    }

    // Process opened, reopened, and synchronize — ignore closed and others
    const ALLOWED_ACTIONS = ["opened", "reopened", "synchronize"];
    if (!ALLOWED_ACTIONS.includes(action)) {
      console.log(`ℹ️ Ignoring PR action: ${action}`);
      return res.status(200).json({ message: `Ignored action: ${action}` });
    }

    // ── Extract PR details from GitHub payload ──────────────
    const prNumber = pull_request.number;
    const prId = "GH-" + pull_request.id;
    const repo = repository?.full_name || repository?.name || "unknown/repo";
    const author = pull_request.user.login;
    const branch = pull_request.head.ref;
    const commitMessage = pull_request.title || "";

    console.log(
      `🔔 GitHub webhook: PR #${prNumber} ${action} by ${author} on ${branch}`,
    );

    // ── Fetch changed files from GitHub API ─────────────────
    const owner = GITHUB_OWNER;
    const repoName = repository?.name || repo.split("/").pop();
    const filesChanged = await getChangedFiles(owner, repoName, prNumber);

    if (filesChanged.length === 0) {
      console.warn(
        `⚠️ No files returned for PR #${prNumber}, using placeholder`,
      );
    }

    console.log(`📂 PR #${prNumber} changed ${filesChanged.length} files`);

    // ── Check for existing PR ───────────────────────────────
    let pr = await PullRequest.findOne({ prId });

    if (pr && action === "opened") {
      // Duplicate opened event — skip
      console.log(`⚠️ PR ${prId} already exists — skipping duplicate opened`);
      return res.status(409).json({ error: "PR already processed", prId });
    }

    if (pr && (action === "reopened" || action === "synchronize")) {
      // Update existing PR with fresh file list and reset status
      pr.filesChanged = filesChanged;
      pr.status = "received";
      pr.branch = branch;
      pr.commitMessage = commitMessage;
      await pr.save();

      await logService.addLog(
        prId,
        "fetch_changes",
        `PR #${prNumber} ${action} — refreshed ${filesChanged.length} files`,
      );

      console.log(`🔄 PR ${prId} updated (${action})`);
    } else {
      // ── Create new PullRequest document ─────────────────────
      pr = await PullRequest.create({
        prId,
        repo,
        author,
        branch,
        commitMessage,
        filesChanged,
        status: "received",
      });

      // ── Create PipelineRun ──────────────────────────────────
      const pipeline = await pipelineService.createPipeline(prId);
      pr.pipelineRunId = pipeline._id.toString();
      await pr.save();

      // ── Log the event ───────────────────────────────────────
      await logService.addLog(
        prId,
        "fetch_changes",
        `Real GitHub PR #${prNumber} received from ${author} on ${branch} — ${filesChanged.length} files`,
      );

      console.log(`📥 GitHub PR ingested: ${prId}`);
    }

    // ── Auto-analyze if enabled ─────────────────────────────
    if (process.env.AUTO_ANALYZE === "true") {
      console.log(`⚡ Auto-analyze enabled — running analysis for ${prId}`);
      analyzerService.analyzePullRequest(prId).catch((err) => {
        console.error(`❌ Auto-analyze failed for ${prId}:`, err.message);
      });
    }

    res.status(201).json({
      message: "GitHub PR received successfully",
      prId: pr.prId,
      prNumber,
      filesChanged: filesChanged.length,
      status: pr.status,
    });
  } catch (error) {
    console.error("❌ GitHub webhook error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// ═══════════════════════════════════════════════════════════════
// POST /api/webhook/simulate — Demo / simulated PR handler
// Receives payloads from the frontend Simulate PR modal.
// Supports both GitHub-style (pull_request) & simple payloads.
// ═══════════════════════════════════════════════════════════════
async function handleSimulateWebhook(req, res) {
  try {
    let repo, author, branch, commitMessage, filesChanged, prId;

    if (req.body.pull_request) {
      // GitHub-style payload from Simulate modal
      const { repository, pull_request, files_override } = req.body;

      repo = repository?.full_name || repository?.name || "unknown/repo";
      author = pull_request.user.login;
      branch = pull_request.head.ref;
      commitMessage = pull_request.title || "";
      prId = "PR-" + Date.now();

      if (files_override && files_override.length > 0) {
        filesChanged = files_override;
      } else {
        filesChanged = ["src/mock-file-1.js", "src/mock-file-2.js"];
      }

      console.log(`🔔 Simulated GitHub-style PR by ${author} on ${branch}`);
    } else {
      // Simple payload from frontend
      repo = req.body.repo;
      author = req.body.author;
      branch = req.body.branch;
      commitMessage = req.body.commitMessage || "";
      filesChanged = req.body.filesChanged;
      prId = "PR-" + Date.now();

      if (!repo || !author || !branch || !filesChanged) {
        return res.status(400).json({
          error: "Missing required fields: repo, author, branch, filesChanged",
        });
      }
    }

    // ── Create PullRequest document ─────────────────────────
    const pr = await PullRequest.create({
      prId,
      repo,
      author,
      branch,
      commitMessage,
      filesChanged,
      status: "received",
    });

    // ── Create PipelineRun ──────────────────────────────────
    const pipeline = await pipelineService.createPipeline(prId);
    pr.pipelineRunId = pipeline._id.toString();
    await pr.save();

    // ── Log the event ───────────────────────────────────────
    await logService.addLog(
      prId,
      "fetch_changes",
      `Simulated PR received from ${author} on ${branch}`,
    );

    console.log(`📥 Simulated PR ingested: ${prId}`);

    // ── Auto-analyze if enabled ─────────────────────────────
    if (process.env.AUTO_ANALYZE === "true") {
      console.log(`⚡ Auto-analyze enabled — running analysis for ${prId}`);
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
    console.error("❌ Simulate webhook error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { handleGithubWebhook, handleSimulateWebhook };
