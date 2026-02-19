const {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} = require("@aws-sdk/client-sagemaker-runtime");

const client = new SageMakerRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function predictRisk(featuresArray) {
  try {
    console.log(
      "🤖 Calling SageMaker endpoint:",
      process.env.SAGEMAKER_ENDPOINT,
    );

    // Convert features to CSV string
    const csvPayload = featuresArray.join(",");

    console.log("📊 CSV payload:", csvPayload);

    const command = new InvokeEndpointCommand({
      EndpointName: process.env.SAGEMAKER_ENDPOINT,
      ContentType: "text/csv",
      Body: csvPayload,
    });

    const response = await client.send(command);
    const result = Buffer.from(response.Body).toString();

    console.log("🧠 SageMaker raw response:", result);

    // parse numeric prediction
    const risk = parseFloat(result);
    return risk || Math.random();
  } catch (err) {
    console.log("⚠️ SageMaker call failed, falling back to mock:", err.message);
    return Math.random();
  }
}

module.exports = { predictRisk };
