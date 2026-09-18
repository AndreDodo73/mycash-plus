import { useEffect, useId, useState } from "react";
import iconCheck from "../../assets/dashboard/icon-check.svg";
import iconCreditCard from "../../assets/modals/icon-credit-card.svg";
import iconCross from "../../assets/sidebar/icon-cross.svg";
import { useFinance } from "../../hooks";
import type {
  BankAccountType,
  CardTheme,
} from "../../types/finance";
import { formatCurrency } from "../../utils/formatCurrency";
import { FieldSelect, ModalCloseButton } from "../ui";

type EntityKind = "account" | "card";

type FormErrors = {
  name?: string;
  holderId?: string;
  balance?: string;
  closingDay?: string;
  dueDay?: string;
  limit?: string;
  lastFourDigits?: string;
  theme?: string;
};

type AddAccountOrCardModalProps = {
  open: boolean;
  onClose: () => void;
  onRequestAddMember?: () => void;
  defaultKind?: EntityKind;
  /** Quando definido, abre em modo edição de cartão (P15). */
  editCardId?: string | null;
};

const ACCOUNT_COLORS = [
  "var(--color-purple-600)",
  "var(--color-orange-600)",
  "var(--color-green-600)",
  "var(--color-blue-600)",
  "var(--color-pink-600)",
  "var(--color-yellow-600)",
  "var(--color-red-600)",
] as const;

const CARD_THEMES: {
  value: CardTheme;
  label: string;
  swatchClassName: string;
}[] = [
  {
    value: "black",
    label: "Black",
    swatchClassName: "bg-neutral-1100 text-surface",
  },
  {
    value: "lime",
    label: "Lime",
    swatchClassName: "bg-primary text-neutral-1100",
  },
  {
    value: "white",
    label: "White",
    swatchClassName: "bg-surface text-neutral-1100",
  },
];

const ACCOUNT_TYPE_OPTIONS: { value: BankAccountType; label: string }[] = [
  { value: "checking", label: "Conta corrente" },
  { value: "savings", label: "Poupança" },
  { value: "other", label: "Outra" },
];

const DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => index + 1);

function digitsToAmount(digits: string): number {
  if (!digits) {
    return 0;
  }
  return Number(digits) / 100;
}

function amountToDigits(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return amount === 0 ? "0" : "";
  }
  return String(Math.round(amount * 100));
}

function createInitialState(defaultKind: EntityKind) {
  return {
    kind: defaultKind,
    name: "",
    holderId: "",
    accountType: "checking" as BankAccountType,
    balanceDigits: "",
    color: ACCOUNT_COLORS[0] as string,
    bankLabel: "",
    lastFourDigits: "",
    limitDigits: "",
    closingDay: "",
    dueDay: "",
    theme: "black" as CardTheme,
  };
}

export function AddAccountOrCardModal({
  open,
  onClose,
  onRequestAddMember,
  defaultKind = "account",
  editCardId = null,
}: AddAccountOrCardModalProps) {
  const { familyMembers, creditCards, addBankAccount, addCreditCard, updateCreditCard } =
    useFinance();
  const titleId = useId();
  const isEditingCard = Boolean(editCardId);

  const [form, setForm] = useState(() => createInitialState(defaultKind));
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editCardId) {
      const card = creditCards.find((item) => item.id === editCardId);
      if (card) {
        setForm({
          ...createInitialState("card"),
          name: card.name,
          holderId: card.holderId,
          lastFourDigits: card.lastFourDigits ?? "",
          limitDigits: amountToDigits(card.limit),
          closingDay: String(card.closingDay),
          dueDay: String(card.dueDay),
          theme: card.theme,
        });
        setErrors({});
        setClosing(false);
        return;
      }
    }

    setForm(createInitialState(defaultKind));
    setErrors({});
    setClosing(false);
  }, [open, defaultKind, editCardId, creditCards]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function requestClose() {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 180);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function updateForm<K extends keyof ReturnType<typeof createInitialState>>(
    key: K,
    value: ReturnType<typeof createInitialState>[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleKindChange(kind: EntityKind) {
    setForm((current) => ({
      ...createInitialState(kind),
      // preserva titular se já escolhido
      holderId: current.holderId,
    }));
    setErrors({});
  }

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (form.name.trim().length < 3) {
      next.name = "Por favor, informe um nome válido (mínimo 3 caracteres)";
    }
    if (!form.holderId) {
      next.holderId = "Por favor, selecione o titular";
    }

    if (form.kind === "card") {
      const closing = Number(form.closingDay);
      const due = Number(form.dueDay);
      const limit = digitsToAmount(form.limitDigits);

      if (!form.closingDay || closing < 1 || closing > 31) {
        next.closingDay = "Informe o dia de fechamento (1 a 31)";
      }
      if (!form.dueDay || due < 1 || due > 31) {
        next.dueDay = "Informe o dia de vencimento (1 a 31)";
      }
      if (!(limit > 0)) {
        next.limit = "O limite deve ser maior que zero";
      }
      if (
        form.lastFourDigits &&
        !/^\d{4}$/.test(form.lastFourDigits.trim())
      ) {
        next.lastFourDigits = "Informe exatamente 4 dígitos";
      }
      if (!form.theme) {
        next.theme = "Selecione um tema visual";
      }
    }

    return next;
  }

  function handleSubmit() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (form.kind === "account") {
      addBankAccount({
        name: form.name.trim(),
        type: form.accountType,
        balance: digitsToAmount(form.balanceDigits),
        color: form.color,
        holderId: form.holderId,
      });
      showToast("Conta adicionada com sucesso!");
    } else {
      const digits = form.lastFourDigits.trim();
      const payload = {
        name: form.name.trim(),
        closingDay: Number(form.closingDay),
        dueDay: Number(form.dueDay),
        limit: digitsToAmount(form.limitDigits),
        theme: form.theme,
        lastFourDigits: digits || undefined,
        holderId: form.holderId,
      };

      if (editCardId) {
        updateCreditCard(editCardId, payload);
        showToast("Cartão atualizado com sucesso!");
      } else {
        addCreditCard({
          ...payload,
          currentInvoice: 0,
          expenseIds: [],
        });
        showToast("Cartão adicionado com sucesso!");
      }
    }

    requestClose();
  }

  if (!open && !toast) {
    return null;
  }

  const isAccount = form.kind === "account";
  const title = isEditingCard
    ? "Editar cartão"
    : isAccount
      ? "Nova conta"
      : "Novo cartão";
  const subtitle = isEditingCard
    ? "Atualize as informações do cartão"
    : isAccount
      ? "Adicione uma nova conta bancária"
      : "Adicione um novo cartão de crédito";
  const nameLabel = isAccount ? "Nome da conta" : "Apelido do cartão";
  const namePlaceholder = isAccount
    ? "Ex: Conta corrente Nubank"
    : "Ex: XP black";
  const saveLabel = isEditingCard ? "Salvar alterações" : "Salvar";

  const balanceDisplay = form.balanceDigits
    ? formatCurrency(digitsToAmount(form.balanceDigits))
    : "";
  const limitDisplay = form.limitDigits
    ? formatCurrency(digitsToAmount(form.limitDigits))
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
                  className="flex size-16 shrink-0 items-center justify-center rounded-shape-20 border border-neutral-1100 bg-surface"
                  aria-hidden="true"
                >
                  <img
                    src={iconCreditCard}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <h2
                    id={titleId}
                    className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium"
                  >
                    {title}
                  </h2>
                  <p className="text-label-medium tracking-[0.3px] text-neutral-600">
                    {subtitle}
                  </p>
                </div>
              </div>

              <ModalCloseButton iconSrc={iconCross} onClick={requestClose} />
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-space-16 py-space-24 md:px-space-24">
              <form
                className="flex w-full flex-col gap-space-24"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <div
                  className="flex w-full rounded-shape-100 border border-neutral-1100 bg-surface p-space-4"
                  role="group"
                  aria-label="Tipo"
                >
                  <button
                    type="button"
                    disabled={isEditingCard}
                    className={[
                      "flex min-h-12 flex-1 items-center justify-center rounded-shape-100 px-space-8 text-center text-label-medium font-bold tracking-[0.3px] md:text-label-large disabled:cursor-not-allowed",
                      isAccount
                        ? "bg-neutral-1100 text-surface"
                        : "bg-transparent text-neutral-1100",
                    ].join(" ")}
                    aria-pressed={isAccount}
                    onClick={() => handleKindChange("account")}
                  >
                    Conta bancária
                  </button>
                  <button
                    type="button"
                    disabled={isEditingCard}
                    className={[
                      "flex min-h-12 flex-1 items-center justify-center rounded-shape-100 px-space-8 text-center text-label-medium font-bold tracking-[0.3px] md:text-label-large disabled:cursor-not-allowed",
                      !isAccount
                        ? "bg-neutral-1100 text-surface"
                        : "bg-transparent text-neutral-1100",
                    ].join(" ")}
                    aria-pressed={!isAccount}
                    onClick={() => handleKindChange("card")}
                  >
                    Cartão de crédito
                  </button>
                </div>

                <label className="flex w-full flex-col gap-space-8">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    {nameLabel}
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    placeholder={namePlaceholder}
                    onChange={(event) => {
                      updateForm("name", event.target.value);
                      setErrors((current) => ({ ...current, name: undefined }));
                    }}
                    className={[
                      "min-h-14 w-full rounded-shape-20 border bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500",
                      errors.name ? "border-red-600" : "border-neutral-1100",
                    ].join(" ")}
                  />
                  {errors.name ? (
                    <span className="text-paragraph-x-small text-red-600">
                      {errors.name}
                    </span>
                  ) : null}
                </label>

                {isAccount ? (
                  <div className="grid w-full grid-cols-1 gap-space-16 md:grid-cols-2">
                    <div className="flex w-full flex-col gap-space-8">
                      <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                        Tipo
                      </span>
                      <FieldSelect
                        value={form.accountType}
                        onChange={(value) =>
                          updateForm("accountType", value as BankAccountType)
                        }
                        options={ACCOUNT_TYPE_OPTIONS.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                        size="lg"
                      />
                    </div>

                    <label className="flex w-full flex-col gap-space-8">
                      <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                        Saldo inicial
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={balanceDisplay}
                        placeholder="R$ 0,00"
                        onChange={(event) => {
                          updateForm(
                            "balanceDigits",
                            event.target.value.replace(/\D/g, ""),
                          );
                          setErrors((current) => ({
                            ...current,
                            balance: undefined,
                          }));
                        }}
                        className={[
                          "min-h-14 w-full rounded-shape-20 border bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500",
                          errors.balance
                            ? "border-red-600"
                            : "border-neutral-1100",
                        ].join(" ")}
                      />
                      {errors.balance ? (
                        <span className="text-paragraph-x-small text-red-600">
                          {errors.balance}
                        </span>
                      ) : null}
                    </label>
                  </div>
                ) : (
                  <div className="grid w-full grid-cols-1 gap-space-16 md:grid-cols-2">
                    <label className="flex w-full flex-col gap-space-8">
                      <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                        Banco
                      </span>
                      <input
                        type="text"
                        value={form.bankLabel}
                        placeholder="XP"
                        onChange={(event) =>
                          updateForm("bankLabel", event.target.value)
                        }
                        className="min-h-14 w-full rounded-shape-20 border border-neutral-1100 bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500"
                      />
                    </label>

                    <label className="flex w-full flex-col gap-space-8">
                      <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                        Número final
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={form.lastFourDigits}
                        placeholder="5843"
                        onChange={(event) => {
                          updateForm(
                            "lastFourDigits",
                            event.target.value.replace(/\D/g, "").slice(0, 4),
                          );
                          setErrors((current) => ({
                            ...current,
                            lastFourDigits: undefined,
                          }));
                        }}
                        className={[
                          "min-h-14 w-full rounded-shape-20 border bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500",
                          errors.lastFourDigits
                            ? "border-red-600"
                            : "border-neutral-1100",
                        ].join(" ")}
                      />
                      {errors.lastFourDigits ? (
                        <span className="text-paragraph-x-small text-red-600">
                          {errors.lastFourDigits}
                        </span>
                      ) : null}
                    </label>
                  </div>
                )}

                {!isAccount ? (
                  <div className="grid w-full grid-cols-1 items-start gap-space-16 md:grid-cols-2">
                    <label className="flex w-full flex-col gap-space-8">
                      <span className="flex min-h-11 items-center text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                        Limite total
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={limitDisplay}
                        placeholder="R$ 0,00"
                        onChange={(event) => {
                          updateForm(
                            "limitDigits",
                            event.target.value.replace(/\D/g, ""),
                          );
                          setErrors((current) => ({
                            ...current,
                            limit: undefined,
                          }));
                        }}
                        className={[
                          "min-h-14 w-full rounded-shape-20 border bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500",
                          errors.limit
                            ? "border-red-600"
                            : "border-neutral-1100",
                        ].join(" ")}
                      />
                      {errors.limit ? (
                        <span className="text-paragraph-x-small text-red-600">
                          {errors.limit}
                        </span>
                      ) : null}
                    </label>

                    <div className="flex w-full flex-col gap-space-8">
                      <div className="flex min-h-11 items-center justify-between gap-space-8">
                        <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                          Responsável
                        </span>
                        <button
                          type="button"
                          className="flex min-h-11 shrink-0 items-center px-space-4 text-label-small font-semibold tracking-[0.3px] text-neutral-1100"
                          onClick={() => onRequestAddMember?.()}
                        >
                          + Novo membro
                        </button>
                      </div>
                      <FieldSelect
                        value={form.holderId}
                        onChange={(value) => {
                          updateForm("holderId", value);
                          setErrors((current) => ({
                            ...current,
                            holderId: undefined,
                          }));
                        }}
                        options={familyMembers.map((member) => ({
                          value: member.id,
                          label: member.name,
                        }))}
                        placeholder="Selecione"
                        error={Boolean(errors.holderId)}
                        size="lg"
                      />
                      {errors.holderId ? (
                        <span className="text-paragraph-x-small text-red-600">
                          {errors.holderId}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {!isAccount ? (
                  <div className="grid w-full grid-cols-1 gap-space-16 md:grid-cols-2">
                    <div className="flex w-full flex-col gap-space-8">
                      <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                        Fechamento
                      </span>
                      <FieldSelect
                        value={form.closingDay}
                        onChange={(value) => {
                          updateForm("closingDay", value);
                          setErrors((current) => ({
                            ...current,
                            closingDay: undefined,
                          }));
                        }}
                        options={DAY_OPTIONS.map((day) => ({
                          value: String(day),
                          label: String(day),
                        }))}
                        placeholder="Dia"
                        error={Boolean(errors.closingDay)}
                        size="lg"
                      />
                      {errors.closingDay ? (
                        <span className="text-paragraph-x-small text-red-600">
                          {errors.closingDay}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex w-full flex-col gap-space-8">
                      <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                        Vencimento
                      </span>
                      <FieldSelect
                        value={form.dueDay}
                        onChange={(value) => {
                          updateForm("dueDay", value);
                          setErrors((current) => ({
                            ...current,
                            dueDay: undefined,
                          }));
                        }}
                        options={DAY_OPTIONS.map((day) => ({
                          value: String(day),
                          label: String(day),
                        }))}
                        placeholder="Dia"
                        error={Boolean(errors.dueDay)}
                        size="lg"
                      />
                      {errors.dueDay ? (
                        <span className="text-paragraph-x-small text-red-600">
                          {errors.dueDay}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {isAccount ? (
                  <div className="flex w-full flex-col gap-space-8">
                    <div className="flex min-h-11 items-center justify-between gap-space-8">
                      <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                        Responsável
                      </span>
                      <button
                        type="button"
                        className="flex min-h-11 shrink-0 items-center px-space-4 text-label-small font-semibold tracking-[0.3px] text-neutral-1100"
                        onClick={() => onRequestAddMember?.()}
                      >
                        + Novo membro
                      </button>
                    </div>
                    <FieldSelect
                      value={form.holderId}
                      onChange={(value) => {
                        updateForm("holderId", value);
                        setErrors((current) => ({
                          ...current,
                          holderId: undefined,
                        }));
                      }}
                      options={familyMembers.map((member) => ({
                        value: member.id,
                        label: member.name,
                      }))}
                      placeholder="Selecione"
                      error={Boolean(errors.holderId)}
                      size="lg"
                    />
                    {errors.holderId ? (
                      <span className="text-paragraph-x-small text-red-600">
                        {errors.holderId}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {isAccount ? (
                  <fieldset className="flex w-full flex-col gap-space-12 border-0 p-0">
                    <legend className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                      Cor de identificação
                    </legend>
                    <div className="flex flex-wrap gap-space-12">
                      {ACCOUNT_COLORS.map((color) => {
                        const selected = form.color === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            aria-label={`Cor ${color}`}
                            aria-pressed={selected}
                            onClick={() => updateForm("color", color)}
                            className={[
                              "flex size-12 items-center justify-center rounded-shape-100 border-2",
                              selected
                                ? "border-neutral-1100"
                                : "border-transparent",
                            ].join(" ")}
                          >
                            <span
                              className="flex size-10 items-center justify-center rounded-shape-20 border border-neutral-1100"
                              style={{ backgroundColor: color }}
                            >
                              {selected ? (
                                <span className="text-label-small font-bold text-surface">
                                  ✓
                                </span>
                              ) : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : (
                  <fieldset className="flex w-full flex-col gap-space-12 border-0 p-0">
                    <legend className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                      Tema visual
                    </legend>
                    <p className="text-paragraph-x-small text-neutral-600">
                      Cor de destaque do cartão na lista e nos detalhes.
                    </p>
                    <div
                      className="grid w-full grid-cols-3 gap-space-8"
                      role="radiogroup"
                      aria-label="Tema visual do cartão"
                    >
                      {CARD_THEMES.map((theme) => {
                        const selected = form.theme === theme.value;
                        return (
                          <button
                            key={theme.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            aria-label={`Tema ${theme.label}`}
                            onClick={() => {
                              updateForm("theme", theme.value);
                              setErrors((current) => ({
                                ...current,
                                theme: undefined,
                              }));
                            }}
                            className={[
                              "flex min-h-14 cursor-pointer flex-col items-center justify-center gap-space-4 rounded-shape-20 border-2 px-space-8 transition-shadow",
                              theme.swatchClassName,
                              selected
                                ? "border-blue-600 ring-2 ring-blue-100"
                                : "border-neutral-300 hover:border-neutral-500",
                            ].join(" ")}
                          >
                            <span className="text-label-medium font-semibold">
                              {theme.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.theme ? (
                      <span className="text-paragraph-x-small text-red-600">
                        {errors.theme}
                      </span>
                    ) : null}
                  </fieldset>
                )}
              </form>
            </div>

            <footer className="flex w-full shrink-0 justify-end gap-space-12 border-t border-neutral-300 px-space-16 py-space-16 md:px-space-24">
              <button
                type="button"
                className="flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-1100 bg-transparent px-space-24 text-label-large font-bold tracking-[0.3px] text-neutral-1100"
                onClick={requestClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="flex min-h-12 items-center justify-center rounded-shape-100 bg-neutral-1100 px-space-24 text-label-large font-bold tracking-[0.3px] text-surface"
                onClick={handleSubmit}
              >
                {saveLabel}
              </button>
            </footer>
          </div>
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
