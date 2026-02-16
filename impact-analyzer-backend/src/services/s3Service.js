const { s3Client } = require("../config/aws");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const BUCKET = process.env.S3_BUCKET;

// ── Upload analysis report to S3 ────────────────────────────
// If no bucket configured, just logs and returns a mock URL
async function uploadReport(prId, data) {
  const key = `reports/${prId}.json`;
  const body = JSON.stringify(data, null, 2);

  // If no real bucket, return mock URL
  if (!BUCKET || BUCKET === "dummy") {
    console.log(`🧪 Mock S3 upload: ${key} (${body.length} bytes)`);
    return `https://mock-s3.example.com/${key}`;
  }

  // Real S3 upload
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: "application/json",
    });

    await s3Client.send(command);
    const url = `https://${BUCKET}.s3.amazonaws.com/${key}`;
    console.log(`📤 Report uploaded to S3: ${url}`);
    return url;
  } catch (error) {
    console.error("⚠️ S3 upload failed:", error.message);
    return null;
  }
}

// ── Download report from S3 ─────────────────────────────────
async function getReport(prId) {
  const key = `reports/${prId}.json`;

  // If no real bucket, return mock data
  if (!BUCKET || BUCKET === "dummy") {
    console.log(`🧪 Mock S3 download: ${key}`);
    return { message: "Mock report — no S3 bucket configured" };
  }

  // Real S3 download
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const response = await s3Client.send(command);
    const bodyString = await response.Body.transformToString();
    return JSON.parse(bodyString);
  } catch (error) {
    console.error("⚠️ S3 download failed:", error.message);
    return null;
  }
}

module.exports = { uploadReport, getReport };
