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
  CategoryDef,
  CreditCard,
  DateRange,
  FamilyMember,
  Goal,
  Transaction,
  TransactionType,
  TransactionTypeFilter,
} from "../types/finance";
import { generateUniqueId } from "../utils/id";
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

const CATEGORY_COLOR_POOL = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-neutral-600)",
  "var(--color-neutral-500)",
  "var(--color-red-600)",
  "var(--color-blue-600)",
  "var(--color-green-600)",
  "var(--color-yellow-600)",
  "var(--color-neutral-800)",
  "var(--color-blue-500)",
  "var(--color-neutral-700)",
] as const;

type FinanceContextValue = {
  transactions: Transaction[];
  goals: Goal[];
  creditCards: CreditCard[];
  bankAccounts: BankAccount[];
  familyMembers: FamilyMember[];
  incomeCategories: CategoryDef[];
  expenseCategories: CategoryDef[];

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

  addCategory: (input: Omit<CategoryDef, "color"> & { color?: string }) => CategoryDef;
  updateCategory: (
    kind: TransactionType,
    currentName: string,
    patch: Partial<Pick<CategoryDef, "name" | "color">>,
  ) => void;
  deleteCategory: (kind: TransactionType, name: string) => void;
  clearAllData: () => void;

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
  const [incomeCategories, setIncomeCategories] =
    useState<CategoryDef[]>(INCOME_CATEGORIES);
  const [expenseCategories, setExpenseCategories] =
    useState<CategoryDef[]>(EXPENSE_CATEGORIES);

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => getCurrentMonthRange());
  const [transactionType, setTransactionType] =
    useState<TransactionTypeFilter>("all");
  const [searchText, setSearchText] = useState("");

  const addTransaction = useCallback(
    (input: Omit<Transaction, "id"> & { id?: string }) => {
      const next: Transaction = {
        ...input,
        id: input.id ?? generateUniqueId("tx"),
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
    const next: Goal = { ...input, id: input.id ?? generateUniqueId("goal") };
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
        id: input.id ?? generateUniqueId("card"),
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
        id: input.id ?? generateUniqueId("acc"),
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
        id: input.id ?? generateUniqueId("member"),
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

  const addCategory = useCallback(
    (input: Omit<CategoryDef, "color"> & { color?: string }) => {
      const list =
        input.kind === "income" ? incomeCategories : expenseCategories;
      const color =
        input.color ??
        CATEGORY_COLOR_POOL[list.length % CATEGORY_COLOR_POOL.length];
      const next: CategoryDef = {
        name: input.name.trim(),
        color,
        kind: input.kind,
      };

      if (input.kind === "income") {
        setIncomeCategories((current) => [...current, next]);
      } else {
        setExpenseCategories((current) => [...current, next]);
      }

      return next;
    },
    [expenseCategories, incomeCategories],
  );

  const updateCategory = useCallback(
    (
      kind: TransactionType,
      currentName: string,
      patch: Partial<Pick<CategoryDef, "name" | "color">>,
    ) => {
      const nextName = patch.name?.trim();
      const rename = Boolean(nextName && nextName !== currentName);

      const updater = (current: CategoryDef[]) =>
        current.map((item) =>
          item.name === currentName
            ? {
                ...item,
                ...(patch.color ? { color: patch.color } : {}),
                ...(nextName ? { name: nextName } : {}),
              }
            : item,
        );

      if (kind === "income") {
        setIncomeCategories(updater);
      } else {
        setExpenseCategories(updater);
      }

      if (rename && nextName) {
        setTransactions((current) =>
          current.map((tx) =>
            tx.category === currentName ? { ...tx, category: nextName } : tx,
          ),
        );
      }
    },
    [],
  );

  const deleteCategory = useCallback((kind: TransactionType, name: string) => {
    if (kind === "income") {
      setIncomeCategories((current) =>
        current.filter((item) => item.name !== name),
      );
    } else {
      setExpenseCategories((current) =>
        current.filter((item) => item.name !== name),
      );
    }
  }, []);

  const clearAllData = useCallback(() => {
    setTransactions([]);
    setGoals([]);
    setCreditCards([]);
    setBankAccounts([]);
    setFamilyMembers([]);
    setIncomeCategories([]);
    setExpenseCategories([]);
    setSelectedMember(null);
    setDateRange(getCurrentMonthRange());
    setTransactionType("all");
    setSearchText("");
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
      incomeCategories,
      expenseCategories,

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
      addCategory,
      updateCategory,
      deleteCategory,
      clearAllData,

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
    incomeCategories,
    expenseCategories,
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
    addCategory,
    updateCategory,
    deleteCategory,
    clearAllData,
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
