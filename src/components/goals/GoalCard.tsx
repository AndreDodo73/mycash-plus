import { useState } from "react";
import { MOTION, staggerStyle } from "../../constants/motion";
import { resolveGoalImage } from "../../constants/goalImages";
import type { Goal } from "../../types/finance";
import { calculatePercentage } from "../../utils/finance";
import { formatCurrency } from "../../utils/currency";

type GoalCardProps = {
  goal: Goal;
  staggerIndex?: number;
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
  onComplete?: (goalId: string) => void;
  onReopen?: (goalId: string) => void;
};

export function GoalCard({
  goal,
  staggerIndex = 0,
  onEdit,
  onDelete,
  onComplete,
  onReopen,
}: GoalCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const completed = goal.status === "archived";
  const percent = completed
    ? 100
    : calculatePercentage(goal.currentAmount, goal.targetAmount);
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const fillWidth = Math.min(Math.max(percent, 0), 100);
  const imageSrc = resolveGoalImage(goal.imageUrl);
  const showActions = Boolean(onEdit || onDelete || onComplete || onReopen);

  return (
    <article
      className="motion-enter-up group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-shape-20 border border-neutral-300 bg-surface shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-neutral-400 hover:shadow-md"
      style={staggerStyle(staggerIndex, MOTION.stagger.gridMs)}
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-neutral-200">
        <img
          src={imageSrc}
          alt=""
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute top-space-12 right-space-12 rounded-shape-100 bg-secondary/70 px-space-12 py-space-4 text-label-x-small font-semibold tracking-[0.3px] text-surface backdrop-blur-sm">
          {goal.category.toUpperCase()}
        </span>
        {completed ? (
          <span className="absolute top-space-12 left-space-12 rounded-shape-100 bg-primary px-space-12 py-space-4 text-label-x-small font-bold tracking-[0.3px] text-neutral-1100">
            Concluído
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-space-16 p-space-20">
        <div className="flex flex-col gap-space-8">
          <h3 className="text-label-large font-bold tracking-[0.3px] text-neutral-1100 md:text-heading-x-small">
            {goal.name}
          </h3>
          <p className="text-paragraph-small tracking-[0.3px]">
            <span className="font-bold text-neutral-1100">
              {formatCurrency(goal.currentAmount)}
            </span>{" "}
            <span className="text-neutral-600">
              de {formatCurrency(goal.targetAmount)}
            </span>
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-space-8">
          <div className="h-2.5 w-full overflow-hidden rounded-shape-100 bg-neutral-200">
            <div
              className="motion-progress-bar h-full rounded-shape-100 bg-primary"
              style={{ width: `${fillWidth}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-space-8">
            <span className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
              {percent.toLocaleString("pt-BR", {
                minimumFractionDigits: Number.isInteger(percent) ? 0 : 1,
                maximumFractionDigits: 1,
              })}
              %
            </span>
            <span className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
              {completed
                ? "Parabéns! Meta atingida"
                : `Faltam ${formatCurrency(remaining)}`}
            </span>
          </div>
        </div>

        {showActions ? (
          <div className="flex flex-wrap gap-space-8 border-t border-neutral-200 pt-space-12">
            {completed && onReopen ? (
              <button
                type="button"
                onClick={() => onReopen(goal.id)}
                className="flex min-h-11 flex-1 items-center justify-center rounded-shape-100 border border-neutral-300 px-space-12 text-label-small font-semibold text-neutral-1100"
              >
                Reabrir
              </button>
            ) : null}
            {!completed && onComplete ? (
              <button
                type="button"
                onClick={() => onComplete(goal.id)}
                className="flex min-h-11 flex-1 items-center justify-center rounded-shape-100 bg-primary px-space-12 text-label-small font-semibold text-neutral-1100"
              >
                Concluir
              </button>
            ) : null}
            {onEdit ? (
              <button
                type="button"
                onClick={() => onEdit(goal.id)}
                className="flex min-h-11 flex-1 items-center justify-center rounded-shape-100 border border-neutral-300 px-space-12 text-label-small font-semibold text-neutral-1100"
              >
                Editar
              </button>
            ) : null}
            {onDelete ? (
              confirmDelete ? (
                <div className="flex w-full flex-col gap-space-8">
                  <p className="text-label-x-small text-neutral-600">
                    Excluir este objetivo?
                  </p>
                  <div className="flex gap-space-8">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex min-h-11 flex-1 items-center justify-center rounded-shape-100 border border-neutral-300 text-label-small font-semibold"
                    >
                      Não
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(goal.id);
                        setConfirmDelete(false);
                      }}
                      className="flex min-h-11 flex-1 items-center justify-center rounded-shape-100 bg-red-600 text-label-small font-semibold text-surface"
                    >
                      Sim, excluir
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex min-h-11 flex-1 items-center justify-center rounded-shape-100 border border-red-600 px-space-12 text-label-small font-semibold text-red-600"
                >
                  Excluir
                </button>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
