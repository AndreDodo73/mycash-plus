import { useEffect, useId, useLayoutEffect, useState, type FormEvent } from "react";
import iconCross from "../../assets/sidebar/icon-cross.svg";
import type { CategoryDef, TransactionType } from "../../types/finance";
import { ModalCloseButton } from "../ui";

const CATEGORY_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-neutral-600)",
  "var(--color-red-600)",
  "var(--color-blue-600)",
  "var(--color-green-600)",
  "var(--color-yellow-600)",
  "var(--color-neutral-800)",
  "var(--color-blue-500)",
  "var(--color-neutral-700)",
] as const;

type CategoryFormModalProps = {
  open: boolean;
  kind: TransactionType;
  editing?: CategoryDef | null;
  existingNames: string[];
  onClose: () => void;
  onSave: (input: { name: string; color: string; kind: TransactionType }) => void;
};

export function CategoryFormModal({
  open,
  kind,
  editing = null,
  existingNames,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const isEditing = Boolean(editing);
  const kindLabel = kind === "income" ? "Receita" : "Despesa";

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    setName(editing?.name ?? "");
    setColor(editing?.color ?? CATEGORY_COLORS[0]);
    setError(null);
    setClosing(false);
  }, [open, editing]);

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
  }, [open]);

  function requestClose() {
    setClosing(true);
    window.setTimeout(() => {
      onClose();
      setClosing(false);
    }, 180);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      setError("Informe um nome com pelo menos 2 caracteres");
      return;
    }

    const duplicate = existingNames.some(
      (item) =>
        item.toLowerCase() === trimmed.toLowerCase() &&
        item.toLowerCase() !== (editing?.name ?? "").toLowerCase(),
    );

    if (duplicate) {
      setError("Já existe uma categoria com este nome");
      return;
    }

    onSave({ name: trimmed, color, kind });
    requestClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-space-16 md:items-center"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Fechar"
        className={[
          "absolute inset-0 bg-neutral-1100/50 transition-opacity duration-[var(--motion-modal-overlay)] ease-out",
          closing ? "opacity-0" : "opacity-100",
        ].join(" ")}
        onClick={requestClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          "relative z-10 flex w-full max-w-md flex-col gap-space-24 rounded-shape-20 bg-surface p-space-24 shadow-lg transition-all duration-[var(--motion-modal-panel)] ease-out",
          closing
            ? "translate-y-2 scale-95 opacity-0"
            : "translate-y-0 scale-100 opacity-100",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-space-16">
          <h2 id={titleId} className="text-heading-x-small font-bold text-neutral-1100">
            {isEditing ? "Editar categoria" : `Nova categoria de ${kindLabel}`}
          </h2>
          <ModalCloseButton
            iconSrc={iconCross}
            onClick={requestClose}
            label="Fechar modal"
            className="size-11"
          />
        </div>

        <form className="flex flex-col gap-space-16" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-space-8">
            <label
              htmlFor="category-name"
              className="text-label-small font-semibold tracking-[0.3px] text-neutral-600"
            >
              Nome
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              autoFocus
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              className="min-h-12 w-full rounded-shape-20 border border-neutral-300 bg-surface px-space-16 text-base text-neutral-1100 outline-none focus:border-neutral-1100"
              placeholder="Ex.: Mercado"
            />
            {error ? (
              <p className="text-label-small text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-space-8">
            <p className="text-label-small font-semibold tracking-[0.3px] text-neutral-600">
              Cor
            </p>
            <div className="flex flex-wrap gap-space-8" role="listbox" aria-label="Cor da categoria">
              {CATEGORY_COLORS.map((token) => {
                const selected = color === token;
                return (
                  <button
                    key={token}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    aria-label={`Selecionar cor ${token}`}
                    onClick={() => setColor(token)}
                    className={[
                      "flex size-11 items-center justify-center rounded-shape-100 border-2 transition-colors",
                      selected ? "border-neutral-1100" : "border-transparent",
                    ].join(" ")}
                  >
                    <span
                      className="size-8 rounded-shape-100"
                      style={{ backgroundColor: token }}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-space-8 pt-space-8 sm:flex-row sm:justify-end">
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
              {isEditing ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
