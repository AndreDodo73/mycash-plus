import type { FamilyMember, Transaction } from "../../types/finance";
import iconExpense from "../../assets/dashboard/icon-expense.svg";
import iconIncome from "../../assets/dashboard/icon-income.svg";
import { MOTION, staggerStyle } from "../../constants/motion";
import {
  formatInstallments,
  formatSignedAmount,
  formatTransactionDate,
} from "./TransactionRow";

type TransactionCardProps = {
  tx: Transaction;
  member: FamilyMember | undefined;
  accountLabel: string;
  staggerIndex?: number;
};

export function TransactionCard({
  tx,
  member,
  accountLabel,
  staggerIndex = 0,
}: TransactionCardProps) {
  const amount = formatSignedAmount(tx);
  const typeIcon = tx.type === "income" ? iconIncome : iconExpense;

  return (
    <article
      className="motion-enter-up motion-hover-lift flex w-full flex-col gap-space-12 rounded-shape-20 border border-neutral-300 bg-surface p-space-16 hover:border-neutral-400"
      style={staggerStyle(staggerIndex, MOTION.stagger.transactionMs)}
    >      <div className="flex items-center justify-between gap-space-12">
        <div className="flex min-w-0 items-center gap-space-8">
          {member ? (
            <img
              src={member.avatarUrl}
              alt=""
              width={24}
              height={24}
              className="size-space-24 shrink-0 rounded-shape-100 object-cover"
            />
          ) : (
            <span className="flex size-space-24 shrink-0 items-center justify-center rounded-shape-100 bg-neutral-300 text-[10px] font-bold text-neutral-1100">
              ?
            </span>
          )}
          <p className="truncate text-label-x-small text-neutral-600">
            {member?.name ?? "Familiar"}
          </p>
        </div>
        <p className="shrink-0 text-label-x-small text-neutral-600">
          {formatTransactionDate(tx.date)}
        </p>
      </div>

      <div className="flex min-w-0 items-center gap-space-8">
        <img
          src={typeIcon}
          alt=""
          width={16}
          height={16}
          className="size-space-16 shrink-0"
          aria-hidden="true"
        />
        <p className="truncate text-label-medium font-bold text-neutral-1100">
          {tx.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-space-8">
        <span className="rounded-shape-100 bg-neutral-100 px-space-8 py-space-4 text-label-x-small text-neutral-600">
          {tx.category}
        </span>
        <span className="text-label-x-small text-neutral-600">{accountLabel}</span>
        <span className="text-label-x-small text-neutral-600">
          {formatInstallments(tx.installments)}
        </span>
      </div>

      <p
        className={[
          "text-right text-label-medium font-bold tabular-nums",
          amount.className,
        ].join(" ")}
      >
        {amount.text}
      </p>
    </article>
  );
}
