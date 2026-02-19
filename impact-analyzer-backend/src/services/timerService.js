// ═══════════════════════════════════════════════════════════════
// TIMER SERVICE — In-memory auto-analysis timer management
// Stores setTimeout references so they can be cancelled when
// a user triggers manual analysis before the countdown expires.
// ═══════════════════════════════════════════════════════════════

const AUTO_ANALYSIS_DELAY = 60 * 1000; // 60 seconds

// In-memory map: prId → timeoutId
const pendingTimers = new Map();

/**
 * Schedule auto-analysis for a PR after AUTO_ANALYSIS_DELAY.
 * If a timer already exists for this prId, it is replaced.
 * @param {string} prId
 * @param {Function} analyzeFunc — () => Promise (the analysis function)
 */
function scheduleAutoAnalysis(prId, analyzeFunc) {
  // Clear any existing timer for this PR
  cancelAutoAnalysis(prId);

  console.log(
    `⏱️  Auto-analysis scheduled for ${prId} in ${AUTO_ANALYSIS_DELAY / 1000}s`,
  );

  const timeoutId = setTimeout(() => {
    pendingTimers.delete(prId);
    console.log(`⚡ Auto-analysis timer fired for ${prId}`);
    analyzeFunc().catch((err) => {
      console.error(`❌ Auto-analyze failed for ${prId}:`, err.message);
    });
  }, AUTO_ANALYSIS_DELAY);

  pendingTimers.set(prId, timeoutId);
}

/**
 * Cancel a pending auto-analysis timer (e.g. when user clicks "Run Analysis").
 * @param {string} prId
 * @returns {boolean} true if a timer was found and cancelled
 */
function cancelAutoAnalysis(prId) {
  if (pendingTimers.has(prId)) {
    clearTimeout(pendingTimers.get(prId));
    pendingTimers.delete(prId);
    console.log(`🛑 Auto-analysis timer cancelled for ${prId}`);
    return true;
  }
  return false;
}

/**
 * Check whether a timer is pending for a PR.
 * @param {string} prId
 * @returns {boolean}
 */
function hasPendingTimer(prId) {
  return pendingTimers.has(prId);
}

module.exports = {
  scheduleAutoAnalysis,
  cancelAutoAnalysis,
  hasPendingTimer,
  AUTO_ANALYSIS_DELAY,
};
