export type TransactionType = "income" | "expense";
export type TransactionStatus = "pending" | "completed";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: Date;
  accountId: string;
  memberId: string | null;
  installments: number;
  status: TransactionStatus;
  isRecurring: boolean;
  isPaid: boolean;
}

export type GoalStatus = "active" | "archived";

export interface Goal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline: Date | null;
  status: GoalStatus;
}

export type CardTheme = "black" | "lime" | "white";

export type BankAccountType = "checking" | "savings" | "other";

export interface CreditCard {
  id: string;
  name: string;
  closingDay: number;
  dueDay: number;
  limit: number;
  currentInvoice: number;
  theme: CardTheme;
  logoUrl?: string;
  lastFourDigits?: string;
  expenseIds: string[];
  /** Titular do cartão — usado no saldo filtrado por membro. */
  holderId: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: BankAccountType;
  balance: number;
  color: string;
  /** Membro titular da conta (filtro de saldo / P14). */
  holderId: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  monthlyIncome?: number;
  email?: string;
}

export interface CategoryDef {
  name: string;
  color: string;
  kind: TransactionType;
}

export type TransactionTypeFilter = "all" | TransactionType;

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
