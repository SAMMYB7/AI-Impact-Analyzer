// Separate hook file for fast refresh compatibility
// (files should export only components OR only hooks)

import { useContext } from "react";
import { PRContext } from "./PRContextDef";

export function usePR() {
  const ctx = useContext(PRContext);
  if (!ctx) {
    throw new Error("usePR must be used within PRProvider");
  }
  return ctx;
}
