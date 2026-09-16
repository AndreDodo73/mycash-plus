import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { SummaryCards } from "../components/dashboard";

export function DashboardPage() {
  return (
    <section className="flex w-full flex-col gap-space-24">
      <DashboardHeader />
      <SummaryCards />
    </section>
  );
}
