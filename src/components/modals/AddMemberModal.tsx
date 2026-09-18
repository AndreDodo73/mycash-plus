import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import iconCheck from "../../assets/dashboard/icon-check.svg";
import iconUsers from "../../assets/modals/icon-users.svg";
import iconCross from "../../assets/sidebar/icon-cross.svg";
import avatarPlaceholder from "../../assets/sidebar/avatar-placeholder.png";
import { useFinance } from "../../hooks";
import { formatCurrency } from "../../utils/formatCurrency";
import { ChevronIcon, ModalCloseButton } from "../ui";

type AvatarMode = "url" | "upload";

type FormErrors = {
  name?: string;
  role?: string;
  email?: string;
  avatar?: string;
};

type AddMemberModalProps = {
  open: boolean;
  onClose: () => void;
  editMemberId?: string | null;
};

const ROLE_SUGGESTIONS = [
  "Pai",
  "Mãe",
  "Filho",
  "Filha",
  "Avô",
  "Avó",
  "Tio",
  "Tia",
] as const;

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

function digitsToAmount(digits: string): number {
  if (!digits) {
    return 0;
  }
  return Number(digits) / 100;
}

function createInitialState() {
  return {
    name: "",
    role: "",
    email: "",
    incomeDigits: "",
    avatarMode: "url" as AvatarMode,
    avatarUrl: "",
    avatarDataUrl: "",
  };
}

function incomeToDigits(amount: number | undefined): string {
  if (!amount || amount <= 0) {
    return "";
  }
  return String(Math.round(amount * 100));
}

export function AddMemberModal({
  open,
  onClose,
  editMemberId = null,
}: AddMemberModalProps) {
  const { familyMembers, addFamilyMember, updateFamilyMember } = useFinance();
  const isEditing = Boolean(editMemberId);
  const editingMember = editMemberId
    ? familyMembers.find((member) => member.id === editMemberId)
    : undefined;
  const isEditingUser = Boolean(
    editingMember && familyMembers[0]?.id === editingMember.id,
  );
  const titleId = useId();
  const roleListId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(createInitialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    if (editMemberId) {
      const member = familyMembers.find((item) => item.id === editMemberId);
      if (member) {
        const isDataUrl = member.avatarUrl.startsWith("data:");
        setForm({
          name: member.name,
          role: member.role,
          email: member.email ?? "",
          incomeDigits: incomeToDigits(member.monthlyIncome),
          avatarMode: isDataUrl ? "upload" : "url",
          avatarUrl:
            isDataUrl || member.avatarUrl === avatarPlaceholder
              ? ""
              : member.avatarUrl,
          avatarDataUrl: isDataUrl ? member.avatarUrl : "",
        });
      } else {
        setForm(createInitialState());
      }
    } else {
      setForm(createInitialState());
    }

    setErrors({});
    setClosing(false);
    // familyMembers é lido no open; não entra nas deps para não resetar o form no save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editMemberId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fecha no ciclo do open
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

  function handleAvatarFile(file: File | undefined) {
    if (!file) {
      return;
    }

    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";

    if (!isImage) {
      setErrors((current) => ({
        ...current,
        avatar: "Envie um arquivo JPG ou PNG",
      }));
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setErrors((current) => ({
        ...current,
        avatar: "A imagem deve ter no máximo 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updateForm("avatarDataUrl", result);
      updateForm("avatarUrl", "");
      setErrors((current) => ({ ...current, avatar: undefined }));
    };
    reader.readAsDataURL(file);
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (form.name.trim().length < 3) {
      next.name = "Por favor, insira um nome válido";
    }
    if (!form.role.trim()) {
      next.role = "Por favor, informe a função na família";
    }
    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Por favor, insira um e-mail válido";
    }
    return next;
  }

  function handleSubmit() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const avatarFromUrl = form.avatarUrl.trim();
    const avatarUrl =
      form.avatarMode === "upload" && form.avatarDataUrl
        ? form.avatarDataUrl
        : avatarFromUrl ||
          (isEditing ? editingMember?.avatarUrl : undefined) ||
          avatarPlaceholder;

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      email: form.email.trim() || undefined,
      avatarUrl,
      monthlyIncome: digitsToAmount(form.incomeDigits),
    };

    if (editMemberId) {
      updateFamilyMember(editMemberId, payload);
      showToast(
        isEditingUser ? "Perfil atualizado!" : "Membro atualizado com sucesso!",
      );
    } else {
      addFamilyMember(payload);
      showToast("Membro adicionado com sucesso!");
    }

    requestClose();
  }

  if (!open && !toast) {
    return null;
  }

  const incomeDisplay = form.incomeDigits
    ? formatCurrency(digitsToAmount(form.incomeDigits))
    : "";

  const previewSrc =
    form.avatarMode === "upload" && form.avatarDataUrl
      ? form.avatarDataUrl
      : form.avatarUrl.trim() || avatarPlaceholder;

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
              "relative z-10 flex max-h-[95dvh] w-full flex-col rounded-t-shape-20 bg-surface shadow-lg transition-transform duration-200 md:max-h-[90dvh] md:max-w-[500px] md:rounded-shape-20",
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
                    src={iconUsers}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <h2
                    id={titleId}
                    className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium"
                  >
                    {isEditingUser
                      ? "Editar perfil"
                      : isEditing
                        ? "Editar familiar"
                        : "Novo familiar"}
                  </h2>
                  <p className="text-label-medium tracking-[0.3px] text-neutral-600">
                    {isEditingUser
                      ? "Atualize seus dados de perfil."
                      : isEditing
                        ? "Atualize os dados deste familiar."
                        : "Adicione alguém para participar do controle financeiro."}
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
                <label className="flex w-full flex-col gap-space-8">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    Nome
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    placeholder="Nome do familiar"
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

                <label className="flex w-full flex-col gap-space-8">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    E-mail
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    placeholder="email@exemplo.com"
                    onChange={(event) => {
                      updateForm("email", event.target.value);
                      setErrors((current) => ({ ...current, email: undefined }));
                    }}
                    className={[
                      "min-h-14 w-full rounded-shape-20 border bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500",
                      errors.email ? "border-red-600" : "border-neutral-1100",
                    ].join(" ")}
                  />
                  {errors.email ? (
                    <span className="text-paragraph-x-small text-red-600">
                      {errors.email}
                    </span>
                  ) : (
                    <span className="text-paragraph-x-small text-neutral-600">
                      Opcional
                    </span>
                  )}
                </label>

                <div className="grid w-full grid-cols-1 gap-space-16 md:grid-cols-2">
                  <label className="flex w-full flex-col gap-space-8">
                    <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                      Função / Parentesco
                    </span>
                    <div className="relative w-full">
                      <input
                        type="text"
                        list={roleListId}
                        value={form.role}
                        placeholder="Ex: Pai, Mãe, Filho..."
                        onChange={(event) => {
                          updateForm("role", event.target.value);
                          setErrors((current) => ({
                            ...current,
                            role: undefined,
                          }));
                        }}
                        className={[
                          "min-h-14 w-full rounded-shape-20 border bg-surface px-space-16 pr-space-32 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500",
                          errors.role ? "border-red-600" : "border-neutral-1100",
                        ].join(" ")}
                      />
                      <datalist id={roleListId}>
                        {ROLE_SUGGESTIONS.map((role) => (
                          <option key={role} value={role} />
                        ))}
                      </datalist>
                      <ChevronIcon
                        direction="down"
                        size={14}
                        className="pointer-events-none absolute right-space-16 top-1/2 -translate-y-1/2 text-neutral-1100"
                      />
                    </div>
                    {errors.role ? (
                      <span className="text-paragraph-x-small text-red-600">
                        {errors.role}
                      </span>
                    ) : null}
                  </label>

                  <label className="flex w-full flex-col gap-space-8">
                    <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                      Renda
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={incomeDisplay}
                      placeholder="R$ 0,00"
                      onChange={(event) => {
                        const digits = event.target.value.replace(/\D/g, "");
                        updateForm("incomeDigits", digits);
                      }}
                      className="min-h-14 w-full rounded-shape-20 border border-neutral-1100 bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500"
                    />
                    <span className="text-paragraph-x-small text-neutral-600">
                      Opcional — renda mensal estimada
                    </span>
                  </label>
                </div>

                <div className="flex w-full flex-col gap-space-12">
                  <span className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                    Avatar
                  </span>

                  <div
                    className="flex w-full rounded-shape-100 border border-neutral-1100 bg-surface p-space-4"
                    role="tablist"
                    aria-label="Origem do avatar"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={form.avatarMode === "url"}
                      className={[
                        "flex min-h-12 flex-1 items-center justify-center rounded-shape-100 text-label-medium font-semibold",
                        form.avatarMode === "url"
                          ? "bg-neutral-1100 text-surface"
                          : "bg-transparent text-neutral-1100",
                      ].join(" ")}
                      onClick={() => updateForm("avatarMode", "url")}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={form.avatarMode === "upload"}
                      className={[
                        "flex min-h-12 flex-1 items-center justify-center rounded-shape-100 text-label-medium font-semibold",
                        form.avatarMode === "upload"
                          ? "bg-neutral-1100 text-surface"
                          : "bg-transparent text-neutral-1100",
                      ].join(" ")}
                      onClick={() => updateForm("avatarMode", "upload")}
                    >
                      Upload
                    </button>
                  </div>

                  <div className="flex w-full items-center gap-space-16">
                    <img
                      src={previewSrc}
                      alt=""
                      width={64}
                      height={64}
                      className="size-16 shrink-0 rounded-shape-100 border border-neutral-300 object-cover"
                    />

                    {form.avatarMode === "url" ? (
                      <input
                        type="url"
                        value={form.avatarUrl}
                        placeholder="https://..."
                        onChange={(event) => {
                          updateForm("avatarUrl", event.target.value);
                          setErrors((current) => ({
                            ...current,
                            avatar: undefined,
                          }));
                        }}
                        className="min-h-14 w-full rounded-shape-20 border border-neutral-1100 bg-surface px-space-16 text-label-large tracking-[0.3px] text-neutral-1100 outline-none placeholder:text-neutral-500"
                      />
                    ) : (
                      <div className="flex w-full flex-col gap-space-8">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                          className="sr-only"
                          onChange={(event) =>
                            handleAvatarFile(event.target.files?.[0])
                          }
                        />
                        <button
                          type="button"
                          className="flex min-h-14 w-full items-center justify-center rounded-shape-20 border border-neutral-1100 bg-surface px-space-16 text-label-large font-semibold tracking-[0.3px] text-neutral-1100"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Escolher JPG ou PNG (máx. 5MB)
                        </button>
                      </div>
                    )}
                  </div>

                  {errors.avatar ? (
                    <span className="text-paragraph-x-small text-red-600">
                      {errors.avatar}
                    </span>
                  ) : (
                    <span className="text-paragraph-x-small text-neutral-600">
                      Opcional — sem imagem, usamos o avatar padrão
                    </span>
                  )}
                </div>
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
                Salvar
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
