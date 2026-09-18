import { useMemo, useState } from "react";
import iconPlus from "../../assets/dashboard/icon-plus.svg";
import iconSearch from "../../assets/dashboard/icon-search.svg";
import { useFinance } from "../../hooks";
import type {
  DateRange,
  TransactionStatus,
  TransactionTypeFilter,
} from "../../types/finance";
import { formatCurrency } from "../../utils/formatCurrency";
import { downloadTransactionsCsv } from "../../utils/exportTransactionsCsv";
import { FilterSelect } from "../ui";
import { resolveAccountLabel } from "./TransactionRow";
import { DateRangePicker } from "./DateRangePicker";
import {
  TransactionsTable,
  type TransactionSort,
} from "./TransactionsTable";

type StatusFilter = "all" | TransactionStatus;

type TransactionsViewProps = {
  initialAccountId?: string | null;
  onNewTransaction: () => void;
};

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "completed", label: "Concluído" },
  { value: "pending", label: "Pendente" },
];

export function TransactionsView({
  initialAccountId = null,
  onNewTransaction,
}: TransactionsViewProps) {
  const {
    getFilteredTransactions,
    familyMembers,
    bankAccounts,
    creditCards,
    incomeCategories,
    expenseCategories,
    dateRange: globalDateRange,
  } = useFinance();

  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionTypeFilter>("all");
  const [category, setCategory] = useState("all");
  const [accountId, setAccountId] = useState(initialAccountId ?? "all");
  const [memberId, setMemberId] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [localDateRange, setLocalDateRange] = useState<DateRange>(globalDateRange);
  const [sort, setSort] = useState<TransactionSort>({
    key: "date",
    direction: "desc",
  });

  const categoryOptions = useMemo(() => {
    const names = [
      ...incomeCategories.map((item) => item.name),
      ...expenseCategories.map((item) => item.name),
    ];
    return [
      { value: "all", label: "Todas" },
      ...names.map((name) => ({ value: name, label: name })),
    ];
  }, [incomeCategories, expenseCategories]);

  const accountOptions = useMemo(() => {
    const accounts = [
      ...bankAccounts.map((account) => ({
        value: account.id,
        label: account.name,
      })),
      ...creditCards.map((card) => ({
        value: card.id,
        label: card.name,
      })),
    ];
    return [{ value: "all", label: "Todas" }, ...accounts];
  }, [bankAccounts, creditCards]);

  const memberOptions = useMemo(
    () => [
      { value: "all", label: "Todos" },
      ...familyMembers.map((member) => ({
        value: member.id,
        label: member.name,
      })),
    ],
    [familyMembers],
  );

  const filtered = useMemo(() => {
    const base = getFilteredTransactions();
    const query = search.trim().toLowerCase();
    const rangeStart = new Date(
      localDateRange.startDate.getFullYear(),
      localDateRange.startDate.getMonth(),
      localDateRange.startDate.getDate(),
      0,
      0,
      0,
      0,
    ).getTime();
    const rangeEnd = new Date(
      localDateRange.endDate.getFullYear(),
      localDateRange.endDate.getMonth(),
      localDateRange.endDate.getDate(),
      23,
      59,
      59,
      999,
    ).getTime();

    return base.filter((tx) => {
      const time = tx.date.getTime();
      if (time < rangeStart || time > rangeEnd) {
        return false;
      }
      if (type !== "all" && tx.type !== type) {
        return false;
      }
      if (category !== "all" && tx.category !== category) {
        return false;
      }
      if (accountId !== "all" && tx.accountId !== accountId) {
        return false;
      }
      if (memberId !== "all" && tx.memberId !== memberId) {
        return false;
      }
      if (status !== "all" && tx.status !== status) {
        return false;
      }
      if (query) {
        const haystack = `${tx.description} ${tx.category}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [
    getFilteredTransactions,
    search,
    type,
    category,
    accountId,
    memberId,
    status,
    localDateRange,
  ]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const tx of filtered) {
      if (tx.type === "income") {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    }
    return {
      income,
      expense,
      diff: income - expense,
      count: filtered.length,
    };
  }, [filtered]);

  function handleExport() {
    downloadTransactionsCsv(filtered, {
      memberName: (id) =>
        id
          ? (familyMembers.find((member) => member.id === id)?.name ?? "—")
          : "—",
      accountName: (id) =>
        resolveAccountLabel(id, bankAccounts, creditCards) || "—",
    });
  }

  return (
    <section className="flex w-full flex-col gap-space-24">
      <header className="flex w-full flex-col gap-space-12 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium">
          Transações
        </h1>

        <div className="flex w-full flex-col gap-space-8 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="flex min-h-12 w-full items-center justify-center rounded-shape-100 border border-neutral-1100 px-space-16 py-space-12 text-label-large font-semibold tracking-[0.3px] text-neutral-1100 transition-colors hover:bg-neutral-100 disabled:opacity-40 sm:w-auto"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={onNewTransaction}
            className="flex min-h-12 w-full shrink-0 items-center justify-center gap-space-8 rounded-shape-100 bg-neutral-1100 px-space-16 py-space-12 text-label-large font-semibold tracking-[0.3px] text-surface whitespace-nowrap transition-colors hover:bg-secondary sm:w-auto"
          >
            <img
              src={iconPlus}
              alt=""
              width={16}
              height={16}
              className="size-space-16"
              aria-hidden="true"
            />
            Nova Transação
          </button>
        </div>
      </header>

      <div className="flex w-full flex-col gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-16 md:p-space-24">
        <p className="text-label-medium font-semibold tracking-[0.3px] text-neutral-1100">
          Filtros avançados
        </p>

        <div className="flex w-full flex-col gap-space-12 lg:flex-row lg:flex-wrap lg:items-end">
          <label className="flex min-h-12 w-full flex-col gap-space-8 lg:max-w-[256px] lg:flex-1">
            <span className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
              Busca
            </span>
            <span className="flex min-h-12 w-full items-center gap-space-8 rounded-shape-100 border border-neutral-1100 bg-surface px-space-24 py-space-12">
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
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar lançamentos..."
                className="min-w-0 flex-1 bg-transparent text-paragraph-small tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-600"
              />
            </span>
          </label>

          <FilterSelect
            label="Tipo"
            value={type}
            onChange={(value) => setType(value as TransactionTypeFilter)}
            options={TYPE_OPTIONS}
            className="lg:max-w-[160px] lg:flex-1"
          />
          <FilterSelect
            label="Categoria"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            className="lg:max-w-[180px] lg:flex-1"
          />
          <FilterSelect
            label="Conta/cartão"
            value={accountId}
            onChange={setAccountId}
            options={accountOptions}
            className="lg:max-w-[180px] lg:flex-1"
          />
          <FilterSelect
            label="Membro"
            value={memberId}
            onChange={setMemberId}
            options={memberOptions}
            className="lg:max-w-[180px] lg:flex-1"
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={(value) => setStatus(value as StatusFilter)}
            options={STATUS_OPTIONS}
            className="lg:max-w-[160px] lg:flex-1"
          />

          <div className="flex w-full flex-col gap-space-8 lg:max-w-[280px] lg:flex-1">
            <span className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
              Período
            </span>
            <DateRangePicker value={localDateRange} onChange={setLocalDateRange} />
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-space-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex w-full flex-col gap-space-8 rounded-shape-20 border border-neutral-300 bg-surface p-space-16">
          <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
            Receitas filtradas
          </p>
          <p className="text-heading-x-small font-bold text-green-600">
            {formatCurrency(summary.income)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-space-8 rounded-shape-20 border border-neutral-300 bg-surface p-space-16">
          <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
            Despesas filtradas
          </p>
          <p className="text-heading-x-small font-bold text-red-600">
            {formatCurrency(summary.expense)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-space-8 rounded-shape-20 border border-neutral-300 bg-surface p-space-16">
          <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
            Diferença
          </p>
          <p
            className={`text-heading-x-small font-bold ${
              summary.diff >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(summary.diff)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-space-8 rounded-shape-20 border border-neutral-300 bg-surface p-space-16">
          <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
            Transações encontradas
          </p>
          <p className="text-heading-x-small font-bold text-neutral-1100">
            {summary.count}
          </p>
        </div>
      </div>

      <TransactionsTable
        items={filtered}
        pageSize={10}
        showToolbar={false}
        sortable
        sort={sort}
        onSortChange={setSort}
        title="Extrato detalhado"
        emptyMessage="Nenhuma transação registrada ainda"
        emptyActionLabel="Adicionar primeira transação"
        onEmptyAction={onNewTransaction}
      />
    </section>
  );
}
