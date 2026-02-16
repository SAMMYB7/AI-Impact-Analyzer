// ═══════════════════════════════════════════════════════════════
// STAT CARD — Professional metric card with Chakra Stat + ProgressCircle
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Icon, Card, HStack, Badge } from "@chakra-ui/react";
import { useAnimatedCounter } from "../../hooks/useAnimatedCounter";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function StatCard({
  label,
  value,
  suffix = "",
  prefix = "",
  icon,
  iconColor = "#14b8a6",
  trend,
  trendValue,
  isInteger = true,
}) {
  const animatedValue = useAnimatedCounter(
    typeof value === "number" ? value : 0,
    1200,
  );
  const t = useThemeColors();
  const displayValue =
    typeof value === "number"
      ? isInteger
        ? Math.round(animatedValue)
        : animatedValue.toFixed(1)
      : value;

  return (
    <Card.Root
      bg={t.bgCard}
      backdropFilter={t.backdropBlur}
      border={`1px solid ${t.border}`}
      borderRadius="xl"
      overflow="hidden"
      boxShadow={t.cardShadow}
      transition="all 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
      position="relative"
      _hover={{
        borderColor: t.borderAccent,
        transform: "translateY(-2px)",
        boxShadow: `0 8px 32px ${iconColor}12`,
      }}
    >
      <Card.Body p="4">
        {/* Subtle accent line at top */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          h="1px"
          bg={`linear-gradient(90deg, transparent, ${iconColor}40, transparent)`}
        />

        <Flex justify="space-between" align="flex-start" mb="3">
          <Box>
            <Text
              fontSize="11px"
              color={t.textMuted}
              fontWeight="500"
              textTransform="uppercase"
              letterSpacing="0.08em"
              mb="1.5"
            >
              {label}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="800"
              color={t.textPrimary}
              lineHeight="1"
              letterSpacing="-0.02em"
              style={{ animation: "countUp 0.6s ease-out" }}
            >
              {prefix}
              {displayValue}
              {suffix}
            </Text>
          </Box>
          {icon && (
            <Flex
              w="38px"
              h="38px"
              borderRadius="lg"
              bg={`${iconColor}10`}
              border={`1px solid ${iconColor}20`}
              align="center"
              justify="center"
              flexShrink="0"
            >
              <Icon color={iconColor} boxSize="4.5">
                {icon}
              </Icon>
            </Flex>
          )}
        </Flex>

        {trend && (
          <HStack gap="1.5">
            <Badge
              size="xs"
              variant="subtle"
              bg={trend === "up" ? t.successBg : t.errorBg}
              color={trend === "up" ? t.success : t.error}
              borderRadius="md"
              px="1.5"
              py="0.5"
              fontSize="10px"
              fontWeight="700"
            >
              {trend === "up" ? "↑" : "↓"} {trendValue}
            </Badge>
            <Text fontSize="10px" color={t.textFaint} fontWeight="400">
              vs last week
            </Text>
          </HStack>
        )}
      </Card.Body>
    </Card.Root>
  );
}
