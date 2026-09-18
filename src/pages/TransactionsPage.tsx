import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TransactionsView } from "../components/dashboard";
import { NewTransactionModal } from "../components/modals";

type LocationState = {
  accountId?: string;
};

export function TransactionsPage() {
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;
  const accountIdFilter = state?.accountId ?? null;
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);

  return (
    <>
      <TransactionsView
        key={accountIdFilter ?? "all"}
        initialAccountId={accountIdFilter}
        onNewTransaction={() => setNewTransactionOpen(true)}
      />

      <NewTransactionModal
        open={newTransactionOpen}
        onClose={() => setNewTransactionOpen(false)}
        defaultType="expense"
        defaultAccountId={accountIdFilter ?? undefined}
      />
    </>
  );
}
