// ═══════════════════════════════════════════════════════════════
// REGISTER PAGE — Professional enterprise registration
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
    LuUser,
    LuEye,
    LuEyeOff,
    LuArrowRight,
    LuShield,
    LuGithub,
    LuLoader,
    LuCheck,
} from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useThemeColors } from "../hooks/useThemeColors";
import { toaster } from "../components/ui/toaster";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const t = useThemeColors();

    // Password strength indicator
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { label: "", color: "", width: "0%" };
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score <= 1) return { label: "Weak", color: "#ef4444", width: "20%" };
        if (score <= 2) return { label: "Fair", color: "#f59e0b", width: "40%" };
        if (score <= 3) return { label: "Good", color: "#3b82f6", width: "60%" };
        if (score <= 4) return { label: "Strong", color: "#10b981", width: "80%" };
        return { label: "Very Strong", color: "#14b8a6", width: "100%" };
    };

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toaster.create({
                title: "Missing fields",
                description: "Please fill in all required fields",
                type: "warning",
            });
            return;
        }

        if (password.length < 6) {
            toaster.create({
                title: "Weak password",
                description: "Password must be at least 6 characters",
                type: "warning",
            });
            return;
        }

        if (password !== confirmPassword) {
            toaster.create({
                title: "Password mismatch",
                description: "Passwords do not match",
                type: "error",
            });
            return;
        }

        setIsLoading(true);
        try {
            await register(name, email, password);
            toaster.create({
                title: "Account created!",
                description: "Welcome to Impact Analyzer",
                type: "success",
            });
            navigate("/dashboard");
        } catch (error) {
            toaster.create({
                title: "Registration failed",
                description:
                    error?.response?.data?.error || "Could not create account",
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
            minH="100vh"
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
                top="-15%"
                right="-10%"
                w="500px"
                h="500px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)"
                filter="blur(60px)"
                animation="float 9s ease-in-out infinite"
                pointerEvents="none"
            />
            <Box
                position="absolute"
                bottom="-20%"
                left="-8%"
                w="450px"
                h="450px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(20, 184, 166, 0.07) 0%, transparent 70%)"
                filter="blur(50px)"
                animation="float 7s ease-in-out infinite reverse"
                pointerEvents="none"
            />
            <Box
                position="absolute"
                top="40%"
                left="20%"
                w="200px"
                h="200px"
                borderRadius="full"
                bg="radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)"
                filter="blur(35px)"
                animation="float 11s ease-in-out infinite"
                pointerEvents="none"
            />

            {/* Register Card */}
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
                    bg="linear-gradient(90deg, #8b5cf6, #14b8a6, #3b82f6)"
                />

                <Box p={{ base: "6", md: "10" }} pt={{ base: "8", md: "12" }}>
                    {/* Brand Header */}
                    <VStack gap="3" mb="6">
                        <Flex
                            w="48px"
                            h="48px"
                            borderRadius="14px"
                            bg="linear-gradient(135deg, #8b5cf6, #14b8a6)"
                            align="center"
                            justify="center"
                            boxShadow="0 0 24px rgba(139, 92, 246, 0.3)"
                        >
                            <Icon color="white" boxSize="6">
                                <LuZap />
                            </Icon>
                        </Flex>
                        <Box textAlign="center">
                            <Text
                                fontSize="xl"
                                fontWeight="800"
                                color={t.textPrimary}
                                letterSpacing="-0.02em"
                            >
                                Create your account
                            </Text>
                            <Text fontSize="sm" color={t.textMuted} mt="1">
                                Get started with Impact Analyzer
                            </Text>
                        </Box>
                    </VStack>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit}>
                        <VStack gap="3.5">
                            {/* Name Field */}
                            <Box w="100%">
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color={t.textSecondary}
                                    mb="1.5"
                                    letterSpacing="0.02em"
                                >
                                    Full name
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
                                        <LuUser />
                                    </Icon>
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        border="none"
                                        outline="none"
                                        bg="transparent"
                                        color={t.textPrimary}
                                        fontSize="sm"
                                        py="2.5"
                                        _placeholder={{ color: t.textFaint }}
                                        _focus={{ boxShadow: "none", outline: "none" }}
                                    />
                                </Flex>
                            </Box>

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
                                        py="2.5"
                                        _placeholder={{ color: t.textFaint }}
                                        _focus={{ boxShadow: "none", outline: "none" }}
                                    />
                                </Flex>
                            </Box>

                            {/* Password Field */}
                            <Box w="100%">
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color={t.textSecondary}
                                    mb="1.5"
                                    letterSpacing="0.02em"
                                >
                                    Password
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
                                        <LuLock />
                                    </Icon>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        border="none"
                                        outline="none"
                                        bg="transparent"
                                        color={t.textPrimary}
                                        fontSize="sm"
                                        py="2.5"
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

                                {/* Password Strength Bar */}
                                {password && (
                                    <Box mt="2">
                                        <Box
                                            w="100%"
                                            h="3px"
                                            bg={t.bgInput}
                                            borderRadius="full"
                                            overflow="hidden"
                                        >
                                            <Box
                                                h="100%"
                                                w={strength.width}
                                                bg={strength.color}
                                                borderRadius="full"
                                                transition="all 0.3s ease"
                                            />
                                        </Box>
                                        <Text fontSize="10px" color={strength.color} mt="1" fontWeight="500">
                                            {strength.label}
                                        </Text>
                                    </Box>
                                )}
                            </Box>

                            {/* Confirm Password Field */}
                            <Box w="100%">
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color={t.textSecondary}
                                    mb="1.5"
                                    letterSpacing="0.02em"
                                >
                                    Confirm password
                                </Text>
                                <Flex
                                    align="center"
                                    bg={t.bgInput}
                                    border={`1px solid ${t.border}`}
                                    borderRadius="xl"
                                    px="3"
                                    transition="all 0.2s"
                                    _focusWithin={{
                                        borderColor:
                                            confirmPassword && confirmPassword === password
                                                ? "#10b981"
                                                : "#14b8a6",
                                        boxShadow:
                                            confirmPassword && confirmPassword === password
                                                ? "0 0 0 3px rgba(16, 185, 129, 0.1)"
                                                : "0 0 0 3px rgba(20, 184, 166, 0.1)",
                                    }}
                                >
                                    <Icon color={t.textFaint} boxSize="4" mr="2">
                                        <LuLock />
                                    </Icon>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Repeat password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        border="none"
                                        outline="none"
                                        bg="transparent"
                                        color={t.textPrimary}
                                        fontSize="sm"
                                        py="2.5"
                                        flex="1"
                                        _placeholder={{ color: t.textFaint }}
                                        _focus={{ boxShadow: "none", outline: "none" }}
                                    />
                                    {confirmPassword && confirmPassword === password && (
                                        <Icon color="#10b981" boxSize="4">
                                            <LuCheck />
                                        </Icon>
                                    )}
                                </Flex>
                            </Box>

                            {/* Submit Button */}
                            <Box
                                as="button"
                                type="submit"
                                w="100%"
                                py="3"
                                mt="1"
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
                                    boxShadow: isLoading
                                        ? "none"
                                        : "0 8px 24px rgba(20, 184, 166, 0.35)",
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
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <Icon boxSize="4">
                                            <LuArrowRight />
                                        </Icon>
                                    </>
                                )}
                            </Box>
                        </VStack>
                    </form>

                    {/* Divider */}
                    <Flex align="center" gap="3" my="5">
                        <Separator flex="1" borderColor={t.border} />
                        <Text
                            fontSize="xs"
                            color={t.textFaint}
                            fontWeight="500"
                            textTransform="uppercase"
                            letterSpacing="0.05em"
                        >
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
                    <VStack gap="3" mt="6">
                        <Text fontSize="sm" color={t.textMuted}>
                            Already have an account?{" "}
                            <Link to="/login">
                                <Text
                                    as="span"
                                    color="#14b8a6"
                                    fontWeight="600"
                                    _hover={{ textDecoration: "underline" }}
                                    cursor="pointer"
                                >
                                    Sign in
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
