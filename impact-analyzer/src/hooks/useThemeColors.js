// ═══════════════════════════════════════════════════════════════
// THEME COLORS HOOK — Professional slate/emerald enterprise palette
// ═══════════════════════════════════════════════════════════════

import { useColorMode } from "../components/ui/color-mode";

export function useThemeColors() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return {
    isDark,

    // ── Backgrounds ────────────────────────────────────────
    bg: isDark ? "#0c0f1a" : "#f4f6f9",
    bgCard: isDark ? "rgba(17, 21, 38, 0.72)" : "rgba(255, 255, 255, 0.92)",
    bgCardSolid: isDark ? "#111526" : "#ffffff",
    bgSidebar: isDark ? "rgba(12, 15, 28, 0.92)" : "rgba(255, 255, 255, 0.98)",
    bgNavbar: isDark ? "rgba(12, 15, 28, 0.75)" : "rgba(255, 255, 255, 0.88)",
    bgHover: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    bgSubtle: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.018)",
    bgInput: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)",
    bgElevated: isDark ? "rgba(22, 27, 48, 0.9)" : "rgba(255, 255, 255, 0.96)",

    // ── Borders ────────────────────────────────────────────
    border: isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.07)",
    borderLight: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.04)",
    borderAccent: isDark
      ? "rgba(94, 234, 212, 0.2)"
      : "rgba(13, 148, 136, 0.2)",

    // ── Text ───────────────────────────────────────────────
    textPrimary: isDark ? "#f1f5f9" : "#0f172a",
    textSecondary: isDark ? "rgba(241,245,249,0.72)" : "rgba(15,23,42,0.68)",
    textMuted: isDark ? "rgba(241,245,249,0.48)" : "rgba(15,23,42,0.44)",
    textFaint: isDark ? "rgba(241,245,249,0.32)" : "rgba(15,23,42,0.3)",

    // ── Scrollbar ──────────────────────────────────────────
    scrollThumb: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",

    // ── Backdrop ───────────────────────────────────────────
    backdropBlur: isDark ? "blur(20px)" : "blur(14px)",

    // ── Shadows ────────────────────────────────────────────
    cardShadow: isDark
      ? "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)"
      : "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    cardHoverShadow: isDark
      ? "0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)"
      : "0 8px 30px rgba(0,0,0,0.08)",
    dropShadow: isDark
      ? "0 20px 60px rgba(0,0,0,0.5)"
      : "0 20px 50px rgba(0,0,0,0.12)",

    // ── Brand / Accent (Teal/Emerald) ──────────────────────
    accent: "#14b8a6",
    accentLight: isDark
      ? "rgba(20, 184, 166, 0.1)"
      : "rgba(13, 148, 136, 0.08)",
    accentText: isDark ? "#5eead4" : "#0d9488",
    accentSolid: "#0d9488",
    accentGlow: "rgba(20, 184, 166, 0.25)",

    // ── Semantic ───────────────────────────────────────────
    success: "#10b981",
    successBg: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.06)",
    successBorder: isDark
      ? "rgba(16, 185, 129, 0.2)"
      : "rgba(16, 185, 129, 0.15)",

    warning: "#f59e0b",
    warningBg: isDark ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.06)",
    warningBorder: isDark
      ? "rgba(245, 158, 11, 0.2)"
      : "rgba(245, 158, 11, 0.15)",

    error: "#ef4444",
    errorBg: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.06)",
    errorBorder: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.15)",

    info: "#3b82f6",
    infoBg: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.06)",
    infoBorder: isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)",

    // ── Chart Colors ───────────────────────────────────────
    chart1: "#14b8a6",
    chart2: "#8b5cf6",
    chart3: "#3b82f6",
    chart4: "#f59e0b",
    chart5: "#ef4444",
    chart6: "#ec4899",
  };
}
