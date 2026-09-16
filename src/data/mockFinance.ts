import type {
  BankAccount,
  CategoryDef,
  CreditCard,
  FamilyMember,
  Goal,
  Transaction,
} from "../types/finance";
import avatarPlaceholder from "../assets/sidebar/avatar-placeholder.png";

/** IDs estáveis para o mock (referenciados entre entidades). */
export const MEMBER_IDS = {
  lucas: "member-lucas",
  maria: "member-maria",
  pedro: "member-pedro",
} as const;

export const ACCOUNT_IDS = {
  nubank: "acc-nubank",
  inter: "acc-inter",
  picpay: "acc-picpay",
} as const;

export const CARD_IDS = {
  nubank: "card-nubank",
  inter: "card-inter",
  picpay: "card-picpay",
} as const;

export const INCOME_CATEGORIES: CategoryDef[] = [
  { name: "Salário", color: "var(--color-primary)", kind: "income" },
  { name: "Freelance", color: "var(--color-secondary)", kind: "income" },
  { name: "Investimentos", color: "var(--color-neutral-600)", kind: "income" },
  { name: "Outros", color: "var(--color-neutral-500)", kind: "income" },
];

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { name: "Aluguel", color: "var(--color-primary)", kind: "expense" },
  { name: "Alimentação", color: "var(--color-secondary)", kind: "expense" },
  { name: "Mercado", color: "var(--color-neutral-600)", kind: "expense" },
  { name: "Academia", color: "var(--color-red-600)", kind: "expense" },
  { name: "Transporte", color: "var(--color-blue-600)", kind: "expense" },
  { name: "Saúde", color: "var(--color-green-600)", kind: "expense" },
  { name: "Lazer", color: "var(--color-yellow-600)", kind: "expense" },
  { name: "Educação", color: "var(--color-neutral-800)", kind: "expense" },
  { name: "Moradia", color: "var(--color-blue-500)", kind: "expense" },
  { name: "Assinaturas", color: "var(--color-neutral-700)", kind: "expense" },
];
function daysAgo(days: number): Date {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: MEMBER_IDS.lucas,
    name: "Lucas Marte",
    role: "Pai",
    avatarUrl: avatarPlaceholder,
    monthlyIncome: 8500,
    email: "lucasmarte@gmail.com",
  },
  {
    id: MEMBER_IDS.maria,
    name: "Maria Marte",
    role: "Mãe",
    avatarUrl: avatarPlaceholder,
    monthlyIncome: 6200,
    email: "mariamarte@gmail.com",
  },
  {
    id: MEMBER_IDS.pedro,
    name: "Pedro Marte",
    role: "Filho",
    avatarUrl: avatarPlaceholder,
    monthlyIncome: 0,
  },
];

export const mockBankAccounts: BankAccount[] = [
  {
    id: ACCOUNT_IDS.nubank,
    name: "Nubank Conta",
    type: "checking",
    balance: 4250.4,
    color: "var(--color-purple-600)",
    holderId: MEMBER_IDS.lucas,
  },
  {
    id: ACCOUNT_IDS.inter,
    name: "Inter Conta",
    type: "checking",
    balance: 3120.75,
    color: "var(--color-orange-600)",
    holderId: MEMBER_IDS.maria,
  },
  {
    id: ACCOUNT_IDS.picpay,
    name: "PicPay",
    type: "other",
    balance: 890.2,
    color: "var(--color-green-600)",
    holderId: MEMBER_IDS.pedro,
  },
];

export const mockCreditCards: CreditCard[] = [
  {
    id: CARD_IDS.nubank,
    name: "Nubank",
    closingDay: 5,
    dueDay: 12,
    limit: 8000,
    currentInvoice: 1840.5,
    theme: "black",
    lastFourDigits: "4412",
    expenseIds: [],
    holderId: MEMBER_IDS.lucas,
  },
  {
    id: CARD_IDS.inter,
    name: "Inter",
    closingDay: 10,
    dueDay: 17,
    limit: 5000,
    currentInvoice: 960.3,
    theme: "lime",
    lastFourDigits: "2281",
    expenseIds: [],
    holderId: MEMBER_IDS.maria,
  },
  {
    id: CARD_IDS.picpay,
    name: "PicPay",
    closingDay: 20,
    dueDay: 27,
    limit: 2500,
    currentInvoice: 320.9,
    theme: "white",
    lastFourDigits: "0199",
    expenseIds: [],
    holderId: MEMBER_IDS.pedro,
  },
];

export const mockGoals: Goal[] = [
  {
    id: "goal-viagem",
    name: "Viagem Família",
    description: "Férias de fim de ano em Florianópolis",
    imageUrl: "",
    targetAmount: 12000,
    currentAmount: 4800,
    category: "Lazer",
    deadline: daysAgo(-90),
    status: "active",
  },
  {
    id: "goal-reserva",
    name: "Reserva de Emergência",
    description: "Seis meses de custo fixo da casa",
    imageUrl: "",
    targetAmount: 30000,
    currentAmount: 12500,
    category: "Moradia",
    deadline: null,
    status: "active",
  },
  {
    id: "goal-notebook",
    name: "Notebook Novo",
    description: "Upgrade do equipamento de trabalho",
    imageUrl: "",
    targetAmount: 6500,
    currentAmount: 2100,
    category: "Educação",
    deadline: daysAgo(-45),
    status: "active",
  },
  {
    id: "goal-carro",
    name: "Entrada do Carro",
    description: "Entrada para financiamento do próximo carro",
    imageUrl: "",
    targetAmount: 20000,
    currentAmount: 3500,
    category: "Transporte",
    deadline: daysAgo(-180),
    status: "archived",
  },
];

type MockTxInput = Omit<
  Transaction,
  "id" | "installments" | "isRecurring" | "isPaid" | "status"
> &
  Partial<Pick<Transaction, "installments" | "isRecurring" | "isPaid" | "status">>;

const rawTransactions: MockTxInput[] = [
  {
    type: "income",
    amount: 8500,
    description: "Salário Lucas",
    category: "Salário",
    date: daysAgo(12),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
  },
  {
    type: "income",
    amount: 6200,
    description: "Salário Maria",
    category: "Salário",
    date: daysAgo(11),
    accountId: ACCOUNT_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "income",
    amount: 8500,
    description: "Salário Lucas",
    category: "Salário",
    date: daysAgo(42),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
  },
  {
    type: "income",
    amount: 6200,
    description: "Salário Maria",
    category: "Salário",
    date: daysAgo(41),
    accountId: ACCOUNT_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "income",
    amount: 8500,
    description: "Salário Lucas",
    category: "Salário",
    date: daysAgo(72),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
  },
  {
    type: "income",
    amount: 1800,
    description: "Freelance design",
    category: "Freelance",
    date: daysAgo(8),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
  },
  {
    type: "income",
    amount: 420,
    description: "Rendimento CDB",
    category: "Investimentos",
    date: daysAgo(20),
    accountId: ACCOUNT_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "income",
    amount: 350,
    description: "Venda de usados",
    category: "Outros",
    date: daysAgo(55),
    accountId: ACCOUNT_IDS.picpay,
    memberId: MEMBER_IDS.pedro,
  },
  {
    type: "expense",
    amount: 2200,
    description: "Aluguel apartamento",
    category: "Aluguel",
    date: daysAgo(5),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
    isRecurring: true,
  },
  {
    type: "expense",
    amount: 2200,
    description: "Aluguel apartamento",
    category: "Aluguel",
    date: daysAgo(35),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
    isRecurring: true,
  },
  {
    type: "expense",
    amount: 2200,
    description: "Aluguel apartamento",
    category: "Aluguel",
    date: daysAgo(65),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
    isRecurring: true,
  },
  {
    type: "expense",
    amount: 486.9,
    description: "Mercado Extra",
    category: "Mercado",
    date: daysAgo(2),
    accountId: CARD_IDS.nubank,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "expense",
    amount: 312.4,
    description: "Mercado semanal",
    category: "Mercado",
    date: daysAgo(9),
    accountId: CARD_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "expense",
    amount: 278.15,
    description: "Feira e hortifruti",
    category: "Mercado",
    date: daysAgo(28),
    accountId: ACCOUNT_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "expense",
    amount: 189.9,
    description: "Restaurante família",
    category: "Alimentação",
    date: daysAgo(3),
    accountId: CARD_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
  },
  {
    type: "expense",
    amount: 64.5,
    description: "Delivery iFood",
    category: "Alimentação",
    date: daysAgo(6),
    accountId: CARD_IDS.picpay,
    memberId: MEMBER_IDS.pedro,
  },
  {
    type: "expense",
    amount: 120,
    description: "Academia Smart Fit",
    category: "Academia",
    date: daysAgo(4),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
    isRecurring: true,
  },
  {
    type: "expense",
    amount: 120,
    description: "Academia Smart Fit",
    category: "Academia",
    date: daysAgo(34),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
    isRecurring: true,
  },
  {
    type: "expense",
    amount: 89.9,
    description: "Uber mensal",
    category: "Transporte",
    date: daysAgo(7),
    accountId: CARD_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
  },
  {
    type: "expense",
    amount: 210,
    description: "Combustível",
    category: "Transporte",
    date: daysAgo(15),
    accountId: CARD_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "expense",
    amount: 45,
    description: "Metrô e ônibus",
    category: "Transporte",
    date: daysAgo(18),
    accountId: ACCOUNT_IDS.picpay,
    memberId: MEMBER_IDS.pedro,
  },
  {
    type: "expense",
    amount: 250,
    description: "Consulta clínica",
    category: "Saúde",
    date: daysAgo(22),
    accountId: ACCOUNT_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "expense",
    amount: 78.4,
    description: "Farmácia",
    category: "Saúde",
    date: daysAgo(14),
    accountId: CARD_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "expense",
    amount: 160,
    description: "Cinema e pipoca",
    category: "Lazer",
    date: daysAgo(10),
    accountId: CARD_IDS.picpay,
    memberId: MEMBER_IDS.pedro,
  },
  {
    type: "expense",
    amount: 320,
    description: "Curso online",
    category: "Educação",
    date: daysAgo(25),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
  },
  {
    type: "expense",
    amount: 55.9,
    description: "Netflix",
    category: "Assinaturas",
    date: daysAgo(1),
    accountId: CARD_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
    isRecurring: true,
  },
  {
    type: "expense",
    amount: 39.9,
    description: "Spotify família",
    category: "Assinaturas",
    date: daysAgo(16),
    accountId: CARD_IDS.inter,
    memberId: MEMBER_IDS.maria,
    isRecurring: true,
  },
  {
    type: "expense",
    amount: 180,
    description: "Condomínio",
    category: "Moradia",
    date: daysAgo(8),
    accountId: ACCOUNT_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
    isRecurring: true,
  },
  {
    type: "expense",
    amount: 95,
    description: "Material escolar",
    category: "Educação",
    date: daysAgo(48),
    accountId: ACCOUNT_IDS.inter,
    memberId: MEMBER_IDS.maria,
  },
  {
    type: "expense",
    amount: 145.6,
    description: "Jantar aniversário",
    category: "Lazer",
    date: daysAgo(60),
    accountId: CARD_IDS.nubank,
    memberId: MEMBER_IDS.lucas,
  },
];

export const mockTransactions: Transaction[] = rawTransactions.map((tx, index) => ({
  id: `tx-${String(index + 1).padStart(3, "0")}`,
  installments: tx.installments ?? 1,
  isRecurring: tx.isRecurring ?? false,
  isPaid: tx.isPaid ?? tx.type === "income",
  status: tx.status ?? "completed",
  ...tx,
}));

/** Vincula despesas mock aos cartões (expenseIds). */
export function withCardExpenseLinks(
  cards: CreditCard[],
  transactions: Transaction[],
): CreditCard[] {
  return cards.map((card) => ({
    ...card,
    expenseIds: transactions
      .filter((tx) => tx.type === "expense" && tx.accountId === card.id)
      .map((tx) => tx.id),
  }));
}

export const initialCreditCards = withCardExpenseLinks(
  mockCreditCards,
  mockTransactions,
);
