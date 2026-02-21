// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTE — Redirect unauthenticated users to login
// ═══════════════════════════════════════════════════════════════

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();
    const t = useThemeColors();

    if (loading) {
        return (
            <Flex
                w="100vw"
                h="100vh"
                align="center"
                justify="center"
                bg={t.bg}
                direction="column"
                gap="4"
            >
                <Spinner
                    size="xl"
                    color="#14b8a6"
                    borderWidth="3px"
                />
                <Text fontSize="sm" color={t.textMuted} fontWeight="500">
                    Verifying authentication...
                </Text>
            </Flex>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
