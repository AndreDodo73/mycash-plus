import { useEffect, useId, useMemo, useState } from "react";
import iconCross from "../../assets/sidebar/icon-cross.svg";
import { useFinance } from "../../hooks";
import type { DateRange, TransactionTypeFilter } from "../../types/finance";
import {
  addMonths,
  endOfDay,
  endOfMonth,
  formatMonthYear,
  isDateInRange,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "../../utils/dateFormat";
import { ChevronIcon, ModalCloseButton, Avatar } from "../ui";

const TYPE_OPTIONS: { value: TransactionTypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Receitas" },
  { value: "expense", label: "Despesas" },
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"] as const;
const SLIDE_MS = 300;

type FiltersMobileModalProps = {
  open: boolean;
  onClose: () => void;
};

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

function orderedRange(start: Date | null, end: Date | null): DateRange | null {
  if (!start) {
    return null;
  }
  const finish = end ?? start;
  if (start.getTime() <= finish.getTime()) {
    return { startDate: startOfDay(start), endDate: endOfDay(finish) };
  }
  return { startDate: startOfDay(finish), endDate: endOfDay(start) };
}

export function FiltersMobileModal({ open, onClose }: FiltersMobileModalProps) {
  const {
    familyMembers,
    transactionType,
    selectedMember,
    dateRange,
    setTransactionType,
    setSelectedMember,
    setDateRange,
  } = useFinance();

  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  const [draftType, setDraftType] =
    useState<TransactionTypeFilter>(transactionType);
  const [draftMember, setDraftMember] = useState<string | null>(selectedMember);
  const [draftStart, setDraftStart] = useState<Date | null>(dateRange.startDate);
  const [draftEnd, setDraftEnd] = useState<Date | null>(dateRange.endDate);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(dateRange.startDate),
  );

  const days = useMemo(() => buildMonthDays(viewMonth), [viewMonth]);
  const monthLabel = formatMonthYear(viewMonth);
  const today = useMemo(() => startOfDay(new Date()), []);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraftType(transactionType);
    setDraftMember(selectedMember);
    setDraftStart(dateRange.startDate);
    setDraftEnd(dateRange.endDate);
    setViewMonth(startOfMonth(dateRange.startDate));
    setMounted(true);
    setEntered(false);

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setEntered(true));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, transactionType, selectedMember, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    if (!open || !mounted) {
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
  }, [open, mounted]);

  function requestClose() {
    if (!entered) {
      return;
    }
    setEntered(false);
    window.setTimeout(() => {
      setMounted(false);
      onClose();
    }, SLIDE_MS);
  }

  function onSelectDay(day: Date) {
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(day);
      setDraftEnd(null);
      return;
    }
    setDraftEnd(day);
  }

  function applyFilters() {
    const nextRange = orderedRange(draftStart, draftEnd);
    setTransactionType(draftType);
    setSelectedMember(draftMember);
    if (nextRange) {
      setDateRange(nextRange);
    }
    requestClose();
  }

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col lg:hidden"
      role="presentation"
    >
      <button
        type="button"
        className={[
          "absolute inset-0 bg-secondary/50 transition-opacity duration-300 ease-out",
          entered ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-label="Fechar filtros"
        onClick={requestClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          "relative z-10 flex h-dvh w-full flex-col bg-surface transition-transform duration-300 ease-out",
          entered ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-neutral-300 bg-surface px-space-16 py-space-12">
          <h2
            id={titleId}
            className="text-heading-x-small font-bold text-neutral-1100"
          >
            Filtros
          </h2>
          <ModalCloseButton
            iconSrc={iconCross}
            onClick={requestClose}
            className="size-11"
          />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-space-16 py-space-24">
          <section className="flex flex-col gap-space-12">
            <h3 className="text-label-large font-bold text-neutral-1100">
              Tipo de Transação
            </h3>
            <div className="grid grid-cols-3 gap-space-8">
              {TYPE_OPTIONS.map((option) => {
                const active = draftType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDraftType(option.value)}
                    className={[
                      "flex min-h-12 items-center justify-center rounded-shape-100 px-space-8 text-label-small font-semibold",
                      active
                        ? "bg-secondary text-surface"
                        : "border border-neutral-300 bg-surface text-neutral-1100",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-space-32 flex flex-col gap-space-12">
            <h3 className="text-label-large font-bold text-neutral-1100">
              Membro da Família
            </h3>
            <div className="flex flex-wrap gap-space-8">
              <button
                type="button"
                onClick={() => setDraftMember(null)}
                className={[
                  "flex min-h-12 items-center justify-center rounded-shape-100 px-space-16 text-label-medium font-semibold",
                  draftMember === null
                    ? "bg-secondary text-surface"
                    : "border border-neutral-300 bg-surface text-neutral-600",
                ].join(" ")}
              >
                Todos
              </button>
              {familyMembers.map((member) => {
                const active = draftMember === member.id;
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setDraftMember(member.id)}
                    className={[
                      "flex min-h-12 items-center gap-space-8 rounded-shape-100 px-space-12 text-label-medium font-semibold",
                      active
                        ? "bg-secondary text-surface"
                        : "border border-neutral-300 bg-surface text-neutral-600",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "size-8 shrink-0 overflow-hidden rounded-full",
                        active ? "border-2 border-surface" : "",
                      ].join(" ")}
                    >
                      <Avatar
                        src={member.avatarUrl}
                        width={32}
                        height={32}
                        className="size-full object-cover"
                      />
                    </span>
                    {member.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-space-32 flex flex-col gap-space-12">
            <h3 className="text-label-large font-bold text-neutral-1100">
              Período
            </h3>

            <div className="flex w-full flex-col rounded-shape-20 border border-neutral-300 bg-surface">
              <div className="flex items-center justify-between py-space-4 pr-space-12 pl-space-16">
                <p className="text-label-medium font-medium text-neutral-1100">
                  {monthLabel}
                </p>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="flex size-11 items-center justify-center rounded-full text-neutral-1100 hover:bg-neutral-100"
                    aria-label="Mês anterior"
                    onClick={() =>
                      setViewMonth((current) => addMonths(current, -1))
                    }
                  >
                    <ChevronIcon direction="left" size={14} />
                  </button>
                  <button
                    type="button"
                    className="flex size-11 items-center justify-center rounded-full text-neutral-1100 hover:bg-neutral-100"
                    aria-label="Próximo mês"
                    onClick={() =>
                      setViewMonth((current) => addMonths(current, 1))
                    }
                  >
                    <ChevronIcon direction="right" size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col px-space-12 pb-space-12">
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

                    const selectedStart =
                      draftStart && isSameDay(day, draftStart);
                    const selectedEnd = draftEnd && isSameDay(day, draftEnd);
                    const isEndpoint = Boolean(selectedStart || selectedEnd);
                    const inRange =
                      Boolean(draftStart && draftEnd) &&
                      isDateInRange(
                        day,
                        draftStart as Date,
                        draftEnd as Date,
                      ) &&
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
            </div>
          </section>
        </div>

        <footer className="shrink-0 border-t border-neutral-300 bg-surface p-space-16">
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center rounded-shape-100 bg-secondary text-label-large font-semibold text-surface"
            onClick={applyFilters}
          >
            Aplicar Filtros
          </button>
        </footer>
      </div>
    </div>
  );
}
