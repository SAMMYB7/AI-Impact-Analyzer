const PullRequest = require("../models/PullRequest.model");
const { getBuildStatus } = require("./codebuildService");
const pipelineService = require("./pipelineService");
const logService = require("./logService");

async function pollBuilds() {
    const prs = await PullRequest.find({
        buildId: { $exists: true },
        buildCompleted: { $ne: true }
    });

    for (const pr of prs) {
        const build = await getBuildStatus(pr.buildId);
        if (!build) continue;

        if (build.buildStatus === "IN_PROGRESS") continue;

        // Build has finished
        const status = build.buildStatus; // SUCCEEDED / FAILED
        pr.buildStatus = status;

        // Estimate pass / fail from logs (simplest)
        let passed = 0;
        let failed = 0;

        // Example: count test file runs from logs (optional)
        // For now, mark everything as passed if status=SUCCEEDED
        if (status === "SUCCEEDED") passed = pr.selectedTests.length;
        else failed = pr.selectedTests.length;

        pr.testResults = { passed, failed };
        pr.buildCompleted = true;
        await pr.save();

        await pipelineService.updateStage(pr.prId, "report_upload", "running");
        await logService.addLog(pr.prId, "test_execution", `Build finished: ${status}`);
        await pipelineService.updateStage(pr.prId, "test_execution", "completed");

        pr.status = "completed";
        await pr.save();

        // Finish pipeline
        await pipelineService.updateStage(pr.prId, "report_upload", "completed");
        await pipelineService.completePipeline(pr.prId);
    }
}

module.exports = { pollBuilds };
