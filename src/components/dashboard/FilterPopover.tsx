import type { TransactionTypeFilter } from "../../types/finance";

const OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
];

type FilterPopoverProps = {
  transactionType: TransactionTypeFilter;
  onChangeType: (type: TransactionTypeFilter) => void;
  onClose: () => void;
};

export function FilterPopover({
  transactionType,
  onChangeType,
  onClose,
}: FilterPopoverProps) {
  return (
    <div
      className="motion-dropdown absolute top-full left-0 z-30 mt-space-8 w-[min(100vw-2rem,280px)] rounded-shape-20 border border-neutral-300 bg-surface/80 p-space-16 shadow-sm backdrop-blur-md"
      role="dialog"
      aria-label="Filtros"
    >
      <p className="mb-space-12 text-label-medium font-semibold text-neutral-1100">
        Tipo de Transação
      </p>
      <div className="flex flex-col gap-space-8">
        {OPTIONS.map((option) => {
          const active = transactionType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChangeType(option.value);
                onClose();
              }}
              className={[
                "flex min-h-12 w-full items-center justify-center rounded-shape-100 px-space-16 text-label-medium font-semibold transition-colors",
                active
                  ? "bg-primary text-neutral-1100 hover:bg-primary/90"
                  : "border border-neutral-300 bg-surface text-neutral-1100 hover:bg-neutral-100",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
