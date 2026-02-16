// ═══════════════════════════════════════════════════════════════
// DASHBOARD PAGE — High-level system overview with live metrics
// ═══════════════════════════════════════════════════════════════

import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
  VStack,
  HStack,
  Badge,
  Separator,
} from "@chakra-ui/react";
import {
  LuGitPullRequest,
  LuTestTubeDiagonal,
  LuClock,
  LuZap,
  LuShield,
  LuBrain,
  LuTrendingUp,
  LuActivity,
  LuServer,
  LuCircleCheck,
  LuTriangleAlert,
  LuCircleX,
} from "react-icons/lu";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useSimulation } from "../hooks/useSimulation";
import { useThemeColors } from "../hooks/useThemeColors";
import GlassCard from "../components/shared/GlassCard";
import StatCard from "../components/shared/StatCard";
import StatusBadge from "../components/shared/StatusBadge";

export default function DashboardPage() {
  const { dashboardStats, metricsHistory } = useSimulation();
  const t = useThemeColors();

  const riskData = [
    {
      name: "Low",
      value: dashboardStats.riskDistribution.low,
      color: "#22C55E",
    },
    {
      name: "Medium",
      value: dashboardStats.riskDistribution.medium,
      color: "#f59e0b",
    },
    {
      name: "High",
      value: dashboardStats.riskDistribution.high,
      color: "#ef4444",
    },
  ];

  const recentMetrics = metricsHistory.slice(-14);

  return (
    <Box className="page-enter">
      {/* Hero Stats Row */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap="4"
        mb="6"
      >
        <StatCard
          label="PRs Analyzed"
          value={dashboardStats.totalPRsAnalyzed}
          icon={<LuGitPullRequest />}
          iconColor="#8B5CF6"
          trend="up"
          trendValue="12.3%"
        />
        <StatCard
          label="Tests Saved"
          value={dashboardStats.totalTestsSaved}
          icon={<LuTestTubeDiagonal />}
          iconColor="#4F46E5"
          trend="up"
          trendValue="8.7%"
        />
        <StatCard
          label="Avg Time Saved"
          value={dashboardStats.avgTimeSaved}
          suffix=" min"
          icon={<LuClock />}
          iconColor="#22C55E"
          isInteger={false}
          trend="up"
          trendValue="3.2 min"
        />
        <StatCard
          label="Pipeline Health"
          value={dashboardStats.pipelineHealth}
          suffix="%"
          icon={<LuActivity />}
          iconColor="#f59e0b"
          isInteger={false}
          trend="up"
          trendValue="0.8%"
        />
      </Grid>

      {/* Second Stats Row */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap="4"
        mb="6"
      >
        <StatCard
          label="Model Accuracy"
          value={dashboardStats.modelAccuracy}
          suffix="%"
          icon={<LuBrain />}
          iconColor="#8B5CF6"
          isInteger={false}
        />
        <StatCard
          label="Tests Optimized"
          value={dashboardStats.testsOptimized}
          suffix="%"
          icon={<LuZap />}
          iconColor="#f59e0b"
          isInteger={false}
        />
        <StatCard
          label="Active PRs"
          value={dashboardStats.activePRs}
          icon={<LuGitPullRequest />}
          iconColor="#4F46E5"
        />
        <StatCard
          label="Avg Build Time"
          value={dashboardStats.avgBuildTime}
          icon={<LuClock />}
          iconColor="#F59E0B"
        />
      </Grid>

      {/* Charts Row */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4" mb="6">
        {/* Time Saved Trend */}
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Box>
              <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                Time Saved Per Day
              </Text>
              <Text fontSize="xs" color={t.textMuted}>
                Last 14 days
              </Text>
            </Box>
            <Flex align="center" gap="1">
              <Icon color="#22C55E" boxSize="3.5">
                <LuTrendingUp />
              </Icon>
              <Text fontSize="xs" color="#22C55E" fontWeight="600">
                +15.3%
              </Text>
            </Flex>
          </Flex>
          <Box h="220px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentMetrics}>
                <defs>
                  <linearGradient
                    id="timeSavedGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fill: t.textFaint, fontSize: 10 }}
                  axisLine={{ stroke: t.border }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: t.textFaint, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: t.bgCardSolid,
                    border: `1px solid ${t.border}`,
                    borderRadius: "8px",
                    color: t.textPrimary,
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="timeSaved"
                  stroke="#4F46E5"
                  fill="url(#timeSavedGrad)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#818CF8" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </GlassCard>

        {/* Risk Distribution */}
        <GlassCard>
          <Text fontSize="sm" fontWeight="700" color={t.textPrimary} mb="1">
            Risk Distribution
          </Text>
          <Text fontSize="xs" color={t.textMuted} mb="4">
            Across all analyzed PRs
          </Text>
          <Box h="180px" display="flex" justifyContent="center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {riskData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: t.bgCardSolid,
                    border: `1px solid ${t.border}`,
                    borderRadius: "8px",
                    color: t.textPrimary,
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <VStack gap="2" mt="2">
            {riskData.map((item) => (
              <Flex
                key={item.name}
                w="100%"
                justify="space-between"
                align="center"
              >
                <Flex align="center" gap="2">
                  <Box w="10px" h="10px" borderRadius="sm" bg={item.color} />
                  <Text fontSize="xs" color={t.textSecondary}>
                    {item.name} Risk
                  </Text>
                </Flex>
                <Text fontSize="xs" color={t.textPrimary} fontWeight="600">
                  {item.value}%
                </Text>
              </Flex>
            ))}
          </VStack>
        </GlassCard>
      </Grid>

      {/* Bottom Row */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4">
        {/* Recent Activity */}
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Recent Activity
            </Text>
            <Text
              fontSize="xs"
              color="#818CF8"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              View all
            </Text>
          </Flex>
          <VStack gap="0" align="stretch">
            {dashboardStats.recentActivity.map((item, i) => (
              <Flex
                key={i}
                align="center"
                justify="space-between"
                py="3"
                borderBottom={
                  i < dashboardStats.recentActivity.length - 1
                    ? `1px solid ${t.borderLight}`
                    : "none"
                }
              >
                <Flex align="center" gap="3">
                  <Flex
                    w="32px"
                    h="32px"
                    borderRadius="lg"
                    bg={
                      item.risk === "high"
                        ? "rgba(239,68,68,0.1)"
                        : item.risk === "medium"
                          ? "rgba(245,158,11,0.1)"
                          : "rgba(16,185,129,0.1)"
                    }
                    align="center"
                    justify="center"
                  >
                    <Icon
                      boxSize="3.5"
                      color={
                        item.risk === "high"
                          ? "#ef4444"
                          : item.risk === "medium"
                            ? "#f59e0b"
                            : "#22C55E"
                      }
                    >
                      {item.risk === "high" ? (
                        <LuTriangleAlert />
                      ) : item.risk === "medium" ? (
                        <LuActivity />
                      ) : (
                        <LuCircleCheck />
                      )}
                    </Icon>
                  </Flex>
                  <Box>
                    <Text fontSize="xs" fontWeight="600" color={t.textPrimary}>
                      {item.pr}
                    </Text>
                    <Text fontSize="10px" color={t.textMuted}>
                      {item.action}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap="2">
                  <StatusBadge status={item.risk} />
                  <Text fontSize="10px" color={t.textFaint}>
                    {item.time}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </VStack>
        </GlassCard>

        {/* Environment Status */}
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Environment Status
            </Text>
            <StatusBadge status="healthy" />
          </Flex>
          <VStack gap="3" align="stretch">
            {dashboardStats.environments.map((env, i) => (
              <Box
                key={i}
                bg={t.bgSubtle}
                borderRadius="lg"
                p="4"
                border={`1px solid ${t.borderLight}`}
              >
                <Flex justify="space-between" align="center" mb="2">
                  <Flex align="center" gap="2">
                    <Icon
                      color={env.status === "healthy" ? "#22C55E" : "#f59e0b"}
                      boxSize="4"
                    >
                      <LuServer />
                    </Icon>
                    <Text fontSize="sm" fontWeight="600" color={t.textPrimary}>
                      {env.name}
                    </Text>
                  </Flex>
                  <StatusBadge status={env.status} />
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="xs" color={t.textMuted}>
                    Uptime:{" "}
                    <Text as="span" color={t.textSecondary}>
                      {env.uptime}
                    </Text>
                  </Text>
                  <Text fontSize="xs" color={t.textMuted}>
                    Region:{" "}
                    <Text as="span" color={t.textSecondary}>
                      {env.region}
                    </Text>
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>

          {/* Mini pipeline chart */}
          <Box mt="4">
            <Text fontSize="xs" fontWeight="600" color={t.textMuted} mb="2">
              Pipeline Success Rate (14d)
            </Text>
            <Box h="80px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentMetrics}>
                  <Bar
                    dataKey="buildSuccessRate"
                    fill="#4F46E5"
                    radius={[2, 2, 0, 0]}
                    opacity={0.7}
                  />
                  <Tooltip
                    contentStyle={{
                      background: t.bgCardSolid,
                      border: `1px solid ${t.border}`,
                      borderRadius: "8px",
                      color: t.textPrimary,
                      fontSize: "12px",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </GlassCard>
      </Grid>
    </Box>
  );
}
