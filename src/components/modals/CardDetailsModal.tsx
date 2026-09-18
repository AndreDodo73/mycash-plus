import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconCross from "../../assets/sidebar/icon-cross.svg";
import { useFinance } from "../../hooks";
import { formatCurrency } from "../../utils/formatCurrency";
import { getCardUsagePercent } from "../cards/CreditCardListItem";
import { ModalCloseButton } from "../ui";

const PAGE_SIZE = 10;
const DONUT_SIZE = 120;
const DONUT_STROKE = 12;

type CardDetailsModalProps = {
  open: boolean;
  cardId: string | null;
  onClose: () => void;
  onAddExpense: (accountId: string) => void;
  onEditCard: (cardId: string) => void;
  onViewStatement: (cardId: string) => void;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function formatTxDate(date: Date): string {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function CardDetailsModal({
  open,
  cardId,
  onClose,
  onAddExpense,
  onEditCard,
  onViewStatement,
}: CardDetailsModalProps) {
  const titleId = useId();
  const navigate = useNavigate();
  const { creditCards, transactions, setTransactionType, setSearchText } =
    useFinance();
  const [page, setPage] = useState(1);
  const [closing, setClosing] = useState(false);

  const card = useMemo(
    () => creditCards.find((item) => item.id === cardId) ?? null,
    [creditCards, cardId],
  );

  const expenses = useMemo(() => {
    if (!card) {
      return [];
    }
    return transactions
      .filter((tx) => tx.type === "expense" && tx.accountId === card.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, card]);

  const totalPages = Math.max(1, Math.ceil(expenses.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = expenses.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    setPage(1);
    setClosing(false);
  }, [open, cardId]);

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

  if (!open || !card) {
    return null;
  }

  const usage = getCardUsagePercent(card);
  const usageOneDecimal =
    card.limit > 0
      ? ((card.currentInvoice / card.limit) * 100).toFixed(1)
      : "0.0";
  const available = Math.max(0, card.limit - card.currentInvoice);
  const digits = card.lastFourDigits;
  const radius = (DONUT_SIZE - DONUT_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(usage, 0), 100);
  const dashOffset = circumference * (1 - clamped / 100);

  const metrics = [
    { label: "Limite total", value: formatCurrency(card.limit) },
    { label: "Fatura atual", value: formatCurrency(card.currentInvoice) },
    { label: "Limite disponível", value: formatCurrency(available) },
    { label: "Uso do limite", value: `${usageOneDecimal}%` },
    { label: "Fechamento", value: `Dia ${pad2(card.closingDay)}` },
    { label: "Vencimento", value: `Dia ${pad2(card.dueDay)}` },
    ...(digits
      ? [{ label: "Final do cartão", value: `•••• ${digits}` }]
      : []),
  ];

  function handleViewStatement() {
    if (!card) {
      return;
    }
    setTransactionType("expense");
    setSearchText(card.name);
    onViewStatement(card.id);
    requestClose();
    navigate("/transacoes", { state: { accountId: card.id } });
  }

  return (
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
          "relative z-10 flex max-h-[95dvh] w-full flex-col rounded-t-shape-20 bg-surface shadow-lg transition-transform duration-200 md:max-h-[90dvh] md:max-w-[820px] md:rounded-shape-20",
          closing ? "translate-y-4 md:scale-95" : "translate-y-0 md:scale-100",
        ].join(" ")}
      >
        <header className="flex w-full shrink-0 items-center justify-between gap-space-16 border-b border-neutral-300 px-space-16 py-space-16 md:px-space-24">
          <div className="flex min-w-0 flex-col gap-space-4">
            <h2
              id={titleId}
              className="truncate text-heading-small font-bold text-neutral-1100 md:text-heading-medium"
            >
              {card.name}
            </h2>
            <p className="text-label-medium tracking-[0.3px] text-neutral-600">
              Detalhes do cartão
              {digits ? ` · **** ${digits}` : ""}
            </p>
          </div>
          <ModalCloseButton iconSrc={iconCross} onClick={requestClose} />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-space-16 py-space-24 md:px-space-24">
          <div className="flex w-full flex-col gap-space-24">
            <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-[minmax(0,1fr)_160px] lg:items-center">
              <div className="grid w-full grid-cols-1 gap-space-12 sm:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex min-w-0 flex-col gap-space-4 rounded-shape-20 border border-neutral-300 bg-surface p-space-16"
                  >
                    <span className="text-label-small font-semibold tracking-[0.3px] text-neutral-600">
                      {metric.label}
                    </span>
                    <span className="truncate text-label-large font-bold tracking-[0.3px] text-neutral-1100 tabular-nums">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-space-8">
                <div
                  className="relative flex size-[120px] items-center justify-center"
                  aria-label={`Uso do limite ${usageOneDecimal}%`}
                >
                  <svg
                    width={DONUT_SIZE}
                    height={DONUT_SIZE}
                    viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
                    className="absolute inset-0 -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx={DONUT_SIZE / 2}
                      cy={DONUT_SIZE / 2}
                      r={radius}
                      fill="none"
                      stroke="var(--color-secondary-50)"
                      strokeWidth={DONUT_STROKE}
                    />
                    <circle
                      cx={DONUT_SIZE / 2}
                      cy={DONUT_SIZE / 2}
                      r={radius}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth={DONUT_STROKE}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <span className="relative z-10 text-label-large font-bold text-neutral-1100">
                    {usageOneDecimal}%
                  </span>
                </div>
                <span className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-600">
                  Uso do limite
                </span>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-shape-100 bg-neutral-200">
              <div
                className="motion-progress-bar h-full rounded-shape-100 bg-primary"
                style={{ width: `${clamped}%` }}
              />
            </div>

            <section className="flex w-full flex-col gap-space-16" aria-label="Despesas do cartão">
              <h3 className="text-heading-x-small font-bold text-neutral-1100">
                Despesas deste cartão
              </h3>

              {expenses.length === 0 ? (
                <p className="rounded-shape-20 border border-neutral-300 bg-background px-space-16 py-space-24 text-center text-paragraph-small text-neutral-600">
                  Nenhuma despesa registrada neste cartão ainda.
                </p>
              ) : (
                <>
                  <div className="hidden w-full overflow-x-auto md:block">
                    <table className="w-full min-w-[560px] border-collapse text-left">
                      <thead>
                        <tr className="bg-neutral-100 text-label-small font-semibold tracking-[0.3px] text-neutral-600">
                          <th className="rounded-l-shape-20 px-space-16 py-space-12">
                            Data
                          </th>
                          <th className="px-space-16 py-space-12">Descrição</th>
                          <th className="px-space-16 py-space-12">Categoria</th>
                          <th className="px-space-16 py-space-12">Parcelas</th>
                          <th className="rounded-r-shape-20 px-space-16 py-space-12 text-right">
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageItems.map((tx, index) => (
                          <tr
                            key={tx.id}
                            className={
                              index % 2 === 0 ? "bg-surface" : "bg-neutral-100"
                            }
                          >
                            <td className="px-space-16 py-space-12 text-paragraph-small text-neutral-1100">
                              {formatTxDate(tx.date)}
                            </td>
                            <td className="px-space-16 py-space-12 text-paragraph-small text-neutral-1100">
                              {tx.description}
                            </td>
                            <td className="px-space-16 py-space-12 text-paragraph-small text-neutral-600">
                              {tx.category}
                            </td>
                            <td className="px-space-16 py-space-12 text-paragraph-small text-neutral-1100">
                              {tx.installments > 1
                                ? `${tx.installments}x`
                                : "À vista"}
                            </td>
                            <td className="px-space-16 py-space-12 text-right text-paragraph-small font-semibold text-red-600 tabular-nums">
                              -{formatCurrency(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="flex w-full flex-col gap-space-12 md:hidden">
                    {pageItems.map((tx) => (
                      <li
                        key={tx.id}
                        className="flex w-full flex-col gap-space-8 rounded-shape-20 border border-neutral-300 bg-surface p-space-16"
                      >
                        <div className="flex items-start justify-between gap-space-8">
                          <span className="min-w-0 font-semibold text-label-medium text-neutral-1100">
                            {tx.description}
                          </span>
                          <span className="shrink-0 text-label-medium font-semibold text-red-600 tabular-nums">
                            -{formatCurrency(tx.amount)}
                          </span>
                        </div>
                        <p className="text-paragraph-x-small text-neutral-600">
                          {formatTxDate(tx.date)} · {tx.category} ·{" "}
                          {tx.installments > 1
                            ? `${tx.installments}x`
                            : "À vista"}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {totalPages > 1 ? (
                    <div className="flex flex-wrap items-center justify-between gap-space-8">
                      <p className="text-paragraph-x-small text-neutral-600">
                        Mostrando {(safePage - 1) * PAGE_SIZE + 1} a{" "}
                        {Math.min(safePage * PAGE_SIZE, expenses.length)} de{" "}
                        {expenses.length}
                      </p>
                      <div className="flex items-center gap-space-8">
                        <button
                          type="button"
                          className="flex min-h-11 items-center justify-center rounded-shape-100 border border-neutral-300 px-space-16 text-label-small font-semibold disabled:opacity-40"
                          disabled={safePage <= 1}
                          onClick={() => setPage((current) => current - 1)}
                        >
                          Anterior
                        </button>
                        <span className="text-label-small font-semibold text-neutral-1100">
                          {safePage} / {totalPages}
                        </span>
                        <button
                          type="button"
                          className="flex min-h-11 items-center justify-center rounded-shape-100 border border-neutral-300 px-space-16 text-label-small font-semibold disabled:opacity-40"
                          disabled={safePage >= totalPages}
                          onClick={() => setPage((current) => current + 1)}
                        >
                          Próxima
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </section>
          </div>
        </div>

        <footer className="flex w-full shrink-0 flex-col gap-space-8 border-t border-neutral-300 px-space-16 py-space-16 md:flex-row md:flex-wrap md:justify-end md:gap-space-12 md:px-space-24">
          <button
            type="button"
            className="motion-tap flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-1100 bg-transparent px-space-16 text-label-medium font-bold tracking-[0.3px] text-neutral-1100 hover:bg-neutral-100"
            onClick={handleViewStatement}
          >
            Ver Extrato Completo
          </button>
          <button
            type="button"
            className="motion-tap flex min-h-12 items-center justify-center gap-space-8 rounded-shape-100 border border-neutral-1100 bg-transparent px-space-16 text-label-medium font-bold tracking-[0.3px] text-neutral-1100 hover:bg-neutral-100"
            onClick={() => {
              onAddExpense(card.id);
              requestClose();
            }}
          >
            Adicionar Despesa
          </button>
          <button
            type="button"
            className="motion-tap flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-1100 bg-transparent px-space-16 text-label-medium font-bold tracking-[0.3px] text-neutral-1100 hover:bg-neutral-100"
            onClick={() => {
              onEditCard(card.id);
              requestClose();
            }}
          >
            Editar Cartão
          </button>
          <button
            type="button"
            className="motion-tap flex min-h-12 items-center justify-center rounded-shape-100 bg-neutral-1100 px-space-24 text-label-medium font-bold tracking-[0.3px] text-surface hover:bg-secondary"
            onClick={requestClose}
          >
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}
