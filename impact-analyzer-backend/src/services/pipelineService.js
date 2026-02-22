const PipelineRun = require("../models/PipelineRun.model");

// The 6 pipeline stages in order
const STAGE_NAMES = [
  "fetch_changes",
  "dependency_mapping",
  "risk_prediction",
  "test_selection",
  "test_execution",
  "report_upload",
];

// Create a new pipeline run with all stages set to "pending"
async function createPipeline(prId, userId = null) {
  const stages = STAGE_NAMES.map((name) => ({
    name,
    status: "pending",
  }));

  let finalUserId = userId;
  if (!finalUserId) {
    const mongoose = require("mongoose");
    const PullRequest = mongoose.model("PullRequest");
    if (PullRequest) {
      const pr = await PullRequest.findOne({ prId }).select("userId");
      if (pr?.userId) finalUserId = pr.userId;
    }
  }

  const pipeline = await PipelineRun.create({
    prId,
    userId: finalUserId,
    stages,
    status: "running",
    currentStage: STAGE_NAMES[0],
  });

  return pipeline;
}

// Update a specific stage's status (e.g. "running", "completed", "failed")
async function updateStage(prId, stageName, status) {
  const now = new Date();

  // Build the update — set stage status + timestamps
  const update = {
    "stages.$.status": status,
    currentStage: stageName,
  };

  if (status === "running") {
    update["stages.$.startedAt"] = now;
  }
  if (status === "completed" || status === "failed") {
    update["stages.$.completedAt"] = now;
  }

  const pipeline = await PipelineRun.findOneAndUpdate(
    { prId, "stages.name": stageName },
    { $set: update },
    { returnDocument: 'after' }
  );

  return pipeline;
}

// Mark the entire pipeline as completed (or failed) and calculate duration
async function completePipeline(prId, finalStatus = "completed") {
  const pipeline = await PipelineRun.findOne({ prId });
  if (!pipeline) return null;

  // Fix 2: Use first stage startedAt if available, else fall back to createdAt
  const firstStage = pipeline.stages[0];
  const startTime = (firstStage && firstStage.startedAt)
    ? firstStage.startedAt.getTime()
    : pipeline.createdAt.getTime();
  const duration = Math.floor((Date.now() - startTime) / 1000);

  pipeline.status = finalStatus;
  pipeline.duration = duration;
  pipeline.currentStage = finalStatus === "failed" ? "failed" : "done";
  await pipeline.save();

  return pipeline;
}

module.exports = { createPipeline, updateStage, completePipeline, STAGE_NAMES };
