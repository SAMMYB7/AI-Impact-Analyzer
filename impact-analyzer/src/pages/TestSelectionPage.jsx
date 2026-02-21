// ═══════════════════════════════════════════════════════════════
// TEST SELECTION PAGE — AI-powered test selection insights
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
  LuTestTubeDiagonal,
  LuTestTubes,
  LuTarget,
  LuPackage,
  LuBrain,
  LuCircleCheck,
  LuCircleX,
  LuShieldCheck,
  LuZap,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatCard from "../components/shared/StatCard";
import { useThemeColors } from "../hooks/useThemeColors";
import { usePR } from "../context/usePRHook";

export default function TestSelectionPage() {
  const t = useThemeColors();
  const navigate = useNavigate();
  const { prs, refreshPRs, loading } = usePR();

  useEffect(() => {
    refreshPRs();
  }, [refreshPRs]);

  const completed = prs.filter((p) => p.status === "completed");

  // Aggregate stats
  const totalSelected = completed.reduce((s, p) => s + (p.selectedTests?.length || 0), 0);
  const totalSkipped = completed.reduce((s, p) => s + (p.skippedTests?.length || 0), 0);
  const totalAll = totalSelected + totalSkipped;
  const selectionRate = totalAll > 0 ? Math.round((totalSelected / totalAll) * 100) : 0;

  // Module coverage
  const moduleCounts = {};
  completed.forEach((pr) => {
    (pr.modulesImpacted || []).forEach((mod) => {
      moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    });
  });
  const sortedModules = Object.entries(moduleCounts).sort((a, b) => b[1] - a[1]);

  // Coverage estimate
  const avgCoverage = completed.length > 0
    ? Math.round(completed.reduce((s, p) => s + (p.coverageEstimate || 0), 0) / completed.length)
    : 0;

  // AI-powered PRs
  const aiPowered = completed.filter((p) => p.analysisProvider?.startsWith("ollama")).length;

  if (loading && prs.length === 0) {
    return (
      <Flex align="center" justify="center" h="60vh" gap="3">
        <Spinner size="md" color="#3b82f6" />
        <Text color={t.textMuted}>Loading test selection data...</Text>
      </Flex>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb="6">
        <Flex align="center" gap="3" mb="1">
          <Flex w="36px" h="36px" borderRadius="lg" bg="rgba(139,92,246,0.1)" align="center" justify="center">
            <Icon color="#8b5cf6" boxSize="5"><LuTestTubeDiagonal /></Icon>
          </Flex>
          <Box>
            <Text fontSize="20px" fontWeight="800" color={t.textPrimary} letterSpacing="-0.02em">Test Selection</Text>
            <Text fontSize="13px" color={t.textMuted}>AI-powered intelligent test selection and coverage analysis</Text>
          </Box>
        </Flex>
      </Box>

      {/* Stats */}
      <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }} gap="4" mb="6">
        <StatCard label="Tests Selected" value={totalSelected} icon={<LuCircleCheck />} iconColor="#10b981" isInteger />
        <StatCard label="Tests Skipped" value={totalSkipped} icon={<LuCircleX />} iconColor="#f59e0b" isInteger />
        <StatCard label="Selection Rate" value={selectionRate} suffix="%" icon={<LuTarget />} iconColor="#3b82f6" />
        <StatCard label="Avg Coverage" value={avgCoverage} suffix="%" icon={<LuShieldCheck />} iconColor="#14b8a6" />
      </Grid>

      {/* AI Strategy + Module Coverage */}
      <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap="4" mb="6">
        {/* AI Selection Strategies */}
        <GlassCard>
          <Flex align="center" gap="2" mb="3">
            <Icon color="#8b5cf6" boxSize="3.5"><LuBrain /></Icon>
            <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" color={t.textMuted}>
              AI Selection Strategies
            </Text>
            {aiPowered > 0 && (
              <Badge bg="rgba(139,92,246,0.1)" color="#a78bfa" borderRadius="md" px="1.5" fontSize="9px" fontWeight="700" border="1px solid rgba(139,92,246,0.2)">
                {aiPowered} AI-powered
              </Badge>
            )}
          </Flex>
          {completed.length === 0 ? (
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">No test selection data — analyze a PR to see strategies</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="2.5">
              {completed.slice(0, 6).map((pr) => (
                <Box key={pr.prId} px="3" py="2.5" borderRadius="lg" _hover={{ bg: t.bgHover }} cursor="pointer" onClick={() => navigate(`/pr/${pr.prId}`)} transition="background 0.15s" border={`1px solid ${t.border}`}>
                  <Flex justify="space-between" align="center" mb="1">
                    <Flex align="center" gap="2">
                      <Text fontSize="11px" color={t.accent} fontFamily="mono" fontWeight="600">{pr.prId.length > 18 ? `...${pr.prId.slice(-12)}` : pr.prId}</Text>
                      <Badge bg={pr.analysisProvider?.startsWith("ollama") ? "rgba(139,92,246,0.1)" : "rgba(59,130,246,0.1)"} color={pr.analysisProvider?.startsWith("ollama") ? "#a78bfa" : "#3b82f6"} borderRadius="md" px="1.5" fontSize="9px" fontWeight="600">
                        {pr.analysisProvider?.startsWith("ollama") ? "AI" : "Heuristic"}
                      </Badge>
                    </Flex>
                    <Flex gap="2" align="center">
                      <Text fontSize="10px" color="#10b981" fontFamily="mono" fontWeight="600">{pr.selectedTests?.length || 0} sel</Text>
                      <Text fontSize="10px" color="#f59e0b" fontFamily="mono" fontWeight="600">{pr.skippedTests?.length || 0} skip</Text>
                      {pr.coverageEstimate > 0 && (
                        <Badge bg="rgba(20,184,166,0.1)" color="#14b8a6" borderRadius="md" px="1.5" fontSize="9px" fontWeight="700">{pr.coverageEstimate}%</Badge>
                      )}
                    </Flex>
                  </Flex>
                  {pr.testSelectionStrategy && (
                    <Text fontSize="11px" color={t.textFaint} lineHeight="1.4" noOfLines={2}>{pr.testSelectionStrategy}</Text>
                  )}
                </Box>
              ))}
            </Flex>
          )}
        </GlassCard>

        {/* Module Coverage Map */}
        <GlassCard>
          <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" color={t.textMuted} mb="3">
            <Icon boxSize="3" mr="1.5" verticalAlign="middle"><LuPackage /></Icon>
            Module Coverage Map
          </Text>
          {sortedModules.length === 0 ? (
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">No module data</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="2">
              {sortedModules.slice(0, 10).map(([mod, count]) => {
                const maxCount = sortedModules[0][1];
                const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
                return (
                  <Box key={mod}>
                    <Flex justify="space-between" mb="1">
                      <Text fontSize="11px" color={t.textPrimary} fontFamily="mono" fontWeight="500">{mod}</Text>
                      <Text fontSize="10px" color={t.textFaint} fontFamily="mono">{count}x</Text>
                    </Flex>
                    <Box h="4px" borderRadius="full" bg={t.bgInput} overflow="hidden">
                      <Box h="100%" borderRadius="full" bg="linear-gradient(90deg, #8b5cf6, #3b82f6)" w={`${pct}%`} transition="width 0.6s ease" />
                    </Box>
                  </Box>
                );
              })}
            </Flex>
          )}
        </GlassCard>
      </Grid>

      {/* Selection Efficiency Table */}
      <GlassCard noPadding>
        <Box px="5" py="4" borderBottom={`1px solid ${t.border}`}>
          <Flex align="center" gap="2">
            <Icon color="#3b82f6" boxSize="3"><LuZap /></Icon>
            <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" color={t.textMuted}>
              Selection Efficiency by PR
            </Text>
          </Flex>
        </Box>
        {completed.length === 0 ? (
          <Flex align="center" justify="center" py="12">
            <Text color={t.textFaint} fontSize="sm">No test selection data yet</Text>
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="sm" variant="plain">
              <Table.Header>
                <Table.Row>
                  {["PR", "Provider", "Selected", "Skipped", "Rate", "Coverage", "Strategy"].map((h) => (
                    <Table.ColumnHeader key={h} px="4" py="3" fontSize="10px" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em" color={t.textFaint} borderBottom={`1px solid ${t.border}`}>{h}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {completed.slice(0, 15).map((pr) => {
                  const sel = pr.selectedTests?.length || 0;
                  const skip = pr.skippedTests?.length || 0;
                  const total = sel + skip;
                  const rate = total > 0 ? Math.round((sel / total) * 100) : 0;
                  return (
                    <Table.Row key={pr.prId} _hover={{ bg: t.bgHover }} cursor="pointer" onClick={() => navigate(`/pr/${pr.prId}`)}>
                      <Table.Cell px="4" py="3" fontSize="12px" fontFamily="mono" color={t.accent} fontWeight="600" borderBottom={`1px solid ${t.border}`}>
                        {pr.prId.length > 18 ? `...${pr.prId.slice(-12)}` : pr.prId}
                      </Table.Cell>
                      <Table.Cell px="4" py="3" borderBottom={`1px solid ${t.border}`}>
                        <Badge bg={pr.analysisProvider?.startsWith("ollama") ? "rgba(139,92,246,0.1)" : "rgba(59,130,246,0.1)"} color={pr.analysisProvider?.startsWith("ollama") ? "#a78bfa" : "#3b82f6"} borderRadius="md" px="1.5" fontSize="9px" fontWeight="700">
                          {pr.analysisProvider?.startsWith("ollama") ? `AI (${pr.modelVersion || "qwen3"})` : "Heuristic"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell px="4" py="3" fontSize="12px" color="#10b981" fontWeight="600" fontFamily="mono" borderBottom={`1px solid ${t.border}`}>{sel}</Table.Cell>
                      <Table.Cell px="4" py="3" fontSize="12px" color="#f59e0b" fontWeight="600" fontFamily="mono" borderBottom={`1px solid ${t.border}`}>{skip}</Table.Cell>
                      <Table.Cell px="4" py="3" borderBottom={`1px solid ${t.border}`}>
                        <Badge bg={rate >= 70 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)"} color={rate >= 70 ? "#10b981" : "#f59e0b"} borderRadius="md" px="1.5" fontSize="10px" fontWeight="700" fontFamily="mono">{rate}%</Badge>
                      </Table.Cell>
                      <Table.Cell px="4" py="3" fontSize="12px" fontFamily="mono" color="#14b8a6" fontWeight="600" borderBottom={`1px solid ${t.border}`}>
                        {pr.coverageEstimate ? `${pr.coverageEstimate}%` : "—"}
                      </Table.Cell>
                      <Table.Cell px="4" py="3" fontSize="11px" color={t.textFaint} borderBottom={`1px solid ${t.border}`} maxW="250px">
                        <Text noOfLines={1}>{pr.testSelectionStrategy || "—"}</Text>
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
