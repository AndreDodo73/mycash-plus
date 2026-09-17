import { useEffect, useMemo, useState } from "react";
import iconChevronDown from "../../assets/dashboard/icon-chevron-down.svg";
import iconExtrato from "../../assets/dashboard/icon-extrato.svg";
import iconPageNext from "../../assets/dashboard/icon-page-next.svg";
import iconPagePrev from "../../assets/dashboard/icon-page-prev.svg";
import iconSearch from "../../assets/dashboard/icon-search.svg";
import { useFinance } from "../../hooks";
import type { TransactionTypeFilter } from "../../types/finance";
import { TransactionCard } from "./TransactionCard";
import {
  resolveAccountLabel,
  TransactionRow,
} from "./TransactionRow";

const PAGE_SIZE = 5;

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
];

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

export function TransactionsTable() {
  const {
    transactions,
    familyMembers,
    bankAccounts,
    creditCards,
    selectedMember,
    dateRange,
  } = useFinance();

  const [localSearch, setLocalSearch] = useState("");
  const [localType, setLocalType] = useState<TransactionTypeFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
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
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, dateRange, selectedMember, localSearch, localType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [localSearch, localType, selectedMember, dateRange.startDate, dateRange.endDate]);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, filtered.length);
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
      aria-label="Extrato detalhado"
    >
      <header className="flex w-full flex-col gap-space-12 lg:flex-row lg:items-center lg:justify-between">
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
            Extrato detalhado
          </h2>
        </div>

        <div className="flex w-full flex-col gap-space-8 sm:flex-row sm:items-center lg:w-auto">
          <label className="flex min-h-12 w-full items-center gap-space-8 rounded-shape-100 border border-neutral-1100 bg-surface px-space-24 py-space-12 sm:max-w-[256px]">
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

          <label className="relative flex min-h-12 w-full items-center sm:w-[140px]">
            <select
              value={localType}
              onChange={(event) =>
                setLocalType(event.target.value as TransactionTypeFilter)
              }
              className="min-h-12 w-full appearance-none rounded-shape-100 border border-neutral-300 bg-surface px-space-16 pr-space-32 text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100 outline-none"
              aria-label="Filtrar por tipo"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <img
              src={iconChevronDown}
              alt=""
              width={16}
              height={16}
              className="pointer-events-none absolute top-1/2 right-space-12 size-space-16 -translate-y-1/2"
              aria-hidden="true"
            />
          </label>
        </div>
      </header>

      {pageItems.length === 0 ? (
        <div className="flex min-h-24 items-center justify-center rounded-shape-20 border border-dashed border-neutral-300 px-space-16 py-space-32">
          <p className="text-paragraph-small text-neutral-600">
            Nenhum lançamento encontrado.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-space-12 md:hidden">
            {pageItems.map((tx) => (
              <TransactionCard
                key={tx.id}
                tx={tx}
                member={memberOf(tx.memberId)}
                accountLabel={resolveAccountLabel(
                  tx.accountId,
                  bankAccounts,
                  creditCards,
                )}
              />
            ))}
          </div>

          <div className="hidden w-full min-w-0 overflow-x-auto md:block">
            <table className="w-full min-w-[640px] border-collapse lg:min-w-0">
              <thead>
                <tr className="bg-neutral-100 text-left">
                  <th className="px-space-8 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:px-space-12">
                    Membro
                  </th>
                  <th className="px-space-8 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:px-space-12">
                    Datas
                  </th>
                  <th className="px-space-8 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:px-space-12">
                    Descrição
                  </th>
                  <th className="px-space-8 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:px-space-12">
                    Categorias
                  </th>
                  <th className="hidden px-space-8 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:table-cell lg:px-space-12">
                    Conta/cartão
                  </th>
                  <th className="hidden px-space-8 py-space-12 text-center text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:table-cell lg:px-space-12">
                    Parcelas
                  </th>
                  <th className="px-space-8 py-space-12 text-right text-label-large font-semibold tracking-[0.3px] text-neutral-1100 lg:px-space-12">
                    Valor
                  </th>
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

        <div className="flex items-center justify-center gap-space-16">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={safePage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="flex size-11 items-center justify-center disabled:opacity-40 md:size-space-16"
          >
            <img
              src={iconPagePrev}
              alt=""
              width={16}
              height={16}
              className="size-space-16"
              aria-hidden="true"
            />
          </button>

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
                  "flex min-h-11 min-w-11 items-center justify-center rounded-shape-100 px-space-8 text-label-medium font-semibold tracking-[0.3px]",
                  item === safePage
                    ? "bg-neutral-1100 text-surface"
                    : "text-neutral-1100 hover:bg-neutral-100",
                ].join(" ")}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            aria-label="Próxima página"
            disabled={safePage >= totalPages}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            className="flex size-11 items-center justify-center disabled:opacity-40 md:size-space-16"
          >
            <img
              src={iconPageNext}
              alt=""
              width={16}
              height={16}
              className="size-space-16"
              aria-hidden="true"
            />
          </button>
        </div>
      </footer>
    </section>
  );
}
