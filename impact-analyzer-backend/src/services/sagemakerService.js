const { sagemakerClient } = require("../config/aws");
const { InvokeEndpointCommand } = require("@aws-sdk/client-sagemaker-runtime");

const ENDPOINT = process.env.SAGEMAKER_ENDPOINT;

// ── Mock fallback ────────────────────────────────────────────
// Used when SAGEMAKER_ENDPOINT is not set or is "dummy"
function mockPredict(payload) {
  const fileCount = payload.filesChanged ? payload.filesChanged.length : 1;
  const base = Math.min(fileCount * 15, 70);
  const random = Math.floor(Math.random() * 30);

  return {
    riskScore: Math.min(base + random, 100),
    confidence: 60 + Math.floor(Math.random() * 30), // 60-89%
    provider: "mock",
  };
}

// ── Main prediction function ─────────────────────────────────
// Calls SageMaker if endpoint is configured, otherwise returns mock
async function predictImpact(payload) {
  // If no real endpoint, use mock
  if (!ENDPOINT || ENDPOINT === "dummy") {
    console.log("🧪 Using mock prediction (no SageMaker endpoint)");
    return mockPredict(payload);
  }

  // Real SageMaker call
  try {
    console.log(`🤖 Calling SageMaker endpoint: ${ENDPOINT}`);

    const command = new InvokeEndpointCommand({
      EndpointName: ENDPOINT,
      ContentType: "application/json",
      Body: JSON.stringify(payload),
    });

    const response = await sagemakerClient.send(command);

    // Parse response body
    const result = JSON.parse(Buffer.from(response.Body).toString());

    return {
      riskScore: result.riskScore || 50,
      confidence: result.confidence || 70,
      provider: "sagemaker",
    };
  } catch (error) {
    // If SageMaker fails, fall back to mock so analysis doesn't break
    console.error("⚠️ SageMaker call failed, falling back to mock:", error.message);
    return mockPredict(payload);
  }
}

module.exports = { predictImpact };
