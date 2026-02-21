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

    // Files & Modules
    filesChanged: [String],
    modulesImpacted: [String],
    fileClassifications: { type: mongoose.Schema.Types.Mixed }, // { auth: 2, api: 3, ... }

    // Risk Analysis
    riskScore: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    riskBreakdown: { type: mongoose.Schema.Types.Mixed }, // { fileRisk, volumeRisk, ... }

    // Status
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

    // Test Selection
    selectedTests: [String],
    skippedTests: [String],
    totalTests: { type: Number, default: 0 },

    // Test Execution Results
    testExecution: {
      passed: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      passRate: { type: Number, default: 0 },
      totalDuration: { type: Number, default: 0 },
      results: [
        {
          name: { type: String },
          status: { type: String, enum: ["passed", "failed"] },
          duration: { type: Number },
          assertions: {
            total: { type: Number },
            passed: { type: Number },
            failed: { type: Number },
          },
          module: { type: String },
          source: { type: String },
          priority: { type: Number },
          error: {
            message: { type: String },
            type: { type: String },
          },
        },
      ],
    },

    // Timing & Meta
    analysisStartedAt: { type: Date },
    analysisCompletedAt: { type: Date },
    analysisDuration: { type: Number, default: 0 },
    estimatedTimeSaved: { type: Number, default: 0 },
    modelVersion: { type: String },
    analysisProvider: { type: String, default: "mock" },
    autoAnalysisAt: { type: Date },
    pipelineRunId: { type: String },
    reportUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PullRequest", pullRequestSchema);
