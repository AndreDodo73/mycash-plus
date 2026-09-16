import iconIncome from "../../assets/dashboard/icon-income.svg";
import { useFinance } from "../../hooks";
import { SummaryCardShell } from "./SummaryCardShell";

export function IncomeCard() {
  const { calculateIncomeForPeriod } = useFinance();
  const income = calculateIncomeForPeriod();

  return (
    <SummaryCardShell
      label="Receitas"
      value={income}
      valueClassName="text-neutral-1100"
      icon={
        <img
          src={iconIncome}
          alt=""
          width={24}
          height={24}
          className="size-full object-contain"
        />
      }
    />
  );
}
