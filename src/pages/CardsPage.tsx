import { useState } from "react";
import { CardsView } from "../components/cards";
import {
  AddAccountOrCardModal,
  AddMemberModal,
  CardDetailsModal,
  NewTransactionModal,
} from "../components/modals";

type EntityKind = "account" | "card";

export function CardsPage() {
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [newTransactionAccountId, setNewTransactionAccountId] = useState<
    string | undefined
  >();
  const [addOpen, setAddOpen] = useState(false);
  const [addKind, setAddKind] = useState<EntityKind>("card");
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [cardDetailsId, setCardDetailsId] = useState<string | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  function openAdd(kind: EntityKind) {
    setEditCardId(null);
    setAddKind(kind);
    setAddOpen(true);
  }

  function openEditCard(cardId: string) {
    setEditCardId(cardId);
    setAddKind("card");
    setAddOpen(true);
  }

  function openNewExpense(accountId: string) {
    setNewTransactionAccountId(accountId);
    setNewTransactionOpen(true);
  }

  return (
    <>
      <CardsView
        onAddCard={() => openAdd("card")}
        onAddAccount={() => openAdd("account")}
        onOpenCard={(cardId) => setCardDetailsId(cardId)}
        onAddExpense={openNewExpense}
      />

      <NewTransactionModal
        open={newTransactionOpen}
        onClose={() => {
          setNewTransactionOpen(false);
          setNewTransactionAccountId(undefined);
        }}
        defaultType="expense"
        defaultAccountId={newTransactionAccountId}
      />

      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
      />

      <AddAccountOrCardModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setEditCardId(null);
        }}
        onRequestAddMember={() => setAddMemberOpen(true)}
        defaultKind={addKind}
        editCardId={editCardId}
      />

      <CardDetailsModal
        open={cardDetailsId !== null}
        cardId={cardDetailsId}
        onClose={() => setCardDetailsId(null)}
        onAddExpense={openNewExpense}
        onEditCard={openEditCard}
        onViewStatement={() => {
          // filtros aplicados dentro do modal via useFinance
        }}
      />
    </>
  );
}
