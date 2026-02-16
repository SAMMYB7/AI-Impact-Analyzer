// ═══════════════════════════════════════════════════════════════
// TEST SELECTION PAGE — Shows test optimization and selection
// ═══════════════════════════════════════════════════════════════

import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
  VStack,
  Badge,
  Separator,
} from "@chakra-ui/react";
import {
  LuTestTubeDiagonal,
  LuCircleCheck,
  LuCircleX,
  LuSkipForward,
  LuClock,
  LuShield,
  LuChartColumnIncreasing,
  LuTarget,
  LuZap,
  LuTrendingDown,
} from "react-icons/lu";
import { useSimulation } from "../hooks/useSimulation";
import { useThemeColors } from "../hooks/useThemeColors";
import { useAnimatedCounter } from "../hooks/useAnimatedCounter";
import GlassCard from "../components/shared/GlassCard";
import StatCard from "../components/shared/StatCard";

export default function TestSelectionPage() {
  const { phase, currentPR } = useSimulation();
  const t = useThemeColors();
  const isReady =
    phase === "selecting_tests" ||
    phase === "running_tests" ||
    phase === "completed";

  const totalTests = currentPR?.totalRepoTests || 247;
  const selectedCount = isReady ? currentPR?.selectedTests?.length || 0 : 0;
  const skippedCount = isReady ? totalTests - selectedCount : 0;
  const timeSaved = isReady ? (skippedCount * 0.35).toFixed(1) : 0;
  const coveragePercent = isReady
    ? (78 + ((selectedCount * 7 + 3) % 17)).toFixed(1)
    : 0;
  const reductionPercent = isReady
    ? ((skippedCount / totalTests) * 100).toFixed(1)
    : 0;

  const animatedSelected = useAnimatedCounter(selectedCount, 1500);
  const animatedSkipped = useAnimatedCounter(skippedCount, 1500);
  const animatedTimeSaved = useAnimatedCounter(parseFloat(timeSaved), 1500);
  const animatedCoverage = useAnimatedCounter(
    parseFloat(coveragePercent),
    1500,
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
          <Icon color="#4F46E5" boxSize="8">
            <LuTestTubeDiagonal />
          </Icon>
        </Flex>
        <Text color={t.textSecondary} fontSize="lg" fontWeight="600">
          No Test Selection Active
        </Text>
        <Text color={t.textFaint} fontSize="sm" textAlign="center" maxW="400px">
          Start a PR simulation to see the AI-optimized test selection engine in
          action.
        </Text>
      </Flex>
    );
  }

  return (
    <Box className="page-enter">
      {/* Stats Row */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
        gap="4"
        mb="6"
      >
        <StatCard
          label="Total Repo Tests"
          value={totalTests}
          icon={<LuTestTubeDiagonal />}
          iconColor="#8B5CF6"
        />
        <StatCard
          label="Selected Tests"
          value={animatedSelected}
          icon={<LuTarget />}
          iconColor="#4F46E5"
        />
        <StatCard
          label="Skipped Tests"
          value={animatedSkipped}
          icon={<LuSkipForward />}
          iconColor="#f59e0b"
        />
        <StatCard
          label="Time Saved"
          value={animatedTimeSaved}
          suffix=" min"
          icon={<LuClock />}
          iconColor="#22C55E"
          isInteger={false}
        />
        <StatCard
          label="Test Reduction"
          value={parseFloat(reductionPercent)}
          suffix="%"
          icon={<LuTrendingDown />}
          iconColor="#ef4444"
          isInteger={false}
        />
      </Grid>

      {/* Coverage & Optimization */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mb="6">
        <GlassCard>
          <Text fontSize="sm" fontWeight="700" color={t.textPrimary} mb="4">
            Coverage Analysis
          </Text>
          <Flex direction="column" align="center" gap="4">
            {/* Coverage Ring — SVG Ring */}
            <Box position="relative" w="160px" h="160px">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={t.border}
                  strokeWidth="10"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(animatedCoverage / 100) * 2 * Math.PI * 70} ${2 * Math.PI * 70}`}
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
                  fontSize="2xl"
                  fontWeight="600"
                  color="#818CF8"
                  letterSpacing="-0.02em"
                >
                  {animatedCoverage.toFixed(1)}%
                </Text>
                <Text fontSize="10px" color={t.textMuted}>
                  Coverage
                </Text>
              </Flex>
            </Box>

            <Grid templateColumns="repeat(3, 1fr)" gap="3" w="100%">
              <Box bg={t.bgSubtle} p="3" borderRadius="lg" textAlign="center">
                <Text fontSize="md" fontWeight="600" color="#22C55E">
                  92.1%
                </Text>
                <Text fontSize="10px" color={t.textMuted}>
                  Statements
                </Text>
              </Box>
              <Box bg={t.bgSubtle} p="3" borderRadius="lg" textAlign="center">
                <Text fontSize="md" fontWeight="600" color="#f59e0b">
                  85.4%
                </Text>
                <Text fontSize="10px" color={t.textMuted}>
                  Branches
                </Text>
              </Box>
              <Box bg={t.bgSubtle} p="3" borderRadius="lg" textAlign="center">
                <Text fontSize="md" fontWeight="600" color="#8B5CF6">
                  89.7%
                </Text>
                <Text fontSize="10px" color={t.textMuted}>
                  Functions
                </Text>
              </Box>
            </Grid>
          </Flex>
        </GlassCard>

        <GlassCard>
          <Text fontSize="sm" fontWeight="700" color={t.textPrimary} mb="4">
            Optimization Breakdown
          </Text>
          <VStack gap="3" align="stretch">
            {/* Visual bars per module */}
            {currentPR?.modules.map((mod, i) => {
              const modTests = currentPR.allTests.filter(
                (test) => test.module === mod,
              ).length;
              const modSelected = currentPR.selectedTests.filter(
                (test) => test.module === mod,
              ).length;
              const percent = modTests > 0 ? (modSelected / modTests) * 100 : 0;
              return (
                <Box key={i}>
                  <Flex justify="space-between" mb="1">
                    <Text
                      fontSize="xs"
                      color={t.textSecondary}
                      fontWeight="500"
                    >
                      {mod}
                    </Text>
                    <Text fontSize="xs" color={t.textMuted}>
                      {modSelected}/{modTests} tests
                    </Text>
                  </Flex>
                  <Flex
                    h="8px"
                    bg={t.bgInput}
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      w={isReady ? `${percent}%` : "0%"}
                      h="100%"
                      bg={`linear-gradient(90deg, #4F46E5, ${percent > 70 ? "#8B5CF6" : "#22C55E"})`}
                      borderRadius="full"
                      transition="width 1.5s ease-out"
                      transitionDelay={`${i * 0.2}s`}
                    />
                  </Flex>
                </Box>
              );
            })}

            <Box mt="2" pt="3" borderTop={`1px solid ${t.borderLight}`}>
              <Flex align="center" gap="2" mb="2">
                <Icon color="#22C55E" boxSize="4">
                  <LuZap />
                </Icon>
                <Text fontSize="sm" fontWeight="600" color={t.textPrimary}>
                  Optimization Summary
                </Text>
              </Flex>
              <Text fontSize="xs" color={t.textMuted} lineHeight="1.6">
                AI model identified {selectedCount} critical tests out of{" "}
                {totalTests} total. Skipping {skippedCount} non-impacted tests
                saves approximately {timeSaved} minutes per run while
                maintaining {coveragePercent}% effective coverage for the
                changed modules.
              </Text>
            </Box>
          </VStack>
        </GlassCard>
      </Grid>

      {/* Selected Tests List */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4">
        <GlassCard>
          <Flex align="center" gap="2" mb="3">
            <Icon color="#22C55E" boxSize="4">
              <LuCircleCheck />
            </Icon>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Selected Tests ({selectedCount})
            </Text>
          </Flex>
          <VStack
            gap="1.5"
            align="stretch"
            maxH="350px"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bg: t.scrollThumb,
                borderRadius: "2px",
              },
            }}
          >
            {isReady &&
              currentPR?.selectedTests.map((test, i) => (
                <Flex
                  key={i}
                  align="center"
                  gap="2"
                  bg="rgba(34, 197, 94, 0.05)"
                  px="3"
                  py="2"
                  borderRadius="md"
                  border="1px solid rgba(34, 197, 94, 0.1)"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both`,
                  }}
                >
                  <Icon color="#22C55E" boxSize="3">
                    <LuCircleCheck />
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
              ))}
          </VStack>
        </GlassCard>

        <GlassCard>
          <Flex align="center" gap="2" mb="3">
            <Icon color="#f59e0b" boxSize="4">
              <LuSkipForward />
            </Icon>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Skipped Tests ({skippedCount})
            </Text>
          </Flex>
          <VStack
            gap="1.5"
            align="stretch"
            maxH="350px"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bg: t.scrollThumb,
                borderRadius: "2px",
              },
            }}
          >
            {isReady &&
              currentPR?.skippedTests.map((test, i) => (
                <Flex
                  key={i}
                  align="center"
                  gap="2"
                  bg="rgba(245, 158, 11, 0.04)"
                  px="3"
                  py="2"
                  borderRadius="md"
                  border="1px solid rgba(245, 158, 11, 0.08)"
                  opacity="0.7"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both`,
                  }}
                >
                  <Icon color="#f59e0b" boxSize="3">
                    <LuSkipForward />
                  </Icon>
                  <Box flex="1">
                    <Text fontSize="xs" fontFamily="mono" color={t.textMuted}>
                      {test.name}
                    </Text>
                    <Text fontSize="10px" color={t.textFaint}>
                      {test.module}
                    </Text>
                  </Box>
                </Flex>
              ))}
          </VStack>
        </GlassCard>
      </Grid>
    </Box>
  );
}
