// ═══════════════════════════════════════════════════════════════
// GITHUB CALLBACK — Handles OAuth redirect from GitHub
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Flex, Text, Icon, VStack, Spinner } from "@chakra-ui/react";
import { LuGithub, LuCircleCheck, LuCircleX, LuZap } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useThemeColors } from "../hooks/useThemeColors";
import { toaster } from "../components/ui/toaster";

export default function GithubCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithGithub, connectGithub, isAuthenticated } = useAuth();
    const t = useThemeColors();
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [errorMsg, setErrorMsg] = useState("");
    const processedRef = useRef(false);

    useEffect(() => {
        async function handleCallback() {
            // Prevent double execution in StrictMode
            if (processedRef.current) return;
            processedRef.current = true;

            const code = searchParams.get("code");
            const error = searchParams.get("error");
            const isConnect = searchParams.get("connect") === "true";

            if (error) {
                setStatus("error");
                setErrorMsg(
                    error === "access_denied"
                        ? "You denied access to your GitHub account"
                        : "GitHub authentication was cancelled"
                );
                setTimeout(() => navigate(isConnect ? "/settings" : "/login"), 3000);
                return;
            }

            if (!code) {
                setStatus("error");
                setErrorMsg("No authorization code received from GitHub");
                setTimeout(() => navigate(isConnect ? "/settings" : "/login"), 3000);
                return;
            }

            try {
                if (isConnect && isAuthenticated) {
                    // Linking GitHub to existing account from Settings
                    await connectGithub(code);
                    setStatus("success");
                    toaster.create({
                        title: "GitHub Connected!",
                        description: "Your GitHub account has been linked",
                        type: "success",
                    });
                    setTimeout(() => navigate("/settings"), 1500);
                } else {
                    // Normal login/register via GitHub
                    await loginWithGithub(code);
                    setStatus("success");
                    toaster.create({
                        title: "Welcome!",
                        description: "Successfully signed in with GitHub",
                        type: "success",
                    });
                    setTimeout(() => navigate("/dashboard"), 1500);
                }
            } catch (err) {
                setStatus("error");
                setErrorMsg(
                    err?.response?.data?.error || "GitHub authentication failed"
                );
                toaster.create({
                    title: "Authentication failed",
                    description:
                        err?.response?.data?.error || "Could not sign in with GitHub",
                    type: "error",
                });
                setTimeout(() => navigate(isConnect ? "/settings" : "/login"), 3000);
            }
        }

        handleCallback();
    }, [searchParams, loginWithGithub, connectGithub, isAuthenticated, navigate]);

    return (
        <Flex
            w="100vw"
            h="100vh"
            bg={t.bg}
            align="center"
            justify="center"
            position="relative"
            overflow="hidden"
        >
            {/* Background orbs */}
            <Box
                position="absolute"
                top="-20%"
                left="10%"
                w="400px"
                h="400px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(20, 184, 166, 0.06) 0%, transparent 70%)"
                filter="blur(60px)"
                animation="float 8s ease-in-out infinite"
                pointerEvents="none"
            />
            <Box
                position="absolute"
                bottom="-15%"
                right="10%"
                w="350px"
                h="350px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)"
                filter="blur(50px)"
                animation="float 10s ease-in-out infinite reverse"
                pointerEvents="none"
            />

            {/* Callback Card */}
            <Box
                w="100%"
                maxW="400px"
                mx="4"
                bg={t.bgCard}
                backdropFilter="blur(24px)"
                border={`1px solid ${t.border}`}
                borderRadius="2xl"
                boxShadow={t.cardShadow}
                position="relative"
                overflow="hidden"
                animation="fadeInScale 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards"
            >
                {/* Top accent */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="2px"
                    bg={
                        status === "success"
                            ? "linear-gradient(90deg, #10b981, #14b8a6)"
                            : status === "error"
                                ? "linear-gradient(90deg, #ef4444, #f59e0b)"
                                : "linear-gradient(90deg, #14b8a6, #8b5cf6, #3b82f6)"
                    }
                />

                <Box p={{ base: "8", md: "12" }}>
                    <VStack gap="5">
                        {/* Icon */}
                        <Flex
                            w="64px"
                            h="64px"
                            borderRadius="20px"
                            bg={
                                status === "success"
                                    ? "rgba(16, 185, 129, 0.1)"
                                    : status === "error"
                                        ? "rgba(239, 68, 68, 0.1)"
                                        : "linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(139, 92, 246, 0.1))"
                            }
                            border={`1px solid ${status === "success"
                                ? "rgba(16, 185, 129, 0.2)"
                                : status === "error"
                                    ? "rgba(239, 68, 68, 0.2)"
                                    : t.border
                                }`}
                            align="center"
                            justify="center"
                        >
                            {status === "loading" && (
                                <Spinner size="lg" color="#14b8a6" borderWidth="3px" />
                            )}
                            {status === "success" && (
                                <Icon color="#10b981" boxSize="8">
                                    <LuCircleCheck />
                                </Icon>
                            )}
                            {status === "error" && (
                                <Icon color="#ef4444" boxSize="8">
                                    <LuCircleX />
                                </Icon>
                            )}
                        </Flex>

                        {/* Text */}
                        <VStack gap="2">
                            <Text
                                fontSize="lg"
                                fontWeight="800"
                                color={t.textPrimary}
                                letterSpacing="-0.02em"
                            >
                                {status === "loading" && "Authenticating..."}
                                {status === "success" && "Welcome!"}
                                {status === "error" && "Authentication Failed"}
                            </Text>
                            <Text
                                fontSize="sm"
                                color={t.textMuted}
                                textAlign="center"
                                maxW="280px"
                            >
                                {status === "loading" &&
                                    "Verifying your GitHub credentials..."}
                                {status === "success" &&
                                    "Successfully signed in. Redirecting to dashboard..."}
                                {status === "error" && (errorMsg || "Something went wrong")}
                            </Text>
                        </VStack>

                        {/* GitHub indicator */}
                        <Flex
                            align="center"
                            gap="2"
                            bg={t.bgInput}
                            px="4"
                            py="2"
                            borderRadius="full"
                            border={`1px solid ${t.border}`}
                        >
                            <Icon color={t.textMuted} boxSize="4">
                                <LuGithub />
                            </Icon>
                            <Text fontSize="xs" color={t.textSecondary} fontWeight="500">
                                GitHub OAuth
                            </Text>
                        </Flex>
                    </VStack>
                </Box>
            </Box>
        </Flex>
    );
}
