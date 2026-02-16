const mongoose = require("mongoose");

const pipelineRunSchema = new mongoose.Schema(
  {
    prId: { type: String, required: true },
    stages: [
      {
        name: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "running", "completed", "failed"],
          default: "pending",
        },
        startedAt: { type: Date },
        completedAt: { type: Date },
      },
    ],
    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running",
    },
    duration: { type: Number, default: 0 },
    currentStage: { type: String },
    logsUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PipelineRun", pipelineRunSchema);
