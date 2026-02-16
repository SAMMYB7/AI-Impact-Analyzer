// ═══════════════════════════════════════════════════════════════
// METRICS PAGE — Aggregate analytics and performance charts
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { Box, Flex, Text, Grid, Icon, Spinner } from "@chakra-ui/react";
import {
  LuChartColumnIncreasing,
  LuTrendingUp,
  LuClock,
  LuShieldAlert,
  LuGitPullRequest,
  LuTestTubeDiagonal,
  LuActivity,
  LuZap,
  LuCalendarDays,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatCard from "../components/shared/StatCard";
import { useThemeColors } from "../hooks/useThemeColors";
import { usePR } from "../context/usePRHook";

export default function MetricsPage() {
  const t = useThemeColors();
  const { prs, refreshPRs, loading } = usePR();

  useEffect(() => {
    refreshPRs();
  }, [refreshPRs]);

  const completed = prs.filter((p) => p.status === "completed");
  const failed = prs.filter((p) => p.status === "failed");
  const totalRuns = completed.length + failed.length;

  // Aggregates
  const totalTimeSaved = completed.reduce(
    (s, p) => s + (p.estimatedTimeSaved || 0),
    0,
  );
  const totalTestsSelected = completed.reduce(
    (s, p) => s + (p.selectedTests?.length || 0),
    0,
  );
  const totalTestsSkipped = completed.reduce(
    (s, p) => s + (p.skippedTests?.length || 0),
    0,
  );
  const avgRisk =
    completed.length > 0
      ? Math.round(
          completed.reduce((s, p) => s + (p.riskScore || 0), 0) /
            completed.length,
        )
      : 0;
  const avgConfidence =
    completed.length > 0
      ? Math.round(
          completed.reduce((s, p) => s + (p.confidence || 0), 0) /
            completed.length,
        )
      : 0;
  const successRate =
    totalRuns > 0 ? Math.round((completed.length / totalRuns) * 100) : 0;

  // Risk over time (chronological completed PRs)
  const riskTimeline = completed
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Unique authors
  const authors = [...new Set(prs.map((p) => p.author))];

  // Unique repos
  const repos = [...new Set(prs.map((p) => p.repo))];

  if (loading && prs.length === 0) {
    return (
      <Flex align="center" justify="center" h="60vh" gap="3">
        <Spinner size="md" color="#3b82f6" />
        <Text color={t.textMuted}>Loading metrics...</Text>
      </Flex>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb="6">
        <Flex align="center" gap="3" mb="1">
          <Flex
            w="36px"
            h="36px"
            borderRadius="lg"
            bg="rgba(245,158,11,0.1)"
            align="center"
            justify="center"
          >
            <Icon color="#f59e0b" boxSize="5">
              <LuChartColumnIncreasing />
            </Icon>
          </Flex>
          <Box>
            <Text
              fontSize="20px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              Analytics & Metrics
            </Text>
            <Text fontSize="13px" color={t.textMuted}>
              Aggregate performance insights across all analysis runs
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Top-level stats */}
      <Grid
        templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }}
        gap="4"
        mb="6"
      >
        <StatCard
          label="Total PRs"
          value={prs.length}
          icon={<LuGitPullRequest />}
          iconColor="#3b82f6"
        />
        <StatCard
          label="Pipeline Success"
          value={successRate}
          suffix="%"
          icon={<LuActivity />}
          iconColor="#10b981"
        />
        <StatCard
          label="Total Time Saved"
          value={Math.round(totalTimeSaved / 60)}
          suffix=" min"
          icon={<LuClock />}
          iconColor="#14b8a6"
        />
        <StatCard
          label="Tests Selected"
          value={totalTestsSelected}
          icon={<LuTestTubeDiagonal />}
          iconColor="#8b5cf6"
        />
      </Grid>

      {/* Risk timeline chart (text-based) + Summary cards */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4" mb="6">
        {/* Risk score timeline */}
        <GlassCard>
          <Text
            fontSize="11px"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.08em"
            color={t.textMuted}
            mb="4"
          >
            <Icon boxSize="3" mr="1.5" verticalAlign="middle">
              <LuTrendingUp />
            </Icon>
            Risk Score Timeline
          </Text>
          {riskTimeline.length === 0 ? (
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">
                No data points yet
              </Text>
            </Flex>
          ) : (
            <Box>
              {/* Visual bar chart */}
              <Flex align="flex-end" gap="2" h="160px" px="2">
                {riskTimeline.slice(-20).map((pr, i) => {
                  const score = pr.riskScore || 0;
                  const rc =
                    score >= 70
                      ? "#ef4444"
                      : score >= 40
                        ? "#f59e0b"
                        : "#10b981";
                  return (
                    <Flex
                      key={pr.prId}
                      direction="column"
                      align="center"
                      flex="1"
                      gap="1"
                    >
                      <Text
                        fontSize="9px"
                        color={t.textFaint}
                        fontFamily="mono"
                      >
                        {score}
                      </Text>
                      <Box
                        w="100%"
                        maxW="32px"
                        h={`${Math.max(score * 1.3, 8)}px`}
                        borderRadius="md"
                        bg={rc}
                        opacity={0.8}
                        transition="height 0.6s ease"
                        _hover={{ opacity: 1 }}
                        boxShadow={`0 0 8px ${rc}30`}
                      />
                    </Flex>
                  );
                })}
              </Flex>
              <Flex justify="space-between" mt="2" px="2">
                <Text fontSize="9px" color={t.textFaint}>
                  Oldest
                </Text>
                <Text fontSize="9px" color={t.textFaint}>
                  Latest
                </Text>
              </Flex>
            </Box>
          )}
        </GlassCard>

        {/* Summary panel */}
        <GlassCard>
          <Text
            fontSize="11px"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.08em"
            color={t.textMuted}
            mb="4"
          >
            <Icon boxSize="3" mr="1.5" verticalAlign="middle">
              <LuZap />
            </Icon>
            Overview
          </Text>
          <Flex direction="column" gap="3">
            {[
              {
                label: "Avg Risk Score",
                value: `${avgRisk}%`,
                color:
                  avgRisk >= 70
                    ? "#ef4444"
                    : avgRisk >= 40
                      ? "#f59e0b"
                      : "#10b981",
              },
              {
                label: "Avg Confidence",
                value: `${avgConfidence}%`,
                color: "#3b82f6",
              },
              {
                label: "Tests Selected",
                value: totalTestsSelected.toString(),
                color: t.textPrimary,
              },
              {
                label: "Tests Skipped",
                value: totalTestsSkipped.toString(),
                color: t.textPrimary,
              },
              {
                label: "Failed Runs",
                value: failed.length.toString(),
                color: failed.length > 0 ? "#ef4444" : t.textPrimary,
              },
              {
                label: "Unique Authors",
                value: authors.length.toString(),
                color: t.textPrimary,
              },
              {
                label: "Repositories",
                value: repos.length.toString(),
                color: t.textPrimary,
              },
            ].map((item) => (
              <Flex key={item.label} justify="space-between" align="center">
                <Text fontSize="12px" color={t.textMuted}>
                  {item.label}
                </Text>
                <Text
                  fontSize="13px"
                  color={item.color}
                  fontWeight="700"
                  fontFamily="mono"
                >
                  {item.value}
                </Text>
              </Flex>
            ))}
          </Flex>
        </GlassCard>
      </Grid>

      {/* Time saved & efficiency */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4">
        {/* Per-PR time savings */}
        <GlassCard>
          <Text
            fontSize="11px"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.08em"
            color={t.textMuted}
            mb="4"
          >
            <Icon boxSize="3" mr="1.5" verticalAlign="middle">
              <LuClock />
            </Icon>
            Time Saved per PR
          </Text>
          {completed.length === 0 ? (
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">
                No data
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="2">
              {completed.slice(0, 10).map((pr) => {
                const saved = pr.estimatedTimeSaved || 0;
                const maxSaved = 360;
                const pct = Math.min((saved / maxSaved) * 100, 100);
                return (
                  <Box key={pr.prId}>
                    <Flex justify="space-between" mb="1">
                      <Text
                        fontSize="11px"
                        color={t.textSecondary}
                        fontFamily="mono"
                      >
                        {pr.prId.length > 16
                          ? `...${pr.prId.slice(-10)}`
                          : pr.prId}
                      </Text>
                      <Text
                        fontSize="11px"
                        color="#14b8a6"
                        fontWeight="600"
                        fontFamily="mono"
                      >
                        {saved}s
                      </Text>
                    </Flex>
                    <Box
                      h="6px"
                      borderRadius="full"
                      bg={t.bgHover}
                      overflow="hidden"
                    >
                      <Box
                        h="100%"
                        borderRadius="full"
                        bg="linear-gradient(90deg, #14b8a6, #10b981)"
                        w={`${pct}%`}
                        transition="width 0.6s ease"
                      />
                    </Box>
                  </Box>
                );
              })}
            </Flex>
          )}
        </GlassCard>

        {/* Activity by date */}
        <GlassCard>
          <Text
            fontSize="11px"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.08em"
            color={t.textMuted}
            mb="4"
          >
            <Icon boxSize="3" mr="1.5" verticalAlign="middle">
              <LuCalendarDays />
            </Icon>
            Recent Activity
          </Text>
          {prs.length === 0 ? (
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">
                No activity yet
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="2">
              {prs.slice(0, 12).map((pr) => (
                <Flex
                  key={pr.prId}
                  align="center"
                  justify="space-between"
                  py="1.5"
                  px="2"
                  borderRadius="md"
                  _hover={{ bg: t.bgHover }}
                >
                  <Flex align="center" gap="2">
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="full"
                      bg={
                        pr.status === "completed"
                          ? "#10b981"
                          : pr.status === "failed"
                            ? "#ef4444"
                            : pr.status === "analyzing"
                              ? "#3b82f6"
                              : "#64748b"
                      }
                      flexShrink="0"
                    />
                    <Text
                      fontSize="11px"
                      color={t.textSecondary}
                      fontFamily="mono"
                    >
                      {pr.prId.length > 16
                        ? `...${pr.prId.slice(-10)}`
                        : pr.prId}
                    </Text>
                  </Flex>
                  <Text fontSize="10px" color={t.textFaint}>
                    {pr.createdAt
                      ? new Date(pr.createdAt).toLocaleString()
                      : "—"}
                  </Text>
                </Flex>
              ))}
            </Flex>
          )}
        </GlassCard>
      </Grid>
    </Box>
  );
}
