const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formata um número como moeda brasileira (BRL).
 *
 * @param value - Valor numérico em reais
 * @returns String no formato `R$ 1.234,56`
 *
 * @example
 * formatCurrency(1234.5) // "R$ 1.234,50"
 */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

/**
 * Formata valores grandes de forma compacta para eixos de gráficos.
 *
 * @param value - Valor numérico em reais
 * @returns String compacta (`R$ 2,5k`, `R$ 1,2M`) ou `formatCurrency` abaixo de 1000
 *
 * @example
 * formatCompactCurrency(2500) // "R$ 2,5k"
 * formatCompactCurrency(1_200_000) // "R$ 1,2M"
 */
export function formatCompactCurrency(value: number): string {
  const amount = Number.isFinite(value) ? value : 0;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    return `${sign}R$ ${formatCompactNumber(millions)}M`;
  }

  if (abs >= 1_000) {
    const thousands = abs / 1_000;
    return `${sign}R$ ${formatCompactNumber(thousands)}k`;
  }

  return formatCurrency(amount);
}

function formatCompactNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toLocaleString("pt-BR", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

/**
 * Converte texto de input monetário em número limpo.
 * Remove `R$`, espaços, pontos de milhar e troca vírgula por ponto.
 *
 * @param raw - Texto digitado pelo usuário
 * @returns Número parseado ou `0` se inválido
 *
 * @example
 * parseCurrencyInput("R$ 1.234,56") // 1234.56
 * parseCurrencyInput("50,00") // 50
 */
export function parseCurrencyInput(raw: string): number {
  const cleaned = raw
    .replace(/R\$\s?/gi, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  if (!cleaned || cleaned === "-" || cleaned === ".") {
    return 0;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}
