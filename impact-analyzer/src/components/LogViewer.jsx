// ═══════════════════════════════════════════════════════════════
// LOG VIEWER — Streaming log display with monospace font
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Icon, VStack } from "@chakra-ui/react";
import {
  LuInfo,
  LuTriangleAlert,
  LuCircleX,
  LuBug,
  LuScrollText,
} from "react-icons/lu";
import GlassCard from "./shared/GlassCard";
import { useThemeColors } from "../hooks/useThemeColors";
import { useEffect, useRef } from "react";

const LEVEL_CONFIG = {
  info: { color: "#3b82f6", icon: LuInfo },
  warn: { color: "#f59e0b", icon: LuTriangleAlert },
  error: { color: "#ef4444", icon: LuCircleX },
  debug: { color: "#8b5cf6", icon: LuBug },
};

export default function LogViewer({ logs = [] }) {
  const t = useThemeColors();
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  if (logs.length === 0) {
    return (
      <GlassCard>
        <Flex direction="column" align="center" justify="center" py="8" gap="2">
          <Icon color={t.textMuted} boxSize="8">
            <LuScrollText />
          </Icon>
          <Text color={t.textMuted} fontSize="sm">
            No logs yet — run analysis to see output
          </Text>
        </Flex>
      </GlassCard>
    );
  }

  return (
    <GlassCard noPadding>
      <Box px="4" py="3" borderBottom={`1px solid ${t.border}`}>
        <Text
          fontSize="11px"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.08em"
          color={t.textMuted}
        >
          Analysis Logs ({logs.length})
        </Text>
      </Box>
      <Box
        maxH="400px"
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
        <VStack gap="1" align="stretch">
          {logs.map((log, i) => {
            const config = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.info;
            const LogIcon = config.icon;
            const time = new Date(log.timestamp).toLocaleTimeString("en-US", {
              hour12: false,
            });

            return (
              <Flex
                key={log._id || i}
                gap="2"
                align="flex-start"
                py="1.5"
                px="2"
                borderRadius="md"
                _hover={{ bg: t.bgHover }}
                transition="all 0.1s ease"
              >
                <Icon color={config.color} boxSize="3.5" mt="1" flexShrink="0">
                  <LogIcon />
                </Icon>
                <Text
                  fontSize="12px"
                  color={t.textFaint}
                  fontFamily="mono"
                  flexShrink="0"
                  mt="0.5"
                >
                  {time}
                </Text>
                <Text
                  fontSize="11px"
                  color={config.color}
                  fontWeight="600"
                  fontFamily="mono"
                  textTransform="uppercase"
                  flexShrink="0"
                  mt="0.5"
                  w="40px"
                >
                  {log.level}
                </Text>
                <Text
                  fontSize="12px"
                  color={t.textSecondary}
                  fontFamily="mono"
                  wordBreak="break-word"
                >
                  <Text as="span" color={t.textMuted} fontWeight="500" mr="1.5">
                    [{log.stage}]
                  </Text>
                  {log.message}
                </Text>
              </Flex>
            );
          })}
          <div ref={bottomRef} />
        </VStack>
      </Box>
    </GlassCard>
  );
}
