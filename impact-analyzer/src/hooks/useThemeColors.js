// ═══════════════════════════════════════════════════════════════
// THEME COLORS — Centralized color tokens for dark/light mode
// ═══════════════════════════════════════════════════════════════

import { useColorMode } from "../components/ui/color-mode";

const darkColors = {
  // Backgrounds
  bg: "#0a0e1a",
  bgCard: "rgba(15, 23, 42, 0.8)",
  bgSidebar: "rgba(10, 14, 26, 0.95)",
  bgHover: "rgba(148, 163, 184, 0.06)",
  bgInput: "rgba(15, 23, 42, 0.6)",

  // Borders
  border: "rgba(148, 163, 184, 0.08)",
  borderAccent: "rgba(59, 130, 246, 0.3)",

  // Text
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  textFaint: "#475569",

  // Status
  success: "#10b981",
  successBg: "rgba(16, 185, 129, 0.1)",
  error: "#ef4444",
  errorBg: "rgba(239, 68, 68, 0.1)",
  warning: "#f59e0b",
  warningBg: "rgba(245, 158, 11, 0.1)",
  accent: "#3b82f6",
  accentBg: "rgba(59, 130, 246, 0.1)",

  // Cards
  cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
  cardHoverShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
  backdropBlur: "blur(20px)",

  // Misc
  scrollThumb: "rgba(148, 163, 184, 0.15)",
  divider: "rgba(148, 163, 184, 0.08)",
};

const lightColors = {
  bg: "#f8fafc",
  bgCard: "rgba(255, 255, 255, 0.9)",
  bgSidebar: "rgba(255, 255, 255, 0.95)",
  bgHover: "rgba(100, 116, 139, 0.06)",
  bgInput: "rgba(241, 245, 249, 0.8)",

  border: "rgba(100, 116, 139, 0.15)",
  borderAccent: "rgba(59, 130, 246, 0.4)",

  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#64748b",
  textFaint: "#94a3b8",

  success: "#059669",
  successBg: "rgba(5, 150, 105, 0.08)",
  error: "#dc2626",
  errorBg: "rgba(220, 38, 38, 0.08)",
  warning: "#d97706",
  warningBg: "rgba(217, 119, 6, 0.08)",
  accent: "#2563eb",
  accentBg: "rgba(37, 99, 235, 0.08)",

  cardShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
  cardHoverShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
  backdropBlur: "blur(20px)",

  scrollThumb: "rgba(100, 116, 139, 0.2)",
  divider: "rgba(100, 116, 139, 0.12)",
};

export function useThemeColors() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? darkColors : lightColors;
}
