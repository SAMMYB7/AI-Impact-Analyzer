const Log = require("../models/Log.model");

// Add a log entry for a PR stage
async function addLog(prId, stage, message, level = "info", source = "analyzer") {
  const log = await Log.create({ prId, stage, message, level, source });
  console.log(`[LOG] [${level.toUpperCase()}] [${stage}] ${message}`);
  return log;
}

// Get all logs for a PR (useful for debugging)
async function getLogsByPR(prId) {
  const logs = await Log.find({ prId }).sort({ timestamp: 1 });
  return logs;
}

module.exports = { addLog, getLogsByPR };
