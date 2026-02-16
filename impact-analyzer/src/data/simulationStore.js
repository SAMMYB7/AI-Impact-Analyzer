// ═══════════════════════════════════════════════════════════════
// DEMO STATE MACHINE — Controls the entire simulation flow
// ═══════════════════════════════════════════════════════════════

import {
  generatePR,
  generateTestResults,
  generateMetricsHistory,
  generateLogs,
  generatePipelineStages,
  generatePreSeededPRHistory,
  INITIAL_DASHBOARD_STATS,
} from "./mockData";

// Pre-seed history with realistic completed PRs
const INITIAL_HISTORY = generatePreSeededPRHistory();

let state = {
  // Simulation state
  phase: "idle", // idle | pr_received | analyzing | predicting | selecting_tests | running_tests | completed

  // Current PR being analyzed
  currentPR: null,

  // Test results
  testResults: null,

  // Pipeline stages
  pipelineStages: [],

  // Current pipeline stage index
  currentStageIndex: -1,

  // Dashboard stats
  dashboardStats: { ...INITIAL_DASHBOARD_STATS },

  // Metrics history
  metricsHistory: generateMetricsHistory(),

  // Logs
  logs: [],
  visibleLogs: [],

  // Persisted completed PRs (survives reset)
  completedPRs: [...INITIAL_HISTORY],

  // Notifications (survives reset)
  notifications: [
    {
      id: 1,
      type: "info",
      title: "System Online",
      message: "All services are operational. Pipeline health at 97.3%.",
      time: Date.now() - 180000,
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "PR-1245 Merged",
      message: "Fix typo in API documentation merged to main.",
      time: Date.now() - 720000,
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Dev Environment Degraded",
      message:
        "eu-west-1 development cluster experiencing intermittent latency spikes.",
      time: Date.now() - 1680000,
      read: true,
    },
    {
      id: 4,
      type: "success",
      title: "Model Retrained",
      message: "AI impact model v2.4.1 deployed. Accuracy improved to 94.1%.",
      time: Date.now() - 3600000,
      read: true,
    },
    {
      id: 5,
      type: "error",
      title: "Rate Limiter Alert",
      message: "Sliding window test failed in PR-1244. Review required.",
      time: Date.now() - 5400000,
      read: true,
    },
  ],

  // Simulation history (current session tracking)
  simulationHistory: [],

  // Active log index for streaming
  activeLogIndex: 0,
};

const listeners = new Set();
let timerIds = [];
let notificationCounter = 10;

function notify() {
  listeners.forEach((fn) => fn({ ...state }));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return { ...state };
}

export function markNotificationRead(id) {
  state = {
    ...state,
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    ),
  };
  notify();
}

export function markAllNotificationsRead() {
  state = {
    ...state,
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
  };
  notify();
}

function addNotification(type, title, message) {
  notificationCounter++;
  const notification = {
    id: notificationCounter,
    type,
    title,
    message,
    time: Date.now(),
    read: false,
  };
  state = {
    ...state,
    notifications: [notification, ...state.notifications].slice(0, 20),
  };
}

export function resetSimulation() {
  // Clear any pending simulation timers
  timerIds.forEach((id) => clearTimeout(id));
  timerIds = [];

  state = {
    ...state,
    phase: "idle",
    currentPR: null,
    testResults: null,
    pipelineStages: [],
    currentStageIndex: -1,
    logs: [],
    visibleLogs: [],
    activeLogIndex: 0,
  };
  notify();
}

export function startSimulation() {
  // Clear any pending timers from previous simulation
  timerIds.forEach((id) => clearTimeout(id));
  timerIds = [];

  // Generate new PR
  const pr = generatePR();
  state = {
    ...state,
    phase: "pr_received",
    currentPR: pr,
    pipelineStages: generatePipelineStages().map((s) => ({
      ...s,
      status: "pending",
    })),
    currentStageIndex: 0,
    logs: generateLogs(),
    visibleLogs: [],
    activeLogIndex: 0,
    testResults: null,
  };

  addNotification(
    "info",
    `${pr.id} Received`,
    `New pull request from ${pr.author.name}: "${pr.commitMessage}"`,
  );
  notify();

  // Timed transitions through phases
  const transitions = [
    { phase: "analyzing", delay: 1500, stageIndex: 1 },
    { phase: "analyzing", delay: 3000, stageIndex: 2 },
    { phase: "predicting", delay: 5000, stageIndex: 3 },
    { phase: "predicting", delay: 7000, stageIndex: 4 },
    { phase: "selecting_tests", delay: 8500, stageIndex: 5 },
    { phase: "running_tests", delay: 10000, stageIndex: 6 },
    { phase: "completed", delay: 15000, stageIndex: 7 },
  ];

  transitions.forEach(({ phase, delay, stageIndex }) => {
    const timerId = setTimeout(() => {
      const stages = [...state.pipelineStages];
      // Mark previous stages as completed
      for (let i = 0; i <= stageIndex; i++) {
        stages[i] = {
          ...stages[i],
          status: i < stageIndex ? "completed" : "running",
        };
      }
      if (phase === "completed") {
        stages[stageIndex] = { ...stages[stageIndex], status: "completed" };
      }

      const updates = {
        phase,
        pipelineStages: stages,
        currentStageIndex: stageIndex,
      };

      if (phase === "running_tests") {
        updates.testResults = generateTestResults(
          state.currentPR.selectedTests,
        );
      }

      if (phase === "selecting_tests") {
        addNotification(
          "info",
          `${state.currentPR.id} Risk: ${state.currentPR.risk.toUpperCase()}`,
          `Risk score: ${state.currentPR.riskScore}/100. ${state.currentPR.selectedTests.length}/${state.currentPR.allTests.length} tests selected.`,
        );
      }

      if (phase === "completed") {
        // Update dashboard stats
        const newStats = { ...state.dashboardStats };
        newStats.totalPRsAnalyzed += 1;
        newStats.totalTestsSaved +=
          state.currentPR.allTests.length -
          state.currentPR.selectedTests.length;
        newStats.activePRs = Math.max(
          8,
          newStats.activePRs + (Math.random() > 0.5 ? 1 : -1),
        );

        const testResults = state.testResults || updates.testResults;
        const failedCount = testResults
          ? testResults.filter((t) => t.status === "failed").length
          : 0;
        const passedCount = testResults ? testResults.length - failedCount : 0;

        // Determine final status
        const finalStatus = failedCount > 0 ? "failed" : "completed";

        // Store completed PR persistently
        const completedEntry = {
          ...state.currentPR,
          status: finalStatus,
          testResults: testResults,
          completedAt: new Date().toISOString(),
          testsPassed: passedCount,
          testsFailed: failedCount,
        };

        updates.dashboardStats = newStats;
        updates.completedPRs = [completedEntry, ...state.completedPRs];
        updates.simulationHistory = [
          ...state.simulationHistory,
          {
            pr: state.currentPR,
            testResults: testResults,
            timestamp: new Date().toISOString(),
          },
        ];

        // Add completion notification
        if (failedCount > 0) {
          addNotification(
            "error",
            `${state.currentPR.id} — ${failedCount} Test(s) Failed`,
            `${passedCount} passed, ${failedCount} failed. Review required before merge.`,
          );
        } else {
          addNotification(
            "success",
            `${state.currentPR.id} — All Tests Passed`,
            `${passedCount} tests passed. Ready for review and merge.`,
          );
        }
      }

      state = { ...state, ...updates };
      notify();
    }, delay);
    timerIds.push(timerId);
  });

  // Stream logs gradually
  const allLogs = generateLogs();
  const logInterval = 15000 / allLogs.length;
  allLogs.forEach((log, i) => {
    const logTimerId = setTimeout(
      () => {
        state = {
          ...state,
          visibleLogs: [...state.visibleLogs, log],
          activeLogIndex: i,
        };
        notify();
      },
      (i + 1) * logInterval,
    );
    timerIds.push(logTimerId);
  });
}

export function updateMetrics() {
  state = {
    ...state,
    metricsHistory: generateMetricsHistory(),
  };
  notify();
}
