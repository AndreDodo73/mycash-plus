import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  initialCreditCards,
  mockBankAccounts,
  mockFamilyMembers,
  mockGoals,
  mockTransactions,
} from "../data/mockFinance";
import type {
  BankAccount,
  CreditCard,
  DateRange,
  FamilyMember,
  Goal,
  Transaction,
  TransactionTypeFilter,
} from "../types/finance";
import {
  calculateCategoryPercentage,
  calculateExpensesByCategory,
  calculateExpensesForPeriod,
  calculateIncomeForPeriod,
  calculateSavingsRate,
  calculateTotalBalance,
  getCurrentMonthRange,
  getFilteredTransactions,
  type CategoryExpense,
} from "./financeCalculations";

function createEntityId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type FinanceContextValue = {
  transactions: Transaction[];
  goals: Goal[];
  creditCards: CreditCard[];
  bankAccounts: BankAccount[];
  familyMembers: FamilyMember[];
  incomeCategories: typeof INCOME_CATEGORIES;
  expenseCategories: typeof EXPENSE_CATEGORIES;

  selectedMember: string | null;
  dateRange: DateRange;
  transactionType: TransactionTypeFilter;
  searchText: string;

  setSelectedMember: (memberId: string | null) => void;
  setDateRange: (range: DateRange) => void;
  setTransactionType: (type: TransactionTypeFilter) => void;
  setSearchText: (text: string) => void;

  addTransaction: (input: Omit<Transaction, "id"> & { id?: string }) => Transaction;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addGoal: (input: Omit<Goal, "id"> & { id?: string }) => Goal;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  addCreditCard: (input: Omit<CreditCard, "id"> & { id?: string }) => CreditCard;
  updateCreditCard: (id: string, patch: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;

  addBankAccount: (input: Omit<BankAccount, "id"> & { id?: string }) => BankAccount;
  updateBankAccount: (id: string, patch: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;

  addFamilyMember: (input: Omit<FamilyMember, "id"> & { id?: string }) => FamilyMember;
  updateFamilyMember: (id: string, patch: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;

  getFilteredTransactions: () => Transaction[];
  calculateTotalBalance: () => number;
  calculateIncomeForPeriod: () => number;
  calculateExpensesForPeriod: () => number;
  calculateExpensesByCategory: () => CategoryExpense[];
  calculateCategoryPercentage: (categoryAmount: number) => number;
  calculateSavingsRate: () => number;
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  // TODO(Supabase): trocar estado em memória por sync remoto; sem storage local.
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(initialCreditCards);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>(mockFamilyMembers);

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => getCurrentMonthRange());
  const [transactionType, setTransactionType] =
    useState<TransactionTypeFilter>("all");
  const [searchText, setSearchText] = useState("");

  const addTransaction = useCallback(
    (input: Omit<Transaction, "id"> & { id?: string }) => {
      const next: Transaction = {
        ...input,
        id: input.id ?? createEntityId("tx"),
      };
      setTransactions((current) => [next, ...current]);
      return next;
    },
    [],
  );

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    setTransactions((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }, []);

  const addGoal = useCallback((input: Omit<Goal, "id"> & { id?: string }) => {
    const next: Goal = { ...input, id: input.id ?? createEntityId("goal") };
    setGoals((current) => [next, ...current]);
    return next;
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setGoals((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((current) => current.filter((item) => item.id !== id));
  }, []);

  const addCreditCard = useCallback(
    (input: Omit<CreditCard, "id"> & { id?: string }) => {
      const next: CreditCard = {
        ...input,
        id: input.id ?? createEntityId("card"),
      };
      setCreditCards((current) => [next, ...current]);
      return next;
    },
    [],
  );

  const updateCreditCard = useCallback((id: string, patch: Partial<CreditCard>) => {
    setCreditCards((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards((current) => current.filter((item) => item.id !== id));
  }, []);

  const addBankAccount = useCallback(
    (input: Omit<BankAccount, "id"> & { id?: string }) => {
      const next: BankAccount = {
        ...input,
        id: input.id ?? createEntityId("acc"),
      };
      setBankAccounts((current) => [next, ...current]);
      return next;
    },
    [],
  );

  const updateBankAccount = useCallback((id: string, patch: Partial<BankAccount>) => {
    setBankAccounts((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts((current) => current.filter((item) => item.id !== id));
  }, []);

  const addFamilyMember = useCallback(
    (input: Omit<FamilyMember, "id"> & { id?: string }) => {
      const next: FamilyMember = {
        ...input,
        id: input.id ?? createEntityId("member"),
      };
      setFamilyMembers((current) => [...current, next]);
      return next;
    },
    [],
  );

  const updateFamilyMember = useCallback(
    (id: string, patch: Partial<FamilyMember>) => {
      setFamilyMembers((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers((current) => current.filter((item) => item.id !== id));
    setSelectedMember((current) => (current === id ? null : current));
  }, []);

  const value = useMemo<FinanceContextValue>(() => {
    const filters = {
      selectedMember,
      dateRange,
      transactionType,
      searchText,
    };

    const filtered = () => getFilteredTransactions(transactions, filters);
    const income = () => calculateIncomeForPeriod(filtered());
    const expenses = () => calculateExpensesForPeriod(filtered());

    return {
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      incomeCategories: INCOME_CATEGORIES,
      expenseCategories: EXPENSE_CATEGORIES,

      selectedMember,
      dateRange,
      transactionType,
      searchText,

      setSelectedMember,
      setDateRange,
      setTransactionType,
      setSearchText,

      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,

      getFilteredTransactions: filtered,
      calculateTotalBalance: () =>
        calculateTotalBalance(bankAccounts, creditCards, selectedMember),
      calculateIncomeForPeriod: income,
      calculateExpensesForPeriod: expenses,
      calculateExpensesByCategory: () => calculateExpensesByCategory(filtered()),
      calculateCategoryPercentage: (categoryAmount: number) =>
        calculateCategoryPercentage(categoryAmount, income()),
      calculateSavingsRate: () => calculateSavingsRate(income(), expenses()),
    };
  }, [
    transactions,
    goals,
    creditCards,
    bankAccounts,
    familyMembers,
    selectedMember,
    dateRange,
    transactionType,
    searchText,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
  ]);

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextValue {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance deve ser usado dentro de FinanceProvider");
  }
  return context;
}
