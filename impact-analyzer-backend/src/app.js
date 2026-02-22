const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { pollBuilds } = require("./services/buildPoller");

const app = express();

// ── CORS — allow cross-origin requests ───────────────────────
app.use(cors());

// ── Body Parsing — read JSON and form data ───────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request Logger — logs every incoming request ─────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
});

// ── Health Check — quick status check at /health ─────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()) + "s",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes — everything under /api ───────────────────────
app.use("/api", routes);

// Poll builds every 15s
setInterval(pollBuilds, 15000);

// ── 404 Handler — catches unknown routes ─────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler — catches all thrown errors ─────────
app.use((err, req, res, _next) => {
  console.error("🔥 Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
