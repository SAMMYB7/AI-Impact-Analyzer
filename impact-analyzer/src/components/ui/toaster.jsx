"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import {
  LuCircleCheck,
  LuTriangleAlert,
  LuCircleX,
  LuInfo,
  LuX,
  LuLoader,
} from "react-icons/lu";
import { useColorMode } from "./color-mode";

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  overlap: false,
  gap: 12,
  max: 4,
});

// ── Type-specific accent colors (shared across themes) ───────
const TYPE_ACCENT = {
  success: { icon: LuCircleCheck, accent: "#10b981" },
  warning: { icon: LuTriangleAlert, accent: "#f59e0b" },
  error: { icon: LuCircleX, accent: "#ef4444" },
  info: { icon: LuInfo, accent: "#3b82f6" },
  loading: { icon: LuLoader, accent: "#3b82f6" },
};

// ── Theme-aware toast surface colors ─────────────────────────
const THEME = {
  dark: {
    bg: "rgba(10, 14, 26, 0.92)",
    titleColor: "#f1f5f9",
    descColor: "#94a3b8",
    closeColor: "#475569",
    shadow: (accent) => `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${accent}15`,
    iconBgAlpha: 0.06,
    borderAlpha: 0.25,
  },
  light: {
    bg: "rgba(255, 255, 255, 0.95)",
    titleColor: "#0f172a",
    descColor: "#475569",
    closeColor: "#94a3b8",
    shadow: (accent) => `0 8px 32px rgba(0, 0, 0, 0.08), 0 0 20px ${accent}10`,
    iconBgAlpha: 0.08,
    borderAlpha: 0.2,
  },
};

// Helpers to compute rgba from hex + alpha
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const Toaster = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const theme = isDark ? THEME.dark : THEME.light;

  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
          const typeCfg = TYPE_ACCENT[toast.type] || TYPE_ACCENT.info;
          const IconComp = typeCfg.icon;
          const accent = typeCfg.accent;
          const iconBg = hexToRgba(accent, theme.iconBgAlpha);
          const borderColor = hexToRgba(accent, theme.borderAlpha);

          return (
            <Toast.Root
              width={{ base: "340px", md: "400px" }}
              style={{
                background: theme.bg,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: `1px solid ${borderColor}`,
                borderLeft: `3px solid ${accent}`,
                borderRadius: "12px",
                boxShadow: theme.shadow(accent),
                padding: "14px 16px",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: iconBg,
                  border: `1px solid ${borderColor}`,
                  flexShrink: 0,
                }}
              >
                {toast.type === "loading" ? (
                  <Spinner size="sm" color="blue.solid" />
                ) : (
                  <IconComp style={{ color: accent, width: 18, height: 18 }} />
                )}
              </div>

              {/* Content */}
              <Stack gap="1" flex="1" maxWidth="100%" ml="2">
                {toast.title && (
                  <Toast.Title
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: theme.titleColor,
                      letterSpacing: "0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {toast.title}
                  </Toast.Title>
                )}
                {toast.description && (
                  <Toast.Description
                    style={{
                      fontSize: "12px",
                      color: theme.descColor,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {toast.description}
                  </Toast.Description>
                )}
              </Stack>

              {/* Close button */}
              <Toast.CloseTrigger
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  color: theme.closeColor,
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.15s, background 0.15s",
                }}
              >
                <LuX style={{ width: 14, height: 14 }} />
              </Toast.CloseTrigger>
            </Toast.Root>
          );
        }}
      </ChakraToaster>
    </Portal>
  );
};
