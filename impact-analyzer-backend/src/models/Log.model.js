const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  prId: { type: String, required: true },
  stage: { type: String, required: true },
  level: {
    type: String,
    enum: ["info", "warn", "error", "debug"],
    default: "info",
  },
  message: { type: String, required: true },
  source: { type: String, enum: ["analyzer", "pipeline", "sagemaker"], default: "analyzer" },
  timestamp: { type: Date, default: Date.now },
});

// Index prId for fast log retrieval
logSchema.index({ prId: 1 });

module.exports = mongoose.model("Log", logSchema);
