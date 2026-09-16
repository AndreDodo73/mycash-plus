import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import iconChartFlow from "../../assets/dashboard/icon-chart-flow.svg";
import {
  FINANCIAL_FLOW_MOCK,
  type MonthlyFlowPoint,
} from "../../data/financialFlowMock";
import { useChartHeight } from "../../hooks/useChartHeight";
import { formatCurrency } from "../../utils/formatCurrency";

const INCOME_COLOR = "var(--color-primary)";
const EXPENSE_COLOR = "var(--color-red-600)";
const AXIS_COLOR = "var(--color-neutral-1100)";
const GRID_COLOR = "var(--color-neutral-300)";

/** Escala do Figma (`42:3136`): R$ 0,00 → R$ 17.500 em passos de R$ 2.500. */
const Y_AXIS_MAX = 17_500;
const Y_AXIS_STEP = 2_500;
const Y_AXIS_TICKS = Array.from(
  { length: Y_AXIS_MAX / Y_AXIS_STEP + 1 },
  (_, index) => index * Y_AXIS_STEP,
);

function formatAxisCurrency(value: number): string {
  if (value === 0) {
    return "R$ 0,00";
  }
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

type FlowTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: MonthlyFlowPoint }>;
};

function FlowTooltip({ active, payload }: FlowTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;
  if (!point) {
    return null;
  }

  return (
    <div className="rounded-shape-20 border border-neutral-300 bg-surface px-space-12 py-space-8 shadow-sm">
      <p className="mb-space-4 text-label-small font-bold text-neutral-1100">
        {point.monthFull}
      </p>
      <p className="text-paragraph-x-small text-green-700">
        Receitas: {formatCurrency(point.income)}
      </p>
      <p className="text-paragraph-x-small text-neutral-1100">
        Despesas: {formatCurrency(point.expense)}
      </p>
    </div>
  );
}

export function FinancialFlowChart() {
  const chartHeight = useChartHeight();
  const data = FINANCIAL_FLOW_MOCK;

  return (
    <section
      className="flex w-full min-w-0 flex-col gap-space-24 rounded-shape-20 border border-neutral-300 bg-surface p-space-16 md:gap-space-32 md:p-space-24 lg:p-space-32"
      aria-label="Fluxo financeiro"
    >
      <header className="flex w-full min-w-0 flex-col gap-space-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-space-8">
          <img
            src={iconChartFlow}
            alt=""
            width={24}
            height={24}
            className="size-space-24 shrink-0"
            aria-hidden="true"
          />
          <h2 className="truncate text-heading-x-small font-bold text-neutral-1100">
            Fluxo financeiro
          </h2>
        </div>

        <ul className="flex shrink-0 items-center gap-space-8">
          <li className="flex items-center gap-space-8">
            <span
              className="size-[9px] shrink-0 rounded-shape-100 bg-primary"
              aria-hidden="true"
            />
            <span className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
              Receitas
            </span>
          </li>
          <li className="flex items-center gap-space-8">
            <span
              className="size-[9px] shrink-0 rounded-shape-100 bg-red-600"
              aria-hidden="true"
            />
            <span className="text-label-x-small font-semibold tracking-[0.3px] text-neutral-1100">
              Despesas
            </span>
          </li>
        </ul>
      </header>

      <div
        className="w-full min-w-0 overflow-hidden rounded-shape-20 bg-neutral-100"
        style={{ height: chartHeight, maxHeight: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INCOME_COLOR} stopOpacity={0.3} />
                <stop offset="100%" stopColor={INCOME_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={EXPENSE_COLOR} stopOpacity={0.15} />
                <stop offset="100%" stopColor={EXPENSE_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke={GRID_COLOR}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fill: AXIS_COLOR, fontSize: 12, fontWeight: 600 }}
              interval="preserveStartEnd"
              minTickGap={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={88}
              ticks={Y_AXIS_TICKS}
              tickFormatter={formatAxisCurrency}
              tick={{
                fill: AXIS_COLOR,
                fontSize: 14,
                letterSpacing: 0.3,
              }}
              domain={[0, Y_AXIS_MAX]}
              allowDataOverflow
            />
            <Tooltip
              content={FlowTooltip}
              cursor={{
                stroke: "var(--color-neutral-400)",
                strokeWidth: 1,
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Receitas"
              stroke={INCOME_COLOR}
              strokeWidth={3}
              fill="url(#incomeFill)"
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Despesas"
              stroke={EXPENSE_COLOR}
              strokeWidth={3}
              fill="url(#expenseFill)"
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
