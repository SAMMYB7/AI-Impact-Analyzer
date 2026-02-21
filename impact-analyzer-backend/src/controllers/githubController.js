const User = require("../models/User.model");
const axios = require("axios");

const GITHUB_API = "https://api.github.com";

// Helper: get user's GitHub access token
async function getGithubToken(userId) {
    const user = await User.findById(userId).select("+githubAccessToken");
    if (!user || !user.githubAccessToken) {
        return null;
    }
    return user.githubAccessToken;
}

// Helper: GitHub API request with auth
async function githubGet(url, token, params = {}) {
    const res = await axios.get(url, {
        headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
        },
        params,
    });
    return res.data;
}

// ══════════════════════════════════════════════════════════════
// GET /api/github/repos — Fetch user's repositories
// ══════════════════════════════════════════════════════════════
exports.getUserRepos = async (req, res) => {
    try {
        const token = await getGithubToken(req.user.id);
        if (!token) {
            return res.status(400).json({ error: "GitHub account not connected. Please connect GitHub in Settings." });
        }

        const repos = await githubGet(`${GITHUB_API}/user/repos`, token, {
            sort: "pushed",
            direction: "desc",
            per_page: 50,
            type: "all",
        });

        const formatted = repos.map((r) => ({
            id: r.id,
            name: r.name,
            full_name: r.full_name,
            private: r.private,
            description: r.description,
            language: r.language,
            updated_at: r.updated_at,
            default_branch: r.default_branch,
            open_issues_count: r.open_issues_count,
            html_url: r.html_url,
        }));

        res.status(200).json({ success: true, repos: formatted });
    } catch (error) {
        console.error("Fetch repos error:", error?.response?.data || error.message);
        if (error?.response?.status === 401) {
            return res.status(401).json({ error: "GitHub token expired. Please reconnect GitHub in Settings." });
        }
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
};

// ══════════════════════════════════════════════════════════════
// GET /api/github/repos/:owner/:repo/pulls — Fetch open PRs
// ══════════════════════════════════════════════════════════════
exports.getRepoPulls = async (req, res) => {
    try {
        const token = await getGithubToken(req.user.id);
        if (!token) {
            return res.status(400).json({ error: "GitHub account not connected" });
        }

        const { owner, repo } = req.params;

        const pulls = await githubGet(`${GITHUB_API}/repos/${owner}/${repo}/pulls`, token, {
            state: "open",
            sort: "updated",
            direction: "desc",
            per_page: 30,
        });

        const formatted = pulls.map((pr) => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            author: pr.user?.login || "unknown",
            branch: pr.head?.ref || "",
            base: pr.base?.ref || "",
            created_at: pr.created_at,
            updated_at: pr.updated_at,
            html_url: pr.html_url,
            changed_files: pr.changed_files,
            additions: pr.additions,
            deletions: pr.deletions,
        }));

        res.status(200).json({ success: true, pulls: formatted });
    } catch (error) {
        console.error("Fetch pulls error:", error?.response?.data || error.message);
        if (error?.response?.status === 404) {
            return res.status(404).json({ error: "Repository not found" });
        }
        res.status(500).json({ error: "Failed to fetch pull requests" });
    }
};

// ══════════════════════════════════════════════════════════════
// GET /api/github/repos/:owner/:repo/pulls/:number/files — Fetch PR files
// ══════════════════════════════════════════════════════════════
exports.getPullFiles = async (req, res) => {
    try {
        const token = await getGithubToken(req.user.id);
        if (!token) {
            return res.status(400).json({ error: "GitHub account not connected" });
        }

        const { owner, repo, number } = req.params;

        const files = await githubGet(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${number}/files`, token, {
            per_page: 100,
        });

        const formatted = files.map((f) => ({
            filename: f.filename,
            status: f.status,
            additions: f.additions,
            deletions: f.deletions,
            changes: f.changes,
        }));

        res.status(200).json({ success: true, files: formatted });
    } catch (error) {
        console.error("Fetch PR files error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch PR files" });
    }
};
