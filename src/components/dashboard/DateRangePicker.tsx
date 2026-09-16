import { useEffect, useMemo, useRef, useState } from "react";
import iconCalendar from "../../assets/dashboard/icon-calendar.svg";
import type { DateRange } from "../../types/finance";
import {
  addMonths,
  endOfDay,
  endOfMonth,
  formatDateRangeLabel,
  isDateInRange,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "../../utils/dateFormat";

type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

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

function formatHeadline(start: Date | null, end: Date | null): string {
  if (start && end) {
    return formatDateRangeLabel(start, end);
  }
  if (start) {
    return start.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
  return "Selecionar período";
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value.startDate));
  const [draftStart, setDraftStart] = useState<Date | null>(value.startDate);
  const [draftEnd, setDraftEnd] = useState<Date | null>(value.endDate);
  const rootRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => startOfDay(new Date()), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    setDraftStart(value.startDate);
    setDraftEnd(value.endDate);
    setViewMonth(startOfMonth(value.startDate));
  }, [open, value.startDate, value.endDate]);

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

  function orderedDraft(): DateRange | null {
    if (!draftStart) {
      return null;
    }
    const end = draftEnd ?? draftStart;
    if (draftStart.getTime() <= end.getTime()) {
      return { startDate: startOfDay(draftStart), endDate: endOfDay(end) };
    }
    return { startDate: startOfDay(end), endDate: endOfDay(draftStart) };
  }

  function onSelectDay(day: Date) {
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(day);
      setDraftEnd(null);
      return;
    }
    setDraftEnd(day);
  }

  function clearDraft() {
    setDraftStart(null);
    setDraftEnd(null);
  }

  function confirmDraft() {
    const next = orderedDraft();
    if (!next) {
      return;
    }
    onChange(next);
    setOpen(false);
  }

  const label = formatDateRangeLabel(value.startDate, value.endDate);
  const headline = formatHeadline(draftStart, draftEnd);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex min-h-12 w-full shrink-0 items-center justify-center gap-space-8 rounded-shape-100 border border-neutral-1100 bg-surface px-space-24 py-space-12 whitespace-nowrap sm:w-auto"
      >
        <img
          src={iconCalendar}
          alt=""
          width={16}
          height={16}
          className="size-space-16"
          aria-hidden="true"
        />
        <span className="text-paragraph-small tracking-[0.3px] text-neutral-1100 whitespace-nowrap">
          {label}
        </span>
      </button>

      {open ? (
        <div
          className="absolute top-full left-0 z-40 mt-space-8 flex w-[min(100vw-2rem,360px)] flex-col overflow-hidden rounded-shape-20 border border-neutral-300 bg-surface shadow-sm"
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
            <p className="text-label-medium font-medium capitalize text-neutral-1100">
              {monthLabel}
            </p>
            <div className="flex items-center">
              <button
                type="button"
                className="flex size-space-32 items-center justify-center rounded-shape-100 text-label-large text-neutral-1100"
                aria-label="Mês anterior"
                onClick={() => setViewMonth((current) => addMonths(current, -1))}
              >
                ‹
              </button>
              <button
                type="button"
                className="flex size-space-32 items-center justify-center rounded-shape-100 text-label-large text-neutral-1100"
                aria-label="Próximo mês"
                onClick={() => setViewMonth((current) => addMonths(current, 1))}
              >
                ›
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

                const selectedStart = draftStart && isSameDay(day, draftStart);
                const selectedEnd = draftEnd && isSameDay(day, draftEnd);
                const isEndpoint = Boolean(selectedStart || selectedEnd);
                const inRange =
                  Boolean(draftStart && draftEnd) &&
                  isDateInRange(day, draftStart as Date, draftEnd as Date) &&
                  !isEndpoint;
                const isToday = isSameDay(day, today);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => onSelectDay(day)}
                    className={[
                      "flex h-12 items-center justify-center text-paragraph-small text-neutral-1100",
                      inRange ? "bg-secondary-50" : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex size-10 items-center justify-center rounded-shape-100",
                        isEndpoint
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
              className="min-h-10 px-space-12 text-label-medium font-semibold text-neutral-1100"
              onClick={clearDraft}
            >
              Limpar
            </button>
            <div className="flex items-center gap-space-8">
              <button
                type="button"
                className="min-h-10 px-space-12 text-label-medium font-semibold text-neutral-1100"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="min-h-10 px-space-12 text-label-medium font-semibold text-neutral-1100 disabled:opacity-40"
                disabled={!draftStart}
                onClick={confirmDraft}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
