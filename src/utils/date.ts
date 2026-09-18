const MONTH_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

const MONTH_LONG = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

const WEEKDAY_SHORT = [
  "dom.",
  "seg.",
  "ter.",
  "qua.",
  "qui.",
  "sex.",
  "sáb.",
] as const;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function capitalizeFirst(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Formata data no padrão brasileiro `DD/MM/AAAA`.
 *
 * @param date - Objeto `Date`
 * @returns String `15/01/2024`
 *
 * @example
 * formatDate(new Date(2024, 0, 15)) // "15/01/2024"
 */
export function formatDate(date: Date): string {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/**
 * Formata data por extenso em português.
 *
 * @param date - Objeto `Date`
 * @returns String `15 de janeiro de 2024`
 *
 * @example
 * formatDateLong(new Date(2024, 0, 15)) // "15 de janeiro de 2024"
 */
export function formatDateLong(date: Date): string {
  const day = date.getDate();
  const month = MONTH_LONG[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

/**
 * Headline de calendário: `Sex., 15 de set. de 2026`
 * (preposição "de" sempre minúscula — não usar CSS `capitalize`).
 */
export function formatDateHeadline(date: Date, options?: { withYear?: boolean }): string {
  const withYear = options?.withYear ?? true;
  const weekday = capitalizeFirst(WEEKDAY_SHORT[date.getDay()]);
  const day = date.getDate();
  const month = MONTH_SHORT[date.getMonth()];
  if (!withYear) {
    return `${weekday} ${day} de ${month}.`;
  }
  return `${weekday} ${day} de ${month}. de ${date.getFullYear()}`;
}

/**
 * Rótulo do mês no calendário: `Setembro de 2026`
 */
export function formatMonthYear(date: Date): string {
  const month = capitalizeFirst(MONTH_LONG[date.getMonth()]);
  return `${month} de ${date.getFullYear()}`;
}

/**
 * Formata intervalo de datas no estilo do header do dashboard.
 * Se o intervalo cruza anos, inclui o ano nas duas datas.
 *
 * @param startDate - Início do período
 * @param endDate - Fim do período
 * @returns String `01 jan - 31 jan, 2024` ou `28 dez, 2023 - 03 jan, 2024`
 *
 * @example
 * formatDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31))
 * // "01 jan - 31 jan, 2024"
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startDay = `${pad2(startDate.getDate())} ${MONTH_SHORT[startDate.getMonth()]}`;
  const endDay = `${pad2(endDate.getDate())} ${MONTH_SHORT[endDate.getMonth()]}`;
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  if (startYear !== endYear) {
    return `${startDay}, ${startYear} - ${endDay}, ${endYear}`;
  }

  return `${startDay} - ${endDay}, ${endYear}`;
}

/** Alias usado pelo DateRangePicker / FiltersMobile. */
export function formatDateRangeLabel(startDate: Date, endDate: Date): string {
  return formatDateRange(startDate, endDate);
}

/**
 * Retorna descrição relativa da data em relação a “agora”.
 *
 * @param date - Data de referência
 * @param now - Data base (padrão: agora)
 * @returns `Hoje`, `Ontem`, `Há 3 dias`, `Há 2 semanas`, etc.
 *
 * @example
 * formatRelativeDate(new Date()) // "Hoje"
 */
export function formatRelativeDate(date: Date, now: Date = new Date()): string {
  const start = startOfDay(date).getTime();
  const today = startOfDay(now).getTime();
  const diffDays = Math.round((today - start) / 86_400_000);

  if (diffDays === 0) {
    return "Hoje";
  }
  if (diffDays === 1) {
    return "Ontem";
  }
  if (diffDays === -1) {
    return "Amanhã";
  }
  if (diffDays > 1 && diffDays < 7) {
    return `Há ${diffDays} dias`;
  }
  if (diffDays >= 7 && diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "Há 1 semana" : `Há ${weeks} semanas`;
  }
  if (diffDays >= 30 && diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "Há 1 mês" : `Há ${months} meses`;
  }
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? "Há 1 ano" : `Há ${years} anos`;
  }
  if (diffDays < -1) {
    return formatDate(date);
  }

  return formatDate(date);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isDateInRange(day: Date, start: Date, end: Date): boolean {
  const t = startOfDay(day).getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}
