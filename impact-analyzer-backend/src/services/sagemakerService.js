const {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} = require("@aws-sdk/client-sagemaker-runtime");

const endpoint = process.env.SAGEMAKER_ENDPOINT;
const hasRealEndpoint = endpoint && endpoint !== "dummy" && endpoint !== "your_endpoint_here";

let client;
if (hasRealEndpoint) {
  client = new SageMakerRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}

async function predictRisk(featuresArray) {
  // Skip SageMaker entirely if no real endpoint configured
  if (!hasRealEndpoint) {
    console.log("⚠️ No SageMaker endpoint configured — using intelligent heuristics");
    return null; // Signal to caller to use fallback
  }

  try {
    console.log("🤖 Calling SageMaker endpoint:", endpoint);
    const csvPayload = featuresArray.join(",");
    console.log("📊 CSV payload:", csvPayload);

    const command = new InvokeEndpointCommand({
      EndpointName: endpoint,
      ContentType: "text/csv",
      Body: csvPayload,
    });

    const response = await client.send(command);
    const result = Buffer.from(response.Body).toString();
    console.log("🧠 SageMaker raw response:", result);

    const risk = parseFloat(result);
    if (isNaN(risk)) {
      console.log("⚠️ SageMaker returned non-numeric response, falling back");
      return null;
    }
    return risk;
  } catch (err) {
    console.log("⚠️ SageMaker call failed:", err.message);
    return null; // Signal to use intelligent fallback
  }
}

module.exports = { predictRisk };
