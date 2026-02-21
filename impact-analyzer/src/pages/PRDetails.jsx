// ═══════════════════════════════════════════════════════════════
// PR DETAILS PAGE — Full detail view of a single pull request
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  Spinner,
  Grid,
  Badge,
} from "@chakra-ui/react";
import {
  LuArrowLeft,
  LuPlay,
  LuGitBranch,
  LuUser,
  LuFileCode,
  LuShieldAlert,
  LuTestTubeDiagonal,
  LuTestTubes,
  LuClock,
  LuPackage,
  LuTimer,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatusBadge from "../components/shared/StatusBadge";
import StatCard from "../components/shared/StatCard";
import PipelineView from "../components/PipelineView";
import LogViewer from "../components/LogViewer";
import { useThemeColors } from "../hooks/useThemeColors";
import { getPR, analyzePR, getLogs } from "../api/api";
import { toaster } from "../components/ui/toaster";

export default function PRDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useThemeColors();

  const [pr, setPR] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState(null); // seconds remaining
  const pollRef = useRef(null);
  const countdownRef = useRef(null);

  // Fetch PR + logs
  const fetchData = useCallback(async () => {
    try {
      const [prData, logsData] = await Promise.all([getPR(id), getLogs(id)]);
      setPR(prData.pr || prData);
      setLogs(logsData.logs || logsData || []);
    } catch (err) {
      console.error("Failed to fetch PR:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [fetchData]);

  // ── Countdown timer for auto-analysis ─────────────────────
  useEffect(() => {
    // Clear any existing countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    if (pr?.status === "received" && pr?.autoAnalysisAt) {
      const target = new Date(pr.autoAnalysisAt).getTime();

      function tick() {
        const remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000));
        setCountdown(remaining);

        if (remaining <= 0) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          // Auto-analysis should fire on backend — start polling
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = setInterval(() => {
            fetchData();
          }, 2000);
        }
      }

      tick(); // immediate first tick
      countdownRef.current = setInterval(tick, 1000);
    } else {
      setCountdown(null);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [pr?.status, pr?.autoAnalysisAt, fetchData]);

  // Start polling when analyzing
  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      fetchData();
    }, 2000);
  }

  // Stop polling when analysis is done
  const prStatus = pr?.status;
  useEffect(() => {
    if (
      prStatus &&
      prStatus !== "analyzing" &&
      prStatus !== "received" &&
      pollRef.current
    ) {
      clearInterval(pollRef.current);
      pollRef.current = null;
      setAnalyzing(false);
    }
  }, [prStatus]);

  // Handle analyze button click (manual — skip timer)
  async function handleAnalyze() {
    setAnalyzing(true);
    // Stop countdown immediately
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);

    try {
      await analyzePR(id);
      startPolling();
      // Immediate fetch
      setTimeout(fetchData, 300);
    } catch (err) {
      setAnalyzing(false);

      // Show user-friendly toast based on error type
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || err.message;

      if (status === 409) {
        toaster.create({
          title: "Already Analyzed",
          description:
            "This PR has already been processed. Create a new PR to run analysis again.",
          type: "warning",
          duration: 4000,
        });
      } else {
        toaster.create({
          title: "Analysis Failed",
          description: msg,
          type: "error",
          duration: 4000,
        });
      }
    }
  }

  if (loading) {
    return (
      <Flex align="center" justify="center" h="60vh" gap="3">
        <Spinner size="md" color="#3b82f6" />
        <Text color={t.textMuted}>Loading PR details...</Text>
      </Flex>
    );
  }

  if (!pr) {
    return (
      <Flex direction="column" align="center" justify="center" h="60vh" gap="4">
        <Text color={t.textMuted} fontSize="lg">
          Pull request not found
        </Text>
        <Button
          size="sm"
          variant="ghost"
          color={t.textMuted}
          onClick={() => navigate("/dashboard")}
        >
          <Icon mr="1.5">
            <LuArrowLeft />
          </Icon>
          Back to Dashboard
        </Button>
      </Flex>
    );
  }

  const riskColor =
    (pr.riskScore || 0) >= 70
      ? "#ef4444"
      : (pr.riskScore || 0) >= 40
        ? "#f59e0b"
        : "#10b981";

  return (
    <Box>
      {/* Header */}
      <Flex align="center" gap="3" mb="6" flexWrap="wrap">
        <Box
          as="button"
          onClick={() => navigate("/dashboard")}
          p="2"
          borderRadius="lg"
          _hover={{ bg: t.bgHover }}
          transition="all 0.15s"
          cursor="pointer"
        >
          <Icon color={t.textMuted} boxSize="5">
            <LuArrowLeft />
          </Icon>
        </Box>
        <Box flex="1" minW="0">
          <Flex align="center" gap="2" flexWrap="wrap">
            <Text
              fontSize="18px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              PR #{pr.prId}
            </Text>
            <StatusBadge status={pr.status} />
          </Flex>
          <Text fontSize="13px" color={t.textMuted} mt="0.5" truncate>
            {pr.title || `${pr.branch} → main`}
          </Text>
        </Box>
        <Button
          size="sm"
          bg="linear-gradient(135deg, #3b82f6, #8b5cf6)"
          color="white"
          borderRadius="lg"
          fontSize="12px"
          fontWeight="600"
          px="5"
          _hover={{ opacity: 0.9 }}
          onClick={handleAnalyze}
          disabled={
            analyzing || pr.status === "analyzing" || pr.status === "completed"
          }
        >
          <Icon mr="1.5" boxSize="3.5">
            <LuPlay />
          </Icon>
          {analyzing ? "Analyzing..." : "Run Analysis"}
        </Button>
      </Flex>

      {/* Auto-analysis countdown banner */}
      {pr.status === "received" && countdown !== null && countdown > 0 && (
        <Box mb="4">
          <GlassCard>
            <Flex
              align="center"
              justify="space-between"
              gap="4"
              flexWrap="wrap"
            >
              <Flex align="center" gap="3">
                <Flex
                  w="40px"
                  h="40px"
                  borderRadius="xl"
                  bg="rgba(59,130,246,0.1)"
                  border="1px solid rgba(59,130,246,0.2)"
                  align="center"
                  justify="center"
                  flexShrink="0"
                >
                  <Icon color="#3b82f6" boxSize="5">
                    <LuTimer />
                  </Icon>
                </Flex>
                <Box>
                  <Text fontSize="14px" fontWeight="700" color={t.textPrimary}>
                    Auto-Analysis Scheduled
                  </Text>
                  <Text fontSize="12px" color={t.textMuted}>
                    Analysis will start automatically in{" "}
                    <Text
                      as="span"
                      fontWeight="800"
                      fontFamily="mono"
                      color="#3b82f6"
                    >
                      {countdown}s
                    </Text>
                    . Click "Run Analysis" to start now.
                  </Text>
                </Box>
              </Flex>

              {/* Circular countdown */}
              <Flex align="center" gap="3">
                <Box position="relative" w="48px" h="48px">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    {/* Background circle */}
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke={t.border}
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - countdown / 60)}`}
                      style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                  </svg>
                  <Flex
                    position="absolute"
                    inset="0"
                    align="center"
                    justify="center"
                  >
                    <Text
                      fontSize="14px"
                      fontWeight="800"
                      fontFamily="mono"
                      color="#3b82f6"
                    >
                      {countdown}
                    </Text>
                  </Flex>
                </Box>
                <Button
                  size="sm"
                  bg="linear-gradient(135deg, #3b82f6, #8b5cf6)"
                  color="white"
                  borderRadius="lg"
                  fontSize="12px"
                  fontWeight="600"
                  px="4"
                  _hover={{ opacity: 0.9, transform: "scale(1.02)" }}
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  transition="all 0.15s"
                >
                  <Icon mr="1.5" boxSize="3.5">
                    <LuPlay />
                  </Icon>
                  Run Now
                </Button>
              </Flex>
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* Waiting for auto-analysis to start (countdown finished) */}
      {pr.status === "received" && countdown !== null && countdown <= 0 && (
        <Box mb="4">
          <GlassCard>
            <Flex align="center" gap="3">
              <Spinner size="sm" color="#3b82f6" />
              <Text fontSize="13px" color={t.textMuted}>
                Auto-analysis starting...
              </Text>
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* PR metadata cards */}
      <Grid
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        gap="3"
        mb="4"
      >
        <GlassCard>
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg="rgba(59,130,246,0.1)"
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color="#3b82f6" boxSize="4">
                <LuUser />
              </Icon>
            </Flex>
            <Box minW="0">
              <Text
                fontSize="10px"
                color={t.textFaint}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Author
              </Text>
              <Text
                fontSize="13px"
                color={t.textPrimary}
                fontWeight="600"
                truncate
              >
                {pr.author}
              </Text>
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard>
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg="rgba(139,92,246,0.1)"
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color="#8b5cf6" boxSize="4">
                <LuGitBranch />
              </Icon>
            </Flex>
            <Box minW="0">
              <Text
                fontSize="10px"
                color={t.textFaint}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Branch
              </Text>
              <Text
                fontSize="13px"
                color={t.textPrimary}
                fontWeight="600"
                fontFamily="mono"
                truncate
              >
                {pr.branch}
              </Text>
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard>
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg="rgba(245,158,11,0.1)"
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color="#f59e0b" boxSize="4">
                <LuFileCode />
              </Icon>
            </Flex>
            <Box minW="0">
              <Text
                fontSize="10px"
                color={t.textFaint}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Files Changed
              </Text>
              <Text fontSize="13px" color={t.textPrimary} fontWeight="600">
                {pr.filesChanged?.length || 0} files
              </Text>
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard>
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg={`${riskColor}18`}
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color={riskColor} boxSize="4">
                <LuShieldAlert />
              </Icon>
            </Flex>
            <Box minW="0">
              <Text
                fontSize="10px"
                color={t.textFaint}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Risk Score
              </Text>
              <Text
                fontSize="20px"
                color={riskColor}
                fontWeight="800"
                fontFamily="mono"
                lineHeight="1.2"
              >
                {pr.riskScore ?? "—"}
                <Text as="span" fontSize="12px" fontWeight="500">
                  %
                </Text>
              </Text>
            </Box>
          </Flex>
        </GlassCard>
      </Grid>

      {/* Analysis results */}
      {pr.status !== "received" && (
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
          gap="3"
          mb="4"
        >
          <StatCard
            label="Selected Tests"
            value={pr.selectedTests?.length || 0}
            icon={<LuTestTubeDiagonal />}
            iconColor="#3b82f6"
            isInteger
          />
          <StatCard
            label="Skipped Tests"
            value={pr.skippedTests?.length || 0}
            icon={<LuTestTubes />}
            iconColor="#8b5cf6"
            isInteger
          />
          <StatCard
            label="Time Saved"
            value={pr.estimatedTimeSaved || 0}
            suffix="s"
            icon={<LuClock />}
            iconColor="#10b981"
          />
        </Grid>
      )}

      {/* Modules impacted */}
      {pr.modulesImpacted?.length > 0 && (
        <Box mb="4">
          <GlassCard>
            <Text
              fontSize="11px"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color={t.textMuted}
              mb="3"
            >
              <Icon boxSize="3" mr="1.5" verticalAlign="middle">
                <LuPackage />
              </Icon>
              Modules Impacted ({pr.modulesImpacted.length})
            </Text>
            <Flex gap="2" flexWrap="wrap">
              {pr.modulesImpacted.map((mod) => (
                <Badge
                  key={mod}
                  bg="rgba(139,92,246,0.1)"
                  color="#a78bfa"
                  borderRadius="md"
                  px="2.5"
                  py="1"
                  fontSize="11px"
                  fontWeight="600"
                  fontFamily="mono"
                  border="1px solid rgba(139,92,246,0.2)"
                >
                  {mod}
                </Badge>
              ))}
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* Files changed list */}
      {pr.filesChanged?.length > 0 && (
        <Box mb="4">
          <GlassCard>
            <Text
              fontSize="11px"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color={t.textMuted}
              mb="3"
            >
              <Icon boxSize="3" mr="1.5" verticalAlign="middle">
                <LuFileCode />
              </Icon>
              Files Changed ({pr.filesChanged.length})
            </Text>
            <Flex direction="column" gap="1">
              {pr.filesChanged.map((file) => (
                <Text
                  key={file}
                  fontSize="12px"
                  color={t.textSecondary}
                  fontFamily="mono"
                  py="1"
                  px="2"
                  borderRadius="md"
                  _hover={{ bg: t.bgHover }}
                >
                  {file}
                </Text>
              ))}
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* Risk Breakdown */}
      {pr.riskBreakdown && pr.status === "completed" && (
        <Box mb="4">
          <GlassCard>
            <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" color={t.textMuted} mb="3">
              <Icon boxSize="3" mr="1.5" verticalAlign="middle"><LuShieldAlert /></Icon>
              Risk Analysis Breakdown
            </Text>
            <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }} gap="2">
              {[
                { label: "File Risk", value: pr.riskBreakdown.fileRisk, color: "#ef4444" },
                { label: "Volume", value: pr.riskBreakdown.volumeRisk, color: "#f59e0b" },
                { label: "Spread", value: pr.riskBreakdown.spreadRisk, color: "#8b5cf6" },
                { label: "Critical", value: pr.riskBreakdown.criticalRisk, color: "#ec4899" },
                { label: "Commit", value: pr.riskBreakdown.commitRisk, color: "#3b82f6" },
              ].filter(item => item.value !== undefined).map((item) => (
                <Box key={item.label} p="3" borderRadius="lg" bg={t.bgHover} border={`1px solid ${t.border}`}>
                  <Text fontSize="10px" color={t.textFaint} fontWeight="600" mb="1">{item.label}</Text>
                  <Text fontSize="16px" fontWeight="800" fontFamily="mono" color={item.color}>{item.value}%</Text>
                  <Box h="3px" borderRadius="full" bg={t.bgInput} mt="1.5" overflow="hidden">
                    <Box h="100%" borderRadius="full" bg={item.color} w={`${item.value}%`} transition="width 0.6s ease" />
                  </Box>
                </Box>
              ))}
            </Grid>
          </GlassCard>
        </Box>
      )}

      {/* Test Execution Results */}
      {pr.testExecution?.results?.length > 0 && (
        <Box mb="4">
          <GlassCard>
            <Flex justify="space-between" align="center" mb="3" flexWrap="wrap" gap="2">
              <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" color={t.textMuted}>
                <Icon boxSize="3" mr="1.5" verticalAlign="middle"><LuTestTubeDiagonal /></Icon>
                Test Execution Results
              </Text>
              <Flex gap="3" align="center">
                <Flex align="center" gap="1.5">
                  <Box w="8px" h="8px" borderRadius="full" bg="#10b981" />
                  <Text fontSize="11px" color={t.textSecondary} fontWeight="600">{pr.testExecution.passed} passed</Text>
                </Flex>
                {pr.testExecution.failed > 0 && (
                  <Flex align="center" gap="1.5">
                    <Box w="8px" h="8px" borderRadius="full" bg="#ef4444" />
                    <Text fontSize="11px" color={t.textSecondary} fontWeight="600">{pr.testExecution.failed} failed</Text>
                  </Flex>
                )}
                <Badge bg={pr.testExecution.passRate >= 80 ? "rgba(16,185,129,0.1)" : pr.testExecution.passRate >= 50 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)"} color={pr.testExecution.passRate >= 80 ? "#10b981" : pr.testExecution.passRate >= 50 ? "#f59e0b" : "#ef4444"} borderRadius="md" px="2" py="0.5" fontSize="11px" fontWeight="700" fontFamily="mono">
                  {pr.testExecution.passRate}% pass rate
                </Badge>
              </Flex>
            </Flex>

            {/* Pass rate bar */}
            <Box h="6px" borderRadius="full" bg={t.bgInput} overflow="hidden" mb="4">
              <Flex h="100%">
                <Box h="100%" bg="#10b981" w={`${pr.testExecution.passRate}%`} transition="width 0.8s ease" />
                {pr.testExecution.failed > 0 && (
                  <Box h="100%" bg="#ef4444" w={`${100 - pr.testExecution.passRate}%`} transition="width 0.8s ease" />
                )}
              </Flex>
            </Box>

            {/* Individual test results */}
            <Flex direction="column" gap="1.5" maxH="400px" overflowY="auto" css={{ "&::-webkit-scrollbar": { width: "3px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.06)", borderRadius: "2px" } }}>
              {pr.testExecution.results.map((test) => (
                <Flex
                  key={test.name}
                  align="center"
                  gap="2"
                  py="2"
                  px="3"
                  borderRadius="lg"
                  bg={test.status === "failed" ? "rgba(239,68,68,0.04)" : "transparent"}
                  border={`1px solid ${test.status === "failed" ? "rgba(239,68,68,0.15)" : t.border}`}
                  _hover={{ bg: t.bgHover }}
                >
                  <Box w="7px" h="7px" borderRadius="full" bg={test.status === "passed" ? "#10b981" : "#ef4444"} flexShrink="0" />
                  <Text fontSize="11px" color={t.textPrimary} fontFamily="mono" fontWeight="500" flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {test.name}
                  </Text>
                  <Flex gap="2" align="center" flexShrink="0">
                    {test.assertions && (
                      <Text fontSize="10px" color={t.textFaint} fontFamily="mono">
                        {test.assertions.passed}/{test.assertions.total}
                      </Text>
                    )}
                    <Text fontSize="10px" color={t.textFaint} fontFamily="mono">{test.duration}ms</Text>
                    <Badge bg={test.status === "passed" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"} color={test.status === "passed" ? "#10b981" : "#ef4444"} borderRadius="md" px="1.5" py="0.5" fontSize="9px" fontWeight="700" textTransform="uppercase">
                      {test.status}
                    </Badge>
                  </Flex>
                </Flex>
              ))}
            </Flex>

            {/* Failed test details */}
            {pr.testExecution.results.filter(t => t.status === "failed").length > 0 && (
              <Box mt="4" pt="3" borderTop={`1px solid ${t.border}`}>
                <Text fontSize="10px" fontWeight="600" color="#ef4444" textTransform="uppercase" letterSpacing="0.05em" mb="2">Failed Test Details</Text>
                <Flex direction="column" gap="2">
                  {pr.testExecution.results.filter(r => r.status === "failed").map((test) => (
                    <Box key={`err-${test.name}`} px="3" py="2" borderRadius="lg" bg="rgba(239,68,68,0.05)" border="1px solid rgba(239,68,68,0.12)">
                      <Text fontSize="11px" color={t.textPrimary} fontFamily="mono" fontWeight="600">{test.name}</Text>
                      {test.error && (
                        <Text fontSize="11px" color="#ef4444" fontFamily="mono" mt="1">
                          {test.error.type}: {test.error.message}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Flex>
              </Box>
            )}
          </GlassCard>
        </Box>
      )}

      {/* Selected & Skipped Tests Summary (fallback if no execution data) */}
      {!pr.testExecution?.results?.length && pr.selectedTests?.length > 0 && (
        <Box mb="4">
          <GlassCard>
            <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" color={t.textMuted} mb="3">
              <Icon boxSize="3" mr="1.5" verticalAlign="middle"><LuTestTubeDiagonal /></Icon>
              Selected Tests ({pr.selectedTests.length})
            </Text>
            <Flex direction="column" gap="1">
              {pr.selectedTests.map((test) => (
                <Flex key={test} align="center" gap="2" py="1" px="2" borderRadius="md" _hover={{ bg: t.bgHover }}>
                  <Box w="6px" h="6px" borderRadius="full" bg="#10b981" flexShrink="0" />
                  <Text fontSize="12px" color={t.textSecondary} fontFamily="mono">{test}</Text>
                </Flex>
              ))}
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* Pipeline view */}
      <Box mb="4">
        <PipelineView stages={pr.pipeline?.stages || []} />
      </Box>

      {/* Log viewer */}
      <Box mb="4">
        <LogViewer logs={logs} />
      </Box>
    </Box>
  );
}
