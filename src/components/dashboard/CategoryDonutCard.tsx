import { formatCurrency } from "../../utils/formatCurrency";

const DONUT_SIZE = 72;
const DONUT_STROKE = 8;

type CategoryDonutCardProps = {
  category: string;
  amount: number;
  percentage: number;
  ringColor: string;
};

export function CategoryDonutCard({
  category,
  amount,
  percentage,
  ringColor,
}: CategoryDonutCardProps) {
  const radius = (DONUT_SIZE - DONUT_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const dashOffset = circumference * (1 - clamped / 100);
  const label = `${clamped.toFixed(1)}%`;

  return (
    <article className="flex w-full max-w-[160px] min-w-[140px] shrink-0 flex-col items-center justify-center gap-space-12 rounded-shape-20 border border-neutral-300 bg-surface p-space-24 transition-colors hover:border-primary">
      <div
        className="relative flex h-[var(--size-72)] w-[var(--size-72)] items-center justify-center"
        aria-hidden="true"
      >
        <svg
          width={DONUT_SIZE}
          height={DONUT_SIZE}
          viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={radius}
            fill="none"
            stroke="var(--color-secondary-50)"
            strokeWidth={DONUT_STROKE}
          />
          <circle
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={DONUT_STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <p className="relative z-10 text-paragraph-x-small tracking-[0.3px] text-neutral-1100">
          {label}
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-space-4 text-center">
        <p className="w-full truncate text-paragraph-small tracking-[0.3px] text-neutral-1100">
          {category}
        </p>
        <p className="text-heading-x-small font-bold text-neutral-1100">
          {formatCurrency(amount)}
        </p>
      </div>
    </article>
  );
}
