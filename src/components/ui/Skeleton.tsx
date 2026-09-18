type SkeletonStatCardProps = {
  className?: string;
};

/** Placeholder de card de estatística (pulse). */
export function SkeletonStatCard({ className = "" }: SkeletonStatCardProps) {
  return (
    <div
      className={[
        "flex w-full flex-col gap-space-12 rounded-shape-20 border border-neutral-300 bg-surface p-space-24",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="motion-skeleton-pulse h-4 w-1/3 rounded-shape-20" />
      <div className="motion-skeleton-pulse h-8 w-2/3 rounded-shape-20" />
      <div className="motion-skeleton-pulse h-4 w-1/4 rounded-shape-20" />
    </div>
  );
}

type SkeletonTableRowProps = {
  columns?: number;
};

/** Placeholder de linha de tabela (shimmer). */
export function SkeletonTableRow({ columns = 5 }: SkeletonTableRowProps) {
  return (
    <div
      className="flex w-full items-center gap-space-12 py-space-12"
      aria-hidden="true"
    >
      {Array.from({ length: columns }, (_, index) => (
        <div
          key={index}
          className="motion-skeleton-shimmer h-4 flex-1 rounded-shape-20"
        />
      ))}
    </div>
  );
}
