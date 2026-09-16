import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import iconAdd from "../../assets/cards/icon-add.svg";
import iconArrow from "../../assets/cards/icon-arrow.svg";
import iconCreditCard from "../../assets/cards/icon-credit-card.svg";
import { useFinance } from "../../hooks";
import { CreditCardListItem } from "./CreditCardListItem";

const PAGE_SIZE = 3;

type CreditCardsWidgetProps = {
  onAddCard?: () => void;
  onOpenCard?: (cardId: string) => void;
};

export function CreditCardsWidget({
  onAddCard,
  onOpenCard,
}: CreditCardsWidgetProps) {
  const { creditCards } = useFinance();
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(creditCards.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  const visibleCards = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return creditCards.slice(start, start + PAGE_SIZE);
  }, [creditCards, safePage]);

  const showPagination = creditCards.length > PAGE_SIZE;

  function handleAdd() {
    onAddCard?.();
  }

  function handleOpen(cardId: string) {
    onOpenCard?.(cardId);
  }

  function goPrev() {
    setPage((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setPage((current) => Math.min(totalPages - 1, current + 1));
  }

  return (
    <section
      className="flex h-full w-full min-w-0 flex-col gap-space-24 rounded-shape-20 border border-neutral-300 bg-surface p-space-16 md:gap-space-32 md:p-space-24 lg:p-space-32"
      aria-label="Cards e contas"
    >
      <header className="flex w-full items-center justify-between gap-space-12">
        <div className="flex min-w-0 items-center gap-space-8">
          <img
            src={iconCreditCard}
            alt=""
            width={24}
            height={24}
            className="size-space-24 shrink-0"
            aria-hidden="true"
          />
          <h2 className="truncate text-heading-x-small font-bold text-neutral-1100">
            Cards & contas
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-space-12">
          <button
            type="button"
            onClick={handleAdd}
            aria-label="Adicionar cartão"
            className="flex size-11 items-center justify-center rounded-shape-100 border border-neutral-300 bg-surface transition-colors hover:bg-neutral-100 md:size-space-32"
          >
            <img
              src={iconAdd}
              alt=""
              width={16}
              height={16}
              className="size-space-16"
              aria-hidden="true"
            />
          </button>

          <Link
            to="/cartoes"
            aria-label="Ver todos os cartões"
            className="flex size-11 items-center justify-center rounded-shape-100 border border-neutral-300 bg-surface transition-colors hover:bg-neutral-100 md:size-space-32"
          >
            <img
              src={iconArrow}
              alt=""
              width={16}
              height={16}
              className="size-space-16"
              aria-hidden="true"
            />
          </Link>
        </div>
      </header>

      <ul className="flex w-full flex-col gap-space-24">
        {visibleCards.map((card) => (
          <li key={card.id} className="w-full min-w-0">
            <CreditCardListItem card={card} onOpen={handleOpen} />
          </li>
        ))}
      </ul>

      {showPagination ? (
        <div className="mt-auto flex items-center justify-between gap-space-8">
          <button
            type="button"
            onClick={goPrev}
            disabled={safePage === 0}
            className="min-h-11 rounded-shape-100 border border-neutral-300 px-space-12 text-label-small font-semibold text-neutral-1100 disabled:opacity-40"
          >
            Anterior
          </button>
          <p className="text-label-x-small text-neutral-600">
            {safePage + 1} / {totalPages}
          </p>
          <button
            type="button"
            onClick={goNext}
            disabled={safePage >= totalPages - 1}
            className="min-h-11 rounded-shape-100 border border-neutral-300 px-space-12 text-label-small font-semibold text-neutral-1100 disabled:opacity-40"
          >
            Próximo
          </button>
        </div>
      ) : null}
    </section>
  );
}
