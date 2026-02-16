// ═══════════════════════════════════════════════════════════════
// ANIMATED COUNTER — Smooth number animation hook
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

export function useAnimatedCounter(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(target);
        prevTarget.current = target;
      }
    }

    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}
