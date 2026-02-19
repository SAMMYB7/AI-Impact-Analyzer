const mongoose = require("mongoose");

const pullRequestSchema = new mongoose.Schema(
  {
    prId: { type: String, required: true, unique: true },
    repo: { type: String, required: true },
    repoOwner: { type: String },
    repoName: { type: String },
    prNumber: { type: Number },
    htmlUrl: { type: String },
    author: { type: String, required: true },
    branch: { type: String, required: true },
    commitMessage: { type: String },
    filesChanged: [String],
    modulesImpacted: [String],
    riskScore: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "received",
        "analyzing",
        "predicted",
        "tests_selected",
        "running",
        "completed",
        "failed",
      ],
      default: "received",
    },
    selectedTests: [String],
    skippedTests: [String],
    analysisStartedAt: { type: Date },
    analysisCompletedAt: { type: Date },
    modelVersion: { type: String },
    analysisProvider: { type: String, default: "mock" },
    estimatedTimeSaved: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    analysisDuration: { type: Number, default: 0 },
    autoAnalysisAt: { type: Date },
    pipelineRunId: { type: String },
    reportUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PullRequest", pullRequestSchema);
