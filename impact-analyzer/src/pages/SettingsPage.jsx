// ═══════════════════════════════════════════════════════════════
// SETTINGS PAGE — User profile, security, and integrations
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Grid,
  Icon,
  Badge,
  Input,
  VStack,
  HStack,
  Separator,
} from "@chakra-ui/react";
import {
  LuSettings,
  LuUser,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuGithub,
  LuShield,
  LuLoader,
  LuCheck,
  LuX,
  LuGitBranch,
  LuCircleCheck,
  LuLogOut,
  LuCalendar,
  LuLink,
  LuUnlink,
} from "react-icons/lu";
import GlassCard from "../components/shared/GlassCard";
import { useThemeColors } from "../hooks/useThemeColors";
import { useAuth } from "../context/AuthContext";

import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

export default function SettingsPage() {
  const t = useThemeColors();
  const { user, logout, updateProfile, updatePassword, connectGithub, disconnectGithub } = useAuth();
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // GitHub state
  const [githubLoading, setGithubLoading] = useState(false);

  useEffect(() => {
    if (user) setName(user.name || "");
  }, [user]);


  // Handle GitHub connect callback via URL params
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("github_connect_code");
    if (code) {
      handleGithubConnect(code);
      url.searchParams.delete("github_connect_code");
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

  // ── Handlers ─────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toaster.create({ title: "Name cannot be empty", type: "warning" });
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim() });
      setEditingName(false);
      toaster.create({ title: "Profile updated", type: "success" });
    } catch (err) {
      toaster.create({ title: err?.response?.data?.error || "Update failed", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toaster.create({ title: "Password must be at least 6 characters", type: "warning" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toaster.create({ title: "Passwords don't match", type: "error" });
      return;
    }
    setSavingPassword(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toaster.create({ title: "Password changed successfully", type: "success" });
    } catch (err) {
      toaster.create({ title: err?.response?.data?.error || "Failed", type: "error" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleGithubConnect = async (code) => {
    setGithubLoading(true);
    try {
      await connectGithub(code);
      toaster.create({ title: "GitHub connected!", type: "success" });
    } catch (err) {
      toaster.create({ title: err?.response?.data?.error || "Failed to connect", type: "error" });
    } finally {
      setGithubLoading(false);
    }
  };

  const initiateGithubConnect = () => {
    if (!GITHUB_CLIENT_ID) {
      toaster.create({ title: "GitHub OAuth not configured", type: "error" });
      return;
    }
    // Use a special redirect that brings user back to settings with the code
    const redirectUri = `${window.location.origin}/auth/github/callback?connect=true`;
    const scope = "user:email read:user repo";
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = githubUrl;
  };

  const handleGithubDisconnect = async () => {
    setGithubLoading(true);
    try {
      await disconnectGithub();
      toaster.create({ title: "GitHub disconnected", type: "success" });
    } catch (err) {
      toaster.create({ title: err?.response?.data?.error || "Failed", type: "error" });
    } finally {
      setGithubLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const hasGithub = !!user?.githubUsername;
  const isGithubOnly = user?.authProvider === "github";

  const tabs = [
    { id: "profile", label: "Profile", icon: LuUser },
    { id: "security", label: "Security", icon: LuShield },
    { id: "integrations", label: "Integrations", icon: LuLink },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb="6">
        <Flex align="center" gap="3" mb="1">
          <Flex w="36px" h="36px" borderRadius="lg" bg="rgba(100,116,139,0.1)" align="center" justify="center">
            <Icon color="#64748b" boxSize="5"><LuSettings /></Icon>
          </Flex>
          <Box>
            <Text fontSize="20px" fontWeight="800" color={t.textPrimary} letterSpacing="-0.02em">Settings</Text>
            <Text fontSize="13px" color={t.textMuted}>Manage your profile, security, and integrations</Text>
          </Box>
        </Flex>
      </Box>

      {/* Tab Navigation */}
      <HStack gap="1" mb="6" p="1" bg={t.bgInput} borderRadius="xl" w="fit-content">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Flex
              key={tab.id}
              as="button"
              align="center"
              gap="2"
              px="4"
              py="2"
              borderRadius="lg"
              fontSize="13px"
              fontWeight={isActive ? "600" : "500"}
              color={isActive ? t.textPrimary : t.textMuted}
              bg={isActive ? t.bgCard : "transparent"}
              border={isActive ? `1px solid ${t.border}` : "1px solid transparent"}
              boxShadow={isActive ? t.cardShadow : "none"}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ color: t.textPrimary }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon boxSize="3.5"><TabIcon /></Icon>
              <Text display={{ base: "none", sm: "block" }}>{tab.label}</Text>
            </Flex>
          );
        })}
      </HStack>

      {/* ═══════════ PROFILE TAB ═══════════ */}
      {activeTab === "profile" && (
        <VStack gap="4" align="stretch">
          {/* User Info Card */}
          <GlassCard>
            <Flex align="center" gap="4" mb="6">
              <Flex
                w="64px"
                h="64px"
                borderRadius="2xl"
                bg="linear-gradient(135deg, #14b8a6, #8b5cf6)"
                align="center"
                justify="center"
                fontSize="24px"
                fontWeight="800"
                color="white"
                flexShrink="0"
                overflow="hidden"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || "U"
                )}
              </Flex>
              <Box flex="1">
                <Text fontSize="lg" fontWeight="700" color={t.textPrimary}>{user?.name}</Text>
                <Text fontSize="sm" color={t.textMuted}>{user?.email}</Text>
                <HStack gap="2" mt="1">
                  <Badge bg="rgba(20, 184, 166, 0.1)" color="#14b8a6" borderRadius="md" px="2" py="0.5" fontSize="11px" fontWeight="600">{user?.role}</Badge>
                  <Badge bg="rgba(139, 92, 246, 0.1)" color="#8b5cf6" borderRadius="md" px="2" py="0.5" fontSize="11px" fontWeight="600">{user?.authProvider}</Badge>
                </HStack>
              </Box>
            </Flex>

            <Separator borderColor={t.border} mb="5" />

            {/* Name Field */}
            <Box mb="4">
              <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="2">Display Name</Text>
              <Flex gap="2">
                <Flex align="center" flex="1" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" _focusWithin={{ borderColor: "#14b8a6" }}>
                  <Icon color={t.textFaint} boxSize="4" mr="2"><LuUser /></Icon>
                  <Input
                    value={name}
                    onChange={(e) => { setName(e.target.value); setEditingName(true); }}
                    border="none"
                    bg="transparent"
                    color={t.textPrimary}
                    fontSize="sm"
                    py="2.5"
                    outline="none"
                    _focus={{ boxShadow: "none" }}
                  />
                </Flex>
                {editingName && name !== user?.name && (
                  <HStack gap="1">
                    <Flex as="button" w="40px" h="40px" borderRadius="xl" bg="rgba(20, 184, 166, 0.1)" border="1px solid rgba(20, 184, 166, 0.2)" align="center" justify="center" cursor="pointer" onClick={handleSaveProfile} _hover={{ bg: "rgba(20, 184, 166, 0.2)" }}>
                      {savingProfile ? <Icon boxSize="4" color="#14b8a6" animation="spin 1s linear infinite"><LuLoader /></Icon> : <Icon boxSize="4" color="#14b8a6"><LuCheck /></Icon>}
                    </Flex>
                    <Flex as="button" w="40px" h="40px" borderRadius="xl" bg={t.bgInput} border={`1px solid ${t.border}`} align="center" justify="center" cursor="pointer" onClick={() => { setName(user?.name || ""); setEditingName(false); }}>
                      <Icon boxSize="4" color={t.textFaint}><LuX /></Icon>
                    </Flex>
                  </HStack>
                )}
              </Flex>
            </Box>

            {/* Email (read-only) */}
            <Box mb="4">
              <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="2">Email Address</Text>
              <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" opacity="0.7">
                <Icon color={t.textFaint} boxSize="4" mr="2"><LuMail /></Icon>
                <Input value={user?.email || ""} readOnly border="none" bg="transparent" color={t.textPrimary} fontSize="sm" py="2.5" outline="none" cursor="default" />
                <Icon color={t.textFaint} boxSize="3.5"><LuLock /></Icon>
              </Flex>
              <Text fontSize="11px" color={t.textFaint} mt="1">Email cannot be changed</Text>
            </Box>

            {/* Account Info */}
            <Grid templateColumns="1fr 1fr" gap="3" mt="4">
              <Box bg={t.bgInput} borderRadius="xl" p="3" border={`1px solid ${t.border}`}>
                <Flex align="center" gap="2" mb="1">
                  <Icon color={t.textFaint} boxSize="3.5"><LuCalendar /></Icon>
                  <Text fontSize="11px" color={t.textFaint} fontWeight="500">Joined</Text>
                </Flex>
                <Text fontSize="sm" color={t.textPrimary} fontWeight="600">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}</Text>
              </Box>
              <Box bg={t.bgInput} borderRadius="xl" p="3" border={`1px solid ${t.border}`}>
                <Flex align="center" gap="2" mb="1">
                  <Icon color={t.textFaint} boxSize="3.5"><LuCircleCheck /></Icon>
                  <Text fontSize="11px" color={t.textFaint} fontWeight="500">Last Login</Text>
                </Flex>
                <Text fontSize="sm" color={t.textPrimary} fontWeight="600">{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}</Text>
              </Box>
            </Grid>
          </GlassCard>

          {/* Danger Zone */}
          <GlassCard>
            <Text fontSize="13px" fontWeight="700" color="#ef4444" mb="3">Danger Zone</Text>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" fontWeight="600" color={t.textPrimary}>Log Out</Text>
                <Text fontSize="12px" color={t.textMuted}>Sign out of your account on this device</Text>
              </Box>
              <Flex as="button" px="4" py="2" borderRadius="xl" bg="rgba(239, 68, 68, 0.1)" border="1px solid rgba(239, 68, 68, 0.2)" color="#ef4444" fontSize="13px" fontWeight="600" cursor="pointer" align="center" gap="2" _hover={{ bg: "rgba(239, 68, 68, 0.2)" }} onClick={handleLogout}>
                <Icon boxSize="4"><LuLogOut /></Icon>
                Log Out
              </Flex>
            </Flex>
          </GlassCard>
        </VStack>
      )}

      {/* ═══════════ SECURITY TAB ═══════════ */}
      {activeTab === "security" && (
        <VStack gap="4" align="stretch">
          <GlassCard>
            <Flex align="center" gap="2" mb="5">
              <Flex w="28px" h="28px" borderRadius="lg" bg="rgba(139, 92, 246, 0.1)" align="center" justify="center">
                <Icon color="#8b5cf6" boxSize="3.5"><LuLock /></Icon>
              </Flex>
              <Text fontSize="14px" fontWeight="700" color={t.textPrimary}>Change Password</Text>
            </Flex>

            {isGithubOnly && !user?.password ? (
              <Box bg="rgba(245, 158, 11, 0.08)" border="1px solid rgba(245, 158, 11, 0.2)" borderRadius="xl" p="4">
                <Text fontSize="sm" color="#f59e0b" fontWeight="600">GitHub-only Account</Text>
                <Text fontSize="12px" color={t.textMuted} mt="1">You signed up via GitHub and don't have a password. Set one below to enable email login.</Text>
              </Box>
            ) : null}

            <VStack gap="3" mt="4">
              {/* Current Password — only show if user has one */}
              {user?.authProvider === "local" && (
                <Box w="100%">
                  <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="1.5">Current Password</Text>
                  <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" _focusWithin={{ borderColor: "#8b5cf6" }}>
                    <Icon color={t.textFaint} boxSize="4" mr="2"><LuLock /></Icon>
                    <Input type={showPasswords ? "text" : "password"} placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} border="none" bg="transparent" color={t.textPrimary} fontSize="sm" py="2.5" outline="none" flex="1" />
                  </Flex>
                </Box>
              )}

              <Box w="100%">
                <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="1.5">New Password</Text>
                <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" _focusWithin={{ borderColor: "#8b5cf6" }}>
                  <Icon color={t.textFaint} boxSize="4" mr="2"><LuLock /></Icon>
                  <Input type={showPasswords ? "text" : "password"} placeholder="Min 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} border="none" bg="transparent" color={t.textPrimary} fontSize="sm" py="2.5" outline="none" flex="1" />
                  <Icon color={t.textFaint} boxSize="4" cursor="pointer" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <LuEyeOff /> : <LuEye />}</Icon>
                </Flex>
              </Box>

              <Box w="100%">
                <Text fontSize="xs" fontWeight="600" color={t.textSecondary} mb="1.5">Confirm New Password</Text>
                <Flex align="center" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" px="3" _focusWithin={{ borderColor: newPassword && confirmPassword === newPassword ? "#10b981" : "#8b5cf6" }}>
                  <Icon color={t.textFaint} boxSize="4" mr="2"><LuLock /></Icon>
                  <Input type={showPasswords ? "text" : "password"} placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} border="none" bg="transparent" color={t.textPrimary} fontSize="sm" py="2.5" outline="none" flex="1" />
                  {confirmPassword && confirmPassword === newPassword && <Icon color="#10b981" boxSize="4"><LuCheck /></Icon>}
                </Flex>
              </Box>

              <Flex as="button" w="100%" py="3" mt="2" bg="linear-gradient(135deg, #8b5cf6, #7c3aed)" color="white" borderRadius="xl" fontSize="sm" fontWeight="700" display="flex" alignItems="center" justifyContent="center" gap="2" cursor={savingPassword ? "not-allowed" : "pointer"} opacity={savingPassword ? 0.7 : 1} transition="all 0.2s" _hover={{ transform: "translateY(-1px)", boxShadow: "0 8px 24px rgba(139, 92, 246, 0.35)" }} onClick={handleChangePassword}>
                {savingPassword ? <Icon boxSize="4" animation="spin 1s linear infinite"><LuLoader /></Icon> : <Icon boxSize="4"><LuShield /></Icon>}
                {isGithubOnly ? "Set Password" : "Update Password"}
              </Flex>
            </VStack>
          </GlassCard>

          {/* Security Info */}
          <GlassCard>
            <Text fontSize="13px" fontWeight="700" color={t.textPrimary} mb="3">Security Overview</Text>
            <VStack gap="3" align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="12px" color={t.textMuted}>Authentication</Text>
                <Badge bg="rgba(16, 185, 129, 0.1)" color="#10b981" borderRadius="md" px="2" fontSize="11px" fontWeight="600">{user?.authProvider === "github" ? "GitHub OAuth" : "Email + Password"}</Badge>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="12px" color={t.textMuted}>Password Set</Text>
                <Badge bg={user?.authProvider === "local" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)"} color={user?.authProvider === "local" ? "#10b981" : "#f59e0b"} borderRadius="md" px="2" fontSize="11px" fontWeight="600">{user?.authProvider === "local" ? "Yes" : "Optional"}</Badge>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="12px" color={t.textMuted}>Encryption</Text>
                <Text fontSize="12px" color={t.textPrimary} fontWeight="500" fontFamily="mono">AES-256 / bcrypt</Text>
              </Flex>
            </VStack>
          </GlassCard>
        </VStack>
      )}

      {/* ═══════════ INTEGRATIONS TAB ═══════════ */}
      {activeTab === "integrations" && (
        <VStack gap="4" align="stretch">
          {/* GitHub Integration */}
          <GlassCard>
            <Flex align="center" gap="3" mb="5">
              <Flex w="40px" h="40px" borderRadius="xl" bg={hasGithub ? "rgba(16, 185, 129, 0.1)" : t.bgInput} border={`1px solid ${hasGithub ? "rgba(16, 185, 129, 0.2)" : t.border}`} align="center" justify="center">
                <Icon color={hasGithub ? "#10b981" : t.textMuted} boxSize="5"><LuGithub /></Icon>
              </Flex>
              <Box flex="1">
                <Text fontSize="14px" fontWeight="700" color={t.textPrimary}>GitHub</Text>
                <Text fontSize="12px" color={t.textMuted}>
                  {hasGithub ? `Connected as @${user.githubUsername}` : "Connect your GitHub account for OAuth and repository access"}
                </Text>
              </Box>
              <Badge bg={hasGithub ? "rgba(16, 185, 129, 0.1)" : "rgba(100, 116, 139, 0.1)"} color={hasGithub ? "#10b981" : t.textMuted} borderRadius="full" px="3" py="1" fontSize="11px" fontWeight="600">
                {hasGithub ? "Connected" : "Not Connected"}
              </Badge>
            </Flex>

            {hasGithub ? (
              <Flex gap="3" direction={{ base: "column", sm: "row" }}>
                <Box flex="1" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" p="3">
                  <Flex align="center" gap="2" mb="1">
                    <Icon color={t.textFaint} boxSize="3.5"><LuUser /></Icon>
                    <Text fontSize="11px" color={t.textFaint}>Username</Text>
                  </Flex>
                  <Text fontSize="sm" color={t.textPrimary} fontWeight="600" fontFamily="mono">@{user.githubUsername}</Text>
                </Box>
                <Flex as="button" px="4" py="3" borderRadius="xl" bg="rgba(239, 68, 68, 0.08)" border="1px solid rgba(239, 68, 68, 0.15)" color="#ef4444" fontSize="13px" fontWeight="600" align="center" justify="center" gap="2" cursor={githubLoading ? "not-allowed" : "pointer"} _hover={{ bg: "rgba(239, 68, 68, 0.15)" }} onClick={handleGithubDisconnect} flexShrink="0">
                  {githubLoading ? <Icon boxSize="4" animation="spin 1s linear infinite"><LuLoader /></Icon> : <Icon boxSize="4"><LuUnlink /></Icon>}
                  Disconnect
                </Flex>
              </Flex>
            ) : (
              <Flex as="button" w="100%" py="3" bg={t.bgInput} border={`1px solid ${t.border}`} borderRadius="xl" fontSize="sm" fontWeight="600" color={t.textPrimary} display="flex" alignItems="center" justifyContent="center" gap="3" cursor={githubLoading ? "not-allowed" : "pointer"} _hover={{ bg: t.bgHover, borderColor: t.borderAccent }} transition="all 0.2s" onClick={initiateGithubConnect}>
                {githubLoading ? <Icon boxSize="4" animation="spin 1s linear infinite"><LuLoader /></Icon> : <Icon boxSize="5"><LuGithub /></Icon>}
                Connect GitHub Account
              </Flex>
            )}
          </GlassCard>

          {/* Webhook Info */}
          <GlassCard>
            <Flex align="center" gap="2" mb="4">
              <Flex w="28px" h="28px" borderRadius="lg" bg="rgba(20, 184, 166, 0.1)" align="center" justify="center">
                <Icon color="#14b8a6" boxSize="3.5"><LuGitBranch /></Icon>
              </Flex>
              <Text fontSize="13px" fontWeight="700" color={t.textPrimary}>GitHub Webhook</Text>
            </Flex>
            <VStack gap="2.5" align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="12px" color={t.textMuted}>Status</Text>
                <Badge bg="rgba(16, 185, 129, 0.1)" color="#10b981" borderRadius="md" px="2" fontSize="11px" fontWeight="600">Active</Badge>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="12px" color={t.textMuted}>Endpoint</Text>
                <Text fontSize="12px" color={t.textPrimary} fontWeight="500" fontFamily="mono">POST /api/webhook/github</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="12px" color={t.textMuted}>Payload Types</Text>
                <Text fontSize="12px" color={t.textPrimary} fontWeight="500">GitHub native, Simulated</Text>
              </Flex>
            </VStack>
          </GlassCard>
        </VStack>
      )}


      {/* Version footer */}
      <Flex justify="center" mt="8" mb="4" gap="3" align="center">
        <Text fontSize="11px" color={t.textFaint}>Impact Analyzer v2.4.1</Text>
        <Text fontSize="11px" color={t.textFaint}>•</Text>
        <Text fontSize="11px" color={t.textFaint} fontFamily="mono">Node.js + Express + MongoDB</Text>
      </Flex>
    </Box>
  );
}
