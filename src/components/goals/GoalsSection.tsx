import { Link } from "react-router-dom";
import iconGoals from "../../assets/sidebar/icon-goals.svg";
import { useFinance } from "../../hooks";
import { ChevronIcon } from "../ui";
import { GoalCard } from "./GoalCard";

const DASHBOARD_LIMIT = 4;

type GoalsSectionProps = {
  /** Limita a quantidade (dashboard). Sem limite = lista completa. */
  limit?: number;
  showViewMore?: boolean;
};

export function GoalsSection({
  limit = DASHBOARD_LIMIT,
  showViewMore = true,
}: GoalsSectionProps) {
  const { goals } = useFinance();

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const visible = typeof limit === "number" ? activeGoals.slice(0, limit) : activeGoals;

  return (
    <section
      className="flex w-full flex-col gap-space-24"
      aria-labelledby="goals-section-title"
    >
      <header className="flex w-full items-center justify-between gap-space-12">
        <div className="flex min-w-0 items-center gap-space-8">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-shape-20 bg-secondary"
            aria-hidden="true"
          >
            <img
              src={iconGoals}
              alt=""
              width={16}
              height={16}
              className="size-space-16 brightness-0 invert"
            />
          </span>
          <h2
            id="goals-section-title"
            className="truncate text-heading-x-small font-bold text-neutral-1100 md:text-heading-small"
          >
            Objetivos
          </h2>
        </div>

        {showViewMore ? (
          <Link
            to="/objetivos"
            className="flex min-h-11 shrink-0 items-center gap-space-4 text-label-medium font-semibold tracking-[0.3px] text-neutral-600 transition-colors hover:text-neutral-1100"
          >
            Ver mais
            <ChevronIcon direction="right" size={14} />
          </Link>
        ) : null}
      </header>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-12 rounded-shape-20 border border-dashed border-neutral-300 bg-surface px-space-16 py-space-32 text-center">
          <p className="text-paragraph-small text-neutral-600">
            Nenhum objetivo ativo no momento.
          </p>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-space-24 md:grid-cols-2 lg:grid-cols-4">
          {visible.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} staggerIndex={index} />
          ))}
        </div>
      )}
    </section>
  );
}
