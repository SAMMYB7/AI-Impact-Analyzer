// ═══════════════════════════════════════════════════════════════
// TOP NAVBAR — Professional enterprise header
// ═══════════════════════════════════════════════════════════════

import {
  Box,
  Flex,
  Text,
  Icon,
  Badge,
  HStack,
  VStack,
  Separator,
} from "@chakra-ui/react";
import {
  LuBell,
  LuSearch,
  LuChevronDown,
  LuCircle,
  LuActivity,
  LuGlobe,
  LuShield,
  LuSun,
  LuMoon,
  LuClock,
  LuCircleCheck,
  LuTriangleAlert,
  LuInfo,
  LuCircleX,
  LuX,
} from "react-icons/lu";
import { useSimulation } from "../../hooks/useSimulation";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useColorMode } from "../ui/color-mode";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const PAGE_TITLES = {
  "/dashboard": "Dashboard Overview",
  "/pull-requests": "Pull Requests",
  "/analysis": "AI Impact Analysis",
  "/test-selection": "Test Selection Engine",
  "/test-runs": "Test Execution",
  "/metrics": "Analytics & Metrics",
  "/logs": "System Logs",
  "/settings": "Settings",
};

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const NOTIF_ICONS = {
  success: LuCircleCheck,
  error: LuCircleX,
  warning: LuTriangleAlert,
  info: LuInfo,
};
const NOTIF_COLORS = {
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
};

export default function TopNavbar() {
  const {
    dashboardStats,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    phase,
  } = useSimulation();
  const location = useLocation();
  const t = useThemeColors();
  const { colorMode, toggleColorMode } = useColorMode();

  // Live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Animated health
  const [displayHealth, setDisplayHealth] = useState(
    dashboardStats.pipelineHealth,
  );
  const healthRef = useRef(dashboardStats.pipelineHealth);
  useEffect(() => {
    healthRef.current = dashboardStats.pipelineHealth;
    let rafId;
    const animate = () => {
      setDisplayHealth((prev) => {
        const diff = healthRef.current - prev;
        if (Math.abs(diff) < 0.05) return healthRef.current;
        return prev + diff / 10;
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [dashboardStats.pipelineHealth]);

  // Notification dropdown
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pageTitle = PAGE_TITLES[location.pathname] || "Dashboard";
  const isDark = colorMode === "dark";

  return (
    <Flex
      as="header"
      w="100%"
      h="60px"
      bg={t.bgNavbar}
      backdropFilter="blur(24px)"
      borderBottom={`1px solid ${t.border}`}
      align="center"
      justify="space-between"
      px="6"
      position="sticky"
      top="0"
      zIndex="15"
    >
      {/* Left: Page Title + Version */}
      <Flex align="center" gap="4">
        <Text fontSize="lg" fontWeight="700" color={t.textPrimary}>
          {pageTitle}
        </Text>
        <Badge
          bg={t.accentLight}
          color={t.accentText}
          fontSize="10px"
          px="2"
          py="0.5"
          borderRadius="md"
          fontWeight="600"
          letterSpacing="0.02em"
        >
          v2.4.1
        </Badge>
        {phase !== "idle" && phase !== "completed" && (
          <Badge
            bg={t.warningBg}
            color={t.warning}
            fontSize="xs"
            px="2"
            py="0.5"
            borderRadius="full"
            fontWeight="600"
            animation="pulse 2s infinite"
          >
            ● Simulating
          </Badge>
        )}
      </Flex>

      {/* Right: Controls */}
      <HStack gap="3">
        {/* Live Clock */}
        <Flex
          align="center"
          gap="1.5"
          bg={t.bgInput}
          px="3"
          py="1.5"
          borderRadius="full"
          border={`1px solid ${t.border}`}
          display={{ base: "none", xl: "flex" }}
        >
          <Icon color={t.accentText} boxSize="3.5">
            <LuClock />
          </Icon>
          <Text
            fontSize="xs"
            color={t.textSecondary}
            fontWeight="500"
            fontFamily="mono"
            minW="60px"
          >
            {formatTime(now)}
          </Text>
        </Flex>

        {/* Environment Indicator */}
        <Flex
          align="center"
          gap="2"
          bg={t.bgInput}
          px="3"
          py="1.5"
          borderRadius="full"
          border={`1px solid ${t.border}`}
        >
          <Icon color={t.success} boxSize="3">
            <LuCircle fill="#10b981" />
          </Icon>
          <Text fontSize="xs" color={t.textSecondary} fontWeight="500">
            Production
          </Text>
        </Flex>

        {/* System Health (animated) */}
        <Flex
          align="center"
          gap="2"
          bg={t.bgInput}
          px="3"
          py="1.5"
          borderRadius="full"
          border={`1px solid ${t.border}`}
          cursor="pointer"
          _hover={{ bg: t.bgHover }}
        >
          <Icon
            color={
              displayHealth >= 95
                ? "#10b981"
                : displayHealth >= 85
                  ? "#f59e0b"
                  : "#ef4444"
            }
            boxSize="3.5"
          >
            <LuActivity />
          </Icon>
          <Text fontSize="xs" color={t.textSecondary} fontWeight="500">
            {displayHealth.toFixed(1)}%
          </Text>
        </Flex>

        {/* Region */}
        <Flex
          align="center"
          gap="1.5"
          bg={t.bgInput}
          px="3"
          py="1.5"
          borderRadius="full"
          border={`1px solid ${t.border}`}
          display={{ base: "none", lg: "flex" }}
        >
          <Icon color={t.textMuted} boxSize="3.5">
            <LuGlobe />
          </Icon>
          <Text fontSize="xs" color={t.textSecondary}>
            us-east-1
          </Text>
        </Flex>

        {/* Search */}
        <Flex
          w="36px"
          h="36px"
          borderRadius="lg"
          bg={t.bgInput}
          align="center"
          justify="center"
          cursor="pointer"
          _hover={{ bg: t.bgHover }}
          border={`1px solid ${t.border}`}
        >
          <Icon color={t.textMuted} boxSize="4">
            <LuSearch />
          </Icon>
        </Flex>

        {/* Theme Toggle */}
        <Flex
          w="36px"
          h="36px"
          borderRadius="lg"
          bg={t.bgInput}
          align="center"
          justify="center"
          cursor="pointer"
          onClick={toggleColorMode}
          _hover={{ bg: t.bgHover }}
          border={`1px solid ${t.border}`}
          transition="all 0.2s"
        >
          <Icon color={isDark ? "#fbbf24" : "#8b5cf6"} boxSize="4">
            {isDark ? <LuSun /> : <LuMoon />}
          </Icon>
        </Flex>

        {/* Notifications */}
        <Box position="relative" ref={notifRef}>
          <Flex
            w="36px"
            h="36px"
            borderRadius="lg"
            bg={showNotifs ? t.bgHover : t.bgInput}
            align="center"
            justify="center"
            cursor="pointer"
            _hover={{ bg: t.bgHover }}
            border={`1px solid ${t.border}`}
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Icon color={t.textMuted} boxSize="4">
              <LuBell />
            </Icon>
          </Flex>
          {/* Notification dot */}
          {unreadCount > 0 && (
            <Flex
              position="absolute"
              top="-4px"
              right="-4px"
              minW="18px"
              h="18px"
              bg="#ef4444"
              borderRadius="full"
              border={`2px solid ${isDark ? "#0c0f1a" : "#ffffff"}`}
              boxShadow="0 0 6px rgba(239, 68, 68, 0.4)"
              align="center"
              justify="center"
            >
              <Text fontSize="9px" color="white" fontWeight="700">
                {unreadCount}
              </Text>
            </Flex>
          )}

          {/* Notification Dropdown */}
          {showNotifs && (
            <Box
              position="absolute"
              top="48px"
              right="0"
              w="380px"
              maxH="440px"
              bg={t.bgCardSolid}
              border={`1px solid ${t.border}`}
              borderRadius="xl"
              boxShadow={
                isDark
                  ? "0 16px 48px rgba(0,0,0,0.5)"
                  : "0 16px 48px rgba(0,0,0,0.12)"
              }
              overflowY="auto"
              zIndex="100"
              animation="slideDown 0.2s ease"
            >
              {/* Header */}
              <Flex
                align="center"
                justify="space-between"
                px="4"
                py="3"
                borderBottom={`1px solid ${t.border}`}
              >
                <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                  Notifications
                </Text>
                {unreadCount > 0 && (
                  <Text
                    fontSize="xs"
                    color={t.accentText}
                    cursor="pointer"
                    fontWeight="600"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => markAllNotificationsRead()}
                  >
                    Mark all read
                  </Text>
                )}
              </Flex>

              {/* Notification Items */}
              <VStack gap="0" align="stretch">
                {notifications.slice(0, 10).map((notif) => {
                  const NotifIcon = NOTIF_ICONS[notif.type] || LuInfo;
                  const notifColor = NOTIF_COLORS[notif.type] || t.accent;
                  return (
                    <Flex
                      key={notif.id}
                      gap="3"
                      px="4"
                      py="3"
                      bg={notif.read ? "transparent" : t.bgSubtle}
                      _hover={{ bg: t.bgHover }}
                      cursor="pointer"
                      borderBottom={`1px solid ${t.borderLight}`}
                      onClick={() => markNotificationRead(notif.id)}
                    >
                      <Flex
                        w="32px"
                        h="32px"
                        borderRadius="lg"
                        bg={`${notifColor}15`}
                        align="center"
                        justify="center"
                        flexShrink="0"
                        mt="0.5"
                      >
                        <Icon color={notifColor} boxSize="4">
                          <NotifIcon />
                        </Icon>
                      </Flex>
                      <Box flex="1">
                        <Flex align="center" gap="2">
                          <Text
                            fontSize="xs"
                            fontWeight="600"
                            color={t.textPrimary}
                          >
                            {notif.title}
                          </Text>
                          {!notif.read && (
                            <Box
                              w="6px"
                              h="6px"
                              borderRadius="full"
                              bg={t.accent}
                            />
                          )}
                        </Flex>
                        <Text
                          fontSize="xs"
                          color={t.textMuted}
                          lineHeight="1.4"
                          mt="0.5"
                        >
                          {notif.message}
                        </Text>
                        <Text fontSize="10px" color={t.textFaint} mt="1">
                          {timeAgo(notif.time)}
                        </Text>
                      </Box>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>
          )}
        </Box>

        {/* Security Status */}
        <Flex
          w="36px"
          h="36px"
          borderRadius="lg"
          bg={t.successBg}
          align="center"
          justify="center"
          border={`1px solid ${t.successBorder}`}
          display={{ base: "none", md: "flex" }}
        >
          <Icon color={t.success} boxSize="4">
            <LuShield />
          </Icon>
        </Flex>

        {/* User Avatar */}
        <Flex align="center" gap="2" cursor="pointer" _hover={{ opacity: 0.8 }}>
          <Flex
            w="34px"
            h="34px"
            borderRadius="full"
            bg="linear-gradient(135deg, #8b5cf6, #14b8a6)"
            align="center"
            justify="center"
            boxShadow="0 0 12px rgba(139, 92, 246, 0.25)"
          >
            <Text fontSize="xs" fontWeight="700" color="white">
              AK
            </Text>
          </Flex>
          <Box display={{ base: "none", lg: "block" }}>
            <Text
              fontSize="xs"
              fontWeight="600"
              color={t.textPrimary}
              lineHeight="1.2"
            >
              Admin
            </Text>
            <Text fontSize="10px" color={t.textMuted}>
              Platform Owner
            </Text>
          </Box>
          <Icon
            color={t.textFaint}
            boxSize="3"
            display={{ base: "none", lg: "block" }}
          >
            <LuChevronDown />
          </Icon>
        </Flex>
      </HStack>
    </Flex>
  );
}
