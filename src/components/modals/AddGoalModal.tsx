import { useEffect, useId, useLayoutEffect, useState, type FormEvent } from "react";
import iconGoals from "../../assets/sidebar/icon-goals.svg";
import iconCross from "../../assets/sidebar/icon-cross.svg";
import {
  DEFAULT_GOAL_IMAGE,
  GOAL_ILLUSTRATIONS,
} from "../../constants/goalImages";
import { useFinance } from "../../hooks";
import { formatCurrency } from "../../utils/currency";
import { FieldSelect, ModalCloseButton } from "../ui";

type FormErrors = {
  name?: string;
  category?: string;
  target?: string;
};

type AddGoalModalProps = {
  open: boolean;
  onClose: () => void;
  editGoalId?: string | null;
};

const CATEGORY_SUGGESTIONS = [
  "Segurança",
  "Lazer",
  "Tecnologia",
  "Educação",
  "Transporte",
  "Moradia",
  "Saúde",
] as const;

function digitsToAmount(digits: string): number {
  if (!digits) {
    return 0;
  }
  return Number(digits) / 100;
}

function amountToDigits(amount: number): string {
  if (!amount || amount <= 0) {
    return "";
  }
  return String(Math.round(amount * 100));
}

function createInitialState() {
  return {
    name: "",
    description: "",
    category: "",
    targetDigits: "",
    currentDigits: "",
    imageUrl: DEFAULT_GOAL_IMAGE,
  };
}

export function AddGoalModal({
  open,
  onClose,
  editGoalId = null,
}: AddGoalModalProps) {
  const { goals, addGoal, updateGoal } = useFinance();
  const isEditing = Boolean(editGoalId);
  const titleId = useId();
  const [form, setForm] = useState(createInitialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    if (editGoalId) {
      const goal = goals.find((item) => item.id === editGoalId);
      if (goal) {
        setForm({
          name: goal.name,
          description: goal.description,
          category: goal.category,
          targetDigits: amountToDigits(goal.targetAmount),
          currentDigits: amountToDigits(goal.currentAmount),
          imageUrl: goal.imageUrl || DEFAULT_GOAL_IMAGE,
        });
      } else {
        setForm(createInitialState());
      }
    } else {
      setForm(createInitialState());
    }

    setErrors({});
    setClosing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editGoalId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function requestClose() {
    setClosing(true);
    window.setTimeout(() => {
      onClose();
      setClosing(false);
    }, 180);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (form.name.trim().length < 3) {
      next.name = "Informe um nome com pelo menos 3 caracteres";
    }
    if (!form.category.trim()) {
      next.category = "Selecione ou digite uma categoria";
    }
    if (!(digitsToAmount(form.targetDigits) > 0)) {
      next.target = "Informe um valor meta válido";
    }
    return next;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const targetAmount = digitsToAmount(form.targetDigits);
    let currentAmount = digitsToAmount(form.currentDigits);
    if (currentAmount > targetAmount) {
      currentAmount = targetAmount;
    }

    const reached = currentAmount >= targetAmount && targetAmount > 0;
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || form.name.trim(),
      category: form.category.trim(),
      imageUrl: form.imageUrl || DEFAULT_GOAL_IMAGE,
      targetAmount,
      currentAmount,
      deadline: null as Date | null,
      status: (reached ? "archived" : "active") as "active" | "archived",
    };

    if (editGoalId) {
      updateGoal(editGoalId, payload);
      showToast(
        reached
          ? "Objetivo atualizado — meta concluída! Parabéns!"
          : "Objetivo atualizado!",
      );
    } else {
      addGoal(payload);
      showToast(
        reached
          ? "Objetivo criado e já concluído! Parabéns!"
          : "Objetivo criado com sucesso!",
      );
    }

    requestClose();
  }

  if (!open && !toast) {
    return null;
  }

  const targetDisplay = form.targetDigits
    ? formatCurrency(digitsToAmount(form.targetDigits))
    : "";
  const currentDisplay = form.currentDigits
    ? formatCurrency(digitsToAmount(form.currentDigits))
    : "";

  return (
    <>
      {open ? (
        <div
          className={[
            "fixed inset-0 z-50 flex items-end justify-center p-space-0 transition-opacity duration-200 md:items-center md:p-space-24",
            closing ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <button
            type="button"
            className="absolute inset-0 bg-secondary/50"
            aria-label="Fechar modal"
            onClick={requestClose}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={[
              "relative z-10 flex max-h-[95dvh] w-full flex-col rounded-t-shape-20 bg-surface shadow-lg transition-transform duration-200 md:max-h-[90dvh] md:max-w-[560px] md:rounded-shape-20",
              closing ? "translate-y-4 md:scale-95" : "translate-y-0 md:scale-100",
            ].join(" ")}
          >
            <header className="flex w-full shrink-0 items-start justify-between gap-space-16 border-b border-neutral-300 px-space-16 py-space-16 md:px-space-24">
              <div className="flex min-w-0 items-center gap-space-16">
                <div
                  className="flex size-16 shrink-0 items-center justify-center rounded-shape-20 border border-neutral-1100 bg-primary"
                  aria-hidden="true"
                >
                  <img
                    src={iconGoals}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8"
                  />
                </div>
                <div className="min-w-0">
                  <h2
                    id={titleId}
                    className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium"
                  >
                    {isEditing ? "Editar objetivo" : "Novo objetivo"}
                  </h2>
                  <p className="text-label-medium tracking-[0.3px] text-neutral-600">
                    Defina a meta e escolha uma imagem ilustrativa.
                  </p>
                </div>
              </div>
              <ModalCloseButton iconSrc={iconCross} onClick={requestClose} />
            </header>

            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={handleSubmit}
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-space-16 py-space-24 md:px-space-24">
                <div className="flex flex-col gap-space-16">
                  <div className="flex flex-col gap-space-8">
                    <p className="text-label-small font-semibold tracking-[0.3px] text-neutral-600">
                      Imagem ilustrativa
                    </p>
                    <div className="grid grid-cols-3 gap-space-8 sm:grid-cols-6">
                      {GOAL_ILLUSTRATIONS.map((item) => {
                        const selected = form.imageUrl === item.src;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            aria-label={item.label}
                            aria-pressed={selected}
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                imageUrl: item.src,
                              }))
                            }
                            className={[
                              "relative aspect-[4/3] overflow-hidden rounded-shape-20 border-2",
                              selected
                                ? "border-neutral-1100"
                                : "border-transparent",
                            ].join(" ")}
                          >
                            <img
                              src={item.src}
                              alt=""
                              className="size-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-8">
                    <label
                      htmlFor="goal-name"
                      className="text-label-small font-semibold tracking-[0.3px] text-neutral-600"
                    >
                      Nome
                    </label>
                    <input
                      id="goal-name"
                      type="text"
                      value={form.name}
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }));
                        setErrors((current) => ({ ...current, name: undefined }));
                      }}
                      className="min-h-12 w-full rounded-shape-20 border border-neutral-300 bg-surface px-space-16 text-base text-neutral-1100 outline-none focus:border-neutral-1100"
                      placeholder="Ex.: Viagem em família"
                    />
                    {errors.name ? (
                      <p className="text-label-small text-red-600" role="alert">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-space-8">
                    <label
                      htmlFor="goal-description"
                      className="text-label-small font-semibold tracking-[0.3px] text-neutral-600"
                    >
                      Descrição (opcional)
                    </label>
                    <textarea
                      id="goal-description"
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      rows={2}
                      className="min-h-20 w-full rounded-shape-20 border border-neutral-300 bg-surface px-space-16 py-space-12 text-base text-neutral-1100 outline-none focus:border-neutral-1100"
                      placeholder="Detalhes da meta"
                    />
                  </div>

                  <div className="flex flex-col gap-space-8">
                    <span className="text-label-small font-semibold tracking-[0.3px] text-neutral-600">
                      Categoria
                    </span>
                    <FieldSelect
                      id="goal-category"
                      value={form.category}
                      onChange={(value) => {
                        setForm((current) => ({
                          ...current,
                          category: value,
                        }));
                        setErrors((current) => ({
                          ...current,
                          category: undefined,
                        }));
                      }}
                      options={[
                        ...(form.category &&
                        !(CATEGORY_SUGGESTIONS as readonly string[]).includes(
                          form.category,
                        )
                          ? [{ value: form.category, label: form.category }]
                          : []),
                        ...CATEGORY_SUGGESTIONS.map((item) => ({
                          value: item,
                          label: item,
                        })),
                      ]}
                      placeholder="Selecione a categoria"
                      error={Boolean(errors.category)}
                      size="lg"
                    />
                    {errors.category ? (
                      <p className="text-label-small text-red-600" role="alert">
                        {errors.category}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-space-16 sm:grid-cols-2">
                    <div className="flex flex-col gap-space-8">
                      <label
                        htmlFor="goal-target"
                        className="text-label-small font-semibold tracking-[0.3px] text-neutral-600"
                      >
                        Valor da meta
                      </label>
                      <input
                        id="goal-target"
                        inputMode="numeric"
                        value={targetDisplay}
                        onChange={(event) => {
                          const digits = event.target.value.replace(/\D/g, "");
                          setForm((current) => ({
                            ...current,
                            targetDigits: digits,
                          }));
                          setErrors((current) => ({
                            ...current,
                            target: undefined,
                          }));
                        }}
                        className="min-h-12 w-full rounded-shape-20 border border-neutral-300 bg-surface px-space-16 text-base text-neutral-1100 outline-none focus:border-neutral-1100"
                        placeholder="R$ 0,00"
                      />
                      {errors.target ? (
                        <p className="text-label-small text-red-600" role="alert">
                          {errors.target}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-space-8">
                      <label
                        htmlFor="goal-current"
                        className="text-label-small font-semibold tracking-[0.3px] text-neutral-600"
                      >
                        Já acumulado
                      </label>
                      <input
                        id="goal-current"
                        inputMode="numeric"
                        value={currentDisplay}
                        onChange={(event) => {
                          const digits = event.target.value.replace(/\D/g, "");
                          setForm((current) => ({
                            ...current,
                            currentDigits: digits,
                          }));
                        }}
                        className="min-h-12 w-full rounded-shape-20 border border-neutral-300 bg-surface px-space-16 text-base text-neutral-1100 outline-none focus:border-neutral-1100"
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <footer className="flex w-full shrink-0 justify-end gap-space-12 border-t border-neutral-300 px-space-16 py-space-16 md:px-space-24">
                <button
                  type="button"
                  onClick={requestClose}
                  className="flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-300 px-space-24 text-label-medium font-semibold text-neutral-1100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex min-h-12 items-center justify-center rounded-shape-100 bg-secondary px-space-24 text-label-medium font-semibold text-surface"
                >
                  {isEditing ? "Salvar" : "Criar objetivo"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          className="motion-toast fixed right-space-16 top-space-16 z-[60] flex max-w-[min(100%-32px,360px)] items-center gap-space-8 rounded-shape-20 bg-green-100 px-space-16 py-space-12 text-label-medium font-semibold text-green-800 shadow-sm"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}
