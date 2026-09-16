import type { ReactNode } from "react";
import { useCountUp } from "../../hooks/useCountUp";
import { formatCurrency } from "../../utils/formatCurrency";

type SummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  valueClassName: string;
  labelClassName?: string;
  className?: string;
};

export function SummaryCardShell({
  icon,
  label,
  value,
  valueClassName,
  labelClassName = "text-neutral-1100",
  className = "",
}: SummaryCardProps) {
  const animated = useCountUp(value, 800);

  return (
    <article
      className={[
        "flex w-full min-w-0 flex-col items-start justify-center gap-space-32 rounded-shape-20 border border-neutral-300 bg-surface p-space-24",
        className,
      ].join(" ")}
    >
      <div className="size-space-24 shrink-0 overflow-hidden" aria-hidden="true">
        {icon}
      </div>
      <div className="flex w-full flex-col gap-space-4">
        <p
          className={[
            "text-paragraph-large tracking-[0.3px]",
            labelClassName,
          ].join(" ")}
        >
          {label}
        </p>
        <p className={["text-heading-medium font-bold tabular-nums", valueClassName].join(" ")}>
          {formatCurrency(animated)}
        </p>
      </div>
    </article>
  );
}
