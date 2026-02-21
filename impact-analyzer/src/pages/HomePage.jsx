// ═══════════════════════════════════════════════════════════════
// HOME PAGE — Redesigned landing page inspired by modern SaaS
// Soft mesh gradients · Product mockup · Bento features · FAQ
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
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
    LuRocket,
    LuTarget,
    LuGauge,
    LuCircleCheck,
    LuGithub,
    LuActivity,
    LuCpu,
    LuStar,
    LuChevronDown,
    LuQuote,
    LuTrendingUp,
    LuUsers,
    LuTimer,
} from "react-icons/lu";
import { useThemeColors } from "../hooks/useThemeColors";
import { useColorMode } from "../components/ui/color-mode";

// ── Data ─────────────────────────────────────────────────────
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

const HOW_IT_WORKS = [
    {
        step: "01",
        title: "Connect Your Repo",
        description:
            "Link your GitHub repository with one click. We integrate seamlessly with your existing CI/CD pipeline.",
        icon: LuGithub,
    },
    {
        step: "02",
        title: "AI Analyzes Changes",
        description:
            "Our ML models scan every pull request, mapping code changes to potential impact zones across your codebase.",
        icon: LuCpu,
    },
    {
        step: "03",
        title: "Smart Test Selection",
        description:
            "Only the tests that matter are selected and executed — saving time, compute, and developer frustration.",
        icon: LuTarget,
    },
    {
        step: "04",
        title: "Ship With Confidence",
        description:
            "Get actionable insights, risk scores, and merge recommendations so you can deploy faster and safer.",
        icon: LuRocket,
    },
];

const TESTIMONIALS = [
    {
        quote:
            "Impact Analyzer cut our CI pipeline time by 68%. We ship features twice as fast now with half the infrastructure cost.",
        name: "Sarah Chen",
        role: "VP of Engineering",
        company: "TechScale Inc",
    },
    {
        quote:
            "The AI-driven test selection is a game-changer. Our devs stopped complaining about waiting for test suites, and our flaky test rate dropped by 90%.",
        name: "Marcus Rivera",
        role: "Staff Engineer",
        company: "DevOps Pro",
    },
];

const FAQ_ITEMS = [
    {
        question: "How does Impact Analyzer integrate with my existing CI/CD?",
        answer:
            "Impact Analyzer connects to your GitHub repository via OAuth. Once connected, it automatically hooks into your pull request workflow, analyzing every PR in real-time. No changes to your existing pipeline are required — it works alongside your current CI tools.",
    },
    {
        question: "Is my source code safe with Impact Analyzer?",
        answer:
            "Absolutely. We never store your source code on our servers. Our analysis engine processes code changes in-memory and only stores metadata like file paths and change patterns. All data is encrypted at rest and in transit with AES-256 encryption.",
    },
    {
        question: "How accurate is the AI test selection?",
        answer:
            "Our machine learning models achieve 90%+ accuracy in identifying relevant tests for code changes. The system continuously learns from your project's test history and improves over time, reducing false positives and ensuring critical tests are never skipped.",
    },
    {
        question: "Can Impact Analyzer work for small teams?",
        answer:
            "Yes! Impact Analyzer is designed to scale from solo developers to enterprise teams. Our free tier includes full AI analysis for up to 3 repositories, making it accessible for teams of all sizes.",
    },
    {
        question: "What languages and frameworks are supported?",
        answer:
            "Impact Analyzer supports all major languages including JavaScript/TypeScript, Python, Java, Go, Rust, Ruby, and C#. Our framework-agnostic analysis works with any test framework — Jest, Pytest, JUnit, Go Test, RSpec, and more.",
    },
];

// ── Dashboard Mockup Component ───────────────────────────────
function DashboardMockup({ isDark, t }) {
    return (
        <Box
            w="100%"
            maxW="900px"
            mx="auto"
            bg={isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.95)"}
            border={`1px solid ${isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(100, 116, 139, 0.15)"}`}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={
                isDark
                    ? "0 25px 80px -20px rgba(0, 0, 0, 0.6), 0 0 60px -15px rgba(20, 184, 166, 0.1)"
                    : "0 25px 80px -20px rgba(0, 0, 0, 0.15), 0 0 60px -15px rgba(20, 184, 166, 0.08)"
            }
        >
            {/* Window chrome */}
            <Flex
                align="center"
                px="4"
                py="3"
                borderBottom={`1px solid ${isDark ? "rgba(148, 163, 184, 0.08)" : "rgba(100, 116, 139, 0.1)"}`}
                bg={isDark ? "rgba(10, 14, 26, 0.7)" : "rgba(248, 250, 252, 0.9)"}
            >
                <HStack gap="1.5">
                    <Box w="10px" h="10px" borderRadius="full" bg="#ef4444" />
                    <Box w="10px" h="10px" borderRadius="full" bg="#f59e0b" />
                    <Box w="10px" h="10px" borderRadius="full" bg="#10b981" />
                </HStack>
                <Box
                    mx="auto"
                    px="8"
                    py="1"
                    borderRadius="md"
                    bg={isDark ? "rgba(148, 163, 184, 0.06)" : "rgba(100, 116, 139, 0.06)"}
                    border={`1px solid ${isDark ? "rgba(148, 163, 184, 0.06)" : "rgba(100, 116, 139, 0.08)"}`}
                >
                    <Text fontSize="10px" color={t.textFaint} fontWeight="500">
                        app.impactanalyzer.dev/dashboard
                    </Text>
                </Box>
            </Flex>

            {/* Dashboard content */}
            <Box p="5">
                {/* Header row */}
                <Flex justify="space-between" align="center" mb="4">
                    <Box>
                        <Text fontSize="sm" fontWeight="700" color={t.textPrimary}>
                            PR Impact Analysis
                        </Text>
                        <Text fontSize="xs" color={t.textMuted}>
                            Real-time overview
                        </Text>
                    </Box>
                    <Flex gap="2">
                        <Box
                            px="2.5"
                            py="1"
                            borderRadius="md"
                            bg="rgba(20, 184, 166, 0.1)"
                            border="1px solid rgba(20, 184, 166, 0.2)"
                        >
                            <Text fontSize="10px" fontWeight="600" color="#14b8a6">
                                Live
                            </Text>
                        </Box>
                    </Flex>
                </Flex>

                {/* Stats row in mockup */}
                <Grid templateColumns="repeat(4, 1fr)" gap="3" mb="4">
                    {[
                        { label: "PRs Analyzed", val: "1,847", color: "#14b8a6" },
                        { label: "Tests Saved", val: "12.4K", color: "#8b5cf6" },
                        { label: "Avg Time", val: "2.3m", color: "#3b82f6" },
                        { label: "Accuracy", val: "96.8%", color: "#10b981" },
                    ].map((s, i) => (
                        <Box
                            key={i}
                            p="3"
                            borderRadius="lg"
                            bg={isDark ? "rgba(148, 163, 184, 0.04)" : "rgba(100, 116, 139, 0.04)"}
                            border={`1px solid ${isDark ? "rgba(148, 163, 184, 0.06)" : "rgba(100, 116, 139, 0.08)"}`}
                        >
                            <Text fontSize="10px" color={t.textMuted} mb="1">
                                {s.label}
                            </Text>
                            <Text fontSize="lg" fontWeight="800" color={s.color} letterSpacing="-0.02em">
                                {s.val}
                            </Text>
                        </Box>
                    ))}
                </Grid>

                {/* Chart area mockup */}
                <Box
                    p="4"
                    borderRadius="lg"
                    bg={isDark ? "rgba(148, 163, 184, 0.03)" : "rgba(100, 116, 139, 0.03)"}
                    border={`1px solid ${isDark ? "rgba(148, 163, 184, 0.06)" : "rgba(100, 116, 139, 0.08)"}`}
                    mb="3"
                >
                    <Flex justify="space-between" align="center" mb="3">
                        <Text fontSize="xs" fontWeight="600" color={t.textSecondary}>
                            Test Runs This Week
                        </Text>
                        <HStack gap="3">
                            <HStack gap="1">
                                <Box w="6px" h="6px" borderRadius="full" bg="#14b8a6" />
                                <Text fontSize="9px" color={t.textMuted}>Selected</Text>
                            </HStack>
                            <HStack gap="1">
                                <Box w="6px" h="6px" borderRadius="full" bg="#8b5cf6" />
                                <Text fontSize="9px" color={t.textMuted}>Skipped</Text>
                            </HStack>
                        </HStack>
                    </Flex>
                    {/* Bar chart visualization */}
                    <Flex align="flex-end" gap="2" h="80px">
                        {[65, 45, 80, 55, 70, 90, 60].map((h, i) => (
                            <Flex key={i} flex="1" direction="column" align="center" gap="1">
                                <Box
                                    w="100%"
                                    h={`${h}%`}
                                    borderRadius="md"
                                    bg={`linear-gradient(to top, ${i % 2 === 0 ? "#14b8a6" : "#8b5cf6"}, ${i % 2 === 0 ? "rgba(20, 184, 166, 0.4)" : "rgba(139, 92, 246, 0.4)"})`}
                                    opacity={0.8}
                                />
                                <Text fontSize="8px" color={t.textFaint}>
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                                </Text>
                            </Flex>
                        ))}
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
}

// ── FAQ Accordion Component ──────────────────────────────────
function FAQItem({ question, answer, isOpen, onToggle, t }) {
    return (
        <Box
            border={`1px solid ${t.border}`}
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.2s"
            _hover={{ borderColor: "rgba(20, 184, 166, 0.2)" }}
        >
            <Flex
                as="button"
                w="100%"
                align="center"
                justify="space-between"
                px="6"
                py="5"
                cursor="pointer"
                onClick={onToggle}
                bg="transparent"
                border="none"
                outline="none"
                _hover={{ bg: t.bgHover }}
                transition="background 0.2s"
            >
                <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={t.textPrimary}
                    textAlign="left"
                >
                    {question}
                </Text>
                <Icon
                    color={t.textMuted}
                    boxSize="4"
                    flexShrink="0"
                    ml="4"
                    transition="transform 0.3s ease"
                    transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                >
                    <LuChevronDown />
                </Icon>
            </Flex>
            <Box
                maxH={isOpen ? "300px" : "0px"}
                overflow="hidden"
                transition="max-height 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s"
                opacity={isOpen ? 1 : 0}
            >
                <Box px="6" pb="5">
                    <Text fontSize="sm" color={t.textMuted} lineHeight="1.8">
                        {answer}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
export default function HomePage() {
    const t = useThemeColors();
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";
    const [openFAQ, setOpenFAQ] = useState(null);

    return (
        <Box>
            {/* ══════════════════════════════════════════════════════════
          HERO — Mesh gradient background + big text + mockup
          ══════════════════════════════════════════════════════════ */}
            <Box position="relative" overflow="hidden" pb={{ base: 12, md: 0 }}>
                {/* Mesh gradient background */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h={{ base: "700px", md: "800px" }}
                    pointerEvents="none"
                    bg={
                        isDark
                            ? "linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(10, 14, 26, 1) 40%, rgba(139, 92, 246, 0.05) 70%, rgba(10, 14, 26, 1) 100%)"
                            : "linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(248, 250, 252, 1) 35%, rgba(139, 92, 246, 0.08) 60%, rgba(248, 250, 252, 1) 100%)"
                    }
                />
                <Box
                    position="absolute"
                    top="-100px"
                    left="-150px"
                    w="500px"
                    h="500px"
                    borderRadius="full"
                    bg={
                        isDark
                            ? "radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 60%)"
                            : "radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, transparent 60%)"
                    }
                    filter="blur(80px)"
                    animation="float 12s ease-in-out infinite"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    top="50px"
                    right="-100px"
                    w="450px"
                    h="450px"
                    borderRadius="full"
                    bg={
                        isDark
                            ? "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)"
                            : "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)"
                    }
                    filter="blur(70px)"
                    animation="float 10s ease-in-out infinite reverse"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    top="300px"
                    left="30%"
                    w="300px"
                    h="300px"
                    borderRadius="full"
                    bg={
                        isDark
                            ? "radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 60%)"
                            : "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 60%)"
                    }
                    filter="blur(50px)"
                    animation="float 8s ease-in-out infinite"
                    pointerEvents="none"
                />

                <VStack
                    maxW="900px"
                    mx="auto"
                    px="6"
                    gap="6"
                    textAlign="center"
                    position="relative"
                    pt={{ base: "28", md: "36" }}
                >
                    {/* Badge */}
                    <Flex
                        align="center"
                        gap="2"
                        px="4"
                        py="1.5"
                        borderRadius="full"
                        bg={isDark ? "rgba(20, 184, 166, 0.08)" : "rgba(20, 184, 166, 0.06)"}
                        border="1px solid rgba(20, 184, 166, 0.2)"
                        animation="fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards"
                    >
                        <Icon color="#14b8a6" boxSize="3.5">
                            <LuStar />
                        </Icon>
                        <Text fontSize="xs" fontWeight="600" color="#14b8a6">
                            AI-Powered CI/CD Intelligence
                        </Text>
                    </Flex>

                    {/* Hero Title */}
                    <Text
                        fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                        fontWeight="900"
                        color={t.textPrimary}
                        lineHeight="1.08"
                        letterSpacing="-0.04em"
                        maxW="800px"
                        animation="fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both"
                    >
                        Smarter Analysis{" "}
                        <Text
                            as="span"
                            style={{
                                background: "linear-gradient(135deg, #14b8a6, #8b5cf6)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Faster
                        </Text>
                        <br />
                        Deployments
                    </Text>

                    {/* Subtitle */}
                    <Text
                        fontSize={{ base: "md", md: "lg" }}
                        color={t.textMuted}
                        maxW="550px"
                        lineHeight="1.7"
                        animation="fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both"
                    >
                        Automatically analyze pull requests, predict code impact, and run
                        only the tests that matter. Save hours on every deployment cycle.
                    </Text>

                    {/* CTA */}
                    <HStack
                        gap="3"
                        mt="2"
                        animation="fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both"
                    >
                        <Link to="/register">
                            <Flex
                                px="7"
                                py="3.5"
                                borderRadius="full"
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
                                    boxShadow:
                                        "0 8px 30px rgba(20, 184, 166, 0.4)",
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
                                px="7"
                                py="3.5"
                                borderRadius="full"
                                border={`1.5px solid ${t.border}`}
                                color={t.textPrimary}
                                fontSize="sm"
                                fontWeight="600"
                                cursor="pointer"
                                align="center"
                                gap="2"
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: t.borderAccent,
                                    bg: t.bgHover,
                                    transform: "translateY(-1px)",
                                }}
                            >
                                Sign In
                            </Flex>
                        </Link>
                    </HStack>

                    {/* Trusted by */}
                    <Flex
                        align="center"
                        gap="3"
                        mt="6"
                        opacity="0.6"
                        animation="fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both"
                    >
                        <HStack gap="-2">
                            {["#14b8a6", "#8b5cf6", "#3b82f6", "#f59e0b"].map((c, i) => (
                                <Box
                                    key={i}
                                    w="24px"
                                    h="24px"
                                    borderRadius="full"
                                    bg={c}
                                    border={`2px solid ${t.bg}`}
                                    ml={i > 0 ? "-6px" : "0"}
                                />
                            ))}
                        </HStack>
                        <Text fontSize="xs" color={t.textMuted} fontWeight="500">
                            Trusted by 2,400+ engineering teams
                        </Text>
                    </Flex>

                    {/* Dashboard Mockup */}
                    <Box
                        mt="10"
                        w="100%"
                        animation="fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both"
                    >
                        <DashboardMockup isDark={isDark} t={t} />
                    </Box>
                </VStack>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          STATS SECTION — Large numbers
          ══════════════════════════════════════════════════════════ */}
            <Box py={{ base: "14", md: "20" }}>
                <Grid
                    maxW="1000px"
                    mx="auto"
                    px="6"
                    templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
                    gap={{ base: "6", md: "10" }}
                >
                    {[
                        { value: "70%", label: "Faster CI/CD Pipelines", icon: LuGauge, color: "#14b8a6" },
                        { value: "90%", label: "Test Selection Accuracy", icon: LuTarget, color: "#8b5cf6" },
                        { value: "3x", label: "Developer Velocity", icon: LuRocket, color: "#3b82f6" },
                        { value: "24/7", label: "Continuous Monitoring", icon: LuActivity, color: "#f59e0b" },
                    ].map((stat, i) => (
                        <GridItem key={i} textAlign="center">
                            <Text
                                fontSize={{ base: "3xl", md: "4xl" }}
                                fontWeight="900"
                                letterSpacing="-0.04em"
                                color={stat.color}
                                lineHeight="1"
                                mb="2"
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
          CAPABILITIES — Bento-style features
          ══════════════════════════════════════════════════════════ */}
            <Box py={{ base: "12", md: "24" }} id="features">
                <VStack maxW="1100px" mx="auto" px="6" gap="16">
                    {/* Section Header */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        align={{ base: "flex-start", md: "flex-end" }}
                        justify="space-between"
                        w="100%"
                        gap="4"
                    >
                        <Box>
                            <Text
                                fontSize="xs"
                                fontWeight="700"
                                textTransform="uppercase"
                                letterSpacing="0.12em"
                                color="#14b8a6"
                                mb="3"
                            >
                                Capabilities
                            </Text>
                            <Text
                                fontSize={{ base: "2xl", md: "4xl" }}
                                fontWeight="900"
                                color={t.textPrimary}
                                letterSpacing="-0.03em"
                                lineHeight="1.15"
                                maxW="500px"
                            >
                                Everything you need for intelligent CI/CD
                            </Text>
                        </Box>
                        <Text
                            fontSize="md"
                            color={t.textMuted}
                            maxW="380px"
                            lineHeight="1.7"
                        >
                            A comprehensive suite of tools to analyze code changes, optimize
                            testing, and accelerate your deployment pipeline.
                        </Text>
                    </Flex>

                    {/* Bento Grid */}
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                        templateRows={{ base: "auto", md: "auto auto" }}
                        gap="4"
                        w="100%"
                    >
                        {FEATURES.map((feature, i) => {
                            // First two features use larger cards
                            const isLarge = i < 2;
                            return (
                                <GridItem
                                    key={i}
                                    colSpan={{
                                        base: 1,
                                        md: i === 0 ? 2 : i === 5 ? 2 : 1,
                                    }}
                                    bg={isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.85)"}
                                    backdropFilter="blur(16px)"
                                    border={`1px solid ${t.border}`}
                                    borderRadius="2xl"
                                    p={{ base: "6", md: i === 0 || i === 5 ? "8" : "6" }}
                                    transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                                    _hover={{
                                        borderColor: `${feature.accent}45`,
                                        transform: "translateY(-3px)",
                                        boxShadow: `0 16px 48px ${feature.accent}12`,
                                    }}
                                    position="relative"
                                    overflow="hidden"
                                    cursor="default"
                                >
                                    {/* Corner glow */}
                                    <Box
                                        position="absolute"
                                        top="-30px"
                                        right="-30px"
                                        w="120px"
                                        h="120px"
                                        borderRadius="full"
                                        bg={`radial-gradient(circle, ${feature.accent}15 0%, transparent 70%)`}
                                        pointerEvents="none"
                                    />

                                    <Flex
                                        w="42px"
                                        h="42px"
                                        borderRadius="12px"
                                        bg={`${feature.accent}15`}
                                        border={`1px solid ${feature.accent}25`}
                                        align="center"
                                        justify="center"
                                        mb="4"
                                    >
                                        <Icon color={feature.accent} boxSize="5">
                                            <feature.icon />
                                        </Icon>
                                    </Flex>
                                    <Text
                                        fontSize={i === 0 || i === 5 ? "lg" : "md"}
                                        fontWeight="700"
                                        color={t.textPrimary}
                                        mb="2"
                                        letterSpacing="-0.01em"
                                    >
                                        {feature.title}
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        color={t.textMuted}
                                        lineHeight="1.7"
                                        maxW={i === 0 || i === 5 ? "500px" : "100%"}
                                    >
                                        {feature.description}
                                    </Text>
                                </GridItem>
                            );
                        })}
                    </Grid>
                </VStack>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS — Steps
          ══════════════════════════════════════════════════════════ */}
            <Box
                py={{ base: "12", md: "24" }}
                bg={isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(248, 250, 252, 0.8)"}
                borderY={`1px solid ${t.border}`}
                id="how-it-works"
            >
                <VStack maxW="1100px" mx="auto" px="6" gap="14">
                    <Box textAlign="center" maxW="550px">
                        <Text
                            fontSize="xs"
                            fontWeight="700"
                            textTransform="uppercase"
                            letterSpacing="0.12em"
                            color="#8b5cf6"
                            mb="3"
                        >
                            How It Works
                        </Text>
                        <Text
                            fontSize={{ base: "2xl", md: "4xl" }}
                            fontWeight="900"
                            color={t.textPrimary}
                            letterSpacing="-0.03em"
                            lineHeight="1.15"
                        >
                            Get started in minutes
                        </Text>
                        <Text fontSize="md" color={t.textMuted} lineHeight="1.7" mt="3">
                            Four simple steps to transform your CI/CD pipeline with AI.
                        </Text>
                    </Box>

                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                        gap="5"
                        w="100%"
                    >
                        {HOW_IT_WORKS.map((item, i) => (
                            <GridItem key={i}>
                                <VStack
                                    align="flex-start"
                                    p="6"
                                    bg={t.bgCard}
                                    border={`1px solid ${t.border}`}
                                    borderRadius="2xl"
                                    h="100%"
                                    transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                                    _hover={{
                                        borderColor: "rgba(20, 184, 166, 0.3)",
                                        transform: "translateY(-3px)",
                                        boxShadow: t.cardHoverShadow,
                                    }}
                                    gap="4"
                                >
                                    <Text
                                        fontSize="xs"
                                        fontWeight="800"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #14b8a6, #8b5cf6)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        STEP {item.step}
                                    </Text>
                                    <Flex
                                        w="40px"
                                        h="40px"
                                        borderRadius="11px"
                                        bg="linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(139, 92, 246, 0.1))"
                                        border={`1px solid ${t.border}`}
                                        align="center"
                                        justify="center"
                                    >
                                        <Icon color="#14b8a6" boxSize="4.5">
                                            <item.icon />
                                        </Icon>
                                    </Flex>
                                    <Box>
                                        <Text
                                            fontSize="md"
                                            fontWeight="700"
                                            color={t.textPrimary}
                                            mb="1.5"
                                            letterSpacing="-0.01em"
                                        >
                                            {item.title}
                                        </Text>
                                        <Text fontSize="sm" color={t.textMuted} lineHeight="1.7">
                                            {item.description}
                                        </Text>
                                    </Box>
                                </VStack>
                            </GridItem>
                        ))}
                    </Grid>
                </VStack>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS — Big stats + quotes
          ══════════════════════════════════════════════════════════ */}
            <Box py={{ base: "12", md: "24" }}>
                <VStack maxW="1100px" mx="auto" px="6" gap="14">
                    <Box textAlign="center" maxW="550px">
                        <Text
                            fontSize="xs"
                            fontWeight="700"
                            textTransform="uppercase"
                            letterSpacing="0.12em"
                            color="#14b8a6"
                            mb="3"
                        >
                            What Teams Say
                        </Text>
                        <Text
                            fontSize={{ base: "2xl", md: "4xl" }}
                            fontWeight="900"
                            color={t.textPrimary}
                            letterSpacing="-0.03em"
                            lineHeight="1.15"
                        >
                            Loved by engineering teams
                        </Text>
                    </Box>

                    {/* Big stat + testimonials side-by-side */}
                    <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap="5"
                        w="100%"
                    >
                        {/* Big stat card */}
                        <GridItem>
                            <Box
                                p="8"
                                bg={isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.9)"}
                                border={`1px solid ${t.border}`}
                                borderRadius="2xl"
                                h="100%"
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                            >
                                <Text
                                    fontSize={{ base: "5xl", md: "7xl" }}
                                    fontWeight="900"
                                    letterSpacing="-0.05em"
                                    lineHeight="1"
                                    mb="3"
                                    style={{
                                        background: "linear-gradient(135deg, #14b8a6, #8b5cf6)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    $2.4M
                                </Text>
                                <Text fontSize="md" color={t.textMuted} lineHeight="1.7" maxW="320px">
                                    Average annual infrastructure savings reported by teams using
                                    Impact Analyzer's intelligent test selection.
                                </Text>

                                <Flex
                                    mt="6"
                                    gap="4"
                                    wrap="wrap"
                                >
                                    {[
                                        { icon: LuTrendingUp, label: "68% pipeline reduction", color: "#14b8a6" },
                                        { icon: LuUsers, label: "2,400+ teams", color: "#8b5cf6" },
                                        { icon: LuTimer, label: "3hr saved per dev/day", color: "#3b82f6" },
                                    ].map((tag, i) => (
                                        <Flex
                                            key={i}
                                            align="center"
                                            gap="1.5"
                                            px="3"
                                            py="1.5"
                                            borderRadius="full"
                                            bg={`${tag.color}10`}
                                            border={`1px solid ${tag.color}20`}
                                        >
                                            <Icon color={tag.color} boxSize="3.5">
                                                <tag.icon />
                                            </Icon>
                                            <Text fontSize="xs" fontWeight="600" color={tag.color}>
                                                {tag.label}
                                            </Text>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Box>
                        </GridItem>

                        {/* Testimonial cards */}
                        <GridItem>
                            <VStack gap="4" h="100%">
                                {TESTIMONIALS.map((t2, i) => (
                                    <Box
                                        key={i}
                                        p="6"
                                        bg={isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.9)"}
                                        border={`1px solid ${t.border}`}
                                        borderRadius="2xl"
                                        flex="1"
                                        position="relative"
                                    >
                                        <Icon
                                            color={isDark ? "rgba(20, 184, 166, 0.15)" : "rgba(20, 184, 166, 0.1)"}
                                            boxSize="8"
                                            position="absolute"
                                            top="5"
                                            right="5"
                                        >
                                            <LuQuote />
                                        </Icon>
                                        <Text
                                            fontSize="sm"
                                            color={t.textSecondary}
                                            lineHeight="1.8"
                                            mb="5"
                                            fontStyle="italic"
                                        >
                                            "{t2.quote}"
                                        </Text>
                                        <Flex align="center" gap="3">
                                            <Box
                                                w="36px"
                                                h="36px"
                                                borderRadius="full"
                                                bg={`linear-gradient(135deg, ${i === 0 ? "#14b8a6" : "#8b5cf6"}, ${i === 0 ? "#8b5cf6" : "#3b82f6"})`}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Text fontSize="xs" fontWeight="700" color="white">
                                                    {t2.name
                                                        .split(" ")
                                                        .map((w) => w[0])
                                                        .join("")}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    color={t.textPrimary}
                                                >
                                                    {t2.name}
                                                </Text>
                                                <Text fontSize="xs" color={t.textMuted}>
                                                    {t2.role}, {t2.company}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        </GridItem>
                    </Grid>
                </VStack>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          FAQ SECTION
          ══════════════════════════════════════════════════════════ */}
            <Box
                py={{ base: "12", md: "24" }}
                bg={isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(248, 250, 252, 0.8)"}
                borderY={`1px solid ${t.border}`}
            >
                <VStack maxW="750px" mx="auto" px="6" gap="10">
                    <Box textAlign="center">
                        <Text
                            fontSize="xs"
                            fontWeight="700"
                            textTransform="uppercase"
                            letterSpacing="0.12em"
                            color="#8b5cf6"
                            mb="3"
                        >
                            FAQ
                        </Text>
                        <Text
                            fontSize={{ base: "2xl", md: "4xl" }}
                            fontWeight="900"
                            color={t.textPrimary}
                            letterSpacing="-0.03em"
                        >
                            Frequently Asked Questions
                        </Text>
                    </Box>

                    <VStack gap="3" w="100%">
                        {FAQ_ITEMS.map((item, i) => (
                            <FAQItem
                                key={i}
                                question={item.question}
                                answer={item.answer}
                                isOpen={openFAQ === i}
                                onToggle={() =>
                                    setOpenFAQ(openFAQ === i ? null : i)
                                }
                                t={t}
                            />
                        ))}
                    </VStack>
                </VStack>
            </Box>

            {/* ══════════════════════════════════════════════════════════
          CTA — Gradient mesh background
          ══════════════════════════════════════════════════════════ */}
            <Box position="relative" overflow="hidden" py={{ base: "16", md: "28" }}>
                {/* Mesh gradient bg */}
                <Box
                    position="absolute"
                    inset="0"
                    bg={
                        isDark
                            ? "linear-gradient(135deg, rgba(20, 184, 166, 0.06) 0%, rgba(10, 14, 26, 1) 30%, rgba(139, 92, 246, 0.08) 60%, rgba(10, 14, 26, 1) 100%)"
                            : "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(248, 250, 252, 1) 30%, rgba(139, 92, 246, 0.1) 55%, rgba(248, 250, 252, 1) 80%, rgba(59, 130, 246, 0.06) 100%)"
                    }
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    bottom="-80px"
                    left="10%"
                    w="350px"
                    h="350px"
                    borderRadius="full"
                    bg="radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 60%)"
                    filter="blur(50px)"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    top="-50px"
                    right="15%"
                    w="280px"
                    h="280px"
                    borderRadius="full"
                    bg="radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)"
                    filter="blur(40px)"
                    pointerEvents="none"
                />

                <VStack
                    maxW="650px"
                    mx="auto"
                    px="6"
                    gap="6"
                    textAlign="center"
                    position="relative"
                >
                    <Text
                        fontSize={{ base: "2xl", md: "4xl" }}
                        fontWeight="900"
                        color={t.textPrimary}
                        letterSpacing="-0.03em"
                        lineHeight="1.15"
                    >
                        Ready to supercharge
                        <br />
                        your pipeline?
                    </Text>
                    <Text
                        fontSize="md"
                        color={t.textMuted}
                        lineHeight="1.7"
                        maxW="450px"
                    >
                        Join teams already shipping faster and safer with AI-powered impact
                        analysis and intelligent test selection.
                    </Text>
                    <HStack gap="3" mt="2">
                        <Link to="/register">
                            <Flex
                                px="8"
                                py="3.5"
                                borderRadius="full"
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
                                    boxShadow:
                                        "0 8px 30px rgba(20, 184, 166, 0.4)",
                                }}
                                _active={{ transform: "translateY(0)" }}
                            >
                                Get Started Free
                                <Icon boxSize="4">
                                    <LuArrowRight />
                                </Icon>
                            </Flex>
                        </Link>
                        <Link to="/login">
                            <Flex
                                px="7"
                                py="3.5"
                                borderRadius="full"
                                border={`1.5px solid ${t.border}`}
                                color={t.textPrimary}
                                fontSize="sm"
                                fontWeight="600"
                                cursor="pointer"
                                align="center"
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: t.borderAccent,
                                    bg: t.bgHover,
                                }}
                            >
                                Sign In
                            </Flex>
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );
}
