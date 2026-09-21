import type { Transaction } from "../types/finance";

export type MonthlyFlowPoint = {
  monthKey: string;
  monthLabel: string;
  monthFull: string;
  income: number;
  expense: number;
};

const MONTH_LABELS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
] as const;

const MONTH_FULL = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

/** Agrega receitas/despesas dos últimos 12 meses a partir das transações reais. */
export function buildFinancialFlowFromTransactions(
  transactions: Transaction[],
): MonthlyFlowPoint[] {
  const now = new Date();
  const points: MonthlyFlowPoint[] = [];

  for (let offset = 11; offset >= 0; offset -= 1) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

    let income = 0;
    let expense = 0;

    for (const tx of transactions) {
      const d = tx.date instanceof Date ? tx.date : new Date(tx.date);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      if (tx.type === "income") income += tx.amount;
      else expense += tx.amount;
    }

    points.push({
      monthKey,
      monthLabel: MONTH_LABELS[month],
      monthFull: MONTH_FULL[month],
      income,
      expense,
    });
  }

  return points;
}
