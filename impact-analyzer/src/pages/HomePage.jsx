// ═══════════════════════════════════════════════════════════════
// HOME PAGE — Public landing page showcasing all features
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Icon, VStack, HStack, Grid, GridItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
    LuZap,
    LuArrowRight,
    LuBrain,
    LuGitPullRequest,
    LuTestTubeDiagonal,
    LuChartColumnIncreasing,
    LuShield,
    LuPlay,
    LuScrollText,
    LuSettings,
    LuGlobe,
    LuRocket,
    LuTarget,
    LuGauge,
    LuClock,
    LuCircleCheck,
    LuArrowDown,
    LuGithub,
    LuActivity,
    LuLayers,
    LuCpu,
    LuStar,
} from "react-icons/lu";
import { useThemeColors } from "../hooks/useThemeColors";

// ── Feature data ─────────────────────────────────────────────
const FEATURES = [
    {
        icon: LuBrain,
        title: "AI Impact Analysis",
        description:
            "Machine learning models predict which areas of your codebase are affected by every pull request, reducing manual review time by up to 70%.",
        accent: "#8b5cf6",
    },
    {
        icon: LuTestTubeDiagonal,
        title: "Smart Test Selection",
        description:
            "Automatically identifies and runs only the tests relevant to your code changes — no more waiting for full test suites.",
        accent: "#14b8a6",
    },
    {
        icon: LuGitPullRequest,
        title: "PR Intelligence",
        description:
            "Real-time tracking and analysis of every pull request with risk scoring, dependency mapping, and merge readiness indicators.",
        accent: "#3b82f6",
    },
    {
        icon: LuChartColumnIncreasing,
        title: "Analytics & Metrics",
        description:
            "Comprehensive dashboards with pipeline health, code coverage trends, test pass rates, and team velocity metrics.",
        accent: "#f59e0b",
    },
    {
        icon: LuPlay,
        title: "Test Execution Engine",
        description:
            "Cloud-native test runner with parallel execution, real-time logs, and automatic retry for flaky tests.",
        accent: "#10b981",
    },
    {
        icon: LuShield,
        title: "Security & Compliance",
        description:
            "Enterprise-grade security with SOC2 compliance, encrypted data at rest, and role-based access controls.",
        accent: "#ef4444",
    },
];

const STATS = [
    { value: "70%", label: "Faster CI/CD", icon: LuGauge },
    { value: "90%", label: "Test Accuracy", icon: LuTarget },
    { value: "3x", label: "Developer Velocity", icon: LuRocket },
    { value: "24/7", label: "Monitoring", icon: LuActivity },
];

const HOW_IT_WORKS = [
    {
        step: "01",
        title: "Connect Your Repo",
        description: "Link your GitHub repository with one click. We integrate seamlessly with your existing CI/CD pipeline.",
        icon: LuGithub,
    },
    {
        step: "02",
        title: "AI Analyzes Changes",
        description: "Our ML models scan every pull request, mapping code changes to potential impact zones across your codebase.",
        icon: LuCpu,
    },
    {
        step: "03",
        title: "Smart Test Selection",
        description: "Only the tests that matter are selected and executed — saving time, compute, and developer frustration.",
        icon: LuTarget,
    },
    {
        step: "04",
        title: "Ship With Confidence",
        description: "Get actionable insights, risk scores, and merge recommendations so you can deploy faster and safer.",
        icon: LuRocket,
    },
];

export default function HomePage() {
    const t = useThemeColors();

    return (
        <Box>
            {/* ══════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════ */}
            <Box
                position="relative"
                overflow="hidden"
                pt={{ base: "32", md: "40" }}
                pb={{ base: "20", md: "32" }}
            >
                {/* Background orbs */}
                <Box
                    position="absolute"
                    top="-10%"
                    left="-5%"
                    w="600px"
                    h="600px"
                    borderRadius="full"
                    bg="radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 60%)"
                    filter="blur(80px)"
                    animation="float 10s ease-in-out infinite"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    top="20%"
                    right="-10%"
                    w="500px"
                    h="500px"
                    borderRadius="full"
                    bg="radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)"
                    filter="blur(70px)"
                    animation="float 12s ease-in-out infinite reverse"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    bottom="0"
                    left="30%"
                    w="400px"
                    h="400px"
                    borderRadius="full"
                    bg="radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 60%)"
                    filter="blur(60px)"
                    animation="float 8s ease-in-out infinite"
                    pointerEvents="none"
                />

                <VStack maxW="800px" mx="auto" px="6" gap="6" textAlign="center" position="relative">
                    {/* Badge */}
                    <Flex
                        align="center"
                        gap="2"
                        px="4"
                        py="1.5"
                        borderRadius="full"
                        bg={t.bgInput}
                        border={`1px solid ${t.border}`}
                        animation="fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards"
                    >
                        <Icon color="#14b8a6" boxSize="3.5">
                            <LuStar />
                        </Icon>
                        <Text fontSize="xs" fontWeight="600" color={t.textSecondary}>
                            AI-Powered CI/CD Intelligence Platform
                        </Text>
                    </Flex>

                    {/* Title */}
                    <Text
                        fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                        fontWeight="900"
                        color={t.textPrimary}
                        lineHeight="1.1"
                        letterSpacing="-0.03em"
                        animation="fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both"
                    >
                        Ship faster with{" "}
                        <Text
                            as="span"
                            bgGradient="linear(to-r, #14b8a6, #8b5cf6)"
                            bgClip="text"
                            style={{
                                background: "linear-gradient(135deg, #14b8a6, #8b5cf6)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            AI-driven
                        </Text>{" "}
                        impact analysis
                    </Text>

                    {/* Subtitle */}
                    <Text
                        fontSize={{ base: "md", md: "lg" }}
                        color={t.textMuted}
                        maxW="600px"
                        lineHeight="1.7"
                        animation="fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both"
                    >
                        Automatically analyze pull requests, predict code impact, and run only the tests that matter.
                        Save hours on every deployment cycle.
                    </Text>

                    {/* CTA Buttons */}
                    <HStack
                        gap="3"
                        mt="4"
                        animation="fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both"
                    >
                        <Link to="/register">
                            <Flex
                                px="6"
                                py="3"
                                borderRadius="xl"
                                bg="linear-gradient(135deg, #14b8a6, #0d9488)"
                                color="white"
                                fontSize="sm"
                                fontWeight="700"
                                cursor="pointer"
                                align="center"
                                gap="2"
                                transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 30px rgba(20, 184, 166, 0.4)",
                                }}
                                _active={{ transform: "translateY(0)" }}
                            >
                                Start Free
                                <Icon boxSize="4">
                                    <LuArrowRight />
                                </Icon>
                            </Flex>
                        </Link>
                        <Link to="/login">
                            <Flex
                                px="6"
                                py="3"
                                borderRadius="xl"
                                bg={t.bgInput}
                                border={`1px solid ${t.border}`}
                                color={t.textPrimary}
                                fontSize="sm"
                                fontWeight="600"
                                cursor="pointer"
                                align="center"
                                gap="2"
                                transition="all 0.2s"
                                _hover={{
                                    bg: t.bgHover,
                                    borderColor: t.borderAccent,
                                    transform: "translateY(-1px)",
                                }}
                            >
                                Sign In
                            </Flex>
                        </Link>
                    </HStack>

                    {/* Scroll indicator */}
                    <Flex
                        mt="12"
                        direction="column"
                        align="center"
                        gap="1"
                        opacity="0.5"
                        animation="fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both"
                    >
                        <Text fontSize="xs" color={t.textFaint} fontWeight="500">
                            Discover more
                        </Text>
                        <Icon
                            color={t.textFaint}
                            boxSize="4"
                            animation="float 2s ease-in-out infinite"
                        >
                            <LuArrowDown />
                        </Icon>
                    </Flex>
                </VStack>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          STATS SECTION
          ══════════════════════════════════════════════════════════ */}
            <Box py="16" borderY={`1px solid ${t.border}`} bg={t.bgCard}>
                <Grid
                    maxW="1000px"
                    mx="auto"
                    px="6"
                    templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
                    gap="8"
                >
                    {STATS.map((stat, i) => (
                        <GridItem key={i} textAlign="center">
                            <Flex
                                w="48px"
                                h="48px"
                                borderRadius="14px"
                                bg="linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(139, 92, 246, 0.1))"
                                border={`1px solid ${t.border}`}
                                align="center"
                                justify="center"
                                mx="auto"
                                mb="3"
                            >
                                <Icon color="#14b8a6" boxSize="5">
                                    <stat.icon />
                                </Icon>
                            </Flex>
                            <Text
                                fontSize={{ base: "2xl", md: "3xl" }}
                                fontWeight="900"
                                color={t.textPrimary}
                                letterSpacing="-0.03em"
                            >
                                {stat.value}
                            </Text>
                            <Text fontSize="sm" color={t.textMuted} fontWeight="500">
                                {stat.label}
                            </Text>
                        </GridItem>
                    ))}
                </Grid>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          FEATURES SECTION
          ══════════════════════════════════════════════════════════ */}
            <Box py={{ base: "16", md: "24" }} id="features">
                <VStack maxW="1200px" mx="auto" px="6" gap="16">
                    {/* Section Header */}
                    <VStack gap="4" textAlign="center" maxW="600px">
                        <Flex
                            align="center"
                            gap="2"
                            px="3"
                            py="1"
                            borderRadius="full"
                            bg="rgba(20, 184, 166, 0.08)"
                            border="1px solid rgba(20, 184, 166, 0.15)"
                        >
                            <Icon color="#14b8a6" boxSize="3.5">
                                <LuLayers />
                            </Icon>
                            <Text fontSize="xs" fontWeight="600" color="#14b8a6">
                                Features
                            </Text>
                        </Flex>
                        <Text
                            fontSize={{ base: "2xl", md: "4xl" }}
                            fontWeight="900"
                            color={t.textPrimary}
                            letterSpacing="-0.02em"
                        >
                            Everything you need for intelligent CI/CD
                        </Text>
                        <Text fontSize="md" color={t.textMuted} lineHeight="1.7">
                            A comprehensive suite of tools to analyze code changes, optimize testing, and accelerate your deployment pipeline.
                        </Text>
                    </VStack>

                    {/* Feature Grid */}
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                        gap="5"
                        w="100%"
                    >
                        {FEATURES.map((feature, i) => (
                            <GridItem
                                key={i}
                                bg={t.bgCard}
                                backdropFilter="blur(20px)"
                                border={`1px solid ${t.border}`}
                                borderRadius="2xl"
                                p="7"
                                transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                                _hover={{
                                    borderColor: `${feature.accent}40`,
                                    transform: "translateY(-4px)",
                                    boxShadow: `0 12px 40px ${feature.accent}15`,
                                }}
                                position="relative"
                                overflow="hidden"
                            >
                                {/* Subtle accent glow */}
                                <Box
                                    position="absolute"
                                    top="-20px"
                                    right="-20px"
                                    w="100px"
                                    h="100px"
                                    borderRadius="full"
                                    bg={`radial-gradient(circle, ${feature.accent}10 0%, transparent 70%)`}
                                    pointerEvents="none"
                                />

                                <Flex
                                    w="44px"
                                    h="44px"
                                    borderRadius="12px"
                                    bg={`${feature.accent}12`}
                                    border={`1px solid ${feature.accent}20`}
                                    align="center"
                                    justify="center"
                                    mb="4"
                                >
                                    <Icon color={feature.accent} boxSize="5">
                                        <feature.icon />
                                    </Icon>
                                </Flex>
                                <Text
                                    fontSize="md"
                                    fontWeight="700"
                                    color={t.textPrimary}
                                    mb="2"
                                    letterSpacing="-0.01em"
                                >
                                    {feature.title}
                                </Text>
                                <Text fontSize="sm" color={t.textMuted} lineHeight="1.7">
                                    {feature.description}
                                </Text>
                            </GridItem>
                        ))}
                    </Grid>
                </VStack>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS SECTION
          ══════════════════════════════════════════════════════════ */}
            <Box
                py={{ base: "16", md: "24" }}
                bg={t.bgCard}
                borderY={`1px solid ${t.border}`}
                id="how-it-works"
            >
                <VStack maxW="1000px" mx="auto" px="6" gap="16">
                    {/* Section Header */}
                    <VStack gap="4" textAlign="center" maxW="600px">
                        <Flex
                            align="center"
                            gap="2"
                            px="3"
                            py="1"
                            borderRadius="full"
                            bg="rgba(139, 92, 246, 0.08)"
                            border="1px solid rgba(139, 92, 246, 0.15)"
                        >
                            <Icon color="#8b5cf6" boxSize="3.5">
                                <LuCircleCheck />
                            </Icon>
                            <Text fontSize="xs" fontWeight="600" color="#8b5cf6">
                                How It Works
                            </Text>
                        </Flex>
                        <Text
                            fontSize={{ base: "2xl", md: "4xl" }}
                            fontWeight="900"
                            color={t.textPrimary}
                            letterSpacing="-0.02em"
                        >
                            Get started in minutes
                        </Text>
                        <Text fontSize="md" color={t.textMuted} lineHeight="1.7">
                            Four simple steps to transform your CI/CD pipeline with AI intelligence.
                        </Text>
                    </VStack>

                    {/* Steps */}
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap="6"
                        w="100%"
                    >
                        {HOW_IT_WORKS.map((item, i) => (
                            <GridItem key={i}>
                                <Flex
                                    bg={t.bg}
                                    border={`1px solid ${t.border}`}
                                    borderRadius="2xl"
                                    p="7"
                                    gap="5"
                                    align="flex-start"
                                    transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                                    _hover={{
                                        borderColor: "rgba(20, 184, 166, 0.3)",
                                        transform: "translateY(-2px)",
                                        boxShadow: t.cardHoverShadow,
                                    }}
                                >
                                    {/* Step Number */}
                                    <Flex
                                        w="48px"
                                        h="48px"
                                        borderRadius="14px"
                                        bg="linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(139, 92, 246, 0.08))"
                                        border={`1px solid ${t.border}`}
                                        align="center"
                                        justify="center"
                                        flexShrink="0"
                                    >
                                        <Text
                                            fontSize="sm"
                                            fontWeight="800"
                                            style={{
                                                background: "linear-gradient(135deg, #14b8a6, #8b5cf6)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                        >
                                            {item.step}
                                        </Text>
                                    </Flex>

                                    <Box>
                                        <Flex align="center" gap="2" mb="2">
                                            <Icon color="#14b8a6" boxSize="4">
                                                <item.icon />
                                            </Icon>
                                            <Text
                                                fontSize="md"
                                                fontWeight="700"
                                                color={t.textPrimary}
                                                letterSpacing="-0.01em"
                                            >
                                                {item.title}
                                            </Text>
                                        </Flex>
                                        <Text fontSize="sm" color={t.textMuted} lineHeight="1.7">
                                            {item.description}
                                        </Text>
                                    </Box>
                                </Flex>
                            </GridItem>
                        ))}
                    </Grid>
                </VStack>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════════════════════ */}
            <Box py={{ base: "16", md: "24" }} position="relative" overflow="hidden">
                {/* Background orbs */}
                <Box
                    position="absolute"
                    top="-30%"
                    left="10%"
                    w="400px"
                    h="400px"
                    borderRadius="full"
                    bg="radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 60%)"
                    filter="blur(60px)"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    bottom="-20%"
                    right="15%"
                    w="350px"
                    h="350px"
                    borderRadius="full"
                    bg="radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 60%)"
                    filter="blur(50px)"
                    pointerEvents="none"
                />

                <VStack maxW="650px" mx="auto" px="6" gap="6" textAlign="center" position="relative">
                    <Text
                        fontSize={{ base: "2xl", md: "4xl" }}
                        fontWeight="900"
                        color={t.textPrimary}
                        letterSpacing="-0.02em"
                        lineHeight="1.2"
                    >
                        Ready to supercharge your pipeline?
                    </Text>
                    <Text fontSize="md" color={t.textMuted} lineHeight="1.7" maxW="500px">
                        Join teams already shipping faster and safer with AI-powered impact analysis and intelligent test selection.
                    </Text>
                    <HStack gap="3" mt="2">
                        <Link to="/register">
                            <Flex
                                px="7"
                                py="3.5"
                                borderRadius="xl"
                                bg="linear-gradient(135deg, #14b8a6, #0d9488)"
                                color="white"
                                fontSize="sm"
                                fontWeight="700"
                                cursor="pointer"
                                align="center"
                                gap="2"
                                transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 30px rgba(20, 184, 166, 0.4)",
                                }}
                                _active={{ transform: "translateY(0)" }}
                            >
                                Get Started Free
                                <Icon boxSize="4">
                                    <LuArrowRight />
                                </Icon>
                            </Flex>
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );
}
