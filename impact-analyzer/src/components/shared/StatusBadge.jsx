// ═══════════════════════════════════════════════════════════════
// STATUS BADGE — Professional status indicator with Chakra Status
// ═══════════════════════════════════════════════════════════════

import { Flex, Text, Box, Status } from "@chakra-ui/react";

const STATUS_CONFIG = {
  running: {
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.2)",
    pulse: true,
    palette: "blue",
  },
  completed: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.2)",
    pulse: false,
    palette: "green",
  },
  failed: {
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.2)",
    pulse: false,
    palette: "red",
  },
  healthy: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.2)",
    pulse: false,
    palette: "green",
  },
  degraded: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.2)",
    pulse: true,
    palette: "orange",
  },
  pending: {
    color: "#64748b",
    bg: "rgba(100, 116, 139, 0.1)",
    border: "rgba(100, 116, 139, 0.2)",
    pulse: false,
    palette: "gray",
  },
  analyzing: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.2)",
    pulse: true,
    palette: "orange",
  },
  open: {
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.2)",
    pulse: false,
    palette: "blue",
  },
  high: {
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.2)",
    pulse: false,
    palette: "red",
  },
  medium: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.2)",
    pulse: false,
    palette: "orange",
  },
  low: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.2)",
    pulse: false,
    palette: "green",
  },
  passed: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.2)",
    pulse: false,
    palette: "green",
  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <Flex
      align="center"
      gap="1.5"
      bg={config.bg}
      border={`1px solid ${config.border}`}
      borderRadius="md"
      px={size === "sm" ? "2" : "2.5"}
      py={size === "sm" ? "0.5" : "1"}
      transition="all 0.2s ease"
    >
      <Box
        w={size === "sm" ? "5px" : "6px"}
        h={size === "sm" ? "5px" : "6px"}
        borderRadius="full"
        bg={config.color}
        boxShadow={`0 0 4px ${config.color}60`}
        animation={
          config.pulse
            ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            : "none"
        }
      />
      <Text
        fontSize={size === "sm" ? "10px" : "11px"}
        color={config.color}
        fontWeight="600"
        textTransform="capitalize"
        letterSpacing="0.02em"
      >
        {status}
      </Text>
    </Flex>
  );
}
