import { useEffect, useMemo, useRef, useState } from "react";
import iconCalendar from "../../assets/dashboard/icon-calendar.svg";
import {
  addMonths,
  endOfMonth,
  formatDate,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "../../utils/date";
import { ChevronIcon } from "./ChevronIcon";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"] as const;

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
 * (pill/campo + popover com grade de dias, primary no dia selecionado).
 */
export function DatePicker({
  value,
  onChange,
  label,
  id,
  error = false,
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value));
  const rootRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => startOfDay(new Date()), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    setViewMonth(startOfMonth(value));
  }, [open, value]);

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

  const days = useMemo(() => buildMonthDays(viewMonth), [viewMonth]);
  const monthLabel = viewMonth.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  const selected = startOfDay(value);
  const headline = selected.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div ref={rootRef} className={`relative flex w-full flex-col gap-space-8 ${className}`}>
      {label ? (
        <span
          id={id ? `${id}-label` : undefined}
          className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100"
        >
          {label}
        </span>
      ) : null}

      <button
        type="button"
        id={id}
        aria-labelledby={id && label ? `${id}-label` : undefined}
        aria-label={label ?? "Selecionar data"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
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

      {open ? (
        <div
          className="motion-dropdown absolute top-full left-0 z-50 mt-space-8 flex w-full min-w-[280px] max-w-[360px] flex-col overflow-hidden rounded-shape-20 border border-neutral-300 bg-surface shadow-md"
          role="dialog"
          aria-label="Calendário"
        >
          <div className="flex items-end gap-space-8 border-b border-neutral-300 pt-space-16 pr-space-12 pb-space-12 pl-space-24">
            <div className="flex min-w-0 flex-1 flex-col gap-space-8">
              <p className="text-label-small font-medium text-neutral-600">
                Selecionar data
              </p>
              <p className="truncate text-heading-x-small font-semibold capitalize text-neutral-1100">
                {headline}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between py-space-4 pr-space-12 pl-space-16">
            <p className="text-label-medium font-medium capitalize text-neutral-1100">
              {monthLabel}
            </p>
            <div className="flex items-center">
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-full text-neutral-1100 transition-colors hover:bg-neutral-100"
                aria-label="Mês anterior"
                onClick={() => setViewMonth((current) => addMonths(current, -1))}
              >
                <ChevronIcon direction="left" size={14} />
              </button>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-full text-neutral-1100 transition-colors hover:bg-neutral-100"
                aria-label="Próximo mês"
                onClick={() => setViewMonth((current) => addMonths(current, 1))}
              >
                <ChevronIcon direction="right" size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center px-space-12 pb-space-12">
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

                const isSelected = isSameDay(day, selected);
                const isToday = isSameDay(day, today);

                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    onClick={() => {
                      onChange(startOfDay(day));
                      setOpen(false);
                    }}
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

          <div className="flex items-center justify-between border-t border-neutral-300 px-space-12 py-space-8">
            <button
              type="button"
              className="min-h-11 rounded-shape-100 px-space-12 text-label-medium font-semibold text-neutral-1100 transition-colors hover:bg-neutral-100"
              onClick={() => {
                const next = startOfDay(new Date());
                onChange(next);
                setViewMonth(startOfMonth(next));
                setOpen(false);
              }}
            >
              Hoje
            </button>
            <button
              type="button"
              className="min-h-11 rounded-shape-100 px-space-12 text-label-medium font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-1100"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
