import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    Box,
    Flex,
    Text,
    Icon,
    VStack,
    Input,
} from "@chakra-ui/react";
import {
    LuLock,
    LuEye,
    LuEyeOff,
    LuArrowRight,
    LuLoader,
} from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useThemeColors } from "../hooks/useThemeColors";
import { toaster } from "../components/ui/toaster";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const t = useThemeColors();

    useEffect(() => {
        if (!token) {
            toaster.create({
                title: "Invalid request",
                description: "Password reset token is missing",
                type: "error",
            });
            navigate("/login");
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            toaster.create({
                title: "Missing fields",
                description: "Please fill in all fields",
                type: "warning",
            });
            return;
        }

        if (password !== confirmPassword) {
            toaster.create({
                title: "Passwords do not match",
                description: "Both password fields must match exactly",
                type: "error",
            });
            return;
        }

        if (password.length < 6) {
            toaster.create({
                title: "Password too short",
                description: "Password must be at least 6 characters",
                type: "warning",
            });
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password);
            toaster.create({
                title: "Success",
                description: "Your password has been reset successfully. You are now logged in.",
                type: "success",
            });
            navigate("/dashboard");
        } catch (error) {
            toaster.create({
                title: "Reset failed",
                description: error?.response?.data?.error || "Invalid or expired token",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
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
                                Set New Password
                            </Text>
                            <Text fontSize="sm" color={t.textMuted} mt="1">
                                Your new password must be at least 6 characters.
                            </Text>
                        </Box>
                    </VStack>

                    <form onSubmit={handleSubmit}>
                        <VStack gap="4">
                            {/* Password Field */}
                            <Box w="100%">
                                <Text
                                    fontSize="xs"
                                    fontWeight="600"
                                    color={t.textSecondary}
                                    mb="1.5"
                                    letterSpacing="0.02em"
                                >
                                    New password
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
                                        borderColor: "#14b8a6",
                                        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
                                    }}
                                >
                                    <Icon color={t.textFaint} boxSize="4" mr="2">
                                        <LuLock />
                                    </Icon>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        Saving...
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
                </Box>
            </Box>
        </Flex>
    );
}
