import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { ChevronIcon } from "./ChevronIcon";

export type FieldSelectOption = {
  value: string;
  label: string;
};

type FieldSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: FieldSelectOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** `lg` = campos de modal (56px); `md` = filtros/config (48px). */
  size?: "md" | "lg";
};

/**
 * Select customizado — mesmo padrão visual do FilterSelect / campos de modal.
 * Evita o menu nativo do sistema (azul no macOS).
 */
export function FieldSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione",
  error = false,
  disabled = false,
  id: idProp,
  className = "",
  size = "lg",
}: FieldSelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listId = `${id}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({
    position: "fixed",
    top: 0,
    left: 0,
    width: 280,
    zIndex: 100,
    visibility: "hidden",
  });

  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? placeholder;
  const isPlaceholder = !selected;

  useLayoutEffect(() => {
    if (!open || disabled) {
      return;
    }

    function updatePosition() {
      const button = buttonRef.current;
      if (!button) {
        return;
      }
      const rect = button.getBoundingClientRect();
      const width = Math.max(rect.width, 160);
      const maxHeight = 240;
      let top = rect.bottom + 8;
      let left = rect.left;

      if (top + maxHeight > window.innerHeight - 16) {
        top = Math.max(16, rect.top - maxHeight - 8);
      }
      if (left + width > window.innerWidth - 16) {
        left = Math.max(16, window.innerWidth - width - 16);
      }

      setPanelStyle({
        position: "fixed",
        top,
        left,
        width,
        zIndex: 100,
        visibility: "visible",
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, disabled]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let removeListeners: (() => void) | undefined;
    const timer = window.setTimeout(() => {
      function onPointerDown(event: MouseEvent) {
        const target = event.target as Node;
        if (
          rootRef.current?.contains(target) ||
          panelRef.current?.contains(target)
        ) {
          return;
        }
        setOpen(false);
      }

      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }

      document.addEventListener("mousedown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
      removeListeners = () => {
        document.removeEventListener("mousedown", onPointerDown);
        document.removeEventListener("keydown", onKeyDown);
      };
    }, 0);

    return () => {
      window.clearTimeout(timer);
      removeListeners?.();
    };
  }, [open]);

  const triggerHeight = size === "lg" ? "min-h-14" : "min-h-12";
  const triggerRadius = size === "lg" ? "rounded-shape-20" : "rounded-shape-20";
  const triggerText =
    size === "lg"
      ? "text-label-large tracking-[0.3px]"
      : "text-paragraph-small tracking-[0.3px]";

  const panel =
    open && !disabled && typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={panelRef}
            id={listId}
            role="listbox"
            aria-label={label ?? placeholder}
            style={panelStyle}
            className="motion-dropdown max-h-60 overflow-y-auto rounded-shape-20 border border-neutral-300 bg-surface p-space-8 shadow-md"
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
          </ul>,
          document.body,
        )
      : null;

  return (
    <div
      ref={rootRef}
      className={`relative flex w-full flex-col gap-space-8 ${className}`}
    >
      {label ? (
        <span
          id={`${id}-label`}
          className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100"
        >
          {label}
        </span>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-label={label ?? placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
        className={[
          "flex w-full items-center justify-between gap-space-8 border bg-surface px-space-16 text-left outline-none transition-colors",
          triggerHeight,
          triggerRadius,
          triggerText,
          error ? "border-red-600" : "border-neutral-1100",
          disabled
            ? "cursor-not-allowed bg-neutral-100 text-neutral-600"
            : "hover:bg-neutral-50",
          open && !disabled ? "bg-neutral-50" : "",
          isPlaceholder && !disabled ? "text-neutral-500" : "text-neutral-1100",
        ].join(" ")}
      >
        <span className="min-w-0 truncate">{displayLabel}</span>
        <ChevronIcon
          direction="down"
          size={14}
          className={[
            "shrink-0 text-neutral-1100 transition-transform",
            open ? "rotate-180" : "",
            disabled ? "opacity-40" : "",
          ].join(" ")}
        />
      </button>

      {panel}
    </div>
  );
}
