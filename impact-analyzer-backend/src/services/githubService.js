const axios = require("axios");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const API_BASE = "https://api.github.com";

// ── Fetch changed files from a GitHub PR ─────────────────────
// Uses GitHub REST API: GET /repos/{owner}/{repo}/pulls/{prNumber}/files
// If no token is set, returns mock files instead.
async function getChangedFiles(owner, repo, prNumber) {
  // If no real token, return mock files
  if (!GITHUB_TOKEN || GITHUB_TOKEN === "your_token_here") {
    console.log("🧪 No GitHub token — returning mock changed files");
    return ["src/mock-file-1.js", "src/mock-file-2.js"];
  }

  try {
    const url = `${API_BASE}/repos/${owner}/${repo}/pulls/${prNumber}/files`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    // Each file object has a "filename" property
    const files = response.data.map((file) => file.filename);
    console.log(`📂 Fetched ${files.length} changed files from GitHub`);
    return files;
  } catch (error) {
    console.error("⚠️ GitHub API error:", error.message);
    return ["placeholder.js"];
  }
}

module.exports = { getChangedFiles };
