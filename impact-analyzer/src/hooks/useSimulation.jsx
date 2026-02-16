// ═══════════════════════════════════════════════════════════════
// SIMULATION CONTEXT — React hook for consuming simulation state
// ═══════════════════════════════════════════════════════════════

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  subscribe,
  getState,
  startSimulation,
  resetSimulation,
  updateMetrics,
  markNotificationRead,
  markAllNotificationsRead,
} from "../data/simulationStore";

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const [state, setState] = useState(getState());

  useEffect(() => {
    const unsub = subscribe((newState) => {
      setState(newState);
    });
    return unsub;
  }, []);

  const actions = {
    startSimulation: useCallback(() => startSimulation(), []),
    resetSimulation: useCallback(() => resetSimulation(), []),
    updateMetrics: useCallback(() => updateMetrics(), []),
    markNotificationRead: useCallback((id) => markNotificationRead(id), []),
    markAllNotificationsRead: useCallback(() => markAllNotificationsRead(), []),
  };

  return (
    <SimulationContext.Provider value={{ ...state, ...actions }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx)
    throw new Error("useSimulation must be used within SimulationProvider");
  return ctx;
}
