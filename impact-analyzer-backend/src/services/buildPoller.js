const PullRequest = require("../models/PullRequest.model");
const { getBuildStatus } = require("./codebuildService");
const pipelineService = require("./pipelineService");
const logService = require("./logService");
const { uploadReport } = require("./s3Service");

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

        await pipelineService.updateStage(pr.prId, "report_upload", "running");
        await logService.addLog(pr.prId, "test_execution", `Build finished: ${status}`);

        // Generate synthetic test results based on build success since we don't have deeply parsed xmls running yet
        const mockTestResults = pr.selectedTests.map(t => ({
            name: t,
            status: status === "SUCCEEDED" ? "passed" : "failed"
        }));

        await logService.addLog(pr.prId, "test_execution", `Analyzing test output with AI Merge Assessment...`);
        try {
            const { analyzeTestResultsWithAI } = require("./aiService");
            const mergeAnalysis = await analyzeTestResultsWithAI({
                testResults: mockTestResults,
                riskScore: pr.riskScore || 50,
                filesChanged: pr.filesChanged || [],
                modules: pr.modulesImpacted || [],
                commitMessage: pr.commitMessage || ""
            });

            if (mergeAnalysis) {
                pr.testResultsAnalysis = mergeAnalysis;
            } else {
                pr.testResultsAnalysis = {
                    summary: status === "SUCCEEDED" ? "Build passed safely." : "Build failed, tests indicate blocking issues.",
                    isSafeToMerge: status === "SUCCEEDED",
                    mergeConfidence: status === "SUCCEEDED" ? 95 : 10
                };
            }
        } catch (e) {
            console.error("Merge analysis error: ", e);
            pr.testResultsAnalysis = {
                summary: status === "SUCCEEDED" ? "Build passed but AI assessment failed." : "Build failed.",
                isSafeToMerge: status === "SUCCEEDED",
                mergeConfidence: 50
            };
        }

        pr.testExecution = {
            passed: mockTestResults.filter(t => t.status === "passed").length,
            failed: mockTestResults.filter(t => t.status === "failed").length,
            passRate: mockTestResults.length > 0 ? Math.round((mockTestResults.filter(t => t.status === "passed").length / mockTestResults.length) * 100) : 0,
            results: mockTestResults,
            totalDuration: pr.codebuildInfo?.duration || 0
        };

        pr.testExecutionProvider = "codebuild";

        await pipelineService.updateStage(pr.prId, "test_execution", "completed");

        // Generate and upload report to S3
        const reportData = {
            prId: pr.prId,
            repo: pr.repo,
            branch: pr.branch,
            buildStatus: status,
            testResults: pr.testResults,
            selectedTests: pr.selectedTests,
            timestamp: new Date().toISOString()
        };

        const reportUrl = await uploadReport(pr.prId, reportData);
        if (reportUrl) {
            pr.reportUrl = reportUrl;
            await logService.addLog(pr.prId, "report_upload", `Report uploaded to S3: ${reportUrl}`);
        }

        pr.status = "completed";
        await pr.save();

        // Finish pipeline
        await pipelineService.updateStage(pr.prId, "report_upload", "completed");
        await pipelineService.completePipeline(pr.prId);
    }
}

module.exports = { pollBuilds };
