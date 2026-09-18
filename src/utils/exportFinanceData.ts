import type {
  BankAccount,
  CategoryDef,
  CreditCard,
  FamilyMember,
  Goal,
  Transaction,
} from "../types/finance";
import { buildTransactionsCsv } from "./exportTransactionsCsv";

export type FinanceExportPayload = {
  version: string;
  exportedAt: string;
  transactions: Array<Omit<Transaction, "date"> & { date: string }>;
  goals: Array<Omit<Goal, "deadline"> & { deadline: string | null }>;
  creditCards: CreditCard[];
  bankAccounts: BankAccount[];
  familyMembers: FamilyMember[];
  incomeCategories: CategoryDef[];
  expenseCategories: CategoryDef[];
};

type CsvResolvers = {
  memberName: (memberId: string | null) => string;
  accountName: (accountId: string) => string;
};

function serializeDate(date: Date): string {
  return date.toISOString();
}

export function buildFinanceExportJson(input: {
  transactions: Transaction[];
  goals: Goal[];
  creditCards: CreditCard[];
  bankAccounts: BankAccount[];
  familyMembers: FamilyMember[];
  incomeCategories: CategoryDef[];
  expenseCategories: CategoryDef[];
}): FinanceExportPayload {
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    transactions: input.transactions.map((tx) => ({
      ...tx,
      date: serializeDate(tx.date),
    })),
    goals: input.goals.map((goal) => ({
      ...goal,
      deadline: goal.deadline ? serializeDate(goal.deadline) : null,
    })),
    creditCards: input.creditCards,
    bankAccounts: input.bankAccounts,
    familyMembers: input.familyMembers,
    incomeCategories: input.incomeCategories,
    expenseCategories: input.expenseCategories,
  };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadFinanceJson(
  payload: FinanceExportPayload,
  filename = "mycash-backup.json",
): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  triggerDownload(blob, filename);
}

export function downloadFinanceCsv(
  transactions: Transaction[],
  resolvers: CsvResolvers,
  filename = "mycash-transacoes.csv",
): void {
  const csv = buildTransactionsCsv(transactions, resolvers);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}
