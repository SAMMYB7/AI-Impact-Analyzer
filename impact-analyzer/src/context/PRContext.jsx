// ═══════════════════════════════════════════════════════════════
// PR PROVIDER — Component-only file for fast refresh
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import { getAllPRs as fetchAllPRs } from "../api/api";
import { PRContext } from "./PRContextDef";

export function PRProvider({ children }) {
  const [prs, setPrs] = useState([]);
  const [currentPR, setCurrentPR] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all PRs from backend
  const refreshPRs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllPRs();
      setPrs(data);
    } catch (err) {
      console.error("Failed to fetch PRs:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    prs,
    setPrs,
    currentPR,
    setCurrentPR,
    logs,
    setLogs,
    loading,
    refreshPRs,
  };

  return <PRContext.Provider value={value}>{children}</PRContext.Provider>;
}
