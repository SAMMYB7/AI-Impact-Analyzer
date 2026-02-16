// ═══════════════════════════════════════════════════════════════
// SIMULATE PR MODAL — Create a simulated PR via the backend
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Icon,
  VStack,
  Textarea,
} from "@chakra-ui/react";
import { LuX, LuRocket, LuGitPullRequest } from "react-icons/lu";
import { useThemeColors } from "../hooks/useThemeColors";
import { createPR } from "../api/api";

export default function SimulatePRModal({ isOpen, onClose, onCreated }) {
  const t = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    repo: "my-org/my-repo",
    author: "dev-user",
    branch: "feature/new-feature",
    filesChanged: "src/app.js, src/utils/helper.js",
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      // Build payload matching what the backend expects
      const files = form.filesChanged
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        repository: { full_name: form.repo },
        pull_request: {
          number: Math.floor(Math.random() * 9000) + 1000,
          title: `Simulated PR from ${form.branch}`,
          user: { login: form.author },
          head: { ref: form.branch },
          changed_files: files.length,
          additions: Math.floor(Math.random() * 200) + 10,
          deletions: Math.floor(Math.random() * 50) + 1,
        },
        // Provide files directly so the backend doesn't call GitHub API
        files_override: files,
      };

      const res = await createPR(payload);
      if (onCreated) onCreated(res.data);
      onClose();
      setForm({
        repo: "my-org/my-repo",
        author: "dev-user",
        branch: "feature/new-feature",
        filesChanged: "src/app.js, src/utils/helper.js",
      });
    } catch (err) {
      console.error("Failed to create PR:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="1000"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Backdrop */}
      <Box
        position="absolute"
        inset="0"
        bg="rgba(0,0,0,0.6)"
        backdropFilter="blur(6px)"
        onClick={onClose}
      />

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
        overflow="hidden"
      >
        {/* Header */}
        <Flex
          px="5"
          py="4"
          borderBottom={`1px solid ${t.border}`}
          align="center"
          justify="space-between"
        >
          <Flex align="center" gap="2.5">
            <Flex
              w="32px"
              h="32px"
              borderRadius="lg"
              bg="rgba(59,130,246,0.12)"
              align="center"
              justify="center"
            >
              <Icon color="#3b82f6" boxSize="4">
                <LuGitPullRequest />
              </Icon>
            </Flex>
            <Box>
              <Text fontSize="14px" fontWeight="700" color={t.textPrimary}>
                Simulate Pull Request
              </Text>
              <Text fontSize="11px" color={t.textMuted}>
                Create a mock PR to test the analyzer
              </Text>
            </Box>
          </Flex>
          <Box
            as="button"
            onClick={onClose}
            p="1"
            borderRadius="md"
            _hover={{ bg: t.bgHover }}
            transition="all 0.15s"
            cursor="pointer"
          >
            <Icon color={t.textMuted} boxSize="4">
              <LuX />
            </Icon>
          </Box>
        </Flex>

        {/* Body */}
        <VStack gap="4" px="5" py="5" align="stretch">
          <Box>
            <Text
              fontSize="11px"
              fontWeight="600"
              color={t.textMuted}
              mb="1.5"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Repository
            </Text>
            <Input
              size="sm"
              value={form.repo}
              onChange={(e) => handleChange("repo", e.target.value)}
              bg={t.bgInput}
              border={`1px solid ${t.border}`}
              borderRadius="lg"
              color={t.textPrimary}
              fontFamily="mono"
              fontSize="12px"
              px="3"
              _focus={{
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 1px rgba(59,130,246,0.3)",
              }}
            />
          </Box>

          <Flex gap="3">
            <Box flex="1">
              <Text
                fontSize="11px"
                fontWeight="600"
                color={t.textMuted}
                mb="1.5"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Author
              </Text>
              <Input
                size="sm"
                value={form.author}
                onChange={(e) => handleChange("author", e.target.value)}
                bg={t.bgInput}
                border={`1px solid ${t.border}`}
                borderRadius="lg"
                color={t.textPrimary}
                fontFamily="mono"
                fontSize="12px"
                px="3"
                _focus={{
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 1px rgba(59,130,246,0.3)",
                }}
              />
            </Box>
            <Box flex="1">
              <Text
                fontSize="11px"
                fontWeight="600"
                color={t.textMuted}
                mb="1.5"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Branch
              </Text>
              <Input
                size="sm"
                value={form.branch}
                onChange={(e) => handleChange("branch", e.target.value)}
                bg={t.bgInput}
                border={`1px solid ${t.border}`}
                borderRadius="lg"
                color={t.textPrimary}
                fontFamily="mono"
                fontSize="12px"
                px="3"
                _focus={{
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 1px rgba(59,130,246,0.3)",
                }}
              />
            </Box>
          </Flex>

          <Box>
            <Text
              fontSize="11px"
              fontWeight="600"
              color={t.textMuted}
              mb="1.5"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Files Changed (comma separated)
            </Text>
            <Textarea
              value={form.filesChanged}
              onChange={(e) => handleChange("filesChanged", e.target.value)}
              rows={3}
              bg={t.bgInput}
              border={`1px solid ${t.border}`}
              borderRadius="lg"
              color={t.textPrimary}
              fontFamily="mono"
              fontSize="12px"
              px="3"
              _focus={{
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 1px rgba(59,130,246,0.3)",
              }}
              resize="none"
            />
          </Box>
        </VStack>

        {/* Footer */}
        <Flex
          px="5"
          py="4"
          borderTop={`1px solid ${t.border}`}
          justify="flex-end"
          gap="2"
        >
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
            _hover={{ opacity: 0.9 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            <Icon mr="1.5" boxSize="3.5">
              <LuRocket />
            </Icon>
            {loading ? "Creating..." : "Create PR"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
