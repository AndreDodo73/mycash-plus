import { BalanceCard } from "./BalanceCard";
import { ExpenseCard } from "./ExpenseCard";
import { IncomeCard } from "./IncomeCard";

export function SummaryCards() {
  return (
    <section
      className="grid w-full grid-cols-1 gap-space-20 md:grid-cols-2 xl:grid-cols-3"
      aria-label="Resumo financeiro"
    >
      <BalanceCard />
      <IncomeCard />
      <ExpenseCard />
    </section>
  );
}
