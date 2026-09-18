/**
 * Smoke asserts das funções críticas (Prompt 24).
 * Roda sem Vitest: `npm run validate:utils`
 */

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function calculatePercentage(partial, total) {
  if (!Number.isFinite(partial) || !Number.isFinite(total) || total === 0) {
    return 0;
  }
  return Math.round((partial / total) * 1000) / 10;
}

function calculateDifference(current, previous) {
  const absolute = current - previous;
  const percent =
    !Number.isFinite(previous) || previous === 0
      ? 0
      : Math.round((absolute / Math.abs(previous)) * 1000) / 10;
  return { absolute, percent };
}

function calculateInstallmentValue(total, installments) {
  if (
    !Number.isFinite(total) ||
    !Number.isFinite(installments) ||
    installments < 1
  ) {
    return 0;
  }
  return Math.round((total / installments) * 100) / 100;
}

function parseCurrencyInput(raw) {
  const cleaned = String(raw)
    .replace(/R\$\s?/gi, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  if (!cleaned || cleaned === "-" || cleaned === ".") return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function getFilteredTransactions(transactions, filters) {
  const rangeStart = new Date(
    filters.dateRange.startDate.getFullYear(),
    filters.dateRange.startDate.getMonth(),
    filters.dateRange.startDate.getDate(),
    0,
    0,
    0,
    0,
  );
  const rangeEnd = new Date(
    filters.dateRange.endDate.getFullYear(),
    filters.dateRange.endDate.getMonth(),
    filters.dateRange.endDate.getDate(),
    23,
    59,
    59,
    999,
  );
  const query = filters.searchText.trim().toLowerCase();

  return (transactions ?? [])
    .filter((tx) => {
      const txTime = tx.date.getTime();
      if (txTime < rangeStart.getTime() || txTime > rangeEnd.getTime()) return false;
      if (filters.selectedMember && tx.memberId !== filters.selectedMember) return false;
      if (filters.transactionType !== "all" && tx.type !== filters.transactionType)
        return false;
      if (query) {
        const haystack = `${tx.description} ${tx.category}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function calculateTotalBalance(accounts, cards, member = null) {
  const filteredAccounts = member
    ? accounts.filter((a) => a.holderId === member)
    : accounts;
  const filteredCards = member
    ? cards.filter((c) => c.holderId === member)
    : cards;
  const accountsSum = filteredAccounts.reduce((s, a) => s + a.balance, 0);
  const invoicesSum = filteredCards.reduce((s, c) => s + c.currentInvoice, 0);
  return accountsSum - invoicesSum;
}

// --- asserts ---

assert(calculatePercentage(25, 100) === 25, "percent 25/100");
assert(calculatePercentage(1, 0) === 0, "percent div/0");
assert(calculatePercentage(1, 3) === 33.3, "percent 1 casa");

assert(calculateDifference(120, 100).percent === 20, "diff percent");
assert(calculateDifference(50, 0).percent === 0, "diff prev 0");

assert(calculateInstallmentValue(100, 3) === 33.33, "parcela");
assert(calculateInstallmentValue(100, 0) === 0, "parcela inválida");

assert(parseCurrencyInput("R$ 1.234,56") === 1234.56, "parse BR");
assert(parseCurrencyInput("abc") === 0, "parse inválido");

assert(formatCurrency(1234.5) === "R$\u00a01.234,50" || formatCurrency(1234.5).includes("1.234,50"), "format BR");

assert(getFilteredTransactions([], {
  selectedMember: null,
  dateRange: { startDate: new Date(2024, 0, 1), endDate: new Date(2024, 0, 31) },
  transactionType: "all",
  searchText: "",
}).length === 0, "filtro array vazio");

const txs = [
  {
    id: "1",
    type: "expense",
    amount: 100,
    description: "Netflix",
    category: "Assinaturas",
    date: new Date(2024, 0, 15),
    memberId: "lucas",
  },
  {
    id: "2",
    type: "income",
    amount: 5000,
    description: "Salário",
    category: "Salário",
    date: new Date(2024, 0, 5),
    memberId: "maria",
  },
  {
    id: "3",
    type: "expense",
    amount: 50,
    description: "Uber",
    category: "Transporte",
    date: new Date(2023, 11, 20),
    memberId: "lucas",
  },
];

const filtered = getFilteredTransactions(txs, {
  selectedMember: "lucas",
  dateRange: { startDate: new Date(2024, 0, 1), endDate: new Date(2024, 0, 31) },
  transactionType: "expense",
  searchText: "net",
});
assert(filtered.length === 1 && filtered[0].id === "1", "filtros AND combinados");

assert(
  calculateTotalBalance(
    [
      { balance: 1000, holderId: "lucas" },
      { balance: 500, holderId: "maria" },
    ],
    [{ currentInvoice: 200, holderId: "lucas" }],
    "lucas",
  ) === 800,
  "saldo por membro",
);

assert(calculateTotalBalance([], [], null) === 0, "saldo vazio");

console.log("✅ validate-utils: todos os asserts passaram");
