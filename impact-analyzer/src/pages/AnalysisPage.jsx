// ═══════════════════════════════════════════════════════════════
// AI ANALYSIS PAGE — Core illusion: staged AI impact reveal
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
  Badge,
  Separator,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import {
  LuBrain,
  LuShield,
  LuTriangleAlert,
  LuCircleCheck,
  LuFileCode,
  LuGitBranch,
  LuTarget,
  LuArrowRight,
  LuZap,
  LuActivity,
  LuNetwork,
  LuScan,
  LuCpu,
  LuTrendingUp,
  LuChevronRight,
} from "react-icons/lu";
import { useSimulation } from "../hooks/useSimulation";
import { useThemeColors } from "../hooks/useThemeColors";
import { useAnimatedCounter } from "../hooks/useAnimatedCounter";
import { DEPENDENCY_CHAINS } from "../data/mockData";
import GlassCard from "../components/shared/GlassCard";
import StatusBadge from "../components/shared/StatusBadge";

const STAGES = [
  { label: "Fetching changed files", icon: LuFileCode, color: "#4F46E5" },
  { label: "Mapping dependency graph", icon: LuNetwork, color: "#8B5CF6" },
  { label: "Running impact model", icon: LuCpu, color: "#f59e0b" },
  { label: "Predicting risk score", icon: LuShield, color: "#ef4444" },
  { label: "Analysis complete", icon: LuCircleCheck, color: "#22C55E" },
];

export default function AnalysisPage() {
  const { phase, currentPR } = useSimulation();
  const t = useThemeColors();
  const [revealedStage, setRevealedStage] = useState(0);

  // Staged reveal — derive from phase
  const targetStage = useMemo(() => {
    if (phase === "completed") return 5;
    if (phase === "selecting_tests" || phase === "running_tests") return 4;
    if (phase === "predicting") return 3;
    if (phase === "analyzing") return 2;
    if (phase === "pr_received") return 1;
    return 0;
  }, [phase]);

  // Animate stage transitions
  useEffect(() => {
    setRevealedStage(targetStage);
  }, [targetStage]);

  const riskScore = useAnimatedCounter(
    revealedStage >= 4 && currentPR ? currentPR.riskScore : 0,
    2000,
  );
  const confidence = useAnimatedCounter(
    revealedStage >= 4 && currentPR ? currentPR.confidence : 0,
    2000,
  );

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
          bg="rgba(79, 70, 229, 0.1)"
          border="1px solid rgba(79, 70, 229, 0.2)"
          align="center"
          justify="center"
        >
          <Icon color="#8B5CF6" boxSize="8">
            <LuBrain />
          </Icon>
        </Flex>
        <Text color={t.textSecondary} fontSize="lg" fontWeight="600">
          No Active Analysis
        </Text>
        <Text color={t.textFaint} fontSize="sm" textAlign="center" maxW="400px">
          Navigate to Pull Requests and click "Simulate New PR" to trigger an AI
          impact analysis.
        </Text>
      </Flex>
    );
  }

  const relevantDeps = currentPR
    ? DEPENDENCY_CHAINS.filter(
        (d) =>
          currentPR.modules.includes(d.from) ||
          currentPR.modules.includes(d.to),
      )
    : [];

  return (
    <Box className="page-enter">
      <GlassCard mb="6">
        <Flex justify="space-between" align="center" mb="4">
          <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
            Analysis Pipeline
          </Text>
          {phase !== "idle" && phase !== "completed" && (
            <Flex align="center" gap="2">
              <Spinner size="xs" color="#818CF8" />
              <Text fontSize="xs" color="#818CF8" fontWeight="500">
                Processing...
              </Text>
            </Flex>
          )}
          {phase === "completed" && <StatusBadge status="completed" />}
        </Flex>
        <Flex align="flex-start">
          {STAGES.flatMap((stage, i) => {
            const isCompleted = revealedStage > i;
            const isActive = revealedStage === i + 1 && phase !== "completed";

            const items = [
              <Flex
                key={`s${i}`}
                direction="column"
                align="center"
                gap="2"
                minW="80px"
              >
                <Flex
                  w="44px"
                  h="44px"
                  borderRadius="xl"
                  bg={
                    isCompleted
                      ? `${stage.color}20`
                      : isActive
                        ? `${stage.color}15`
                        : t.bgSubtle
                  }
                  border={`2px solid ${isCompleted ? stage.color : isActive ? stage.color : t.border}`}
                  align="center"
                  justify="center"
                  transition="all 0.5s"
                  boxShadow={isActive ? `0 0 20px ${stage.color}40` : "none"}
                  animation={isActive ? "pulse 2s infinite" : "none"}
                >
                  {isActive ? (
                    <Spinner size="sm" color={stage.color} />
                  ) : (
                    <Icon
                      color={isCompleted ? stage.color : t.textFaint}
                      boxSize="5"
                    >
                      <stage.icon />
                    </Icon>
                  )}
                </Flex>
                <Text
                  fontSize="10px"
                  color={
                    isCompleted
                      ? t.textSecondary
                      : isActive
                        ? stage.color
                        : t.textFaint
                  }
                  fontWeight={isActive ? "600" : "400"}
                  textAlign="center"
                  maxW="90px"
                >
                  {stage.label}
                </Text>
              </Flex>,
            ];

            if (i < STAGES.length - 1) {
              items.push(
                <Box
                  key={`l${i}`}
                  flex="1"
                  h="2px"
                  mt="21px"
                  bg={isCompleted ? stage.color : t.border}
                  transition="all 0.5s"
                  opacity={isCompleted ? 0.5 : 1}
                />,
              );
            }

            return items;
          })}
        </Flex>
      </GlassCard>

      {/* Main Analysis Content */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mb="6">
        {/* Risk Score Card */}
        <GlassCard>
          <Text fontSize="sm" fontWeight="700" color={t.textPrimary} mb="4">
            Risk Assessment
          </Text>
          {revealedStage >= 3 ? (
            <Flex direction="column" align="center" gap="4">
              {/* Risk Score Circle — SVG Ring */}
              <Box position="relative" w="160px" h="160px">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke={t.border}
                    strokeWidth="8"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    fill="none"
                    stroke={
                      currentPR?.risk === "high"
                        ? "#ef4444"
                        : currentPR?.risk === "medium"
                          ? "#f59e0b"
                          : "#22C55E"
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(riskScore / 100) * 2 * Math.PI * 72} ${2 * Math.PI * 72}`}
                    transform="rotate(-90 80 80)"
                    style={{ transition: "stroke-dasharray 2s ease-out" }}
                  />
                </svg>
                <Flex
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  align="center"
                  justify="center"
                  direction="column"
                >
                  <Text
                    fontSize="3xl"
                    fontWeight="600"
                    letterSpacing="-0.02em"
                    color={
                      currentPR?.risk === "high"
                        ? "#ef4444"
                        : currentPR?.risk === "medium"
                          ? "#f59e0b"
                          : "#22C55E"
                    }
                  >
                    {Math.round(riskScore)}
                  </Text>
                  <Badge
                    fontSize="9px"
                    variant="subtle"
                    bg={
                      currentPR?.risk === "high"
                        ? "rgba(239, 68, 68, 0.15)"
                        : currentPR?.risk === "medium"
                          ? "rgba(245, 158, 11, 0.15)"
                          : "rgba(34, 197, 94, 0.15)"
                    }
                    color={
                      currentPR?.risk === "high"
                        ? "#ef4444"
                        : currentPR?.risk === "medium"
                          ? "#f59e0b"
                          : "#22C55E"
                    }
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                    borderRadius="md"
                  >
                    Risk Score
                  </Badge>
                </Flex>
              </Box>

              {/* Risk Details */}
              <Flex w="100%" gap="3">
                <Box
                  flex="1"
                  bg={t.bgSubtle}
                  p="3"
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text fontSize="lg" fontWeight="600" color={t.textPrimary}>
                    {confidence.toFixed(1)}%
                  </Text>
                  <Text fontSize="10px" color={t.textMuted}>
                    Confidence
                  </Text>
                </Box>
                <Box
                  flex="1"
                  bg={t.bgSubtle}
                  p="3"
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text
                    fontSize="lg"
                    fontWeight="600"
                    color={t.textPrimary}
                    textTransform="capitalize"
                  >
                    {currentPR?.risk}
                  </Text>
                  <Text fontSize="10px" color={t.textMuted}>
                    Severity
                  </Text>
                </Box>
                <Box
                  flex="1"
                  bg={t.bgSubtle}
                  p="3"
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text fontSize="lg" fontWeight="600" color={t.textPrimary}>
                    {currentPR?.modules.length}
                  </Text>
                  <Text fontSize="10px" color={t.textMuted}>
                    Modules
                  </Text>
                </Box>
              </Flex>
            </Flex>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="250px"
              gap="3"
            >
              <Spinner size="lg" color="#8B5CF6" />
              <Text fontSize="sm" color={t.textMuted}>
                Computing risk assessment...
              </Text>
            </Flex>
          )}
        </GlassCard>

        {/* Impacted Modules */}
        <GlassCard>
          <Text fontSize="sm" fontWeight="700" color={t.textPrimary} mb="4">
            Impacted Modules
          </Text>
          {revealedStage >= 2 ? (
            <VStack gap="2" align="stretch">
              {currentPR?.modules.map((mod, i) => {
                const impactScore = Math.round(
                  85 - i * 12 + ((i * 7 + 3) % 10),
                );
                return (
                  <Flex
                    key={i}
                    bg={t.bgSubtle}
                    p="3"
                    borderRadius="lg"
                    justify="space-between"
                    align="center"
                    border={`1px solid ${t.borderLight}`}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both`,
                    }}
                  >
                    <Flex align="center" gap="3">
                      <Flex
                        w="32px"
                        h="32px"
                        borderRadius="lg"
                        bg="rgba(79, 70, 229, 0.1)"
                        align="center"
                        justify="center"
                      >
                        <Icon color="#8B5CF6" boxSize="4">
                          <LuTarget />
                        </Icon>
                      </Flex>
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color={t.textPrimary}
                        >
                          {mod}
                        </Text>
                        <Text fontSize="10px" color={t.textFaint}>
                          {currentPR.changedFiles.filter((f) => {
                            const modPart = mod
                              .toLowerCase()
                              .replace(/\s/g, "");
                            return f
                              .toLowerCase()
                              .includes(modPart.slice(0, 4));
                          }).length || 1}{" "}
                          files affected
                        </Text>
                      </Box>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Box w="60px" h="6px" borderRadius="full" bg={t.border}>
                        <Box
                          h="100%"
                          borderRadius="full"
                          bg={
                            impactScore > 70
                              ? "#ef4444"
                              : impactScore > 40
                                ? "#f59e0b"
                                : "#22C55E"
                          }
                          w={`${impactScore}%`}
                          transition="width 1s ease-out"
                        />
                      </Box>
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color={t.textSecondary}
                        w="30px"
                        textAlign="right"
                      >
                        {impactScore}%
                      </Text>
                    </Flex>
                  </Flex>
                );
              })}
            </VStack>
          ) : (
            <VStack gap="2" align="stretch">
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  bg={t.bgSubtle}
                  h="52px"
                  borderRadius="lg"
                  animation="shimmer 1.5s infinite"
                />
              ))}
            </VStack>
          )}
        </GlassCard>
      </Grid>

      {/* AI Explanation */}
      <GlassCard mb="6">
        <Flex align="center" gap="2" mb="3">
          <Icon color="#8B5CF6" boxSize="4">
            <LuBrain />
          </Icon>
          <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
            AI Impact Explanation
          </Text>
        </Flex>
        {revealedStage >= 4 ? (
          <Box>
            <Text fontSize="sm" color={t.textSecondary} lineHeight="1.8" mb="4">
              {currentPR?.explanation}
            </Text>
            <Flex gap="4" flexWrap="wrap">
              <Flex
                align="center"
                gap="2"
                bg="rgba(79, 70, 229, 0.08)"
                px="3"
                py="2"
                borderRadius="lg"
                border="1px solid rgba(79, 70, 229, 0.15)"
              >
                <Icon color="#8B5CF6" boxSize="3.5">
                  <LuScan />
                </Icon>
                <Text fontSize="xs" color={t.textSecondary}>
                  Model:{" "}
                  <Text as="span" color={t.textPrimary} fontWeight="600">
                    Impact-GPT v2.4
                  </Text>
                </Text>
              </Flex>
              <Flex
                align="center"
                gap="2"
                bg="rgba(79, 70, 229, 0.08)"
                px="3"
                py="2"
                borderRadius="lg"
                border="1px solid rgba(79, 70, 229, 0.15)"
              >
                <Icon color="#4F46E5" boxSize="3.5">
                  <LuCpu />
                </Icon>
                <Text fontSize="xs" color={t.textSecondary}>
                  Latency:{" "}
                  <Text as="span" color={t.textPrimary} fontWeight="600">
                    855ms
                  </Text>
                </Text>
              </Flex>
              <Flex
                align="center"
                gap="2"
                bg="rgba(34, 197, 94, 0.08)"
                px="3"
                py="2"
                borderRadius="lg"
                border="1px solid rgba(34, 197, 94, 0.15)"
              >
                <Icon color="#22C55E" boxSize="3.5">
                  <LuTrendingUp />
                </Icon>
                <Text fontSize="xs" color={t.textSecondary}>
                  Historical Accuracy:{" "}
                  <Text as="span" color={t.textPrimary} fontWeight="600">
                    94.1%
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </Box>
        ) : (
          <Flex align="center" gap="3" py="4">
            <Spinner size="sm" color="#8B5CF6" />
            <Text fontSize="sm" color={t.textFaint}>
              Generating AI explanation...
            </Text>
          </Flex>
        )}
      </GlassCard>

      {/* Dependency Graph Visualization */}
      <GlassCard mb="6">
        <Text fontSize="sm" fontWeight="700" color={t.textPrimary} mb="4">
          Dependency Graph
        </Text>
        {revealedStage >= 2 ? (
          <Box>
            <VStack gap="2" align="stretch">
              {relevantDeps.slice(0, 8).map((dep, i) => (
                <Flex
                  key={i}
                  align="center"
                  gap="3"
                  bg={t.bgSubtle}
                  px="4"
                  py="2.5"
                  borderRadius="lg"
                  border={`1px solid ${t.borderLight}`}
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <Flex
                    align="center"
                    gap="2"
                    bg="rgba(79, 70, 229, 0.1)"
                    px="3"
                    py="1"
                    borderRadius="md"
                    minW="130px"
                  >
                    <Text fontSize="xs" fontWeight="600" color="#A5B4FC">
                      {dep.from}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <Box
                      w="20px"
                      h="2px"
                      bg={
                        dep.strength === "strong"
                          ? "#ef4444"
                          : dep.strength === "medium"
                            ? "#f59e0b"
                            : "#22C55E"
                      }
                    />
                    <Icon
                      color={
                        dep.strength === "strong"
                          ? "#ef4444"
                          : dep.strength === "medium"
                            ? "#f59e0b"
                            : "#22C55E"
                      }
                      boxSize="3"
                    >
                      <LuArrowRight />
                    </Icon>
                    <Box
                      w="20px"
                      h="2px"
                      bg={
                        dep.strength === "strong"
                          ? "#ef4444"
                          : dep.strength === "medium"
                            ? "#f59e0b"
                            : "#22C55E"
                      }
                    />
                  </Flex>
                  <Flex
                    align="center"
                    gap="2"
                    bg="rgba(79, 70, 229, 0.1)"
                    px="3"
                    py="1"
                    borderRadius="md"
                    minW="130px"
                  >
                    <Text fontSize="xs" fontWeight="600" color="#818CF8">
                      {dep.to}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="10px"
                    color={
                      dep.strength === "strong"
                        ? "#ef4444"
                        : dep.strength === "medium"
                          ? "#f59e0b"
                          : "#22C55E"
                    }
                    fontWeight="600"
                    textTransform="uppercase"
                    ml="auto"
                  >
                    {dep.strength}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="8"
            gap="3"
          >
            <Spinner size="md" color="#8B5CF6" />
            <Text fontSize="sm" color={t.textFaint}>
              Mapping dependencies...
            </Text>
          </Flex>
        )}
      </GlassCard>

      {/* Changed Files Detail */}
      <GlassCard>
        <Text fontSize="sm" fontWeight="700" color={t.textPrimary} mb="4">
          Changed Files Analysis
        </Text>
        {revealedStage >= 1 ? (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap="2">
            {currentPR?.changedFiles.map((file, i) => (
              <Flex
                key={i}
                align="center"
                gap="3"
                bg={t.bgSubtle}
                px="3"
                py="2.5"
                borderRadius="lg"
                border={`1px solid ${t.borderLight}`}
                style={{
                  animation: `fadeInUp 0.3s ease-out ${i * 0.08}s both`,
                }}
              >
                <Icon color="#4F46E5" boxSize="4">
                  <LuFileCode />
                </Icon>
                <Box flex="1" overflow="hidden">
                  <Text
                    fontSize="xs"
                    color={t.textSecondary}
                    fontFamily="mono"
                    isTruncated
                  >
                    {file}
                  </Text>
                  <Text fontSize="10px" color={t.textFaint}>
                    Module: {currentPR.modules[i % currentPR.modules.length]}
                  </Text>
                </Box>
                <Icon color={t.textFaint} boxSize="3">
                  <LuChevronRight />
                </Icon>
              </Flex>
            ))}
          </Grid>
        ) : (
          <Grid templateColumns="repeat(2, 1fr)" gap="2">
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                bg={t.bgSubtle}
                h="46px"
                borderRadius="lg"
                animation="shimmer 1.5s infinite"
              />
            ))}
          </Grid>
        )}
      </GlassCard>
    </Box>
  );
}
