// ═══════════════════════════════════════════════════════════════
// DASHBOARD PAGE — Overview with charts, stats, and quick actions
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  Icon,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import {
  LuRocket,
  LuRefreshCw,
  LuActivity,
  LuGitPullRequest,
  LuShieldAlert,
  LuTestTubeDiagonal,
  LuClock,
  LuTrendingUp,
  LuArrowRight,
} from "react-icons/lu";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatsBar from "../components/StatsBar";
import SimulatePRModal from "../components/SimulatePRModal";
import GlassCard from "../components/shared/GlassCard";
import StatusBadge from "../components/shared/StatusBadge";
import { useThemeColors } from "../hooks/useThemeColors";
import { usePR } from "../context/usePRHook";


// ── Custom Recharts tooltip ─────────────────────────────────
function GlassTooltip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      bg={t.bgCard}
      backdropFilter="blur(12px)"
      border={`1px solid ${t.border}`}
      borderRadius="lg"
      px="3"
      py="2"
      boxShadow="0 8px 32px rgba(0,0,0,0.3)"
    >
      <Text fontSize="11px" color={t.textMuted} mb="1">
        {label}
      </Text>
      {payload.map((p, i) => (
        <Flex key={i} align="center" gap="2">
          <Box w="8px" h="8px" borderRadius="full" bg={p.color} />
          <Text
            fontSize="12px"
            color={t.textPrimary}
            fontFamily="mono"
            fontWeight="600"
          >
            {p.name}: {typeof p.value === "number" ? p.value : p.value}
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

export default function Dashboard() {
  const t = useThemeColors();
  const navigate = useNavigate();
  const { prs, refreshPRs, loading } = usePR();
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    refreshPRs();
  }, [refreshPRs]);

  async function handlePRCreated() {
    setTimeout(() => refreshPRs(), 500);
  }

  // ── Derived data for charts ────────────────────────────────
  const completed = prs.filter((p) => p.status === "completed");
  const failed = prs.filter((p) => p.status === "failed");
  const analyzing = prs.filter((p) => p.status === "analyzing");
  const received = prs.filter((p) => p.status === "received");

  // Status breakdown for pie chart
  const statusData = [
    { name: "Completed", value: completed.length, color: "#10b981" },
    { name: "Failed", value: failed.length, color: "#ef4444" },
    { name: "Analyzing", value: analyzing.length, color: "#f59e0b" },
    { name: "Received", value: received.length, color: "#64748b" },
  ].filter((d) => d.value > 0);

  // Risk distribution for bar chart
  const highRisk = completed.filter((p) => (p.riskScore || 0) >= 70).length;
  const medRisk = completed.filter(
    (p) => (p.riskScore || 0) >= 40 && (p.riskScore || 0) < 70,
  ).length;
  const lowRisk = completed.filter((p) => (p.riskScore || 0) < 40).length;
  const riskDistData = [
    { name: "Low", count: lowRisk, fill: "#10b981" },
    { name: "Medium", count: medRisk, fill: "#f59e0b" },
    { name: "High", count: highRisk, fill: "#ef4444" },
  ];

  // Risk score trend (chronological completed PRs)
  const trendData = completed
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-15)
    .map((pr, i) => ({
      name: `PR ${i + 1}`,
      risk: pr.riskScore || 0,
      confidence: pr.confidence || 0,
    }));

  // Recent 5 PRs for quick-access list
  const recentPRs = prs.slice(0, 5);

  return (
    <Box>
      {/* Page header */}
      <Flex
        justify="space-between"
        align="center"
        mb="6"
        flexWrap="wrap"
        gap="3"
      >
        <Box>
          <Text
            fontSize="22px"
            fontWeight="800"
            color={t.textPrimary}
            letterSpacing="-0.02em"
          >
            Impact Analyzer
          </Text>
          <Text fontSize="13px" color={t.textMuted} mt="0.5">
            AI-powered PR risk analysis and intelligent test selection
          </Text>
        </Box>
        <Flex gap="2">
          <Button
            size="sm"
            variant="ghost"
            color={t.textMuted}
            _hover={{ bg: t.bgHover, color: t.textPrimary }}
            borderRadius="lg"
            fontSize="12px"
            onClick={() => refreshPRs()}
            disabled={loading}
          >
            <Icon
              mr="1.5"
              boxSize="3.5"
              animation={loading ? "spin 1s linear infinite" : "none"}
            >
              <LuRefreshCw />
            </Icon>
            Refresh
          </Button>
          <Button
            size="sm"
            bg="linear-gradient(135deg, #3b82f6, #8b5cf6)"
            color="white"
            borderRadius="lg"
            fontSize="12px"
            fontWeight="600"
            px="4"
            _hover={{ opacity: 0.9 }}
            onClick={() => setModalOpen(true)}
          >
            <Icon mr="1.5" boxSize="3.5">
              <LuRocket />
            </Icon>
            Simulate PR
          </Button>
        </Flex>
      </Flex>


      {/* Stats */}
      <Box mt="4">
        <StatsBar prs={prs} />
      </Box>

      {/* Charts Row */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="4" mt="4">
        {/* Risk Score Trend — Area Chart */}
        <GlassCard>
          <Flex justify="space-between" align="center" mb="4">
            <Flex align="center" gap="2">
              <Icon color="#8b5cf6" boxSize="4">
                <LuTrendingUp />
              </Icon>
              <Text
                fontSize="11px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
              >
                Risk & Confidence Trend
              </Text>
            </Flex>
            <Badge
              bg="rgba(139,92,246,0.08)"
              color="#a78bfa"
              borderRadius="md"
              px="2"
              py="0.5"
              fontSize="10px"
              border="1px solid rgba(139,92,246,0.15)"
            >
              Last {trendData.length} PRs
            </Badge>
          </Flex>
          {trendData.length === 0 ? (
            <Flex align="center" justify="center" py="12">
              <Text color={t.textFaint} fontSize="sm">
                Analyze PRs to see trend data
              </Text>
            </Flex>
          ) : (
            <Box h="240px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={t.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: t.textFaint }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: t.textFaint }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<GlassTooltip t={t} />} />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    name="Risk"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#riskGrad)"
                    dot={{ r: 3, fill: "#ef4444", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="confidence"
                    name="Confidence"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#confGrad)"
                    dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}
          {/* Legend */}
          {trendData.length > 0 && (
            <Flex justify="center" gap="5" mt="2">
              <Flex align="center" gap="1.5">
                <Box w="10px" h="3px" borderRadius="full" bg="#ef4444" />
                <Text fontSize="10px" color={t.textMuted}>
                  Risk Score
                </Text>
              </Flex>
              <Flex align="center" gap="1.5">
                <Box w="10px" h="3px" borderRadius="full" bg="#3b82f6" />
                <Text fontSize="10px" color={t.textMuted}>
                  Confidence
                </Text>
              </Flex>
            </Flex>
          )}
        </GlassCard>

        {/* Status Breakdown — Pie Chart */}
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
              <LuGitPullRequest />
            </Icon>
            PR Status Breakdown
          </Text>
          {statusData.length === 0 ? (
            <Flex align="center" justify="center" py="12">
              <Text color={t.textFaint} fontSize="sm">
                No PRs yet
              </Text>
            </Flex>
          ) : (
            <>
              <Box h="180px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<GlassTooltip t={t} />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              {/* Legend */}
              <Flex justify="center" gap="4" flexWrap="wrap" mt="1">
                {statusData.map((d) => (
                  <Flex key={d.name} align="center" gap="1.5">
                    <Box w="8px" h="8px" borderRadius="full" bg={d.color} />
                    <Text fontSize="10px" color={t.textMuted}>
                      {d.name}
                    </Text>
                    <Text
                      fontSize="10px"
                      color={t.textPrimary}
                      fontWeight="700"
                      fontFamily="mono"
                    >
                      {d.value}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </>
          )}
        </GlassCard>
      </Grid>

      {/* Second row: Risk distribution + Recent PRs */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mt="4">
        {/* Risk Distribution — Bar Chart */}
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
              <LuShieldAlert />
            </Icon>
            Risk Distribution
          </Text>
          {completed.length === 0 ? (
            <Flex align="center" justify="center" py="12">
              <Text color={t.textFaint} fontSize="sm">
                No completed analyses
              </Text>
            </Flex>
          ) : (
            <Box h="200px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskDistData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={t.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: t.textMuted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: t.textFaint }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<GlassTooltip t={t} />} />
                  <Bar
                    dataKey="count"
                    name="PRs"
                    radius={[6, 6, 0, 0]}
                    barSize={48}
                  >
                    {riskDistData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </GlassCard>

        {/* Recent PRs Quick List */}
        <GlassCard noPadding>
          <Box px="5" py="4" borderBottom={`1px solid ${t.border}`}>
            <Flex justify="space-between" align="center">
              <Text
                fontSize="11px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
              >
                <Icon boxSize="3" mr="1.5" verticalAlign="middle">
                  <LuActivity />
                </Icon>
                Recent Pull Requests
              </Text>
              <Box
                as="button"
                fontSize="11px"
                color={t.accent}
                fontWeight="600"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => navigate("/pull-requests")}
              >
                View All
                <Icon boxSize="3" ml="1" verticalAlign="middle">
                  <LuArrowRight />
                </Icon>
              </Box>
            </Flex>
          </Box>
          {recentPRs.length === 0 ? (
            <Flex align="center" justify="center" py="12">
              <Text color={t.textFaint} fontSize="sm">
                No PRs yet — simulate one above
              </Text>
            </Flex>
          ) : (
            <Flex direction="column">
              {recentPRs.map((pr, i) => {
                const rc =
                  (pr.riskScore || 0) >= 70
                    ? "#ef4444"
                    : (pr.riskScore || 0) >= 40
                      ? "#f59e0b"
                      : "#10b981";
                return (
                  <Flex
                    key={pr.prId}
                    px="5"
                    py="3"
                    align="center"
                    justify="space-between"
                    gap="3"
                    cursor="pointer"
                    borderBottom={
                      i < recentPRs.length - 1
                        ? `1px solid ${t.border}`
                        : "none"
                    }
                    _hover={{ bg: t.bgHover }}
                    transition="background 0.15s"
                    onClick={() => navigate(`/pr/${pr.prId}`)}
                  >
                    <Flex align="center" gap="3" minW="0" flex="1">
                      <Flex
                        w="32px"
                        h="32px"
                        borderRadius="lg"
                        bg={
                          pr.status === "completed"
                            ? `${rc}10`
                            : pr.status === "failed"
                              ? "rgba(239,68,68,0.08)"
                              : "rgba(59,130,246,0.08)"
                        }
                        align="center"
                        justify="center"
                        flexShrink="0"
                      >
                        <Icon
                          color={
                            pr.status === "completed"
                              ? rc
                              : pr.status === "failed"
                                ? "#ef4444"
                                : "#3b82f6"
                          }
                          boxSize="4"
                        >
                          <LuGitPullRequest />
                        </Icon>
                      </Flex>
                      <Box minW="0">
                        <Text
                          fontSize="12px"
                          fontWeight="600"
                          color={t.textPrimary}
                          fontFamily="mono"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {pr.prId.length > 22
                            ? `...${pr.prId.slice(-18)}`
                            : pr.prId}
                        </Text>
                        <Text fontSize="11px" color={t.textFaint}>
                          {pr.author} · {pr.branch}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex align="center" gap="3" flexShrink="0">
                      {pr.status === "completed" && (
                        <Text
                          fontSize="12px"
                          fontWeight="700"
                          fontFamily="mono"
                          color={rc}
                        >
                          {pr.riskScore}%
                        </Text>
                      )}
                      <StatusBadge status={pr.status} />
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </GlassCard>
      </Grid>

      {/* Simulate PR Modal */}
      <SimulatePRModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handlePRCreated}
      />
    </Box>
  );
}
