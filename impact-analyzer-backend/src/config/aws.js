const { SageMakerRuntimeClient } = require("@aws-sdk/client-sagemaker-runtime");
const { S3Client } = require("@aws-sdk/client-s3");

const region = process.env.AWS_REGION || "us-east-1";

// SageMaker client — used by sagemakerService to call ML endpoint
const sagemakerClient = new SageMakerRuntimeClient({ region });

// S3 client — used by s3Service to upload/download reports
const s3Client = new S3Client({ region });

module.exports = { sagemakerClient, s3Client, region };
