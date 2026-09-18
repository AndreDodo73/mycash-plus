import logoInter from "../assets/cards/logo-inter.png";
import logoNubank from "../assets/cards/logo-nubank.png";
import logoPicpay from "../assets/cards/logo-picpay.png";

const BANK_LOGOS: Record<string, string> = {
  nubank: logoNubank,
  inter: logoInter,
  picpay: logoPicpay,
  picPay: logoPicpay,
};

/** Normaliza nome do banco para lookup (ex.: "Nubank Conta" → "nubank"). */
function bankKeyFromName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/conta|cartao|crédito|credito/g, "");
}

/**
 * Resolve logo do banco a partir do nome (cartão ou conta).
 * Fallback: undefined → UI usa cor/tema.
 */
export function resolveBankLogo(
  name: string,
  logoUrl?: string | null,
): string | undefined {
  if (logoUrl) {
    return logoUrl;
  }

  const compact = name.replace(/\s/g, "").toLowerCase();
  const key = bankKeyFromName(name);

  return (
    BANK_LOGOS[compact] ??
    BANK_LOGOS[key] ??
    BANK_LOGOS[name.toLowerCase()] ??
    Object.entries(BANK_LOGOS).find(([bank]) => key.includes(bank.toLowerCase()))?.[1]
  );
}
