import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { BREAKPOINTS } from "../../constants/breakpoints";
import { useFinance } from "../../hooks";
import { ChevronIcon } from "../ui";
import { CategoryDonutCard } from "./CategoryDonutCard";

const RING_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-neutral-500)",
  "var(--color-neutral-400)",
  "var(--color-blue-600)",
  "var(--color-green-600)",
  "var(--color-orange-600)",
  "var(--color-purple-600)",
] as const;

const SCROLL_STEP = 200;

/**
 * Máscara de overflow:
 * - Direita: aparece quando há conteúdo oculto (hint visual).
 * - Esquerda: só após o usuário rolar (não esmaece o 1º card no estado inicial).
 */
function resolveTrackMask(
  canScrollLeft: boolean,
  canScrollRight: boolean,
): string | undefined {
  if (!canScrollLeft && !canScrollRight) {
    return undefined;
  }
  if (canScrollLeft && canScrollRight) {
    return "linear-gradient(to right, transparent 0%, black 32px, black calc(100% - 32px), transparent 100%)";
  }
  if (canScrollLeft) {
    return "linear-gradient(to right, transparent 0%, black 32px, black 100%)";
  }
  return "linear-gradient(to right, black 0%, black calc(100% - 32px), transparent 100%)";
}

export function ExpensesByCategoryCarousel() {
  const {
    calculateExpensesByCategory,
    calculateCategoryPercentage,
  } = useFinance();

  const categories = calculateExpensesByCategory();
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startScroll: number;
  }>({ active: false, startX: 0, startScroll: 0 });

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${BREAKPOINTS.tabletMin}px)`);
    const sync = () => setShowArrows(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) {
      return;
    }
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.scrollLeft = 0;
    }
    updateScrollState();
    if (!el) {
      return;
    }
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, categories.length]);

  function scrollBy(delta: number) {
    trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  function onWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) {
      return;
    }
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      el.scrollLeft += event.deltaY;
      updateScrollState();
    }
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el) {
      return;
    }
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: el.scrollLeft,
    };
    el.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active || !trackRef.current) {
      return;
    }
    const delta = event.clientX - dragRef.current.startX;
    trackRef.current.scrollLeft = dragRef.current.startScroll - delta;
    updateScrollState();
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    dragRef.current.active = false;
    trackRef.current?.releasePointerCapture(event.pointerId);
  }

  if (categories.length === 0) {
    return (
      <p className="text-paragraph-small text-neutral-600">
        Nenhuma despesa por categoria no período.
      </p>
    );
  }

  const maskImage = resolveTrackMask(canScrollLeft, canScrollRight);

  return (
    <section
      className="relative w-full"
      aria-label="Gastos por categoria"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={trackRef}
        className="flex w-full cursor-grab gap-space-16 overflow-x-auto pb-space-4 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={
          maskImage
            ? { maskImage, WebkitMaskImage: maskImage }
            : undefined
        }
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {categories.map((item, index) => (
          <CategoryDonutCard
            key={item.category}
            category={item.category}
            amount={item.amount}
            percentage={calculateCategoryPercentage(item.amount)}
            ringColor={RING_COLORS[index % RING_COLORS.length]}
          />
        ))}
      </div>

      {showArrows && hovered ? (
        <>
          {canScrollLeft ? (
            <button
              type="button"
              aria-label="Anterior"
              className="absolute top-1/2 left-0 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-surface text-neutral-1100 shadow-sm transition-colors hover:bg-neutral-100"
              onClick={() => scrollBy(-SCROLL_STEP)}
            >
              <ChevronIcon direction="left" size={14} />
            </button>
          ) : null}
          {canScrollRight ? (
            <button
              type="button"
              aria-label="Próximo"
              className="absolute top-1/2 right-0 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-surface text-neutral-1100 shadow-sm transition-colors hover:bg-neutral-100"
              onClick={() => scrollBy(SCROLL_STEP)}
            >
              <ChevronIcon direction="right" size={14} />
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
