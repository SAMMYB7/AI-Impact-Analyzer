// ═══════════════════════════════════════════════════════════════
// PUBLIC NAVBAR — Floating pill navbar inspired by modern SaaS
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Icon, HStack } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { LuZap, LuArrowRight, LuSun, LuMoon } from "react-icons/lu";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useColorMode } from "../ui/color-mode";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
    { path: "/", label: "Home" },
    { path: "/#features", label: "Features", isHash: true },
    { path: "/#how-it-works", label: "How It Works", isHash: true },
];

export default function PublicNavbar() {
    const t = useThemeColors();
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const parent = document.querySelector("[data-public-scroll]");
        if (!parent) return;
        const handleScroll = () => setScrolled(parent.scrollTop > 20);
        parent.addEventListener("scroll", handleScroll);
        return () => parent.removeEventListener("scroll", handleScroll);
    }, []);

    const handleHashClick = (hash) => {
        const id = hash.replace("/#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box
            as="nav"
            position="fixed"
            top="0"
            left="0"
            right="0"
            zIndex="50"
            px="4"
            pt={scrolled ? "2" : "4"}
            transition="padding 0.3s ease"
            pointerEvents="none"
        >
            <Flex
                maxW="820px"
                mx="auto"
                px="2"
                py="1.5"
                align="center"
                justify="space-between"
                bg={
                    scrolled
                        ? isDark
                            ? "rgba(10, 14, 26, 0.88)"
                            : "rgba(255, 255, 255, 0.88)"
                        : isDark
                            ? "rgba(10, 14, 26, 0.5)"
                            : "rgba(255, 255, 255, 0.5)"
                }
                backdropFilter="blur(24px)"
                border={`1px solid ${scrolled ? t.border : isDark ? "rgba(148, 163, 184, 0.05)" : "rgba(100, 116, 139, 0.08)"}`}
                borderRadius="full"
                boxShadow={
                    scrolled
                        ? isDark
                            ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                            : "0 8px 32px rgba(0, 0, 0, 0.08)"
                        : "none"
                }
                transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                pointerEvents="auto"
            >
                {/* Brand */}
                <Link to="/">
                    <Flex align="center" gap="2" pl="2" cursor="pointer">
                        <Flex
                            w="28px"
                            h="28px"
                            borderRadius="8px"
                            bg="linear-gradient(135deg, #14b8a6, #8b5cf6)"
                            align="center"
                            justify="center"
                        >
                            <Icon color="white" boxSize="3.5">
                                <LuZap />
                            </Icon>
                        </Flex>
                        <Text
                            fontSize="sm"
                            fontWeight="800"
                            color={t.textPrimary}
                            letterSpacing="-0.02em"
                            display={{ base: "none", sm: "block" }}
                        >
                            Impact
                        </Text>
                    </Flex>
                </Link>

                {/* Center Links */}
                <HStack gap="0.5" display={{ base: "none", md: "flex" }}>
                    {NAV_LINKS.map((link) => (
                        <Box
                            key={link.path}
                            as={link.isHash ? "button" : Link}
                            to={link.isHash ? undefined : link.path}
                            onClick={
                                link.isHash
                                    ? () => handleHashClick(link.path)
                                    : undefined
                            }
                            px="3.5"
                            py="1.5"
                            borderRadius="full"
                            fontSize="13px"
                            fontWeight="500"
                            color={
                                location.pathname === link.path && !link.isHash
                                    ? t.textPrimary
                                    : t.textMuted
                            }
                            bg={
                                location.pathname === link.path && !link.isHash
                                    ? isDark
                                        ? "rgba(148, 163, 184, 0.08)"
                                        : "rgba(100, 116, 139, 0.06)"
                                    : "transparent"
                            }
                            transition="all 0.2s"
                            _hover={{
                                color: t.textPrimary,
                                bg: isDark
                                    ? "rgba(148, 163, 184, 0.06)"
                                    : "rgba(100, 116, 139, 0.06)",
                            }}
                            cursor="pointer"
                            border="none"
                            outline="none"
                        >
                            {link.label}
                        </Box>
                    ))}
                </HStack>

                {/* Right Actions */}
                <HStack gap="1.5">
                    {/* Theme Toggle */}
                    <Flex
                        w="30px"
                        h="30px"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        cursor="pointer"
                        onClick={toggleColorMode}
                        _hover={{
                            bg: isDark
                                ? "rgba(148, 163, 184, 0.08)"
                                : "rgba(100, 116, 139, 0.06)",
                        }}
                        transition="all 0.2s"
                    >
                        <Icon
                            color={isDark ? "#fbbf24" : "#8b5cf6"}
                            boxSize="3.5"
                        >
                            {isDark ? <LuSun /> : <LuMoon />}
                        </Icon>
                    </Flex>

                    {isAuthenticated ? (
                        <Link to="/dashboard">
                            <Flex
                                px="4"
                                py="1.5"
                                borderRadius="full"
                                bg="linear-gradient(135deg, #14b8a6, #0d9488)"
                                color="white"
                                fontSize="13px"
                                fontWeight="600"
                                cursor="pointer"
                                align="center"
                                gap="2"
                                transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                                _hover={{
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 4px 16px rgba(20, 184, 166, 0.35)",
                                }}
                                _active={{ transform: "translateY(0)" }}
                            >
                                <Text
                                    maxW="100px"
                                    isTruncated
                                    fontWeight="400"
                                    opacity="0.9"
                                    display={{ base: "none", sm: "block" }}
                                >
                                    {user?.name?.split(" ")[0]}
                                </Text>
                                Dashboard
                                <Icon boxSize="3">
                                    <LuArrowRight />
                                </Icon>
                            </Flex>
                        </Link>
                    ) : (
                        <>
                            {/* Login */}
                            <Link to="/login">
                                <Flex
                                    px="3.5"
                                    py="1.5"
                                    borderRadius="full"
                                    fontSize="13px"
                                    fontWeight="500"
                                    color={t.textMuted}
                                    cursor="pointer"
                                    _hover={{ color: t.textPrimary }}
                                    transition="all 0.2s"
                                    align="center"
                                >
                                    Sign in
                                </Flex>
                            </Link>

                            {/* Get Started */}
                            <Link to="/register">
                                <Flex
                                    px="4"
                                    py="1.5"
                                    borderRadius="full"
                                    bg="linear-gradient(135deg, #14b8a6, #0d9488)"
                                    color="white"
                                    fontSize="13px"
                                    fontWeight="600"
                                    cursor="pointer"
                                    align="center"
                                    gap="1"
                                    transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                                    _hover={{
                                        transform: "translateY(-1px)",
                                        boxShadow: "0 4px 16px rgba(20, 184, 166, 0.35)",
                                    }}
                                    _active={{ transform: "translateY(0)" }}
                                >
                                    Get Started
                                    <Icon boxSize="3">
                                        <LuArrowRight />
                                    </Icon>
                                </Flex>
                            </Link>
                        </>
                    )}
                </HStack>
            </Flex>
        </Box>
    );
}
