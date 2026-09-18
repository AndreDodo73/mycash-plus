import { useEffect, useMemo, useState } from "react";
import iconExtrato from "../../assets/dashboard/icon-extrato.svg";
import iconSearch from "../../assets/dashboard/icon-search.svg";
import { useFinance } from "../../hooks";
import type { Transaction, TransactionTypeFilter } from "../../types/finance";
import { ChevronIcon, ChevronButton, FilterSelect } from "../ui";
import { TransactionCard } from "./TransactionCard";
import {
  resolveAccountLabel,
  TransactionRow,
} from "./TransactionRow";

const DEFAULT_PAGE_SIZE = 5;

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
];

export type TransactionSortKey =
  | "date"
  | "amount"
  | "description"
  | "category"
  | "member";

export type TransactionSort = {
  key: TransactionSortKey;
  direction: "asc" | "desc";
};

type TransactionsTableProps = {
  /** Filtra por conta/cartão (ex.: extrato a partir dos detalhes do cartão). */
  accountIdFilter?: string | null;
  /** Linhas por página. Dashboard = 5; view expandida = 10. */
  pageSize?: number;
  /** Quando informado, usa esta lista (já filtrada) em vez do filtro interno. */
  items?: Transaction[];
  /** Oculta busca/tipo locais (filtros ficam no pai). */
  showToolbar?: boolean;
  /** Headers clicáveis com seta de ordenação. */
  sortable?: boolean;
  sort?: TransactionSort;
  onSortChange?: (next: TransactionSort) => void;
  title?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
};

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }

  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (const page of sorted) {
    const last = result[result.length - 1];
    if (typeof last === "number" && page - last > 1) {
      result.push("…");
    }
    result.push(page);
  }
  return result;
}

function compareTransactions(
  a: Transaction,
  b: Transaction,
  sort: TransactionSort,
  memberName: (id: string | null) => string,
): number {
  const dir = sort.direction === "asc" ? 1 : -1;
  switch (sort.key) {
    case "amount":
      return (a.amount - b.amount) * dir;
    case "description":
      return a.description.localeCompare(b.description, "pt-BR") * dir;
    case "category":
      return a.category.localeCompare(b.category, "pt-BR") * dir;
    case "member":
      return (
        memberName(a.memberId).localeCompare(memberName(b.memberId), "pt-BR") *
        dir
      );
    case "date":
    default:
      return (a.date.getTime() - b.date.getTime()) * dir;
  }
}

type SortableHeaderProps = {
  label: string;
  sortKey: TransactionSortKey;
  sortable: boolean;
  sort: TransactionSort;
  onSortChange?: (next: TransactionSort) => void;
  align?: "left" | "right" | "center";
  className?: string;
};

function SortableHeader({
  label,
  sortKey,
  sortable,
  sort,
  onSortChange,
  align = "left",
  className = "",
}: SortableHeaderProps) {
  const isActive = sort.key === sortKey;
  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";

  if (!sortable || !onSortChange) {
    return (
      <th
        className={`px-space-8 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:px-space-12 ${alignClass} ${className}`}
      >
        {label}
      </th>
    );
  }

  return (
    <th
      className={`px-space-8 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:px-space-12 ${alignClass} ${className}`}
      aria-sort={
        isActive
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <button
        type="button"
        onClick={() =>
          onSortChange({
            key: sortKey,
            direction:
              isActive && sort.direction === "desc" ? "asc" : "desc",
          })
        }
        className={`inline-flex min-h-11 items-center gap-space-8 rounded-shape-100 px-space-8 transition-colors hover:bg-neutral-200 ${
          align === "right" ? "justify-end" : ""
        } text-label-large font-semibold tracking-[0.3px] text-neutral-1100`}
      >
        {label}
        <ChevronIcon
          direction={isActive && sort.direction === "asc" ? "up" : "down"}
          size={14}
          className={isActive ? "text-neutral-1100" : "text-neutral-400"}
        />
      </button>
    </th>
  );
}

export function TransactionsTable({
  accountIdFilter = null,
  pageSize = DEFAULT_PAGE_SIZE,
  items,
  showToolbar = true,
  sortable = false,
  sort: controlledSort,
  onSortChange,
  title = "Extrato detalhado",
  emptyMessage = "Nenhum lançamento encontrado.",
  emptyActionLabel,
  onEmptyAction,
}: TransactionsTableProps) {
  const {
    transactions,
    familyMembers,
    bankAccounts,
    creditCards,
    selectedMember,
    dateRange,
  } = useFinance();

  const [localSearch, setLocalSearch] = useState("");
  const [localType, setLocalType] = useState<TransactionTypeFilter>(
    accountIdFilter ? "expense" : "all",
  );
  const [page, setPage] = useState(1);
  const [internalSort, setInternalSort] = useState<TransactionSort>({
    key: "date",
    direction: "desc",
  });

  const sort = controlledSort ?? internalSort;
  const setSort = onSortChange ?? setInternalSort;

  function memberName(memberId: string | null) {
    if (!memberId) {
      return "";
    }
    return familyMembers.find((member) => member.id === memberId)?.name ?? "";
  }

  const filtered = useMemo(() => {
    if (items) {
      return [...items].sort((a, b) =>
        compareTransactions(a, b, sort, memberName),
      );
    }

    const rangeStart = new Date(
      dateRange.startDate.getFullYear(),
      dateRange.startDate.getMonth(),
      dateRange.startDate.getDate(),
      0,
      0,
      0,
      0,
    ).getTime();
    const rangeEnd = new Date(
      dateRange.endDate.getFullYear(),
      dateRange.endDate.getMonth(),
      dateRange.endDate.getDate(),
      23,
      59,
      59,
      999,
    ).getTime();
    const query = localSearch.trim().toLowerCase();

    return transactions
      .filter((tx) => {
        const time = tx.date.getTime();
        if (time < rangeStart || time > rangeEnd) {
          return false;
        }
        if (selectedMember && tx.memberId !== selectedMember) {
          return false;
        }
        if (accountIdFilter && tx.accountId !== accountIdFilter) {
          return false;
        }
        if (localType !== "all" && tx.type !== localType) {
          return false;
        }
        if (query) {
          const haystack = `${tx.description} ${tx.category}`.toLowerCase();
          if (!haystack.includes(query)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => compareTransactions(a, b, sort, memberName));
  }, [
    items,
    transactions,
    dateRange,
    selectedMember,
    localSearch,
    localType,
    accountIdFilter,
    sort,
    familyMembers,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [
    localSearch,
    localType,
    selectedMember,
    dateRange.startDate,
    dateRange.endDate,
    accountIdFilter,
    items,
    sort.key,
    sort.direction,
    pageSize,
  ]);

  useEffect(() => {
    if (accountIdFilter) {
      setLocalType("expense");
    }
  }, [accountIdFilter]);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);
  const pages = buildPageList(safePage, totalPages);

  function memberOf(memberId: string | null) {
    if (!memberId) {
      return undefined;
    }
    return familyMembers.find((member) => member.id === memberId);
  }

  return (
    <section
      className="flex w-full min-w-0 flex-col gap-space-24 rounded-shape-20 border border-neutral-300 bg-surface p-space-16 md:gap-space-32 md:p-space-24 lg:p-space-32"
      aria-label={title}
    >
      <header
        className={`flex w-full flex-col gap-space-12 ${
          showToolbar ? "lg:flex-row lg:items-center lg:justify-between" : ""
        }`}
      >
        <div className="flex min-w-0 items-center gap-space-8">
          <img
            src={iconExtrato}
            alt=""
            width={24}
            height={24}
            className="size-space-24 shrink-0"
            aria-hidden="true"
          />
          <h2 className="truncate text-heading-x-small font-bold text-neutral-1100">
            {title}
          </h2>
        </div>

        {showToolbar ? (
          <div className="flex w-full flex-col gap-space-8 sm:flex-row sm:items-center lg:w-auto">
            <label className="flex min-h-12 w-full items-center gap-space-8 rounded-shape-100 border border-neutral-1100 bg-surface px-space-24 py-space-12 transition-colors hover:bg-neutral-50 focus-within:bg-neutral-50 sm:max-w-[256px]">
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
                value={localSearch}
                onChange={(event) => setLocalSearch(event.target.value)}
                placeholder="Buscar lançamentos..."
                className="min-w-0 flex-1 bg-transparent text-paragraph-small tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-600"
              />
            </label>

            <FilterSelect
              label="Filtrar por tipo"
              hideLabel
              value={localType}
              onChange={(value) => setLocalType(value as TransactionTypeFilter)}
              options={TYPE_OPTIONS}
              className="sm:w-[160px] sm:shrink-0"
            />
          </div>
        ) : null}
      </header>

      {pageItems.length === 0 ? (
        <div className="flex min-h-24 flex-col items-center justify-center gap-space-16 rounded-shape-20 border border-dashed border-neutral-300 px-space-16 py-space-32 text-center">
          <p className="text-paragraph-small text-neutral-600">{emptyMessage}</p>
          {onEmptyAction && emptyActionLabel ? (
            <button
              type="button"
              onClick={onEmptyAction}
              className="flex min-h-12 items-center justify-center rounded-shape-100 bg-neutral-1100 px-space-24 text-label-medium font-semibold text-surface transition-colors hover:bg-secondary"
            >
              {emptyActionLabel}
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-space-12 md:hidden">
            {pageItems.map((tx, index) => (
              <TransactionCard
                key={tx.id}
                tx={tx}
                member={memberOf(tx.memberId)}
                accountLabel={resolveAccountLabel(
                  tx.accountId,
                  bankAccounts,
                  creditCards,
                )}
                staggerIndex={index}
              />
            ))}
          </div>

          <div className="hidden w-full min-w-0 overflow-x-auto md:block">
            <table className="w-full min-w-[640px] border-collapse lg:min-w-0">
              <thead>
                <tr className="bg-neutral-100 text-left">
                  <SortableHeader
                    label="Membro"
                    sortKey="member"
                    sortable={sortable}
                    sort={sort}
                    onSortChange={setSort}
                  />
                  <SortableHeader
                    label="Datas"
                    sortKey="date"
                    sortable={sortable}
                    sort={sort}
                    onSortChange={setSort}
                  />
                  <SortableHeader
                    label="Descrição"
                    sortKey="description"
                    sortable={sortable}
                    sort={sort}
                    onSortChange={setSort}
                  />
                  <SortableHeader
                    label="Categorias"
                    sortKey="category"
                    sortable={sortable}
                    sort={sort}
                    onSortChange={setSort}
                  />
                  <th className="hidden px-space-8 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:table-cell lg:px-space-12">
                    Conta/cartão
                  </th>
                  <th className="hidden px-space-8 py-space-12 text-center text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:table-cell lg:px-space-12">
                    Parcelas
                  </th>
                  <SortableHeader
                    label="Valor"
                    sortKey="amount"
                    sortable={sortable}
                    sort={sort}
                    onSortChange={setSort}
                    align="right"
                  />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((tx, index) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    member={memberOf(tx.memberId)}
                    accountLabel={resolveAccountLabel(
                      tx.accountId,
                      bankAccounts,
                      creditCards,
                    )}
                    zebra={index % 2 === 1}
                    staggerIndex={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <footer className="flex w-full flex-col gap-space-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-label-medium font-semibold tracking-[0.3px] text-neutral-1100">
          Mostrando {from} a {to} de {filtered.length}
        </p>

        <div className="flex items-center justify-center gap-space-8">
          <ChevronButton
            direction="left"
            label="Página anterior"
            disabled={safePage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          />

          {pages.map((item, index) =>
            item === "…" ? (
              <span
                key={`ellipsis-${index}`}
                className="text-label-medium font-semibold text-neutral-600"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => setPage(item)}
                aria-current={item === safePage ? "page" : undefined}
                className={[
                  "motion-tap flex min-h-11 min-w-11 items-center justify-center rounded-shape-100 px-space-8 text-label-medium font-semibold tracking-[0.3px] transition-colors",
                  item === safePage
                    ? "bg-neutral-1100 text-surface hover:bg-secondary"
                    : "text-neutral-1100 hover:bg-neutral-100",
                ].join(" ")}
              >
                {item}
              </button>
            ),
          )}

          <ChevronButton
            direction="right"
            label="Próxima página"
            disabled={safePage >= totalPages}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
          />
        </div>
      </footer>
    </section>
  );
}
