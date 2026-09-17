import { useMemo, useRef, useState } from "react";
import iconAdd from "../../assets/dashboard/icon-add-circle.svg";
import iconCreditCard from "../../assets/cards/icon-credit-card.svg";
import { useFinance } from "../../hooks";
import type { BankAccount, CreditCard, Transaction } from "../../types/finance";
import { formatCurrency } from "../../utils/formatCurrency";

const MAX_VISIBLE = 5;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDueLabel(date: Date): string {
  return `Vence dia ${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`;
}

/** Preserva o dia do mês (diferente de `addMonths` do calendário, que vai para dia 1). */
function addMonthsKeepDay(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );
}

export function formatPaymentSource(
  accountId: string,
  bankAccounts: BankAccount[],
  creditCards: CreditCard[],
): string {
  const card = creditCards.find((item) => item.id === accountId);
  if (card) {
    const digits = card.lastFourDigits ?? "0000";
    return `Crédito ${card.name} **** ${digits}`;
  }

  const account = bankAccounts.find((item) => item.id === accountId);
  if (account) {
    return /conta/i.test(account.name) ? account.name : `${account.name} conta`;
  }

  return "Desconhecido";
}

type UpcomingExpensesWidgetProps = {
  onAddExpense?: () => void;
};

export function UpcomingExpensesWidget({
  onAddExpense,
}: UpcomingExpensesWidgetProps) {
  const {
    transactions,
    bankAccounts,
    creditCards,
    selectedMember,
    updateTransaction,
    addTransaction,
  } = useFinance();

  const [leavingIds, setLeavingIds] = useState<string[]>([]);
  const [confirmingIds, setConfirmingIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const processingRef = useRef<Set<string>>(new Set());

  const pending = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (tx.type !== "expense" || tx.isPaid) {
          return false;
        }
        if (selectedMember && tx.memberId !== selectedMember) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [transactions, selectedMember]);

  const visible = pending
    .filter((tx) => !leavingIds.includes(tx.id))
    .slice(0, MAX_VISIBLE);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  function scheduleNextOccurrence(tx: Transaction) {
    const nextDate = addMonthsKeepDay(tx.date, 1);
    addTransaction({
      type: "expense",
      amount: tx.amount,
      description: tx.description,
      category: tx.category,
      date: nextDate,
      accountId: tx.accountId,
      memberId: tx.memberId,
      installments: tx.installments,
      status: "pending",
      isRecurring: tx.isRecurring,
      isPaid: false,
    });
    return nextDate;
  }

  function markAsPaid(tx: Transaction) {
    if (processingRef.current.has(tx.id)) {
      return;
    }
    processingRef.current.add(tx.id);
    setConfirmingIds((current) => [...current, tx.id]);

    window.setTimeout(() => {
      setLeavingIds((current) => [...current, tx.id]);
      setConfirmingIds((current) => current.filter((id) => id !== tx.id));

      window.setTimeout(() => {
        updateTransaction(tx.id, { isPaid: true, status: "completed" });

        let message = "Despesa marcada como paga!";
        if (tx.isRecurring || tx.installments > 1) {
          const nextDate = scheduleNextOccurrence(tx);
          message = `Paga! Próxima em ${pad2(nextDate.getDate())}/${pad2(nextDate.getMonth() + 1)}`;
        }

        setLeavingIds((current) => current.filter((id) => id !== tx.id));
        processingRef.current.delete(tx.id);
        showToast(message);
      }, 280);
    }, 180);
  }

  return (
    <section
      className="relative flex h-full w-full min-w-0 flex-col gap-space-24 rounded-shape-20 border border-neutral-300 bg-surface p-space-16 md:gap-space-32 md:p-space-24 lg:p-space-32"
      aria-label="Próximas despesas"
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
            Próximas despesas
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onAddExpense?.()}
          aria-label="Adicionar despesa"
          className="flex size-11 shrink-0 items-center justify-center rounded-shape-100 border border-neutral-300 bg-surface transition-colors hover:bg-neutral-100 md:size-space-32"
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
      </header>

      {visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-space-12 rounded-shape-20 border border-dashed border-neutral-300 px-space-16 py-space-32 text-center">
          <span
            className="flex size-11 items-center justify-center rounded-shape-100 bg-green-100 text-green-700"
            aria-hidden="true"
          >
            ✓
          </span>
          <p className="text-paragraph-small text-neutral-600">
            Nenhuma despesa pendente
          </p>
        </div>
      ) : (
        <ul className="flex w-full flex-col divide-y divide-neutral-300">
          {visible.map((tx) => {
            const leaving = leavingIds.includes(tx.id);
            const confirming = confirmingIds.includes(tx.id);
            return (
              <li
                key={tx.id}
                className={[
                  "flex w-full items-start justify-between gap-space-12 py-space-16 first:pt-0 last:pb-0 transition-all duration-200",
                  leaving ? "translate-x-2 opacity-0" : "opacity-100",
                ].join(" ")}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-space-4">
                  <p className="truncate text-heading-x-small font-bold text-neutral-1100">
                    {tx.description}
                  </p>
                  <p className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
                    {formatDueLabel(tx.date)}
                  </p>
                  <p className="truncate text-label-x-small tracking-[0.3px] text-neutral-600">
                    {formatPaymentSource(
                      tx.accountId,
                      bankAccounts,
                      creditCards,
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-space-12">
                  <p className="text-label-medium font-semibold tracking-[0.3px] text-neutral-1100 tabular-nums">
                    {formatCurrency(tx.amount)}
                  </p>
                  <button
                    type="button"
                    onClick={() => markAsPaid(tx)}
                    disabled={leaving || confirming}
                    aria-pressed={confirming}
                    aria-label={`Marcar ${tx.description} como paga`}
                    className={[
                      "flex size-11 items-center justify-center rounded-shape-100 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 md:size-space-32",
                      confirming
                        ? "scale-110 border-green-600 bg-green-600 text-surface"
                        : "border-neutral-300 bg-surface text-transparent hover:border-green-600 hover:bg-green-100 hover:text-green-700",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-label-medium font-bold leading-none",
                        confirming ? "text-surface" : "text-inherit",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {toast ? (
        <div
          role="status"
          className="absolute top-space-16 right-space-16 left-space-16 z-10 rounded-shape-20 bg-green-600 px-space-16 py-space-12 text-center text-label-small font-semibold text-surface shadow-sm md:left-auto md:max-w-xs"
        >
          {toast}
        </div>
      ) : null}
    </section>
  );
}
