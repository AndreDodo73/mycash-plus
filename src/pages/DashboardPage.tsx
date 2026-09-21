import { useState } from "react";
import { GoalsSection } from "../components/goals";
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
import { useFinance } from "../hooks";

type NewTransactionDefaults = {
  type?: TransactionType;
  accountId?: string;
};

export function DashboardPage() {
  const { isLoading, error, familyMembers, bankAccounts, creditCards } =
    useFinance();
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

  const showOnboarding =
    !isLoading &&
    familyMembers.length === 0 &&
    bankAccounts.length === 0 &&
    creditCards.length === 0;

  return (
    <section className="flex w-full flex-col gap-space-24">
      <DashboardHeader
        onNewTransaction={() => openNewTransaction()}
        onAddMember={() => setAddMemberOpen(true)}
      />

      {isLoading ? (
        <p className="text-paragraph-medium text-neutral-600">
          Carregando seus dados do Supabase…
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-shape-20 border border-red-600 bg-red-600/10 px-space-16 py-space-12 text-paragraph-small text-red-700"
        >
          {error}
        </p>
      ) : null}

      {showOnboarding ? (
        <div className="flex w-full flex-col gap-space-12 rounded-shape-20 border border-primary bg-primary/15 p-space-24">
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Bem-vindo ao mycash+
          </h2>
          <p className="text-paragraph-small text-neutral-700">
            Sua conta está vazia. Comece adicionando um membro da família e
            depois uma conta ou cartão. Tudo será salvo no Supabase.
          </p>
          <div className="flex flex-wrap gap-space-8">
            <button
              type="button"
              onClick={() => setAddMemberOpen(true)}
              className="flex min-h-12 items-center justify-center rounded-shape-100 bg-neutral-1100 px-space-24 text-label-medium font-semibold text-surface"
            >
              Adicionar membro
            </button>
            <button
              type="button"
              onClick={openAddAccount}
              className="flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-1100 px-space-24 text-label-medium font-semibold text-neutral-1100"
            >
              Adicionar conta/cartão
            </button>
          </div>
        </div>
      ) : null}

      {/* Figma 42:3100 — coluna esq. (categorias + resumo) | Contas e Cartões — mesma altura */}
      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-stretch xl:grid-cols-[minmax(0,1fr)_minmax(320px,538px)]">
        <div className="flex h-full min-w-0 w-full flex-col gap-space-24 md:gap-space-32">
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

      <GoalsSection />

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
