import type {
  BankAccount,
  CreditCard,
  DateRange,
  Transaction,
  TransactionTypeFilter,
} from "../types/finance";

export type CategoryExpense = {
  category: string;
  amount: number;
};

export type FinanceFilters = {
  selectedMember: string | null;
  dateRange: DateRange;
  transactionType: TransactionTypeFilter;
  searchText: string;
};

export function getCurrentMonthRange(reference = new Date()): DateRange {
  const startDate = new Date(reference.getFullYear(), reference.getMonth(), 1, 0, 0, 0, 0);
  const endDate = new Date(
    reference.getFullYear(),
    reference.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return { startDate, endDate };
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function getFilteredTransactions(
  transactions: Transaction[],
  filters: FinanceFilters,
): Transaction[] {
  const rangeStart = startOfDay(filters.dateRange.startDate);
  const rangeEnd = endOfDay(filters.dateRange.endDate);
  const query = filters.searchText.trim().toLowerCase();

  return transactions
    .filter((tx) => {
      const txTime = tx.date.getTime();
      if (txTime < rangeStart.getTime() || txTime > rangeEnd.getTime()) {
        return false;
      }

      if (filters.selectedMember && tx.memberId !== filters.selectedMember) {
        return false;
      }

      if (filters.transactionType !== "all" && tx.type !== filters.transactionType) {
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
}

export function calculateTotalBalance(
  bankAccounts: BankAccount[],
  creditCards: CreditCard[],
  selectedMember: string | null = null,
): number {
  const accounts = selectedMember
    ? bankAccounts.filter((account) => account.holderId === selectedMember)
    : bankAccounts;

  const cards = selectedMember
    ? creditCards.filter((card) => card.holderId === selectedMember)
    : creditCards;

  const accountsSum = accounts.reduce((sum, account) => sum + account.balance, 0);
  const invoicesSum = cards.reduce((sum, card) => sum + card.currentInvoice, 0);

  return accountsSum - invoicesSum;
}

export function calculateIncomeForPeriod(transactions: Transaction[]): number {
  return transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
}

export function calculateExpensesForPeriod(transactions: Transaction[]): number {
  return transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
}

export function calculateExpensesByCategory(
  transactions: Transaction[],
): CategoryExpense[] {
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== "expense") {
      continue;
    }
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }

  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function calculateCategoryPercentage(
  categoryAmount: number,
  totalIncome: number,
): number {
  if (totalIncome <= 0) {
    return 0;
  }
  return (categoryAmount / totalIncome) * 100;
}

export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) {
    return 0;
  }
  return ((income - expenses) / income) * 100;
}
