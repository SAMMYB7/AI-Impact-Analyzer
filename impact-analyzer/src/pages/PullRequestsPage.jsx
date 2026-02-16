// ═══════════════════════════════════════════════════════════════
// PULL REQUESTS PAGE — Persistent history + simulation entry point
// ═══════════════════════════════════════════════════════════════

import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import {
  LuGitPullRequest,
  LuGitBranch,
  LuFileCode,
  LuUser,
  LuClock,
  LuPlay,
  LuRefreshCw,
  LuPlus,
  LuMinus,
  LuChevronRight,
  LuZap,
  LuEye,
  LuMessageSquare,
  LuFilter,
  LuCircleCheck,
  LuCircleX,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSimulation } from "../hooks/useSimulation";
import { useThemeColors } from "../hooks/useThemeColors";
import GlassCard from "../components/shared/GlassCard";
import StatusBadge from "../components/shared/StatusBadge";

export default function PullRequestsPage() {
  const { phase, currentPR, completedPRs, startSimulation, resetSimulation } =
    useSimulation();
  const navigate = useNavigate();
  const t = useThemeColors();
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterRisk, setFilterRisk] = useState("all");

  const handleAnalyze = () => {
    if (phase !== "idle" && phase !== "completed") return;
    if (phase === "completed") resetSimulation();

    setIsGenerating(true);
    setTimeout(() => {
      startSimulation();
      setIsGenerating(false);
      setTimeout(() => navigate("/analysis"), 1500);
    }, 800);
  };

  // Build the PR list: current active + all accumulated history
  const allPRs = useMemo(() => {
    const list = [];

    // Active current PR at the top if present
    if (currentPR) {
      list.push({
        ...currentPR,
        status: phase === "completed" ? "completed" : "analyzing",
        _isActive: true,
      });
    }

    // Accumulated completed PRs (persistent history)
    completedPRs.forEach((pr) => {
      // Skip if it's the same as the currently active PR
      if (currentPR && pr.id === currentPR.id) return;
      list.push({ ...pr, _isActive: false });
    });

    return list;
  }, [currentPR, completedPRs, phase]);

  // Filter
  const filteredPRs = useMemo(() => {
    if (filterRisk === "all") return allPRs;
    return allPRs.filter((pr) => pr.risk === filterRisk);
  }, [allPRs, filterRisk]);

  const riskCounts = useMemo(() => {
    const counts = { all: allPRs.length, high: 0, medium: 0, low: 0 };
    allPRs.forEach((pr) => {
      if (pr.risk) counts[pr.risk]++;
    });
    return counts;
  }, [allPRs]);

  return (
    <Box className="page-enter">
      {/* Header Actions */}
      <Flex justify="space-between" align="center" mb="4">
        <Box>
          <Text fontSize="xs" color={t.textMuted} mb="1">
            {allPRs.length} pull requests •{" "}
            {
              allPRs.filter(
                (p) => p.status === "completed" || p.status === "failed",
              ).length
            }{" "}
            completed
          </Text>
        </Box>
        <Flex gap="3">
          <Flex
            align="center"
            gap="2"
            bg={t.bgInput}
            px="4"
            py="2"
            borderRadius="lg"
            cursor="pointer"
            border={`1px solid ${t.border}`}
            _hover={{ bg: t.bgHover }}
            onClick={() => {
              if (phase === "completed") resetSimulation();
            }}
          >
            <Icon color={t.textMuted} boxSize="3.5">
              <LuRefreshCw />
            </Icon>
            <Text fontSize="xs" color={t.textSecondary} fontWeight="500">
              Refresh
            </Text>
          </Flex>
          <Flex
            align="center"
            gap="2"
            bg={
              phase === "idle" || phase === "completed"
                ? "linear-gradient(135deg, #4F46E5, #8B5CF6)"
                : t.bgHover
            }
            px="5"
            py="2"
            borderRadius="lg"
            cursor={
              phase === "idle" || phase === "completed"
                ? "pointer"
                : "not-allowed"
            }
            _hover={
              phase === "idle" || phase === "completed"
                ? { opacity: 0.9, transform: "translateY(-1px)" }
                : {}
            }
            transition="all 0.2s"
            boxShadow={
              phase === "idle" || phase === "completed"
                ? "0 4px 20px rgba(79, 70, 229, 0.3)"
                : "none"
            }
            onClick={handleAnalyze}
            opacity={phase !== "idle" && phase !== "completed" ? 0.5 : 1}
          >
            {isGenerating ? (
              <Spinner size="xs" color="white" />
            ) : (
              <Icon color="white" boxSize="3.5">
                <LuZap />
              </Icon>
            )}
            <Text fontSize="xs" color="white" fontWeight="700">
              {isGenerating ? "Generating PR..." : "Simulate New PR"}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Risk Filters */}
      <Flex gap="2" mb="4">
        {[
          { key: "all", label: "All" },
          { key: "high", label: "High Risk", color: "#ef4444" },
          { key: "medium", label: "Medium", color: "#f59e0b" },
          { key: "low", label: "Low", color: "#22C55E" },
        ].map((f) => (
          <Flex
            key={f.key}
            align="center"
            gap="1.5"
            px="3"
            py="1.5"
            borderRadius="full"
            bg={
              filterRisk === f.key
                ? f.color
                  ? `${f.color}15`
                  : t.accentLight
                : t.bgInput
            }
            border={`1px solid ${filterRisk === f.key ? f.color || t.accent : t.border}`}
            cursor="pointer"
            onClick={() => setFilterRisk(f.key)}
            transition="all 0.2s"
            _hover={{ bg: t.bgHover }}
          >
            <Text
              fontSize="xs"
              fontWeight="600"
              color={
                filterRisk === f.key ? f.color || t.accentText : t.textMuted
              }
            >
              {f.label}
            </Text>
            <Text
              fontSize="10px"
              color={
                filterRisk === f.key ? f.color || t.accentText : t.textFaint
              }
              fontWeight="500"
            >
              {riskCounts[f.key]}
            </Text>
          </Flex>
        ))}
      </Flex>

      {/* PR List */}
      <VStack gap="3" align="stretch">
        {filteredPRs.map((pr) => (
          <GlassCard
            key={pr.id + (pr._isActive ? "-active" : "")}
            hover
            glow={
              pr.risk === "high"
                ? "rgba(239,68,68,0.1)"
                : pr.risk === "medium"
                  ? "rgba(245,158,11,0.1)"
                  : "rgba(16,185,129,0.1)"
            }
            cursor="pointer"
            onClick={() => {
              if (pr._isActive && currentPR) navigate("/analysis");
            }}
          >
            {/* Active PR indicator shimmer */}
            {pr._isActive && phase !== "idle" && phase !== "completed" && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="2px"
                bg="linear-gradient(90deg, #4F46E5, #8B5CF6, #4F46E5)"
                backgroundSize="200% 100%"
                animation="shimmer 2s linear infinite"
              />
            )}

            <Flex justify="space-between" align="flex-start">
              {/* Left Section */}
              <Flex gap="4" flex="1">
                {/* PR Icon */}
                <Flex
                  w="42px"
                  h="42px"
                  borderRadius="lg"
                  bg={
                    pr.risk === "high"
                      ? "rgba(239,68,68,0.1)"
                      : pr.risk === "medium"
                        ? "rgba(245,158,11,0.1)"
                        : "rgba(16,185,129,0.1)"
                  }
                  border={`1px solid ${pr.risk === "high" ? "rgba(239,68,68,0.2)" : pr.risk === "medium" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`}
                  align="center"
                  justify="center"
                  flexShrink="0"
                >
                  <Icon
                    color={
                      pr.risk === "high"
                        ? "#ef4444"
                        : pr.risk === "medium"
                          ? "#f59e0b"
                          : "#22C55E"
                    }
                    boxSize="5"
                  >
                    <LuGitPullRequest />
                  </Icon>
                </Flex>

                {/* PR Info */}
                <Box flex="1">
                  <Flex align="center" gap="2" mb="1">
                    <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                      {pr.id}
                    </Text>
                    <StatusBadge
                      status={
                        pr._isActive &&
                        phase !== "completed" &&
                        phase !== "idle"
                          ? "analyzing"
                          : pr.status === "failed"
                            ? "failed"
                            : pr.status === "completed"
                              ? "completed"
                              : "open"
                      }
                    />
                    {/* Test result summary */}
                    {(pr.testsPassed !== undefined ||
                      pr.testsFailed !== undefined) && (
                      <Flex align="center" gap="1.5" ml="1">
                        {pr.testsFailed > 0 ? (
                          <Flex align="center" gap="0.5">
                            <Icon color="#ef4444" boxSize="3">
                              <LuCircleX />
                            </Icon>
                            <Text
                              fontSize="10px"
                              color="#ef4444"
                              fontWeight="600"
                            >
                              {pr.testsFailed}
                            </Text>
                          </Flex>
                        ) : null}
                        <Flex align="center" gap="0.5">
                          <Icon color="#22C55E" boxSize="3">
                            <LuCircleCheck />
                          </Icon>
                          <Text
                            fontSize="10px"
                            color="#22C55E"
                            fontWeight="600"
                          >
                            {pr.testsPassed || 0}
                          </Text>
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                  <Text
                    fontSize="sm"
                    color={t.textSecondary}
                    mb="2"
                    fontWeight="500"
                  >
                    {pr.commitMessage}
                  </Text>
                  <Flex gap="4" flexWrap="wrap">
                    <Flex align="center" gap="1.5">
                      <Icon color={t.textFaint} boxSize="3">
                        <LuGitBranch />
                      </Icon>
                      <Text fontSize="xs" color={t.textMuted} fontFamily="mono">
                        {pr.branch}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="1.5">
                      <Icon color={t.textFaint} boxSize="3">
                        <LuUser />
                      </Icon>
                      <Text fontSize="xs" color={t.textMuted}>
                        {pr.author.name}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="1.5">
                      <Icon color={t.textFaint} boxSize="3">
                        <LuFileCode />
                      </Icon>
                      <Text fontSize="xs" color={t.textMuted}>
                        {pr.changedFiles.length} files
                      </Text>
                    </Flex>
                    <Flex align="center" gap="1">
                      <Text fontSize="xs" color="#22C55E" fontWeight="600">
                        +{pr.additions}
                      </Text>
                      <Text fontSize="xs" color="#ef4444" fontWeight="600">
                        -{pr.deletions}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>

              {/* Right Section */}
              <Flex direction="column" align="flex-end" gap="2">
                {/* Risk Score */}
                <Flex
                  align="center"
                  gap="2"
                  bg={`${pr.risk === "high" ? "rgba(239,68,68,0.1)" : pr.risk === "medium" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)"}`}
                  px="3"
                  py="1.5"
                  borderRadius="lg"
                  border={`1px solid ${pr.risk === "high" ? "rgba(239,68,68,0.2)" : pr.risk === "medium" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`}
                >
                  <Text fontSize="xs" color={t.textMuted}>
                    Risk
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={
                      pr.risk === "high"
                        ? "#ef4444"
                        : pr.risk === "medium"
                          ? "#f59e0b"
                          : "#22C55E"
                    }
                  >
                    {pr.riskScore}
                  </Text>
                </Flex>

                {/* Modules */}
                <Flex gap="1" flexWrap="wrap" justify="flex-end">
                  {pr.modules.slice(0, 3).map((mod, i) => (
                    <Text
                      key={i}
                      fontSize="10px"
                      bg={t.bgInput}
                      px="2"
                      py="0.5"
                      borderRadius="md"
                      color={t.textMuted}
                      border={`1px solid ${t.border}`}
                    >
                      {mod}
                    </Text>
                  ))}
                  {pr.modules.length > 3 && (
                    <Text fontSize="10px" color={t.textFaint}>
                      +{pr.modules.length - 3}
                    </Text>
                  )}
                </Flex>

                {/* Action icons */}
                <HStack gap="2" mt="1">
                  <Flex align="center" gap="1">
                    <Icon color={t.textFaint} boxSize="3">
                      <LuEye />
                    </Icon>
                    <Text fontSize="10px" color={t.textFaint}>
                      {((pr.number * 3 + 2) % 8) + 2}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <Icon color={t.textFaint} boxSize="3">
                      <LuMessageSquare />
                    </Icon>
                    <Text fontSize="10px" color={t.textFaint}>
                      {(pr.number * 2 + 1) % 5}
                    </Text>
                  </Flex>
                </HStack>
              </Flex>
            </Flex>

            {/* Changed Files Preview for active PR */}
            {pr._isActive && currentPR && (
              <Box mt="4" pt="4" borderTop={`1px solid ${t.borderLight}`}>
                <Text fontSize="xs" fontWeight="600" color={t.textMuted} mb="2">
                  Changed Files
                </Text>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap="1.5"
                >
                  {pr.changedFiles.map((file, i) => (
                    <Flex
                      key={i}
                      align="center"
                      gap="2"
                      bg={t.bgSubtle}
                      px="3"
                      py="1.5"
                      borderRadius="md"
                    >
                      <Icon color="#4F46E5" boxSize="3">
                        <LuFileCode />
                      </Icon>
                      <Text
                        fontSize="xs"
                        color={t.textSecondary}
                        fontFamily="mono"
                      >
                        {file}
                      </Text>
                    </Flex>
                  ))}
                </Grid>
              </Box>
            )}
          </GlassCard>
        ))}

        {filteredPRs.length === 0 && (
          <Flex
            justify="center"
            py="12"
            direction="column"
            align="center"
            gap="3"
          >
            <Icon color={t.textFaint} boxSize="10">
              <LuGitPullRequest />
            </Icon>
            <Text fontSize="sm" color={t.textMuted}>
              No pull requests match the selected filter.
            </Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
