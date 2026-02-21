const mongoose = require("mongoose");

const pullRequestSchema = new mongoose.Schema(
  {
    prId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
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
    fileClassifications: { type: mongoose.Schema.Types.Mixed },

    // AI Risk Analysis
    riskScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    confidence: { type: Number, default: 0 },
    riskBreakdown: { type: mongoose.Schema.Types.Mixed },
    aiReasoning: { type: String },
    aiSuggestions: [String],

    // Status
    status: {
      type: String,
      enum: ["received", "analyzing", "predicted", "tests_selected", "running", "completed", "failed"],
      default: "received",
    },

    // AI Test Selection
    selectedTests: [String],
    skippedTests: [String],
    totalTests: { type: Number, default: 0 },
    testSelectionStrategy: { type: String },
    coverageEstimate: { type: Number, default: 0 },
    testSelectionDetails: { type: mongoose.Schema.Types.Mixed }, // [{ name, type, reason }]
    skippedTestDetails: { type: mongoose.Schema.Types.Mixed },   // [{ name, reason }]

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

    // AI Test Results Analysis
    testResultsAnalysis: {
      summary: { type: String },
      isSafeToMerge: { type: Boolean },
      mergeConfidence: { type: Number },
      failureAnalysis: { type: String },
      rootCauseGuess: { type: String },
      actionItems: [String],
      coverageGaps: [String],
    },

    // Timing & Meta
    analysisStartedAt: { type: Date },
    analysisCompletedAt: { type: Date },
    analysisDuration: { type: Number, default: 0 },
    estimatedTimeSaved: { type: Number, default: 0 },
    modelVersion: { type: String },
    analysisProvider: { type: String, default: "mock" },
    testExecutionProvider: { type: String, default: "simulation" }, // codebuild | simulation
    autoAnalysisAt: { type: Date },
    pipelineRunId: { type: String },
    reportUrl: { type: String },

    // AWS CodeBuild
    codebuildInfo: {
      buildId: { type: String },
      buildArn: { type: String },
      projectName: { type: String },
      status: { type: String }, // SUCCEEDED, FAILED, IN_PROGRESS, etc.
      duration: { type: Number },
      timedOut: { type: Boolean, default: false },
      phases: { type: mongoose.Schema.Types.Mixed },
      logs: {
        groupName: { type: String },
        streamName: { type: String },
        deepLink: { type: String },
      },
      artifacts: {
        location: { type: String },
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PullRequest", pullRequestSchema);
