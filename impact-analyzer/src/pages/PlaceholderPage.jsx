// ═══════════════════════════════════════════════════════════════
// PLACEHOLDER PAGE — Reusable empty state for unbuilt pages
// ═══════════════════════════════════════════════════════════════

import { Flex, Text, Icon, Box } from "@chakra-ui/react";
import { LuConstruction } from "react-icons/lu";
import { useThemeColors } from "../hooks/useThemeColors";

export default function PlaceholderPage({ title, description, icon }) {
  const t = useThemeColors();
  const PageIcon = icon || LuConstruction;

  return (
    <Flex direction="column" align="center" justify="center" h="60vh" gap="4">
      <Flex
        w="64px"
        h="64px"
        borderRadius="2xl"
        bg="rgba(59,130,246,0.08)"
        border={`1px solid ${t.border}`}
        align="center"
        justify="center"
      >
        <Icon color={t.textFaint} boxSize="7">
          <PageIcon />
        </Icon>
      </Flex>
      <Box textAlign="center">
        <Text fontSize="16px" fontWeight="700" color={t.textPrimary} mb="1">
          {title || "Coming Soon"}
        </Text>
        <Text fontSize="13px" color={t.textMuted} maxW="360px">
          {description ||
            "This section is under development. Check back soon for updates."}
        </Text>
      </Box>
    </Flex>
  );
}
