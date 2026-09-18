import { useEffect, useId, useRef, useState } from "react";
import iconFilters from "../../assets/dashboard/icon-filters.svg";
import iconPlus from "../../assets/dashboard/icon-plus.svg";
import iconSearch from "../../assets/dashboard/icon-search.svg";
import { useFinance, useIsDesktop } from "../../hooks";
import { FiltersMobileModal } from "../modals";
import { DateRangePicker } from "./DateRangePicker";
import { FamilyAvatars } from "./FamilyAvatars";
import { FilterPopover } from "./FilterPopover";

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
                className="flex size-12 items-center justify-center rounded-shape-100 transition-colors hover:bg-neutral-100"
                aria-label="Abrir filtros"
                aria-expanded={isDesktop ? filterOpen : filtersMobileOpen}
                aria-controls={isDesktop ? filterMenuId : undefined}
                onClick={() => {
                  if (isDesktop) {
                    setFilterOpen((current) => !current);
                  } else {
                    setFiltersMobileOpen(true);
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
          className="flex min-h-12 w-full shrink-0 items-center justify-center gap-space-8 rounded-shape-100 bg-neutral-1100 px-space-16 py-space-12 text-label-large font-semibold tracking-[0.3px] text-surface whitespace-nowrap transition-colors hover:bg-secondary lg:w-auto"
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

      <FiltersMobileModal
        open={filtersMobileOpen}
        onClose={() => setFiltersMobileOpen(false)}
      />
    </>
  );
}
