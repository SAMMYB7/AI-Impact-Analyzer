// ═══════════════════════════════════════════════════════════════
// PUBLIC NAVBAR — Floating glassmorphism navbar for public pages
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Icon, HStack } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { LuZap, LuArrowRight, LuSun, LuMoon } from "react-icons/lu";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useColorMode } from "../ui/color-mode";
import { useState, useEffect } from "react";

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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleHashClick = (hash) => {
        const el = document.querySelector(hash.replace("/#", "#"));
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
            transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
        >
            <Flex
                maxW="1200px"
                mx="auto"
                mt={scrolled ? "2" : "4"}
                px="5"
                py="3"
                align="center"
                justify="space-between"
                bg={scrolled ? (isDark ? "rgba(10, 14, 26, 0.85)" : "rgba(255, 255, 255, 0.85)") : "transparent"}
                backdropFilter={scrolled ? "blur(24px)" : "none"}
                border={scrolled ? `1px solid ${t.border}` : "1px solid transparent"}
                borderRadius="2xl"
                boxShadow={scrolled ? t.cardShadow : "none"}
                transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
            >
                {/* Brand */}
                <Link to="/">
                    <Flex align="center" gap="2.5" cursor="pointer">
                        <Flex
                            w="34px"
                            h="34px"
                            borderRadius="9px"
                            bg="linear-gradient(135deg, #14b8a6, #8b5cf6)"
                            align="center"
                            justify="center"
                            boxShadow="0 0 16px rgba(20, 184, 166, 0.25)"
                        >
                            <Icon color="white" boxSize="4.5">
                                <LuZap />
                            </Icon>
                        </Flex>
                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="800"
                                color={t.textPrimary}
                                letterSpacing="-0.02em"
                                lineHeight="1.2"
                            >
                                Impact
                            </Text>
                            <Text
                                fontSize="9px"
                                color={t.textMuted}
                                letterSpacing="0.1em"
                                textTransform="uppercase"
                                fontWeight="500"
                            >
                                Analyzer
                            </Text>
                        </Box>
                    </Flex>
                </Link>

                {/* Center Links */}
                <HStack gap="1" display={{ base: "none", md: "flex" }}>
                    {NAV_LINKS.map((link) => (
                        <Box
                            key={link.path}
                            as={link.isHash ? "button" : Link}
                            to={link.isHash ? undefined : link.path}
                            onClick={link.isHash ? () => handleHashClick(link.path) : undefined}
                            px="3.5"
                            py="2"
                            borderRadius="lg"
                            fontSize="13px"
                            fontWeight="500"
                            color={
                                location.pathname === link.path && !link.isHash
                                    ? t.textPrimary
                                    : t.textSecondary
                            }
                            bg={
                                location.pathname === link.path && !link.isHash
                                    ? t.bgHover
                                    : "transparent"
                            }
                            transition="all 0.2s"
                            _hover={{
                                color: t.textPrimary,
                                bg: t.bgHover,
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
                <HStack gap="2">
                    {/* Theme Toggle */}
                    <Flex
                        w="34px"
                        h="34px"
                        borderRadius="lg"
                        bg={t.bgInput}
                        align="center"
                        justify="center"
                        cursor="pointer"
                        onClick={toggleColorMode}
                        _hover={{ bg: t.bgHover }}
                        border={`1px solid ${t.border}`}
                        transition="all 0.2s"
                    >
                        <Icon color={isDark ? "#fbbf24" : "#8b5cf6"} boxSize="4">
                            {isDark ? <LuSun /> : <LuMoon />}
                        </Icon>
                    </Flex>

                    {/* Login */}
                    <Link to="/login">
                        <Flex
                            px="4"
                            py="2"
                            borderRadius="lg"
                            fontSize="13px"
                            fontWeight="500"
                            color={t.textSecondary}
                            cursor="pointer"
                            _hover={{ color: t.textPrimary, bg: t.bgHover }}
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
                            py="2"
                            borderRadius="lg"
                            bg="linear-gradient(135deg, #14b8a6, #0d9488)"
                            color="white"
                            fontSize="13px"
                            fontWeight="600"
                            cursor="pointer"
                            align="center"
                            gap="1.5"
                            transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                            _hover={{
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 16px rgba(20, 184, 166, 0.35)",
                            }}
                            _active={{ transform: "translateY(0)" }}
                        >
                            Get Started
                            <Icon boxSize="3.5">
                                <LuArrowRight />
                            </Icon>
                        </Flex>
                    </Link>
                </HStack>
            </Flex>
        </Box>
    );
}
