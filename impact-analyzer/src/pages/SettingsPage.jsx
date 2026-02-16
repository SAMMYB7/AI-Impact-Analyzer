// ═══════════════════════════════════════════════════════════════
// SETTINGS PAGE — Configuration display and app info
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { Box, Flex, Text, Grid, Icon, Badge } from "@chakra-ui/react";
import {
  LuSettings,
  LuServer,
  LuDatabase,
  LuCloud,
  LuShield,
  LuGitBranch,
  LuCpu,
  LuGlobe,
  LuTimer,
  LuCircleCheck,
  LuCircleX,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import { useThemeColors } from "../hooks/useThemeColors";
import { getHealth } from "../api/api";

export default function SettingsPage() {
  const t = useThemeColors();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, []);

  const isConnected = health?.status === "ok";

  // Config sections
  const sections = [
    {
      title: "Backend Connection",
      icon: LuServer,
      color: "#3b82f6",
      items: [
        {
          label: "API Base URL",
          value: import.meta.env.VITE_API_URL || "http://localhost:5000",
        },
        {
          label: "Status",
          value: isConnected ? "Connected" : "Disconnected",
          badge: true,
          badgeColor: isConnected ? "#10b981" : "#ef4444",
        },
        {
          label: "Uptime",
          value: health?.uptime
            ? typeof health.uptime === "number"
              ? `${Math.floor(health.uptime)}s`
              : health.uptime
            : "N/A",
        },
        {
          label: "Last Check",
          value: health?.timestamp
            ? new Date(health.timestamp).toLocaleString()
            : "N/A",
        },
      ],
    },
    {
      title: "Database",
      icon: LuDatabase,
      color: "#10b981",
      items: [
        { label: "Engine", value: "MongoDB" },
        { label: "Database", value: "impact-analyzer" },
        { label: "Connection", value: "localhost:27017" },
        {
          label: "Models",
          value: "PullRequest, PipelineRun, Log, TestMapping",
        },
      ],
    },
    {
      title: "AWS Services",
      icon: LuCloud,
      color: "#f59e0b",
      items: [
        { label: "Region", value: "us-east-1" },
        {
          label: "SageMaker",
          value: "Mock Mode",
          badge: true,
          badgeColor: "#f59e0b",
        },
        {
          label: "S3 Bucket",
          value: "Mock Mode",
          badge: true,
          badgeColor: "#f59e0b",
        },
        { label: "Note", value: "Set real AWS credentials in backend .env" },
      ],
    },
    {
      title: "Analysis Engine",
      icon: LuCpu,
      color: "#8b5cf6",
      items: [
        { label: "Provider", value: "Mock (SageMaker fallback)" },
        { label: "Model Version", value: "mock-v1" },
        { label: "Auto-Analyze", value: "Disabled" },
        {
          label: "Risk Levels",
          value: "Low (<40), Medium (40-69), High (≥70)",
        },
      ],
    },
    {
      title: "GitHub Integration",
      icon: LuGitBranch,
      color: "#14b8a6",
      items: [
        {
          label: "Webhook Support",
          value: "Active",
          badge: true,
          badgeColor: "#10b981",
        },
        { label: "Endpoint", value: "POST /api/webhook/github" },
        {
          label: "Token",
          value: "Not configured",
          badge: true,
          badgeColor: "#f59e0b",
        },
        { label: "Payload Types", value: "GitHub native, Simulated" },
      ],
    },
    {
      title: "Frontend",
      icon: LuGlobe,
      color: "#ec4899",
      items: [
        { label: "Framework", value: "React 19 + Vite 7" },
        { label: "UI Library", value: "Chakra UI v3" },
        { label: "Theme", value: "Dark / Light (next-themes)" },
        { label: "Charts", value: "Recharts" },
      ],
    },
  ];

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
              <LuSettings />
            </Icon>
          </Flex>
          <Box>
            <Text
              fontSize="20px"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
            >
              Settings
            </Text>
            <Text fontSize="13px" color={t.textMuted}>
              System configuration, connections, and environment info
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Connection status banner */}
      <GlassCard>
        <Flex align="center" gap="3">
          <Flex
            w="40px"
            h="40px"
            borderRadius="xl"
            bg={isConnected ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"}
            align="center"
            justify="center"
          >
            <Icon color={isConnected ? "#10b981" : "#ef4444"} boxSize="5">
              {isConnected ? <LuCircleCheck /> : <LuCircleX />}
            </Icon>
          </Flex>
          <Box>
            <Text fontSize="14px" fontWeight="700" color={t.textPrimary}>
              {isConnected ? "All Systems Operational" : "Backend Disconnected"}
            </Text>
            <Text fontSize="12px" color={t.textMuted}>
              {isConnected
                ? "Backend API, MongoDB, and all services are running"
                : "Cannot reach the backend API. Ensure the server is running."}
            </Text>
          </Box>
        </Flex>
      </GlassCard>

      {/* Config sections grid */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mt="4">
        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <GlassCard key={section.title}>
              <Flex align="center" gap="2" mb="4">
                <Flex
                  w="28px"
                  h="28px"
                  borderRadius="lg"
                  bg={`${section.color}15`}
                  align="center"
                  justify="center"
                >
                  <Icon color={section.color} boxSize="3.5">
                    <SectionIcon />
                  </Icon>
                </Flex>
                <Text fontSize="13px" fontWeight="700" color={t.textPrimary}>
                  {section.title}
                </Text>
              </Flex>
              <Flex direction="column" gap="2.5">
                {section.items.map((item) => (
                  <Flex key={item.label} justify="space-between" align="center">
                    <Text fontSize="12px" color={t.textMuted}>
                      {item.label}
                    </Text>
                    {item.badge ? (
                      <Badge
                        bg={`${item.badgeColor}15`}
                        color={item.badgeColor}
                        borderRadius="md"
                        px="2"
                        py="0.5"
                        fontSize="11px"
                        fontWeight="600"
                        border={`1px solid ${item.badgeColor}25`}
                      >
                        {item.value}
                      </Badge>
                    ) : (
                      <Text
                        fontSize="12px"
                        color={t.textPrimary}
                        fontWeight="500"
                        fontFamily="mono"
                        maxW="200px"
                        textAlign="right"
                      >
                        {item.value}
                      </Text>
                    )}
                  </Flex>
                ))}
              </Flex>
            </GlassCard>
          );
        })}
      </Grid>

      {/* Version footer */}
      <Flex justify="center" mt="8" mb="4" gap="3" align="center">
        <Text fontSize="11px" color={t.textFaint}>
          Impact Analyzer v2.4.1
        </Text>
        <Text fontSize="11px" color={t.textFaint}>
          •
        </Text>
        <Text fontSize="11px" color={t.textFaint} fontFamily="mono">
          Node.js + Express + MongoDB
        </Text>
      </Flex>
    </Box>
  );
}
