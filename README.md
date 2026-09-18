# Mycash+

Dashboard de gestão financeira familiar — controle de contas, cartões, transações, objetivos e perfil em uma interface responsiva.

## Objetivo

Permitir que uma família acompanhe saldo, receitas, despesas, faturas de cartão e metas de poupança, com filtros por membro e período, em desktop e mobile.

## Tecnologias

- [React](https://react.dev/) 19 + TypeScript
- [Vite](https://vite.dev/) 8
- [Tailwind CSS](https://tailwindcss.com/) 4
- [React Router](https://reactrouter.com/) 7
- [Recharts](https://recharts.org/) (fluxo financeiro)
- Dados mock locais (preparado para [Supabase](https://supabase.com/) no futuro)

## Como instalar

```bash
npm install
```

## Como rodar

```bash
npm run dev      # desenvolvimento (Vite)
npm run build    # typecheck + build de produção
npm run preview  # preview do build
npm run lint     # oxlint
npm run validate:utils  # smoke asserts de cálculos/filtros/formatação
```

Abra a URL indicada pelo Vite (em geral `http://localhost:5173`).

## Estrutura de pastas

```
src/
  assets/          # ícones, logos, imagens de objetivos
  components/
    cards/         # cartões, contas, widget da Home
    dashboard/     # home: resumo, filtros, gráficos, extrato, despesas
    goals/         # objetivos (cards, seções, view)
    layout/        # AppShell, Sidebar, Header Mobile, PageTransition
    modals/        # transação, membro, conta/cartão, objetivo, filtros
    profile/       # perfil, configurações, categorias
    ui/            # ChevronIcon, FilterSelect, ModalCloseButton, Skeleton
  constants/       # rotas, motion, imagens de objetivos, breakpoints
  contexts/        # FinanceContext + cálculos
  data/            # mockFinance
  hooks/           # useFinance, useCountUp, …
  pages/           # páginas por rota
  styles/          # tokens.css, motion.css
  types/           # entidades financeiras
  utils/           # currency, date, array, finance, validation, export
```

## Seções principais

| Rota | Label | Responsabilidade |
|------|-------|------------------|
| `/` | Home | Dashboard com resumo, fluxo, categorias, cartões, despesas, extrato |
| `/objetivos` | Objetivos | Metas ativas/concluídas e CRUD |
| `/cartoes` | Contas e Cartões | Grid de cartões + contas bancárias |
| `/transacoes` | Transações | Extrato com filtros avançados e CSV |
| `/perfil` | Perfil | Informações do usuário/família + Configurações |

## Componentes-chave

- **AppShell** — layout fluido; Sidebar só em `≥1280px`; Header Mobile abaixo disso
- **FinanceContext (`useFinance`)** — estado global (transações, cartões, contas, filtros, CRUD)
- **SummaryCards / FinancialFlowChart / ExpensesByCategoryCarousel** — visão financeira da Home
- **TransactionsTable / TransactionCard** — extrato (tabela no desktop, cards no mobile)
- **CreditCardOverviewCard / BankAccountOverviewCard** — view Contas e Cartões
- **GoalsView / GoalCard / AddGoalModal** — objetivos
- **ProfileView / ProfileSettingsTab** — perfil e preferências

## Breakpoints oficiais

| Nome | Largura |
|------|---------|
| Mobile | `< 768px` |
| Tablet | `≥ 768px` e `< 1280px` |
| Desktop | `≥ 1280px` e `< 1920px` |
| Wide | `≥ 1920px` |

Sidebar **não** renderiza abaixo de 1280px (navegação via Header Mobile).

## Formatação

- Moeda: `R$ 1.234,56` (`pt-BR`)
- Data: `dd/mm/aaaa`
- Percentuais: uma casa decimal quando aplicável

## Decisões de design (não óbvias)

- Item ativo da nav: pill **lime** (`primary`), alinhado ao Figma (não fundo preto do texto antigo do spec)
- Tema do cartão afeta ícone/badge — a borda do card permanece neutra no hover
- Selects customizados (`FilterSelect`) evitam o menu nativo azul do SO
- Chevrons usam stroke reto (`butt`/`miter`); o círculo fica no botão, não no ícone
- Toggle ligado em Configurações usa `primary` (lime)
- Breakpoint da sidebar: **1280px** (texto antigo do Prompt 24 citava 1024 — ignorar)

## Validação (Prompt 24)

Ver checklist em [`docs/validacao-prompt-24.md`](docs/validacao-prompt-24.md).

## Próximos passos

- Integração com Supabase (auth + persistência)
- Testes E2E (Playwright) se necessário
- Code-splitting do bundle (~1 MB JS principal hoje)
