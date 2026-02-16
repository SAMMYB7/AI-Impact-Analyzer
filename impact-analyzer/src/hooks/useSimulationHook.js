// Separate hook file for fast refresh compatibility
// (files should export only components OR only hooks)

import { useContext } from "react";
import { SimulationContext } from "./SimulationContext";

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }
  return ctx;
}
