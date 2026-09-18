# Validação — Prompt 24

Data: 2026-09-18 · Branch: `cursor/cards-view-completa`

## Ambiente

- `npm run build` — ✅ sucesso
- `npm run lint` — ✅ sem erros (apenas warnings de hooks/export)
- `npm run validate:utils` — smoke de cálculos, filtros AND, formatação BR, arrays vazios

## Jornada do usuário (checklist)

| # | Passo | Status |
|---|--------|--------|
| 1 | Abre o sistema | ✅ mock carrega |
| 2 | Dados mock no dashboard | ✅ |
| 3–5 | Filtro por membro (toggle) | ✅ via `selectedMember` |
| 6–7 | Período (DateRangePicker) | ✅ |
| 8–9 | Busca em tempo real | ✅ extrato |
| 10–13 | Nova Transação → toast → lista | ✅ |
| 14–15 | Detalhes do cartão | ✅ |
| 16–17 | Contas e Cartões | ✅ logos + grids |
| 18–20 | Transações + filtros avançados | ✅ AND + FilterSelect |
| 21–24 | Perfil + Configurações/toggles | ✅ |
| 25 | Retorno ao Dashboard | ✅ PageTransition |

## Cálculos

- Saldo = soma contas − faturas dos cartões (com filtro de membro)
- Receitas / despesas do período via `getFilteredTransactions`
- Divisão por zero em percentuais → `0` (`calculatePercentage`, `calculateCategoryPercentage`, `calculateSavingsRate`)
- Arrays vazios tratados em filtros e agregações

Asserts automatizados: `npm run validate:utils`

## Formatação BR

- Moeda: `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
- Datas: `dd/mm/aaaa` via utils de date
- Percentual: 1 casa decimal nos helpers críticos

## Responsividade

| Viewport | Esperado | Notas |
|----------|----------|--------|
| 375 | 1 coluna, Header Mobile, sem sidebar | Validar visualmente |
| 768 | grids 2 col quando aplicável, Header Mobile | Validar visualmente |
| 1280 | Sidebar + conteúdo, sem Header Mobile | **1280**, não 1024 |
| 1920 | `max-w-[1600px]` | Validar visualmente |

Overflow horizontal: proibido (containers `w-full` + `max-width`).

## Modais

Todos com overlay, X (`ModalCloseButton`), Escape e clique fora onde implementado. Validação de campos vazios nos forms principais.

## Acessibilidade

- `focus-visible` global em botões/inputs (`motion.css`)
- `aria-label` em ícones de ação
- Tooltips no check de Próximas despesas
- Touch target ≥ 44px nos controles críticos

## Performance

- Paginação no extrato (5 Home / 10 Transações)
- Stagger/motion respeitam `prefers-reduced-motion`
- Bundle JS ~1.1 MB — candidato a code-split (Prompt Final)

## Correções aplicadas neste prompt

- Guards de array vazio / null em `financeCalculations` e `array.ts`
- Script `scripts/validate-utils.mjs` + `npm run validate:utils`
- `README.md` do projeto

## Pendências conscientes

- Leitor de tela: validação manual recomendada (VoiceOver)
- 100 transações mock de stress: não geradas automaticamente; paginação já cobre UX
- Toasts de erro genéricos: maioria dos fluxos usa validação inline + toast de sucesso
