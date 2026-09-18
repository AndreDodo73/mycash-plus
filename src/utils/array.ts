import type { DateRange, Transaction } from "../types/finance";
import { endOfDay, startOfDay } from "./date";

export type CategoryGroup = Record<string, number>;

/**
 * Agrupa transações por categoria somando os valores.
 *
 * @param transactions - Lista de transações
 * @returns Objeto `{ categoria: total }`
 *
 * @example
 * groupByCategory([{ category: "Mercado", amount: 10 }, { category: "Mercado", amount: 5 }])
 * // { Mercado: 15 }
 */
export function groupByCategory(transactions: Transaction[]): CategoryGroup {
  return transactions.reduce<CategoryGroup>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
    return acc;
  }, {});
}

/**
 * Filtra transações dentro de um intervalo de datas (inclusivo).
 *
 * @param transactions - Lista de transações
 * @param range - Objeto com `startDate` e `endDate`
 * @returns Transações no intervalo
 *
 * @example
 * filterByDateRange(txs, { startDate: new Date(2024, 0, 1), endDate: new Date(2024, 0, 31) })
 */
export function filterByDateRange(
  transactions: Transaction[],
  range: DateRange,
): Transaction[] {
  const start = startOfDay(range.startDate).getTime();
  const end = endOfDay(range.endDate).getTime();

  return transactions.filter((tx) => {
    const time = tx.date.getTime();
    return time >= start && time <= end;
  });
}

/**
 * Ordena transações por data.
 *
 * @param transactions - Lista de transações
 * @param direction - `asc` (antigas primeiro) ou `desc` (recentes primeiro)
 * @returns Nova lista ordenada (não muta a original)
 *
 * @example
 * sortByDate(txs, "desc")
 */
export function sortByDate(
  transactions: Transaction[],
  direction: "asc" | "desc" = "desc",
): Transaction[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...transactions].sort(
    (a, b) => (a.date.getTime() - b.date.getTime()) * factor,
  );
}
