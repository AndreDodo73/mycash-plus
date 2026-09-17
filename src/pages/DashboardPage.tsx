import { useState } from "react";
import { CreditCardsWidget } from "../components/cards";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import {
  ExpensesByCategoryCarousel,
  FinancialFlowChart,
  SummaryCards,
  TransactionsTable,
  UpcomingExpensesWidget,
} from "../components/dashboard";
import { AddMemberModal, NewTransactionModal } from "../components/modals";
import type { TransactionType } from "../types/finance";

type NewTransactionDefaults = {
  type?: TransactionType;
  accountId?: string;
};

export function DashboardPage() {
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [newTransactionDefaults, setNewTransactionDefaults] =
    useState<NewTransactionDefaults>({});
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  function openNewTransaction(defaults: NewTransactionDefaults = {}) {
    setNewTransactionDefaults(defaults);
    setNewTransactionOpen(true);
  }

  return (
    <section className="flex w-full flex-col gap-space-24">
      <DashboardHeader
        onNewTransaction={() => openNewTransaction()}
        onAddMember={() => setAddMemberOpen(true)}
      />

      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(320px,538px)]">
        <div className="flex min-w-0 flex-col gap-space-24">
          <ExpensesByCategoryCarousel />
          <SummaryCards />
        </div>

        <CreditCardsWidget
          onAddCard={() => {
            // Modal P14
          }}
          onOpenCard={() => {
            // Modal P15
          }}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(320px,538px)]">
        <FinancialFlowChart />
        <UpcomingExpensesWidget
          onAddExpense={() => openNewTransaction({ type: "expense" })}
        />
      </div>

      <TransactionsTable />

      <NewTransactionModal
        open={newTransactionOpen}
        onClose={() => setNewTransactionOpen(false)}
        defaultType={newTransactionDefaults.type ?? "income"}
        defaultAccountId={newTransactionDefaults.accountId}
      />

      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
      />
    </section>
  );
}
