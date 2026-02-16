// ═══════════════════════════════════════════════════════════════
// PULL REQUESTS PAGE — Card-based PR listing
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
  Input,
} from "@chakra-ui/react";
import {
  LuGitPullRequest,
  LuUser,
  LuGitBranch,
  LuFileCode,
  LuShieldAlert,
  LuClock,
  LuChevronRight,
  LuSearch,
  LuTarget,
  LuPackage,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatusBadge from "../components/shared/StatusBadge";
import { useThemeColors } from "../hooks/useThemeColors";
import { usePR } from "../context/usePRHook";

function riskColor(score) {
  if (score >= 70) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  return "#10b981";
}

function riskLabel(score) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export default function PullRequestsPage() {
  const t = useThemeColors();
  const navigate = useNavigate();
  const { prs, refreshPRs, loading } = usePR();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    refreshPRs();
  }, [refreshPRs]);

  // Filter
  const filtered = prs
    .filter((pr) => statusFilter === "all" || pr.status === statusFilter)
    .filter(
      (pr) =>
        search === "" ||
        pr.prId.toLowerCase().includes(search.toLowerCase()) ||
        pr.author.toLowerCase().includes(search.toLowerCase()) ||
        pr.branch.toLowerCase().includes(search.toLowerCase()) ||
        pr.repo.toLowerCase().includes(search.toLowerCase()),
    );

  const statuses = ["all", "received", "analyzing", "completed", "failed"];

  if (loading && prs.length === 0) {
    return (
      <Flex align="center" justify="center" h="60vh" gap="3">
        <Spinner size="md" color="#3b82f6" />
        <Text color={t.textMuted}>Loading pull requests...</Text>
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
              <LuGitPullRequest />
            </Icon>
          </Flex>
          <Box>
            <Text
              fontSize="20px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              Pull Requests
            </Text>
            <Text fontSize="13px" color={t.textMuted}>
              {prs.length} total &bull;{" "}
              {prs.filter((p) => p.status === "completed").length} analyzed
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Search + Filters */}
      <GlassCard>
        <Flex gap="3" flexWrap="wrap" align="center">
          <Flex
            align="center"
            flex="1"
            minW="200px"
            bg={t.bgInput}
            borderRadius="lg"
            border={`1px solid ${t.border}`}
            px="3"
            gap="2"
          >
            <Icon color={t.textFaint} boxSize="4">
              <LuSearch />
            </Icon>
            <Input
              placeholder="Search by PR ID, author, branch, or repo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="unstyled"
              fontSize="13px"
              color={t.textPrimary}
              py="2.5"
              _placeholder={{ color: t.textFaint }}
            />
          </Flex>
          <Flex gap="1.5" align="center">
            {statuses.map((s) => {
              const isActive = statusFilter === s;
              const colors = {
                all: t.accent,
                received: "#64748b",
                analyzing: "#3b82f6",
                completed: "#10b981",
                failed: "#ef4444",
              };
              const c = colors[s] || t.accent;
              return (
                <Box
                  key={s}
                  as="button"
                  px="3"
                  py="1.5"
                  borderRadius="md"
                  fontSize="11px"
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="0.04em"
                  bg={isActive ? `${c}18` : "transparent"}
                  color={isActive ? c : t.textMuted}
                  border={`1px solid ${isActive ? `${c}30` : "transparent"}`}
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{ bg: `${c}10` }}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </Box>
              );
            })}
          </Flex>
        </Flex>
      </GlassCard>

      {/* PR Cards Grid */}
      <Box mt="4">
        {filtered.length === 0 ? (
          <GlassCard>
            <Flex
              direction="column"
              align="center"
              justify="center"
              py="16"
              gap="3"
            >
              <Icon color={t.textMuted} boxSize="10">
                <LuGitPullRequest />
              </Icon>
              <Text color={t.textMuted} fontSize="md" fontWeight="500">
                {search || statusFilter !== "all"
                  ? "No PRs match your filters"
                  : "No pull requests yet"}
              </Text>
              <Text color={t.textFaint} fontSize="sm">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Simulate a PR from the Dashboard to get started"}
              </Text>
            </Flex>
          </GlassCard>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1fr",
              xl: "1fr 1fr 1fr",
            }}
            gap="4"
          >
            {filtered.map((pr) => {
              const isCompleted = pr.status === "completed";
              const rc = riskColor(pr.riskScore || 0);

              return (
                <Box
                  key={pr.prId}
                  cursor="pointer"
                  onClick={() => navigate(`/pr/${pr.prId}`)}
                  transition="all 0.2s ease"
                  _hover={{
                    transform: "translateY(-2px)",
                  }}
                >
                  <GlassCard hover>
                    {/* Top: Status + Risk */}
                    <Flex justify="space-between" align="center" mb="3">
                      <StatusBadge status={pr.status} />
                      {isCompleted && (
                        <Flex align="center" gap="1.5">
                          <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg={rc}
                            boxShadow={`0 0 6px ${rc}50`}
                          />
                          <Text
                            fontSize="13px"
                            fontWeight="800"
                            fontFamily="mono"
                            color={rc}
                          >
                            {pr.riskScore}%
                          </Text>
                          <Text
                            fontSize="10px"
                            color={t.textFaint}
                            fontWeight="500"
                          >
                            {riskLabel(pr.riskScore || 0)}
                          </Text>
                        </Flex>
                      )}
                    </Flex>

                    {/* PR ID */}
                    <Flex align="center" gap="2" mb="3">
                      <Icon color="#3b82f6" boxSize="4">
                        <LuGitPullRequest />
                      </Icon>
                      <Text
                        fontSize="14px"
                        fontWeight="700"
                        color={t.textPrimary}
                        fontFamily="mono"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {pr.prId}
                      </Text>
                    </Flex>

                    {/* Details grid */}
                    <Flex direction="column" gap="2" mb="3">
                      {/* Author */}
                      <Flex align="center" gap="2">
                        <Flex
                          w="24px"
                          h="24px"
                          borderRadius="md"
                          bg="rgba(139,92,246,0.08)"
                          align="center"
                          justify="center"
                          flexShrink="0"
                        >
                          <Icon color="#a78bfa" boxSize="3">
                            <LuUser />
                          </Icon>
                        </Flex>
                        <Text fontSize="12px" color={t.textMuted} minW="48px">
                          Author
                        </Text>
                        <Text
                          fontSize="12px"
                          fontWeight="600"
                          color={t.textSecondary}
                        >
                          {pr.author}
                        </Text>
                      </Flex>

                      {/* Branch */}
                      <Flex align="center" gap="2">
                        <Flex
                          w="24px"
                          h="24px"
                          borderRadius="md"
                          bg="rgba(20,184,166,0.08)"
                          align="center"
                          justify="center"
                          flexShrink="0"
                        >
                          <Icon color="#14b8a6" boxSize="3">
                            <LuGitBranch />
                          </Icon>
                        </Flex>
                        <Text fontSize="12px" color={t.textMuted} minW="48px">
                          Branch
                        </Text>
                        <Text
                          fontSize="12px"
                          fontWeight="600"
                          color={t.textSecondary}
                          fontFamily="mono"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {pr.branch}
                        </Text>
                      </Flex>

                      {/* Repo */}
                      <Flex align="center" gap="2">
                        <Flex
                          w="24px"
                          h="24px"
                          borderRadius="md"
                          bg="rgba(59,130,246,0.08)"
                          align="center"
                          justify="center"
                          flexShrink="0"
                        >
                          <Icon color="#3b82f6" boxSize="3">
                            <LuPackage />
                          </Icon>
                        </Flex>
                        <Text fontSize="12px" color={t.textMuted} minW="48px">
                          Repo
                        </Text>
                        <Text
                          fontSize="12px"
                          fontWeight="600"
                          color={t.textSecondary}
                          fontFamily="mono"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {pr.repo}
                        </Text>
                      </Flex>
                    </Flex>

                    {/* Changed Files */}
                    {pr.filesChanged && pr.filesChanged.length > 0 && (
                      <Box mb="3">
                        <Flex align="center" gap="1.5" mb="1.5">
                          <Icon color={t.textFaint} boxSize="3">
                            <LuFileCode />
                          </Icon>
                          <Text
                            fontSize="10px"
                            fontWeight="600"
                            textTransform="uppercase"
                            letterSpacing="0.06em"
                            color={t.textFaint}
                          >
                            {pr.filesChanged.length} Changed File
                            {pr.filesChanged.length > 1 ? "s" : ""}
                          </Text>
                        </Flex>
                        <Flex gap="1" flexWrap="wrap">
                          {pr.filesChanged.slice(0, 4).map((f) => (
                            <Badge
                              key={f}
                              bg="rgba(59,130,246,0.06)"
                              color={t.textMuted}
                              borderRadius="md"
                              px="2"
                              py="0.5"
                              fontSize="10px"
                              fontFamily="mono"
                              border={`1px solid ${t.border}`}
                            >
                              {f.length > 28 ? `...${f.slice(-24)}` : f}
                            </Badge>
                          ))}
                          {pr.filesChanged.length > 4 && (
                            <Badge
                              bg="rgba(139,92,246,0.06)"
                              color="#a78bfa"
                              borderRadius="md"
                              px="2"
                              py="0.5"
                              fontSize="10px"
                              border="1px solid rgba(139,92,246,0.15)"
                            >
                              +{pr.filesChanged.length - 4} more
                            </Badge>
                          )}
                        </Flex>
                      </Box>
                    )}

                    {/* Bottom bar: Completed metrics or timestamp */}
                    <Flex
                      justify="space-between"
                      align="center"
                      pt="3"
                      borderTop={`1px solid ${t.border}`}
                    >
                      {isCompleted ? (
                        <Flex gap="4">
                          <Flex align="center" gap="1">
                            <Icon color="#8b5cf6" boxSize="3">
                              <LuTarget />
                            </Icon>
                            <Text
                              fontSize="11px"
                              color={t.textMuted}
                              fontFamily="mono"
                            >
                              {pr.confidence || 0}%
                            </Text>
                          </Flex>
                          <Flex align="center" gap="1">
                            <Icon color="#14b8a6" boxSize="3">
                              <LuClock />
                            </Icon>
                            <Text
                              fontSize="11px"
                              color={t.textMuted}
                              fontFamily="mono"
                            >
                              {pr.estimatedTimeSaved || 0}s saved
                            </Text>
                          </Flex>
                          <Flex align="center" gap="1">
                            <Icon color="#3b82f6" boxSize="3">
                              <LuShieldAlert />
                            </Icon>
                            <Text
                              fontSize="11px"
                              color={t.textMuted}
                              fontFamily="mono"
                            >
                              {pr.selectedTests?.length || 0} tests
                            </Text>
                          </Flex>
                        </Flex>
                      ) : (
                        <Text fontSize="11px" color={t.textFaint}>
                          {pr.createdAt
                            ? new Date(pr.createdAt).toLocaleString()
                            : "—"}
                        </Text>
                      )}
                      <Icon color={t.textFaint} boxSize="4">
                        <LuChevronRight />
                      </Icon>
                    </Flex>
                  </GlassCard>
                </Box>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
