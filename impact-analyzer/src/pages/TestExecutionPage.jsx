// ═══════════════════════════════════════════════════════════════
// TEST EXECUTION PAGE — CI pipeline simulation with live logs
// ═══════════════════════════════════════════════════════════════

import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
  VStack,
  Spinner,
  Badge,
  Separator,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import {
  LuPlay,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuTerminal,
  LuActivity,
  LuTimer,
  LuGitBranch,
} from "react-icons/lu";
import { useSimulation } from "../hooks/useSimulation";
import { useThemeColors } from "../hooks/useThemeColors";
import GlassCard from "../components/shared/GlassCard";
import StatusBadge from "../components/shared/StatusBadge";

export default function TestExecutionPage() {
  const { phase, currentPR, testResults, pipelineStages, visibleLogs } =
    useSimulation();
  const t = useThemeColors();
  const logEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleLogs]);

  const isRunning = phase === "running_tests";
  const isCompleted = phase === "completed";
  const hasResults = testResults && testResults.length > 0;
  const passedCount = hasResults
    ? testResults.filter((t) => t.status === "passed").length
    : 0;
  const failedCount = hasResults
    ? testResults.filter((t) => t.status === "failed").length
    : 0;
  const totalDuration = hasResults
    ? testResults.reduce((acc, t) => acc + t.duration, 0).toFixed(2)
    : 0;

  if (!currentPR && phase === "idle") {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="60vh"
        gap="4"
      >
        <Flex
          w="80px"
          h="80px"
          borderRadius="2xl"
          bg="rgba(34, 197, 94, 0.1)"
          border="1px solid rgba(34, 197, 94, 0.2)"
          align="center"
          justify="center"
        >
          <Icon color="#22C55E" boxSize="8">
            <LuPlay />
          </Icon>
        </Flex>
        <Text color={t.textSecondary} fontSize="lg" fontWeight="600">
          No Test Run Active
        </Text>
        <Text color={t.textFaint} fontSize="sm" textAlign="center" maxW="400px">
          Start a PR simulation to see the CI pipeline and test execution in
          action.
        </Text>
      </Flex>
    );
  }

  return (
    <Box className="page-enter">
      {/* Pipeline Timeline */}
      <GlassCard mb="6">
        <Flex justify="space-between" align="center" mb="4">
          <Flex align="center" gap="2">
            <Icon color="#4F46E5" boxSize="4">
              <LuActivity />
            </Icon>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Pipeline Execution
            </Text>
          </Flex>
          {currentPR && (
            <Flex align="center" gap="2">
              <Icon color={t.textFaint} boxSize="3">
                <LuGitBranch />
              </Icon>
              <Text fontSize="xs" color={t.textMuted} fontFamily="mono">
                {currentPR.branch}
              </Text>
            </Flex>
          )}
        </Flex>

        <Flex
          gap="2"
          overflowX="auto"
          pb="2"
          css={{
            "&::-webkit-scrollbar": { height: "4px" },
            "&::-webkit-scrollbar-thumb": {
              bg: t.scrollThumb,
              borderRadius: "2px",
            },
          }}
        >
          {pipelineStages.map((stage, i) => (
            <Flex
              key={i}
              direction="column"
              align="center"
              gap="2"
              bg={
                stage.status === "completed"
                  ? "rgba(34, 197, 94, 0.06)"
                  : stage.status === "running"
                    ? "rgba(79, 70, 229, 0.06)"
                    : t.bgSubtle
              }
              border={`1px solid ${
                stage.status === "completed"
                  ? "rgba(34, 197, 94, 0.15)"
                  : stage.status === "running"
                    ? "rgba(79, 70, 229, 0.2)"
                    : t.borderLight
              }`}
              borderRadius="lg"
              p="3"
              minW="120px"
              transition="all 0.5s"
              animation={
                stage.status === "running" ? "pulse 2s infinite" : "none"
              }
            >
              <Text fontSize="lg">{stage.icon}</Text>
              <Text
                fontSize="10px"
                fontWeight="600"
                color={
                  stage.status === "completed"
                    ? "#22C55E"
                    : stage.status === "running"
                      ? "#818CF8"
                      : t.textFaint
                }
                textAlign="center"
              >
                {stage.name}
              </Text>
              <Text fontSize="10px" color={t.textFaint}>
                {stage.duration}
              </Text>
              {stage.status === "running" && (
                <Spinner size="xs" color="#818CF8" />
              )}
              {stage.status === "completed" && (
                <Icon color="#22C55E" boxSize="3">
                  <LuCircleCheck />
                </Icon>
              )}
            </Flex>
          ))}
        </Flex>
      </GlassCard>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mb="6">
        {/* Test Results */}
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Test Results
            </Text>
            {isRunning && <Spinner size="xs" color="#818CF8" />}
            {isCompleted && (
              <Flex gap="3">
                <Flex align="center" gap="1">
                  <Icon color="#22C55E" boxSize="3">
                    <LuCircleCheck />
                  </Icon>
                  <Text fontSize="xs" color="#22C55E" fontWeight="700">
                    {passedCount} passed
                  </Text>
                </Flex>
                <Flex align="center" gap="1">
                  <Icon color="#ef4444" boxSize="3">
                    <LuCircleX />
                  </Icon>
                  <Text fontSize="xs" color="#ef4444" fontWeight="700">
                    {failedCount} failed
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>
          <VStack
            gap="1.5"
            align="stretch"
            maxH="400px"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bg: t.scrollThumb,
                borderRadius: "2px",
              },
            }}
          >
            {hasResults ? (
              testResults.map((test, i) => (
                <Flex
                  key={i}
                  align="center"
                  justify="space-between"
                  bg={
                    test.status === "passed"
                      ? "rgba(34, 197, 94, 0.04)"
                      : "rgba(239, 68, 68, 0.06)"
                  }
                  border={`1px solid ${test.status === "passed" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.15)"}`}
                  px="3"
                  py="2"
                  borderRadius="md"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${i * 0.06}s both`,
                  }}
                >
                  <Flex align="center" gap="2" flex="1">
                    <Icon
                      color={test.status === "passed" ? "#22C55E" : "#ef4444"}
                      boxSize="3.5"
                    >
                      {test.status === "passed" ? (
                        <LuCircleCheck />
                      ) : (
                        <LuCircleX />
                      )}
                    </Icon>
                    <Box flex="1">
                      <Text
                        fontSize="xs"
                        fontFamily="mono"
                        color={t.textSecondary}
                      >
                        {test.name}
                      </Text>
                      <Text fontSize="10px" color={t.textFaint}>
                        {test.module}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Text fontSize="10px" color={t.textFaint}>
                      {test.assertions} assertions
                    </Text>
                    <Flex align="center" gap="1">
                      <Icon color={t.textFaint} boxSize="2.5">
                        <LuTimer />
                      </Icon>
                      <Text
                        fontSize="10px"
                        color={t.textMuted}
                        fontFamily="mono"
                      >
                        {test.duration}s
                      </Text>
                    </Flex>
                    <StatusBadge status={test.status} />
                  </Flex>
                </Flex>
              ))
            ) : (
              <Flex direction="column" align="center" py="8" gap="2">
                {phase === "running_tests" ? (
                  <>
                    <Spinner color="#4F46E5" />
                    <Text fontSize="sm" color={t.textFaint}>
                      Running tests...
                    </Text>
                  </>
                ) : (
                  <Text fontSize="sm" color={t.textFaint}>
                    Waiting for test execution...
                  </Text>
                )}
              </Flex>
            )}
          </VStack>
          {isCompleted && (
            <Box mt="3" pt="3" borderTop={`1px solid ${t.borderLight}`}>
              <Flex justify="space-between">
                <Text fontSize="xs" color={t.textMuted}>
                  Total Duration
                </Text>
                <Text fontSize="xs" fontWeight="700" color={t.textPrimary}>
                  {totalDuration}s
                </Text>
              </Flex>
            </Box>
          )}
        </GlassCard>

        {/* Live Log Stream */}
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Flex align="center" gap="2">
              <Icon color="#4F46E5" boxSize="4">
                <LuTerminal />
              </Icon>
              <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                Live Output
              </Text>
            </Flex>
            {visibleLogs.length > 0 && !isCompleted && (
              <Flex align="center" gap="2">
                <Box
                  w="6px"
                  h="6px"
                  borderRadius="full"
                  bg="#ef4444"
                  animation="pulse 1s infinite"
                />
                <Text fontSize="10px" color={t.textMuted}>
                  LIVE
                </Text>
              </Flex>
            )}
          </Flex>
          <Box
            bg="rgba(0, 0, 0, 0.3)"
            borderRadius="lg"
            p="3"
            maxH="400px"
            overflowY="auto"
            fontFamily="mono"
            fontSize="11px"
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bg: t.scrollThumb,
                borderRadius: "2px",
              },
            }}
          >
            {visibleLogs.map((log, i) => (
              <Flex
                key={i}
                gap="2"
                py="0.5"
                opacity={0}
                style={{ animation: `fadeIn 0.3s ease-out forwards` }}
              >
                <Text color={t.textFaint} whiteSpace="nowrap" flexShrink="0">
                  {new Date(log.ts).toLocaleTimeString()}
                </Text>
                <Text
                  color={
                    log.level === "ERROR"
                      ? "#ef4444"
                      : log.level === "WARN"
                        ? "#f59e0b"
                        : log.level === "DEBUG"
                          ? "#8B5CF6"
                          : "#22C55E"
                  }
                  fontWeight="600"
                  w="50px"
                  flexShrink="0"
                >
                  {log.level}
                </Text>
                <Text color={t.textSecondary}>{log.message}</Text>
              </Flex>
            ))}
            <div ref={logEndRef} />
            {visibleLogs.length === 0 && (
              <Text color={t.textFaint}>Waiting for output...</Text>
            )}
          </Box>
        </GlassCard>
      </Grid>

      {/* Execution Summary */}
      {isCompleted && (
        <GlassCard>
          <Flex align="center" gap="2" mb="4">
            <Icon color="#22C55E" boxSize="4">
              <LuCircleCheck />
            </Icon>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Execution Summary
            </Text>
          </Flex>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap="4"
          >
            <Box
              bg="rgba(34, 197, 94, 0.06)"
              p="4"
              borderRadius="lg"
              textAlign="center"
              border="1px solid rgba(34, 197, 94, 0.1)"
            >
              <Text fontSize="2xl" fontWeight="600" color="#22C55E">
                {passedCount}
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Passed
              </Text>
            </Box>
            <Box
              bg="rgba(239, 68, 68, 0.06)"
              p="4"
              borderRadius="lg"
              textAlign="center"
              border="1px solid rgba(239, 68, 68, 0.1)"
            >
              <Text fontSize="2xl" fontWeight="600" color="#ef4444">
                {failedCount}
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Failed
              </Text>
            </Box>
            <Box
              bg="rgba(79, 70, 229, 0.06)"
              p="4"
              borderRadius="lg"
              textAlign="center"
              border="1px solid rgba(79, 70, 229, 0.1)"
            >
              <Text fontSize="2xl" fontWeight="600" color="#818CF8">
                {totalDuration}s
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Duration
              </Text>
            </Box>
            <Box
              bg="rgba(79, 70, 229, 0.06)"
              p="4"
              borderRadius="lg"
              textAlign="center"
              border="1px solid rgba(79, 70, 229, 0.1)"
            >
              <Text fontSize="2xl" fontWeight="600" color="#A5B4FC">
                87.3%
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Coverage
              </Text>
            </Box>
          </Grid>
        </GlassCard>
      )}
    </Box>
  );
}
