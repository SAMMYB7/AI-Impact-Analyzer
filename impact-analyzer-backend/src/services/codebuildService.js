const { CodeBuildClient, StartBuildCommand, BatchGetBuildsCommand } = require("@aws-sdk/client-codebuild");

const client = new CodeBuildClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY
    }
});

/**
 * Trigger CodeBuild with dynamic overrides
 */
async function runTests(repoUrl, branch, tests) {
    // tests: array of selected test file paths
    const testFilesStr = tests.join(" ");

    const command = new StartBuildCommand({
        projectName: process.env.CODEBUILD_PROJECT_NAME,
        // override repo & branch
        sourceLocationOverride: repoUrl,
        sourceVersion: branch,
        environmentVariablesOverride: [
            { name: "REPO_URL", value: repoUrl, type: "PLAINTEXT" },
            { name: "BRANCH", value: branch, type: "PLAINTEXT" },
            { name: "TEST_FILES", value: testFilesStr, type: "PLAINTEXT" }
        ],
        buildspecOverride: `
version: 0.2

phases:
  install:
    commands:
      - echo "Cloning repo"
      - git clone $REPO_URL repo
      - cd repo
      - git checkout $BRANCH
      - npm install

  build:
    commands:
      - echo "Running tests"
      - echo $TEST_FILES
      - npm test -- $TEST_FILES
`
    });

    const res = await client.send(command);
    return res.build;
}

/**
 * Get CodeBuild status & results
 */
async function getBuildStatus(buildId) {
    const cmd = new BatchGetBuildsCommand({ ids: [buildId] });
    const res = await client.send(cmd);
    return res.builds && res.builds.length ? res.builds[0] : null;
}

module.exports = { runTests, getBuildStatus };
