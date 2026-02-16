// ═══════════════════════════════════════════════════════════════
// PIPELINE VIEW — Visual pipeline stage progression
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Icon, HStack } from "@chakra-ui/react";
import {
  LuDownload,
  LuNetwork,
  LuBrain,
  LuTestTubeDiagonal,
  LuPlay,
  LuFileUp,
  LuCheck,
  LuLoader,
  LuCircleX,
  LuCircle,
} from "react-icons/lu";
import GlassCard from "./shared/GlassCard";
import { useThemeColors } from "../hooks/useThemeColors";

const STAGE_META = {
  fetch_changes: { label: "Fetch Changes", icon: LuDownload },
  dependency_mapping: { label: "Dependency Mapping", icon: LuNetwork },
  risk_prediction: { label: "Risk Prediction", icon: LuBrain },
  test_selection: { label: "Test Selection", icon: LuTestTubeDiagonal },
  test_execution: { label: "Test Execution", icon: LuPlay },
  report_upload: { label: "Report Upload", icon: LuFileUp },
};

const STATUS_STYLES = {
  completed: { color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: LuCheck },
  running: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: LuLoader },
  failed: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: LuCircleX },
  pending: { color: "#475569", bg: "rgba(71,85,105,0.08)", icon: LuCircle },
};

export default function PipelineView({ stages = [] }) {
  const t = useThemeColors();

  if (stages.length === 0) {
    return (
      <GlassCard>
        <Flex align="center" justify="center" py="8">
          <Text color={t.textMuted} fontSize="sm">
            No pipeline data — run analysis to see stages
          </Text>
        </Flex>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <Text
        fontSize="11px"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="0.08em"
        color={t.textMuted}
        mb="4"
      >
        Pipeline Stages
      </Text>
      <Flex direction="column" gap="0">
        {stages.map((stage, i) => {
          const meta = STAGE_META[stage.name] || {
            label: stage.name,
            icon: LuCircle,
          };
          const style = STATUS_STYLES[stage.status] || STATUS_STYLES.pending;
          const StageIcon = meta.icon;
          const StatusIcon = style.icon;
          const isLast = i === stages.length - 1;

          return (
            <Flex key={stage.name} align="stretch" gap="3">
              {/* Vertical timeline line + dot */}
              <Flex direction="column" align="center" w="32px" flexShrink="0">
                <Flex
                  w="28px"
                  h="28px"
                  borderRadius="full"
                  bg={style.bg}
                  border={`2px solid ${style.color}`}
                  align="center"
                  justify="center"
                  flexShrink="0"
                  boxShadow={
                    stage.status === "running"
                      ? `0 0 12px ${style.color}40`
                      : "none"
                  }
                >
                  <Icon
                    color={style.color}
                    boxSize="3.5"
                    animation={
                      stage.status === "running"
                        ? "spin 1.5s linear infinite"
                        : "none"
                    }
                  >
                    <StatusIcon />
                  </Icon>
                </Flex>
                {!isLast && (
                  <Box
                    w="2px"
                    flex="1"
                    minH="12px"
                    bg={
                      stage.status === "completed"
                        ? "rgba(16,185,129,0.3)"
                        : t.border
                    }
                  />
                )}
              </Flex>

              {/* Stage info */}
              <Flex
                flex="1"
                pb={isLast ? "0" : "4"}
                align="flex-start"
                gap="3"
                pt="1"
              >
                <Box flex="1">
                  <HStack gap="2" mb="0.5">
                    <Icon color={style.color} boxSize="3.5">
                      <StageIcon />
                    </Icon>
                    <Text
                      fontSize="13px"
                      fontWeight="600"
                      color={t.textPrimary}
                    >
                      {meta.label}
                    </Text>
                  </HStack>
                  <Text fontSize="11px" color={t.textFaint} fontFamily="mono">
                    {stage.status}
                    {stage.completedAt &&
                      ` • ${new Date(stage.completedAt).toLocaleTimeString()}`}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </GlassCard>
  );
}
