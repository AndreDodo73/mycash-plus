import { useMemo, useState } from "react";
import iconGoals from "../../assets/sidebar/icon-goals.svg";
import iconPlus from "../../assets/dashboard/icon-plus.svg";
import { useFinance } from "../../hooks";
import { GoalCard } from "./GoalCard";

type GoalsTab = "active" | "completed";

type GoalsViewProps = {
  onAddGoal: () => void;
  onEditGoal: (goalId: string) => void;
};

/** View completa de objetivos em `/objetivos`. */
export function GoalsView({ onAddGoal, onEditGoal }: GoalsViewProps) {
  const { goals, deleteGoal, updateGoal } = useFinance();
  const [tab, setTab] = useState<GoalsTab>("active");

  const activeGoals = useMemo(
    () => goals.filter((goal) => goal.status === "active"),
    [goals],
  );
  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "archived"),
    [goals],
  );

  const isActiveTab = tab === "active";
  const visible = isActiveTab ? activeGoals : completedGoals;

  function handleComplete(goalId: string) {
    const goal = goals.find((item) => item.id === goalId);
    if (!goal) {
      return;
    }
    updateGoal(goalId, {
      status: "archived",
      currentAmount: Math.max(goal.currentAmount, goal.targetAmount),
    });
    setTab("completed");
  }

  function handleReopen(goalId: string) {
    updateGoal(goalId, { status: "active" });
    setTab("active");
  }

  return (
    <section className="flex w-full flex-col gap-space-24">
      <header className="flex w-full flex-col gap-space-16 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-space-12">
          <span
            className="flex size-space-56 shrink-0 items-center justify-center rounded-shape-20 border border-neutral-1100 p-space-12"
            aria-hidden="true"
          >
            <img
              src={iconGoals}
              alt=""
              width={24}
              height={24}
              className="size-space-24"
            />
          </span>
          <div className="min-w-0">
            <h1 className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium">
              Objetivos
            </h1>
            <p className="text-paragraph-small text-neutral-600">
              Crie metas, acompanhe o progresso e celebre as conquistas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddGoal}
          className="flex min-h-12 w-full shrink-0 items-center justify-center gap-space-8 rounded-shape-100 bg-secondary px-space-24 text-label-medium font-semibold text-surface sm:w-auto"
        >
          <img
            src={iconPlus}
            alt=""
            width={16}
            height={16}
            className="brightness-0 invert"
            aria-hidden="true"
          />
          Novo objetivo
        </button>
      </header>

      <div
        className="flex w-full gap-space-8 border-b border-neutral-300"
        role="tablist"
        aria-label="Abas de objetivos"
      >
        <button
          type="button"
          role="tab"
          aria-selected={isActiveTab}
          onClick={() => setTab("active")}
          className={[
            "flex min-h-12 flex-1 items-center justify-center px-space-16 text-label-medium font-semibold tracking-[0.3px] sm:flex-none",
            isActiveTab
              ? "border-b-2 border-neutral-1100 text-neutral-1100"
              : "border-b-2 border-transparent text-neutral-600",
          ].join(" ")}
        >
          Ativos ({activeGoals.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isActiveTab}
          onClick={() => setTab("completed")}
          className={[
            "flex min-h-12 flex-1 items-center justify-center px-space-16 text-label-medium font-semibold tracking-[0.3px] sm:flex-none",
            !isActiveTab
              ? "border-b-2 border-neutral-1100 text-neutral-1100"
              : "border-b-2 border-transparent text-neutral-600",
          ].join(" ")}
        >
          Concluídos ({completedGoals.length})
        </button>
      </div>

      {!isActiveTab && completedGoals.length > 0 ? (
        <div className="flex w-full flex-col items-center gap-space-8 rounded-shape-20 border border-primary bg-primary/30 px-space-16 py-space-24 text-center">
          <p className="text-heading-x-small font-bold text-neutral-1100">
            Parabéns pelas conquistas!
          </p>
          <p className="max-w-xl text-paragraph-small text-neutral-600">
            Você concluiu {completedGoals.length}{" "}
            {completedGoals.length === 1 ? "objetivo" : "objetivos"}. Continue
            assim — cada meta alcançada fortalece o futuro financeiro da
            família.
          </p>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-16 rounded-shape-20 border border-dashed border-neutral-300 bg-surface px-space-16 py-space-32 text-center">
          <p className="text-paragraph-small text-neutral-600">
            {isActiveTab
              ? "Nenhum objetivo ativo. Que tal criar o primeiro?"
              : "Ainda não há objetivos concluídos. Ao atingir a meta, eles aparecem aqui com um parabéns!"}
          </p>
          {isActiveTab ? (
            <button
              type="button"
              onClick={onAddGoal}
              className="flex min-h-12 items-center justify-center rounded-shape-100 bg-secondary px-space-24 text-label-medium font-semibold text-surface"
            >
              Criar objetivo
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-space-24 md:grid-cols-2 lg:grid-cols-4">
          {visible.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              staggerIndex={index}
              onEdit={onEditGoal}
              onDelete={deleteGoal}
              onComplete={isActiveTab ? handleComplete : undefined}
              onReopen={!isActiveTab ? handleReopen : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
