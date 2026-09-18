import { useEffect, useState } from "react";
import { MOTION, prefersReducedMotion } from "../constants/motion";

/** Anima um número de 0 até `target` em `durationMs` (padrão 800ms). */
export function useCountUp(
  target: number,
  durationMs = MOTION.duration.countUp,
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion() || durationMs <= 0) {
      setValue(target);
      return;
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      // easeOutQuad — leitura mais estável no fim da contagem
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(target * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return value;
}
