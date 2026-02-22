// ═══════════════════════════════════════════════════════════════
// AI ANALYSIS PAGE — Risk predictions, model performance, insights
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
  LuBrain,
  LuShieldAlert,
  LuTrendingUp,
  LuChartBar,
  LuActivity,
  LuCpu,
  LuTarget,
  LuZap,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatCard from "../components/shared/StatCard";
import StatusBadge from "../components/shared/StatusBadge";
import { useThemeColors } from "../hooks/useThemeColors";
import { usePR } from "../context/usePRHook";
import { getAIHealth } from "../api/api";

export default function AIAnalysisPage() {
  const t = useThemeColors();
  const navigate = useNavigate();
  const { prs, refreshPRs, loading } = usePR();

  const [aiHealth, setAiHealth] = useState(null);

  useEffect(() => {
    refreshPRs();
    getAIHealth().then(setAiHealth).catch(() => setAiHealth({ available: false }));
  }, [refreshPRs]);

  const completed = prs.filter((p) => p.status === "completed");
  const failed = prs.filter((p) => p.status === "failed");

  const avgRisk = completed.length > 0 ? Math.round(completed.reduce((s, p) => s + (p.riskScore || 0), 0) / completed.length) : 0;
  const avgConfidence = completed.length > 0 ? Math.round(completed.reduce((s, p) => s + (p.confidence || 0), 0) / completed.length) : 0;
  const highRisk = completed.filter((p) => (p.riskScore || 0) >= 70).length;
  const medRisk = completed.filter((p) => (p.riskScore || 0) >= 40 && (p.riskScore || 0) < 70).length;
  const lowRisk = completed.filter((p) => (p.riskScore || 0) < 40).length;
  const aiPowered = completed.filter((p) => p.analysisProvider?.startsWith("ollama")).length;
  const modelProvider = completed.length > 0 ? completed[0].analysisProvider || "mock" : "Not Available";

  if (loading && prs.length === 0) {
    return (
      <Flex align="center" justify="center" h="60vh" gap="3">
        <Spinner size="md" color="#3b82f6" />
        <Text color={t.textMuted}>Loading analysis data...</Text>
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
            bg="rgba(139,92,246,0.1)"
            align="center"
            justify="center"
          >
            <Icon color="#8b5cf6" boxSize="5">
              <LuBrain />
            </Icon>
          </Flex>
          <Box>
            <Text
              fontSize="20px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              AI Impact Analysis
            </Text>
            <Text fontSize="13px" color={t.textMuted}>
              Risk prediction powered by Ollama {aiHealth?.model || "..."}
            </Text>
          </Box>
          {aiHealth && (
            <Badge bg={aiHealth.available ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"} color={aiHealth.available ? "#10b981" : "#ef4444"} borderRadius="md" px="2.5" py="1" fontSize="11px" fontWeight="700" border={`1px solid ${aiHealth.available ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`}>
              {aiHealth.available ? "● AI Online" : "○ AI Offline (using heuristics)"}
            </Badge>
          )}
        </Flex>
      </Box>

      {/* Stats */}
      <Grid
        templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }}
        gap="4"
        mb="6"
      >
        <StatCard
          label="Avg Risk Score"
          value={avgRisk}
          suffix="%"
          icon={<LuShieldAlert />}
          iconColor={
            avgRisk >= 70 ? "#ef4444" : avgRisk >= 40 ? "#f59e0b" : "#10b981"
          }
        />
        <StatCard
          label="Avg Confidence"
          value={avgConfidence}
          suffix="%"
          icon={<LuTarget />}
          iconColor="#3b82f6"
        />
        <StatCard
          label="High Risk PRs"
          value={highRisk}
          icon={<LuTrendingUp />}
          iconColor="#ef4444"
        />
        <StatCard
          label="Analyses Run"
          value={completed.length}
          icon={<LuActivity />}
          iconColor="#8b5cf6"
        />
      </Grid>

      {/* Risk Distribution + Model Info */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4" mb="6">
        {/* Risk distribution */}
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
              <LuChartBar />
            </Icon>
            Risk Distribution
          </Text>

          {completed.length === 0 ? (
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">
                No completed analyses yet — simulate a PR to see data
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="4">
              {/* Risk bars */}
              {[
                {
                  label: "High Risk (≥70)",
                  count: highRisk,
                  color: "#ef4444",
                  bg: "rgba(239,68,68,0.15)",
                },
                {
                  label: "Medium Risk (40-69)",
                  count: medRisk,
                  color: "#f59e0b",
                  bg: "rgba(245,158,11,0.15)",
                },
                {
                  label: "Low Risk (<40)",
                  count: lowRisk,
                  color: "#10b981",
                  bg: "rgba(16,185,129,0.15)",
                },
              ].map((tier) => {
                const pct =
                  completed.length > 0
                    ? (tier.count / completed.length) * 100
                    : 0;
                return (
                  <Box key={tier.label}>
                    <Flex justify="space-between" mb="1.5">
                      <Text
                        fontSize="12px"
                        color={t.textSecondary}
                        fontWeight="500"
                      >
                        {tier.label}
                      </Text>
                      <Text
                        fontSize="12px"
                        color={tier.color}
                        fontWeight="700"
                        fontFamily="mono"
                      >
                        {tier.count}{" "}
                        <Text as="span" color={t.textFaint} fontWeight="400">
                          ({Math.round(pct)}%)
                        </Text>
                      </Text>
                    </Flex>
                    <Box
                      h="8px"
                      borderRadius="full"
                      bg={t.bgHover}
                      overflow="hidden"
                    >
                      <Box
                        h="100%"
                        borderRadius="full"
                        bg={tier.color}
                        w={`${pct}%`}
                        transition="width 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
                        boxShadow={`0 0 8px ${tier.color}40`}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Flex>
          )}
        </GlassCard>

        <GlassCard>
          <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" color={t.textMuted} mb="4">
            <Icon boxSize="3" mr="1.5" verticalAlign="middle"><LuCpu /></Icon>
            AI Model Information
          </Text>
          <Flex direction="column" gap="3">
            {[
              { label: "Provider", value: modelProvider },
              { label: "Model", value: completed.length > 0 ? completed[0].modelVersion || "N/A" : "N/A" },
              { label: "AI Analyses", value: `${aiPowered}/${completed.length}` },
              { label: "Success Rate", value: completed.length + failed.length > 0 ? `${Math.round((completed.length / (completed.length + failed.length)) * 100)}%` : "N/A" },
              { label: "Status", value: aiHealth?.available ? "Connected" : "Offline" },
              { label: "Hosting", value: "EC2 (Ollama)" },
            ].map((item) => (
              <Flex key={item.label} justify="space-between" align="center">
                <Text fontSize="12px" color={t.textMuted}>{item.label}</Text>
                <Text fontSize="12px" color={item.label === "Status" ? (aiHealth?.available ? "#10b981" : "#ef4444") : t.textPrimary} fontWeight="600" fontFamily="mono">{item.value}</Text>
              </Flex>
            ))}
          </Flex>
        </GlassCard>
      </Grid>

      {/* Recent Predictions Table */}
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
              <LuZap />
            </Icon>
            Recent Predictions ({completed.length})
          </Text>
        </Box>
        {completed.length === 0 ? (
          <Flex align="center" justify="center" py="12">
            <Text color={t.textFaint} fontSize="sm">
              No predictions available
            </Text>
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="sm" variant="plain">
              <Table.Header>
                <Table.Row>
                  {[
                    "PR ID",
                    "Risk",
                    "Confidence",
                    "Impact",
                    "Summary",
                    "Modules",
                    "Provider",
                    "Status",
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
                {completed.slice(0, 20).map((pr) => {
                  const rc =
                    (pr.riskScore || 0) >= 70
                      ? "#ef4444"
                      : (pr.riskScore || 0) >= 40
                        ? "#f59e0b"
                        : "#10b981";
                  const impactColor =
                    pr.impactLevel === "high"
                      ? "#ef4444"
                      : pr.impactLevel === "medium"
                        ? "#f59e0b"
                        : "#10b981";
                  return (
                    <Table.Row
                      key={pr.prId}
                      _hover={{ bg: t.bgHover }}
                      cursor="pointer"
                      onClick={() => navigate(`/pr/${pr.prId}`)}
                      transition="background 0.15s"
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
                        <Text
                          fontSize="13px"
                          fontWeight="700"
                          fontFamily="mono"
                          color={rc}
                        >
                          {pr.riskScore ?? 0}%
                        </Text>
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        fontFamily="mono"
                        color={t.textSecondary}
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.confidence ?? 0}%
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.impactLevel ? (
                          <Badge
                            bg={`${impactColor}18`}
                            color={impactColor}
                            borderRadius="md"
                            px="2"
                            py="0.5"
                            fontSize="10px"
                            fontWeight="700"
                            textTransform="uppercase"
                            border={`1px solid ${impactColor}30`}
                          >
                            {pr.impactLevel}
                          </Badge>
                        ) : (
                          <Text fontSize="11px" color={t.textFaint}>—</Text>
                        )}
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        borderBottom={`1px solid ${t.border}`}
                        maxW="220px"
                      >
                        <Text
                          fontSize="11px"
                          color={t.textSecondary}
                          lineHeight="1.4"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {pr.aiSummary || pr.aiReasoning || "—"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        <Flex gap="1" flexWrap="wrap">
                          {(pr.modulesImpacted || []).slice(0, 3).map((m) => (
                            <Badge
                              key={m}
                              bg="rgba(139,92,246,0.1)"
                              color="#a78bfa"
                              borderRadius="md"
                              px="2"
                              py="0.5"
                              fontSize="10px"
                              fontFamily="mono"
                              border="1px solid rgba(139,92,246,0.2)"
                            >
                              {m}
                            </Badge>
                          ))}
                        </Flex>
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        color={t.textMuted}
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.analysisProvider || "mock"}
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        <StatusBadge status={pr.status} />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </GlassCard>
    </Box>
  );
}
