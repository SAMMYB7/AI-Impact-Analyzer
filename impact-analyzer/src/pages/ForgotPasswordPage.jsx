import { useState } from "react";
import { Link } from "react-router-dom";
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
    LuMail,
    LuArrowRight,
    LuLoader,
    LuArrowLeft,
    LuGithub,
} from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useThemeColors } from "../hooks/useThemeColors";
import { toaster } from "../components/ui/toaster";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { forgotPassword } = useAuth();
    const t = useThemeColors();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toaster.create({
                title: "Missing field",
                description: "Please enter your email",
                type: "warning",
            });
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword(email);
            setIsSent(true);
            toaster.create({
                title: "Email sent",
                description: "Check your inbox for password reset instructions",
                type: "success",
            });
        } catch (error) {
            toaster.create({
                title: "Request failed",
                description: error?.response?.data?.error || "Failed to send reset email",
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

            {/* Form Card */}
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
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="2px"
                    bg="linear-gradient(90deg, #14b8a6, #8b5cf6, #3b82f6)"
                />

                <Box p={{ base: "6", md: "10" }} pt={{ base: "8", md: "12" }}>
                    <VStack gap="3" mb="8">
                        <Box textAlign="center">
                            <Text
                                fontSize="xl"
                                fontWeight="800"
                                color={t.textPrimary}
                                letterSpacing="-0.02em"
                            >
                                Forgot Password?
                            </Text>
                            <Text fontSize="sm" color={t.textMuted} mt="1">
                                No worries, we'll send you reset instructions.
                            </Text>
                        </Box>
                    </VStack>

                    {!isSent ? (
                        <form onSubmit={handleSubmit}>
                            <VStack gap="4">
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
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Reset password
                                            <Icon boxSize="4">
                                                <LuArrowRight />
                                            </Icon>
                                        </>
                                    )}
                                </Box>
                            </VStack>
                        </form>
                    ) : (
                        <Box textAlign="center" py="4">
                            <Text fontSize="sm" color={t.textPrimary} mb="4">
                                We've sent password reset instructions to <strong>{email}</strong>.
                            </Text>
                            <Box
                                as="button"
                                onClick={() => setIsSent(false)}
                                w="100%"
                                py="3"
                                bg={t.bgInput}
                                border={`1px solid ${t.border}`}
                                color={t.textPrimary}
                                borderRadius="xl"
                                fontSize="sm"
                                fontWeight="600"
                                cursor="pointer"
                                _hover={{ bg: t.bgHover }}
                            >
                                Try another email
                            </Box>
                        </Box>
                    )}

                    {/* Divider */}
                    <Flex align="center" gap="3" my="6">
                        <Separator flex="1" borderColor={t.border} />
                        <Text fontSize="xs" color={t.textFaint} fontWeight="500" textTransform="uppercase" letterSpacing="0.05em">
                            or sign in with
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

                    <Box mt="8" textAlign="center">
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Icon boxSize="4" color="#14b8a6">
                                <LuArrowLeft />
                            </Icon>
                            <Text
                                fontSize="sm"
                                color="#14b8a6"
                                fontWeight="600"
                                _hover={{ textDecoration: "underline" }}
                            >
                                Back to log in
                            </Text>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
}
