const PullRequest = require("../models/PullRequest.model");
const TestMapping = require("../models/TestMapping.model");
const pipelineService = require("./pipelineService");
const logService = require("./logService");
const { analyzeRiskWithAI, selectTestsWithAI, analyzeTestResultsWithAI, OLLAMA_MODEL } = require("./aiService");
const { predictRiskImpact } = require("./ollamaService");
const codebuildService = require("./codebuildService");
const s3Service = require("./s3Service");

// ══════════════════════════════════════════════════════════════
// FILE CLASSIFICATION ENGINE
// Classifies files by type, risk, and module mapping
// ══════════════════════════════════════════════════════════════

const FILE_RISK_WEIGHTS = {
  config: { weight: 0.9, patterns: [/\.env/, /config\//i, /settings\//i, /\.yml$/, /\.yaml$/, /docker/i, /nginx/i] },
  auth: { weight: 0.95, patterns: [/auth/i, /login/i, /session/i, /token/i, /password/i, /oauth/i, /jwt/i, /permission/i] },
  database: { weight: 0.85, patterns: [/model/i, /schema/i, /migration/i, /seed/i, /\.sql$/, /prisma/i, /mongoose/i] },
  payment: { weight: 0.95, patterns: [/payment/i, /billing/i, /stripe/i, /invoice/i, /checkout/i] },
  security: { weight: 0.9, patterns: [/security/i, /encrypt/i, /middleware\/auth/i, /cors/i, /helmet/i, /csrf/i] },
  api: { weight: 0.75, patterns: [/route/i, /controller/i, /endpoint/i, /handler/i, /api\//i] },
  service: { weight: 0.6, patterns: [/service/i, /provider/i, /helper/i, /util/i] },
  component: { weight: 0.5, patterns: [/component/i, /\.jsx$/, /\.tsx$/, /\.vue$/] },
  hook: { weight: 0.55, patterns: [/hook/i, /use[A-Z]/] },
  state: { weight: 0.65, patterns: [/store/i, /context/i, /reducer/i, /redux/i, /state/i] },
  style: { weight: 0.15, patterns: [/\.css$/, /\.scss$/, /\.less$/, /\.styled/, /style/i, /theme/i] },
  test: { weight: 0.2, patterns: [/\.test\./i, /\.spec\./i, /\_\_test/i, /__mocks__/i, /fixture/i] },
  docs: { weight: 0.1, patterns: [/\.md$/, /readme/i, /docs\//i, /\.txt$/, /changelog/i, /license/i] },
  asset: { weight: 0.05, patterns: [/\.png$/, /\.jpg$/, /\.svg$/, /\.gif$/, /\.ico$/, /\.woff/] },
  ci: { weight: 0.3, patterns: [/\.github\//i, /\.gitlab/i, /jenkins/i, /\.circleci/i, /workflow/i] },
};

function classifyFile(filePath) {
  const normalized = filePath.toLowerCase().replace(/\\/g, "/");
  for (const [category, config] of Object.entries(FILE_RISK_WEIGHTS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalized)) {
        return { category, weight: config.weight };
      }
    }
  }
  if (/\.(js|ts|py|java|go|rb|php|rs|c|cpp|cs)$/i.test(normalized)) {
    return { category: "source", weight: 0.5 };
  }
  return { category: "other", weight: 0.3 };
}

// ══════════════════════════════════════════════════════════════
// MODULE EXTRACTION
// ══════════════════════════════════════════════════════════════

function getModuleFromPath(filePath) {
  const parts = filePath.replace(/\\/g, "/").split("/").filter(Boolean);
  const skipRoots = ["src", "lib", "app", "packages", "internal", "cmd", "pkg"];
  let startIdx = 0;
  if (parts.length > 1 && skipRoots.includes(parts[0])) startIdx = 1;
  return parts.length > startIdx ? parts[startIdx] : parts[0] || "root";
}

// ══════════════════════════════════════════════════════════════
// HEURISTIC RISK SCORING (Fallback when Ollama is unavailable)
// ══════════════════════════════════════════════════════════════

function computeHeuristicRisk(filesChanged, commitMessage = "") {
  if (!filesChanged || filesChanged.length === 0) {
    return { riskScore: 10, confidence: 30, breakdown: {} };
  }

  const classifications = filesChanged.map(classifyFile);
  const maxWeight = Math.max(...classifications.map((c) => c.weight));
  const avgWeight = classifications.reduce((s, c) => s + c.weight, 0) / classifications.length;
  const fileRisk = Math.round((maxWeight * 0.6 + avgWeight * 0.4) * 100);

  const fileCount = filesChanged.length;
  let volumeRisk;
  if (fileCount <= 2) volumeRisk = 10;
  else if (fileCount <= 5) volumeRisk = 25;
  else if (fileCount <= 10) volumeRisk = 45;
  else if (fileCount <= 20) volumeRisk = 65;
  else if (fileCount <= 50) volumeRisk = 80;
  else volumeRisk = 95;

  const modules = [...new Set(filesChanged.map(getModuleFromPath))];
  const spreadRisk = Math.min(100, modules.length * 15);

  const criticalCategories = ["auth", "payment", "security", "database", "config"];
  const criticalFiles = classifications.filter((c) => criticalCategories.includes(c.category));
  const criticalRisk = criticalFiles.length > 0 ? Math.min(100, 50 + criticalFiles.length * 15) : 0;

  let commitRisk = 30;
  const lowerMsg = (commitMessage || "").toLowerCase();
  if (["fix", "bug", "hotfix", "critical", "urgent", "security", "patch", "revert"].some((w) => lowerMsg.includes(w))) commitRisk = 70;
  if (["docs", "readme", "chore", "style", "format", "lint", "typo", "refactor"].some((w) => lowerMsg.includes(w))) commitRisk = 15;

  const riskScore = Math.round(fileRisk * 0.30 + volumeRisk * 0.20 + spreadRisk * 0.15 + criticalRisk * 0.25 + commitRisk * 0.10);
  const signalStrength = Math.abs(riskScore - 50);
  const confidence = Math.min(95, Math.max(40, 55 + Math.round(signalStrength * 0.6)));

  return {
    riskScore: Math.min(100, Math.max(0, riskScore)),
    confidence,
    breakdown: { fileRisk, volumeRisk, spreadRisk, criticalRisk, commitRisk },
  };
}

// ══════════════════════════════════════════════════════════════
// HEURISTIC TEST SELECTION (Fallback)
// ══════════════════════════════════════════════════════════════

function selectTestsHeuristic(filesChanged, modulesImpacted, dbMappings, riskScore) {
  const selectedTests = [];
  const skippedTests = [];
  const testDetails = [];

  // DB mappings
  dbMappings.forEach((m) => {
    m.relatedTests.forEach((test) => {
      if (!selectedTests.includes(test)) {
        selectedTests.push(test);
        testDetails.push({ name: test, type: "unit", reason: `DB mapping for ${m.module}` });
      }
    });
  });

  // Auto-mapped from file paths
  filesChanged.forEach((file) => {
    const { category } = classifyFile(file);
    const mod = getModuleFromPath(file);
    const baseName = file.split("/").pop().replace(/\.\w+$/, "");
    if (["test", "docs", "asset", "style"].includes(category)) return;

    const unitTest = `${mod}/${baseName}.test.js`;
    if (!selectedTests.includes(unitTest)) {
      selectedTests.push(unitTest);
      testDetails.push({ name: unitTest, type: "unit", reason: `Unit test for ${file}` });
    }

    if (["auth", "api", "database", "payment", "security", "service"].includes(category)) {
      const integTest = `${mod}/${baseName}.integration.test.js`;
      if (!selectedTests.includes(integTest)) {
        selectedTests.push(integTest);
        testDetails.push({ name: integTest, type: "integration", reason: `Integration test for ${category} file` });
      }
    }
  });

  // Regression tests
  modulesImpacted.forEach((mod) => {
    const regressionTest = `${mod}/regression.test.js`;
    if (riskScore >= 40 || modulesImpacted.length <= 3) {
      if (!selectedTests.includes(regressionTest)) {
        selectedTests.push(regressionTest);
        testDetails.push({ name: regressionTest, type: "regression", reason: `Regression for ${mod}` });
      }
    } else {
      skippedTests.push({ name: regressionTest, reason: "Low risk, skipped regression" });
    }
  });

  // E2E for high risk
  if (riskScore >= 60) {
    modulesImpacted.slice(0, 3).forEach((mod) => {
      const e2e = `e2e/${mod}.e2e.test.js`;
      if (!selectedTests.includes(e2e)) {
        selectedTests.push(e2e);
        testDetails.push({ name: e2e, type: "e2e", reason: `E2E for high-risk module (${riskScore}%)` });
      }
    });
  }

  return {
    selectedTests: testDetails,
    skippedTests,
    selectionStrategy: "heuristic-engine: file classification + risk-based selection",
    coverageEstimate: Math.min(95, 50 + selectedTests.length * 3),
    recommendedPriority: riskScore >= 60 ? "integration-first" : "unit-first",
  };
}

// ══════════════════════════════════════════════════════════════
// TEST EXECUTION SIMULATOR
// ══════════════════════════════════════════════════════════════

function simulateTestExecution(selectedTests, riskScore) {
  const executionResults = selectedTests.map((test) => {
    const testName = typeof test === "string" ? test : test.name;
    const testType = typeof test === "string" ? "unit" : (test.type || "unit");

    let baseTime;
    if (testType === "e2e") baseTime = 2000 + Math.random() * 5000;
    else if (testType === "integration") baseTime = 500 + Math.random() * 2000;
    else baseTime = 50 + Math.random() * 500;

    const failProbability = Math.min(0.3, (riskScore / 100) * 0.25);
    const passed = Math.random() > failProbability;
    const assertionCount = Math.floor(Math.random() * 15) + 3;
    const passedAssertions = passed ? assertionCount : Math.floor(assertionCount * (0.5 + Math.random() * 0.4));

    return {
      name: testName,
      status: passed ? "passed" : "failed",
      duration: Math.round(baseTime),
      assertions: { total: assertionCount, passed: passedAssertions, failed: assertionCount - passedAssertions },
      module: testName.split("/")[0] || "unknown",
      source: typeof test === "string" ? "auto_mapped" : "ai_selected",
      priority: testType === "e2e" ? 1 : testType === "integration" ? 1 : 2,
      ...(passed ? {} : { error: generateTestError(testName) }),
    };
  });

  const totalDuration = executionResults.reduce((s, r) => s + r.duration, 0);
  const passed = executionResults.filter((r) => r.status === "passed").length;
  const failed = executionResults.filter((r) => r.status === "failed").length;
  const fullSuiteEstimate = totalDuration * 3.5;
  const timeSaved = Math.round((fullSuiteEstimate - totalDuration) / 1000);

  return {
    results: executionResults,
    summary: {
      total: executionResults.length,
      passed,
      failed,
      passRate: executionResults.length > 0 ? Math.round((passed / executionResults.length) * 100) : 0,
      totalDuration,
      timeSaved: Math.max(30, timeSaved),
    },
  };
}

function generateTestError(testName) {
  const errors = [
    { message: "Expected value to be truthy, received false", type: "AssertionError" },
    { message: "Cannot read properties of undefined (reading 'id')", type: "TypeError" },
    { message: "Async operation timed out after 5000ms", type: "TimeoutError" },
    { message: "Expected status 200, received 401", type: "AssertionError" },
    { message: "Database connection refused", type: "ConnectionError" },
    { message: "Module not found: './missing-dep'", type: "ModuleNotFoundError" },
    { message: "Snapshot does not match stored snapshot", type: "SnapshotMismatch" },
    { message: "Expected array length 3, received 0", type: "AssertionError" },
  ];
  return errors[Math.floor(Math.random() * errors.length)];
}

// ══════════════════════════════════════════════════════════════
// MAIN ANALYSIS PIPELINE
// classify → AI risk → AI test select → execute → AI analyze → report
// ══════════════════════════════════════════════════════════════

async function analyzePullRequest(prId) {
  const pr = await PullRequest.findOne({ prId });
  if (!pr) throw new Error(`PR not found: ${prId}`);
  if (pr.status !== "received") throw new Error(`PR already processed (status: ${pr.status})`);

  try {
    // ── STAGE 1: Fetch & Classify Changes ──────────────────
    pr.status = "analyzing";
    pr.analysisStartedAt = new Date();
    await pr.save();

    await pipelineService.updateStage(prId, "fetch_changes", "running");
    await logService.addLog(prId, "fetch_changes", `Starting analysis for PR ${prId} — ${pr.filesChanged.length} files`);

    const fileClassifications = pr.filesChanged.map((file) => ({ file, ...classifyFile(file) }));
    const categoryBreakdown = {};
    fileClassifications.forEach(({ category }) => {
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    await logService.addLog(prId, "fetch_changes", `File classification: ${Object.entries(categoryBreakdown).map(([k, v]) => `${k}(${v})`).join(", ")}`);
    await pipelineService.updateStage(prId, "fetch_changes", "completed");

    // ── STAGE 2: Dependency & Module Mapping ───────────────
    await pipelineService.updateStage(prId, "dependency_mapping", "running");

    const dbMappings = await TestMapping.find({ filePath: { $in: pr.filesChanged } });
    const modulesFromDB = dbMappings.map((m) => m.module);
    const modulesFromPath = pr.filesChanged.map(getModuleFromPath);
    const allModules = [...new Set([...modulesFromDB, ...modulesFromPath])];

    await logService.addLog(prId, "dependency_mapping", `Mapped ${pr.filesChanged.length} files → ${allModules.length} modules: ${allModules.join(", ")}`);
    await pipelineService.updateStage(prId, "dependency_mapping", "completed");

    // ── STAGE 3: AI Risk Prediction ────────────────────────
    await pipelineService.updateStage(prId, "risk_prediction", "running");

    let riskScore, confidence, provider, riskBreakdown;
    let aiReasoning = "";
    let aiSuggestions = [];
    let riskLevel = "medium";
    let impactLevel = "medium";
    let aiSummary = "";
    let aiReason = "";
    let ollamaSuggestedTests = [];

    const aiContext = {
      filesChanged: pr.filesChanged,
      modules: allModules,
      fileClassifications: categoryBreakdown,
      commitMessage: pr.commitMessage || pr.branch || "",
      branch: pr.branch,
      repo: pr.repo,
    };

    // Call AI services sequentially for richer analysis (prevents overloading EC2 instance)
    await logService.addLog(prId, "risk_prediction", `🤖 Calling Ollama AI (${OLLAMA_MODEL}) for risk analysis...`);

    const aiRiskResult = await analyzeRiskWithAI(aiContext);

    await logService.addLog(prId, "risk_prediction", `🤖 Calling Ollama AI (${OLLAMA_MODEL}) for impact prediction...`);

    const ollamaResult = await predictRiskImpact({
      filesChanged: pr.filesChanged,
      commitMessage: pr.commitMessage || "",
    });

    // Process predictRiskImpact result (structured impact data)
    if (ollamaResult) {
      impactLevel = ollamaResult.impact || "medium";
      aiSummary = ollamaResult.summary || "";
      aiReason = ollamaResult.reason || "";
      ollamaSuggestedTests = ollamaResult.suggested_tests || [];

      await logService.addLog(prId, "risk_prediction", `🧠 Ollama Impact: ${impactLevel} | Summary: ${aiSummary}`);
      if (aiReason) {
        await logService.addLog(prId, "risk_prediction", `🧠 Ollama Reason: ${aiReason}`);
      }
    }

    // Process analyzeRiskWithAI result (detailed risk breakdown)
    if (aiRiskResult) {
      riskScore = aiRiskResult.riskScore;
      confidence = aiRiskResult.confidence;
      riskLevel = aiRiskResult.riskLevel;
      provider = `ollama/${OLLAMA_MODEL}`;
      riskBreakdown = {
        source: "ollama",
        riskLevel: aiRiskResult.riskLevel,
        criticalFiles: aiRiskResult.criticalFiles,
        testPriority: aiRiskResult.testPriority,
      };
      aiReasoning = aiRiskResult.reasoning;
      aiSuggestions = aiRiskResult.suggestions;

      await logService.addLog(prId, "risk_prediction", `AI Reasoning: ${aiReasoning}`);
      if (aiSuggestions.length > 0) {
        await logService.addLog(prId, "risk_prediction", `AI Suggestions: ${aiSuggestions.join(" | ")}`);
      }
    } else if (ollamaResult && ollamaResult.risk !== undefined) {
      // Fall back to ollamaService result if aiService failed
      riskScore = Math.round(ollamaResult.risk);
      confidence = Math.round(ollamaResult.confidence);
      riskLevel = riskScore >= 76 ? "critical" : riskScore >= 51 ? "high" : riskScore >= 26 ? "medium" : "low";
      provider = `ollama/${OLLAMA_MODEL}`;
      riskBreakdown = { source: "ollama-predict", impact: impactLevel };
      aiReasoning = aiReason;
    } else {
      await logService.addLog(prId, "risk_prediction", "Ollama unavailable — using heuristic engine");
      const hResult = computeHeuristicRisk(pr.filesChanged, pr.commitMessage);
      riskScore = hResult.riskScore;
      confidence = hResult.confidence;
      riskLevel = riskScore >= 76 ? "critical" : riskScore >= 51 ? "high" : riskScore >= 26 ? "medium" : "low";
      provider = "heuristic-engine";
      riskBreakdown = hResult.breakdown;
    }

    riskScore = Math.min(100, Math.max(0, riskScore));
    await logService.addLog(prId, "risk_prediction", `🤖 AI risk: ${riskScore} (${impactLevel}) | Risk Level: ${riskLevel} | Confidence: ${confidence}% | Provider: ${provider}`);

    if (riskBreakdown && riskBreakdown.source !== "ollama" && riskBreakdown.source !== "ollama-predict") {
      await logService.addLog(prId, "risk_prediction", `Breakdown — File: ${riskBreakdown.fileRisk}%, Volume: ${riskBreakdown.volumeRisk}%, Spread: ${riskBreakdown.spreadRisk}%, Critical: ${riskBreakdown.criticalRisk}%, Commit: ${riskBreakdown.commitRisk}%`);
    }

    // ── STAGE 4: Test Selection (Database Mapping) ─────────
    await pipelineService.updateStage(prId, "test_selection", "running");

    let selectedTestDetails = [];
    let skippedTestDetails = [];
    let selectionStrategy = "database-mapping";
    let coverageEstimate = 85;
    let recommendedPriority = riskScore >= 60 ? "integration-first" : "unit-first";
    let testSelectionProvider = "database";

    await logService.addLog(prId, "test_selection", `Fetching mapped tests from database based on impacted files...`);

    // Ensure all tests from TestMapping are included
    dbMappings.forEach((m) => {
      if (m.relatedTests) {
        m.relatedTests.forEach((t) => {
          selectedTestDetails.push({ name: t, type: "unit", reason: `DB mapping for ${m.module}` });
        });
      }
    });

    let selectedTestNames = selectedTestDetails.map((t) => typeof t === "string" ? t : t.name);
    const skippedTestNames = skippedTestDetails.map((t) => typeof t === "string" ? t : t.name);

    // Filter duplicates explicitly
    selectedTestNames = [...new Set(selectedTestNames)];

    await logService.addLog(prId, "test_selection", `Selection Strategy: ${selectionStrategy}`);
    await logService.addLog(prId, "test_selection", `Selected: ${selectedTestNames.length} | Skipped: ${skippedTestNames.length} | Priority: ${recommendedPriority}`);
    await pipelineService.updateStage(prId, "test_selection", "completed");

    // ── STAGE 5: Test Execution (CodeBuild Integration) ───
    await pipelineService.updateStage(prId, "test_execution", "running");
    await logService.addLog(prId, "test_execution", `Executing ${selectedTestNames.length} selected tests...`);

    const { runTests } = require("./codebuildService");

    // Safe fallback for repo names if pr fields are missing
    const githubUrl = `https://github.com/${pr.repoOwner || pr.repo.split('/')[0]}/${pr.repoName || pr.repo.split('/')[1]}.git`;

    const build = await runTests(
      githubUrl,
      pr.branch || "main",
      selectedTestNames
    );

    pr.buildId = build.id;
    pr.buildStatus = build.buildStatus || "STARTED";

    // Save all initial analysis before finishing and handing off to poller
    pr.modulesImpacted = allModules;
    pr.riskScore = riskScore;
    pr.confidence = confidence;
    pr.impactLevel = impactLevel;
    pr.aiSummary = aiSummary;
    pr.aiReason = aiReason;

    pr.selectedTests = selectedTestNames;
    pr.skippedTests = skippedTestNames;
    pr.totalTests = pr.selectedTests.length + skippedTestNames.length;
    pr.fileClassifications = categoryBreakdown;
    pr.riskLevel = riskLevel;
    pr.analysisProvider = provider;
    pr.status = "running"; // Set strictly so the UI knows tests are executing

    await pr.save();

    await pipelineService.updateStage(prId, "test_execution", "triggered");
    await logService.addLog(prId, "test_execution", `Build started: ${build.id}`);

    // Wait for the background buildPoller to complete the final steps.
    return pr;
  } catch (err) {
    pr.status = "failed";
    await pr.save();
    await pipelineService.completePipeline(prId, "failed");
    await logService.addLog(prId, "error", err.message, "error");
    throw err;
  }
}

module.exports = { analyzePullRequest };
