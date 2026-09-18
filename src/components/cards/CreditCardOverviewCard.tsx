import { useEffect, useId, useRef, useState } from "react";
import iconCalendar from "../../assets/dashboard/icon-calendar.svg";
import iconMore from "../../assets/cards/icon-more-vertical.svg";
import type { CreditCard, FamilyMember } from "../../types/finance";
import { formatCurrency } from "../../utils/formatCurrency";
import { getCardUsagePercent, resolveCardLogo } from "./CreditCardListItem";

const NEAR_LIMIT_PERCENT = 80;

type CreditCardOverviewCardProps = {
  card: CreditCard;
  holder?: FamilyMember;
  onOpen: (cardId: string) => void;
  onAddExpense: (cardId: string) => void;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function themeBorderClass(theme: CreditCard["theme"]): string {
  if (theme === "lime") {
    return "border-2 border-primary";
  }
  if (theme === "black") {
    return "border-2 border-neutral-1100";
  }
  return "border border-neutral-300";
}

export function CreditCardOverviewCard({
  card,
  holder,
  onOpen,
  onAddExpense,
}: CreditCardOverviewCardProps) {
  const logo = resolveCardLogo(card);
  const usage = getCardUsagePercent(card);
  const available = Math.max(0, card.limit - card.currentInvoice);
  const digits = card.lastFourDigits ?? "0000";
  const nearLimit = usage >= NEAR_LIMIT_PERCENT;
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <article
      className={[
        "relative flex h-full w-full flex-col gap-space-16 rounded-shape-20 bg-surface p-space-24 shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-md",
        themeBorderClass(card.theme),
      ].join(" ")}
    >
      <div className="flex w-full items-start justify-between gap-space-8">
        <button
          type="button"
          onClick={() => onOpen(card.id)}
          className="flex min-w-0 flex-1 items-center gap-space-8 text-left"
        >
          <span className="flex size-space-24 shrink-0 overflow-hidden rounded-shape-2">
            {logo ? (
              <img
                src={logo}
                alt=""
                width={24}
                height={24}
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
          <span className="min-w-0">
            <h3 className="truncate text-heading-x-small font-bold text-neutral-1100">
              {card.name}
            </h3>
            <p className="font-mono text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
              •••• {digits}
            </p>
          </span>
        </button>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full text-neutral-1100"
            aria-label={`Ações de ${card.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <img
              src={iconMore}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </button>
          {menuOpen ? (
            <div
              id={menuId}
              role="menu"
              className="absolute top-12 right-0 z-20 min-w-44 rounded-shape-20 border border-neutral-300 bg-surface p-space-8 shadow-md"
            >
              <button
                type="button"
                role="menuitem"
                className="flex min-h-11 w-full items-center rounded-shape-20 px-space-12 text-left text-label-small font-semibold text-neutral-1100 hover:bg-neutral-100"
                onClick={() => {
                  setMenuOpen(false);
                  onOpen(card.id);
                }}
              >
                Ver Detalhes
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex min-h-11 w-full items-center rounded-shape-20 px-space-12 text-left text-label-small font-semibold text-neutral-1100 hover:bg-neutral-100"
                onClick={() => {
                  setMenuOpen(false);
                  onAddExpense(card.id);
                }}
              >
                Adicionar Despesa
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(card.id)}
        className="flex w-full flex-1 flex-col gap-space-12 text-left"
      >
        <div>
          <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
            Fatura atual
          </p>
          <p
            className={[
              "text-heading-medium font-bold tabular-nums",
              nearLimit ? "text-red-600" : "text-neutral-1100",
            ].join(" ")}
          >
            {formatCurrency(card.currentInvoice)}
          </p>
        </div>

        <dl className="grid w-full grid-cols-2 gap-space-12">
          <div className="min-w-0">
            <dt className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
              Limite total
            </dt>
            <dd className="truncate text-label-medium font-semibold text-neutral-1100 tabular-nums">
              {formatCurrency(card.limit)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
              Disponível
            </dt>
            <dd className="truncate text-label-medium font-semibold text-neutral-1100 tabular-nums">
              {formatCurrency(available)}
            </dd>
          </div>
        </dl>

        <div className="flex w-full flex-col gap-space-8">
          <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
            {usage}% de uso
          </p>
          <div className="h-2 w-full overflow-hidden rounded-shape-100 bg-neutral-200">
            <div
              className={[
                "h-full rounded-shape-100 transition-[width] duration-300",
                nearLimit ? "bg-red-600" : "bg-primary",
              ].join(" ")}
              style={{ width: `${Math.min(Math.max(usage, 0), 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-16">
          <p className="flex items-center gap-space-8 text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
            <img
              src={iconCalendar}
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            Fecha dia {pad2(card.closingDay)}
          </p>
          <p className="flex items-center gap-space-8 text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
            <img
              src={iconCalendar}
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            Vence dia {pad2(card.dueDay)}
          </p>
        </div>
      </button>

      <div className="flex w-full items-center justify-between gap-space-8">
        <div className="flex min-w-0 flex-wrap gap-space-8">
          <button
            type="button"
            className="flex min-h-11 items-center justify-center rounded-shape-100 border border-neutral-1100 px-space-12 text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100"
            onClick={() => onOpen(card.id)}
          >
            Ver Detalhes
          </button>
          <button
            type="button"
            className="flex min-h-11 items-center justify-center rounded-shape-100 bg-secondary px-space-12 text-label-x-small font-semibold tracking-[0.3px] text-surface"
            onClick={() => onAddExpense(card.id)}
          >
            Adicionar Despesa
          </button>
        </div>
        {holder ? (
          <span className="size-8 shrink-0 overflow-hidden rounded-full border border-neutral-300">
            <img
              src={holder.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="size-full object-cover"
            />
          </span>
        ) : (
          <span
            className="size-8 shrink-0 rounded-full border border-neutral-1100"
            aria-hidden="true"
          />
        )}
      </div>
    </article>
  );
}
