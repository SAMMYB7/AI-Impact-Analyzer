// ═══════════════════════════════════════════════════════════════
// ANIMATED COUNTER HOOK — Smoothly animates number transitions
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

export function useAnimatedCounter(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const currentValueRef = useRef(0);

  useEffect(() => {
    startRef.current = currentValueRef.current;
    startTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startRef.current + (target - startRef.current) * eased;

      currentValueRef.current = current;
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}
