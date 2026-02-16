// ═══════════════════════════════════════════════════════════════
// PR TABLE — Professional PR list table for the Dashboard
// ═══════════════════════════════════════════════════════════════

import { Box, Flex, Text, Table, Icon, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  LuChevronRight,
  LuGitPullRequest,
  LuUser,
  LuGitBranch,
} from "react-icons/lu";
import GlassCard from "./shared/GlassCard";
import StatusBadge from "./shared/StatusBadge";
import { useThemeColors } from "../hooks/useThemeColors";

// Risk score color
function riskColor(score) {
  if (score >= 70) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  return "#10b981";
}

export default function PRTable({ prs = [] }) {
  const navigate = useNavigate();
  const t = useThemeColors();

  if (prs.length === 0) {
    return (
      <GlassCard>
        <Flex
          direction="column"
          align="center"
          justify="center"
          py="16"
          gap="3"
        >
          <Icon color={t.textMuted} boxSize="10">
            <LuGitPullRequest />
          </Icon>
          <Text color={t.textMuted} fontSize="md" fontWeight="500">
            No pull requests yet
          </Text>
          <Text color={t.textFaint} fontSize="sm">
            Simulate a PR to get started
          </Text>
        </Flex>
      </GlassCard>
    );
  }

  return (
    <GlassCard noPadding>
      <Box overflowX="auto">
        <Table.Root size="sm" variant="plain">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader
                px="4"
                py="3"
                fontSize="10px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
                borderBottom={`1px solid ${t.border}`}
              >
                PR ID
              </Table.ColumnHeader>
              <Table.ColumnHeader
                px="4"
                py="3"
                fontSize="10px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
                borderBottom={`1px solid ${t.border}`}
              >
                Author
              </Table.ColumnHeader>
              <Table.ColumnHeader
                px="4"
                py="3"
                fontSize="10px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
                borderBottom={`1px solid ${t.border}`}
              >
                Branch
              </Table.ColumnHeader>
              <Table.ColumnHeader
                px="4"
                py="3"
                fontSize="10px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
                borderBottom={`1px solid ${t.border}`}
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader
                px="4"
                py="3"
                fontSize="10px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
                borderBottom={`1px solid ${t.border}`}
              >
                Risk
              </Table.ColumnHeader>
              <Table.ColumnHeader
                px="4"
                py="3"
                fontSize="10px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color={t.textMuted}
                borderBottom={`1px solid ${t.border}`}
              >
                Files
              </Table.ColumnHeader>
              <Table.ColumnHeader
                px="4"
                py="3"
                borderBottom={`1px solid ${t.border}`}
              />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {prs.map((pr) => (
              <Table.Row
                key={pr.prId}
                cursor="pointer"
                transition="all 0.15s ease"
                _hover={{ bg: t.bgHover }}
                onClick={() => navigate(`/pr/${pr.prId}`)}
              >
                <Table.Cell
                  px="4"
                  py="3"
                  borderBottom={`1px solid ${t.border}`}
                >
                  <HStack gap="2">
                    <Icon color="#3b82f6" boxSize="3.5">
                      <LuGitPullRequest />
                    </Icon>
                    <Text
                      fontSize="13px"
                      fontWeight="600"
                      color={t.textPrimary}
                      fontFamily="mono"
                    >
                      {pr.prId}
                    </Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell
                  px="4"
                  py="3"
                  borderBottom={`1px solid ${t.border}`}
                >
                  <HStack gap="1.5">
                    <Icon color={t.textMuted} boxSize="3">
                      <LuUser />
                    </Icon>
                    <Text fontSize="13px" color={t.textSecondary}>
                      {pr.author}
                    </Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell
                  px="4"
                  py="3"
                  borderBottom={`1px solid ${t.border}`}
                >
                  <HStack gap="1.5">
                    <Icon color={t.textMuted} boxSize="3">
                      <LuGitBranch />
                    </Icon>
                    <Text
                      fontSize="13px"
                      color={t.textSecondary}
                      fontFamily="mono"
                    >
                      {pr.branch}
                    </Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell
                  px="4"
                  py="3"
                  borderBottom={`1px solid ${t.border}`}
                >
                  <StatusBadge status={pr.status} />
                </Table.Cell>
                <Table.Cell
                  px="4"
                  py="3"
                  borderBottom={`1px solid ${t.border}`}
                >
                  {pr.status === "completed" ? (
                    <Text
                      fontSize="13px"
                      fontWeight="700"
                      color={riskColor(pr.riskScore)}
                    >
                      {pr.riskScore}%
                    </Text>
                  ) : (
                    <Text fontSize="13px" color={t.textFaint}>
                      —
                    </Text>
                  )}
                </Table.Cell>
                <Table.Cell
                  px="4"
                  py="3"
                  borderBottom={`1px solid ${t.border}`}
                >
                  <Text fontSize="13px" color={t.textMuted}>
                    {pr.filesChanged?.length || 0}
                  </Text>
                </Table.Cell>
                <Table.Cell
                  px="4"
                  py="3"
                  borderBottom={`1px solid ${t.border}`}
                >
                  <Icon color={t.textFaint} boxSize="4">
                    <LuChevronRight />
                  </Icon>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </GlassCard>
  );
}
