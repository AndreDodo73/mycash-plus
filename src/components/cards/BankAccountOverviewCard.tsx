import type { BankAccount, FamilyMember } from "../../types/finance";
import { formatCurrency } from "../../utils/formatCurrency";

type BankAccountOverviewCardProps = {
  account: BankAccount;
  holder?: FamilyMember;
};

function formatUpdatedLabel(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `Saldo atualizado ${day}/${month}/${year}`;
}

export function BankAccountOverviewCard({
  account,
  holder,
}: BankAccountOverviewCardProps) {
  return (
    <article className="relative flex h-full min-h-40 w-full flex-col justify-between gap-space-16 rounded-shape-20 border border-neutral-1100 bg-surface p-space-24">
      <div className="flex min-w-0 items-center gap-space-8">
        <span
          className="size-space-24 shrink-0 rounded-shape-2"
          style={{ backgroundColor: account.color }}
          aria-hidden="true"
        />
        <h3 className="truncate text-label-medium font-normal tracking-[0.3px] text-neutral-1100">
          {account.name}
        </h3>
      </div>

      <div className="flex items-end justify-between gap-space-12">
        <div className="min-w-0">
          <p className="text-heading-medium font-bold text-neutral-1100 tabular-nums">
            {formatCurrency(account.balance)}
          </p>
          <p className="mt-space-4 text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
            {formatUpdatedLabel(new Date())}
          </p>
        </div>
        {holder ? (
          <span className="size-8 shrink-0 overflow-hidden rounded-full border border-neutral-300">
            <img
              src={holder.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="size-full object-cover"
            />
          </span>
        ) : (
          <span
            className="size-8 shrink-0 rounded-full border border-neutral-1100"
            aria-hidden="true"
          />
        )}
      </div>
    </article>
  );
}
