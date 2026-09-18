import type { Transaction } from "../types/finance";
import { formatCurrency } from "./formatCurrency";

type CsvLabelResolvers = {
  memberName: (memberId: string | null) => string;
  accountName: (accountId: string) => string;
};

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatCsvDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

export function buildTransactionsCsv(
  transactions: Transaction[],
  resolvers: CsvLabelResolvers,
): string {
  const header = [
    "Data",
    "Tipo",
    "Descrição",
    "Categoria",
    "Conta/Cartão",
    "Membro",
    "Parcelas",
    "Status",
    "Valor",
  ];

  const rows = transactions.map((tx) => [
    formatCsvDate(tx.date),
    tx.type === "income" ? "Receita" : "Despesa",
    tx.description,
    tx.category,
    resolvers.accountName(tx.accountId),
    resolvers.memberName(tx.memberId),
    String(tx.installments),
    tx.status === "completed" ? "Concluído" : "Pendente",
    formatCurrency(tx.amount),
  ]);

  return [header, ...rows]
    .map((cols) => cols.map((cell) => escapeCsvCell(cell)).join(","))
    .join("\n");
}

export function downloadTransactionsCsv(
  transactions: Transaction[],
  resolvers: CsvLabelResolvers,
  filename = "transacoes-mycash.csv",
): void {
  const csv = buildTransactionsCsv(transactions, resolvers);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
