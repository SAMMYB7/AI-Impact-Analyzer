// ═══════════════════════════════════════════════════════════════
// STATS BAR — Top-level metrics cards for the Dashboard
// ═══════════════════════════════════════════════════════════════

import { Grid } from "@chakra-ui/react";
import {
  LuGitPullRequest,
  LuShieldAlert,
  LuTestTubeDiagonal,
  LuClock,
} from "react-icons/lu";
import StatCard from "./shared/StatCard";

export default function StatsBar({ prs = [] }) {
  const totalPRs = prs.length;

  // Average risk score across completed PRs
  const completedPRs = prs.filter((p) => p.status === "completed");
  const avgRisk =
    completedPRs.length > 0
      ? Math.round(
          completedPRs.reduce((sum, p) => sum + (p.riskScore || 0), 0) /
            completedPRs.length,
        )
      : 0;

  // Total tests selected
  const totalTests = completedPRs.reduce(
    (sum, p) => sum + (p.selectedTests?.length || 0),
    0,
  );

  // Total estimated time saved (in minutes)
  const timeSaved = Math.round(
    completedPRs.reduce((sum, p) => sum + (p.estimatedTimeSaved || 0), 0) / 60,
  );

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "1fr 1fr",
        lg: "repeat(4, 1fr)",
      }}
      gap="4"
    >
      <StatCard
        label="Total PRs"
        value={totalPRs}
        icon={<LuGitPullRequest />}
        iconColor="#3b82f6"
      />
      <StatCard
        label="Avg Risk Score"
        value={avgRisk}
        suffix="%"
        icon={<LuShieldAlert />}
        iconColor={
          avgRisk > 60 ? "#ef4444" : avgRisk > 30 ? "#f59e0b" : "#10b981"
        }
      />
      <StatCard
        label="Tests Selected"
        value={totalTests}
        icon={<LuTestTubeDiagonal />}
        iconColor="#8b5cf6"
      />
      <StatCard
        label="Time Saved"
        value={timeSaved}
        suffix=" min"
        icon={<LuClock />}
        iconColor="#14b8a6"
      />
    </Grid>
  );
}
