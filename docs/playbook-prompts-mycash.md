# Playbook de execução — mycash+

Guia de implementação dos prompts 1–24 e do Prompt Final. Use este arquivo **antes** de cada prompt. O texto original dos prompts continua em [`sequencia-prompts-mycash.md`](sequencia-prompts-mycash.md).

## Fontes de verdade

| Assunto | Fonte |
|---|---|
| Como parece (layout, cor, tipo, space) | Figma Home [`42:3096`](https://www.figma.com/design/Ge7zSB1zC6baUJFqrpGN09/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=42-3096) |
| Como funciona (filtro, CRUD, cálculo, modal) | [`documento-descritivo-mycash.md`](documento-descritivo-mycash.md) |
| Tokens primitivos | [`tokens-primitivos.md`](tokens-primitivos.md) |
| O que fazer neste prompt | este playbook + sequência original |
| Progresso no código | [`DOCUMENTATION.md`](DOCUMENTATION.md) |

Hierarquia de tokens: **semântica → primitiva → conversão**. Nunca hex/px soltos.

## Regras globais

1. Visual = Figma. Comportamento = spec.
2. Um prompt por vez. `npm run build` até passar. Parar e esperar “Fazer commit e documentar” ou “Próximo”.
3. Estado só em React (`useState` / `useReducer`). Sem `localStorage`, `sessionStorage` ou qualquer browser storage.
4. Layout fluido: containers de página com `width: 100%`. Limite de leitura só com `max-width`. Overflow horizontal proibido.
5. Sidebar **não** usa `display: none` no mobile: simplesmente não renderiza.
6. Não inventar seção, campo ou fluxo que não esteja no spec ou no Figma.

## Breakpoints oficiais

Os prompts 1–3 e 24 citam 640 / 1024. **Não usar.** Vale o Prompt 23 + Project Rules:

| Nome | Largura | Tailwind neste projeto |
|---|---|---|
| Mobile (base) | `< 768px` | base |
| Tablet | `≥ 768px` e `< 1280px` | `md` |
| Desktop | `≥ 1280px` e `< 1920px` | `xl` |
| Wide / 4K | `≥ 1920px` | `2xl` |

Navegação:

- **≥ 1280px:** só `Sidebar` (empurra o `main`; estados expandido 300px / colapsado 80px no Figma).
- **< 1280px:** só `HeaderMobile` + menu overlay/dropdown. Sidebar não existe.

Padding do `main`: `px-space-16` → `md:px-space-24` → `xl:px-space-32`. Leitura: `max-w-[1400px]` desktop, `max-w-[1600px]` wide, `mx-auto`.

Larguras “fixas” dos prompts (160px donut, 256px search, 300px gráfico, 500–700px modal) viram `max-width` / token, nunca `width` de página.

## Arquitetura real (canônica)

O Prompt 0 citou `src/app` e `src/context`. O código do Prompt 1 usa isto — **siga daqui para frente:**

```text
src/
  components/
    layout/      # AppShell, Sidebar, HeaderMobile
    dashboard/   # resumo, carrossel, fluxo, extrato, header
    cards/       # widget e cards da view Cartões
    modals/
    ui/
  contexts/      # FinanceProvider / useFinance
  hooks/
  types/
  utils/
  constants/
  pages/         # só composição; sem lógica de negócio
  styles/        # tokens.css
```

## Tabela de conflitos e decisões oficiais

| Tema | Prompt / spec | Figma / rules | Decisão |
|---|---|---|---|
| Sidebar some em | 1024 (P2, P3, P24) | 1280 (P23, rule 04) | **1280** |
| Item ativo da nav | fundo preto, texto branco, ícone lime (P2, spec) | pill lime no Figma | **Figma** (visual) |
| Card Saldo Total | fundo preto (P5, spec) | card branco, valor `--color-blue-600` | **Figma** (visual); cálculo do spec |
| Extrato | 5 linhas (P11) | 3 linhas visíveis + “1 a 5 de 17” | **5 por página** (comportamento); visual da tabela = Figma |
| `#3247FF` (P12) | hex solto | tokens | `--color-blue-600` |
| Recharts (P8) | sugere lib | “não adicionar dep sem pedido” | **permitida neste prompt** |
| Framer Motion (P21) | “ou CSS” | mesma regra de deps | **CSS primeiro**; Framer só com autorização |
| date-fns / uuid (P22) | pede libs | Intl + `crypto.randomUUID` | **sem lib nova** |
| Export PDF (P18) | CSV ou PDF | fora do MVP visual | **só CSV** |
| View Objetivos | rota + tipo `Goal` + spec | **não há prompt** | Gap: **não inventar UI** até prompt extra ou ordem explícita |

## Gap de produto: Objetivos

A sequência cria a rota `/objetivos`, o tipo `Goal` e mock no P4. O spec descreve widget no dashboard e view completa. **Nenhum prompt implementa essa UI.**

Não construir `GoalsView` nem o grid de objetivos até:

- um prompt extra, ou
- o usuário pedir para incluir no padrão do Prompt 17 (`CardsView`).

A página placeholder de `/objetivos` pode permanecer até lá.

## Ordem prática (não muda a numeração)

- **P5:** criar `formatCurrency` em `src/utils/` na hora do primeiro `R$`. O P22 completa o restante.
- **P6:** no mobile, o botão de filtros só abre o gatilho. O modal em si é o **P16**.
- **P2/P3:** corrigir `BREAKPOINTS.desktopMin` de 1024 para **1280**.

## Ciclo de cada prompt

1. Reler rules + este playbook + spec + Figma.
2. Executar **só** o prompt atual.
3. `npm run build` até passar.
4. Atualizar `DOCUMENTATION.md`.
5. Parar. Commit só se pedido.

---

## PROMPT 1 — Estrutura base e configuração

**Status:** feito. Auditoria em [`DOCUMENTATION.md`](DOCUMENTATION.md).

**Objetivo.** Scaffold Vite + React + TS + Tailwind, pastas por domínio, tokens no `@theme`, tipos das 5 entidades, 5 rotas SPA.

**Desktop ≥1280.** Shell com faixa de nav à esquerda (placeholder até o P2) + `main` fluido. Só o `Outlet` muda.

**Tablet 768–1279.** Sem sidebar. Header placeholder no topo com as 5 rotas. Conteúdo em coluna única.

**Mobile <768.** Igual ao tablet, tipografia menor, padding `px-space-16`, nav compacta com scroll interno se precisar.

**Arquivos.** `src/styles/tokens.css`, `src/types/finance.ts`, `src/constants/routes.ts`, `src/App.tsx`, `src/components/layout/AppShell.tsx`, páginas placeholder.

**Tokens / Figma.** Semânticas `primary`, `secondary`, `surface`, `background`; primitivas `neutral`, `space`, `shape`.

**Deps.** React Router (já no P1). Sem Supabase.

**Fora de escopo.** Sidebar real, HeaderMobile real, context, widgets.

**Conflito.** Texto do workshop usa 1024; código ficou em 1024. Decisão oficial 1280 — dívida para P2/P3.

---

## PROMPT 2 — Sidebar desktop

**Status:** feito. Auditoria em [`DOCUMENTATION.md`](DOCUMENTATION.md).

**Objetivo.** `Sidebar` full height, expandida/colapsada, toggle na borda, tooltip no colapso, 5 seções, perfil do usuário.

**Desktop ≥1280.** Renderizar `Sidebar`. Expandida ~300px (Figma `sidebar=open`): logo `mycash+`, labels, perfil completo. Colapsada ~80px (`sidebar=close`, node `30:1518`): ícone do logo, ícones das seções, só avatar. Toggle circular na borda direita (seta esquerda / direita). Transição no `main` (flex grow, sem margin fixa). Tooltip à direita do item no colapso, com delay. Item ativo: **pill lime** (`bg-primary`), não o fundo preto do spec. Empurra o conteúdo; não sobrepõe.

**Tablet / mobile.** **Não renderizar** `Sidebar`.

**Arquivos.** `src/components/layout/Sidebar.tsx`, estado collapsed no layout (React state). Atualizar `AppShell`. Corrigir `BREAKPOINTS.desktopMin` → `1280` e `useIsDesktop`.

**Tokens / Figma.** Sidebar instance no Home; `primary-500`, `neutral-1100`, `space/16`–`32`, `shape/100`.

**Deps.** Nenhuma.

**Fora de escopo.** HeaderMobile (P3), FinanceProvider (P4). Perfil pode usar placeholder até o P4.

**Conflito.** Ativo preto (spec) vs pill lime (Figma) → **Figma**. 1024 vs 1280 → **1280**. Largura 300/80 do Figma: `max-width` / token, sidebar `shrink-0`, `main` `flex-1 min-w-0`.

---

## PROMPT 3 — Header mobile

**Status:** feito. Auditoria em [`DOCUMENTATION.md`](DOCUMENTATION.md).

**Objetivo.** `HeaderMobile` + `MenuDropdown` abaixo de 1280. Nunca junto com a Sidebar.

**Desktop ≥1280.** Não renderizar header nem dropdown.

**Tablet 768–1279.** Header fixo no topo, largura 100%, visível no scroll. Logo à esquerda, avatar à direita (trigger). Dropdown desliza de cima, cobre o conteúdo **sem** ser fullscreen. Itens com ícone + texto (5 seções). Ativo: visual Figma (pill lime) se o DS mobile existir; senão spec (fundo preto) só no menu overlay — preferir tokens `primary` / `secondary`. Botão “Sair” vermelho (`--color-red-600`) no rodapé. Fecha: item, X, overlay.

**Mobile <768.** Igual ao tablet. Touch 44×44. Logo menor. Avatar 44px mínimo.

**Arquivos.** `src/components/layout/HeaderMobile.tsx`, `MenuDropdown.tsx`. Remover nav placeholder do `AppShell`.

**Tokens / Figma.** Frames de Header 360px se existirem; senão spec + tokens Home.

**Deps.** Nenhuma.

**Fora de escopo.** Filtros do dashboard (P6), logout real (não há auth). “Sair” pode resetar filtros / estado visual.

**Conflito.** Texto do P3 diz 1024 → **1280**.

---

## PROMPT 4 — Context `useFinance`

**Status:** feito. Auditoria em [`DOCUMENTATION.md`](DOCUMENTATION.md).

**Objetivo.** `FinanceProvider` no topo da árvore. Arrays: `transactions`, `goals`, `creditCards`, `bankAccounts`, `familyMembers`. CRUD. Filtros: `selectedMember`, `dateRange`, `transactionType`, `searchText`. Funções derivadas listadas no prompt. Hook `useFinance` como único acesso.

**Todos os viewports.** Sem UI nova. Só estado em memória.

**Mock.** 3 membros BR, 3 cartões de bancos conhecidos, 20–30 transações nos últimos 3 meses, 4 objetivos, categorias BR. Sem persistência.

**Arquivos.** `src/contexts/FinanceContext.tsx`, `src/contexts/financeCalculations.ts` (ou similar), `src/data/mockFinance.ts`. Envolver em `src/main.tsx` ou `App.tsx`.

**Tipos a estender aqui ou no prompt que precisar:**

- `BankAccount.holderId` (P14)
- `FamilyMember.email?` (P19)
- Manter `CreditCard.currentInvoice` (não `currentBill`)

**Deps.** Nenhuma. Sem storage API.

**Fora de escopo.** Telas, formatadores completos (só o necessário para mock).

**Conflito.** Nenhum de visual. TODO Supabase só em comentário, se útil.

---

## PROMPT 5 — Cards de resumo

**Objetivo.** `BalanceCard`, `IncomeCard`, `ExpenseCard` no topo do dashboard. Valores do context. Contagem 800ms.

**Desktop ≥1280.** Três cards em linha; saldo pode ser um pouco maior (`flex` / `fr`, não width fixa).

**Tablet.** 2+1 ou coluna, o que couber sem overflow. Preferir empilhar se a linha apertar.

**Mobile.** Coluna única, cada card `width: 100%`.

**Visual.** Card de saldo **branco**, valor `--color-blue-600` (Figma). Receitas/despesas como spec + Figma. Blur lime só se o Figma tiver; senão não inventar círculo no card branco.

**Arquivos.** `src/components/dashboard/BalanceCard.tsx`, `IncomeCard.tsx`, `ExpenseCard.tsx`, `SummaryCards.tsx`. **Criar** `src/utils/formatCurrency.ts` (`Intl` pt-BR / BRL).

**Tokens.** `surface`, `blue-600`, `neutral-*`, `red-*`, `space`, `shape/20`.

**Deps.** Nenhuma.

**Fora de escopo.** Header de filtros (P6), gráfico (P8).

**Conflito.** Saldo preto (spec/P5) vs branco/azul (Figma) → **Figma**. Cálculo `calculateTotalBalance` do spec.

---

## PROMPT 6 — Header do dashboard

**Objetivo.** Busca, filtros, período, membros, Nova Transação.

**Desktop ≥1280.** Barra horizontal. Busca com `max-width` (não width fixa 100% da página). `FilterPopover` glass (`surface` + blur). Calendário dois meses. Avatares empilhados. CTA “Nova Transação” à direita.

**Tablet.** Barra que quebra em wrap. Calendário um mês se não couber dois. Sem overflow.

**Mobile.** Busca `width: 100%`. Botão de filtros **abre gatilho** do modal P16 (pode montar um stub/sheet vazio se P16 ainda não existir — preferir botão desabilitado visualmente só se necessário; o correto é implementar o trigger e deixar o modal para o P16). CTA largura total, altura ≥48px. Sem popover desktop.

**Arquivos.** `src/components/dashboard/DashboardHeader.tsx`, `FilterPopover.tsx`, `DateRangePicker.tsx`, `FamilyAvatars.tsx`.

**Tokens.** Navbar do Figma Home.

**Deps.** Nenhuma. Calendário próprio (sem lib nova).

**Fora de escopo.** `AddMemberModal` (P13), `NewTransactionModal` (P12), `FiltersMobileModal` (P16) — só callbacks/`open` state.

**Conflito.** “Largura fixa” da busca → `max-width` + `width: 100%`.

---

## PROMPT 7 — Carrossel de categorias

**Objetivo.** `ExpensesByCategoryCarousel` + `CategoryDonutCard`. Dados de `calculateExpensesByCategory` / `calculateCategoryPercentage`. 0% se receita = 0.

**Desktop.** Scroll horizontal, wheel → x, drag, setas circulares no hover (~200px). Fade nas bordas. Hover da borda → `primary`. Donut 64px; card `max-width` próximo de 160px, não grid de página.

**Tablet.** Setas se houver hover; fade ok.

**Mobile.** Sem setas. Só swipe. Cards na horizontal.

**Arquivos.** `src/components/dashboard/ExpensesByCategoryCarousel.tsx`, `CategoryDonutCard.tsx`.

**Tokens.** `primary`, `secondary`, `neutral-500`, `surface`, borda `neutral-300`.

**Deps.** SVG/CSS para o donut. Sem lib de gráfico aqui.

**Fora de escopo.** Recharts (P8).

**Conflito.** 160px fixo → `max-w` / `w-full` dentro do slide.

---

## PROMPT 8 — Fluxo financeiro

**Objetivo.** `FinancialFlowChart` área receitas/despesas. Mock 7 meses, código pronto para agregar transações depois.

**Desktop.** Card `width: 100%`. Altura do plot via `max-height` (~300px), não canvas estourando.

**Tablet.** Altura um pouco menor.

**Mobile.** Altura menor, labels curtos, tooltip sem overflow.

**Arquivos.** `src/components/dashboard/FinancialFlowChart.tsx`.

**Tokens.** `primary` (receitas), `secondary` / `neutral-1100` (despesas), grid `neutral-300` sutil.

**Deps.** **Recharts permitida neste prompt.**

**Fora de escopo.** Dados reais agrupados (pode deixar função stub).

**Conflito.** Altura 300px → `h`/`max-h` no chart interno, card fluido.

---

## PROMPT 9 — Widget de cartões

**Objetivo.** Lista resumida de `creditCards`. Clique abre detalhes (P15). “+” abre criar (P14). Uso = fatura ÷ limite.

**Desktop.** Widget coluna (Figma “Cards & contas”). Hover eleva o item. Paginação se >3.

**Tablet.** Lista vertical, paginação se precisar.

**Mobile.** Lista vertical; swipe de página se >3. Touch 44px no “+”.

**Arquivos.** `src/components/cards/CreditCardsWidget.tsx`, `CreditCardListItem.tsx`.

**Tokens.** Temas `black` / `lime` / `white` → `secondary`, `primary`, `surface` + borda.

**Deps.** Nenhuma.

**Fora de escopo.** Modais P14/P15 (só `onOpen`). View completa P17.

**Conflito.** `translateY(-4px)` hardcoded → classe de transição; distâncias arredondar para space token.

---

## PROMPT 10 — Próximas despesas

**Objetivo.** Despesas `isPaid === false`, ordenadas por data. Check marca paga; recorrente gera próxima; parcelada avança parcela; toast.

**Desktop / tablet.** Card branco + lista. “+” abre nova transação (P12).

**Mobile.** Mesma lista em coluna. Check 44px.

**Empty.** Ícone check, “Nenhuma despesa pendente”, borda tracejada.

**Arquivos.** `src/components/dashboard/UpcomingExpensesWidget.tsx`.

**Dados.** Context P4, **não** mock paralelo.

**Tokens.** `surface`, `neutral-*`, `green-*` no hover do check.

**Deps.** Nenhuma.

**Fora de escopo.** Modal P12 (callback).

**Conflito.** Prompt pede “dados fictícios” — usar o mock do P4.

---

## PROMPT 11 — Tabela de transações (dashboard)

**Objetivo.** `TransactionsTable` no Home. 7 colunas. Filtros globais + busca/tipo locais (AND). 5 por página. Ordenar data desc.

**Desktop ≥1280.** Tabela completa, sem scroll horizontal da página.

**Tablet.** Híbrido: ocultar colunas secundárias (ex. parcelas, conta) se apertar.

**Mobile.** **Não** tabela: cada lançamento vira card vertical com labels.

**Arquivos.** `src/components/dashboard/TransactionsTable.tsx`, `TransactionRow.tsx`, `TransactionCard.tsx` (mobile).

**Tokens.** Header cinza `neutral-100/200`; zebra `neutral-50/100`; hover `neutral-200`.

**Deps.** Nenhuma.

**Fora de escopo.** View expandida P18 (reutilizar o componente depois).

**Conflito.** 5 por página (spec/P11) vs 3 linhas no screenshot Figma → **5 por página**; chrome visual = Figma. 256px/140px/50px → `max-width` / tokens.

---

## PROMPT 12 — Modal nova transação

**Objetivo.** Fullscreen no mobile; no desktop `width: 100%` + `max-width` 600–700px ou 100vw se o spec/Figma for tela cheia. Header / body scroll / footer. Validação. Toast. Sem save se inválido.

**Desktop / tablet.** Se o prompt pede 100vw, respeitar no mobile; no desktop preferir modal fluido com `max-width`, header/footer fixos, body scroll — salvo Figma mostrar fullscreen também.

**Mobile.** 100% viewport. Inputs ≥48px, fonte ≥16px.

**Arquivos.** `src/components/modals/NewTransactionModal.tsx`.

**Tokens.** Recorrente: **não** `#3247FF` → fundo `--color-blue-100`, borda `--color-blue-600`.

**Deps.** Nenhuma.

**Fora de escopo.** Outros modais.

**Conflito.** Hex azul → token. Parcelamento × recorrente: regras do prompt (mutuamente exclusivos).

---

## PROMPT 13 — Modal adicionar membro

**Objetivo.** Nome ≥3, função (combobox + sugestões), avatar URL ou upload (JPG/PNG ≤5MB) sem persistir arquivo além de `blob:` / data URL na sessão, renda opcional.

**Desktop.** Modal centralizado, `max-width` ~500px, overlay.

**Mobile.** Quase fullscreen / `width: 100%` + `max-width`.

**Arquivos.** `src/components/modals/AddMemberModal.tsx`.

**Deps.** Nenhuma (FileReader nativo).

**Fora de escopo.** Auth.

**Conflito.** Upload “para o sistema” sem backend → guardar data URL **só na memória da sessão**.

---

## PROMPT 14 — Modal conta / cartão

**Objetivo.** Toggle conta vs cartão. Titular obrigatório (`holderId`). Campos condicionais. Tema black/lime/white. CRUD no array certo.

**Desktop.** `max-width` 500–600px.

**Mobile.** 90–100% da viewport, não width fixa.

**Arquivos.** `src/components/modals/AddAccountOrCardModal.tsx`. Estender `BankAccount` com `holderId` se ainda não estiver.

**Campo fatura.** Usar `currentInvoice: 0`, não `currentBill`.

**Deps.** Nenhuma.

**Fora de escopo.** Detalhes P15.

---

## PROMPT 15 — Detalhes do cartão

**Objetivo.** Infos + uso visual + tabela de despesas daquele `accountId`. Ações: extrato (navega Transações), adicionar despesa (P12 pré-preenchido), editar, fechar.

**Desktop.** Modal médio-grande, grid 2–3 colunas nas métricas.

**Mobile.** 1 coluna, body scroll.

**Arquivos.** `src/components/modals/CardDetailsModal.tsx`.

**Deps.** Nenhuma.

**Fora de escopo.** Tela Cartões P17 (reusa dados).

---

## PROMPT 16 — Filtros mobile

**Objetivo.** Sheet de baixo para cima, 300ms. Estado **local** até “Aplicar”. X/overlay descarta.

**Desktop.** Não usar este modal (é o `FilterPopover` do P6).

**Tablet / mobile.** Header + body + footer fixos. Tipo 3 colunas, membros wrap, calendário 1 mês. Touch 44px. Botão Aplicar 56px.

**Arquivos.** `src/components/modals/FiltersMobileModal.tsx`. Ligar ao botão do P6.

**Deps.** Nenhuma.

**Fora de escopo.** Filtros desktop.

---

## PROMPT 17 — View Cartões

**Objetivo.** `CardsView` em `/cartoes`. Grid 1 / 2 / 3. Ordenar por fatura desc (ou alfa, documentar a escolha: **fatura desc**). Empty state.

**Desktop.** 3 colunas `auto-fit`.

**Tablet.** 2 colunas.

**Mobile.** 1 coluna.

**Arquivos.** `src/pages/CardsPage.tsx` passa a compor; `src/components/cards/CardsView.tsx`.

**Deps.** Nenhuma.

**Fora de escopo.** Objetivos.

---

## PROMPT 18 — View Transações

**Objetivo.** `TransactionsView` em `/transacoes`. Filtros extras (categoria, conta, membro, status) AND com globais. Resumo. Tabela em modo 10/página. Sort nos headers. Export **CSV apenas**.

**Desktop.** Filtros horizontais wrap. Tabela completa.

**Tablet.** Filtros quebra. Tabela híbrida.

**Mobile.** Filtros em coluna. Cards (mesmo P11).

**Arquivos.** `src/pages/TransactionsPage.tsx`, `src/components/dashboard/TransactionsView.tsx`. Reusar `TransactionsTable` com prop `pageSize={10}`.

**Deps.** Nenhuma (CSV via `Blob` + download).

**Fora de escopo.** PDF.

---

## PROMPT 19 — Perfil, aba Informações

**Objetivo.** `ProfileView` abas Informações | Configurações. Default Informações. Usuário = primeiro `familyMembers`. Lista de membros. “Sair”.

**Desktop.** Card de perfil + lista.

**Mobile.** Coluna. Avatar grande pode reduzir de 120px para token `size-72` + escala se estourar.

**Arquivos.** `src/pages/ProfilePage.tsx`, `src/components/profile/ProfileView.tsx`, `ProfileInfoTab.tsx`. Estender `FamilyMember.email?`.

**Deps.** Nenhuma.

**Fora de escopo.** Aba Configurações (P20). Auth real: “Sair” limpa seleção / mensagem.

---

## PROMPT 20 — Perfil, aba Configurações

**Objetivo.** Preferências visuais (dark mode **disabled** + badge “Em breve”), toggles locais, categorias receita/despesa, export JSON/CSV, limpar dados com confirm, Sobre v1.0.0.

**Limpar dados.** Só zera o React state (P4), não storage.

**Desktop.** Cards empilhados; lado a lado só se fluido.

**Mobile.** Tudo coluna. Toggles 44px.

**Arquivos.** `src/components/profile/ProfileSettingsTab.tsx`.

**Deps.** Nenhuma.

**Fora de escopo.** Dark mode funcional, email real.

---

## PROMPT 21 — Animações

**Objetivo.** Constantes de duração/easing. Fade de rota 200ms. Stagger listas. Hover botões/cards/avatares. Count-up já no P5. Barras 1000ms. Modais scale+fade; filtros mobile slide. Toasts. Skeletons pulse. `prefers-reduced-motion`.

**Todos os viewports.** Respeitar reduced motion.

**Arquivos.** `src/constants/motion.ts`, classes em `src/index.css` ou utilitários.

**Deps.** **CSS primeiro.** Framer Motion só com autorização explícita.

**Fora de escopo.** Refatorar lógica.

---

## PROMPT 22 — Utilitários

**Objetivo.** Completar `currency`, `date`, `array`, `validation`, `id`. JSDoc. Testes unitários leves das funções críticas.

**Implementação.**

- Moeda: `Intl.NumberFormat` (já pode existir do P5).
- Data: `Intl` / `toLocaleDateString('pt-BR')` — **sem date-fns**.
- ID: `crypto.randomUUID()` — **sem uuid**.
- `parseCurrencyInput`, `formatCompactCurrency`, `formatDateRange`, `calculatePercentage`, etc.

**Arquivos.** `src/utils/currency.ts`, `date.ts`, `array.ts`, `validation.ts`, `id.ts`. Testes: Vitest só se já estiver no projeto; senão testes em `src/utils/*.test.ts` **somente se** adicionar runner for pedido — o prompt pede testes; **Vitest é dep**. Decisão: testes com Vitest **não** adicionar agora; documentar funções + asserts manuais no P24, **ou** testes em funções puras rodando no `npm run build` via arquivo de spec simples. Preferência do playbook: criar as funções com JSDoc; testes automatizados no **P24** se ainda não houver runner.

**Deps.** Nenhuma.

**Fora de escopo.** UI.

---

## PROMPT 23 — Responsividade final

**Objetivo.** Só ajustes incrementais. Não refatorar arquitetura.

Checklist: 375 / 768 / 1280 / 1920. Sidebar ≥1280. Header <1280. Grids auto-fit. Tabela→card no mobile. Gráficos sem overflow. Modais fluidos. Touch 44 / gap 8 / input 48 / font 16. Teclado + `focus:ring` + `aria-label` + contraste 4.5:1.

**Conflito.** Este prompt redefine breakpoints — **já são os oficiais**. Corrigir qualquer 1024 que tenha sobrado.

---

## PROMPT 24 — Testes e validação

**Objetivo.** Jornada manual do usuário, cálculos, filtros AND, formatação BR, responsivo, modais (X, overlay, Escape), a11y teclado, performance básica, toasts, empty states, `README.md`.

**Viewport.** Sidebar some em **1280**, não 1024 (texto original do P24 está errado).

**README.** Objetivo, stack, install, `npm run dev`, pastas, componentes.

**Deps.** Nenhuma nova.

**Fora de escopo.** Supabase real.

---

## PROMPT FINAL — Revisão e entrega

**Objetivo.** Checklist de qualidade, JSDoc em funções complexas, `// TODO: integrar com Supabase` nos pontos de dados, relatório de componentes, bundle razoável, sem console.log.

Não é um prompt de feature. Não inventar Objetivos aqui.

---

## Mapa rápido: prompt → pasta

| P | Destino principal |
|---|---|
| 1 | scaffold + `types` + rotas |
| 2 | `components/layout/Sidebar.tsx` |
| 3 | `components/layout/HeaderMobile.tsx` |
| 4 | `contexts/` + mock |
| 5–8, 10–11 | `components/dashboard/` |
| 9, 17 | `components/cards/` |
| 12–16 | `components/modals/` |
| 18 | `pages` + tabela reusada |
| 19–20 | `components/profile/` |
| 21 | `constants/motion.ts` + CSS |
| 22 | `utils/` |
| 23–24 + Final | revisão, README, docs |
