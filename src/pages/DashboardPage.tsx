import { CreditCardsWidget } from "../components/cards";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import {
  ExpensesByCategoryCarousel,
  FinancialFlowChart,
  SummaryCards,
  UpcomingExpensesWidget,
} from "../components/dashboard";

export function DashboardPage() {
  return (
    <section className="flex w-full flex-col gap-space-24">
      <DashboardHeader />

      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(320px,538px)]">
        <div className="flex min-w-0 flex-col gap-space-24">
          <ExpensesByCategoryCarousel />
          <SummaryCards />
        </div>

        <CreditCardsWidget
          onAddCard={() => {
            // Modal P14
          }}
          onOpenCard={() => {
            // Modal P15
          }}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(320px,538px)]">
        <FinancialFlowChart />
        <UpcomingExpensesWidget
          onAddExpense={() => {
            // Modal P12
          }}
        />
      </div>
    </section>
  );
}
