// ═══════════════════════════════════════════════════════════════
// CODEBUILD SERVICE — Trigger & monitor test execution on AWS
// ═══════════════════════════════════════════════════════════════

const {
    StartBuildCommand,
    BatchGetBuildsCommand,
} = require("@aws-sdk/client-codebuild");
const { codeBuildClient } = require("../config/aws");

const CODEBUILD_PROJECT = process.env.CODEBUILD_PROJECT_NAME || "";
const POLL_INTERVAL = parseInt(process.env.CODEBUILD_POLL_INTERVAL || "10000", 10); // 10s default
const MAX_POLL_TIME = parseInt(process.env.CODEBUILD_MAX_WAIT || "600000", 10); // 10 min max

/**
 * Check if CodeBuild is configured
 */
function isCodeBuildConfigured() {
    return Boolean(CODEBUILD_PROJECT && CODEBUILD_PROJECT !== "your_project_name");
}

/**
 * Start a CodeBuild build to run the selected tests
 *
 * @param {Object} params
 * @param {string} params.prId — PR identifier
 * @param {string} params.repo — GitHub repo (owner/name)
 * @param {string} params.branch — branch to test
 * @param {string[]} params.selectedTests — list of test file paths to run
 * @param {string} params.commitMessage — commit message
 * @returns {Object} — { buildId, buildArn, status }
 */
async function startTestBuild({ prId, repo, branch, selectedTests, commitMessage }) {
    if (!isCodeBuildConfigured()) {
        console.log("⚠️ CodeBuild not configured — returning mock build");
        return null;
    }

    console.log(`🏗️ Starting CodeBuild for PR ${prId} — ${selectedTests.length} tests`);

    // Pass selected tests as env variable (comma-separated)
    // The buildspec.yml in the project should read TEST_FILES and run only those
    const envVars = [
        { name: "PR_ID", value: prId, type: "PLAINTEXT" },
        { name: "BRANCH", value: branch || "main", type: "PLAINTEXT" },
        { name: "COMMIT_MESSAGE", value: (commitMessage || "").substring(0, 250), type: "PLAINTEXT" },
        { name: "TEST_FILES", value: selectedTests.join(","), type: "PLAINTEXT" },
        { name: "TEST_COUNT", value: String(selectedTests.length), type: "PLAINTEXT" },
        { name: "REPO", value: repo || "", type: "PLAINTEXT" },
    ];

    try {
        const command = new StartBuildCommand({
            projectName: CODEBUILD_PROJECT,
            environmentVariablesOverride: envVars,
            sourceVersion: branch || "main",
        });

        const response = await codeBuildClient.send(command);
        const build = response.build;

        console.log(`✅ CodeBuild started: ${build.id} (status: ${build.buildStatus})`);

        return {
            buildId: build.id,
            buildArn: build.arn,
            status: build.buildStatus,
            startTime: build.startTime,
            projectName: CODEBUILD_PROJECT,
        };
    } catch (err) {
        console.error("❌ CodeBuild start failed:", err.message);
        throw new Error(`CodeBuild start failed: ${err.message}`);
    }
}

/**
 * Get build status from CodeBuild
 *
 * @param {string} buildId — CodeBuild build ID
 * @returns {Object} — build details
 */
async function getBuildStatus(buildId) {
    try {
        const command = new BatchGetBuildsCommand({ ids: [buildId] });
        const response = await codeBuildClient.send(command);
        const build = response.builds?.[0];

        if (!build) throw new Error(`Build not found: ${buildId}`);

        return {
            buildId: build.id,
            status: build.buildStatus, // SUCCEEDED, FAILED, IN_PROGRESS, STOPPED, TIMED_OUT
            startTime: build.startTime,
            endTime: build.endTime,
            duration: build.endTime && build.startTime
                ? Math.round((new Date(build.endTime) - new Date(build.startTime)) / 1000)
                : 0,
            phases: (build.phases || []).map((p) => ({
                name: p.phaseType,
                status: p.phaseStatus,
                duration: p.durationInSeconds || 0,
            })),
            logs: {
                groupName: build.logs?.groupName,
                streamName: build.logs?.streamName,
                deepLink: build.logs?.deepLink,
            },
            artifacts: {
                location: build.artifacts?.location,
            },
            environment: build.environment,
        };
    } catch (err) {
        console.error("❌ CodeBuild status check failed:", err.message);
        throw err;
    }
}

/**
 * Poll CodeBuild until build completes or times out
 *
 * @param {string} buildId — CodeBuild build ID
 * @param {Function} onUpdate — callback for status updates (optional)
 * @returns {Object} — final build status
 */
async function waitForBuild(buildId, onUpdate) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < MAX_POLL_TIME) {
        const status = await getBuildStatus(buildId);

        if (onUpdate) onUpdate(status);

        // Terminal states
        if (["SUCCEEDED", "FAILED", "FAULT", "TIMED_OUT", "STOPPED"].includes(status.status)) {
            console.log(`🏁 CodeBuild ${buildId} finished: ${status.status} (${status.duration}s)`);
            return status;
        }

        // Still running — wait and poll again
        console.log(`⏳ CodeBuild ${buildId} still running... (${Math.round((Date.now() - startedAt) / 1000)}s)`);
        await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    }

    // Timed out on our side
    const finalStatus = await getBuildStatus(buildId);
    console.log(`⏰ CodeBuild poll timeout for ${buildId} — last status: ${finalStatus.status}`);
    return { ...finalStatus, timedOut: true };
}

/**
 * Parse test results from CodeBuild reports/artifacts
 * This looks for a test-results.json in the build artifacts
 *
 * @param {Object} buildStatus — the final build status
 * @returns {Object} — parsed test results
 */
function parseTestResults(buildStatus) {
    // CodeBuild provides phases which we can map to our test result structure
    const buildPassed = buildStatus.status === "SUCCEEDED";

    return {
        buildId: buildStatus.buildId,
        buildStatus: buildStatus.status,
        buildDuration: buildStatus.duration,
        passed: buildPassed,
        phases: buildStatus.phases,
        logs: buildStatus.logs,
        artifacts: buildStatus.artifacts,
    };
}

module.exports = {
    isCodeBuildConfigured,
    startTestBuild,
    getBuildStatus,
    waitForBuild,
    parseTestResults,
};
