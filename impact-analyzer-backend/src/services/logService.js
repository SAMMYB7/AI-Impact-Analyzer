const mongoose = require("mongoose");
const Log = require("../models/Log.model");

// Add a log entry for a PR stage
async function addLog(prId, stage, message, level = "info", source = "analyzer", userId = null) {
  const logData = { prId, stage, message, level, source };

  if (userId) {
    logData.userId = userId;
  } else {
    // Lazy load PullRequest to avoid circular dependency
    const PullRequest = mongoose.model("PullRequest");
    if (PullRequest) {
      const pr = await PullRequest.findOne({ prId }).select("userId");
      if (pr?.userId) logData.userId = pr.userId;
    }
  }

  const log = await Log.create(logData);
  console.log(`[LOG] [${level.toUpperCase()}] [${stage}] ${message}`);
  return log;
}

// Get all logs for a PR (useful for debugging)
async function getLogsByPR(prId) {
  const logs = await Log.find({ prId }).sort({ timestamp: 1 });
  return logs;
}

module.exports = { addLog, getLogsByPR };
