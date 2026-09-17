import type { BankAccount, CreditCard, FamilyMember, Transaction } from "../../types/finance";
import { formatCurrency } from "../../utils/formatCurrency";
import iconExpense from "../../assets/dashboard/icon-expense.svg";
import iconIncome from "../../assets/dashboard/icon-income.svg";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatTransactionDate(date: Date): string {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function resolveAccountLabel(
  accountId: string,
  bankAccounts: BankAccount[],
  creditCards: CreditCard[],
): string {
  const account = bankAccounts.find((item) => item.id === accountId);
  if (account) {
    return account.name;
  }
  const card = creditCards.find((item) => item.id === accountId);
  if (card) {
    return card.name;
  }
  return "Desconhecido";
}

export function formatInstallments(installments: number): string {
  return installments <= 1 ? "-" : `${installments}x`;
}

export function formatSignedAmount(tx: Transaction): {
  text: string;
  className: string;
} {
  const formatted = formatCurrency(tx.amount);
  if (tx.type === "income") {
    return {
      text: `+${formatted}`,
      className: "text-green-700",
    };
  }
  return {
    text: `-${formatted}`,
    className: "text-neutral-1100",
  };
}

type TransactionRowProps = {
  tx: Transaction;
  member: FamilyMember | undefined;
  accountLabel: string;
  zebra: boolean;
};

export function TransactionRow({
  tx,
  member,
  accountLabel,
  zebra,
}: TransactionRowProps) {
  const amount = formatSignedAmount(tx);
  const typeIcon = tx.type === "income" ? iconIncome : iconExpense;

  return (
    <tr
      className={[
        "border-b border-neutral-300 transition-colors last:border-b-0 hover:bg-neutral-200",
        zebra ? "bg-neutral-100" : "bg-surface",
      ].join(" ")}
    >
      <td className="w-12 px-space-8 py-space-12 lg:w-[50px] lg:px-space-12">
        {member ? (
          <img
            src={member.avatarUrl}
            alt=""
            width={24}
            height={24}
            className="size-space-24 rounded-shape-100 object-cover"
          />
        ) : (
          <span
            className="flex size-space-24 items-center justify-center rounded-shape-100 bg-neutral-300 text-[10px] font-bold text-neutral-1100"
            aria-hidden="true"
          >
            ?
          </span>
        )}
      </td>
      <td className="px-space-8 py-space-12 text-label-x-small tracking-[0.3px] text-neutral-600 whitespace-nowrap lg:px-space-12">
        {formatTransactionDate(tx.date)}
      </td>
      <td className="min-w-0 px-space-8 py-space-12 lg:px-space-12">
        <div className="flex min-w-0 items-center gap-space-8">
          <span className="flex size-space-16 shrink-0 items-center justify-center overflow-hidden rounded-shape-100 bg-neutral-100">
            <img
              src={typeIcon}
              alt=""
              width={16}
              height={16}
              className="size-space-16"
              aria-hidden="true"
            />
          </span>
          <span className="truncate text-label-x-small font-bold tracking-[0.3px] text-neutral-1100">
            {tx.description}
          </span>
        </div>
      </td>
      <td className="px-space-8 py-space-12 lg:px-space-12">
        <span className="inline-flex max-w-full truncate rounded-shape-100 bg-neutral-100 px-space-8 py-space-4 text-label-x-small tracking-[0.3px] text-neutral-600">
          {tx.category}
        </span>
      </td>
      <td className="hidden px-space-8 py-space-12 text-label-x-small tracking-[0.3px] text-neutral-600 lg:table-cell lg:px-space-12">
        {accountLabel}
      </td>
      <td className="hidden px-space-8 py-space-12 text-center text-label-x-small tracking-[0.3px] text-neutral-600 lg:table-cell lg:px-space-12">
        {formatInstallments(tx.installments)}
      </td>
      <td
        className={[
          "px-space-8 py-space-12 text-right text-label-x-small font-bold tracking-[0.3px] whitespace-nowrap tabular-nums lg:px-space-12",
          amount.className,
        ].join(" ")}
      >
        {amount.text}
      </td>
    </tr>
  );
}
