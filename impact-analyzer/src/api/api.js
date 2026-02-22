// ═══════════════════════════════════════════════════════════════
// API CLIENT — All backend API calls in one place
// ═══════════════════════════════════════════════════════════════

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// ── PR Endpoints ─────────────────────────────────────────────

// Create a simulated PR (POST /api/webhook/simulate)
export async function createPR(payload) {
  const res = await API.post("/api/webhook/simulate", payload);
  return res.data;
}

// Trigger analysis on a PR (POST /api/pr/analyze/:id)
export async function analyzePR(prId) {
  const res = await API.post(`/api/pr/analyze/${prId}`);
  return res.data;
}

// Fetch a single PR (GET /api/pr/:id)
export async function getPR(prId) {
  const res = await API.get(`/api/pr/${prId}`);
  return res.data;
}

// Fetch PR + pipeline + logs in one shot (GET /api/pr/:id/status) — for polling
export async function getPRStatus(prId) {
  const res = await API.get(`/api/pr/${prId}/status`);
  return res.data;
}

// Fetch all PRs (GET /api/pr)
export async function getAllPRs() {
  const res = await API.get("/api/pr");
  return res.data;
}

// Delete a PR (DELETE /api/pr/:id)
export async function deletePR(prId) {
  const res = await API.delete(`/api/pr/${prId}`);
  return res.data;
}

// Update a PR (PUT /api/pr/:id)
export async function updatePR(prId, updates) {
  const res = await API.put(`/api/pr/${prId}`, updates);
  return res.data;
}

// ── Logs Endpoint ────────────────────────────────────────────

// Fetch logs for a PR (GET /api/logs/:prId)
export async function getLogs(prId) {
  const res = await API.get(`/api/logs/${prId}`);
  return res.data;
}

// Fetch all logs across all PRs (GET /api/logs)
export async function getAllLogs() {
  const res = await API.get("/api/logs");
  return res.data;
}

// ── Health ───────────────────────────────────────────────────

export async function getHealth() {
  const res = await API.get("/api/health");
  return res.data;
}

// ── AI Model Health ────────────────────────────────────────

export async function getAIHealth() {
  const res = await API.get("/api/ai/health");
  return res.data;
}

export default API;
