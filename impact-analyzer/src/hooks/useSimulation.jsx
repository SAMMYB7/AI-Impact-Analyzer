// ═══════════════════════════════════════════════════════════════
// SIMULATION PROVIDER — Component-only file for fast refresh
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import { SimulationContext } from "./SimulationContext";

export function SimulationProvider({ children }) {
  const [phase, setPhase] = useState("idle");
  const [notifications, setNotifications] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    pipelineHealth: 98,
    totalPRs: 0,
    avgRisk: 0,
    testsSaved: 0,
    timeSaved: 0,
  });

  // Mark a single notification as read
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  // Mark all notifications as read
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    setNotifications((prev) =>
      [
        {
          id: Date.now(),
          read: false,
          timestamp: Date.now(),
          ...notification,
        },
        ...prev,
      ].slice(0, 50),
    ); // keep max 50
  }, []);

  const value = {
    phase,
    setPhase,
    dashboardStats,
    setDashboardStats,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}
