// ═══════════════════════════════════════════════════════════════
// SETTINGS PAGE — Configuration panel for the platform
// ═══════════════════════════════════════════════════════════════

import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
  VStack,
  Separator,
} from "@chakra-ui/react";
import {
  LuSettings,
  LuGithub,
  LuBrain,
  LuTestTubeDiagonal,
  LuBell,
  LuShield,
  LuDatabase,
  LuCloud,
  LuGlobe,
  LuKey,
  LuToggleLeft,
  LuToggleRight,
  LuCheck,
  LuChevronRight,
} from "react-icons/lu";
import { useState } from "react";
import GlassCard from "../components/shared/GlassCard";
import { useThemeColors } from "../hooks/useThemeColors";

function ToggleSwitch({ enabled, onToggle }) {
  const t = useThemeColors();
  return (
    <Flex
      w="40px"
      h="22px"
      borderRadius="full"
      bg={enabled ? "rgba(34, 197, 94, 0.3)" : t.bgHover}
      border={`1px solid ${enabled ? "rgba(34, 197, 94, 0.5)" : t.border}`}
      cursor="pointer"
      onClick={onToggle}
      align="center"
      px="2px"
      transition="all 0.3s"
    >
      <Box
        w="16px"
        h="16px"
        borderRadius="full"
        bg={enabled ? "#22C55E" : t.textFaint}
        transform={enabled ? "translateX(18px)" : "translateX(0)"}
        transition="all 0.3s"
        boxShadow={enabled ? "0 0 8px rgba(34, 197, 94, 0.5)" : "none"}
      />
    </Flex>
  );
}

function SettingItem({ icon, iconColor, label, description, children }) {
  const t = useThemeColors();
  return (
    <Flex
      justify="space-between"
      align="center"
      py="4"
      borderBottom={`1px solid ${t.borderLight}`}
      _last={{ borderBottom: "none" }}
    >
      <Flex align="center" gap="3" flex="1">
        <Flex
          w="36px"
          h="36px"
          borderRadius="lg"
          bg={`${iconColor}15`}
          border={`1px solid ${iconColor}25`}
          align="center"
          justify="center"
          flexShrink="0"
        >
          <Icon color={iconColor} boxSize="4">
            {icon}
          </Icon>
        </Flex>
        <Box>
          <Text fontSize="sm" fontWeight="600" color={t.textPrimary}>
            {label}
          </Text>
          <Text fontSize="xs" color={t.textFaint}>
            {description}
          </Text>
        </Box>
      </Flex>
      {children}
    </Flex>
  );
}

export default function SettingsPage() {
  const t = useThemeColors();
  const [settings, setSettings] = useState({
    autoAnalyze: true,
    slackNotifications: true,
    emailAlerts: false,
    aiExplanations: true,
    testOptimization: true,
    cacheResults: true,
    darkMode: true,
    autoMerge: false,
    securityScan: true,
    performanceMonitor: true,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Box className="page-enter">
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4">
        {/* GitHub Integration */}
        <GlassCard>
          <Flex align="center" gap="2" mb="4">
            <Icon color={t.textPrimary} boxSize="4">
              <LuGithub />
            </Icon>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              GitHub Integration
            </Text>
          </Flex>
          <VStack gap="0" align="stretch">
            <SettingItem
              icon={<LuGithub />}
              iconColor="#8B5CF6"
              label="Auto-Analyze PRs"
              description="Automatically trigger analysis on new PRs"
            >
              <ToggleSwitch
                enabled={settings.autoAnalyze}
                onToggle={() => toggle("autoAnalyze")}
              />
            </SettingItem>
            <SettingItem
              icon={<LuKey />}
              iconColor="#f59e0b"
              label="API Token"
              description="GitHub Personal Access Token"
            >
              <Text fontSize="xs" color={t.textFaint} fontFamily="mono">
                ghp_••••••••••••
              </Text>
            </SettingItem>
            <SettingItem
              icon={<LuGlobe />}
              iconColor="#4F46E5"
              label="Webhook URL"
              description="Endpoint for GitHub webhooks"
            >
              <Text fontSize="xs" color={t.textFaint} fontFamily="mono">
                https://api.impact.ai/wh
              </Text>
            </SettingItem>
            <SettingItem
              icon={<LuShield />}
              iconColor="#22C55E"
              label="Auto-Merge Low Risk"
              description="Automatically merge PRs with risk score < 20"
            >
              <ToggleSwitch
                enabled={settings.autoMerge}
                onToggle={() => toggle("autoMerge")}
              />
            </SettingItem>
          </VStack>
        </GlassCard>

        {/* AI Model Configuration */}
        <GlassCard>
          <Flex align="center" gap="2" mb="4">
            <Icon color="#8B5CF6" boxSize="4">
              <LuBrain />
            </Icon>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              AI Model Configuration
            </Text>
          </Flex>
          <VStack gap="0" align="stretch">
            <SettingItem
              icon={<LuBrain />}
              iconColor="#8B5CF6"
              label="AI Explanations"
              description="Generate natural language risk explanations"
            >
              <ToggleSwitch
                enabled={settings.aiExplanations}
                onToggle={() => toggle("aiExplanations")}
              />
            </SettingItem>
            <SettingItem
              icon={<LuTestTubeDiagonal />}
              iconColor="#4F46E5"
              label="Smart Test Selection"
              description="Use AI to optimize test selection"
            >
              <ToggleSwitch
                enabled={settings.testOptimization}
                onToggle={() => toggle("testOptimization")}
              />
            </SettingItem>
            <SettingItem
              icon={<LuDatabase />}
              iconColor="#f59e0b"
              label="Cache Results"
              description="Cache analysis results for identical commits"
            >
              <ToggleSwitch
                enabled={settings.cacheResults}
                onToggle={() => toggle("cacheResults")}
              />
            </SettingItem>
            <SettingItem
              icon={<LuShield />}
              iconColor="#ef4444"
              label="Security Scanning"
              description="Run SAST/DAST on analyzed PRs"
            >
              <ToggleSwitch
                enabled={settings.securityScan}
                onToggle={() => toggle("securityScan")}
              />
            </SettingItem>
          </VStack>
        </GlassCard>

        {/* Notifications */}
        <GlassCard>
          <Flex align="center" gap="2" mb="4">
            <Icon color="#f59e0b" boxSize="4">
              <LuBell />
            </Icon>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Notifications
            </Text>
          </Flex>
          <VStack gap="0" align="stretch">
            <SettingItem
              icon={<LuBell />}
              iconColor="#8B5CF6"
              label="Slack Notifications"
              description="Post analysis results to Slack channel"
            >
              <ToggleSwitch
                enabled={settings.slackNotifications}
                onToggle={() => toggle("slackNotifications")}
              />
            </SettingItem>
            <SettingItem
              icon={<LuBell />}
              iconColor="#4F46E5"
              label="Email Alerts"
              description="Send email for high-risk PR detections"
            >
              <ToggleSwitch
                enabled={settings.emailAlerts}
                onToggle={() => toggle("emailAlerts")}
              />
            </SettingItem>
            <SettingItem
              icon={<LuCloud />}
              iconColor="#4F46E5"
              label="Performance Monitoring"
              description="Track pipeline performance metrics"
            >
              <ToggleSwitch
                enabled={settings.performanceMonitor}
                onToggle={() => toggle("performanceMonitor")}
              />
            </SettingItem>
          </VStack>
        </GlassCard>

        {/* Infrastructure */}
        <GlassCard>
          <Flex align="center" gap="2" mb="4">
            <Icon color="#4F46E5" boxSize="4">
              <LuCloud />
            </Icon>
            <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
              Infrastructure
            </Text>
          </Flex>
          <VStack gap="3" align="stretch">
            {[
              { label: "AWS Region", value: "us-east-1", status: "active" },
              {
                label: "Model Endpoint",
                value: "ml.g4dn.xlarge",
                status: "active",
              },
              {
                label: "Database",
                value: "DynamoDB (On-Demand)",
                status: "active",
              },
              {
                label: "Cache",
                value: "ElastiCache Redis 7.0",
                status: "active",
              },
              {
                label: "Graph DB",
                value: "Neo4j Aura Professional",
                status: "active",
              },
              {
                label: "CDN",
                value: "CloudFront Global Edge",
                status: "active",
              },
            ].map((infra, i) => (
              <Flex
                key={i}
                justify="space-between"
                align="center"
                bg={t.bgSubtle}
                px="4"
                py="3"
                borderRadius="lg"
                border={`1px solid ${t.borderLight}`}
              >
                <Box>
                  <Text fontSize="xs" color={t.textMuted}>
                    {infra.label}
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color={t.textPrimary}>
                    {infra.value}
                  </Text>
                </Box>
                <Flex align="center" gap="1.5">
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg="#22C55E"
                    boxShadow="0 0 6px rgba(16,185,129,0.5)"
                  />
                  <Text fontSize="10px" color="#22C55E" fontWeight="500">
                    Active
                  </Text>
                </Flex>
              </Flex>
            ))}
          </VStack>
        </GlassCard>
      </Grid>
    </Box>
  );
}
