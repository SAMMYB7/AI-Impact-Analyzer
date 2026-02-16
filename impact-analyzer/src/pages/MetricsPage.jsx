// ═══════════════════════════════════════════════════════════════
// METRICS PAGE — Analytics dashboard with charts
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Grid, Icon, Separator } from "@chakra-ui/react";
import {
  LuChartColumnIncreasing,
  LuTrendingUp,
  LuTrendingDown,
  LuClock,
  LuTestTubeDiagonal,
  LuShield,
  LuActivity,
  LuRefreshCw,
} from "react-icons/lu";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  Legend,
} from "recharts";
import { useSimulation } from "../hooks/useSimulation";
import { useThemeColors } from "../hooks/useThemeColors";
import GlassCard from "../components/shared/GlassCard";

export default function MetricsPage() {
  const { metricsHistory, updateMetrics } = useSimulation();
  const t = useThemeColors();

  const chartTooltipStyle = {
    contentStyle: {
      background: t.bgCardSolid,
      border: `1px solid ${t.border}`,
      borderRadius: "8px",
      color: t.textPrimary,
      fontSize: "12px",
    },
  };
  const data = metricsHistory.slice(-14);
  const fullData = metricsHistory;

  return (
    <Box className="page-enter">
      {/* Action */}
      <Flex justify="flex-end" mb="4">
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
          onClick={updateMetrics}
        >
          <Icon color={t.textMuted} boxSize="3.5">
            <LuRefreshCw />
          </Icon>
          <Text fontSize="xs" color={t.textSecondary} fontWeight="500">
            Refresh Data
          </Text>
        </Flex>
      </Flex>

      {/* Time Saved Per PR */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mb="6">
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Box>
              <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                Time Saved Per Day
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Minutes saved through test optimization
              </Text>
            </Box>
            <Flex align="center" gap="1">
              <Icon color="#22C55E" boxSize="3.5">
                <LuTrendingUp />
              </Icon>
              <Text fontSize="xs" color="#22C55E" fontWeight="600">
                +23.5%
              </Text>
            </Flex>
          </Flex>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={t.bgSubtle} vertical={false} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={{ stroke: t.border }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip {...chartTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="timeSaved"
                  stroke="#4F46E5"
                  fill="url(#areaGrad1)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#818CF8" }}
                  name="Time Saved (min)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </GlassCard>

        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Box>
              <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                Tests Reduced
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Tests skipped vs total executed
              </Text>
            </Box>
            <Flex align="center" gap="1">
              <Icon color="#8B5CF6" boxSize="3.5">
                <LuTestTubeDiagonal />
              </Icon>
              <Text fontSize="xs" color="#8B5CF6" fontWeight="600">
                68.4% avg
              </Text>
            </Flex>
          </Flex>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid stroke={t.bgSubtle} vertical={false} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={{ stroke: t.border }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip {...chartTooltipStyle} />
                <Bar
                  dataKey="testsReduced"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                  name="Tests Skipped"
                />
                <Bar
                  dataKey="testsRun"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                  opacity={0.6}
                  name="Tests Run"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </GlassCard>
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mb="6">
        {/* Risk Trend */}
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Box>
              <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                Risk Score Trend
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Average risk score over time
              </Text>
            </Box>
            <Flex align="center" gap="1">
              <Icon color="#f59e0b" boxSize="3.5">
                <LuShield />
              </Icon>
              <Text fontSize="xs" color="#f59e0b" fontWeight="600">
                Moderate
              </Text>
            </Flex>
          </Flex>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fullData}>
                <CartesianGrid stroke={t.bgSubtle} vertical={false} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={{ stroke: t.border }}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                  domain={[0, 100]}
                />
                <Tooltip {...chartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="avgRiskScore"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  name="Risk Score"
                />
                <Line
                  type="monotone"
                  dataKey="avgConfidence"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  name="Confidence"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </GlassCard>

        {/* Pipeline Duration */}
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Box>
              <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                Pipeline Duration
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Build time & success rate
              </Text>
            </Box>
            <Flex align="center" gap="1">
              <Icon color="#22C55E" boxSize="3.5">
                <LuActivity />
              </Icon>
              <Text fontSize="xs" color="#22C55E" fontWeight="600">
                Optimal
              </Text>
            </Flex>
          </Flex>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid stroke={t.bgSubtle} vertical={false} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={{ stroke: t.border }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: t.textMuted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                  domain={[80, 100]}
                />
                <Tooltip {...chartTooltipStyle} />
                <Bar
                  yAxisId="left"
                  dataKey="pipelineDuration"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  opacity={0.6}
                  name="Duration (min)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="buildSuccessRate"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={false}
                  name="Success Rate (%)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GlassCard>
      </Grid>

      {/* PRs Analyzed Over Time */}
      <GlassCard>
        <Flex justify="space-between" align="center" mb="4">
          <Box>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              PRs Analyzed — 30 Day Overview
            </Text>
            <Text fontSize="xs" color={t.textMuted}>
              Daily PR analysis volume
            </Text>
          </Box>
        </Flex>
        <Box h="200px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fullData}>
              <defs>
                <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={t.bgSubtle} vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: t.textMuted, fontSize: 10 }}
                axisLine={{ stroke: t.border }}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: t.textMuted, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip {...chartTooltipStyle} />
              <Area
                type="monotone"
                dataKey="prsAnalyzed"
                stroke="#8B5CF6"
                fill="url(#prGrad)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#A5B4FC" }}
                name="PRs Analyzed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </GlassCard>
    </Box>
  );
}
