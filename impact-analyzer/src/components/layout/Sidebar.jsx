// ═══════════════════════════════════════════════════════════════
// SIDEBAR NAVIGATION — Professional enterprise sidebar
// ═══════════════════════════════════════════════════════════════

import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Separator,
  Badge,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuGitPullRequest,
  LuBrain,
  LuTestTubeDiagonal,
  LuPlay,
  LuChartColumnIncreasing,
  LuScrollText,
  LuSettings,
  LuZap,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { useState } from "react";
import { useSimulation } from "../../hooks/useSimulation";
import { useThemeColors } from "../../hooks/useThemeColors";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard },
  { path: "/pull-requests", label: "Pull Requests", icon: LuGitPullRequest },
  { path: "/analysis", label: "AI Analysis", icon: LuBrain },
  {
    path: "/test-selection",
    label: "Test Selection",
    icon: LuTestTubeDiagonal,
  },
  { path: "/test-runs", label: "Test Execution", icon: LuPlay },
  { path: "/metrics", label: "Metrics", icon: LuChartColumnIncreasing },
  { path: "/logs", label: "Logs", icon: LuScrollText },
  { path: "/settings", label: "Settings", icon: LuSettings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { phase } = useSimulation();
  const t = useThemeColors();

  const phaseColors = {
    idle: "#64748b",
    pr_received: "#3b82f6",
    analyzing: "#f59e0b",
    predicting: "#f97316",
    selecting_tests: "#8b5cf6",
    running_tests: "#10b981",
    completed: "#10b981",
  };

  return (
    <Box
      as="nav"
      w={collapsed ? "72px" : "240px"}
      h="100vh"
      bg={t.bgSidebar}
      backdropFilter="blur(24px)"
      borderRight={`1px solid ${t.border}`}
      transition="width 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
      position="relative"
      zIndex="20"
      display="flex"
      flexDirection="column"
      overflowY="auto"
      overflowX="hidden"
      flexShrink="0"
    >
      {/* Brand */}
      <Flex
        align="center"
        gap="3"
        px={collapsed ? "4" : "5"}
        py="5"
        borderBottom={`1px solid ${t.border}`}
        justify={collapsed ? "center" : "flex-start"}
      >
        <Flex
          w="34px"
          h="34px"
          borderRadius="9px"
          bg="linear-gradient(135deg, #14b8a6, #8b5cf6)"
          align="center"
          justify="center"
          flexShrink="0"
          boxShadow="0 0 16px rgba(20, 184, 166, 0.25)"
        >
          <Icon color="white" boxSize="4.5">
            <LuZap />
          </Icon>
        </Flex>
        {!collapsed && (
          <Box overflow="hidden">
            <Text
              fontSize="sm"
              fontWeight="800"
              color={t.textPrimary}
              letterSpacing="-0.02em"
              lineHeight="1.2"
            >
              Impact
            </Text>
            <Text
              fontSize="10px"
              color={t.textMuted}
              letterSpacing="0.1em"
              textTransform="uppercase"
              fontWeight="500"
            >
              Analyzer
            </Text>
          </Box>
        )}
      </Flex>

      {/* Status Indicator */}
      {!collapsed && (
        <Flex
          mx="4"
          mt="4"
          mb="2"
          px="3"
          py="2"
          borderRadius="lg"
          bg={t.bgSubtle}
          border={`1px solid ${t.borderLight}`}
          align="center"
          gap="2"
          transition="all 0.3s ease"
        >
          <Box
            w="7px"
            h="7px"
            borderRadius="full"
            bg={phaseColors[phase] || phaseColors.idle}
            boxShadow={`0 0 6px ${phaseColors[phase] || phaseColors.idle}80`}
            animation={
              phase !== "idle" && phase !== "completed"
                ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                : "none"
            }
          />
          <Text
            fontSize="11px"
            color={t.textSecondary}
            textTransform="capitalize"
            fontWeight="500"
          >
            {phase === "idle" ? "System Ready" : phase.replace(/_/g, " ")}
          </Text>
        </Flex>
      )}

      {/* Navigation Items */}
      <VStack gap="0.5" px="3" mt="4" flex="1" align="stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <Flex
                align="center"
                gap="3"
                px="3"
                py="2.5"
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                bg={isActive ? t.accentLight : "transparent"}
                color={isActive ? t.accentText : t.textMuted}
                _hover={{
                  bg: isActive ? t.accentLight : t.bgHover,
                  color: isActive ? t.accentText : t.textPrimary,
                }}
                position="relative"
                justify={collapsed ? "center" : "flex-start"}
              >
                {isActive && (
                  <Box
                    position="absolute"
                    left="0"
                    top="50%"
                    transform="translateY(-50%)"
                    w="2.5px"
                    h="55%"
                    bg={t.accent}
                    borderRadius="full"
                    boxShadow={`0 0 6px ${t.accentGlow}`}
                  />
                )}
                <Icon boxSize="4.5">
                  <item.icon />
                </Icon>
                {!collapsed && (
                  <Text
                    fontSize="13px"
                    fontWeight={isActive ? "600" : "400"}
                    letterSpacing="-0.01em"
                  >
                    {item.label}
                  </Text>
                )}
              </Flex>
            </NavLink>
          );
        })}
      </VStack>

      {/* Collapse Toggle */}
      <Flex
        justify="center"
        py="4"
        borderTop={`1px solid ${t.border}`}
        cursor="pointer"
        onClick={() => setCollapsed(!collapsed)}
        _hover={{ bg: t.bgSubtle }}
        transition="all 0.2s"
      >
        <Icon
          color={t.textFaint}
          boxSize="3.5"
          _hover={{ color: t.textSecondary }}
          transition="color 0.2s"
        >
          {collapsed ? <LuChevronRight /> : <LuChevronLeft />}
        </Icon>
      </Flex>
    </Box>
  );
}
