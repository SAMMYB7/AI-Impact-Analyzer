const { S3Client } = require("@aws-sdk/client-s3");
const { CodeBuildClient } = require("@aws-sdk/client-codebuild");

const region = process.env.AWS_REGION || "ap-south-1";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// S3 client — used by s3Service to upload/download reports
const s3Client = new S3Client({ region, credentials });

// CodeBuild client — used to trigger and monitor test execution builds
const codeBuildClient = new CodeBuildClient({ region, credentials });

module.exports = { s3Client, codeBuildClient, region };
