const PullRequest = require("../models/PullRequest.model");
const TestMapping = require("../models/TestMapping.model");
const pipelineService = require("./pipelineService");
const logService = require("./logService");
const { predictRisk } = require("./sagemakerService");
const s3Service = require("./s3Service");

// ── Mock module mapper ───────────────────────────────────────
// Extracts module name from file path (e.g. "auth/login.js" → "auth")
function getModuleFromPath(filePath) {
  const parts = filePath.split("/");
  return parts.length > 1 ? parts[0] : "root";
}

// ── Main analysis function ───────────────────────────────────
async function analyzePullRequest(prId) {
  // Step 1: Fetch the PR from database
  const pr = await PullRequest.findOne({ prId });
  if (!pr) {
    throw new Error(`PR not found: ${prId}`);
  }

  // Fix 4: Prevent duplicate analysis runs
  if (pr.status !== "received") {
    throw new Error(`PR already processed (status: ${pr.status})`);
  }

  try {
    // Step 2: Update status to "analyzing"
    pr.status = "analyzing";
    pr.analysisStartedAt = new Date();
    await pr.save();

    await logService.addLog(
      prId,
      "fetch_changes",
      `Starting analysis for PR ${prId}`,
    );
    await pipelineService.updateStage(prId, "fetch_changes", "running");

    // Step 3: Map files → modules
    await pipelineService.updateStage(prId, "fetch_changes", "completed");
    await pipelineService.updateStage(prId, "dependency_mapping", "running");
    await logService.addLog(
      prId,
      "dependency_mapping",
      `Mapping ${pr.filesChanged.length} files to modules`,
    );

    // Look up TestMapping docs for each changed file
    const mappings = await TestMapping.find({
      filePath: { $in: pr.filesChanged },
    });

    // Derive modules from mappings, or fall back to path-based extraction
    const modulesFromDB = mappings.map((m) => m.module);
    const modulesFromPath = pr.filesChanged.map(getModuleFromPath);
    const allModules = [...new Set([...modulesFromDB, ...modulesFromPath])];

    await pipelineService.updateStage(prId, "dependency_mapping", "completed");
    await logService.addLog(
      prId,
      "dependency_mapping",
      `Found ${allModules.length} impacted modules: ${allModules.join(", ")}`,
    );

    // Step 4: Risk prediction (via SageMaker or mock fallback)
    await pipelineService.updateStage(prId, "risk_prediction", "running");

    // Build feature vector for SageMaker (CSV format)
    const features = [
      pr.filesChanged.length,
      pr.commitMessage?.length || 0,
      0.5,
    ];

    const riskScore = await predictRisk(features);
    // Scale to 0-100 if returned as 0-1 probability
    const riskScoreNorm =
      riskScore <= 1 ? Math.round(riskScore * 100) : Math.round(riskScore);
    const confidence = Math.round(riskScore * 100);
    const provider =
      process.env.SAGEMAKER_ENDPOINT &&
      process.env.SAGEMAKER_ENDPOINT !== "dummy"
        ? "sagemaker"
        : "mock";

    await logService.addLog(
      prId,
      "risk_prediction",
      `Risk score: ${riskScoreNorm}, Confidence: ${confidence}% (provider: ${provider})`,
    );
    await pipelineService.updateStage(prId, "risk_prediction", "completed");

    // Step 5: Test selection
    await pipelineService.updateStage(prId, "test_selection", "running");

    // Collect tests from DB mappings
    const selectedTests = [];
    mappings.forEach((m) => {
      m.relatedTests.forEach((test) => {
        if (!selectedTests.includes(test)) {
          selectedTests.push(test);
        }
      });
    });

    // If no mappings found in DB, generate mock tests based on modules
    if (selectedTests.length === 0) {
      allModules.forEach((mod) => {
        selectedTests.push(`${mod}.test.js`);
        selectedTests.push(`${mod}.integration.test.js`);
      });
    }

    // Mock: some tests are skipped (low priority ones)
    const totalTests = selectedTests.length + Math.floor(Math.random() * 5) + 3;
    const skippedTests = [];
    for (let i = 0; i < Math.min(3, totalTests - selectedTests.length); i++) {
      skippedTests.push(`skipped_test_${i + 1}.test.js`);
    }

    await logService.addLog(
      prId,
      "test_selection",
      `Selected ${selectedTests.length} tests, skipped ${skippedTests.length}`,
    );
    await pipelineService.updateStage(prId, "test_selection", "completed");

    // Step 6: Mock test execution
    await pipelineService.updateStage(prId, "test_execution", "running");
    await logService.addLog(
      prId,
      "test_execution",
      "Running selected tests...",
    );
    await pipelineService.updateStage(prId, "test_execution", "completed");

    // Step 7: Report — upload to S3
    await pipelineService.updateStage(prId, "report_upload", "running");
    await logService.addLog(
      prId,
      "report_upload",
      "Generating and uploading analysis report",
    );

    const report = {
      prId,
      repo: pr.repo,
      riskScore: riskScoreNorm,
      confidence,
      modulesImpacted: allModules,
      selectedTests,
      skippedTests,
      totalTests,
      duration: new Date() - pr.analysisStartedAt,
      timestamp: new Date(),
    };

    const reportUrl = await s3Service.uploadReport(prId, report);

    await pipelineService.updateStage(prId, "report_upload", "completed");

    // Step 8: Update the PR document with all results
    pr.modulesImpacted = allModules;
    pr.selectedTests = selectedTests;
    pr.skippedTests = skippedTests;
    pr.riskScore = riskScoreNorm;
    pr.confidence = confidence;
    pr.totalTests = totalTests;
    pr.estimatedTimeSaved = Math.floor(Math.random() * 300) + 60; // 60-360 seconds
    pr.status = "completed";
    pr.analysisCompletedAt = new Date();
    pr.analysisDuration = pr.analysisCompletedAt - pr.analysisStartedAt; // ms
    pr.analysisProvider = provider;
    pr.modelVersion = provider === "sagemaker" ? "sagemaker-v1" : "mock-v1";
    pr.reportUrl = reportUrl;
    await pr.save();

    // Step 9: Complete pipeline
    await pipelineService.completePipeline(prId);
    await logService.addLog(
      prId,
      "report_upload",
      `Analysis complete for PR ${prId}`,
    );

    return pr;
  } catch (err) {
    // Fix 1: If anything fails, mark PR and pipeline as failed
    pr.status = "failed";
    await pr.save();
    await pipelineService.completePipeline(prId, "failed");
    await logService.addLog(prId, "error", err.message, "error");
    throw err;
  }
}

module.exports = { analyzePullRequest };
