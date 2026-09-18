import { useId, useState } from "react";
import { useFinance } from "../../hooks";
import type { CategoryDef, TransactionType } from "../../types/finance";
import {
  buildFinanceExportJson,
  downloadFinanceCsv,
  downloadFinanceJson,
} from "../../utils/exportFinanceData";
import { CategoryFormModal } from "./CategoryFormModal";
import { SettingsToggle } from "./SettingsToggle";

type NotificationKey =
  | "billReminder"
  | "cardLimitAlert"
  | "monthlyEmail"
  | "goalReached";

type CategoryModalState = {
  kind: TransactionType;
  editing: CategoryDef | null;
} | null;

type ExportFormat = "json" | "csv";

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.333 2.333a1.414 1.414 0 0 1 2 2L5.5 12.167 2.667 13l.833-2.833L11.333 2.333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 3.667 12.333 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.667 4h10.666M6 4V2.667h4V4M12.667 4v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.667 7.333v4M9.333 7.333v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function resolveAccountLabel(
  accountId: string,
  bankAccounts: { id: string; name: string }[],
  creditCards: { id: string; name: string }[],
): string {
  return (
    bankAccounts.find((item) => item.id === accountId)?.name ??
    creditCards.find((item) => item.id === accountId)?.name ??
    "Desconhecido"
  );
}

export function ProfileSettingsTab() {
  const {
    transactions,
    goals,
    creditCards,
    bankAccounts,
    familyMembers,
    incomeCategories,
    expenseCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    clearAllData,
  } = useFinance();

  const darkModeId = useId();
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    billReminder: true,
    cardLimitAlert: true,
    monthlyEmail: false,
    goalReached: true,
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");
  const [categoryModal, setCategoryModal] = useState<CategoryModalState>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  function toggleNotification(key: NotificationKey) {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function handleExport() {
    if (exportFormat === "json") {
      downloadFinanceJson(
        buildFinanceExportJson({
          transactions,
          goals,
          creditCards,
          bankAccounts,
          familyMembers,
          incomeCategories,
          expenseCategories,
        }),
      );
      return;
    }

    downloadFinanceCsv(transactions, {
      memberName: (memberId) =>
        familyMembers.find((member) => member.id === memberId)?.name ?? "—",
      accountName: (accountId) =>
        resolveAccountLabel(accountId, bankAccounts, creditCards),
    });
  }

  function handleClearData() {
    clearAllData();
    setConfirmClear(false);
  }

  function openAddCategory(kind: TransactionType) {
    setCategoryModal({ kind, editing: null });
  }

  function openEditCategory(category: CategoryDef) {
    setCategoryModal({ kind: category.kind, editing: category });
  }

  function handleSaveCategory(input: {
    name: string;
    color: string;
    kind: TransactionType;
  }) {
    if (categoryModal?.editing) {
      updateCategory(input.kind, categoryModal.editing.name, {
        name: input.name,
        color: input.color,
      });
      return;
    }
    addCategory(input);
  }

  function renderCategoryList(categories: CategoryDef[], kind: TransactionType) {
    const emptyLabel =
      kind === "income"
        ? "Nenhuma categoria de receita."
        : "Nenhuma categoria de despesa.";

    if (categories.length === 0) {
      return (
        <p className="text-paragraph-small text-neutral-600">{emptyLabel}</p>
      );
    }

    return (
      <ul className="flex w-full flex-col gap-space-8">
        {categories.map((category) => (
          <li
            key={`${kind}-${category.name}`}
            className="group flex min-h-12 w-full items-center gap-space-12 rounded-shape-20 bg-neutral-100 px-space-16 py-space-8"
          >
            <span
              className="size-3 shrink-0 rounded-shape-100"
              style={{ backgroundColor: category.color }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-label-medium tracking-[0.3px] text-neutral-1100">
              {category.name}
            </span>
            <div className="flex shrink-0 items-center gap-space-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              <button
                type="button"
                aria-label={`Editar ${category.name}`}
                onClick={() => openEditCategory(category)}
                className="flex size-11 items-center justify-center rounded-shape-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-1100"
              >
                <EditIcon />
              </button>
              <button
                type="button"
                aria-label={`Excluir ${category.name}`}
                onClick={() => deleteCategory(kind, category.name)}
                className="flex size-11 items-center justify-center rounded-shape-100 text-neutral-600 transition-colors hover:bg-red-100 hover:text-red-600"
              >
                <TrashIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  const existingNamesForModal =
    categoryModal?.kind === "income"
      ? incomeCategories.map((item) => item.name)
      : expenseCategories.map((item) => item.name);

  return (
    <div className="flex w-full flex-col gap-space-24">
      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-2">
        <section className="flex w-full flex-col gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Preferências de Exibição
          </h2>

          <SettingsToggle
            id={darkModeId}
            label="Modo Escuro"
            checked={false}
            disabled
            badge="Em breve"
            onChange={() => undefined}
          />

          <div className="flex flex-col gap-space-8">
            <label
              htmlFor="settings-currency"
              className="text-label-small font-semibold tracking-[0.3px] text-neutral-600"
            >
              Moeda padrão
            </label>
            <select
              id="settings-currency"
              disabled
              defaultValue="BRL"
              className="min-h-12 w-full appearance-none rounded-shape-20 border border-neutral-300 bg-neutral-100 px-space-16 text-base text-neutral-600"
            >
              <option value="BRL">Real Brasileiro (R$)</option>
            </select>
          </div>

          <div className="flex flex-col gap-space-8">
            <label
              htmlFor="settings-date-format"
              className="text-label-small font-semibold tracking-[0.3px] text-neutral-600"
            >
              Formato de data
            </label>
            <select
              id="settings-date-format"
              disabled
              defaultValue="BR"
              className="min-h-12 w-full appearance-none rounded-shape-20 border border-neutral-300 bg-neutral-100 px-space-16 text-base text-neutral-600"
            >
              <option value="BR">DD/MM/AAAA</option>
            </select>
          </div>
        </section>

        <section className="flex w-full flex-col gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Notificações
          </h2>

          <SettingsToggle
            id="notif-bill"
            label="Lembrete de vencimento de contas"
            checked={notifications.billReminder}
            onChange={() => toggleNotification("billReminder")}
          />
          <SettingsToggle
            id="notif-card"
            label="Alerta de aproximação do limite de cartão"
            checked={notifications.cardLimitAlert}
            onChange={() => toggleNotification("cardLimitAlert")}
          />
          <SettingsToggle
            id="notif-email"
            label="Resumo mensal por email"
            checked={notifications.monthlyEmail}
            onChange={() => toggleNotification("monthlyEmail")}
          />
          <SettingsToggle
            id="notif-goal"
            label="Notificações de novos objetivos alcançados"
            checked={notifications.goalReached}
            onChange={() => toggleNotification("goalReached")}
          />
        </section>
      </div>

      <section className="flex w-full flex-col gap-space-24 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
        <h2 className="text-heading-x-small font-bold text-neutral-1100">
          Gerenciar Categorias
        </h2>

        <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-2">
          <div className="flex w-full flex-col gap-space-12">
            <div className="flex flex-wrap items-center justify-between gap-space-8">
              <h3 className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                Categorias de Receita
              </h3>
              <button
                type="button"
                onClick={() => openAddCategory("income")}
                className="flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-1100 px-space-16 text-label-medium font-semibold text-neutral-1100"
              >
                Adicionar Categoria
              </button>
            </div>
            {renderCategoryList(incomeCategories, "income")}
          </div>

          <div className="flex w-full flex-col gap-space-12">
            <div className="flex flex-wrap items-center justify-between gap-space-8">
              <h3 className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
                Categorias de Despesa
              </h3>
              <button
                type="button"
                onClick={() => openAddCategory("expense")}
                className="flex min-h-12 items-center justify-center rounded-shape-100 border border-neutral-1100 px-space-16 text-label-medium font-semibold text-neutral-1100"
              >
                Adicionar Categoria
              </button>
            </div>
            {renderCategoryList(expenseCategories, "expense")}
          </div>
        </div>
      </section>

      <div className="grid w-full grid-cols-1 gap-space-24 lg:grid-cols-2">
        <section className="flex w-full flex-col gap-space-16 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Dados e Privacidade
          </h2>

          <div className="flex flex-col gap-space-8">
            <label
              htmlFor="export-format"
              className="text-label-small font-semibold tracking-[0.3px] text-neutral-600"
            >
              Formato de exportação
            </label>
            <select
              id="export-format"
              value={exportFormat}
              onChange={(event) =>
                setExportFormat(event.target.value as ExportFormat)
              }
              className="min-h-12 w-full rounded-shape-20 border border-neutral-300 bg-surface px-space-16 text-base text-neutral-1100"
            >
              <option value="json">JSON (backup completo)</option>
              <option value="csv">CSV (transações)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="flex min-h-12 w-full items-center justify-center rounded-shape-100 border border-neutral-1100 px-space-24 text-label-medium font-semibold text-neutral-1100"
          >
            Exportar Todos os Dados
          </button>

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="flex min-h-12 w-full items-center justify-center rounded-shape-100 bg-red-600 px-space-24 text-label-medium font-semibold text-surface transition-colors hover:bg-red-700"
            >
              Limpar Todos os Dados
            </button>
          ) : (
            <div className="flex flex-col gap-space-12 rounded-shape-20 bg-red-100 p-space-16">
              <p className="text-paragraph-small text-neutral-1100">
                Tem certeza? Todos os dados em memória serão apagados.
              </p>
              <div className="flex flex-col gap-space-8 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="flex min-h-12 flex-1 items-center justify-center rounded-shape-100 border border-neutral-300 bg-surface px-space-16 text-label-medium font-semibold text-neutral-1100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleClearData}
                  className="flex min-h-12 flex-1 items-center justify-center rounded-shape-100 bg-red-600 px-space-16 text-label-medium font-semibold text-surface"
                >
                  Confirmar limpeza
                </button>
              </div>
            </div>
          )}

          <p className="text-label-small tracking-[0.3px] text-neutral-600">
            Esta ação não pode ser desfeita
          </p>
        </section>

        <section className="flex w-full flex-col gap-space-12 rounded-shape-20 border border-neutral-300 bg-surface p-space-24">
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Sobre o mycash+
          </h2>
          <p className="text-label-large font-semibold tracking-[0.3px] text-neutral-1100">
            v1.0.0
          </p>
          <p className="text-paragraph-small text-neutral-600">
            Sistema de gestão financeira familiar
          </p>
          <div className="flex flex-col gap-space-8 pt-space-8">
            <a
              href="#termos"
              className="text-label-medium font-semibold tracking-[0.3px] text-neutral-1100 underline-offset-2 hover:underline"
            >
              Termos de Uso
            </a>
            <a
              href="#privacidade"
              className="text-label-medium font-semibold tracking-[0.3px] text-neutral-1100 underline-offset-2 hover:underline"
            >
              Política de Privacidade
            </a>
          </div>
        </section>
      </div>

      {categoryModal ? (
        <CategoryFormModal
          open
          kind={categoryModal.kind}
          editing={categoryModal.editing}
          existingNames={existingNamesForModal}
          onClose={() => setCategoryModal(null)}
          onSave={handleSaveCategory}
        />
      ) : null}
    </div>
  );
}
