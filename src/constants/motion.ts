import type { CSSProperties } from "react";

/** Durações e easings oficiais do mycash+ (Prompt 21). Valores em ms. */
export const MOTION = {
  duration: {
    page: 200,
    enter: 300,
    enterSlow: 400,
    hover: 200,
    cardHover: 250,
    avatar: 200,
    modalOverlay: 200,
    modalPanel: 250,
    modalClose: 200,
    filtersSlide: 300,
    toastIn: 300,
    toastOut: 250,
    progress: 1000,
    countUp: 800,
    skeletonPulse: 1500,
    micro: 200,
    inputFocus: 200,
  },
  easing: {
    inOut: "ease-in-out",
    out: "ease-out",
  },
  stagger: {
    transactionMs: 50,
    gridMs: 80,
    donutMs: 100,
  },
} as const;

/** Variáveis CSS para stagger em listas (`--stagger-index` × `--stagger-step`). */
export function staggerStyle(index: number, stepMs: number): CSSProperties {
  return {
    ["--stagger-index" as string]: index,
    ["--stagger-step" as string]: `${stepMs}ms`,
  } as CSSProperties;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
