# 🧠 PHASE-4 GOAL

Turn the backend into a cloud-native service that can later plug into real AWS instantly.

We will add:

### 1️⃣ SageMaker integration layer (stub now)

### 2️⃣ S3 report storage

### 3️⃣ Replace mock risk generator with ML call wrapper

### 4️⃣ Pipeline execution abstraction

We will NOT call real SageMaker yet.
We just create the service so when endpoint exists, it works immediately.

---

# 🏗️ PHASE-4 ARCHITECTURE

New services:

```
src/services/
  sagemakerService.js
  s3Service.js
  awsConfig.js
```

Analyzer flow becomes:

```
analyzerService
   ↓
sagemakerService.predictImpact()
   ↓
returns risk score
```

If endpoint not ready → fallback to mock.

This makes backend **plug-and-play**.

---

# 🟣 STEP 1 — AWS CONFIG FILE

Create:

```
src/config/aws.js
```

This centralizes AWS setup.

---

## 🤖 Copilot prompt

Paste:

```
Create AWS config module.

Requirements:
- load region from env
- export sagemaker client
- export s3 client
- use AWS SDK v3
- do not call endpoints yet
```

It should generate something like:

```
SageMakerRuntimeClient
S3Client
```

We keep it clean.

---

# 🟣 STEP 2 — SAGEMAKER SERVICE (STUB)

Create:

```
src/services/sagemakerService.js
```

This will wrap ML inference.

---

## 🤖 Copilot prompt

```
Create sagemakerService.

Function:
predictImpact(payload)

If SAGEMAKER_ENDPOINT not set:
- return mock risk score

If endpoint exists:
- call SageMaker runtime invokeEndpoint
- return riskScore + confidence

Do not crash if endpoint missing.
```

This allows:

* development without SageMaker
* instant plug later

---

# 🟣 STEP 3 — S3 SERVICE

Create:

```
src/services/s3Service.js
```

Used for:

* storing reports
* logs
* metrics

---

## 🤖 Copilot prompt

```
Create s3Service.

Functions:
uploadReport(prId, data)
getReport(prId)

Use S3 client from aws config.
If S3 bucket not set:
- just log and return mock URL
```

---

# 🟣 STEP 4 — MODIFY ANALYZER SERVICE

Right now you use:

```
mockRiskScore()
```

Replace with:

```
const { predictImpact } = require("./sagemakerService");
```

Then:

```
const { riskScore, confidence } = await predictImpact({
  filesChanged: pr.filesChanged,
  modules: allModules
});
```

If endpoint missing → returns mock.

So analyzer becomes AWS-ready.

---

# 🟣 STEP 5 — REPORT STORAGE

After analysis completes:

```
await s3Service.uploadReport(prId, {
  riskScore,
  modules,
  tests
});
```

Store JSON.

Later frontend can fetch.

---

# 🧠 WHY THIS MATTERS

Your architecture is supposed to be:

```
GitHub → backend → SageMaker → CodeBuild → S3 → dashboard
```

Right now you only need:

```
backend → SageMaker → S3
```

Which is Phase-4.

This aligns with your system plan where SageMaker predicts impact and S3 stores results. 

---

# 🟢 PHASE-4 ORDER

Follow exactly:

### Step 1

aws.js config

### Step 2

sagemakerService stub

### Step 3

s3Service stub

### Step 4

modify analyzerService

### Step 5

test with simulated PR

---