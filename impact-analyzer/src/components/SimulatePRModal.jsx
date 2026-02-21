// ═══════════════════════════════════════════════════════════════
// SIMULATE PR MODAL — Import a real PR from connected GitHub
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
  HStack,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import {
  LuX,
  LuRocket,
  LuGitPullRequest,
  LuGithub,
  LuSearch,
  LuChevronRight,
  LuArrowLeft,
  LuGitBranch,
  LuFileCode,
  LuLoader,
  LuLink,
  LuLock,
  LuGlobe,
} from "react-icons/lu";
import { useThemeColors } from "../hooks/useThemeColors";
import { useAuth } from "../context/AuthContext";
import { createPR } from "../api/api";
import API from "../api/api";

export default function SimulatePRModal({ isOpen, onClose, onCreated }) {
  const t = useThemeColors();
  const { user } = useAuth();
  const hasGithub = !!user?.githubUsername;

  // Steps: "repos" → "pulls" → "confirm"
  const [step, setStep] = useState("repos");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Data
  const [repos, setRepos] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedPR, setSelectedPR] = useState(null);
  const [prFiles, setPrFiles] = useState([]);

  // Search
  const [repoSearch, setRepoSearch] = useState("");

  // Reset on close/open
  useEffect(() => {
    if (isOpen) {
      setStep("repos");
      setRepos([]);
      setPulls([]);
      setSelectedRepo(null);
      setSelectedPR(null);
      setPrFiles([]);
      setRepoSearch("");
      if (hasGithub) fetchRepos();
    }
  }, [isOpen]);

  // ── API Calls ─────────────────────────────────────────────
  async function fetchRepos() {
    setLoading(true);
    try {
      const res = await API.get("/api/github/repos");
      setRepos(res.data.repos || []);
    } catch (err) {
      console.error("Failed to fetch repos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPulls(owner, repo) {
    setLoading(true);
    try {
      const res = await API.get(`/api/github/repos/${owner}/${repo}/pulls`);
      setPulls(res.data.pulls || []);
    } catch (err) {
      console.error("Failed to fetch PRs:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPRFiles(owner, repo, number) {
    setLoading(true);
    try {
      const res = await API.get(`/api/github/repos/${owner}/${repo}/pulls/${number}/files`);
      setPrFiles(res.data.files || []);
    } catch (err) {
      console.error("Failed to fetch PR files:", err);
    } finally {
      setLoading(false);
    }
  }

  // ── Handlers ──────────────────────────────────────────────
  function handleSelectRepo(repo) {
    setSelectedRepo(repo);
    setStep("pulls");
    const [owner, name] = repo.full_name.split("/");
    fetchPulls(owner, name);
  }

  function handleSelectPR(pr) {
    setSelectedPR(pr);
    setStep("confirm");
    const [owner, name] = selectedRepo.full_name.split("/");
    fetchPRFiles(owner, name, pr.number);
  }

  function handleBack() {
    if (step === "pulls") {
      setStep("repos");
      setSelectedRepo(null);
      setPulls([]);
    } else if (step === "confirm") {
      setStep("pulls");
      setSelectedPR(null);
      setPrFiles([]);
    }
  }

  async function handleImportPR() {
    if (!selectedPR || !selectedRepo) return;
    setSubmitting(true);
    try {
      const files = prFiles.map((f) => f.filename);
      const payload = {
        repository: { full_name: selectedRepo.full_name },
        pull_request: {
          number: selectedPR.number,
          title: selectedPR.title,
          user: { login: selectedPR.author },
          head: { ref: selectedPR.branch },
          changed_files: files.length,
          additions: selectedPR.additions || 0,
          deletions: selectedPR.deletions || 0,
        },
        files_override: files,
      };

      const res = await createPR(payload);
      if (onCreated) onCreated(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to import PR:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const filteredRepos = repos.filter((r) =>
    r.full_name.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const LANG_COLORS = {
    JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3776ab", Java: "#b07219",
    Go: "#00add8", Rust: "#dea584", Ruby: "#701516", "C#": "#239120", PHP: "#4f5d95",
    CSS: "#563d7c", HTML: "#e34c26", Shell: "#89e051", Swift: "#fa7343", Kotlin: "#a97bff",
  };

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
        w="540px"
        maxW="92vw"
        maxH="80vh"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Header */}
        <Flex px="5" py="4" borderBottom={`1px solid ${t.border}`} align="center" justify="space-between" flexShrink="0">
          <Flex align="center" gap="2.5">
            {step !== "repos" && (
              <Flex as="button" w="28px" h="28px" borderRadius="lg" bg={t.bgInput} border={`1px solid ${t.border}`} align="center" justify="center" cursor="pointer" onClick={handleBack} _hover={{ bg: t.bgHover }} mr="1">
                <Icon color={t.textMuted} boxSize="3.5"><LuArrowLeft /></Icon>
              </Flex>
            )}
            <Flex w="32px" h="32px" borderRadius="lg" bg="rgba(59,130,246,0.12)" align="center" justify="center">
              <Icon color="#3b82f6" boxSize="4"><LuGitPullRequest /></Icon>
            </Flex>
            <Box>
              <Text fontSize="14px" fontWeight="700" color={t.textPrimary}>
                {step === "repos" && "Select Repository"}
                {step === "pulls" && (selectedRepo?.name || "Pull Requests")}
                {step === "confirm" && "Import Pull Request"}
              </Text>
              <Text fontSize="11px" color={t.textMuted}>
                {step === "repos" && "Choose a repo to import PRs from"}
                {step === "pulls" && `${pulls.length} open pull request${pulls.length !== 1 ? "s" : ""}`}
                {step === "confirm" && `PR #${selectedPR?.number} — ${selectedPR?.branch}`}
              </Text>
            </Box>
          </Flex>
          <Box as="button" onClick={onClose} p="1" borderRadius="md" _hover={{ bg: t.bgHover }} cursor="pointer">
            <Icon color={t.textMuted} boxSize="4"><LuX /></Icon>
          </Box>
        </Flex>

        {/* Body */}
        <Box flex="1" overflowY="auto" css={{ "&::-webkit-scrollbar": { width: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.06)", borderRadius: "2px" } }}>
          {!hasGithub ? (
            /* No GitHub connected */
            <VStack py="12" px="6" gap="4" textAlign="center">
              <Flex w="56px" h="56px" borderRadius="2xl" bg="rgba(100, 116, 139, 0.1)" border={`1px solid ${t.border}`} align="center" justify="center">
                <Icon color={t.textMuted} boxSize="7"><LuGithub /></Icon>
              </Flex>
              <Box>
                <Text fontSize="md" fontWeight="700" color={t.textPrimary}>GitHub Not Connected</Text>
                <Text fontSize="sm" color={t.textMuted} mt="1">Connect your GitHub account in Settings to import real pull requests from your repositories.</Text>
              </Box>
              <Flex as="a" href="/settings" px="5" py="2.5" borderRadius="xl" bg="linear-gradient(135deg, #14b8a6, #0d9488)" color="white" fontSize="sm" fontWeight="600" cursor="pointer" align="center" gap="2" _hover={{ transform: "translateY(-1px)", boxShadow: "0 4px 16px rgba(20,184,166,0.35)" }} onClick={onClose}>
                <Icon boxSize="4"><LuLink /></Icon>
                Go to Settings
              </Flex>
            </VStack>
          ) : loading ? (
            /* Loading */
            <Flex align="center" justify="center" py="16" direction="column" gap="3">
              <Spinner size="lg" color="#3b82f6" borderWidth="3px" />
              <Text fontSize="sm" color={t.textMuted}>Loading...</Text>
            </Flex>
          ) : step === "repos" ? (
            /* Repos List */
            <Box>
              {/* Search */}
              <Box px="4" py="3" borderBottom={`1px solid ${t.border}`}>
                <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="lg" px="3" _focusWithin={{ borderColor: "#3b82f6" }}>
                  <Icon color={t.textFaint} boxSize="3.5" mr="2"><LuSearch /></Icon>
                  <Input value={repoSearch} onChange={(e) => setRepoSearch(e.target.value)} placeholder="Search repositories..." border="none" bg="transparent" color={t.textPrimary} fontSize="sm" py="2" outline="none" _focus={{ boxShadow: "none" }} />
                </Flex>
              </Box>
              {filteredRepos.length === 0 ? (
                <Flex align="center" justify="center" py="12">
                  <Text fontSize="sm" color={t.textFaint}>No repositories found</Text>
                </Flex>
              ) : (
                <Flex direction="column">
                  {filteredRepos.map((repo) => (
                    <Flex
                      key={repo.id}
                      as="button"
                      px="5"
                      py="3.5"
                      align="center"
                      justify="space-between"
                      gap="3"
                      cursor="pointer"
                      borderBottom={`1px solid ${t.border}`}
                      _hover={{ bg: t.bgHover }}
                      transition="background 0.15s"
                      onClick={() => handleSelectRepo(repo)}
                      textAlign="left"
                      w="100%"
                    >
                      <Flex align="center" gap="3" minW="0" flex="1">
                        <Flex w="32px" h="32px" borderRadius="lg" bg={repo.private ? "rgba(245,158,11,0.08)" : "rgba(59,130,246,0.08)"} align="center" justify="center" flexShrink="0">
                          <Icon color={repo.private ? "#f59e0b" : "#3b82f6"} boxSize="4">{repo.private ? <LuLock /> : <LuGlobe />}</Icon>
                        </Flex>
                        <Box minW="0">
                          <Text fontSize="13px" fontWeight="600" color={t.textPrimary} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{repo.full_name}</Text>
                          <HStack gap="2" mt="0.5">
                            {repo.language && (
                              <Flex align="center" gap="1">
                                <Box w="7px" h="7px" borderRadius="full" bg={LANG_COLORS[repo.language] || t.textFaint} />
                                <Text fontSize="11px" color={t.textFaint}>{repo.language}</Text>
                              </Flex>
                            )}
                            {repo.description && (
                              <Text fontSize="11px" color={t.textFaint} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" maxW="200px">{repo.description}</Text>
                            )}
                          </HStack>
                        </Box>
                      </Flex>
                      <Icon color={t.textFaint} boxSize="4"><LuChevronRight /></Icon>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>
          ) : step === "pulls" ? (
            /* Pulls List */
            <Box>
              {pulls.length === 0 ? (
                <VStack py="12" gap="3" textAlign="center">
                  <Flex w="48px" h="48px" borderRadius="xl" bg="rgba(100,116,139,0.08)" align="center" justify="center">
                    <Icon color={t.textFaint} boxSize="6"><LuGitPullRequest /></Icon>
                  </Flex>
                  <Text fontSize="sm" color={t.textFaint}>No open pull requests</Text>
                  <Text fontSize="12px" color={t.textFaint}>This repo has no open PRs to import</Text>
                </VStack>
              ) : (
                <Flex direction="column">
                  {pulls.map((pr) => (
                    <Flex
                      key={pr.id}
                      as="button"
                      px="5"
                      py="3.5"
                      align="center"
                      justify="space-between"
                      gap="3"
                      cursor="pointer"
                      borderBottom={`1px solid ${t.border}`}
                      _hover={{ bg: t.bgHover }}
                      transition="background 0.15s"
                      onClick={() => handleSelectPR(pr)}
                      textAlign="left"
                      w="100%"
                    >
                      <Flex align="center" gap="3" minW="0" flex="1">
                        <Flex w="32px" h="32px" borderRadius="lg" bg="rgba(16,185,129,0.08)" align="center" justify="center" flexShrink="0">
                          <Icon color="#10b981" boxSize="4"><LuGitPullRequest /></Icon>
                        </Flex>
                        <Box minW="0">
                          <Text fontSize="13px" fontWeight="600" color={t.textPrimary} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                            #{pr.number} {pr.title}
                          </Text>
                          <HStack gap="2" mt="0.5">
                            <Flex align="center" gap="1">
                              <Icon color={t.textFaint} boxSize="3"><LuGitBranch /></Icon>
                              <Text fontSize="11px" color={t.textFaint} fontFamily="mono">{pr.branch}</Text>
                            </Flex>
                            <Text fontSize="11px" color={t.textFaint}>by {pr.author}</Text>
                          </HStack>
                        </Box>
                      </Flex>
                      <Icon color={t.textFaint} boxSize="4"><LuChevronRight /></Icon>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>
          ) : step === "confirm" ? (
            /* Confirm Import */
            <VStack gap="0" align="stretch">
              {/* PR Summary */}
              <Box px="5" py="4" borderBottom={`1px solid ${t.border}`}>
                <Text fontSize="xs" fontWeight="600" color={t.textMuted} textTransform="uppercase" letterSpacing="0.05em" mb="3">PR Details</Text>
                <VStack gap="2.5" align="stretch">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="12px" color={t.textMuted}>Repository</Text>
                    <Text fontSize="12px" color={t.textPrimary} fontWeight="600" fontFamily="mono">{selectedRepo?.full_name}</Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="12px" color={t.textMuted}>PR Number</Text>
                    <Badge bg="rgba(16,185,129,0.1)" color="#10b981" borderRadius="md" px="2" fontSize="11px" fontWeight="600">#{selectedPR?.number}</Badge>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="12px" color={t.textMuted}>Title</Text>
                    <Text fontSize="12px" color={t.textPrimary} fontWeight="500" maxW="250px" textAlign="right" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{selectedPR?.title}</Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="12px" color={t.textMuted}>Branch</Text>
                    <Text fontSize="12px" color={t.textPrimary} fontFamily="mono" fontWeight="500">{selectedPR?.branch} → {selectedPR?.base}</Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="12px" color={t.textMuted}>Author</Text>
                    <Text fontSize="12px" color={t.textPrimary} fontWeight="500">@{selectedPR?.author}</Text>
                  </Flex>
                </VStack>
              </Box>

              {/* Files Changed */}
              <Box px="5" py="4">
                <Flex justify="space-between" align="center" mb="3">
                  <Text fontSize="xs" fontWeight="600" color={t.textMuted} textTransform="uppercase" letterSpacing="0.05em">Files Changed</Text>
                  <Badge bg="rgba(59,130,246,0.1)" color="#3b82f6" borderRadius="md" px="2" fontSize="11px" fontWeight="600">{prFiles.length} files</Badge>
                </Flex>
                {loading ? (
                  <Flex justify="center" py="4">
                    <Spinner size="sm" color="#3b82f6" />
                  </Flex>
                ) : (
                  <VStack gap="1" align="stretch" maxH="180px" overflowY="auto" css={{ "&::-webkit-scrollbar": { width: "3px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.06)", borderRadius: "2px" } }}>
                    {prFiles.map((file) => (
                      <Flex key={file.filename} align="center" gap="2" px="3" py="1.5" borderRadius="lg" bg={t.bgInput} border={`1px solid ${t.border}`}>
                        <Icon color={t.textFaint} boxSize="3"><LuFileCode /></Icon>
                        <Text fontSize="11px" color={t.textPrimary} fontFamily="mono" flex="1" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{file.filename}</Text>
                        <HStack gap="1.5">
                          <Text fontSize="10px" color="#10b981" fontFamily="mono">+{file.additions}</Text>
                          <Text fontSize="10px" color="#ef4444" fontFamily="mono">-{file.deletions}</Text>
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </Box>
            </VStack>
          ) : null}
        </Box>

        {/* Footer */}
        {step === "confirm" && selectedPR && (
          <Flex px="5" py="4" borderTop={`1px solid ${t.border}`} justify="flex-end" gap="2" flexShrink="0">
            <Button size="sm" variant="ghost" onClick={onClose} color={t.textMuted} _hover={{ bg: t.bgHover }} borderRadius="lg" fontSize="12px">Cancel</Button>
            <Button
              size="sm"
              bg="linear-gradient(135deg, #3b82f6, #8b5cf6)"
              color="white"
              borderRadius="lg"
              fontSize="12px"
              fontWeight="600"
              px="5"
              _hover={{ opacity: 0.9 }}
              onClick={handleImportPR}
              disabled={submitting || prFiles.length === 0}
            >
              <Icon mr="1.5" boxSize="3.5">{submitting ? <LuLoader /> : <LuRocket />}</Icon>
              {submitting ? "Importing..." : `Import PR #${selectedPR.number}`}
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
