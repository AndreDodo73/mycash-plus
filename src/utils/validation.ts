/**
 * Valida formato básico de e-mail.
 *
 * @param email - Texto a validar
 * @returns `true` se o formato for plausível
 *
 * @example
 * isValidEmail("user@example.com") // true
 */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) {
    return false;
  }
  // Simples e suficiente para UI — não cobre todos os casos RFC
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed);
}

/**
 * Valida CPF brasileiro (estrutura e dígitos verificadores).
 * Não consulta Receita Federal.
 *
 * @param cpf - CPF com ou sem máscara
 * @returns `true` se o CPF for estruturalmente válido
 *
 * @example
 * isValidCPF("529.982.247-25") // true
 */
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) {
    return false;
  }
  if (/^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  const calcDigit = (slice: string, factorStart: number): number => {
    let sum = 0;
    for (let i = 0; i < slice.length; i += 1) {
      sum += Number(slice[i]) * (factorStart - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const d1 = calcDigit(digits.slice(0, 9), 10);
  const d2 = calcDigit(digits.slice(0, 10), 11);
  return d1 === Number(digits[9]) && d2 === Number(digits[10]);
}

/**
 * Verifica se o valor é uma data válida.
 *
 * @param date - Valor a checar
 * @param options.allowFuture - Se `false`, rejeita datas futuras (padrão: `true`)
 * @returns `true` se for `Date` válida
 *
 * @example
 * isValidDate(new Date()) // true
 * isValidDate(new Date("invalid")) // false
 */
export function isValidDate(
  date: Date,
  options: { allowFuture?: boolean } = {},
): boolean {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return false;
  }

  const allowFuture = options.allowFuture ?? true;
  if (!allowFuture) {
    const now = new Date();
    if (date.getTime() > now.getTime()) {
      return false;
    }
  }

  return true;
}

/**
 * Verifica se o valor é um número finito estritamente maior que zero.
 *
 * @param value - Valor a checar
 * @returns `true` se for número positivo
 *
 * @example
 * isPositiveNumber(10) // true
 * isPositiveNumber(0) // false
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
