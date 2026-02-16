// ═══════════════════════════════════════════════════════════════
// MAIN LAYOUT — Sidebar + TopNavbar + Content Area (theme-aware)
// ═══════════════════════════════════════════════════════════════

import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function MainLayout() {
  const t = useThemeColors();

  return (
    <Flex h="100vh" bg={t.bg}>
      <Sidebar />
      <Box
        flex="1"
        minW="0"
        display="flex"
        flexDirection="column"
        h="100vh"
        overflow="hidden"
      >
        <TopNavbar />
        <Box
          flex="1"
          p="6"
          overflowY="auto"
          overflowX="hidden"
          css={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { bg: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              bg: t.scrollThumb,
              borderRadius: "3px",
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
