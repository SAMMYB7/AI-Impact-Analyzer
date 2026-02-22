// ═══════════════════════════════════════════════════════════════
// EDIT PR MODAL — Edit pull request details
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    Input,
    Button,
    Icon,
    VStack,
} from "@chakra-ui/react";
import {
    LuX,
    LuPencil,
    LuSave,
    LuUser,
    LuGitBranch,
    LuPackage,
    LuMessageSquare,
    LuLoader,
} from "react-icons/lu";
import { useThemeColors } from "../hooks/useThemeColors";
import { updatePR } from "../api/api";
import { toaster } from "./ui/toaster";

export default function EditPRModal({ isOpen, onClose, pr, onUpdated }) {
    const t = useThemeColors();
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        author: "",
        branch: "",
        repo: "",
        commitMessage: "",
    });

    // Populate form when PR changes
    useEffect(() => {
        if (pr) {
            setForm({
                author: pr.author || "",
                branch: pr.branch || "",
                repo: pr.repo || "",
                commitMessage: pr.commitMessage || "",
            });
        }
    }, [pr]);

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        setSubmitting(true);
        try {
            // Only send changed fields
            const updates = {};
            if (form.author !== pr.author) updates.author = form.author;
            if (form.branch !== pr.branch) updates.branch = form.branch;
            if (form.repo !== pr.repo) updates.repo = form.repo;
            if (form.commitMessage !== pr.commitMessage) updates.commitMessage = form.commitMessage;

            if (Object.keys(updates).length === 0) {
                toaster.create({
                    title: "No Changes",
                    description: "No fields were modified.",
                    type: "info",
                    duration: 3000,
                });
                setSubmitting(false);
                return;
            }

            const result = await updatePR(pr.prId, updates);
            toaster.create({
                title: "PR Updated",
                description: `Successfully updated ${Object.keys(updates).join(", ")}`,
                type: "success",
                duration: 3000,
            });
            if (onUpdated) onUpdated(result.pr);
            onClose();
        } catch (err) {
            const msg = err?.response?.data?.error || err.message;
            toaster.create({
                title: "Update Failed",
                description: msg,
                type: "error",
                duration: 4000,
            });
        } finally {
            setSubmitting(false);
        }
    }

    if (!isOpen || !pr) return null;

    const fields = [
        { key: "author", label: "Author", icon: LuUser, color: "#a78bfa", placeholder: "PR author name" },
        { key: "branch", label: "Branch", icon: LuGitBranch, color: "#14b8a6", placeholder: "Branch name", mono: true },
        { key: "repo", label: "Repository", icon: LuPackage, color: "#3b82f6", placeholder: "owner/repo", mono: true },
        { key: "commitMessage", label: "Commit Message", icon: LuMessageSquare, color: "#f59e0b", placeholder: "Commit or PR description" },
    ];

    const isAnalyzing = pr.status === "analyzing";

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
                w="480px"
                maxW="92vw"
                display="flex"
                flexDirection="column"
                overflow="hidden"
            >
                {/* Header */}
                <Flex px="5" py="4" borderBottom={`1px solid ${t.border}`} align="center" justify="space-between" flexShrink="0">
                    <Flex align="center" gap="2.5">
                        <Flex w="32px" h="32px" borderRadius="lg" bg="rgba(59,130,246,0.12)" align="center" justify="center">
                            <Icon color="#3b82f6" boxSize="4"><LuPencil /></Icon>
                        </Flex>
                        <Box>
                            <Text fontSize="14px" fontWeight="700" color={t.textPrimary}>Edit Pull Request</Text>
                            <Text fontSize="11px" color={t.textMuted} fontFamily="mono">{pr.prId}</Text>
                        </Box>
                    </Flex>
                    <Box as="button" onClick={onClose} p="1" borderRadius="md" _hover={{ bg: t.bgHover }} cursor="pointer">
                        <Icon color={t.textMuted} boxSize="4"><LuX /></Icon>
                    </Box>
                </Flex>

                {/* Body */}
                <Box px="5" py="4" overflowY="auto" css={{ "&::-webkit-scrollbar": { width: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.06)", borderRadius: "2px" } }}>
                    {isAnalyzing && (
                        <Flex
                            mb="4"
                            px="3"
                            py="2.5"
                            borderRadius="lg"
                            bg="rgba(245,158,11,0.08)"
                            border="1px solid rgba(245,158,11,0.2)"
                            align="center"
                            gap="2"
                        >
                            <Icon color="#f59e0b" boxSize="3.5"><LuLoader /></Icon>
                            <Text fontSize="12px" color="#f59e0b" fontWeight="500">
                                This PR is currently being analyzed and cannot be edited.
                            </Text>
                        </Flex>
                    )}

                    <VStack gap="4" align="stretch">
                        {fields.map((field) => (
                            <Box key={field.key}>
                                <Flex align="center" gap="2" mb="1.5">
                                    <Flex
                                        w="20px"
                                        h="20px"
                                        borderRadius="md"
                                        bg={`${field.color}15`}
                                        align="center"
                                        justify="center"
                                        flexShrink="0"
                                    >
                                        <Icon color={field.color} boxSize="2.5">
                                            <field.icon />
                                        </Icon>
                                    </Flex>
                                    <Text fontSize="11px" fontWeight="600" color={t.textMuted} textTransform="uppercase" letterSpacing="0.05em">
                                        {field.label}
                                    </Text>
                                </Flex>
                                <Input
                                    value={form[field.key]}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    fontSize="13px"
                                    fontFamily={field.mono ? "mono" : "inherit"}
                                    color={t.textPrimary}
                                    bg={t.bgInput}
                                    border={`1px solid ${t.border}`}
                                    borderRadius="lg"
                                    px="3"
                                    py="2.5"
                                    _placeholder={{ color: t.textFaint }}
                                    _focus={{
                                        borderColor: "#3b82f6",
                                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                    }}
                                    transition="all 0.2s"
                                    disabled={isAnalyzing}
                                    _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                                />
                            </Box>
                        ))}
                    </VStack>
                </Box>

                {/* Footer */}
                <Flex px="5" py="4" borderTop={`1px solid ${t.border}`} justify="flex-end" gap="2" flexShrink="0">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClose}
                        color={t.textMuted}
                        _hover={{ bg: t.bgHover }}
                        borderRadius="lg"
                        fontSize="12px"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        bg="linear-gradient(135deg, #3b82f6, #8b5cf6)"
                        color="white"
                        borderRadius="lg"
                        fontSize="12px"
                        fontWeight="600"
                        px="5"
                        _hover={{ opacity: 0.9, transform: "scale(1.02)" }}
                        onClick={handleSave}
                        disabled={submitting || isAnalyzing}
                        transition="all 0.15s"
                    >
                        <Icon mr="1.5" boxSize="3.5">{submitting ? <LuLoader /> : <LuSave />}</Icon>
                        {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
}
