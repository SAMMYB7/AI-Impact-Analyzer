// ═══════════════════════════════════════════════════════════════
// PUBLIC FOOTER — Professional enterprise footer
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Icon, HStack, VStack, Separator } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
    LuZap,
    LuGithub,
    LuTwitter,
    LuHeart,
    LuMail,
    LuShield,
    LuArrowUpRight,
} from "react-icons/lu";
import { useThemeColors } from "../../hooks/useThemeColors";

const FOOTER_LINKS = {
    Product: [
        { label: "Features", path: "/#features" },
        { label: "How It Works", path: "/#how-it-works" },
        { label: "Dashboard", path: "/login" },
        { label: "AI Analysis", path: "/login" },
    ],
    Resources: [
        { label: "Documentation", path: "#" },
        { label: "API Reference", path: "#" },
        { label: "Changelog", path: "#" },
        { label: "Status", path: "#" },
    ],
    Company: [
        { label: "About", path: "#" },
        { label: "Privacy", path: "#" },
        { label: "Terms", path: "#" },
        { label: "Contact", path: "#" },
    ],
};

export default function PublicFooter() {
    const t = useThemeColors();

    return (
        <Box
            as="footer"
            w="100%"
            borderTop={`1px solid ${t.border}`}
            bg={t.bgCard}
            backdropFilter="blur(24px)"
            position="relative"
            overflow="hidden"
        >
            {/* Subtle gradient overlay */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="1px"
                bg="linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.3), rgba(139, 92, 246, 0.3), transparent)"
            />

            <Box maxW="1200px" mx="auto" px="6" py="16">
                <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: "10", md: "16" }}
                    justify="space-between"
                >
                    {/* Brand Column */}
                    <VStack align="flex-start" gap="4" maxW="280px">
                        <Flex align="center" gap="2.5">
                            <Flex
                                w="36px"
                                h="36px"
                                borderRadius="10px"
                                bg="linear-gradient(135deg, #14b8a6, #8b5cf6)"
                                align="center"
                                justify="center"
                                boxShadow="0 0 16px rgba(20, 184, 166, 0.25)"
                            >
                                <Icon color="white" boxSize="5">
                                    <LuZap />
                                </Icon>
                            </Flex>
                            <Box>
                                <Text fontSize="sm" fontWeight="800" color={t.textPrimary} letterSpacing="-0.02em">
                                    Impact Analyzer
                                </Text>
                                <Text fontSize="10px" color={t.textMuted} letterSpacing="0.1em" textTransform="uppercase">
                                    AI-Powered CI/CD
                                </Text>
                            </Box>
                        </Flex>
                        <Text fontSize="sm" color={t.textMuted} lineHeight="1.7">
                            Intelligent pull request analysis and test optimization platform powered by machine learning.
                        </Text>

                        {/* Social Icons */}
                        <HStack gap="2" mt="1">
                            {[
                                { icon: LuGithub, href: "#" },
                                { icon: LuTwitter, href: "#" },
                                { icon: LuMail, href: "#" },
                            ].map((social, i) => (
                                <Flex
                                    key={i}
                                    as="a"
                                    href={social.href}
                                    w="34px"
                                    h="34px"
                                    borderRadius="lg"
                                    bg={t.bgInput}
                                    border={`1px solid ${t.border}`}
                                    align="center"
                                    justify="center"
                                    cursor="pointer"
                                    _hover={{ bg: t.bgHover, borderColor: t.borderAccent }}
                                    transition="all 0.2s"
                                >
                                    <Icon color={t.textMuted} boxSize="4">
                                        <social.icon />
                                    </Icon>
                                </Flex>
                            ))}
                        </HStack>
                    </VStack>

                    {/* Link Columns */}
                    <Flex gap={{ base: "8", md: "16" }} wrap="wrap">
                        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                            <VStack key={title} align="flex-start" gap="3" minW="120px">
                                <Text
                                    fontSize="xs"
                                    fontWeight="700"
                                    color={t.textSecondary}
                                    textTransform="uppercase"
                                    letterSpacing="0.08em"
                                >
                                    {title}
                                </Text>
                                {links.map((link) => (
                                    <Link key={link.label} to={link.path}>
                                        <Text
                                            fontSize="sm"
                                            color={t.textMuted}
                                            _hover={{ color: t.textPrimary }}
                                            transition="color 0.2s"
                                            cursor="pointer"
                                        >
                                            {link.label}
                                        </Text>
                                    </Link>
                                ))}
                            </VStack>
                        ))}
                    </Flex>
                </Flex>

                {/* Bottom Bar */}
                <Separator my="8" borderColor={t.border} />
                <Flex
                    align="center"
                    justify="space-between"
                    direction={{ base: "column", sm: "row" }}
                    gap="3"
                >
                    <Text fontSize="xs" color={t.textFaint}>
                        © {new Date().getFullYear()} Impact Analyzer. All rights reserved.
                    </Text>
                    <Flex align="center" gap="1.5">
                        <Icon color={t.textFaint} boxSize="3">
                            <LuShield />
                        </Icon>
                        <Text fontSize="xs" color={t.textFaint}>
                            Enterprise-grade security
                        </Text>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
}
