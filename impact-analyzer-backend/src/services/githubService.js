const axios = require("axios");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "SAMMYB7";
const API_BASE = "https://api.github.com";

// ── Fetch changed files from a GitHub PR ─────────────────────
// Uses GitHub REST API with pagination support.
// GET /repos/{owner}/{repo}/pulls/{prNumber}/files
// Returns: ["src/app.js", "src/api/user.js", ...]
async function getChangedFiles(owner, repo, prNumber) {
  // If no real token, return mock files
  if (
    !GITHUB_TOKEN ||
    GITHUB_TOKEN === "your_token_here" ||
    GITHUB_TOKEN === "dummy"
  ) {
    console.log("🧪 No GitHub token — returning mock changed files");
    return ["src/mock-file-1.js", "src/mock-file-2.js"];
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };

  let allFiles = [];
  let page = 1;
  const perPage = 100; // GitHub max per page

  try {
    while (true) {
      const url = `${API_BASE}/repos/${owner}/${repo}/pulls/${prNumber}/files`;

      const response = await axios.get(url, {
        headers,
        params: { per_page: perPage, page },
      });

      const files = response.data.map((file) => file.filename);
      allFiles = allFiles.concat(files);

      // If we got fewer than perPage results, we've reached the last page
      if (response.data.length < perPage) {
        break;
      }

      page++;
    }

    console.log(
      `📂 Fetched ${allFiles.length} changed files from GitHub (${page} page${page > 1 ? "s" : ""})`,
    );
    return allFiles;
  } catch (error) {
    console.error(
      "⚠️ GitHub API error:",
      error.response?.status,
      error.message,
    );
    // Return empty array on failure so callers can handle gracefully
    return [];
  }
}

module.exports = { getChangedFiles, GITHUB_OWNER };
