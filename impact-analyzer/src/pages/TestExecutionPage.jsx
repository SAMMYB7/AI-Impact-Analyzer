// ═══════════════════════════════════════════════════════════════
// TEST EXECUTION PAGE — Pipeline execution monitoring
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
  Spinner,
  Badge,
  Table,
} from "@chakra-ui/react";
import {
  LuPlay,
  LuClock,
  LuCircleCheck,
  LuCircleX,
  LuTimer,
  LuActivity,
  LuZap,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatCard from "../components/shared/StatCard";
import StatusBadge from "../components/shared/StatusBadge";
import PipelineView from "../components/PipelineView";
import { useThemeColors } from "../hooks/useThemeColors";
import { usePR } from "../context/usePRHook";
import { getPR } from "../api/api";

export default function TestExecutionPage() {
  const t = useThemeColors();
  const navigate = useNavigate();
  const { prs, refreshPRs, loading } = usePR();
  const [pipelines, setPipelines] = useState([]);
  const [loadingPipelines, setLoadingPipelines] = useState(false);

  useEffect(() => {
    refreshPRs();
  }, [refreshPRs]);

  // Fetch pipeline data for recent PRs
  useEffect(() => {
    if (prs.length === 0) return;
    let ignore = false;
    setLoadingPipelines(true);

    async function fetchPipelines() {
      const results = [];
      // Fetch pipeline for up to 10 most recent PRs
      const recentPRs = prs.slice(0, 10);
      for (const pr of recentPRs) {
        try {
          const data = await getPR(pr.prId);
          const prObj = data.pr || data;
          if (prObj.pipeline) {
            results.push({
              prId: pr.prId,
              status: pr.status,
              pipeline: prObj.pipeline,
            });
          }
        } catch {
          // skip
        }
      }
      if (!ignore) {
        setPipelines(results);
        setLoadingPipelines(false);
      }
    }

    fetchPipelines();
    return () => {
      ignore = true;
    };
  }, [prs]);

  const completed = prs.filter((p) => p.status === "completed");
  const failed = prs.filter((p) => p.status === "failed");
  const analyzing = prs.filter((p) => p.status === "analyzing");

  // Avg time saved
  const avgTimeSaved =
    completed.length > 0
      ? Math.round(
          completed.reduce((s, p) => s + (p.estimatedTimeSaved || 0), 0) /
            completed.length,
        )
      : 0;

  // Compute pipeline success rate
  const totalRuns = completed.length + failed.length;
  const successRate =
    totalRuns > 0 ? Math.round((completed.length / totalRuns) * 100) : 0;

  if (loading && prs.length === 0) {
    return (
      <Flex align="center" justify="center" h="60vh" gap="3">
        <Spinner size="md" color="#3b82f6" />
        <Text color={t.textMuted}>Loading execution data...</Text>
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
            bg="rgba(16,185,129,0.1)"
            align="center"
            justify="center"
          >
            <Icon color="#10b981" boxSize="5">
              <LuPlay />
            </Icon>
          </Flex>
          <Box>
            <Text
              fontSize="20px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              Test Execution
            </Text>
            <Text fontSize="13px" color={t.textMuted}>
              Pipeline runs, execution timelines, and pass/fail rates
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Stats */}
      <Grid
        templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }}
        gap="4"
        mb="6"
      >
        <StatCard
          label="Completed Runs"
          value={completed.length}
          icon={<LuCircleCheck />}
          iconColor="#10b981"
        />
        <StatCard
          label="Failed Runs"
          value={failed.length}
          icon={<LuCircleX />}
          iconColor="#ef4444"
        />
        <StatCard
          label="Success Rate"
          value={successRate}
          suffix="%"
          icon={<LuActivity />}
          iconColor="#3b82f6"
        />
        <StatCard
          label="Avg Time Saved"
          value={avgTimeSaved}
          suffix="s"
          icon={<LuTimer />}
          iconColor="#14b8a6"
        />
      </Grid>

      {/* Currently running */}
      {analyzing.length > 0 && (
        <Box mb="6">
          <GlassCard>
            <Flex align="center" gap="2" mb="3">
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg="#3b82f6"
                boxShadow="0 0 8px rgba(59,130,246,0.5)"
                animation="pulse 2s infinite"
              />
              <Text
                fontSize="11px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
              >
                Currently Running ({analyzing.length})
              </Text>
            </Flex>
            <Flex direction="column" gap="2">
              {analyzing.map((pr) => (
                <Flex
                  key={pr.prId}
                  align="center"
                  justify="space-between"
                  px="3"
                  py="2.5"
                  borderRadius="lg"
                  bg="rgba(59,130,246,0.05)"
                  border="1px solid rgba(59,130,246,0.15)"
                  cursor="pointer"
                  onClick={() => navigate(`/pr/${pr.prId}`)}
                  _hover={{ bg: "rgba(59,130,246,0.08)" }}
                  transition="background 0.15s"
                >
                  <Flex align="center" gap="2">
                    <Spinner size="xs" color="#3b82f6" />
                    <Text
                      fontSize="12px"
                      color={t.textPrimary}
                      fontFamily="mono"
                      fontWeight="600"
                    >
                      {pr.prId.length > 20
                        ? `...${pr.prId.slice(-14)}`
                        : pr.prId}
                    </Text>
                  </Flex>
                  <StatusBadge status="analyzing" />
                </Flex>
              ))}
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* Pipeline views for recent PRs */}
      <Box mb="6">
        <Text
          fontSize="11px"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.08em"
          color={t.textMuted}
          mb="3"
        >
          <Icon boxSize="3" mr="1.5" verticalAlign="middle">
            <LuZap />
          </Icon>
          Recent Pipeline Runs
        </Text>
        {loadingPipelines ? (
          <GlassCard>
            <Flex align="center" justify="center" py="8" gap="3">
              <Spinner size="sm" color="#3b82f6" />
              <Text color={t.textMuted} fontSize="sm">
                Loading pipeline data...
              </Text>
            </Flex>
          </GlassCard>
        ) : pipelines.length === 0 ? (
          <GlassCard>
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">
                No pipeline runs yet — analyze a PR to see execution data
              </Text>
            </Flex>
          </GlassCard>
        ) : (
          <Flex direction="column" gap="4">
            {pipelines.slice(0, 5).map((p) => (
              <Box
                key={p.prId}
                cursor="pointer"
                onClick={() => navigate(`/pr/${p.prId}`)}
              >
                <Flex align="center" gap="2" mb="2">
                  <Text
                    fontSize="12px"
                    fontFamily="mono"
                    fontWeight="600"
                    color={t.accent}
                  >
                    {p.prId.length > 20 ? `...${p.prId.slice(-14)}` : p.prId}
                  </Text>
                  <StatusBadge status={p.status} />
                </Flex>
                <PipelineView stages={p.pipeline?.stages || []} />
              </Box>
            ))}
          </Flex>
        )}
      </Box>

      {/* Execution history table */}
      <GlassCard noPadding>
        <Box px="5" py="4" borderBottom={`1px solid ${t.border}`}>
          <Text
            fontSize="11px"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.08em"
            color={t.textMuted}
          >
            <Icon boxSize="3" mr="1.5" verticalAlign="middle">
              <LuClock />
            </Icon>
            Execution History
          </Text>
        </Box>
        {prs.filter((p) => p.status !== "received").length === 0 ? (
          <Flex align="center" justify="center" py="12">
            <Text color={t.textFaint} fontSize="sm">
              No execution history
            </Text>
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="sm" variant="plain">
              <Table.Header>
                <Table.Row>
                  {[
                    "PR",
                    "Status",
                    "Tests Run",
                    "Time Saved",
                    "Branch",
                    "Date",
                  ].map((h) => (
                    <Table.ColumnHeader
                      key={h}
                      px="4"
                      py="3"
                      fontSize="10px"
                      fontWeight="600"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      color={t.textFaint}
                      borderBottom={`1px solid ${t.border}`}
                    >
                      {h}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {prs
                  .filter((p) => p.status !== "received")
                  .slice(0, 20)
                  .map((pr) => (
                    <Table.Row
                      key={pr.prId}
                      _hover={{ bg: t.bgHover }}
                      cursor="pointer"
                      onClick={() => navigate(`/pr/${pr.prId}`)}
                    >
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        fontFamily="mono"
                        color={t.accent}
                        fontWeight="600"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.prId.length > 18
                          ? `...${pr.prId.slice(-12)}`
                          : pr.prId}
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        <StatusBadge status={pr.status} />
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        fontFamily="mono"
                        color={t.textSecondary}
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.selectedTests?.length || 0}
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        fontFamily="mono"
                        color="#14b8a6"
                        fontWeight="600"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.estimatedTimeSaved || 0}s
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        fontFamily="mono"
                        color={t.textMuted}
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.branch}
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="11px"
                        color={t.textFaint}
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.analysisCompletedAt
                          ? new Date(pr.analysisCompletedAt).toLocaleString()
                          : pr.createdAt
                            ? new Date(pr.createdAt).toLocaleString()
                            : "—"}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </GlassCard>
    </Box>
  );
}
