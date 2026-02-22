// ═══════════════════════════════════════════════════════════════
// PULL REQUESTS PAGE — Card-based PR listing with edit & delete
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
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
  LuTimer,
  LuPencil,
  LuTrash2,
  LuEllipsisVertical,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatusBadge from "../components/shared/StatusBadge";
import EditPRModal from "../components/EditPRModal";
import DeletePRModal from "../components/DeletePRModal";
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
  const [now, setNow] = useState(() => Date.now());
  const tickRef = useRef(null);

  // Action menu state
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // Modal states
  const [editModalPR, setEditModalPR] = useState(null);
  const [deleteModalPR, setDeleteModalPR] = useState(null);

  useEffect(() => {
    refreshPRs();
  }, [refreshPRs]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // Tick every second to update countdowns for "received" PRs
  const hasReceivedPRs = prs.some(
    (p) => p.status === "received" && p.autoAnalysisAt,
  );
  useEffect(() => {
    if (hasReceivedPRs) {
      tickRef.current = setInterval(() => {
        setNow(Date.now());
        // Auto-refresh to catch status changes
        refreshPRs();
      }, 2000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [hasReceivedPRs, refreshPRs]);

  // Helper: compute seconds remaining for a PR's auto-analysis
  function getCountdown(pr) {
    if (pr.status !== "received" || !pr.autoAnalysisAt) return null;
    const remaining = Math.max(
      0,
      Math.ceil((new Date(pr.autoAnalysisAt).getTime() - now) / 1000),
    );
    return remaining;
  }

  // Handlers
  function handleEditClick(e, pr) {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditModalPR(pr);
  }

  function handleDeleteClick(e, pr) {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteModalPR(pr);
  }

  function handleMenuToggle(e, prId) {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === prId ? null : prId));
  }

  function handlePRUpdated() {
    refreshPRs();
    setEditModalPR(null);
  }

  function handlePRDeleted() {
    refreshPRs();
    setDeleteModalPR(null);
  }

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
        <Flex
          direction={{ base: "column", md: "row" }}
          gap="3"
          align={{ base: "stretch", md: "center" }}
        >
          {/* Search Input */}
          <Flex
            align="center"
            flex="1"
            minW="0"
            bg={t.bgInput}
            borderRadius="xl"
            border={`1px solid ${t.border}`}
            px="3"
            gap="2"
            transition="all 0.2s"
            _focusWithin={{
              borderColor: "#3b82f6",
              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
            }}
          >
            <Icon color={t.textFaint} boxSize="4" flexShrink="0">
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

          {/* Filter Pills */}
          <Flex gap="1.5" align="center" flexShrink="0" flexWrap="wrap">
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
                  borderRadius="lg"
                  fontSize="11px"
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="0.04em"
                  bg={isActive ? `${c}18` : "transparent"}
                  color={isActive ? c : t.textMuted}
                  border={`1px solid ${isActive ? `${c}30` : "transparent"}`}
                  cursor="pointer"
                  transition="all 0.15s"
                  whiteSpace="nowrap"
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
              const cd = getCountdown(pr);
              const isMenuOpen = openMenuId === pr.prId;
              const isAnalyzing = pr.status === "analyzing";

              return (
                <Box
                  key={pr.prId}
                  cursor="pointer"
                  onClick={() => navigate(`/pr/${pr.prId}`)}
                  transition="all 0.2s ease"
                  _hover={{
                    transform: "translateY(-2px)",
                  }}
                  position="relative"
                >
                  <GlassCard hover>
                    {/* Top: Status + Risk + Actions */}
                    <Flex justify="space-between" align="center" mb="3">
                      <StatusBadge status={pr.status} />
                      <Flex align="center" gap="2">
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

                        {/* Action Menu Button */}
                        <Box position="relative" ref={isMenuOpen ? menuRef : null}>
                          <Flex
                            as="button"
                            w="28px"
                            h="28px"
                            borderRadius="lg"
                            align="center"
                            justify="center"
                            bg={isMenuOpen ? t.bgHover : "transparent"}
                            border={`1px solid ${isMenuOpen ? t.border : "transparent"}`}
                            cursor="pointer"
                            transition="all 0.15s"
                            _hover={{ bg: t.bgHover, border: `1px solid ${t.border}` }}
                            onClick={(e) => handleMenuToggle(e, pr.prId)}
                          >
                            <Icon color={t.textMuted} boxSize="3.5">
                              <LuEllipsisVertical />
                            </Icon>
                          </Flex>

                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <Box
                              position="absolute"
                              top="32px"
                              right="0"
                              bg={t.bgCard}
                              backdropFilter={t.backdropBlur}
                              border={`1px solid ${t.borderAccent}`}
                              borderRadius="lg"
                              boxShadow="0 12px 40px -8px rgba(0,0,0,0.5)"
                              py="1"
                              minW="150px"
                              zIndex="10"
                              overflow="hidden"
                            >
                              {/* Edit Option */}
                              <Flex
                                as="button"
                                w="100%"
                                px="3"
                                py="2.5"
                                align="center"
                                gap="2.5"
                                cursor={isAnalyzing ? "not-allowed" : "pointer"}
                                opacity={isAnalyzing ? 0.4 : 1}
                                _hover={isAnalyzing ? {} : { bg: t.bgHover }}
                                transition="all 0.1s"
                                onClick={(e) => {
                                  if (!isAnalyzing) handleEditClick(e, pr);
                                  else e.stopPropagation();
                                }}
                              >
                                <Flex
                                  w="22px"
                                  h="22px"
                                  borderRadius="md"
                                  bg="rgba(59,130,246,0.1)"
                                  align="center"
                                  justify="center"
                                  flexShrink="0"
                                >
                                  <Icon color="#3b82f6" boxSize="3">
                                    <LuPencil />
                                  </Icon>
                                </Flex>
                                <Text fontSize="12px" fontWeight="500" color={t.textPrimary}>
                                  Edit PR
                                </Text>
                              </Flex>

                              {/* Divider */}
                              <Box h="1px" bg={t.border} mx="2" />

                              {/* Delete Option */}
                              <Flex
                                as="button"
                                w="100%"
                                px="3"
                                py="2.5"
                                align="center"
                                gap="2.5"
                                cursor={isAnalyzing ? "not-allowed" : "pointer"}
                                opacity={isAnalyzing ? 0.4 : 1}
                                _hover={isAnalyzing ? {} : { bg: "rgba(239,68,68,0.06)" }}
                                transition="all 0.1s"
                                onClick={(e) => {
                                  if (!isAnalyzing) handleDeleteClick(e, pr);
                                  else e.stopPropagation();
                                }}
                              >
                                <Flex
                                  w="22px"
                                  h="22px"
                                  borderRadius="md"
                                  bg="rgba(239,68,68,0.1)"
                                  align="center"
                                  justify="center"
                                  flexShrink="0"
                                >
                                  <Icon color="#ef4444" boxSize="3">
                                    <LuTrash2 />
                                  </Icon>
                                </Flex>
                                <Text fontSize="12px" fontWeight="500" color="#ef4444">
                                  Delete PR
                                </Text>
                              </Flex>
                            </Box>
                          )}
                        </Box>
                      </Flex>
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

                    {/* AI Report Preview (for completed PRs) */}
                    {isCompleted && (pr.aiSummary || pr.impactLevel) && (
                      <Box
                        mb="3"
                        px="3"
                        py="2.5"
                        borderRadius="lg"
                        bg={t.bgHover}
                        border={`1px solid ${t.border}`}
                      >
                        <Flex align="center" gap="2" mb={pr.aiSummary ? "1.5" : "0"}>
                          <Icon color="#8b5cf6" boxSize="3">
                            <LuShieldAlert />
                          </Icon>
                          <Text
                            fontSize="10px"
                            fontWeight="700"
                            color={t.textFaint}
                            textTransform="uppercase"
                            letterSpacing="0.05em"
                          >
                            AI Report
                          </Text>
                          {pr.impactLevel && (
                            <Badge
                              bg={pr.impactLevel === "high" ? "rgba(239,68,68,0.1)" : pr.impactLevel === "medium" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)"}
                              color={pr.impactLevel === "high" ? "#ef4444" : pr.impactLevel === "medium" ? "#f59e0b" : "#10b981"}
                              borderRadius="md"
                              px="1.5"
                              py="0.5"
                              fontSize="9px"
                              fontWeight="700"
                              textTransform="uppercase"
                              border={`1px solid ${pr.impactLevel === "high" ? "rgba(239,68,68,0.2)" : pr.impactLevel === "medium" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`}
                            >
                              {pr.impactLevel}
                            </Badge>
                          )}
                          {pr.riskLevel && (
                            <Badge
                              bg={pr.riskLevel === "critical" ? "rgba(239,68,68,0.1)" : pr.riskLevel === "high" ? "rgba(245,158,11,0.1)" : pr.riskLevel === "medium" ? "rgba(59,130,246,0.1)" : "rgba(16,185,129,0.1)"}
                              color={pr.riskLevel === "critical" ? "#ef4444" : pr.riskLevel === "high" ? "#f59e0b" : pr.riskLevel === "medium" ? "#3b82f6" : "#10b981"}
                              borderRadius="md"
                              px="1.5"
                              py="0.5"
                              fontSize="9px"
                              fontWeight="700"
                              textTransform="uppercase"
                              border={`1px solid ${pr.riskLevel === "critical" ? "rgba(239,68,68,0.2)" : pr.riskLevel === "high" ? "rgba(245,158,11,0.2)" : pr.riskLevel === "medium" ? "rgba(59,130,246,0.2)" : "rgba(16,185,129,0.2)"}`}
                            >
                              {pr.riskLevel} risk
                            </Badge>
                          )}
                        </Flex>
                        {pr.aiSummary && (
                          <Text
                            fontSize="11px"
                            color={t.textSecondary}
                            lineHeight="1.5"
                            overflow="hidden"
                            display="-webkit-box"
                            css={{
                              WebkitLineClamp: "2",
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {pr.aiSummary}
                          </Text>
                        )}
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
                      ) : cd !== null && cd > 0 ? (
                        <Flex align="center" gap="2">
                          <Icon color="#3b82f6" boxSize="3.5">
                            <LuTimer />
                          </Icon>
                          <Text
                            fontSize="12px"
                            fontWeight="700"
                            fontFamily="mono"
                            color="#3b82f6"
                          >
                            {cd}s
                          </Text>
                          <Text fontSize="11px" color={t.textMuted}>
                            till Auto-Analysis
                          </Text>
                        </Flex>
                      ) : pr.status === "analyzing" ? (
                        <Flex align="center" gap="2">
                          <Spinner size="xs" color="#3b82f6" />
                          <Text
                            fontSize="11px"
                            color="#3b82f6"
                            fontWeight="600"
                          >
                            Analyzing...
                          </Text>
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

      {/* Edit Modal */}
      <EditPRModal
        isOpen={!!editModalPR}
        onClose={() => setEditModalPR(null)}
        pr={editModalPR}
        onUpdated={handlePRUpdated}
      />

      {/* Delete Modal */}
      <DeletePRModal
        isOpen={!!deleteModalPR}
        onClose={() => setDeleteModalPR(null)}
        pr={deleteModalPR}
        onDeleted={handlePRDeleted}
      />
    </Box>
  );
}
