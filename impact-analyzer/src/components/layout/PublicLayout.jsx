// ═══════════════════════════════════════════════════════════════
// PUBLIC LAYOUT — Navbar + Content + Footer for public pages
// ═══════════════════════════════════════════════════════════════

import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function PublicLayout() {
    const t = useThemeColors();

    return (
        <Box
            data-public-scroll
            h="100vh"
            bg={t.bg}
            display="flex"
            flexDirection="column"
            overflowY="auto"
            overflowX="hidden"
            css={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "3px",
                },
            }}
        >
            <PublicNavbar />
            <Box flex="1 0 auto">
                <Outlet />
            </Box>
            <Box flexShrink="0" w="100%">
                <PublicFooter />
            </Box>
        </Box>
    );
}
