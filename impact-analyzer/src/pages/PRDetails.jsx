// ═══════════════════════════════════════════════════════════════
// PR DETAILS PAGE — Full detail view of a single pull request
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  Spinner,
  Grid,
  Badge,
} from "@chakra-ui/react";
import {
  LuArrowLeft,
  LuPlay,
  LuGitBranch,
  LuUser,
  LuFileCode,
  LuShieldAlert,
  LuTestTubeDiagonal,
  LuTestTubes,
  LuClock,
  LuPackage,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatusBadge from "../components/shared/StatusBadge";
import StatCard from "../components/shared/StatCard";
import PipelineView from "../components/PipelineView";
import LogViewer from "../components/LogViewer";
import { useThemeColors } from "../hooks/useThemeColors";
import { getPR, analyzePR, getLogs } from "../api/api";
import { toaster } from "../components/ui/toaster";

export default function PRDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useThemeColors();

  const [pr, setPR] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const pollRef = useRef(null);

  // Fetch PR + logs
  const fetchData = useCallback(async () => {
    try {
      const [prData, logsData] = await Promise.all([getPR(id), getLogs(id)]);
      setPR(prData.pr || prData);
      setLogs(logsData.logs || logsData || []);
    } catch (err) {
      console.error("Failed to fetch PR:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData]);

  // Start polling when analyzing
  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      fetchData();
    }, 2000);
  }

  // Stop polling when analysis is done
  const prStatus = pr?.status;
  useEffect(() => {
    if (prStatus && prStatus !== "analyzing" && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
      setAnalyzing(false);
    }
  }, [prStatus]);

  // Handle analyze button click
  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      await analyzePR(id);
      startPolling();
      // Immediate fetch
      setTimeout(fetchData, 300);
    } catch (err) {
      setAnalyzing(false);

      // Show user-friendly toast based on error type
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || err.message;

      if (status === 409) {
        toaster.create({
          title: "Already Analyzed",
          description:
            "This PR has already been processed. Create a new PR to run analysis again.",
          type: "warning",
          duration: 4000,
        });
      } else {
        toaster.create({
          title: "Analysis Failed",
          description: msg,
          type: "error",
          duration: 4000,
        });
      }
    }
  }

  if (loading) {
    return (
      <Flex align="center" justify="center" h="60vh" gap="3">
        <Spinner size="md" color="#3b82f6" />
        <Text color={t.textMuted}>Loading PR details...</Text>
      </Flex>
    );
  }

  if (!pr) {
    return (
      <Flex direction="column" align="center" justify="center" h="60vh" gap="4">
        <Text color={t.textMuted} fontSize="lg">
          Pull request not found
        </Text>
        <Button
          size="sm"
          variant="ghost"
          color={t.textMuted}
          onClick={() => navigate("/dashboard")}
        >
          <Icon mr="1.5">
            <LuArrowLeft />
          </Icon>
          Back to Dashboard
        </Button>
      </Flex>
    );
  }

  const riskColor =
    (pr.riskScore || 0) >= 70
      ? "#ef4444"
      : (pr.riskScore || 0) >= 40
        ? "#f59e0b"
        : "#10b981";

  return (
    <Box>
      {/* Header */}
      <Flex align="center" gap="3" mb="6" flexWrap="wrap">
        <Box
          as="button"
          onClick={() => navigate("/dashboard")}
          p="2"
          borderRadius="lg"
          _hover={{ bg: t.bgHover }}
          transition="all 0.15s"
          cursor="pointer"
        >
          <Icon color={t.textMuted} boxSize="5">
            <LuArrowLeft />
          </Icon>
        </Box>
        <Box flex="1" minW="0">
          <Flex align="center" gap="2" flexWrap="wrap">
            <Text
              fontSize="18px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              PR #{pr.prId}
            </Text>
            <StatusBadge status={pr.status} />
          </Flex>
          <Text fontSize="13px" color={t.textMuted} mt="0.5" truncate>
            {pr.title || `${pr.branch} → main`}
          </Text>
        </Box>
        <Button
          size="sm"
          bg="linear-gradient(135deg, #3b82f6, #8b5cf6)"
          color="white"
          borderRadius="lg"
          fontSize="12px"
          fontWeight="600"
          px="5"
          _hover={{ opacity: 0.9 }}
          onClick={handleAnalyze}
          disabled={analyzing || pr.status === "analyzing"}
        >
          <Icon mr="1.5" boxSize="3.5">
            <LuPlay />
          </Icon>
          {analyzing ? "Analyzing..." : "Run Analysis"}
        </Button>
      </Flex>

      {/* PR metadata cards */}
      <Grid
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        gap="3"
        mb="4"
      >
        <GlassCard>
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg="rgba(59,130,246,0.1)"
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color="#3b82f6" boxSize="4">
                <LuUser />
              </Icon>
            </Flex>
            <Box minW="0">
              <Text
                fontSize="10px"
                color={t.textFaint}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Author
              </Text>
              <Text
                fontSize="13px"
                color={t.textPrimary}
                fontWeight="600"
                truncate
              >
                {pr.author}
              </Text>
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard>
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg="rgba(139,92,246,0.1)"
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color="#8b5cf6" boxSize="4">
                <LuGitBranch />
              </Icon>
            </Flex>
            <Box minW="0">
              <Text
                fontSize="10px"
                color={t.textFaint}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Branch
              </Text>
              <Text
                fontSize="13px"
                color={t.textPrimary}
                fontWeight="600"
                fontFamily="mono"
                truncate
              >
                {pr.branch}
              </Text>
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard>
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg="rgba(245,158,11,0.1)"
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color="#f59e0b" boxSize="4">
                <LuFileCode />
              </Icon>
            </Flex>
            <Box minW="0">
              <Text
                fontSize="10px"
                color={t.textFaint}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Files Changed
              </Text>
              <Text fontSize="13px" color={t.textPrimary} fontWeight="600">
                {pr.filesChanged?.length || 0} files
              </Text>
            </Box>
          </Flex>
        </GlassCard>

        <GlassCard>
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg={`${riskColor}18`}
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color={riskColor} boxSize="4">
                <LuShieldAlert />
              </Icon>
            </Flex>
            <Box minW="0">
              <Text
                fontSize="10px"
                color={t.textFaint}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Risk Score
              </Text>
              <Text
                fontSize="20px"
                color={riskColor}
                fontWeight="800"
                fontFamily="mono"
                lineHeight="1.2"
              >
                {pr.riskScore ?? "—"}
                <Text as="span" fontSize="12px" fontWeight="500">
                  %
                </Text>
              </Text>
            </Box>
          </Flex>
        </GlassCard>
      </Grid>

      {/* Analysis results */}
      {pr.status !== "received" && (
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
          gap="3"
          mb="4"
        >
          <StatCard
            label="Selected Tests"
            value={pr.selectedTests?.length || 0}
            icon={<LuTestTubeDiagonal />}
            iconColor="#3b82f6"
            isInteger
          />
          <StatCard
            label="Skipped Tests"
            value={pr.skippedTests?.length || 0}
            icon={<LuTestTubes />}
            iconColor="#8b5cf6"
            isInteger
          />
          <StatCard
            label="Time Saved"
            value={pr.estimatedTimeSaved || 0}
            suffix="s"
            icon={<LuClock />}
            iconColor="#10b981"
          />
        </Grid>
      )}

      {/* Modules impacted */}
      {pr.modulesImpacted?.length > 0 && (
        <Box mb="4">
          <GlassCard>
            <Text
              fontSize="11px"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color={t.textMuted}
              mb="3"
            >
              <Icon boxSize="3" mr="1.5" verticalAlign="middle">
                <LuPackage />
              </Icon>
              Modules Impacted ({pr.modulesImpacted.length})
            </Text>
            <Flex gap="2" flexWrap="wrap">
              {pr.modulesImpacted.map((mod) => (
                <Badge
                  key={mod}
                  bg="rgba(139,92,246,0.1)"
                  color="#a78bfa"
                  borderRadius="md"
                  px="2.5"
                  py="1"
                  fontSize="11px"
                  fontWeight="600"
                  fontFamily="mono"
                  border="1px solid rgba(139,92,246,0.2)"
                >
                  {mod}
                </Badge>
              ))}
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* Files changed list */}
      {pr.filesChanged?.length > 0 && (
        <Box mb="4">
          <GlassCard>
            <Text
              fontSize="11px"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color={t.textMuted}
              mb="3"
            >
              <Icon boxSize="3" mr="1.5" verticalAlign="middle">
                <LuFileCode />
              </Icon>
              Files Changed ({pr.filesChanged.length})
            </Text>
            <Flex direction="column" gap="1">
              {pr.filesChanged.map((file) => (
                <Text
                  key={file}
                  fontSize="12px"
                  color={t.textSecondary}
                  fontFamily="mono"
                  py="1"
                  px="2"
                  borderRadius="md"
                  _hover={{ bg: t.bgHover }}
                >
                  {file}
                </Text>
              ))}
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* Selected tests */}
      {pr.selectedTests?.length > 0 && (
        <Box mb="4">
          <GlassCard>
            <Text
              fontSize="11px"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color={t.textMuted}
              mb="3"
            >
              <Icon boxSize="3" mr="1.5" verticalAlign="middle">
                <LuTestTubeDiagonal />
              </Icon>
              Selected Tests ({pr.selectedTests.length})
            </Text>
            <Flex direction="column" gap="1">
              {pr.selectedTests.map((test) => (
                <Flex
                  key={test}
                  align="center"
                  gap="2"
                  py="1"
                  px="2"
                  borderRadius="md"
                  _hover={{ bg: t.bgHover }}
                >
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg="#10b981"
                    flexShrink="0"
                  />
                  <Text
                    fontSize="12px"
                    color={t.textSecondary}
                    fontFamily="mono"
                  >
                    {test}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </GlassCard>
        </Box>
      )}

      {/* Pipeline view */}
      <Box mb="4">
        <PipelineView stages={pr.pipeline?.stages || []} />
      </Box>

      {/* Log viewer */}
      <Box mb="4">
        <LogViewer logs={logs} />
      </Box>
    </Box>
  );
}
