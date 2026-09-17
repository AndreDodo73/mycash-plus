import { useEffect, useId, useRef, useState } from "react";
import iconFilters from "../../assets/dashboard/icon-filters.svg";
import iconPlus from "../../assets/dashboard/icon-plus.svg";
import iconSearch from "../../assets/dashboard/icon-search.svg";
import { useFinance, useIsDesktop } from "../../hooks";
import type { TransactionTypeFilter } from "../../types/finance";
import { DateRangePicker } from "./DateRangePicker";
import { FamilyAvatars } from "./FamilyAvatars";
import { FilterPopover } from "./FilterPopover";

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
];

type DashboardHeaderProps = {
  onNewTransaction?: () => void;
  onAddMember?: () => void;
};

export function DashboardHeader({
  onNewTransaction,
  onAddMember,
}: DashboardHeaderProps) {
  const isDesktop = useIsDesktop();
  const {
    searchText,
    setSearchText,
    transactionType,
    setTransactionType,
    dateRange,
    setDateRange,
  } = useFinance();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filtersMobileOpen, setFiltersMobileOpen] = useState(false);
  const [draftMobileType, setDraftMobileType] =
    useState<TransactionTypeFilter>(transactionType);
  const filterWrapRef = useRef<HTMLDivElement>(null);
  const filterMenuId = useId();

  useEffect(() => {
    if (!filterOpen) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!filterWrapRef.current?.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filterOpen]);

  function openMobileFilters() {
    setDraftMobileType(transactionType);
    setFiltersMobileOpen(true);
  }

  function applyMobileFilters() {
    setTransactionType(draftMobileType);
    setFiltersMobileOpen(false);
  }

  return (
    <>
      <header className="flex w-full flex-col gap-space-12 lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between lg:gap-space-16">
        <div className="flex min-w-0 flex-col gap-space-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-space-8 lg:flex-nowrap lg:gap-space-8">
          <div className="flex min-w-0 flex-col gap-space-8 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-space-8">
            <label className="flex min-h-12 w-full shrink-0 items-center gap-space-8 rounded-shape-100 border border-neutral-1100 bg-surface px-space-24 py-space-12 sm:w-[175px] lg:w-[175px]">
              <img
                src={iconSearch}
                alt=""
                width={16}
                height={16}
                className="size-space-16 shrink-0"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Pesquisar..."
                className="min-w-0 flex-1 bg-transparent text-paragraph-small tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-600"
              />
            </label>

            <div ref={filterWrapRef} className="relative shrink-0">
              <button
                type="button"
                className="flex size-12 items-center justify-center rounded-shape-100"
                aria-label="Abrir filtros"
                aria-expanded={isDesktop ? filterOpen : filtersMobileOpen}
                aria-controls={isDesktop ? filterMenuId : undefined}
                onClick={() => {
                  if (isDesktop) {
                    setFilterOpen((current) => !current);
                  } else {
                    openMobileFilters();
                  }
                }}
              >
                <img
                  src={iconFilters}
                  alt=""
                  width={16}
                  height={16}
                  className="size-space-16"
                  aria-hidden="true"
                />
              </button>
              {isDesktop && filterOpen ? (
                <div id={filterMenuId}>
                  <FilterPopover
                    transactionType={transactionType}
                    onChangeType={setTransactionType}
                    onClose={() => setFilterOpen(false)}
                  />
                </div>
              ) : null}
            </div>

            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          <FamilyAvatars onAddMember={() => onAddMember?.()} />
        </div>

        <button
          type="button"
          className="flex min-h-12 w-full shrink-0 items-center justify-center gap-space-8 rounded-shape-100 bg-neutral-1100 px-space-16 py-space-12 text-label-large font-semibold tracking-[0.3px] text-surface whitespace-nowrap lg:w-auto"
          onClick={() => onNewTransaction?.()}
        >
          <img
            src={iconPlus}
            alt=""
            width={16}
            height={16}
            className="size-space-16"
            aria-hidden="true"
          />
          Nova transação
        </button>
      </header>

      {filtersMobileOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-secondary/50"
            aria-label="Fechar filtros"
            onClick={() => setFiltersMobileOpen(false)}
          />
          <div
            className="relative z-10 flex max-h-[85dvh] w-full flex-col rounded-t-shape-20 bg-surface"
            role="dialog"
            aria-label="Filtros"
          >
            <div className="flex items-center justify-between border-b border-neutral-300 px-space-16 py-space-12">
              <h2 className="text-label-large font-semibold text-neutral-1100">
                Filtros
              </h2>
              <button
                type="button"
                className="flex size-12 items-center justify-center text-label-large"
                aria-label="Fechar"
                onClick={() => setFiltersMobileOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto px-space-16 py-space-24">
              <p className="mb-space-12 text-label-medium font-semibold text-neutral-1100">
                Tipo de Transação
              </p>
              <div className="grid grid-cols-3 gap-space-8">
                {TYPE_OPTIONS.map((option) => {
                  const active = draftMobileType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDraftMobileType(option.value)}
                      className={[
                        "flex min-h-12 items-center justify-center rounded-shape-100 px-space-8 text-label-small font-semibold",
                        active
                          ? "bg-secondary text-surface"
                          : "border border-neutral-300 bg-surface text-neutral-1100",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-space-24 text-paragraph-small text-neutral-600">
                Mais opções de filtro entram no Prompt 16.
              </p>
            </div>
            <div className="border-t border-neutral-300 p-space-16">
              <button
                type="button"
                className="flex min-h-14 w-full items-center justify-center rounded-shape-100 bg-secondary text-label-large font-semibold text-surface"
                onClick={applyMobileFilters}
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
