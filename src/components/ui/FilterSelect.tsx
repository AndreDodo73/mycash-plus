import { useEffect, useId, useRef, useState } from "react";
import { ChevronIcon } from "./ChevronIcon";

export type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  className?: string;
  /** Oculta o label visual (mantém aria-label). Útil na toolbar do extrato. */
  hideLabel?: boolean;
};

/**
 * Select customizado (evita menu nativo azul do SO).
 * Visual alinhado aos campos de busca: pill + borda neutral-1100.
 */
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  className = "",
  hideLabel = false,
}: FilterSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected =
    options.find((option) => option.value === value)?.label ?? options[0]?.label;

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={[
        "relative flex w-full flex-col",
        hideLabel ? "min-h-12 gap-0" : "min-h-12 gap-space-8",
        className,
      ].join(" ")}
    >
      {hideLabel ? null : (
        <span className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
          {label}
        </span>
      )}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        className={[
          "flex min-h-12 w-full items-center justify-between gap-space-8 rounded-shape-100 border border-neutral-1100 bg-surface px-space-16 text-left text-paragraph-small tracking-[0.3px] text-neutral-1100",
          "hover:bg-neutral-50",
          open ? "bg-neutral-50" : "",
        ].join(" ")}
      >
        <span className="min-w-0 truncate font-semibold">{selected}</span>
        <ChevronIcon
          direction="down"
          size={16}
          className={["transition-transform", open ? "rotate-180" : ""].join(
            " ",
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="motion-dropdown absolute top-full left-0 z-40 mt-space-8 max-h-60 w-full min-w-[160px] overflow-y-auto rounded-shape-20 border border-neutral-300 bg-surface p-space-8 shadow-md"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={[
                    "flex min-h-11 w-full items-center rounded-shape-100 px-space-12 text-left text-label-medium font-semibold tracking-[0.3px]",
                    active
                      ? "bg-primary text-neutral-1100"
                      : "text-neutral-1100 hover:bg-neutral-100",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
