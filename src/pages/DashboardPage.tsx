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
import {
  AddAccountOrCardModal,
  AddMemberModal,
  CardDetailsModal,
  NewTransactionModal,
} from "../components/modals";
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
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [cardDetailsId, setCardDetailsId] = useState<string | null>(null);

  function openNewTransaction(defaults: NewTransactionDefaults = {}) {
    setNewTransactionDefaults(defaults);
    setNewTransactionOpen(true);
  }

  function openAddAccount() {
    setEditCardId(null);
    setAddAccountOpen(true);
  }

  function openEditCard(cardId: string) {
    setEditCardId(cardId);
    setAddAccountOpen(true);
  }

  return (
    <section className="flex w-full flex-col gap-space-24">
      <DashboardHeader
        onNewTransaction={() => openNewTransaction()}
        onAddMember={() => setAddMemberOpen(true)}
      />

      {/* Figma 42:3100 — coluna esq. (categorias + resumo) | Cards & contas — mesma altura */}
      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-stretch xl:grid-cols-[minmax(0,1fr)_minmax(320px,538px)]">
        <div className="flex h-full min-w-0 w-full flex-col gap-space-24 md:gap-[30px]">
          <div className="w-full shrink-0">
            <ExpensesByCategoryCarousel />
          </div>
          <div className="flex min-h-0 w-full flex-1 flex-col">
            <SummaryCards />
          </div>
        </div>

        <CreditCardsWidget
          onAddCard={openAddAccount}
          onOpenCard={(cardId) => setCardDetailsId(cardId)}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-stretch xl:grid-cols-[minmax(0,1fr)_minmax(320px,538px)]">
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

      <AddAccountOrCardModal
        open={addAccountOpen}
        onClose={() => {
          setAddAccountOpen(false);
          setEditCardId(null);
        }}
        onRequestAddMember={() => setAddMemberOpen(true)}
        defaultKind={editCardId ? "card" : "account"}
        editCardId={editCardId}
      />

      <CardDetailsModal
        open={cardDetailsId !== null}
        cardId={cardDetailsId}
        onClose={() => setCardDetailsId(null)}
        onAddExpense={(accountId) =>
          openNewTransaction({ type: "expense", accountId })
        }
        onEditCard={openEditCard}
        onViewStatement={() => {
          // filtros aplicados dentro do modal via useFinance
        }}
      />
    </section>
  );
}
