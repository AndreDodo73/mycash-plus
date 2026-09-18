import { useEffect, useId, useMemo, useState } from "react";
import iconCheck from "../../assets/dashboard/icon-check.svg";
import iconCross from "../../assets/sidebar/icon-cross.svg";
import iconArrowType from "../../assets/modals/icon-arrow-type.svg";
import { useFinance } from "../../hooks";
import type { TransactionType } from "../../types/finance";
import { formatCurrency } from "../../utils/formatCurrency";
import { ChevronIcon, DatePicker, ModalCloseButton } from "../ui";

type FormErrors = {
  amount?: string;
  description?: string;
  category?: string;
  accountId?: string;
};

type NewTransactionModalProps = {
  open: boolean;
  onClose: () => void;
  /** Prefill de conta/cartão (ex.: detalhes do cartão P15). */
  defaultAccountId?: string;
  /** Prefill de tipo (ex.: + em Próximas despesas → despesa). */
  defaultType?: TransactionType;
};

const INSTALLMENT_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function parseDateInputValue(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function digitsToAmount(digits: string): number {
  if (!digits) {
    return 0;
  }
  return Number(digits) / 100;
}

function createInitialState(
  defaultType: TransactionType,
  defaultAccountId?: string,
) {
  return {
    type: defaultType,
    amountDigits: "",
    description: "",
    category: "",
    memberId: "" as string,
    accountId: defaultAccountId ?? "",
    date: toDateInputValue(new Date()),
    installments: 1,
    isRecurring: false,
    creatingCategory: false,
    newCategoryName: "",
    customCategories: [] as string[],
  };
}

export function NewTransactionModal({
  open,
  onClose,
  defaultAccountId,
  defaultType = "income",
}: NewTransactionModalProps) {
  const {
    familyMembers,
    bankAccounts,
    creditCards,
    incomeCategories,
    expenseCategories,
    addTransaction,
  } = useFinance();

  const titleId = useId();
  const dateFieldId = useId();
  const [form, setForm] = useState(() =>
    createInitialState(defaultType, defaultAccountId),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const categories = useMemo(() => {
    const base =
      form.type === "income"
        ? incomeCategories.map((item) => item.name)
        : expenseCategories.map((item) => item.name);
    const extras = form.customCategories.filter(
      (name) => !base.includes(name),
    );
    return [...base, ...extras];
  }, [
    form.type,
    form.customCategories,
    incomeCategories,
    expenseCategories,
  ]);

  const selectedIsCreditCard = creditCards.some(
    (card) => card.id === form.accountId,
  );
  const showInstallments = form.type === "expense" && selectedIsCreditCard;
  const showRecurring = form.type === "expense";
  const recurringDisabled = form.installments > 1;

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(createInitialState(defaultType, defaultAccountId));
    setErrors({});
    setClosing(false);
  }, [open, defaultType, defaultAccountId]);

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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fecha via requestClose estável no ciclo do open
  }, [open]);

  function requestClose() {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 220);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function updateForm<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleTypeChange(type: TransactionType) {
    setForm((current) => ({
      ...current,
      type,
      category: "",
      installments: 1,
      isRecurring: false,
      creatingCategory: false,
      newCategoryName: "",
    }));
    setErrors({});
  }

  function handleAccountChange(accountId: string) {
    const isCard = creditCards.some((card) => card.id === accountId);
    setForm((current) => ({
      ...current,
      accountId,
      installments: isCard ? current.installments : 1,
      isRecurring: isCard ? current.isRecurring : false,
    }));
  }

  function handleInstallmentsChange(installments: number) {
    setForm((current) => ({
      ...current,
      installments,
      isRecurring: installments > 1 ? false : current.isRecurring,
    }));
  }

  function handleRecurringChange(checked: boolean) {
    if (recurringDisabled) {
      return;
    }
    setForm((current) => ({
      ...current,
      isRecurring: checked,
      installments: checked ? 1 : current.installments,
    }));
  }

  function confirmNewCategory() {
    const name = form.newCategoryName.trim();
    if (name.length < 2) {
      return;
    }
    setForm((current) => ({
      ...current,
      category: name,
      customCategories: current.customCategories.includes(name)
        ? current.customCategories
        : [...current.customCategories, name],
      creatingCategory: false,
      newCategoryName: "",
    }));
    setErrors((current) => ({ ...current, category: undefined }));
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    const amount = digitsToAmount(form.amountDigits);

    if (!(amount > 0)) {
      next.amount = "Por favor, insira um valor válido";
    }
    if (form.description.trim().length < 3) {
      next.description = "Descrição muito curta (mínimo 3 caracteres)";
    }
    if (!form.category) {
      next.category = "Por favor, selecione uma categoria";
    }
    if (!form.accountId) {
      next.accountId = "Por favor, selecione uma conta";
    }

    return next;
  }

  function handleSubmit() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const amount = digitsToAmount(form.amountDigits);
    const installments =
      form.type === "expense" && selectedIsCreditCard ? form.installments : 1;

    addTransaction({
      type: form.type,
      amount,
      description: form.description.trim(),
      category: form.category,
      date: parseDateInputValue(form.date),
      accountId: form.accountId,
      memberId: form.memberId || null,
      installments,
      status: "completed",
      isRecurring: form.type === "expense" ? form.isRecurring : false,
      isPaid: false,
    });

    showToast("Transação adicionada com sucesso!");
    requestClose();
  }

  if (!open && !toast) {
    return null;
  }

  const amountDisplay = form.amountDigits
    ? formatCurrency(digitsToAmount(form.amountDigits))
    : "";

  return (
    <>
      {open ? (
        <div
          className={[
            "fixed inset-0 z-50 flex flex-col bg-surface transition-transform duration-200 ease-out",
            closing ? "translate-y-full" : "translate-y-0",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <header className="flex w-full shrink-0 items-start justify-between gap-space-16 border-b border-neutral-300 px-space-16 py-space-16 md:px-space-24 lg:px-space-32">
            <div className="flex min-w-0 items-center gap-space-16 md:gap-space-24">
              <div
                className={[
                  "flex size-16 shrink-0 items-center justify-center rounded-shape-20 border border-neutral-1100",
                  form.type === "income" ? "bg-primary" : "bg-neutral-1100",
                ].join(" ")}
                aria-hidden="true"
              >
                <img
                  src={iconArrowType}
                  alt=""
                  width={40}
                  height={40}
                  className={[
                    "size-10",
                    form.type === "expense" ? "rotate-180 brightness-0 invert" : "",
                  ].join(" ")}
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <h2
                  id={titleId}
                  className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium"
                >
                  Nova transação
                </h2>
                <p className="text-label-medium tracking-[0.3px] text-neutral-600">
                  Registre entradas e saídas para manter seu controle.
                </p>
              </div>
            </div>

            <ModalCloseButton iconSrc={iconCross} onClick={requestClose} />
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-background">
            <form
              className="mx-auto flex w-full max-w-[700px] flex-col gap-space-24 px-space-16 py-space-24 md:px-space-24"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              <div
                className="flex w-full rounded-shape-100 border border-neutral-1100 bg-surface p-space-4"
                role="group"
                aria-label="Tipo de transação"
              >
                <button
                  type="button"
                  className={[
                    "flex min-h-12 flex-1 items-center justify-center rounded-shape-100 text-label-large font-bold tracking-[0.3px]",
                    form.type === "income"
                      ? "bg-neutral-1100 text-surface"
                      : "bg-transparent text-neutral-1100",
                  ].join(" ")}
                  aria-pressed={form.type === "income"}
                  onClick={() => handleTypeChange("income")}
                >
                  Receita
                </button>
                <button
                  type="button"
                  className={[
                    "flex min-h-12 flex-1 items-center justify-center rounded-shape-100 text-label-large font-bold tracking-[0.3px]",
                    form.type === "expense"
                      ? "bg-neutral-1100 text-surface"
                      : "bg-transparent text-neutral-1100",
                  ].join(" ")}
                  aria-pressed={form.type === "expense"}
                  onClick={() => handleTypeChange("expense")}
                >
                  Despesas
                </button>
              </div>

              <div className="grid w-full grid-cols-1 gap-space-16 md:grid-cols-2">
                <label className="flex w-full flex-col gap-space-8">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    Valor da transação
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountDisplay}
                    placeholder="R$ 0,00"
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "");
                      updateForm("amountDigits", digits);
                      setErrors((current) => ({ ...current, amount: undefined }));
                    }}
                    className={[
                      "min-h-14 w-full rounded-shape-20 border bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500",
                      errors.amount ? "border-red-600" : "border-neutral-1100",
                    ].join(" ")}
                  />
                  {errors.amount ? (
                    <span className="text-paragraph-x-small text-red-600">
                      {errors.amount}
                    </span>
                  ) : null}
                </label>

                <DatePicker
                  id={dateFieldId}
                  label="Data"
                  value={parseDateInputValue(form.date)}
                  onChange={(date) => updateForm("date", toDateInputValue(date))}
                />
              </div>

              <label className="flex w-full flex-col gap-space-8">
                <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                  Descrição
                </span>
                <input
                  type="text"
                  value={form.description}
                  placeholder="EX: Supermercado Semanal"
                  onChange={(event) => {
                    updateForm("description", event.target.value);
                    setErrors((current) => ({
                      ...current,
                      description: undefined,
                    }));
                  }}
                  className={[
                    "min-h-14 w-full rounded-shape-20 border bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500",
                    errors.description
                      ? "border-red-600"
                      : "border-neutral-1100",
                  ].join(" ")}
                />
                {errors.description ? (
                  <span className="text-paragraph-x-small text-red-600">
                    {errors.description}
                  </span>
                ) : null}
              </label>

              <div className="flex w-full flex-col gap-space-8">
                <div className="flex items-center justify-between gap-space-8">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    Categoria
                  </span>
                  <button
                    type="button"
                    className="min-h-11 px-space-4 text-label-small font-semibold tracking-[0.3px] text-neutral-1100"
                    onClick={() =>
                      updateForm("creatingCategory", !form.creatingCategory)
                    }
                  >
                    + Nova categoria
                  </button>
                </div>

                {form.creatingCategory ? (
                  <div className="flex w-full flex-col gap-space-8 sm:flex-row">
                    <input
                      type="text"
                      value={form.newCategoryName}
                      placeholder="Nome da categoria"
                      onChange={(event) =>
                        updateForm("newCategoryName", event.target.value)
                      }
                      className="min-h-14 w-full flex-1 rounded-shape-20 border border-neutral-1100 bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none"
                    />
                    <div className="flex gap-space-8">
                      <button
                        type="button"
                        className="flex min-h-12 flex-1 items-center justify-center rounded-shape-100 border border-neutral-1100 px-space-16 text-label-medium font-semibold sm:flex-none"
                        onClick={() => {
                          updateForm("creatingCategory", false);
                          updateForm("newCategoryName", "");
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="flex min-h-12 flex-1 items-center justify-center rounded-shape-100 bg-neutral-1100 px-space-16 text-label-medium font-semibold text-surface sm:flex-none"
                        onClick={confirmNewCategory}
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full">
                    <select
                      value={form.category}
                      onChange={(event) => {
                        updateForm("category", event.target.value);
                        setErrors((current) => ({
                          ...current,
                          category: undefined,
                        }));
                      }}
                      className={[
                        "min-h-14 w-full appearance-none rounded-shape-20 border bg-surface px-space-16 pr-space-32 text-label-large tracking-[0.3px] outline-none",
                        form.category
                          ? "text-neutral-1100"
                          : "text-neutral-500",
                        errors.category
                          ? "border-red-600"
                          : "border-neutral-1100",
                      ].join(" ")}
                    >
                      <option value="">Selecione a categoria</option>
                      {categories.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                      <ChevronIcon
                        direction="down"
                        size={14}
                        className="pointer-events-none absolute right-space-16 top-1/2 -translate-y-1/2 text-neutral-1100"
                      />
                  </div>
                )}
                {errors.category ? (
                  <span className="text-paragraph-x-small text-red-600">
                    {errors.category}
                  </span>
                ) : null}
              </div>

              <div className="grid w-full grid-cols-1 gap-space-16 md:grid-cols-2">
                <label className="flex w-full flex-col gap-space-8">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    Responsável
                  </span>
                  <div className="relative w-full">
                    <select
                      value={form.memberId}
                      onChange={(event) =>
                        updateForm("memberId", event.target.value)
                      }
                      className="min-h-14 w-full appearance-none rounded-shape-20 border border-neutral-1100 bg-surface px-space-16 pr-space-32 text-label-large tracking-[0.3px] text-neutral-1100 outline-none"
                    >
                      <option value="">Familiar</option>
                      {familyMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                      <ChevronIcon
                        direction="down"
                        size={14}
                        className="pointer-events-none absolute right-space-16 top-1/2 -translate-y-1/2 text-neutral-1100"
                      />
                  </div>
                </label>

                <label className="flex w-full flex-col gap-space-8">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    {form.type === "expense" ? "Conta / cartão" : "Conta"}
                  </span>
                  <div className="relative w-full">
                    <select
                      value={form.accountId}
                      onChange={(event) => {
                        handleAccountChange(event.target.value);
                        setErrors((current) => ({
                          ...current,
                          accountId: undefined,
                        }));
                      }}
                      className={[
                        "min-h-14 w-full appearance-none rounded-shape-20 border bg-surface px-space-16 pr-space-32 text-label-large tracking-[0.3px] text-neutral-1100 outline-none",
                        errors.accountId
                          ? "border-red-600"
                          : "border-neutral-1100",
                      ].join(" ")}
                    >
                      <option value="">Selecione</option>
                      <optgroup label="Contas Bancárias">
                        {bankAccounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Cartões de Crédito">
                        {creditCards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                      <ChevronIcon
                        direction="down"
                        size={14}
                        className="pointer-events-none absolute right-space-16 top-1/2 -translate-y-1/2 text-neutral-1100"
                      />
                  </div>
                  {errors.accountId ? (
                    <span className="text-paragraph-x-small text-red-600">
                      {errors.accountId}
                    </span>
                  ) : null}
                </label>
              </div>

              {showInstallments ? (
                <label className="flex w-full flex-col gap-space-8 transition-opacity duration-200">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    Parcelas
                  </span>
                  <div className="relative w-full">
                    <select
                      value={form.installments}
                      disabled={form.isRecurring}
                      onChange={(event) =>
                        handleInstallmentsChange(Number(event.target.value))
                      }
                      className="min-h-14 w-full appearance-none rounded-shape-20 border border-neutral-1100 bg-surface px-space-16 pr-space-32 text-label-large tracking-[0.3px] text-neutral-1100 outline-none disabled:cursor-not-allowed disabled:bg-neutral-100"
                    >
                      {INSTALLMENT_OPTIONS.map((count) => (
                        <option key={count} value={count}>
                          {count === 1 ? "À vista (1x)" : `${count}x`}
                        </option>
                      ))}
                    </select>
                      <ChevronIcon
                        direction="down"
                        size={14}
                        className="pointer-events-none absolute right-space-16 top-1/2 -translate-y-1/2 text-neutral-1100"
                      />
                  </div>
                  {form.isRecurring ? (
                    <span className="text-paragraph-x-small italic text-neutral-600">
                      Parcelamento desabilitado para despesas recorrentes
                    </span>
                  ) : null}
                </label>
              ) : null}

              {showRecurring ? (
                <div className="flex w-full items-start gap-space-12 rounded-shape-20 border border-primary bg-primary/20 p-space-16">
                  <input
                    id="recurring-expense"
                    type="checkbox"
                    checked={form.isRecurring}
                    disabled={recurringDisabled}
                    onChange={(event) =>
                      handleRecurringChange(event.target.checked)
                    }
                    className="mt-space-2 size-[30px] shrink-0 rounded-shape-2 border border-neutral-1100 accent-neutral-1100 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <label
                    htmlFor="recurring-expense"
                    className="flex min-w-0 flex-col gap-space-4"
                  >
                    <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                      Despesa recorrente
                    </span>
                    <span className="text-paragraph-small tracking-[0.3px] text-neutral-700">
                      {recurringDisabled
                        ? "Não disponível para compras parceladas"
                        : "Contas que se repetem todo mês (Netflix, Spotify, Academia, etc)."}
                    </span>
                  </label>
                </div>
              ) : null}
            </form>
          </div>

          <footer className="flex w-full shrink-0 justify-end gap-space-12 border-t border-neutral-300 bg-surface px-space-16 py-space-16 md:px-space-24 lg:px-space-32">
            <button
              type="button"
              className="flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-1100 bg-transparent px-space-24 text-label-large font-bold tracking-[0.3px] text-neutral-1100"
              onClick={requestClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="flex min-h-12 items-center justify-center rounded-shape-100 bg-neutral-1100 px-space-24 text-label-large font-bold tracking-[0.3px] text-surface md:min-w-[233px]"
              onClick={handleSubmit}
            >
              Salvar transação
            </button>
          </footer>
        </div>
      ) : null}

      {toast ? (
        <div
          className="motion-toast fixed right-space-16 top-space-16 z-[60] flex max-w-[min(100%-32px,360px)] items-center gap-space-8 rounded-shape-20 bg-green-100 px-space-16 py-space-12 text-label-medium font-semibold text-green-800 shadow-sm"
          role="status"
        >
          <img
            src={iconCheck}
            alt=""
            width={16}
            height={16}
            className="size-space-16 shrink-0"
            aria-hidden="true"
          />
          {toast}
        </div>
      ) : null}
    </>
  );
}
