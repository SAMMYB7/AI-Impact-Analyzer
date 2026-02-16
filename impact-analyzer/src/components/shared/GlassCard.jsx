// ═══════════════════════════════════════════════════════════════
// GLASS CARD — Professional card with Chakra Card.Root + glassmorphism
// ═══════════════════════════════════════════════════════════════

import { Card } from "@chakra-ui/react";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function GlassCard({
  children,
  hover = false,
  glow = null,
  noPadding = false,
  ...props
}) {
  const t = useThemeColors();

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
      _hover={
        hover
          ? {
              borderColor: t.borderAccent,
              transform: "translateY(-2px)",
              boxShadow: glow ? `0 8px 32px ${glow}` : t.cardHoverShadow,
            }
          : {}
      }
      {...props}
    >
      <Card.Body p={noPadding ? "0" : "5"}>{children}</Card.Body>
    </Card.Root>
  );
}
