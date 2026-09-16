import iconExpense from "../../assets/dashboard/icon-expense.svg";
import { useFinance } from "../../hooks";
import { SummaryCardShell } from "./SummaryCardShell";

export function ExpenseCard() {
  const { calculateExpensesForPeriod } = useFinance();
  const expenses = calculateExpensesForPeriod();

  return (
    <SummaryCardShell
      label="Despesas"
      value={expenses}
      valueClassName="text-neutral-1100"
      icon={
        <img
          src={iconExpense}
          alt=""
          width={24}
          height={24}
          className="size-full object-contain"
        />
      }
    />
  );
}
