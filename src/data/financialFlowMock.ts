export type MonthlyFlowPoint = {
  monthKey: string;
  monthLabel: string;
  monthFull: string;
  income: number;
  expense: number;
};

/**
 * Mock fixo do fluxo (12 meses — eixo do Figma).
 * Stub para trocar por agregação real de transações no futuro.
 */
export const FINANCIAL_FLOW_MOCK: MonthlyFlowPoint[] = [
  { monthKey: "2026-01", monthLabel: "JAN", monthFull: "Janeiro", income: 9200, expense: 6100 },
  { monthKey: "2026-02", monthLabel: "FEV", monthFull: "Fevereiro", income: 10800, expense: 7200 },
  { monthKey: "2026-03", monthLabel: "MAR", monthFull: "Março", income: 12500, expense: 6800 },
  { monthKey: "2026-04", monthLabel: "ABR", monthFull: "Abril", income: 9800, expense: 8100 },
  { monthKey: "2026-05", monthLabel: "MAI", monthFull: "Maio", income: 14200, expense: 9500 },
  { monthKey: "2026-06", monthLabel: "JUN", monthFull: "Junho", income: 11000, expense: 12800 },
  { monthKey: "2026-07", monthLabel: "JUL", monthFull: "Julho", income: 13500, expense: 11200 },
  { monthKey: "2026-08", monthLabel: "AGO", monthFull: "Agosto", income: 15200, expense: 8900 },
  { monthKey: "2026-09", monthLabel: "SET", monthFull: "Setembro", income: 16500, expense: 10200 },
  { monthKey: "2026-10", monthLabel: "OUT", monthFull: "Outubro", income: 14800, expense: 9700 },
  { monthKey: "2026-11", monthLabel: "NOV", monthFull: "Novembro", income: 15800, expense: 8500 },
  { monthKey: "2026-12", monthLabel: "DEZ", monthFull: "Dezembro", income: 17200, expense: 11800 },
];

/** Stub: no futuro agrupa transações por mês e devolve a mesma forma. */
export function buildFinancialFlowFromTransactions(
  _transactions: unknown[],
): MonthlyFlowPoint[] {
  return FINANCIAL_FLOW_MOCK;
}
