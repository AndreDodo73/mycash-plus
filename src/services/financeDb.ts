import type {
  BankAccount,
  BankAccountType,
  CardTheme,
  CategoryDef,
  CreditCard,
  FamilyMember,
  Goal,
  GoalStatus,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../types/finance";
import { DEMO_USER_ID } from "../lib/demoUser";
import { supabase } from "../lib/supabase";

type DbTransactionType = "INCOME" | "EXPENSE";
type DbAccountType = "CHECKING" | "SAVINGS" | "CREDIT_CARD";
type DbTransactionStatus = "PENDING" | "COMPLETED";
type DbGoalStatus = "ACTIVE" | "ARCHIVED";

export type FinanceSnapshot = {
  familyMembers: FamilyMember[];
  bankAccounts: BankAccount[];
  creditCards: CreditCard[];
  transactions: Transaction[];
  goals: Goal[];
  incomeCategories: CategoryDef[];
  expenseCategories: CategoryDef[];
  /** id → CategoryDef (para resolver categoryId nas transactions) */
  categoriesById: Record<string, CategoryDef>;
};

function toAppTxType(value: DbTransactionType): TransactionType {
  return value === "INCOME" ? "income" : "expense";
}

function toDbTxType(value: TransactionType): DbTransactionType {
  return value === "income" ? "INCOME" : "EXPENSE";
}

function toAppStatus(value: DbTransactionStatus): TransactionStatus {
  return value === "PENDING" ? "pending" : "completed";
}

function toDbStatus(value: TransactionStatus): DbTransactionStatus {
  return value === "pending" ? "PENDING" : "COMPLETED";
}

function toAppGoalStatus(value: DbGoalStatus): GoalStatus {
  return value === "ARCHIVED" ? "archived" : "active";
}

function toDbGoalStatus(value: GoalStatus): DbGoalStatus {
  return value === "archived" ? "ARCHIVED" : "ACTIVE";
}

function toAppAccountType(value: DbAccountType): BankAccountType {
  if (value === "SAVINGS") return "savings";
  if (value === "CHECKING") return "checking";
  return "other";
}

function toDbBankType(value: BankAccountType): DbAccountType {
  if (value === "savings") return "SAVINGS";
  if (value === "checking") return "CHECKING";
  return "CHECKING";
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function formatDate(value: Date): string {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function num(value: unknown): number {
  return Number(value ?? 0);
}

export async function loadFinanceSnapshot(
  userId: string = DEMO_USER_ID,
): Promise<FinanceSnapshot> {
  const [
    membersRes,
    accountsRes,
    categoriesRes,
    transactionsRes,
    goalsRes,
  ] = await Promise.all([
    supabase.from("family_members").select("*").eq("user_id", userId).eq("is_active", true),
    supabase.from("accounts").select("*").eq("user_id", userId).eq("is_active", true),
    supabase.from("categories").select("*").eq("user_id", userId).eq("is_active", true),
    supabase.from("transactions").select("*").eq("user_id", userId).order("date", { ascending: false }),
    supabase.from("goals").select("*").eq("user_id", userId),
  ]);

  const errors = [
    membersRes.error,
    accountsRes.error,
    categoriesRes.error,
    transactionsRes.error,
    goalsRes.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(errors.map((e) => e!.message).join("; "));
  }

  const categoriesById: Record<string, CategoryDef> = {};
  const incomeCategories: CategoryDef[] = [];
  const expenseCategories: CategoryDef[] = [];

  for (const row of categoriesRes.data ?? []) {
    const kind = toAppTxType(row.type as DbTransactionType);
    const def: CategoryDef = {
      id: row.id as string,
      name: row.name as string,
      color: row.color as string,
      kind,
    };
    categoriesById[def.id!] = def;
    if (kind === "income") incomeCategories.push(def);
    else expenseCategories.push(def);
  }

  const familyMembers: FamilyMember[] = (membersRes.data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    role: row.role as string,
    avatarUrl: (row.avatar_url as string | null) ?? "",
    monthlyIncome: num(row.monthly_income),
    email: undefined,
  }));

  const bankAccounts: BankAccount[] = [];
  const creditCards: CreditCard[] = [];

  for (const row of accountsRes.data ?? []) {
    const type = row.type as DbAccountType;
    if (type === "CREDIT_CARD") {
      creditCards.push({
        id: row.id as string,
        name: row.name as string,
        closingDay: Number(row.closing_day ?? 1),
        dueDay: Number(row.due_day ?? 1),
        limit: num(row.credit_limit),
        currentInvoice: num(row.current_bill),
        theme: ((row.theme as string) || "black") as CardTheme,
        logoUrl: (row.logo_url as string | null) ?? undefined,
        lastFourDigits: (row.last_digits as string | null) ?? undefined,
        expenseIds: [],
        holderId: row.holder_id as string,
      });
    } else {
      bankAccounts.push({
        id: row.id as string,
        name: row.name as string,
        type: toAppAccountType(type),
        balance: num(row.balance),
        color: row.color as string,
        holderId: row.holder_id as string,
      });
    }
  }

  const transactions: Transaction[] = (transactionsRes.data ?? []).map((row) => {
    const categoryId = row.category_id as string | null;
    const categoryName = categoryId
      ? (categoriesById[categoryId]?.name ?? "Sem categoria")
      : "Sem categoria";
    const status = toAppStatus(row.status as DbTransactionStatus);
    return {
      id: row.id as string,
      type: toAppTxType(row.type as DbTransactionType),
      amount: num(row.amount),
      description: row.description as string,
      category: categoryName,
      date: parseDate(row.date as string),
      accountId: (row.account_id as string | null) ?? "",
      memberId: (row.member_id as string | null) ?? null,
      installments: Number(row.total_installments ?? 1),
      status,
      isRecurring: Boolean(row.is_recurring),
      isPaid: status === "completed",
    };
  });

  // Liga despesas de cartão às faturas (expenseIds)
  for (const card of creditCards) {
    card.expenseIds = transactions
      .filter((tx) => tx.type === "expense" && tx.accountId === card.id)
      .map((tx) => tx.id);
  }

  const goals: Goal[] = (goalsRes.data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    imageUrl: row.image_url as string,
    targetAmount: num(row.target_amount),
    currentAmount: num(row.current_amount),
    category: row.category as string,
    deadline: row.deadline ? parseDate(row.deadline as string) : null,
    status: toAppGoalStatus(row.status as DbGoalStatus),
  }));

  return {
    familyMembers,
    bankAccounts,
    creditCards,
    transactions,
    goals,
    incomeCategories,
    expenseCategories,
    categoriesById,
  };
}

function findCategoryId(
  categories: CategoryDef[],
  name: string,
  kind: TransactionType,
): string | null {
  return categories.find((c) => c.name === name && c.kind === kind)?.id ?? null;
}

export async function insertFamilyMember(
  input: Omit<FamilyMember, "id"> & { id?: string },
  userId: string = DEMO_USER_ID,
): Promise<FamilyMember> {
  const id = input.id ?? crypto.randomUUID();
  const { error } = await supabase.from("family_members").insert({
    id,
    user_id: userId,
    name: input.name,
    role: input.role,
    avatar_url: input.avatarUrl || null,
    monthly_income: input.monthlyIncome ?? 0,
  });
  if (error) throw error;
  return { ...input, id, avatarUrl: input.avatarUrl ?? "" };
}

export async function patchFamilyMember(
  id: string,
  patch: Partial<FamilyMember>,
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.role !== undefined) payload.role = patch.role;
  if (patch.avatarUrl !== undefined) payload.avatar_url = patch.avatarUrl || null;
  if (patch.monthlyIncome !== undefined) payload.monthly_income = patch.monthlyIncome;
  const { error } = await supabase.from("family_members").update(payload).eq("id", id);
  if (error) throw error;
}

export async function removeFamilyMember(id: string): Promise<void> {
  const { error } = await supabase
    .from("family_members")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function insertBankAccount(
  input: Omit<BankAccount, "id"> & { id?: string },
  userId: string = DEMO_USER_ID,
): Promise<BankAccount> {
  const id = input.id ?? crypto.randomUUID();
  const { error } = await supabase.from("accounts").insert({
    id,
    user_id: userId,
    type: toDbBankType(input.type),
    name: input.name,
    bank: input.name,
    holder_id: input.holderId,
    balance: input.balance,
    color: input.color,
  });
  if (error) throw error;
  return { ...input, id };
}

export async function patchBankAccount(
  id: string,
  patch: Partial<BankAccount>,
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) {
    payload.name = patch.name;
    payload.bank = patch.name;
  }
  if (patch.type !== undefined) payload.type = toDbBankType(patch.type);
  if (patch.balance !== undefined) payload.balance = patch.balance;
  if (patch.color !== undefined) payload.color = patch.color;
  if (patch.holderId !== undefined) payload.holder_id = patch.holderId;
  const { error } = await supabase.from("accounts").update(payload).eq("id", id);
  if (error) throw error;
}

export async function removeBankAccount(id: string): Promise<void> {
  const { error } = await supabase
    .from("accounts")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function insertCreditCard(
  input: Omit<CreditCard, "id"> & { id?: string },
  userId: string = DEMO_USER_ID,
): Promise<CreditCard> {
  const id = input.id ?? crypto.randomUUID();
  const { error } = await supabase.from("accounts").insert({
    id,
    user_id: userId,
    type: "CREDIT_CARD",
    name: input.name,
    bank: input.name,
    last_digits: input.lastFourDigits ?? null,
    holder_id: input.holderId,
    credit_limit: input.limit,
    current_bill: input.currentInvoice,
    due_day: input.dueDay,
    closing_day: input.closingDay,
    theme: input.theme,
    logo_url: input.logoUrl ?? null,
  });
  if (error) throw error;
  return { ...input, id, expenseIds: input.expenseIds ?? [] };
}

export async function patchCreditCard(
  id: string,
  patch: Partial<CreditCard>,
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) {
    payload.name = patch.name;
    payload.bank = patch.name;
  }
  if (patch.limit !== undefined) payload.credit_limit = patch.limit;
  if (patch.currentInvoice !== undefined) payload.current_bill = patch.currentInvoice;
  if (patch.dueDay !== undefined) payload.due_day = patch.dueDay;
  if (patch.closingDay !== undefined) payload.closing_day = patch.closingDay;
  if (patch.theme !== undefined) payload.theme = patch.theme;
  if (patch.logoUrl !== undefined) payload.logo_url = patch.logoUrl;
  if (patch.lastFourDigits !== undefined) payload.last_digits = patch.lastFourDigits;
  if (patch.holderId !== undefined) payload.holder_id = patch.holderId;
  const { error } = await supabase.from("accounts").update(payload).eq("id", id);
  if (error) throw error;
}

export async function removeCreditCard(id: string): Promise<void> {
  const { error } = await supabase
    .from("accounts")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function insertGoal(
  input: Omit<Goal, "id"> & { id?: string },
  userId: string = DEMO_USER_ID,
): Promise<Goal> {
  const id = input.id ?? crypto.randomUUID();
  const { error } = await supabase.from("goals").insert({
    id,
    user_id: userId,
    name: input.name,
    description: input.description,
    image_url: input.imageUrl,
    target_amount: input.targetAmount,
    current_amount: input.currentAmount,
    category: input.category,
    deadline: input.deadline ? formatDate(input.deadline) : null,
    status: toDbGoalStatus(input.status),
  });
  if (error) throw error;
  return { ...input, id };
}

export async function patchGoal(id: string, patch: Partial<Goal>): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.imageUrl !== undefined) payload.image_url = patch.imageUrl;
  if (patch.targetAmount !== undefined) payload.target_amount = patch.targetAmount;
  if (patch.currentAmount !== undefined) payload.current_amount = patch.currentAmount;
  if (patch.category !== undefined) payload.category = patch.category;
  if (patch.deadline !== undefined) {
    payload.deadline = patch.deadline ? formatDate(patch.deadline) : null;
  }
  if (patch.status !== undefined) payload.status = toDbGoalStatus(patch.status);
  const { error } = await supabase.from("goals").update(payload).eq("id", id);
  if (error) throw error;
}

export async function removeGoal(id: string): Promise<void> {
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw error;
}

export async function insertTransaction(
  input: Omit<Transaction, "id"> & { id?: string },
  categories: CategoryDef[],
  userId: string = DEMO_USER_ID,
): Promise<Transaction> {
  const id = input.id ?? crypto.randomUUID();
  const categoryId = findCategoryId(categories, input.category, input.type);
  const { error } = await supabase.from("transactions").insert({
    id,
    user_id: userId,
    type: toDbTxType(input.type),
    amount: input.amount,
    description: input.description,
    date: formatDate(input.date),
    category_id: categoryId,
    account_id: input.accountId || null,
    member_id: input.memberId,
    total_installments: Math.min(12, Math.max(1, input.installments || 1)),
    is_recurring: input.isRecurring,
    status: toDbStatus(input.status),
  });
  if (error) throw error;
  return { ...input, id };
}

export async function patchTransaction(
  id: string,
  patch: Partial<Transaction>,
  categories: CategoryDef[],
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.type !== undefined) payload.type = toDbTxType(patch.type);
  if (patch.amount !== undefined) payload.amount = patch.amount;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.date !== undefined) payload.date = formatDate(patch.date);
  if (patch.accountId !== undefined) payload.account_id = patch.accountId || null;
  if (patch.memberId !== undefined) payload.member_id = patch.memberId;
  if (patch.installments !== undefined) {
    payload.total_installments = Math.min(12, Math.max(1, patch.installments));
  }
  if (patch.isRecurring !== undefined) payload.is_recurring = patch.isRecurring;
  if (patch.status !== undefined) payload.status = toDbStatus(patch.status);
  if (patch.category !== undefined) {
    const kind = patch.type ?? "expense";
    payload.category_id = findCategoryId(categories, patch.category, kind);
  }
  const { error } = await supabase.from("transactions").update(payload).eq("id", id);
  if (error) throw error;
}

export async function removeTransaction(id: string): Promise<void> {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

export async function insertCategory(
  input: Omit<CategoryDef, "color" | "id"> & { color?: string; id?: string },
  userId: string = DEMO_USER_ID,
): Promise<CategoryDef> {
  const id = input.id ?? crypto.randomUUID();
  const color = input.color ?? "#3247FF";
  const { error } = await supabase.from("categories").insert({
    id,
    user_id: userId,
    name: input.name.trim(),
    type: toDbTxType(input.kind),
    color,
  });
  if (error) throw error;
  return { id, name: input.name.trim(), color, kind: input.kind };
}

export async function patchCategory(
  id: string,
  patch: Partial<Pick<CategoryDef, "name" | "color">>,
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) payload.name = patch.name.trim();
  if (patch.color !== undefined) payload.color = patch.color;
  const { error } = await supabase.from("categories").update(payload).eq("id", id);
  if (error) throw error;
}

export async function removeCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function clearUserFinanceData(
  userId: string = DEMO_USER_ID,
): Promise<void> {
  const ops = await Promise.all([
    supabase.from("transactions").delete().eq("user_id", userId),
    supabase.from("goals").delete().eq("user_id", userId),
    supabase.from("recurring_transactions").delete().eq("user_id", userId),
    supabase.from("accounts").delete().eq("user_id", userId),
    supabase.from("categories").delete().eq("user_id", userId),
    supabase.from("family_members").delete().eq("user_id", userId),
  ]);
  const firstError = ops.find((r) => r.error)?.error;
  if (firstError) throw firstError;
}

export async function seedDefaultCategories(userId: string): Promise<void> {
  const { error } = await supabase.rpc("seed_default_categories", {
    p_user_id: userId,
  });
  if (error) throw error;
}

export async function generateRecurringForMonth(
  userId: string,
): Promise<number> {
  const { data, error } = await supabase.rpc("generate_recurring_transactions", {
    p_user_id: userId,
  });
  if (error) throw error;
  return Number(data ?? 0);
}
