// ═══════════════════════════════════════════════════════════════
// CENTRALIZED MOCK DATA STORE
// All fake data for the AI Impact Analyzer demo
// ═══════════════════════════════════════════════════════════════

const AUTHORS = [
  { name: "Sarah Chen", avatar: "SC", role: "Senior Engineer" },
  { name: "Marcus Johnson", avatar: "MJ", role: "Staff Engineer" },
  { name: "Priya Patel", avatar: "PP", role: "Backend Lead" },
  { name: "Alex Rivera", avatar: "AR", role: "DevOps Engineer" },
  { name: "Jordan Kim", avatar: "JK", role: "Full Stack Dev" },
  { name: "Emily Zhao", avatar: "EZ", role: "ML Engineer" },
  { name: "David Okafor", avatar: "DO", role: "Platform Lead" },
  { name: "Mia Thompson", avatar: "MT", role: "SRE" },
  { name: "Liam Hernandez", avatar: "LH", role: "Security Engineer" },
  { name: "Ava Nguyen", avatar: "AN", role: "Frontend Lead" },
  { name: "Noah Petrov", avatar: "NP", role: "Data Engineer" },
  { name: "Sophia Andersson", avatar: "SA", role: "QA Lead" },
  { name: "Ethan Blackwell", avatar: "EB", role: "Infrastructure" },
  { name: "Isabella Costa", avatar: "IC", role: "API Engineer" },
];

const BRANCHES = [
  "feature/user-auth-refactor",
  "fix/payment-gateway-timeout",
  "feature/ml-pipeline-v2",
  "hotfix/cache-invalidation",
  "feature/notification-service",
  "refactor/database-layer",
  "feature/api-rate-limiting",
  "fix/memory-leak-websocket",
  "feature/real-time-analytics",
  "feature/multi-tenant-support",
  "fix/session-expiry-race",
  "feature/graphql-subscriptions",
  "refactor/event-bus-architecture",
  "hotfix/cors-header-missing",
  "feature/oauth2-pkce-flow",
  "fix/timezone-drift-cron",
  "feature/distributed-tracing",
  "perf/query-plan-optimizer",
  "feature/feature-flag-rollout",
  "fix/deadlock-connection-pool",
];

const COMMIT_MESSAGES = [
  "Refactor authentication middleware to use JWT refresh tokens",
  "Fix race condition in payment processing pipeline",
  "Add ML model versioning and A/B testing support",
  "Resolve cache stampede issue in Redis cluster",
  "Implement WebSocket-based notification delivery",
  "Optimize database query patterns for N+1 resolution",
  "Add rate limiting with sliding window algorithm",
  "Fix memory leak in WebSocket connection pool",
  "Implement real-time event streaming with Apache Kafka",
  "Add tenant isolation for multi-tenant architecture",
  "Fix session token expiry edge case during refresh",
  "Add GraphQL subscription support for live updates",
  "Refactor event bus to use message broker pattern",
  "Patch CORS preflight handling for mobile clients",
  "Implement PKCE authorization code flow for SPAs",
  "Fix UTC drift in scheduled cron job execution",
  "Add distributed tracing with OpenTelemetry spans",
  "Optimize slow queries using materialized view indexes",
  "Implement gradual feature flag rollout with canary",
  "Resolve connection pool deadlock under high concurrency",
];

const FILE_MODULES = {
  "src/auth/middleware.ts": "Authentication",
  "src/auth/jwt.service.ts": "Authentication",
  "src/auth/oauth.provider.ts": "Authentication",
  "src/auth/session.manager.ts": "Authentication",
  "src/payment/gateway.ts": "Payment Processing",
  "src/payment/stripe.adapter.ts": "Payment Processing",
  "src/payment/invoice.service.ts": "Payment Processing",
  "src/payment/webhook.handler.ts": "Payment Processing",
  "src/ml/pipeline.ts": "ML Pipeline",
  "src/ml/model.loader.ts": "ML Pipeline",
  "src/ml/feature.extractor.ts": "ML Pipeline",
  "src/ml/inference.engine.ts": "ML Pipeline",
  "src/cache/redis.client.ts": "Cache Layer",
  "src/cache/invalidation.ts": "Cache Layer",
  "src/cache/strategy.ts": "Cache Layer",
  "src/notifications/websocket.ts": "Notifications",
  "src/notifications/email.service.ts": "Notifications",
  "src/notifications/push.service.ts": "Notifications",
  "src/database/orm.config.ts": "Database",
  "src/database/migrations.ts": "Database",
  "src/database/repository.ts": "Database",
  "src/database/query.builder.ts": "Database",
  "src/api/rate-limiter.ts": "API Gateway",
  "src/api/router.ts": "API Gateway",
  "src/api/validation.ts": "API Gateway",
  "src/api/middleware.ts": "API Gateway",
  "src/streaming/kafka.producer.ts": "Event Streaming",
  "src/streaming/kafka.consumer.ts": "Event Streaming",
  "src/streaming/event.processor.ts": "Event Streaming",
  "src/tenant/isolation.ts": "Multi-Tenant",
  "src/tenant/config.resolver.ts": "Multi-Tenant",
  "src/utils/logger.ts": "Core Utilities",
  "src/utils/crypto.ts": "Core Utilities",
  "src/utils/validator.ts": "Core Utilities",
  "src/config/env.ts": "Configuration",
  "src/config/feature-flags.ts": "Configuration",
};

const MODULE_TESTS = {
  Authentication: [
    "auth.middleware.spec.ts",
    "jwt.service.spec.ts",
    "oauth.provider.spec.ts",
    "session.manager.spec.ts",
    "auth.integration.spec.ts",
    "auth.e2e.spec.ts",
  ],
  "Payment Processing": [
    "gateway.spec.ts",
    "stripe.adapter.spec.ts",
    "invoice.service.spec.ts",
    "webhook.handler.spec.ts",
    "payment.integration.spec.ts",
    "payment.e2e.spec.ts",
  ],
  "ML Pipeline": [
    "pipeline.spec.ts",
    "model.loader.spec.ts",
    "feature.extractor.spec.ts",
    "inference.engine.spec.ts",
    "ml.integration.spec.ts",
  ],
  "Cache Layer": [
    "redis.client.spec.ts",
    "invalidation.spec.ts",
    "strategy.spec.ts",
    "cache.integration.spec.ts",
  ],
  Notifications: [
    "websocket.spec.ts",
    "email.service.spec.ts",
    "push.service.spec.ts",
    "notifications.integration.spec.ts",
  ],
  Database: [
    "orm.config.spec.ts",
    "migrations.spec.ts",
    "repository.spec.ts",
    "query.builder.spec.ts",
    "database.integration.spec.ts",
    "database.e2e.spec.ts",
  ],
  "API Gateway": [
    "rate-limiter.spec.ts",
    "router.spec.ts",
    "validation.spec.ts",
    "api.middleware.spec.ts",
    "api.integration.spec.ts",
  ],
  "Event Streaming": [
    "kafka.producer.spec.ts",
    "kafka.consumer.spec.ts",
    "event.processor.spec.ts",
    "streaming.integration.spec.ts",
  ],
  "Multi-Tenant": [
    "isolation.spec.ts",
    "config.resolver.spec.ts",
    "tenant.integration.spec.ts",
  ],
  "Core Utilities": ["logger.spec.ts", "crypto.spec.ts", "validator.spec.ts"],
  Configuration: ["env.spec.ts", "feature-flags.spec.ts"],
};

const RISK_EXPLANATIONS = {
  high: [
    "Critical path modification detected. Changes to authentication middleware affect 23 downstream services. Historical failure rate: 12.4% for similar changes.",
    "Payment gateway modifications detected. This component handles $2.3M daily transactions. Concurrent access patterns require thorough testing.",
    "Database migration detected. Schema changes affect 8 tables with foreign key constraints. Rollback complexity: HIGH.",
  ],
  medium: [
    "Cache invalidation logic modified. May cause temporary cache misses during deployment. Estimated impact: 2-5% latency increase.",
    "API rate limiting changes detected. Could affect client-side retry logic. 14 API consumers identified.",
    "Notification service changes detected. WebSocket connection handling modified. Monitor for connection drops post-deploy.",
  ],
  low: [
    "Utility function update. Limited blast radius. Only 3 direct consumers identified. Well-covered by existing tests.",
    "Configuration update detected. Feature flag changes are reversible. No infrastructure changes required.",
    "Documentation and logging improvements. No functional changes detected. Low regression risk.",
  ],
};

const DEPENDENCY_CHAINS = [
  { from: "Authentication", to: "API Gateway", strength: "strong" },
  { from: "Authentication", to: "Session Manager", strength: "strong" },
  { from: "API Gateway", to: "Rate Limiter", strength: "strong" },
  { from: "API Gateway", to: "Cache Layer", strength: "medium" },
  { from: "Payment Processing", to: "Database", strength: "strong" },
  { from: "Payment Processing", to: "Notifications", strength: "medium" },
  { from: "Payment Processing", to: "Event Streaming", strength: "medium" },
  { from: "Database", to: "Cache Layer", strength: "strong" },
  { from: "ML Pipeline", to: "Event Streaming", strength: "medium" },
  { from: "ML Pipeline", to: "Database", strength: "weak" },
  { from: "Notifications", to: "Event Streaming", strength: "strong" },
  { from: "Multi-Tenant", to: "Database", strength: "strong" },
  { from: "Multi-Tenant", to: "Cache Layer", strength: "medium" },
  { from: "Configuration", to: "All Modules", strength: "weak" },
];

// ── Generators ────────────────────────────────────────────────

let prCounter = 1247;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generatePR() {
  prCounter++;
  const author = pick(AUTHORS);
  const branchIdx = randomInt(0, BRANCHES.length - 1);
  const allFiles = Object.keys(FILE_MODULES);
  const changedFiles = pickN(allFiles, randomInt(3, 8));
  const modules = [...new Set(changedFiles.map((f) => FILE_MODULES[f]))];
  const risk =
    modules.length > 3 ? "high" : modules.length > 1 ? "medium" : "low";
  const riskScore =
    risk === "high"
      ? randomInt(75, 95)
      : risk === "medium"
        ? randomInt(40, 74)
        : randomInt(10, 39);
  const confidence = randomFloat(72, 97, 1);

  // Get all tests for affected modules
  const allTests = modules.flatMap((m) =>
    (MODULE_TESTS[m] || []).map((t) => ({ name: t, module: m })),
  );
  const selectedTests = pickN(
    allTests,
    Math.ceil(allTests.length * randomFloat(0.4, 0.7, 2)),
  );

  return {
    id: `PR-${prCounter}`,
    number: prCounter,
    branch: BRANCHES[branchIdx],
    baseBranch: "main",
    author,
    commitMessage: COMMIT_MESSAGES[branchIdx % COMMIT_MESSAGES.length],
    changedFiles,
    modules,
    risk,
    riskScore,
    confidence,
    explanation: pick(RISK_EXPLANATIONS[risk]),
    allTests,
    selectedTests,
    skippedTests: allTests.filter((t) => !selectedTests.includes(t)),
    totalRepoTests: 247,
    additions: randomInt(45, 350),
    deletions: randomInt(10, 120),
    timestamp: new Date().toISOString(),
    status: "open",
  };
}

export function generateTestResults(selectedTests) {
  return selectedTests.map((test, i) => {
    const passed = Math.random() > 0.08;
    return {
      ...test,
      status: passed ? "passed" : "failed",
      duration: randomFloat(0.1, 4.5, 2),
      assertions: randomInt(3, 15),
      coverage: randomFloat(78, 99, 1),
      executionOrder: i + 1,
    };
  });
}

export function generateMetricsHistory() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split("T")[0],
      dateLabel: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      prsAnalyzed: randomInt(8, 32),
      timeSaved: randomFloat(12, 48, 1),
      testsReduced: randomInt(120, 580),
      testsRun: randomInt(40, 200),
      avgRiskScore: randomFloat(25, 65, 1),
      pipelineDuration: randomFloat(2.5, 8.5, 1),
      buildSuccessRate: randomFloat(88, 99, 1),
      avgConfidence: randomFloat(78, 96, 1),
    });
  }
  return days;
}

export function generateLogs(type = "all") {
  const lambdaLogs = [
    {
      ts: "2026-02-12T08:23:14.221Z",
      level: "INFO",
      service: "lambda",
      message: "PR webhook received from GitHub — event: pull_request.opened",
    },
    {
      ts: "2026-02-12T08:23:14.342Z",
      level: "INFO",
      service: "lambda",
      message: "Fetching changed files for PR #1248 from GitHub API...",
    },
    {
      ts: "2026-02-12T08:23:14.891Z",
      level: "INFO",
      service: "lambda",
      message: "Retrieved 6 changed files across 3 modules",
    },
    {
      ts: "2026-02-12T08:23:15.001Z",
      level: "DEBUG",
      service: "lambda",
      message:
        "File diff analysis: +234 -89 lines across src/auth/*, src/api/*",
    },
    {
      ts: "2026-02-12T08:23:15.234Z",
      level: "INFO",
      service: "lambda",
      message: "Invoking AI impact analysis model v2.4.1...",
    },
    {
      ts: "2026-02-12T08:23:15.567Z",
      level: "DEBUG",
      service: "lambda",
      message: "Model input prepared: 6 files, 3 modules, 12 dependency chains",
    },
    {
      ts: "2026-02-12T08:23:16.123Z",
      level: "INFO",
      service: "lambda",
      message: "Lambda execution completed — Duration: 1902ms, Memory: 256MB",
    },
    {
      ts: "2026-02-12T08:23:16.189Z",
      level: "WARN",
      service: "lambda",
      message:
        "Cold start detected — consider provisioned concurrency for <200ms latency",
    },
  ];

  const modelLogs = [
    {
      ts: "2026-02-12T08:23:15.234Z",
      level: "INFO",
      service: "model",
      message: "Impact analysis model initialized — TensorFlow Serving v2.14",
    },
    {
      ts: "2026-02-12T08:23:15.345Z",
      level: "DEBUG",
      service: "model",
      message: "Loading dependency graph from Neo4j — 847 nodes, 2341 edges",
    },
    {
      ts: "2026-02-12T08:23:15.567Z",
      level: "INFO",
      service: "model",
      message: "Feature extraction complete — 128-dim embedding per file",
    },
    {
      ts: "2026-02-12T08:23:15.678Z",
      level: "DEBUG",
      service: "model",
      message: "Running attention mechanism over dependency chains...",
    },
    {
      ts: "2026-02-12T08:23:15.891Z",
      level: "INFO",
      service: "model",
      message: "Risk prediction: HIGH (score: 82/100, confidence: 91.3%)",
    },
    {
      ts: "2026-02-12T08:23:16.001Z",
      level: "INFO",
      service: "model",
      message:
        "Impacted modules identified: Authentication, API Gateway, Cache Layer",
    },
    {
      ts: "2026-02-12T08:23:16.012Z",
      level: "DEBUG",
      service: "model",
      message:
        "Cross-module impact propagation: auth → api-gateway (0.89), auth → cache (0.67)",
    },
    {
      ts: "2026-02-12T08:23:16.056Z",
      level: "INFO",
      service: "model",
      message:
        "Test selection optimized: 18/47 tests selected (61.7% reduction)",
    },
    {
      ts: "2026-02-12T08:23:16.089Z",
      level: "INFO",
      service: "model",
      message: "Inference completed — Latency: 855ms, GPU utilization: 34%",
    },
  ];

  const testLogs = [
    {
      ts: "2026-02-12T08:23:17.001Z",
      level: "INFO",
      service: "runner",
      message: "═══ Test Execution Engine v3.2.0 ═══",
    },
    {
      ts: "2026-02-12T08:23:17.012Z",
      level: "INFO",
      service: "runner",
      message: "Initializing test environment — Node.js v20.11, Jest v30.0",
    },
    {
      ts: "2026-02-12T08:23:17.234Z",
      level: "INFO",
      service: "runner",
      message: "Loading 18 selected test files...",
    },
    {
      ts: "2026-02-12T08:23:17.456Z",
      level: "INFO",
      service: "runner",
      message: "Running auth.middleware.spec.ts .............. PASS (1.23s)",
    },
    {
      ts: "2026-02-12T08:23:18.789Z",
      level: "INFO",
      service: "runner",
      message: "Running jwt.service.spec.ts .............. PASS (0.89s)",
    },
    {
      ts: "2026-02-12T08:23:19.567Z",
      level: "INFO",
      service: "runner",
      message: "Running oauth.provider.spec.ts .............. PASS (2.12s)",
    },
    {
      ts: "2026-02-12T08:23:20.234Z",
      level: "WARN",
      service: "runner",
      message: "Running rate-limiter.spec.ts ....X.......... FAIL (1.56s)",
    },
    {
      ts: "2026-02-12T08:23:20.235Z",
      level: "ERROR",
      service: "runner",
      message: "  ✗ should enforce sliding window — Expected 429, received 200",
    },
    {
      ts: "2026-02-12T08:23:20.567Z",
      level: "INFO",
      service: "runner",
      message: "Running router.spec.ts .............. PASS (0.67s)",
    },
    {
      ts: "2026-02-12T08:23:21.234Z",
      level: "INFO",
      service: "runner",
      message: "Running validation.spec.ts .............. PASS (0.45s)",
    },
    {
      ts: "2026-02-12T08:23:22.001Z",
      level: "INFO",
      service: "runner",
      message: "Running cache.integration.spec.ts .............. PASS (3.21s)",
    },
    {
      ts: "2026-02-12T08:23:23.456Z",
      level: "INFO",
      service: "runner",
      message: "────────────────────────────────────",
    },
    {
      ts: "2026-02-12T08:23:23.457Z",
      level: "INFO",
      service: "runner",
      message: "Tests:  17 passed, 1 failed, 18 total",
    },
    {
      ts: "2026-02-12T08:23:23.458Z",
      level: "INFO",
      service: "runner",
      message: "Time:   6.455s",
    },
    {
      ts: "2026-02-12T08:23:23.459Z",
      level: "INFO",
      service: "runner",
      message: "Coverage: 87.3% statements, 82.1% branches",
    },
    {
      ts: "2026-02-12T08:23:23.460Z",
      level: "INFO",
      service: "runner",
      message: "════════════════════════════════════",
    },
  ];

  if (type === "lambda") return lambdaLogs;
  if (type === "model") return modelLogs;
  if (type === "runner") return testLogs;
  return [...lambdaLogs, ...modelLogs, ...testLogs].sort((a, b) =>
    a.ts.localeCompare(b.ts),
  );
}

export function generatePipelineStages() {
  return [
    {
      name: "Webhook Received",
      status: "completed",
      duration: "0.2s",
      icon: "📡",
    },
    {
      name: "Fetch Changes",
      status: "completed",
      duration: "1.4s",
      icon: "📥",
    },
    {
      name: "Dependency Mapping",
      status: "completed",
      duration: "2.1s",
      icon: "🗺️",
    },
    {
      name: "AI Impact Analysis",
      status: "completed",
      duration: "3.8s",
      icon: "🧠",
    },
    {
      name: "Risk Assessment",
      status: "completed",
      duration: "1.2s",
      icon: "⚠️",
    },
    {
      name: "Test Selection",
      status: "completed",
      duration: "0.8s",
      icon: "🎯",
    },
    {
      name: "Test Execution",
      status: "completed",
      duration: "6.5s",
      icon: "🧪",
    },
    {
      name: "Report Generation",
      status: "completed",
      duration: "0.4s",
      icon: "📊",
    },
  ];
}

export const INITIAL_DASHBOARD_STATS = {
  totalPRsAnalyzed: 1847,
  totalTestsSaved: 42680,
  avgBuildTime: "4.2 min",
  avgTimeSaved: "18.3",
  activePRs: 12,
  pipelineHealth: 97.3,
  modelAccuracy: 94.1,
  testsOptimized: 68.4,
  riskDistribution: {
    low: 62,
    medium: 28,
    high: 10,
  },
  recentActivity: [
    {
      pr: "PR-1245",
      action: "Analysis completed",
      risk: "medium",
      time: "3 min ago",
    },
    { pr: "PR-1244", action: "Tests passed", risk: "low", time: "12 min ago" },
    {
      pr: "PR-1243",
      action: "High risk flagged",
      risk: "high",
      time: "28 min ago",
    },
    {
      pr: "PR-1242",
      action: "Pipeline completed",
      risk: "low",
      time: "45 min ago",
    },
    {
      pr: "PR-1241",
      action: "Merged to main",
      risk: "medium",
      time: "1 hr ago",
    },
    {
      pr: "PR-1240",
      action: "Analysis completed",
      risk: "low",
      time: "2 hr ago",
    },
  ],
  environments: [
    {
      name: "Production",
      status: "healthy",
      uptime: "99.97%",
      region: "us-east-1",
    },
    {
      name: "Staging",
      status: "healthy",
      uptime: "99.89%",
      region: "us-west-2",
    },
    {
      name: "Development",
      status: "degraded",
      uptime: "98.12%",
      region: "eu-west-1",
    },
  ],
};

// ── Pre-seeded PR history ─────────────────────────────────────

const PRE_SEEDED_PRS = [
  {
    id: "PR-1245",
    number: 1245,
    branch: "fix/typo-readme",
    baseBranch: "main",
    commitMessage: "Fix typo in API documentation and update examples",
    additions: 12,
    deletions: 3,
    changedFiles: ["docs/api.md", "README.md"],
    modules: ["Documentation"],
    risk: "low",
    riskScore: 18,
    confidence: 96.2,
    explanation:
      "Documentation update detected. No functional changes. Low regression risk.",
    author: { name: "Mia Thompson", avatar: "MT", role: "SRE" },
    status: "completed",
    testsPassed: 4,
    testsFailed: 0,
  },
  {
    id: "PR-1244",
    number: 1244,
    branch: "feature/rate-limiting",
    baseBranch: "main",
    commitMessage: "Implement sliding window rate limiter with Redis",
    additions: 234,
    deletions: 45,
    changedFiles: [
      "src/api/rate-limiter.ts",
      "src/api/middleware.ts",
      "src/cache/redis.client.ts",
      "src/config/env.ts",
    ],
    modules: ["API Gateway", "Cache Layer", "Configuration"],
    risk: "medium",
    riskScore: 62,
    confidence: 88.4,
    explanation:
      "API rate limiting changes detected. Could affect client-side retry logic. 14 API consumers identified.",
    author: { name: "Marcus Johnson", avatar: "MJ", role: "Staff Engineer" },
    status: "failed",
    testsPassed: 14,
    testsFailed: 1,
  },
  {
    id: "PR-1243",
    number: 1243,
    branch: "refactor/auth-middleware",
    baseBranch: "main",
    commitMessage: "Refactor authentication to use JWT refresh tokens",
    additions: 567,
    deletions: 234,
    changedFiles: [
      "src/auth/middleware.ts",
      "src/auth/jwt.service.ts",
      "src/auth/session.manager.ts",
      "src/api/router.ts",
      "src/database/repository.ts",
      "src/cache/strategy.ts",
    ],
    modules: ["Authentication", "API Gateway", "Database", "Cache Layer"],
    risk: "high",
    riskScore: 89,
    confidence: 91.7,
    explanation:
      "Critical path modification detected. Changes to authentication middleware affect 23 downstream services. Historical failure rate: 12.4% for similar changes.",
    author: { name: "Sarah Chen", avatar: "SC", role: "Senior Engineer" },
    status: "completed",
    testsPassed: 22,
    testsFailed: 0,
  },
  {
    id: "PR-1242",
    number: 1242,
    branch: "feature/kafka-events",
    baseBranch: "main",
    commitMessage: "Add Kafka event streaming for real-time notifications",
    additions: 189,
    deletions: 34,
    changedFiles: [
      "src/streaming/kafka.producer.ts",
      "src/streaming/event.processor.ts",
      "src/notifications/websocket.ts",
    ],
    modules: ["Event Streaming", "Notifications"],
    risk: "medium",
    riskScore: 51,
    confidence: 87.9,
    explanation:
      "Notification service changes detected. WebSocket connection handling modified. Monitor for connection drops post-deploy.",
    author: { name: "Alex Rivera", avatar: "AR", role: "DevOps Engineer" },
    status: "completed",
    testsPassed: 12,
    testsFailed: 0,
  },
  {
    id: "PR-1241",
    number: 1241,
    branch: "fix/logger-format",
    baseBranch: "main",
    commitMessage: "Standardize structured logging format across services",
    additions: 67,
    deletions: 23,
    changedFiles: ["src/utils/logger.ts", "src/config/env.ts"],
    modules: ["Core Utilities", "Configuration"],
    risk: "low",
    riskScore: 15,
    confidence: 95.8,
    explanation:
      "Utility function update. Limited blast radius. Only 3 direct consumers identified. Well-covered by existing tests.",
    author: { name: "Jordan Kim", avatar: "JK", role: "Full Stack Dev" },
    status: "completed",
    testsPassed: 6,
    testsFailed: 0,
  },
  {
    id: "PR-1240",
    number: 1240,
    branch: "feature/distributed-tracing",
    baseBranch: "main",
    commitMessage: "Add OpenTelemetry distributed tracing to all services",
    additions: 312,
    deletions: 78,
    changedFiles: [
      "src/api/middleware.ts",
      "src/database/orm.config.ts",
      "src/cache/redis.client.ts",
      "src/streaming/kafka.consumer.ts",
      "src/config/env.ts",
    ],
    modules: [
      "API Gateway",
      "Database",
      "Cache Layer",
      "Event Streaming",
      "Configuration",
    ],
    risk: "high",
    riskScore: 78,
    confidence: 85.3,
    explanation:
      "Database migration detected. Schema changes affect 8 tables with foreign key constraints. Rollback complexity: HIGH.",
    author: { name: "Ethan Blackwell", avatar: "EB", role: "Infrastructure" },
    status: "completed",
    testsPassed: 19,
    testsFailed: 0,
  },
  {
    id: "PR-1239",
    number: 1239,
    branch: "fix/session-expiry-race",
    baseBranch: "main",
    commitMessage:
      "Fix session token expiry edge case during concurrent refresh",
    additions: 94,
    deletions: 31,
    changedFiles: [
      "src/auth/session.manager.ts",
      "src/auth/jwt.service.ts",
      "src/cache/strategy.ts",
    ],
    modules: ["Authentication", "Cache Layer"],
    risk: "medium",
    riskScore: 58,
    confidence: 90.1,
    explanation:
      "Cache invalidation logic modified. May cause temporary cache misses during deployment. Estimated impact: 2-5% latency increase.",
    author: { name: "Liam Hernandez", avatar: "LH", role: "Security Engineer" },
    status: "completed",
    testsPassed: 10,
    testsFailed: 0,
  },
  {
    id: "PR-1238",
    number: 1238,
    branch: "perf/query-plan-optimizer",
    baseBranch: "main",
    commitMessage: "Optimize slow queries with materialized view indexes",
    additions: 156,
    deletions: 42,
    changedFiles: [
      "src/database/query.builder.ts",
      "src/database/migrations.ts",
      "src/database/repository.ts",
    ],
    modules: ["Database"],
    risk: "medium",
    riskScore: 44,
    confidence: 92.6,
    explanation:
      "Cache invalidation logic modified. May cause temporary cache misses during deployment. Estimated impact: 2-5% latency increase.",
    author: { name: "Noah Petrov", avatar: "NP", role: "Data Engineer" },
    status: "completed",
    testsPassed: 15,
    testsFailed: 0,
  },
];

export function generatePreSeededPRHistory() {
  const now = Date.now();
  return PRE_SEEDED_PRS.map((pr, i) => ({
    ...pr,
    totalRepoTests: 247,
    allTests: [],
    selectedTests: [],
    skippedTests: [],
    timestamp: new Date(
      now - (i + 1) * 3600000 * randomFloat(0.5, 3, 1),
    ).toISOString(),
    completedAt: new Date(
      now - (i + 1) * 3600000 * randomFloat(0.5, 3, 1) + 900000,
    ).toISOString(),
  }));
}

export {
  AUTHORS,
  BRANCHES,
  COMMIT_MESSAGES,
  FILE_MODULES,
  MODULE_TESTS,
  RISK_EXPLANATIONS,
  DEPENDENCY_CHAINS,
  PRE_SEEDED_PRS,
};
