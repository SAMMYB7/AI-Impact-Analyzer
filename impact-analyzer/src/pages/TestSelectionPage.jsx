// ═══════════════════════════════════════════════════════════════
// TEST SELECTION PAGE — Shows test selection data from analysis
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
  LuFilter,
  LuTarget,
  LuPackage,
  LuFileCode,
  LuCircleCheck,
  LuCircleX,
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

  // Aggregate test stats
  const totalSelected = completed.reduce(
    (s, p) => s + (p.selectedTests?.length || 0),
    0,
  );
  const totalSkipped = completed.reduce(
    (s, p) => s + (p.skippedTests?.length || 0),
    0,
  );
  const totalAll = completed.reduce((s, p) => s + (p.totalTests || 0), 0);
  const selectionRate =
    totalAll > 0 ? Math.round((totalSelected / totalAll) * 100) : 0;

  // Aggregate all unique modules
  const moduleSet = new Set();
  completed.forEach((p) =>
    (p.modulesImpacted || []).forEach((m) => moduleSet.add(m)),
  );
  const allModules = [...moduleSet];

  // Build per-module test count
  const moduleTestMap = {};
  completed.forEach((p) => {
    (p.modulesImpacted || []).forEach((mod) => {
      if (!moduleTestMap[mod]) moduleTestMap[mod] = { selected: 0, prs: 0 };
      moduleTestMap[mod].prs += 1;
    });
    (p.selectedTests || []).forEach((test) => {
      const mod = test
        .replace(".test.js", "")
        .replace(".integration.test.js", "");
      if (moduleTestMap[mod]) {
        moduleTestMap[mod].selected += 1;
      }
    });
  });

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
          <Flex
            w="36px"
            h="36px"
            borderRadius="lg"
            bg="rgba(59,130,246,0.1)"
            align="center"
            justify="center"
          >
            <Icon color="#3b82f6" boxSize="5">
              <LuTestTubeDiagonal />
            </Icon>
          </Flex>
          <Box>
            <Text
              fontSize="20px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              Test Selection Engine
            </Text>
            <Text fontSize="13px" color={t.textMuted}>
              Intelligent test mapping from changed files to test suites
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
          label="Tests Selected"
          value={totalSelected}
          icon={<LuTestTubeDiagonal />}
          iconColor="#3b82f6"
        />
        <StatCard
          label="Tests Skipped"
          value={totalSkipped}
          icon={<LuTestTubes />}
          iconColor="#f59e0b"
        />
        <StatCard
          label="Selection Rate"
          value={selectionRate}
          suffix="%"
          icon={<LuFilter />}
          iconColor="#8b5cf6"
        />
        <StatCard
          label="Modules Covered"
          value={allModules.length}
          icon={<LuPackage />}
          iconColor="#14b8a6"
        />
      </Grid>

      {/* Module Coverage Map + Selection Efficiency */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mb="6">
        {/* Module to test mapping */}
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
              <LuPackage />
            </Icon>
            Module Coverage Map
          </Text>
          {allModules.length === 0 ? (
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">
                No modules analyzed yet
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="3">
              {allModules.map((mod) => {
                const data = moduleTestMap[mod] || { selected: 0, prs: 0 };
                return (
                  <Flex
                    key={mod}
                    align="center"
                    justify="space-between"
                    px="3"
                    py="2.5"
                    borderRadius="lg"
                    bg={t.bgHover}
                    border={`1px solid ${t.border}`}
                  >
                    <Flex align="center" gap="2">
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg="#8b5cf6"
                        flexShrink="0"
                      />
                      <Text
                        fontSize="13px"
                        color={t.textPrimary}
                        fontFamily="mono"
                        fontWeight="600"
                      >
                        {mod}
                      </Text>
                    </Flex>
                    <Flex gap="3">
                      <Badge
                        bg="rgba(59,130,246,0.1)"
                        color="#3b82f6"
                        borderRadius="md"
                        px="2"
                        py="0.5"
                        fontSize="10px"
                        border="1px solid rgba(59,130,246,0.2)"
                      >
                        {data.selected} tests
                      </Badge>
                      <Badge
                        bg="rgba(139,92,246,0.1)"
                        color="#a78bfa"
                        borderRadius="md"
                        px="2"
                        py="0.5"
                        fontSize="10px"
                        border="1px solid rgba(139,92,246,0.2)"
                      >
                        {data.prs} PRs
                      </Badge>
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </GlassCard>

        {/* Selection efficiency per PR */}
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
              <LuTarget />
            </Icon>
            Selection Efficiency by PR
          </Text>
          {completed.length === 0 ? (
            <Flex align="center" justify="center" py="8">
              <Text color={t.textFaint} fontSize="sm">
                No completed analyses
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="2">
              {completed.slice(0, 10).map((pr) => {
                const sel = pr.selectedTests?.length || 0;
                const skip = pr.skippedTests?.length || 0;
                const total = pr.totalTests || sel + skip || 1;
                const pct = Math.round((sel / total) * 100);
                return (
                  <Box
                    key={pr.prId}
                    px="3"
                    py="2"
                    borderRadius="lg"
                    _hover={{ bg: t.bgHover }}
                    cursor="pointer"
                    onClick={() => navigate(`/pr/${pr.prId}`)}
                    transition="background 0.15s"
                  >
                    <Flex justify="space-between" mb="1">
                      <Text
                        fontSize="11px"
                        color={t.accent}
                        fontFamily="mono"
                        fontWeight="600"
                      >
                        {pr.prId.length > 18
                          ? `...${pr.prId.slice(-12)}`
                          : pr.prId}
                      </Text>
                      <Flex gap="2" align="center">
                        <Flex align="center" gap="1">
                          <Icon color="#10b981" boxSize="3">
                            <LuCircleCheck />
                          </Icon>
                          <Text fontSize="10px" color={t.textSecondary}>
                            {sel}
                          </Text>
                        </Flex>
                        <Flex align="center" gap="1">
                          <Icon color="#f59e0b" boxSize="3">
                            <LuCircleX />
                          </Icon>
                          <Text fontSize="10px" color={t.textSecondary}>
                            {skip}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Box
                      h="5px"
                      borderRadius="full"
                      bg={t.bgHover}
                      overflow="hidden"
                    >
                      <Box
                        h="100%"
                        borderRadius="full"
                        bg="#3b82f6"
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
      </Grid>

      {/* Full test list table */}
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
              <LuFileCode />
            </Icon>
            Per-PR Test Breakdown
          </Text>
        </Box>
        {completed.length === 0 ? (
          <Flex align="center" justify="center" py="12">
            <Text color={t.textFaint} fontSize="sm">
              No test data available
            </Text>
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="sm" variant="plain">
              <Table.Header>
                <Table.Row>
                  {["PR", "Selected", "Skipped", "Total", "Rate", "Files"].map(
                    (h) => (
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
                    ),
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {completed.slice(0, 20).map((pr) => {
                  const sel = pr.selectedTests?.length || 0;
                  const skip = pr.skippedTests?.length || 0;
                  const total = pr.totalTests || 0;
                  const rate = total > 0 ? Math.round((sel / total) * 100) : 0;
                  return (
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
                        fontSize="12px"
                        color="#10b981"
                        fontWeight="600"
                        fontFamily="mono"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {sel}
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        color="#f59e0b"
                        fontWeight="600"
                        fontFamily="mono"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {skip}
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        color={t.textSecondary}
                        fontFamily="mono"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {total}
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        fontFamily="mono"
                        borderBottom={`1px solid ${t.border}`}
                      >
                        <Text
                          color={
                            rate >= 70
                              ? "#10b981"
                              : rate >= 40
                                ? "#f59e0b"
                                : "#ef4444"
                          }
                          fontWeight="600"
                        >
                          {rate}%
                        </Text>
                      </Table.Cell>
                      <Table.Cell
                        px="4"
                        py="3"
                        fontSize="12px"
                        color={t.textMuted}
                        borderBottom={`1px solid ${t.border}`}
                      >
                        {pr.filesChanged?.length || 0}
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
