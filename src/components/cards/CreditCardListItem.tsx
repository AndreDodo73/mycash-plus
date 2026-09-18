import type { CardTheme, CreditCard } from "../../types/finance";
import { MOTION, staggerStyle } from "../../constants/motion";
import { formatCurrency } from "../../utils/formatCurrency";
import { resolveBankLogo } from "../../utils/bankLogo";

type CreditCardListItemProps = {
  card: CreditCard;
  onOpen: (cardId: string) => void;
  staggerIndex?: number;
};

export function getCardUsagePercent(card: CreditCard): number {
  if (card.limit <= 0) {
    return 0;
  }
  return Math.round((card.currentInvoice / card.limit) * 100);
}

export function resolveCardLogo(card: CreditCard): string | undefined {
  return resolveBankLogo(card.name, card.logoUrl);
}

/** Borda de destaque do tema visual do cartão. */
export function getCardThemeBorderClass(theme: CardTheme): string {
  if (theme === "lime") {
    return "border-2 border-primary";
  }
  if (theme === "white") {
    return "border-2 border-neutral-400";
  }
  return "border-2 border-secondary";
}

export function getCardThemeSwatchClass(theme: CardTheme): string {
  if (theme === "lime") {
    return "bg-primary";
  }
  if (theme === "white") {
    return "border border-neutral-300 bg-surface";
  }
  return "bg-secondary";
}

export function CreditCardListItem({
  card,
  onOpen,
  staggerIndex = 0,
}: CreditCardListItemProps) {
  const logo = resolveCardLogo(card);
  const digits = card.lastFourDigits ?? "0000";
  const usage = getCardUsagePercent(card);

  return (
    <button
      type="button"
      onClick={() => onOpen(card.id)}
      aria-label={`${card.name}, fatura ${formatCurrency(card.currentInvoice)}, uso ${usage}%`}
      className={[
        "motion-enter-up motion-hover-lift group flex w-full min-w-0 cursor-pointer items-start justify-between gap-space-16 rounded-shape-20 bg-surface p-space-16 text-left shadow-sm hover:brightness-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-1100 md:p-space-20",
        getCardThemeBorderClass(card.theme),
      ].join(" ")}
      style={staggerStyle(staggerIndex, MOTION.stagger.gridMs)}
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
                  getCardThemeSwatchClass(card.theme),
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
