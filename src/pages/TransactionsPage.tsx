import { useLocation } from "react-router-dom";
import { TransactionsTable } from "../components/dashboard";
import { useFinance } from "../hooks";

type LocationState = {
  accountId?: string;
};

export function TransactionsPage() {
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;
  const accountIdFilter = state?.accountId ?? null;
  const { creditCards, bankAccounts } = useFinance();

  const accountLabel = accountIdFilter
    ? creditCards.find((card) => card.id === accountIdFilter)?.name ??
      bankAccounts.find((account) => account.id === accountIdFilter)?.name
    : null;

  return (
    <section className="flex w-full flex-col gap-space-24">
      <header className="flex w-full flex-col gap-space-8">
        <h1 className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium">
          Transações
        </h1>
        {accountLabel ? (
          <p className="text-paragraph-small text-neutral-600">
            Extrato filtrado: {accountLabel}
          </p>
        ) : null}
      </header>
      <TransactionsTable accountIdFilter={accountIdFilter} />
    </section>
  );
}
