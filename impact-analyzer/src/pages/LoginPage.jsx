// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE — Professional enterprise login with GitHub OAuth
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    Flex,
    Text,
    Icon,
    VStack,
    Input,
    Separator,
} from "@chakra-ui/react";
import {
    LuZap,
    LuMail,
    LuLock,
    LuEye,
    LuEyeOff,
    LuArrowRight,
    LuShield,
    LuGithub,
    LuLoader,
} from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useThemeColors } from "../hooks/useThemeColors";
import { toaster } from "../components/ui/toaster";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const t = useThemeColors();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toaster.create({
                title: "Missing fields",
                description: "Please enter both email and password",
                type: "warning",
            });
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            toaster.create({
                title: "Welcome back!",
                description: "Successfully signed in",
                type: "success",
            });
            navigate("/dashboard");
        } catch (error) {
            toaster.create({
                title: "Login failed",
                description: error?.response?.data?.error || "Invalid credentials",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitHubLogin = () => {
        if (!GITHUB_CLIENT_ID) {
            toaster.create({
                title: "GitHub OAuth not configured",
                description: "Please set VITE_GITHUB_CLIENT_ID in your .env file",
                type: "error",
            });
            return;
        }
        const redirectUri = `${window.location.origin}/auth/github/callback`;
        const scope = "user:email read:user";
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = githubUrl;
    };

    return (
        <Flex
            w="100%"
            minH="80vh"
            align="center"
            justify="center"
            position="relative"
            overflow="hidden"
            pt="28"
            pb="16"
        >
            {/* Animated background orbs */}
            <Box
                position="absolute"
                top="-20%"
                left="-10%"
                w="500px"
                h="500px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)"
                filter="blur(60px)"
                animation="float 8s ease-in-out infinite"
                pointerEvents="none"
            />
            <Box
                position="absolute"
                bottom="-15%"
                right="-5%"
                w="400px"
                h="400px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)"
                filter="blur(50px)"
                animation="float 10s ease-in-out infinite reverse"
                pointerEvents="none"
            />
            <Box
                position="absolute"
                top="30%"
                right="15%"
                w="250px"
                h="250px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)"
                filter="blur(40px)"
                animation="float 6s ease-in-out infinite"
                pointerEvents="none"
            />

            {/* Login Card */}
            <Box
                w="100%"
                maxW="440px"
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
                {/* Top accent line */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="2px"
                    bg="linear-gradient(90deg, #14b8a6, #8b5cf6, #3b82f6)"
                />

                <Box p={{ base: "6", md: "10" }} pt={{ base: "8", md: "12" }}>
                    {/* Brand Header */}
                    <VStack gap="3" mb="8">

                        <Box textAlign="center">
                            <Text
                                fontSize="xl"
                                fontWeight="800"
                                color={t.textPrimary}
                                letterSpacing="-0.02em"
                            >
                                Welcome back
                            </Text>
                            <Text fontSize="sm" color={t.textMuted} mt="1">
                                Sign in to Impact Analyzer
                            </Text>
                        </Box>
                    </VStack>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        <VStack gap="4">
                            {/* Email Field */}
                            <Box w="100%">
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color={t.textSecondary}
                                    mb="1.5"
                                    letterSpacing="0.02em"
                                >
                                    Email address
                                </Text>
                                <Flex
                                    align="center"
                                    bg={t.bgInput}
                                    border={`1px solid ${t.border}`}
                                    borderRadius="xl"
                                    px="3"
                                    transition="all 0.2s"
                                    _focusWithin={{
                                        borderColor: "#14b8a6",
                                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                                    }}
                                >
                                    <Icon color={t.textFaint} boxSize="4" mr="2">
                                        <LuMail />
                                    </Icon>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        border="none"
                                        outline="none"
                                        bg="transparent"
                                        color={t.textPrimary}
                                        fontSize="sm"
                                        py="3"
                                        _placeholder={{ color: t.textFaint }}
                                        _focus={{ boxShadow: "none", outline: "none" }}
                                    />
                                </Flex>
                            </Box>

                            {/* Password Field */}
                            <Box w="100%">
                                <Flex justify="space-between" mb="1.5">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="600"
                                        color={t.textSecondary}
                                        letterSpacing="0.02em"
                                    >
                                        Password
                                    </Text>
                                    <Link to="/forgot-password">
                                        <Text
                                            fontSize="xs"
                                            color="#14b8a6"
                                            fontWeight="500"
                                            _hover={{ textDecoration: "underline" }}
                                            cursor="pointer"
                                        >
                                            Forgot password?
                                        </Text>
                                    </Link>
                                </Flex>
                                <Flex
                                    align="center"
                                    bg={t.bgInput}
                                    border={`1px solid ${t.border}`}
                                    borderRadius="xl"
                                    px="3"
                                    transition="all 0.2s"
                                    _focusWithin={{
                                        borderColor: "#14b8a6",
                                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                                    }}
                                >
                                    <Icon color={t.textFaint} boxSize="4" mr="2">
                                        <LuLock />
                                    </Icon>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        border="none"
                                        outline="none"
                                        bg="transparent"
                                        color={t.textPrimary}
                                        fontSize="sm"
                                        py="3"
                                        flex="1"
                                        _placeholder={{ color: t.textFaint }}
                                        _focus={{ boxShadow: "none", outline: "none" }}
                                    />
                                    <Icon
                                        color={t.textFaint}
                                        boxSize="4"
                                        cursor="pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                        _hover={{ color: t.textSecondary }}
                                        transition="color 0.2s"
                                    >
                                        {showPassword ? <LuEyeOff /> : <LuEye />}
                                    </Icon>
                                </Flex>
                            </Box>

                            {/* Submit Button */}
                            <Box
                                as="button"
                                type="submit"
                                w="100%"
                                py="3"
                                mt="2"
                                bg="linear-gradient(135deg, #14b8a6, #0d9488)"
                                color="white"
                                borderRadius="xl"
                                fontSize="sm"
                                fontWeight="700"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                gap="2"
                                cursor={isLoading ? "not-allowed" : "pointer"}
                                opacity={isLoading ? 0.7 : 1}
                                transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                                _hover={{
                                    transform: isLoading ? "none" : "translateY(-1px)",
                                    boxShadow: isLoading ? "none" : "0 8px 24px rgba(20, 184, 166, 0.35)",
                                }}
                                _active={{ transform: "translateY(0)" }}
                                border="none"
                                letterSpacing="0.02em"
                            >
                                {isLoading ? (
                                    <>
                                        <Icon boxSize="4" animation="spin 1s linear infinite">
                                            <LuLoader />
                                        </Icon>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <Icon boxSize="4">
                                            <LuArrowRight />
                                        </Icon>
                                    </>
                                )}
                            </Box>
                        </VStack>
                    </form>

                    {/* Divider */}
                    <Flex align="center" gap="3" my="6">
                        <Separator flex="1" borderColor={t.border} />
                        <Text fontSize="xs" color={t.textFaint} fontWeight="500" textTransform="uppercase" letterSpacing="0.05em">
                            or
                        </Text>
                        <Separator flex="1" borderColor={t.border} />
                    </Flex>

                    {/* GitHub OAuth Button */}
                    <Box
                        as="button"
                        w="100%"
                        py="3"
                        px="4"
                        bg={t.bgInput}
                        border={`1px solid ${t.border}`}
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="3"
                        cursor="pointer"
                        transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                        _hover={{
                            bg: t.bgHover,
                            borderColor: t.borderAccent,
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        }}
                        _active={{ transform: "translateY(0)" }}
                        onClick={handleGitHubLogin}
                    >
                        <Icon boxSize="5" color={t.textPrimary}>
                            <LuGithub />
                        </Icon>
                        <Text fontSize="sm" fontWeight="600" color={t.textPrimary}>
                            Continue with GitHub
                        </Text>
                    </Box>

                    {/* Footer */}
                    <VStack gap="4" mt="8">
                        <Text fontSize="sm" color={t.textMuted}>
                            Don&apos;t have an account?{" "}
                            <Link to="/register">
                                <Text
                                    as="span"
                                    color="#14b8a6"
                                    fontWeight="600"
                                    _hover={{ textDecoration: "underline" }}
                                    cursor="pointer"
                                >
                                    Create account
                                </Text>
                            </Link>
                        </Text>

                        <Flex align="center" gap="1.5" opacity="0.6">
                            <Icon color={t.textFaint} boxSize="3">
                                <LuShield />
                            </Icon>
                            <Text fontSize="10px" color={t.textFaint} fontWeight="500">
                                Secured with 256-bit encryption
                            </Text>
                        </Flex>
                    </VStack>
                </Box>
            </Box>
        </Flex>
    );
}
