import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import iconCalendar from "../../assets/dashboard/icon-calendar.svg";
import {
  addMonths,
  endOfMonth,
  formatDate,
  formatDateHeadline,
  formatMonthYear,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "../../utils/date";
import { ChevronIcon } from "./ChevronIcon";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"] as const;
const PANEL_WIDTH = 360;
const PANEL_ESTIMATED_HEIGHT = 420;

function buildMonthDays(month: Date): (Date | null)[] {
  const first = startOfMonth(month);
  const total = endOfMonth(month).getDate();
  const offset = first.getDay();
  const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= total; day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  id?: string;
  error?: boolean;
  className?: string;
};

/**
 * Seletor de data única — mesmo visual do DateRangePicker do dashboard
 * (campo + popover com grade, primary no dia, ações Limpar/Cancelar/OK).
 */
export function DatePicker({
  value,
  onChange,
  label,
  id: idProp,
  error = false,
  className = "",
}: DatePickerProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value));
  const [draft, setDraft] = useState<Date | null>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({
    position: "fixed",
    top: 0,
    left: 0,
    width: PANEL_WIDTH,
    zIndex: 100,
    visibility: "hidden",
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => startOfDay(new Date()), []);
  const valueTime = value.getTime();
  const selected = useMemo(() => startOfDay(new Date(valueTime)), [valueTime]);

  function openPicker() {
    setDraft(startOfDay(value));
    setViewMonth(startOfMonth(value));
    setOpen(true);
  }

  function closePicker() {
    setOpen(false);
    setDraft(null);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function updatePosition() {
      const button = buttonRef.current;
      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const width = Math.min(PANEL_WIDTH, window.innerWidth - 32);
      let top = rect.bottom + 8;
      let left = rect.left;

      if (top + PANEL_ESTIMATED_HEIGHT > window.innerHeight - 16) {
        top = Math.max(16, rect.top - PANEL_ESTIMATED_HEIGHT - 8);
      }
      if (left + width > window.innerWidth - 16) {
        left = Math.max(16, window.innerWidth - width - 16);
      }
      if (left < 16) {
        left = 16;
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
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let removeListeners: (() => void) | undefined;

    // Evita fechar no mesmo gesto que abriu o popover.
    const timer = window.setTimeout(() => {
      function onPointerDown(event: MouseEvent) {
        const target = event.target as Node;
        if (
          rootRef.current?.contains(target) ||
          panelRef.current?.contains(target)
        ) {
          return;
        }
        closePicker();
      }

      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          closePicker();
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

  const days = useMemo(() => buildMonthDays(viewMonth), [viewMonth]);
  const monthLabel = formatMonthYear(viewMonth);
  const headline = draft ? formatDateHeadline(draft) : "Selecionar data";

  function confirmDraft() {
    if (!draft) {
      return;
    }
    onChange(startOfDay(draft));
    closePicker();
  }

  const panel =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={panelRef}
            style={panelStyle}
            className="flex flex-col overflow-hidden rounded-shape-20 border border-neutral-300 bg-surface shadow-sm"
            role="dialog"
            aria-label="Selecionar data"
          >
            <div className="flex items-end gap-space-8 border-b border-neutral-300 pt-space-16 pr-space-12 pb-space-12 pl-space-24">
              <div className="flex min-w-0 flex-1 flex-col gap-space-16">
                <p className="text-label-small font-medium text-neutral-600">
                  Selecionar data
                </p>
                <p className="truncate text-heading-medium font-normal text-neutral-1100">
                  {headline}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-space-4 pr-space-12 pl-space-16">
              <p className="text-label-medium font-medium text-neutral-1100">
                {monthLabel}
              </p>
              <div className="flex items-center">
                <button
                  type="button"
                  className="flex size-space-32 items-center justify-center rounded-full text-neutral-1100 transition-colors hover:bg-neutral-100"
                  aria-label="Mês anterior"
                  onClick={() => setViewMonth((current) => addMonths(current, -1))}
                >
                  <ChevronIcon direction="left" size={14} />
                </button>
                <button
                  type="button"
                  className="flex size-space-32 items-center justify-center rounded-full text-neutral-1100 transition-colors hover:bg-neutral-100"
                  aria-label="Próximo mês"
                  onClick={() => setViewMonth((current) => addMonths(current, 1))}
                >
                  <ChevronIcon direction="right" size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center px-space-12 pb-space-4">
              <div className="grid h-12 w-full grid-cols-7">
                {WEEKDAYS.map((day, index) => (
                  <span
                    key={`${day}-${index}`}
                    className="flex items-center justify-center text-paragraph-small text-neutral-1100"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid w-full grid-cols-7">
                {days.map((day, index) => {
                  if (!day) {
                    return <span key={`empty-${index}`} className="h-12" />;
                  }

                  const isSelected = Boolean(draft && isSameDay(day, draft));
                  const isToday = isSameDay(day, today);

                  return (
                    <button
                      type="button"
                      key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                      onClick={() => setDraft(startOfDay(day))}
                      className="flex h-12 items-center justify-center text-paragraph-small text-neutral-1100 transition-colors hover:bg-neutral-100"
                    >
                      <span
                        className={[
                          "flex size-10 items-center justify-center rounded-shape-100",
                          isSelected
                            ? "bg-primary font-semibold text-neutral-1100"
                            : isToday
                              ? "border border-neutral-1100"
                              : "",
                        ].join(" ")}
                      >
                        {day.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between px-space-12 pt-space-4 pb-space-8">
              <button
                type="button"
                className="min-h-11 rounded-shape-100 px-space-12 text-label-medium font-semibold text-neutral-1100 transition-colors hover:bg-neutral-100"
                onClick={() => setDraft(null)}
              >
                Limpar
              </button>
              <div className="flex items-center gap-space-8">
                <button
                  type="button"
                  className="min-h-11 rounded-shape-100 px-space-12 text-label-medium font-semibold text-neutral-1100 transition-colors hover:bg-neutral-100"
                  onClick={closePicker}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-shape-100 px-space-12 text-label-medium font-semibold text-neutral-1100 transition-colors hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  disabled={!draft}
                  onClick={confirmDraft}
                >
                  OK
                </button>
              </div>
            </div>
          </div>,
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
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-label={label ?? "Selecionar data"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (open) {
            closePicker();
          } else {
            openPicker();
          }
        }}
        className={[
          "flex min-h-14 w-full items-center justify-between gap-space-8 rounded-shape-20 border bg-surface px-space-16 text-left text-label-large tracking-[0.3px] text-neutral-1100 transition-colors hover:bg-neutral-50",
          error ? "border-red-600" : "border-neutral-1100",
          open ? "bg-neutral-50" : "",
        ].join(" ")}
      >
        <span>{formatDate(selected)}</span>
        <img
          src={iconCalendar}
          alt=""
          width={24}
          height={24}
          className="size-space-24 shrink-0"
          aria-hidden="true"
        />
      </button>

      {panel}
    </div>
  );
}
