// ═══════════════════════════════════════════════════════════════
// LOGS PAGE — System logs viewer with severity badges and streaming
// ═══════════════════════════════════════════════════════════════

import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Badge,
  Separator,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import {
  LuScrollText,
  LuFilter,
  LuServer,
  LuBrain,
  LuTestTubeDiagonal,
  LuSearch,
  LuDownload,
} from "react-icons/lu";
import { useSimulation } from "../hooks/useSimulation";
import { useThemeColors } from "../hooks/useThemeColors";
import GlassCard from "../components/shared/GlassCard";

const LOG_TYPES = [
  { key: "all", label: "All Logs", icon: LuScrollText, color: "#4F46E5" },
  { key: "lambda", label: "Lambda", icon: LuServer, color: "#f59e0b" },
  { key: "model", label: "Model Inference", icon: LuBrain, color: "#8B5CF6" },
  {
    key: "runner",
    label: "Test Runner",
    icon: LuTestTubeDiagonal,
    color: "#22C55E",
  },
];

const SEVERITY_COLORS = {
  INFO: "#22C55E",
  DEBUG: "#8B5CF6",
  WARN: "#f59e0b",
  ERROR: "#ef4444",
};

// Pre-generate multiple sets of logs for the viewer
function generateMultipleLogSets() {
  const sets = [];

  // Create a rich log history
  const baseTimestamp = new Date("2026-02-12T06:00:00.000Z");

  const logTemplates = [
    {
      level: "INFO",
      service: "lambda",
      messages: [
        "Webhook handler initialized — listening on /api/webhooks/github",
        "Health check passed — all downstream services responding",
        "Rate limiter configured: 100 req/min per repository",
        "PR webhook received from GitHub — event: pull_request.synchronize",
        "Fetching changed files for PR #{pr} from GitHub API...",
        "Retrieved {n} changed files across {m} modules",
        "Lambda execution completed — Duration: {d}ms, Memory: 256MB",
        "Response sent to GitHub — status: 200 OK",
      ],
    },
    {
      level: "DEBUG",
      service: "lambda",
      messages: [
        "File diff analysis: +{a} -{b} lines across src/**/*",
        "GitHub API rate limit remaining: {n}/5000",
        "DynamoDB write: analysis_results table — consumed 5 WCU",
        "CloudWatch metric published: AnalysisLatency={d}ms",
      ],
    },
    {
      level: "WARN",
      service: "lambda",
      messages: [
        "Cold start detected — consider provisioned concurrency",
        "GitHub API rate limit at 15% — throttling enabled",
        "Retry attempt 2/3 for GitHub API call — 503 response",
      ],
    },
    {
      level: "INFO",
      service: "model",
      messages: [
        "Impact analysis model initialized — TensorFlow Serving v2.14",
        "Feature extraction complete — 128-dim embedding per file",
        "Risk prediction: {risk} (score: {score}/100, confidence: {conf}%)",
        "Impacted modules identified: {modules}",
        "Test selection optimized: {selected}/{total} tests selected",
        "Inference completed — Latency: {d}ms, GPU utilization: {gpu}%",
        "Model cache hit — skipping feature extraction",
      ],
    },
    {
      level: "DEBUG",
      service: "model",
      messages: [
        "Loading dependency graph from Neo4j — 847 nodes, 2341 edges",
        "Running attention mechanism over dependency chains...",
        "Cross-module impact propagation: auth → api-gateway (0.89)",
        "Batch inference: processing 3 PRs in parallel",
      ],
    },
    {
      level: "INFO",
      service: "runner",
      messages: [
        "═══ Test Execution Engine v3.2.0 ═══",
        "Initializing test environment — Node.js v20.11, Jest v30.0",
        "Loading {n} selected test files...",
        "Running {test} .............. PASS ({d}s)",
        "Tests: {passed} passed, {failed} failed, {total} total",
        "Time: {d}s",
        "Coverage: {cov}% statements, {br}% branches",
      ],
    },
    {
      level: "WARN",
      service: "runner",
      messages: [
        "Running rate-limiter.spec.ts ....X.......... FAIL (1.56s)",
        "Test timeout warning: cache.integration.spec.ts exceeded 5s threshold",
      ],
    },
    {
      level: "ERROR",
      service: "runner",
      messages: [
        "✗ should enforce sliding window — Expected 429, received 200",
        "Assertion failed: expected cache TTL to be 3600, got 7200",
      ],
    },
    {
      level: "ERROR",
      service: "lambda",
      messages: ["Unhandled promise rejection in webhook handler — retrying"],
    },
  ];

  // Generate 80+ log entries
  for (let i = 0; i < 85; i++) {
    const template =
      logTemplates[Math.floor(Math.random() * logTemplates.length)];
    const message = template.messages[
      Math.floor(Math.random() * template.messages.length)
    ]
      .replace("{pr}", Math.floor(1240 + Math.random() * 10))
      .replace("{n}", Math.floor(3 + Math.random() * 15))
      .replace("{m}", Math.floor(2 + Math.random() * 5))
      .replace("{d}", Math.floor(100 + Math.random() * 3000))
      .replace("{a}", Math.floor(20 + Math.random() * 400))
      .replace("{b}", Math.floor(5 + Math.random() * 150))
      .replace(
        "{risk}",
        ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      )
      .replace("{score}", Math.floor(20 + Math.random() * 75))
      .replace("{conf}", (75 + Math.random() * 20).toFixed(1))
      .replace("{modules}", "Authentication, API Gateway")
      .replace("{selected}", Math.floor(10 + Math.random() * 20))
      .replace("{total}", Math.floor(30 + Math.random() * 30))
      .replace("{gpu}", Math.floor(15 + Math.random() * 50))
      .replace(
        "{test}",
        [
          "auth.middleware.spec.ts",
          "jwt.service.spec.ts",
          "redis.client.spec.ts",
          "router.spec.ts",
        ][Math.floor(Math.random() * 4)],
      )
      .replace("{passed}", Math.floor(14 + Math.random() * 6))
      .replace("{failed}", Math.floor(Math.random() * 3))
      .replace("{cov}", (80 + Math.random() * 15).toFixed(1))
      .replace("{br}", (75 + Math.random() * 15).toFixed(1));

    const ts = new Date(
      baseTimestamp.getTime() + i * (60000 + Math.random() * 180000),
    );

    sets.push({
      ts: ts.toISOString(),
      level: template.level,
      service: template.service,
      message,
    });
  }

  return sets.sort((a, b) => a.ts.localeCompare(b.ts));
}

const ALL_LOGS = generateMultipleLogSets();

export default function LogsPage() {
  const [activeType, setActiveType] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  useSimulation();
  const t = useThemeColors();

  const filteredLogs = useMemo(() => {
    let logs = ALL_LOGS;
    if (activeType !== "all") {
      logs = logs.filter((l) => l.service === activeType);
    }
    if (severityFilter !== "all") {
      logs = logs.filter((l) => l.level === severityFilter);
    }
    return logs;
  }, [activeType, severityFilter]);

  return (
    <Box className="page-enter">
      {/* Filters */}
      <Flex gap="4" mb="6" flexWrap="wrap" justify="space-between">
        <Flex gap="2">
          {LOG_TYPES.map((type) => (
            <Flex
              key={type.key}
              align="center"
              gap="2"
              bg={activeType === type.key ? `${type.color}15` : t.bgSubtle}
              border={`1px solid ${activeType === type.key ? `${type.color}40` : t.border}`}
              px="3"
              py="2"
              borderRadius="lg"
              cursor="pointer"
              onClick={() => setActiveType(type.key)}
              transition="all 0.2s"
              _hover={{ bg: `${type.color}10` }}
            >
              <Icon
                color={activeType === type.key ? type.color : t.textMuted}
                boxSize="3.5"
              >
                <type.icon />
              </Icon>
              <Text
                fontSize="xs"
                color={activeType === type.key ? type.color : t.textMuted}
                fontWeight={activeType === type.key ? "600" : "400"}
              >
                {type.label}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Flex gap="2">
          {["all", "INFO", "DEBUG", "WARN", "ERROR"].map((sev) => (
            <Flex
              key={sev}
              align="center"
              bg={severityFilter === sev ? t.bgHover : t.bgSubtle}
              px="3"
              py="1.5"
              borderRadius="md"
              cursor="pointer"
              onClick={() => setSeverityFilter(sev)}
              border={`1px solid ${severityFilter === sev ? t.border : t.borderLight}`}
              _hover={{ bg: t.bgHover }}
            >
              <Text
                fontSize="10px"
                fontWeight="600"
                color={
                  sev === "all"
                    ? t.textSecondary
                    : SEVERITY_COLORS[sev] || t.textMuted
                }
                textTransform="uppercase"
              >
                {sev === "all" ? "All" : sev}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Log Count */}
      <Flex justify="space-between" align="center" mb="3">
        <Text fontSize="xs" color={t.textFaint}>
          Showing {filteredLogs.length} log entries
        </Text>
        <Flex
          align="center"
          gap="2"
          cursor="pointer"
          _hover={{ color: "#818CF8" }}
          transition="all 0.2s"
        >
          <Icon color={t.textFaint} boxSize="3.5">
            <LuDownload />
          </Icon>
          <Text fontSize="xs" color={t.textMuted}>
            Export Logs
          </Text>
        </Flex>
      </Flex>

      {/* Log Viewer */}
      <GlassCard noPadding overflow="hidden">
        <Box
          maxH="600px"
          overflowY="auto"
          fontFamily="'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace"
          fontSize="11px"
          css={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { bg: t.bgSubtle },
            "&::-webkit-scrollbar-thumb": {
              bg: t.scrollThumb,
              borderRadius: "3px",
            },
          }}
        >
          {filteredLogs.map((log, i) => (
            <Flex
              key={i}
              gap="3"
              px="4"
              py="1.5"
              _hover={{ bg: t.bgSubtle }}
              borderBottom={`1px solid ${t.borderLight}`}
              align="flex-start"
            >
              {/* Timestamp */}
              <Text
                color={t.textFaint}
                whiteSpace="nowrap"
                flexShrink="0"
                fontSize="10px"
                mt="1px"
              >
                {new Date(log.ts).toLocaleTimeString("en-US", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
                .
                {new Date(log.ts).getMilliseconds().toString().padStart(3, "0")}
              </Text>

              {/* Severity Badge */}
              <Flex
                bg={`${SEVERITY_COLORS[log.level]}15`}
                px="1.5"
                py="0.5"
                borderRadius="sm"
                minW="45px"
                justify="center"
                flexShrink="0"
              >
                <Text
                  fontSize="9px"
                  fontWeight="700"
                  color={SEVERITY_COLORS[log.level]}
                >
                  {log.level}
                </Text>
              </Flex>

              {/* Service */}
              <Text
                color={
                  log.service === "lambda"
                    ? "#f59e0b"
                    : log.service === "model"
                      ? "#A5B4FC"
                      : "#818CF8"
                }
                fontWeight="500"
                fontSize="10px"
                minW="50px"
                flexShrink="0"
                mt="1px"
              >
                [{log.service}]
              </Text>

              {/* Message */}
              <Text color={t.textSecondary} lineHeight="1.5" flex="1">
                {log.message}
              </Text>
            </Flex>
          ))}
        </Box>
      </GlassCard>
    </Box>
  );
}
