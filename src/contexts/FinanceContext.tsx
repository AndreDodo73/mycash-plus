import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
import {
  clearUserFinanceData,
  generateRecurringForMonth,
  insertBankAccount,
  insertCategory,
  insertCreditCard,
  insertFamilyMember,
  insertGoal,
  insertTransaction,
  loadFinanceSnapshot,
  patchBankAccount,
  patchCategory,
  patchCreditCard,
  patchFamilyMember,
  patchGoal,
  patchTransaction,
  removeBankAccount,
  removeCategory,
  removeCreditCard,
  removeFamilyMember,
  removeGoal,
  removeTransaction,
  seedDefaultCategories,
} from "../services/financeDb";
import { useAuth } from "./AuthContext";
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
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;

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

function emptySnapshot() {
  return {
    transactions: [] as Transaction[],
    goals: [] as Goal[],
    creditCards: [] as CreditCard[],
    bankAccounts: [] as BankAccount[],
    familyMembers: [] as FamilyMember[],
    incomeCategories: [] as CategoryDef[],
    expenseCategories: [] as CategoryDef[],
  };
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<CategoryDef[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<CategoryDef[]>([]);

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => getCurrentMonthRange());
  const [transactionType, setTransactionType] =
    useState<TransactionTypeFilter>("all");
  const [searchText, setSearchText] = useState("");

  const allCategories = useMemo(
    () => [...incomeCategories, ...expenseCategories],
    [incomeCategories, expenseCategories],
  );

  const refresh = useCallback(async () => {
    if (!userId) {
      const empty = emptySnapshot();
      setTransactions(empty.transactions);
      setGoals(empty.goals);
      setCreditCards(empty.creditCards);
      setBankAccounts(empty.bankAccounts);
      setFamilyMembers(empty.familyMembers);
      setIncomeCategories(empty.incomeCategories);
      setExpenseCategories(empty.expenseCategories);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await seedDefaultCategories(userId);
      await generateRecurringForMonth(userId);
      const snapshot = await loadFinanceSnapshot(userId);
      setFamilyMembers(snapshot.familyMembers);
      setBankAccounts(snapshot.bankAccounts);
      setCreditCards(snapshot.creditCards);
      setTransactions(snapshot.transactions);
      setGoals(snapshot.goals);
      setIncomeCategories(snapshot.incomeCategories);
      setExpenseCategories(snapshot.expenseCategories);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao carregar dados do Supabase.";
      console.error("[finance]", err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !userId) {
      const empty = emptySnapshot();
      setTransactions(empty.transactions);
      setGoals(empty.goals);
      setCreditCards(empty.creditCards);
      setBankAccounts(empty.bankAccounts);
      setFamilyMembers(empty.familyMembers);
      setIncomeCategories(empty.incomeCategories);
      setExpenseCategories(empty.expenseCategories);
      setIsLoading(false);
      return;
    }
    void refresh();
  }, [authLoading, isAuthenticated, userId, refresh]);

  const addTransaction = useCallback(
    (input: Omit<Transaction, "id"> & { id?: string }) => {
      const optimistic: Transaction = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
      };
      setTransactions((current) => [optimistic, ...current]);
      if (userId) {
        void insertTransaction(optimistic, allCategories, userId).catch((err) => {
          console.error(err);
          void refresh();
        });
      }
      return optimistic;
    },
    [allCategories, refresh, userId],
  );

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      setTransactions((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
      void patchTransaction(id, patch, allCategories).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [allCategories, refresh],
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((current) => current.filter((item) => item.id !== id));
      void removeTransaction(id).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const addGoal = useCallback(
    (input: Omit<Goal, "id"> & { id?: string }) => {
      const next: Goal = { ...input, id: input.id ?? crypto.randomUUID() };
      setGoals((current) => [next, ...current]);
      if (userId) {
        void insertGoal(next, userId).catch((err) => {
          console.error(err);
          void refresh();
        });
      }
      return next;
    },
    [refresh, userId],
  );

  const updateGoal = useCallback(
    (id: string, patch: Partial<Goal>) => {
      setGoals((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
      void patchGoal(id, patch).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((current) => current.filter((item) => item.id !== id));
      void removeGoal(id).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const addCreditCard = useCallback(
    (input: Omit<CreditCard, "id"> & { id?: string }) => {
      const next: CreditCard = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
        expenseIds: input.expenseIds ?? [],
      };
      setCreditCards((current) => [next, ...current]);
      if (userId) {
        void insertCreditCard(next, userId).catch((err) => {
          console.error(err);
          void refresh();
        });
      }
      return next;
    },
    [refresh, userId],
  );

  const updateCreditCard = useCallback(
    (id: string, patch: Partial<CreditCard>) => {
      setCreditCards((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
      void patchCreditCard(id, patch).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const deleteCreditCard = useCallback(
    (id: string) => {
      setCreditCards((current) => current.filter((item) => item.id !== id));
      void removeCreditCard(id).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const addBankAccount = useCallback(
    (input: Omit<BankAccount, "id"> & { id?: string }) => {
      const next: BankAccount = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
      };
      setBankAccounts((current) => [next, ...current]);
      if (userId) {
        void insertBankAccount(next, userId).catch((err) => {
          console.error(err);
          void refresh();
        });
      }
      return next;
    },
    [refresh, userId],
  );

  const updateBankAccount = useCallback(
    (id: string, patch: Partial<BankAccount>) => {
      setBankAccounts((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
      void patchBankAccount(id, patch).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const deleteBankAccount = useCallback(
    (id: string) => {
      setBankAccounts((current) => current.filter((item) => item.id !== id));
      void removeBankAccount(id).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const addFamilyMember = useCallback(
    (input: Omit<FamilyMember, "id"> & { id?: string }) => {
      const next: FamilyMember = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
      };
      setFamilyMembers((current) => [...current, next]);
      if (userId) {
        void insertFamilyMember(next, userId).catch((err) => {
          console.error(err);
          void refresh();
        });
      }
      return next;
    },
    [refresh, userId],
  );

  const updateFamilyMember = useCallback(
    (id: string, patch: Partial<FamilyMember>) => {
      setFamilyMembers((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
      void patchFamilyMember(id, patch).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const deleteFamilyMember = useCallback(
    (id: string) => {
      setFamilyMembers((current) => current.filter((item) => item.id !== id));
      setSelectedMember((current) => (current === id ? null : current));
      void removeFamilyMember(id).catch((err) => {
        console.error(err);
        void refresh();
      });
    },
    [refresh],
  );

  const addCategory = useCallback(
    (input: Omit<CategoryDef, "color"> & { color?: string }) => {
      const list =
        input.kind === "income" ? incomeCategories : expenseCategories;
      const color =
        input.color ??
        CATEGORY_COLOR_POOL[list.length % CATEGORY_COLOR_POOL.length];
      const next: CategoryDef = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        color,
        kind: input.kind,
      };

      if (input.kind === "income") {
        setIncomeCategories((current) => [...current, next]);
      } else {
        setExpenseCategories((current) => [...current, next]);
      }

      if (userId) {
        void insertCategory(next, userId).catch((err) => {
          console.error(err);
          void refresh();
        });
      }

      return next;
    },
    [expenseCategories, incomeCategories, refresh, userId],
  );

  const updateCategory = useCallback(
    (
      kind: TransactionType,
      currentName: string,
      patch: Partial<Pick<CategoryDef, "name" | "color">>,
    ) => {
      const list = kind === "income" ? incomeCategories : expenseCategories;
      const target = list.find((item) => item.name === currentName);
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

      if (target?.id) {
        void patchCategory(target.id, patch).catch((err) => {
          console.error(err);
          void refresh();
        });
      }
    },
    [expenseCategories, incomeCategories, refresh],
  );

  const deleteCategory = useCallback(
    (kind: TransactionType, name: string) => {
      const list = kind === "income" ? incomeCategories : expenseCategories;
      const target = list.find((item) => item.name === name);

      if (kind === "income") {
        setIncomeCategories((current) =>
          current.filter((item) => item.name !== name),
        );
      } else {
        setExpenseCategories((current) =>
          current.filter((item) => item.name !== name),
        );
      }

      if (target?.id) {
        void removeCategory(target.id).catch((err) => {
          console.error(err);
          void refresh();
        });
      }
    },
    [expenseCategories, incomeCategories, refresh],
  );

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

    if (userId) {
      void clearUserFinanceData(userId)
        .then(() => seedDefaultCategories(userId))
        .then(() => refresh())
        .catch((err) => console.error(err));
    }
  }, [refresh, userId]);

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
      isLoading,
      error,
      refresh,

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
    isLoading,
    error,
    refresh,
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
