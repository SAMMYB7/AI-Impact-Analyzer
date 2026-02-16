// ═══════════════════════════════════════════════════════════════
// LOGS PAGE — Centralized log aggregation across all PRs
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
  Spinner,
  Badge,
  Input,
  VStack,
} from "@chakra-ui/react";
import {
  LuScrollText,
  LuInfo,
  LuTriangleAlert,
  LuCircleX,
  LuBug,
  LuSearch,
  LuFilter,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import StatCard from "../components/shared/StatCard";
import { useThemeColors } from "../hooks/useThemeColors";
import { getAllLogs } from "../api/api";

const LEVEL_CONFIG = {
  info: { color: "#3b82f6", icon: LuInfo, label: "INFO" },
  warn: { color: "#f59e0b", icon: LuTriangleAlert, label: "WARN" },
  error: { color: "#ef4444", icon: LuCircleX, label: "ERROR" },
  debug: { color: "#8b5cf6", icon: LuBug, label: "DEBUG" },
};

export default function LogsPage() {
  const t = useThemeColors();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, info, warn, error, debug
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function fetchLogs() {
      try {
        const data = await getAllLogs();
        if (!ignore) setLogs(data);
      } catch (err) {
        console.error("Failed to load logs:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchLogs();
    return () => {
      ignore = true;
    };
  }, []);

  // Filter and search
  const filtered = logs
    .filter((log) => filter === "all" || log.level === filter)
    .filter(
      (log) =>
        search === "" ||
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.prId.toLowerCase().includes(search.toLowerCase()) ||
        log.stage.toLowerCase().includes(search.toLowerCase()),
    );

  // Stats
  const infoCount = logs.filter((l) => l.level === "info").length;
  const warnCount = logs.filter((l) => l.level === "warn").length;
  const errorCount = logs.filter((l) => l.level === "error").length;
  const debugCount = logs.filter((l) => l.level === "debug").length;

  // Unique PRs in logs
  const uniquePRs = [...new Set(logs.map((l) => l.prId))].length;

  if (loading) {
    return (
      <Flex align="center" justify="center" h="60vh" gap="3">
        <Spinner size="md" color="#3b82f6" />
        <Text color={t.textMuted}>Loading logs...</Text>
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
            bg="rgba(100,116,139,0.1)"
            align="center"
            justify="center"
          >
            <Icon color="#64748b" boxSize="5">
              <LuScrollText />
            </Icon>
          </Flex>
          <Box>
            <Text
              fontSize="20px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              System Logs
            </Text>
            <Text fontSize="13px" color={t.textMuted}>
              Centralized log aggregation across all analysis runs
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
          label="Total Logs"
          value={logs.length}
          icon={<LuScrollText />}
          iconColor="#64748b"
        />
        <StatCard
          label="Info"
          value={infoCount}
          icon={<LuInfo />}
          iconColor="#3b82f6"
        />
        <StatCard
          label="Warnings"
          value={warnCount}
          icon={<LuTriangleAlert />}
          iconColor="#f59e0b"
        />
        <StatCard
          label="Errors"
          value={errorCount}
          icon={<LuCircleX />}
          iconColor="#ef4444"
        />
      </Grid>

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
              placeholder="Search logs by message, PR, or stage..."
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
            <Icon color={t.textFaint} boxSize="3.5">
              <LuFilter />
            </Icon>
            {["all", "info", "warn", "error", "debug"].map((level) => {
              const isActive = filter === level;
              const cfg = level !== "all" ? LEVEL_CONFIG[level] : null;
              return (
                <Box
                  key={level}
                  as="button"
                  px="3"
                  py="1.5"
                  borderRadius="md"
                  fontSize="11px"
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="0.04em"
                  bg={
                    isActive ? (cfg?.color || t.accent) + "18" : "transparent"
                  }
                  color={isActive ? cfg?.color || t.accent : t.textMuted}
                  border={`1px solid ${isActive ? (cfg?.color || t.accent) + "30" : "transparent"}`}
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{
                    bg: (cfg?.color || t.accent) + "10",
                  }}
                  onClick={() => setFilter(level)}
                >
                  {level}
                </Box>
              );
            })}
          </Flex>
        </Flex>
      </GlassCard>

      {/* Log stream */}
      <Box mt="4">
        <GlassCard noPadding>
          <Box px="4" py="3" borderBottom={`1px solid ${t.border}`}>
            <Flex justify="space-between" align="center">
              <Text
                fontSize="11px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
              >
                Log Stream ({filtered.length})
              </Text>
              <Text fontSize="10px" color={t.textFaint}>
                {uniquePRs} PRs
              </Text>
            </Flex>
          </Box>
          <Box
            maxH="600px"
            overflowY="auto"
            px="4"
            py="3"
            css={{
              "&::-webkit-scrollbar": { width: "5px" },
              "&::-webkit-scrollbar-track": { bg: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                bg: t.scrollThumb,
                borderRadius: "3px",
              },
            }}
          >
            {filtered.length === 0 ? (
              <Flex align="center" justify="center" py="12">
                <Text color={t.textFaint} fontSize="sm">
                  {search
                    ? "No logs match your search"
                    : "No logs available yet"}
                </Text>
              </Flex>
            ) : (
              <VStack gap="1" align="stretch">
                {filtered.map((log, i) => {
                  const cfg = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.info;
                  const IconComp = cfg.icon;
                  return (
                    <Flex
                      key={log._id || i}
                      align="flex-start"
                      gap="3"
                      py="2"
                      px="2"
                      borderRadius="md"
                      _hover={{ bg: t.bgHover }}
                      transition="background 0.1s"
                    >
                      {/* Level icon */}
                      <Flex
                        w="22px"
                        h="22px"
                        borderRadius="md"
                        bg={`${cfg.color}15`}
                        align="center"
                        justify="center"
                        flexShrink="0"
                        mt="1"
                      >
                        <Icon color={cfg.color} boxSize="3">
                          <IconComp />
                        </Icon>
                      </Flex>

                      {/* Content */}
                      <Box flex="1" minW="0">
                        <Flex gap="2" align="center" mb="0.5" flexWrap="wrap">
                          <Badge
                            bg={`${cfg.color}12`}
                            color={cfg.color}
                            borderRadius="md"
                            px="1.5"
                            py="0"
                            fontSize="9px"
                            fontWeight="700"
                            textTransform="uppercase"
                          >
                            {cfg.label}
                          </Badge>
                          <Badge
                            bg="rgba(139,92,246,0.08)"
                            color="#a78bfa"
                            borderRadius="md"
                            px="1.5"
                            py="0"
                            fontSize="9px"
                            fontFamily="mono"
                          >
                            {log.stage}
                          </Badge>
                          <Text
                            fontSize="10px"
                            color={t.accent}
                            fontFamily="mono"
                            fontWeight="500"
                          >
                            {log.prId.length > 16
                              ? `...${log.prId.slice(-10)}`
                              : log.prId}
                          </Text>
                        </Flex>
                        <Text
                          fontSize="12px"
                          color={t.textSecondary}
                          fontFamily="mono"
                          lineHeight="1.5"
                        >
                          {log.message}
                        </Text>
                      </Box>

                      {/* Timestamp */}
                      <Text
                        fontSize="10px"
                        color={t.textFaint}
                        fontFamily="mono"
                        flexShrink="0"
                        mt="1"
                      >
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </Text>
                    </Flex>
                  );
                })}
                <div ref={bottomRef} />
              </VStack>
            )}
          </Box>
        </GlassCard>
      </Box>
    </Box>
  );
}
