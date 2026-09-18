/**
 * Calcula percentual com uma casa decimal. Divisão por zero retorna `0`.
 *
 * @param partial - Valor parcial
 * @param total - Valor total
 * @returns Percentual `0–100` com 1 casa decimal
 *
 * @example
 * calculatePercentage(25, 100) // 25.0
 * calculatePercentage(1, 0) // 0
 */
export function calculatePercentage(partial: number, total: number): number {
  if (!Number.isFinite(partial) || !Number.isFinite(total) || total === 0) {
    return 0;
  }
  return Math.round((partial / total) * 1000) / 10;
}

export type DifferenceResult = {
  absolute: number;
  percent: number;
};

/**
 * Calcula diferença absoluta e variação percentual entre dois valores.
 *
 * @param current - Valor atual
 * @param previous - Valor anterior (base)
 * @returns `{ absolute, percent }` — percent é 0 se `previous` for 0
 *
 * @example
 * calculateDifference(120, 100) // { absolute: 20, percent: 20 }
 */
export function calculateDifference(
  current: number,
  previous: number,
): DifferenceResult {
  const absolute = current - previous;
  const percent =
    !Number.isFinite(previous) || previous === 0
      ? 0
      : Math.round((absolute / Math.abs(previous)) * 1000) / 10;

  return { absolute, percent };
}

/**
 * Calcula o valor de cada parcela a partir do total.
 *
 * @param total - Valor total
 * @param installments - Número de parcelas (≥ 1)
 * @returns Valor por parcela arredondado em 2 casas
 *
 * @example
 * calculateInstallmentValue(100, 3) // 33.33
 */
export function calculateInstallmentValue(
  total: number,
  installments: number,
): number {
  if (
    !Number.isFinite(total) ||
    !Number.isFinite(installments) ||
    installments < 1
  ) {
    return 0;
  }
  return Math.round((total / installments) * 100) / 100;
}
