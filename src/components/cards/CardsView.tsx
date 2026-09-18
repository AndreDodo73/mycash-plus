import { useMemo } from "react";
import iconCreditCard from "../../assets/modals/icon-credit-card.svg";
import iconCardEmpty from "../../assets/cards/icon-credit-card.svg";
import { useFinance } from "../../hooks";
import { AddEntityTile } from "./AddEntityTile";
import { BankAccountOverviewCard } from "./BankAccountOverviewCard";
import { CreditCardOverviewCard } from "./CreditCardOverviewCard";

type CardsViewProps = {
  onAddCard: () => void;
  onAddAccount: () => void;
  onOpenCard: (cardId: string) => void;
  onAddExpense: (cardId: string) => void;
};

export function CardsView({
  onAddCard,
  onAddAccount,
  onOpenCard,
  onAddExpense,
}: CardsViewProps) {
  const { creditCards, bankAccounts, familyMembers } = useFinance();

  const sortedCards = useMemo(
    () =>
      [...creditCards].sort((a, b) => b.currentInvoice - a.currentInvoice),
    [creditCards],
  );

  const membersById = useMemo(
    () => new Map(familyMembers.map((member) => [member.id, member])),
    [familyMembers],
  );

  return (
    <section className="flex w-full flex-col gap-space-32">
      <header className="flex w-full items-center gap-space-24">
        <div className="flex size-space-56 shrink-0 items-center justify-center rounded-shape-20 border border-neutral-1100 p-space-12">
          <img
            src={iconCreditCard}
            alt=""
            width={35.5664}
            height={35.5664}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium">
            Contas e Cartões
          </h1>
          <p className="text-label-medium font-normal tracking-[0.3px] text-neutral-1100">
            Gerencie seus cartões e contas bancárias
          </p>
        </div>
      </header>

      <section className="flex w-full flex-col gap-space-24" aria-labelledby="cards-section-title">
        <h2
          id="cards-section-title"
          className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium"
        >
          Cartões
        </h2>

        {sortedCards.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface px-space-24 py-space-32 text-center">
            <img
              src={iconCardEmpty}
              alt=""
              width={24}
              height={24}
              className="opacity-40"
              aria-hidden="true"
            />
            <h3 className="text-heading-x-small font-bold text-neutral-1100">
              Nenhum cartão cadastrado
            </h3>
            <button
              type="button"
              onClick={onAddCard}
              className="motion-tap flex min-h-12 items-center justify-center rounded-shape-100 bg-secondary px-space-24 text-label-medium font-semibold text-surface hover:bg-neutral-1100"
            >
              Cadastrar Primeiro Cartão
            </button>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-space-16 md:grid-cols-2 lg:grid-cols-3">
            {sortedCards.map((card, index) => (
              <CreditCardOverviewCard
                key={card.id}
                card={card}
                holder={membersById.get(card.holderId)}
                onOpen={onOpenCard}
                onAddExpense={onAddExpense}
                staggerIndex={index}
              />
            ))}
            <AddEntityTile label="Novo cartão" onClick={onAddCard} />
          </div>
        )}
      </section>

      <section
        className="flex w-full flex-col gap-space-24"
        aria-labelledby="accounts-section-title"
      >
        <h2
          id="accounts-section-title"
          className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium"
        >
          Contas bancárias
        </h2>
        <div className="grid w-full grid-cols-1 gap-space-16 md:grid-cols-2 lg:grid-cols-3">
          {bankAccounts.map((account, index) => (
            <BankAccountOverviewCard
              key={account.id}
              account={account}
              holder={membersById.get(account.holderId)}
              staggerIndex={index}
            />
          ))}
          <AddEntityTile label="Nova conta" onClick={onAddAccount} />
        </div>
      </section>
    </section>
  );
}
