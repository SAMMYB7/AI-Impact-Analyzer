// ═══════════════════════════════════════════════════════════════
// AI SERVICE — Ollama llama3.1:8b on EC2
// Full AI integration: Risk Analysis + Test Selection + Results
// ═══════════════════════════════════════════════════════════════

const axios = require("axios");

// Ollama API endpoint on EC2
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder-next";
const OLLAMA_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT || "180000", 10);

// ──────────────────────────────────────────────────────────────
// CORE: Send a prompt to Ollama and get a JSON response
// ──────────────────────────────────────────────────────────────
async function callOllama(prompt, tag = "general") {
    try {
        console.log(`🤖 [${tag}] Calling Ollama (${OLLAMA_MODEL}) ...`);

        const response = await axios.post(
            `${OLLAMA_URL}/api/generate`,
            {
                model: OLLAMA_MODEL,
                prompt,
                stream: false,
                format: "json",
                options: {
                    temperature: 0.3,
                    top_p: 0.9,
                    num_predict: 2048,
                },
            },
            {
                timeout: OLLAMA_TIMEOUT,
                headers: { "Content-Type": "application/json" },
            }
        );

        const rawResponse = response.data?.response || "";
        console.log(`🧠 [${tag}] Response length: ${rawResponse.length}`);

        const parsed = parseJSONResponse(rawResponse);
        if (parsed) {
            console.log(`✅ [${tag}] Parsed successfully`);
            return parsed;
        }

        console.log(`⚠️ [${tag}] Could not parse response`);
        return null;
    } catch (err) {
        console.log(`⚠️ [${tag}] Ollama call failed: ${err.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════════
// 1. RISK ANALYSIS — Analyze PR risk level
// ═══════════════════════════════════════════════════════════════
async function analyzeRiskWithAI(context) {
    const { filesChanged, modules, fileClassifications, commitMessage, branch, repo } = context;

    const prompt = `/no_think
You are a senior code review AI. Analyze this pull request and assess its risk level.

## Pull Request Context
- **Repository**: ${repo || "unknown"}
- **Branch**: ${branch || "unknown"}
- **Commit Message**: ${commitMessage || "No message"}
- **Files Changed**: ${filesChanged.length}
- **Modules Impacted**: ${modules.join(", ")}

## Changed Files
${filesChanged.map((f) => `- ${f}`).join("\n")}

## File Category Breakdown
${Object.entries(fileClassifications || {}).map(([cat, count]) => `- ${cat}: ${count} files`).join("\n")}

## Instructions
Analyze the risk of this PR and respond with ONLY a JSON object:

{
  "riskScore": <number 0-100>,
  "confidence": <number 0-100>,
  "riskLevel": "<low|medium|high|critical>",
  "reasoning": "<1-2 sentence explanation of the risk assessment>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>"],
  "criticalFiles": ["<file that needs extra review>"],
  "testPriority": "<unit|integration|e2e|all>"
}

Risk scoring guide:
- 0-25: Low risk (docs, styles, minor tweaks)
- 26-50: Medium risk (new features, refactors)
- 51-75: High risk (API changes, auth, database)
- 76-100: Critical risk (security, payments, config, multi-module breaking changes)`;

    const result = await callOllama(prompt, "risk-analysis");
    if (!result) return null;

    const riskScore = Number(result.riskScore);
    if (isNaN(riskScore) || riskScore < 0 || riskScore > 100) return null;

    return {
        riskScore: Math.round(riskScore),
        confidence: clamp(Number(result.confidence) || 70, 0, 100),
        riskLevel: result.riskLevel || getRiskLevel(riskScore),
        reasoning: result.reasoning || "",
        suggestions: toArray(result.suggestions, 5),
        criticalFiles: toArray(result.criticalFiles, 10),
        testPriority: result.testPriority || "unit",
    };
}

// ═══════════════════════════════════════════════════════════════
// 2. TEST SELECTION — AI decides which tests to run
// ═══════════════════════════════════════════════════════════════
async function selectTestsWithAI(context) {
    const { filesChanged, modules, riskScore, riskLevel, commitMessage, fileClassifications } = context;

    const prompt = `/no_think
You are a test selection AI for a CI/CD pipeline. Based on the pull request changes below, decide which tests should be run and which can be safely skipped.

## PR Context
- **Risk Score**: ${riskScore}/100 (${riskLevel})
- **Commit Message**: ${commitMessage || "No message"}
- **Files Changed** (${filesChanged.length}):
${filesChanged.map((f) => `  - ${f}`).join("\n")}
- **Modules Impacted**: ${modules.join(", ")}
- **File Categories**: ${Object.entries(fileClassifications || {}).map(([k, v]) => `${k}(${v})`).join(", ")}

## Instructions
Decide which tests to select and which to skip. Respond with ONLY a JSON object:

{
  "selectedTests": [
    { "name": "<test file path>", "type": "<unit|integration|e2e|regression>", "reason": "<why this test>" }
  ],
  "skippedTests": [
    { "name": "<test file path>", "reason": "<why skipped>" }
  ],
  "selectionStrategy": "<description of the strategy used>",
  "coverageEstimate": <number 0-100>,
  "recommendedPriority": "<unit-first|integration-first|e2e-first|parallel>"
}

Guidelines:
- Generate realistic test file paths based on the changed files (e.g., src/auth/login.js → tests/auth/login.test.js)
- For high risk (${riskScore}>=60): include integration and e2e tests
- For auth/security files: ALWAYS include integration tests
- For style/doc changes: minimal tests, skip most
- Select 5-20 tests based on change scope`;

    const result = await callOllama(prompt, "test-selection");
    if (!result) return null;

    return {
        selectedTests: Array.isArray(result.selectedTests) ? result.selectedTests.slice(0, 25) : [],
        skippedTests: Array.isArray(result.skippedTests) ? result.skippedTests.slice(0, 15) : [],
        selectionStrategy: result.selectionStrategy || "",
        coverageEstimate: clamp(Number(result.coverageEstimate) || 70, 0, 100),
        recommendedPriority: result.recommendedPriority || "unit-first",
    };
}

// ═══════════════════════════════════════════════════════════════
// 3. TEST RESULTS ANALYSIS — AI interprets execution results
// ═══════════════════════════════════════════════════════════════
async function analyzeTestResultsWithAI(context) {
    const { testResults, riskScore, filesChanged, modules, commitMessage } = context;

    const passedTests = testResults.filter((t) => t.status === "passed");
    const failedTests = testResults.filter((t) => t.status === "failed");

    const prompt = `/no_think
You are a CI/CD test results analyst. Analyze the test execution results for this pull request.

## PR Context
- **Risk Score**: ${riskScore}/100
- **Commit**: ${commitMessage || "No message"}
- **Files Changed**: ${filesChanged.length}
- **Modules**: ${modules.join(", ")}

## Test Execution Summary
- **Total Tests**: ${testResults.length}
- **Passed**: ${passedTests.length}
- **Failed**: ${failedTests.length}
- **Pass Rate**: ${testResults.length > 0 ? Math.round((passedTests.length / testResults.length) * 100) : 0}%

${failedTests.length > 0 ? `## Failed Tests
${failedTests.map((t) => `- ${t.name}: ${t.error?.type || "Error"} — ${t.error?.message || "Unknown"}`).join("\n")}` : "## All tests passed! 🎉"}

## Instructions
Analyze the test results and respond with ONLY a JSON object:

{
  "summary": "<1-2 sentence overall assessment>",
  "isSafeToMerge": <true|false>,
  "mergeConfidence": <number 0-100>,
  "failureAnalysis": "<analysis of why tests failed, if any>",
  "rootCauseGuess": "<likely root cause of failures>",
  "actionItems": ["<next step 1>", "<next step 2>"],
  "coverageGaps": ["<area not covered by tests>"]
}`;

    const result = await callOllama(prompt, "test-results");
    if (!result) return null;

    return {
        summary: result.summary || "",
        isSafeToMerge: typeof result.isSafeToMerge === "boolean" ? result.isSafeToMerge : failedTests.length === 0,
        mergeConfidence: clamp(Number(result.mergeConfidence) || 50, 0, 100),
        failureAnalysis: result.failureAnalysis || "",
        rootCauseGuess: result.rootCauseGuess || "",
        actionItems: toArray(result.actionItems, 5),
        coverageGaps: toArray(result.coverageGaps, 5),
    };
}

// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════
async function checkOllamaHealth() {
    try {
        const res = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
        const models = res.data?.models || [];
        const hasModel = models.some((m) => m.name.includes(OLLAMA_MODEL));
        return {
            available: true,
            url: OLLAMA_URL,
            model: OLLAMA_MODEL,
            modelLoaded: hasModel,
            models: models.map((m) => m.name),
        };
    } catch (err) {
        return {
            available: false,
            url: OLLAMA_URL,
            model: OLLAMA_MODEL,
            error: err.message,
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function parseJSONResponse(raw) {
    if (!raw || typeof raw !== "string") return null;
    try {
        return JSON.parse(raw.trim());
    } catch {
        // Try to extract JSON from mixed text
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch {
                return null;
            }
        }
        return null;
    }
}

function clamp(val, min, max) { return Math.min(max, Math.max(min, Math.round(val))); }
function getRiskLevel(score) { return score >= 76 ? "critical" : score >= 51 ? "high" : score >= 26 ? "medium" : "low"; }
function toArray(val, max) { return Array.isArray(val) ? val.slice(0, max) : []; }

module.exports = {
    analyzeRiskWithAI,
    selectTestsWithAI,
    analyzeTestResultsWithAI,
    checkOllamaHealth,
    OLLAMA_MODEL,
    OLLAMA_URL,
};
