// Load environment variables from .env file
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

let server; // store server reference for shutdown

(async () => {
  // Step 1: Connect to MongoDB
  await connectDB();

  // Step 2: Start Express server
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`📡 API routes:   http://localhost:${PORT}/api/health`);
  });
})();

// ── Graceful Shutdown ────────────────────────────────────────
// When you press Ctrl+C or the process is killed, this runs.
// It closes the server and database connection cleanly.
function shutdown(signal) {
  console.log(`\n⚡ ${signal} received. Shutting down...`);

  if (server) {
    server.close(() => {
      console.log("🛑 Server closed");
      const mongoose = require("mongoose");
      mongoose.connection.close().then(() => {
        console.log("🛑 MongoDB disconnected");
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));   // Ctrl+C
process.on("SIGTERM", () => shutdown("SIGTERM")); // kill command
