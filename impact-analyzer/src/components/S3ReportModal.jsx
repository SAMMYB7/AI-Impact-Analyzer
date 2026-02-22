import { Box, Flex, Text, Icon, Button } from "@chakra-ui/react";
import { LuX, LuPackage, LuCheck } from "react-icons/lu";
import { useThemeColors } from "../hooks/useThemeColors";

export default function S3ReportModal({ isOpen, onClose, reportData }) {
    const t = useThemeColors();

    if (!isOpen || !reportData) return null;

    // Defensive parsing just in case it's a string somehow
    let data;
    try {
        data = typeof reportData === "string" ? JSON.parse(reportData) : reportData;
    } catch {
        data = {};
    }

    return (
        <Box position="fixed" inset="0" zIndex="1000" display="flex" alignItems="center" justifyContent="center">
            {/* Backdrop */}
            <Box position="absolute" inset="0" bg="rgba(0,0,0,0.6)" backdropFilter="blur(6px)" onClick={onClose} />

            {/* Modal */}
            <Box
                position="relative"
                bg={t.bgCard}
                backdropFilter={t.backdropBlur}
                border={`1px solid ${t.borderAccent}`}
                borderRadius="xl"
                boxShadow="0 25px 60px -12px rgba(0,0,0,0.5)"
                w="600px"
                maxW="92vw"
                maxH="85vh"
                display="flex"
                flexDirection="column"
                overflow="hidden"
            >
                {/* Header */}
                <Flex px="5" py="4" borderBottom={`1px solid ${t.border}`} align="center" justify="space-between" flexShrink="0">
                    <Flex align="center" gap="2.5">
                        <Flex w="32px" h="32px" borderRadius="lg" bg="rgba(16,185,129,0.12)" align="center" justify="center">
                            <Icon color="#10b981" boxSize="4"><LuPackage /></Icon>
                        </Flex>
                        <Box>
                            <Text fontSize="14px" fontWeight="700" color={t.textPrimary}>S3 Test Report</Text>
                            <Text fontSize="11px" color={t.textMuted} fontFamily="mono">{data.prId || "Unknown PR"}</Text>
                        </Box>
                    </Flex>
                    <Box as="button" onClick={onClose} p="1" borderRadius="md" _hover={{ bg: t.bgHover }} cursor="pointer">
                        <Icon color={t.textMuted} boxSize="4"><LuX /></Icon>
                    </Box>
                </Flex>

                {/* Body */}
                <Box px="5" py="4" overflowY="auto" css={{ "&::-webkit-scrollbar": { width: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.06)", borderRadius: "2px" } }}>

                    <Flex gap="4" mb="4">
                        <Box flex="1" p="3" borderRadius="lg" bg={t.bgInput} border={`1px solid ${t.border}`}>
                            <Text fontSize="10px" color={t.textFaint} textTransform="uppercase" fontWeight="600">Timestamp</Text>
                            <Text fontSize="12px" color={t.textPrimary} mt="1">{data.timestamp ? new Date(data.timestamp).toLocaleString() : "—"}</Text>
                        </Box>
                        <Box flex="1" p="3" borderRadius="lg" bg={t.bgInput} border={`1px solid ${t.border}`}>
                            <Text fontSize="10px" color={t.textFaint} textTransform="uppercase" fontWeight="600">Build Status</Text>
                            <Text fontSize="12px" color={data.buildStatus === "SUCCEEDED" ? "#10b981" : "#ef4444"} mt="1" fontWeight="700">{data.buildStatus || "—"}</Text>
                        </Box>
                    </Flex>

                    {data.testResults && (
                        <Box p="3" borderRadius="lg" bg={t.bgInput} border={`1px solid ${t.border}`} mb="4">
                            <Text fontSize="10px" color={t.textFaint} textTransform="uppercase" fontWeight="600" mb="2">Test Results Overview</Text>
                            <Flex gap="4">
                                <Flex align="center" gap="1.5">
                                    <Icon color="#10b981"><LuCheck /></Icon>
                                    <Text fontSize="12px" color={t.textPrimary} fontWeight="600">{data.testResults.passed || 0} passed</Text>
                                </Flex>
                                <Flex align="center" gap="1.5">
                                    <Icon color="#ef4444"><LuX /></Icon>
                                    <Text fontSize="12px" color={t.textPrimary} fontWeight="600">{data.testResults.failed || 0} failed</Text>
                                </Flex>
                            </Flex>
                        </Box>
                    )}

                    {data.selectedTests && data.selectedTests.length > 0 && (
                        <Box p="3" borderRadius="lg" bg={t.bgInput} border={`1px solid ${t.border}`}>
                            <Text fontSize="10px" color={t.textFaint} textTransform="uppercase" fontWeight="600" mb="2">Selected Tests Executed</Text>
                            <Flex direction="column" gap="1">
                                {data.selectedTests.map((test, i) => (
                                    <Flex key={i} p="1.5" px="2" borderRadius="md" bg={t.bgHover} align="center" gap="2">
                                        <Box w="6px" h="6px" borderRadius="full" bg="#3b82f6" flexShrink="0" />
                                        <Text fontSize="11px" color={t.textSecondary} fontFamily="mono" truncate>{test}</Text>
                                    </Flex>
                                ))}
                            </Flex>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
}
