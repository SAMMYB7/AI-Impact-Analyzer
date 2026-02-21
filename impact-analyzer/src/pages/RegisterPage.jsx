// ═══════════════════════════════════════════════════════════════
// REGISTER PAGE — OTP-based registration
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    Flex,
    Text,
    Icon,
    VStack,
    HStack,
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
    LuChevronLeft,
} from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useThemeColors } from "../hooks/useThemeColors";
import { toaster } from "../components/ui/toaster";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export default function RegisterPage() {
    // Phase 1: Registration info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Phase 2: OTP Verification
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(0);
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    const [isLoading, setIsLoading] = useState(false);
    const { register, verifyOTP, resendOTP } = useAuth();
    const navigate = useNavigate();
    const t = useThemeColors();

    // Reset countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            otpRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!name || !email || !password) {
            toaster.create({ title: "Missing fields", type: "warning" });
            return;
        }

        if (password.length < 6) {
            toaster.create({ title: "Weak password", description: "At least 6 characters", type: "warning" });
            return;
        }

        if (password !== confirmPassword) {
            toaster.create({ title: "Mismatch", description: "Passwords don't match", type: "error" });
            return;
        }

        setIsLoading(true);
        try {
            await register(name, email, password);
            setShowOTP(true);
            setCountdown(60);
            toaster.create({
                title: "Code sent!",
                description: `Check your email: ${email}`,
                type: "success",
            });
        } catch (error) {
            toaster.create({
                title: "Failed",
                description: error?.response?.data?.error || "Registration failed",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join("");
        if (otpString.length < 6) {
            toaster.create({ title: "Invalid code", description: "Enter 6 digits", type: "warning" });
            return;
        }

        setIsLoading(true);
        try {
            await verifyOTP(email, otpString);
            toaster.create({ title: "Success!", description: "Account verified", type: "success" });
            navigate("/dashboard");
        } catch (error) {
            toaster.create({
                title: "Wrong code",
                description: error?.response?.data?.error || "Verification failed",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setIsLoading(true);
        try {
            await resendOTP(email);
            setCountdown(60);
            setOtp(["", "", "", "", "", ""]);
            toaster.create({ title: "Code Resent", type: "success" });
        } catch (error) {
            toaster.create({ title: "Failed to resend", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitHubLogin = () => {
        if (!GITHUB_CLIENT_ID) {
            toaster.create({ title: "GitHub OAuth not configured", type: "error" });
            return;
        }
        const redirectUri = `${window.location.origin}/auth/github/callback`;
        const scope = "user:email read:user";
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = githubUrl;
    };

    return (
        <Flex w="100%" minH="100vh" align="center" justify="center" position="relative" overflow="hidden" pt="28" pb="16">
            {/* Background Orbs */}
            <Box position="absolute" top="-15%" right="-10%" w="500px" h="500px" borderRadius="full"
                bg="radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)" filter="blur(60px)" animation="float 9s ease-in-out infinite" pointerEvents="none" />
            <Box position="absolute" bottom="-20%" left="-8%" w="450px" h="450px" borderRadius="full"
                bg="radial-gradient(circle, rgba(20, 184, 166, 0.07) 0%, transparent 70%)" filter="blur(50px)" animation="float 7s ease-in-out infinite reverse" pointerEvents="none" />

            {/* Main Card */}
            <Box w="100%" maxW="440px" mx="4" bg={t.bgCard} backdropFilter="blur(24px)" border={`1px solid ${t.border}`} borderRadius="2xl" boxShadow={t.cardShadow} position="relative" overflow="hidden" animation="fadeInScale 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards">
                <Box position="absolute" top="0" left="0" right="0" h="2px" bg="linear-gradient(90deg, #8b5cf6, #14b8a6, #3b82f6)" />
                <Box p={{ base: "8", md: "10" }}>

                    {!showOTP ? (
                        <>
                            {/* Registration Phase */}
                            <VStack gap="2" mb="8" textAlign="center">
                                <Flex w="48px" h="48px" borderRadius="14px" bg="linear-gradient(135deg, #8b5cf6, #14b8a6)" align="center" justify="center" boxShadow="0 0 24px rgba(139, 92, 246, 0.3)">
                                    <Icon color="white" boxSize="6"><LuZap /></Icon>
                                </Flex>
                                <Text fontSize="xl" fontWeight="800" color={t.textPrimary}>Create account</Text>
                                <Text fontSize="sm" color={t.textMuted}>Get started with Impact Analyzer</Text>
                            </VStack>

                            <form onSubmit={handleSubmit}>
                                <VStack gap="3.5">
                                    <Box w="100%">
                                        <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="1.5">Full name</Text>
                                        <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" _focusWithin={{ borderColor: "#14b8a6" }}>
                                            <Icon color={t.textFaint} boxSize="4" mr="2"><LuUser /></Icon>
                                            <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} border="none" bg="transparent" fontSize="sm" py="2.5" color={t.textPrimary} outline="none" />
                                        </Flex>
                                    </Box>

                                    <Box w="100%">
                                        <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="1.5">Email address</Text>
                                        <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" _focusWithin={{ borderColor: "#14b8a6" }}>
                                            <Icon color={t.textFaint} boxSize="4" mr="2"><LuMail /></Icon>
                                            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} border="none" bg="transparent" fontSize="sm" py="2.5" color={t.textPrimary} outline="none" />
                                        </Flex>
                                    </Box>

                                    <Box w="100%">
                                        <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="1.5">Password</Text>
                                        <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" _focusWithin={{ borderColor: "#14b8a6" }}>
                                            <Icon color={t.textFaint} boxSize="4" mr="2"><LuLock /></Icon>
                                            <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 chars" value={password} onChange={(e) => setPassword(e.target.value)} border="none" bg="transparent" fontSize="sm" py="2.5" color={t.textPrimary} flex="1" outline="none" />
                                            <Icon color={t.textFaint} boxSize="4" cursor="pointer" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <LuEyeOff /> : <LuEye />}</Icon>
                                        </Flex>
                                    </Box>

                                    <Box w="100%">
                                        <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="1.5">Confirm password</Text>
                                        <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" _focusWithin={{ borderColor: "#14b8a6" }}>
                                            <Icon color={t.textFaint} boxSize="4" mr="2"><LuLock /></Icon>
                                            <Input type={showPassword ? "text" : "password"} placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} border="none" bg="transparent" fontSize="sm" py="2.5" color={t.textPrimary} outline="none" />
                                            {confirmPassword && confirmPassword === password && <Icon color="#10b981" boxSize="4"><LuCheck /></Icon>}
                                        </Flex>
                                    </Box>

                                    <Box as="button" type="submit" w="100%" py="3" mt="2" bg="linear-gradient(135deg, #14b8a6, #0d9488)" color="white" borderRadius="xl" fontSize="sm" fontWeight="700" display="flex" alignItems="center" justifyContent="center" gap="2" cursor={isLoading ? "not-allowed" : "pointer"} opacity={isLoading ? 0.7 : 1} transition="all 0.2s" _hover={{ transform: "translateY(-1px)", boxShadow: "0 8px 24px rgba(20, 184, 166, 0.35)" }}>
                                        {isLoading ? <Icon boxSize="4" animation="spin 1s linear infinite"><LuLoader /></Icon> : <Text>Create account</Text>}
                                        <Icon boxSize="4"><LuArrowRight /></Icon>
                                    </Box>
                                </VStack>
                            </form>

                            <Flex align="center" gap="3" my="6">
                                <Separator flex="1" borderColor={t.border} />
                                <Text fontSize="xs" color={t.textFaint} fontWeight="500">OR</Text>
                                <Separator flex="1" borderColor={t.border} />
                            </Flex>

                            <Box as="button" w="100%" py="3" bg={t.bgInput} borderRadius="xl" display="flex" alignItems="center" justifyContent="center" gap="3" cursor="pointer" _hover={{ bg: t.bgHover, transform: "translateY(-1px)" }} onClick={handleGitHubLogin} border="none">
                                <Icon boxSize="5" color={t.textPrimary}><LuGithub /></Icon>
                                <Text fontSize="sm" fontWeight="600" color={t.textPrimary}>Continue with GitHub</Text>
                            </Box>
                        </>
                    ) : (
                        <>
                            {/* OTP Verification Phase */}
                            <VStack gap="4" mb="8" textAlign="center">
                                <HStack w="100%" justify="space-between">
                                    <Icon boxSize="5" color={t.textSecondary} cursor="pointer" onClick={() => setShowOTP(false)} _hover={{ color: t.textPrimary }}><LuChevronLeft /></Icon>
                                    <Box flex="1" />
                                </HStack>
                                <Flex w="48px" h="48px" borderRadius="14px" bg="rgba(20, 184, 166, 0.1)" border="1px solid rgba(20, 184, 166, 0.2)" align="center" justify="center">
                                    <Icon color="#14b8a6" boxSize="6"><LuMail /></Icon>
                                </Flex>
                                <Text fontSize="xl" fontWeight="800" color={t.textPrimary}>Check your email</Text>
                                <Text fontSize="sm" color={t.textMuted} lineHeight="1.6">
                                    We sent a 6-digit code to <Text as="span" color={t.textPrimary} fontWeight="600">{email}</Text>. Enter it below to verify.
                                </Text>
                            </VStack>

                            <VStack gap="6">
                                <HStack gap="2.5" justify="center">
                                    {otp.map((digit, i) => (
                                        <Input key={i} ref={otpRefs[i]} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
                                            w="48px" h="56px" textAlign="center" fontSize="xl" fontWeight="700" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" color={t.textPrimary}
                                            _focus={{ borderColor: "#14b8a6", boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)" }} />
                                    ))}
                                </HStack>

                                <Box as="button" onClick={handleVerifyOTP} w="100%" py="3" bg="linear-gradient(135deg, #14b8a6, #0d9488)" color="white" borderRadius="xl" fontSize="sm" fontWeight="700" display="flex" alignItems="center" justifyContent="center" gap="2" cursor={isLoading ? "not-allowed" : "pointer"} opacity={isLoading ? 0.7 : 1} transition="all 0.2s">
                                    {isLoading ? <Icon boxSize="4" animation="spin 1s linear infinite"><LuLoader /></Icon> : <Text>Verify account</Text>}
                                </Box>

                                <VStack gap="2">
                                    <Text fontSize="sm" color={t.textMuted}>Didn't receive the email?</Text>
                                    <Text fontSize="sm" fontWeight="600" color={countdown > 0 ? t.textFaint : "#14b8a6"} cursor={countdown > 0 ? "default" : "pointer"} onClick={handleResend} _hover={countdown > 0 ? {} : { textDecoration: "underline" }}>
                                        {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
                                    </Text>
                                </VStack>
                            </VStack>
                        </>
                    )}

                    <VStack gap="3" mt="8">
                        {!showOTP && (
                            <Text fontSize="sm" color={t.textMuted}>
                                Already have an account? <Link to="/login"><Text as="span" color="#14b8a6" fontWeight="600">Sign in</Text></Link>
                            </Text>
                        )}
                        <Flex align="center" gap="1.5" opacity="0.6">
                            <Icon color={t.textFaint} boxSize="3"><LuShield /></Icon>
                            <Text fontSize="10px" color={t.textFaint} fontWeight="500">Secured with 256-bit encryption</Text>
                        </Flex>
                    </VStack>
                </Box>
            </Box>
        </Flex>
    );
}
