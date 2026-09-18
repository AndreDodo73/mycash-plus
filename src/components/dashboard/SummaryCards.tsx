import { BalanceCard } from "./BalanceCard";
import { ExpenseCard } from "./ExpenseCard";
import { IncomeCard } from "./IncomeCard";

export function SummaryCards() {
  return (
    <section
      className="grid h-full w-full grid-cols-1 gap-space-20 md:grid-cols-3 md:auto-rows-fr md:items-stretch"
      aria-label="Resumo financeiro"
    >
      <BalanceCard />
      <IncomeCard />
      <ExpenseCard />
    </section>
  );
}
