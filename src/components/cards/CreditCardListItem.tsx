import type { CreditCard } from "../../types/finance";
import { formatCurrency } from "../../utils/formatCurrency";
import logoInter from "../../assets/cards/logo-inter.png";
import logoNubank from "../../assets/cards/logo-nubank.png";
import logoPicpay from "../../assets/cards/logo-picpay.png";

const BANK_LOGOS: Record<string, string> = {
  nubank: logoNubank,
  inter: logoInter,
  picpay: logoPicpay,
  picPay: logoPicpay,
};

type CreditCardListItemProps = {
  card: CreditCard;
  onOpen: (cardId: string) => void;
};

export function getCardUsagePercent(card: CreditCard): number {
  if (card.limit <= 0) {
    return 0;
  }
  return Math.round((card.currentInvoice / card.limit) * 100);
}

function resolveLogo(card: CreditCard): string | undefined {
  if (card.logoUrl) {
    return card.logoUrl;
  }
  const key = card.name.replace(/\s/g, "").toLowerCase();
  return BANK_LOGOS[key] ?? BANK_LOGOS[card.name.toLowerCase()];
}

export function CreditCardListItem({ card, onOpen }: CreditCardListItemProps) {
  const logo = resolveLogo(card);
  const digits = card.lastFourDigits ?? "0000";
  const usage = getCardUsagePercent(card);

  return (
    <button
      type="button"
      onClick={() => onOpen(card.id)}
      aria-label={`${card.name}, fatura ${formatCurrency(card.currentInvoice)}, uso ${usage}%`}
      className="group flex w-full min-w-0 cursor-pointer items-start justify-between gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-16 text-left shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:p-space-20"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-space-8">
        <div className="flex min-w-0 items-center gap-space-8">
          <span className="flex size-space-16 shrink-0 overflow-hidden rounded-shape-2">
            {logo ? (
              <img
                src={logo}
                alt=""
                width={16}
                height={16}
                className="size-full object-contain"
                aria-hidden="true"
              />
            ) : (
              <span
                className={[
                  "size-full rounded-shape-2",
                  card.theme === "black"
                    ? "bg-secondary"
                    : card.theme === "lime"
                      ? "bg-primary"
                      : "border border-neutral-300 bg-surface",
                ].join(" ")}
                aria-hidden="true"
              />
            )}
          </span>
          <span className="truncate text-paragraph-small tracking-[0.3px] text-neutral-1100">
            {card.name}
          </span>
        </div>

        <p className="text-heading-small font-bold text-neutral-1100 tabular-nums">
          {formatCurrency(card.currentInvoice)}
        </p>

        <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
          Vence dia {String(card.dueDay).padStart(2, "0")}
        </p>
      </div>

      <span className="shrink-0 text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
        **** {digits}
      </span>
    </button>
  );
}
