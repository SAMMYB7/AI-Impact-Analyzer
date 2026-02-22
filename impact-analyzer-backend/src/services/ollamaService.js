// ═══════════════════════════════════════════════════════════════
// OLLAMA SERVICE — Dedicated Risk + Impact Prediction
// Returns structured JSON: risk, confidence, impact, summary,
// reason, suggested_tests
// ═══════════════════════════════════════════════════════════════

const axios = require("axios");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
const OLLAMA_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT || "180000", 10);

/**
 * Generate risk + impact analysis using Ollama
 * @param {{ filesChanged: string[], commitMessage: string }} params
 * @returns {Promise<{risk: number, confidence: number, impact: string, summary: string, reason: string, suggested_tests: string[]}>}
 */
async function predictRiskImpact({ filesChanged, commitMessage }) {
    const filesText = filesChanged.map((f) => `- ${f}`).join("\n");

    const prompt = `/no_think
You are an AI system that analyzes pull requests.

Your job:
Estimate risk and impact of code changes.

Rules:
- Risk score: 0 to 100
- Confidence: 0 to 100
- Impact: low, medium, or high
- Respond ONLY in JSON

## Few-Shot Examples

Example 1:
Files:
- src/auth/login.js
- src/auth/session.js
Commit: "fix login bug causing session timeout"
Output:
{"risk":55,"confidence":75,"impact":"high","summary":"Authentication logic modified — login and session handling changed","reason":"Auth files are security-critical; bugs here can lock users out or create vulnerabilities","suggested_tests":["auth/login.test.js","auth/session.test.js","auth/login.integration.test.js"]}

Example 2:
Files:
- docs/README.md
- CHANGELOG.md
Commit: "update readme with new API docs"
Output:
{"risk":5,"confidence":95,"impact":"low","summary":"Documentation files updated — no code logic changed","reason":"Only documentation changed, zero runtime impact","suggested_tests":[]}

Example 3:
Files:
- src/models/User.js
- src/services/paymentService.js
- src/routes/billing.js
Commit: "add subscription billing with Stripe"
Output:
{"risk":85,"confidence":80,"impact":"high","summary":"Payment system added — new billing route, payment service, and user model changes","reason":"Payment and billing are high-risk areas; database schema changes combined with financial logic require thorough testing","suggested_tests":["models/User.test.js","services/paymentService.test.js","routes/billing.test.js","services/paymentService.integration.test.js","e2e/billing.e2e.test.js"]}

## Now Analyze This PR

Changed files:
${filesText}

Commit message:
"${commitMessage}"

Return JSON:
{
  "risk": <number 0-100>,
  "confidence": <number 0-100>,
  "impact": "<low|medium|high>",
  "summary": "<short explanation of what changed>",
  "reason": "<why this is risky or not>",
  "suggested_tests": ["test1","test2"]
}`;

    try {
        console.log(`🤖 Calling Ollama (${OLLAMA_MODEL}) for risk+impact prediction...`);

        const res = await axios.post(
            `${OLLAMA_URL}/api/generate`,
            {
                model: OLLAMA_MODEL,
                prompt,
                stream: false,
                format: "json",
                options: {
                    temperature: 0.2,
                    top_p: 0.9,
                    num_predict: 1024,
                },
            },
            {
                timeout: OLLAMA_TIMEOUT,
                headers: { "Content-Type": "application/json" },
            }
        );

        const text = res.data?.response || res.data?.output || "";
        console.log(`🧠 Ollama response length: ${text.length}`);

        const parsed = parseJSON(text);
        if (parsed && typeof parsed.risk === "number") {
            console.log(`✅ Ollama prediction: risk=${parsed.risk}, confidence=${parsed.confidence}, impact=${parsed.impact}`);
            return {
                risk: clamp(parsed.risk, 0, 100),
                confidence: clamp(parsed.confidence || 50, 0, 100),
                impact: ["low", "medium", "high"].includes(parsed.impact) ? parsed.impact : "medium",
                summary: parsed.summary || "AI analysis completed",
                reason: parsed.reason || "No specific reason provided",
                suggested_tests: Array.isArray(parsed.suggested_tests) ? parsed.suggested_tests.slice(0, 15) : [],
            };
        }

        console.error("⚠️ Ollama returned unparseable response, using fallback");
        return fallbackResult();
    } catch (err) {
        console.error(`❌ Ollama call failed: ${err.message}`);
        return fallbackResult();
    }
}

/**
 * Parse JSON from raw LLM output
 */
function parseJSON(raw) {
    if (!raw || typeof raw !== "string") return null;
    try {
        return JSON.parse(raw.trim());
    } catch {
        // Try to extract JSON object from mixed text
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch {
                return null;
            }
        }
        return null;
    }
}

function clamp(val, min, max) {
    return Math.min(max, Math.max(min, Math.round(val)));
}

/**
 * Fallback result when Ollama is unavailable or returns bad data
 */
function fallbackResult() {
    return {
        risk: 50,
        confidence: 50,
        impact: "medium",
        summary: "Fallback analysis — Ollama unavailable",
        reason: "LLM could not be reached or returned invalid response",
        suggested_tests: [],
    };
}

module.exports = { predictRiskImpact };
