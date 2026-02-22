// ═══════════════════════════════════════════════════════════════
// DELETE PR MODAL — Confirmation dialog for PR deletion
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import {
    Box,
    Flex,
    Text,
    Button,
    Icon,
} from "@chakra-ui/react";
import {
    LuX,
    LuTrash2,
    LuTriangleAlert,
    LuLoader,
    LuGitPullRequest,
} from "react-icons/lu";
import { useThemeColors } from "../hooks/useThemeColors";
import { deletePR } from "../api/api";
import { toaster } from "./ui/toaster";

export default function DeletePRModal({ isOpen, onClose, pr, onDeleted }) {
    const t = useThemeColors();
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!pr) return;
        setDeleting(true);
        try {
            await deletePR(pr.prId);
            toaster.create({
                title: "PR Deleted",
                description: `Successfully deleted ${pr.prId}`,
                type: "success",
                duration: 3000,
            });
            if (onDeleted) onDeleted(pr.prId);
            onClose();
        } catch (err) {
            const msg = err?.response?.data?.error || err.message;
            toaster.create({
                title: "Delete Failed",
                description: msg,
                type: "error",
                duration: 4000,
            });
        } finally {
            setDeleting(false);
        }
    }

    if (!isOpen || !pr) return null;

    return (
        <Box position="fixed" inset="0" zIndex="1100" display="flex" alignItems="center" justifyContent="center">
            {/* Backdrop */}
            <Box position="absolute" inset="0" bg="rgba(0,0,0,0.65)" backdropFilter="blur(8px)" onClick={onClose} />

            {/* Modal */}
            <Box
                position="relative"
                bg={t.bgCard}
                backdropFilter={t.backdropBlur}
                border={`1px solid rgba(239, 68, 68, 0.3)`}
                borderRadius="xl"
                boxShadow="0 25px 60px -12px rgba(239, 68, 68, 0.15), 0 25px 60px -12px rgba(0,0,0,0.4)"
                w="420px"
                maxW="92vw"
                overflow="hidden"
            >
                {/* Red danger strip at the top */}
                <Box h="3px" bg="linear-gradient(90deg, #ef4444, #dc2626, #ef4444)" />

                {/* Body */}
                <Box px="6" py="6">
                    {/* Icon & title */}
                    <Flex direction="column" align="center" textAlign="center" mb="5">
                        <Flex
                            w="56px"
                            h="56px"
                            borderRadius="2xl"
                            bg="rgba(239, 68, 68, 0.1)"
                            border="1px solid rgba(239, 68, 68, 0.2)"
                            align="center"
                            justify="center"
                            mb="4"
                        >
                            <Icon color="#ef4444" boxSize="6">
                                <LuTriangleAlert />
                            </Icon>
                        </Flex>
                        <Text fontSize="16px" fontWeight="800" color={t.textPrimary} mb="1.5">
                            Delete Pull Request?
                        </Text>
                        <Text fontSize="13px" color={t.textMuted} lineHeight="1.6" maxW="320px">
                            This action cannot be undone. The PR, its analysis data, pipeline runs, and all logs will be permanently removed.
                        </Text>
                    </Flex>

                    {/* PR Info card */}
                    <Box
                        px="4"
                        py="3"
                        borderRadius="lg"
                        bg={t.bgHover}
                        border={`1px solid ${t.border}`}
                        mb="5"
                    >
                        <Flex align="center" gap="2.5">
                            <Flex
                                w="28px"
                                h="28px"
                                borderRadius="md"
                                bg="rgba(59,130,246,0.08)"
                                align="center"
                                justify="center"
                                flexShrink="0"
                            >
                                <Icon color="#3b82f6" boxSize="3.5"><LuGitPullRequest /></Icon>
                            </Flex>
                            <Box minW="0" flex="1">
                                <Text fontSize="12px" fontWeight="700" color={t.textPrimary} fontFamily="mono" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                    {pr.prId}
                                </Text>
                                <Text fontSize="11px" color={t.textMuted}>
                                    {pr.author} • {pr.branch} • {pr.repo}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    {/* Action Buttons */}
                    <Flex gap="3">
                        <Button
                            flex="1"
                            size="sm"
                            variant="ghost"
                            onClick={onClose}
                            color={t.textMuted}
                            _hover={{ bg: t.bgHover }}
                            borderRadius="lg"
                            fontSize="13px"
                            h="40px"
                            border={`1px solid ${t.border}`}
                        >
                            Cancel
                        </Button>
                        <Button
                            flex="1"
                            size="sm"
                            bg="linear-gradient(135deg, #ef4444, #dc2626)"
                            color="white"
                            borderRadius="lg"
                            fontSize="13px"
                            fontWeight="600"
                            h="40px"
                            _hover={{ opacity: 0.9, transform: "scale(1.01)" }}
                            onClick={handleDelete}
                            disabled={deleting}
                            transition="all 0.15s"
                        >
                            <Icon mr="1.5" boxSize="3.5">{deleting ? <LuLoader /> : <LuTrash2 />}</Icon>
                            {deleting ? "Deleting..." : "Delete PR"}
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
}
