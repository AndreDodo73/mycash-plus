import iconDollar from "../../assets/dashboard/icon-dollar.svg";
import { useFinance } from "../../hooks";
import { SummaryCardShell } from "./SummaryCardShell";

export function BalanceCard() {
  const { calculateTotalBalance } = useFinance();
  const balance = calculateTotalBalance();

  return (
    <SummaryCardShell
      label="Saldo total"
      value={balance}
      valueClassName="text-blue-600"
      icon={
        <img
          src={iconDollar}
          alt=""
          width={24}
          height={24}
          className="size-full object-contain"
        />
      }
    />
  );
}
