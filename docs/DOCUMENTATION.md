# mycash+ — Documentação

Figma Home: [home-dashboard-responsive](https://www.figma.com/design/Ge7zSB1zC6baUJFqrpGN09/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=42-3096)

Primitivas: [Tokens de Figma](https://docs.google.com/spreadsheets/d/1icfTxXdSbtd029FfOYnrlMs2pC8HJqk5PDuEmQF5Zjo/edit?gid=0#gid=0) · `docs/tokens-primitivos.md`

Sequência original: [Prompts mycash+](https://docs.google.com/document/d/1s-KKXi3hROSBsgfxXOKpeMOxD318U7z9hSJ0UiIRT4Q/edit?tab=t.0) · `docs/sequencia-prompts-mycash.md`

Playbook de execução (decisões, breakpoints, conflitos): `docs/playbook-prompts-mycash.md`

## Progresso

- [x] PROMPT 0: Análise e planejamento
- [x] PROMPT 1: Estrutura base e configuração
- [x] PROMPT 2: Layout e navegação desktop
- [x] PROMPT 3: Layout e navegação mobile
- [x] PROMPT 4: Context global e estado
- [x] PROMPT 5: Cards de resumo financeiro
- [ ] PROMPT 6: Header do dashboard
- [ ] PROMPT 7: Carrossel de categorias
- [ ] PROMPT 8: Gráfico de fluxo financeiro
- [ ] PROMPT 9: Widget de cartões
- [ ] PROMPT 10: Widget de próximas despesas
- [ ] PROMPT 11: Tabela de transações
- [ ] PROMPT 12: Modal de nova transação
- [ ] PROMPT 13: Modal de adicionar membro
- [ ] PROMPT 14: Modal de adicionar cartão
- [ ] PROMPT 15: Modal de detalhes do cartão
- [ ] PROMPT 16: Modal de filtros mobile
- [ ] PROMPT 17: View completa de cartões
- [ ] PROMPT 18: View completa de transações
- [ ] PROMPT 19: Perfil — informações
- [ ] PROMPT 20: Perfil — configurações
- [ ] PROMPT 21: Animações e transições
- [ ] PROMPT 22: Formatação e utilitários
- [ ] PROMPT 23: Responsividade e ajustes finais
- [ ] PROMPT 24: Testes e validação final

---

## PROMPT 0: Análise e Planejamento Inicial

Status: ✅ | Data: 16/09/2026 | Build: N/A (sem código)

### Implementado

- Consulta Figma MCP no frame `home-dashboard-responsive` (`42:3096`)
- Mapeamento de componentes da Home desktop (screenshot + MCP)
- Inventário de tokens aplicados no frame + primitivas em `docs/tokens-primitivos.md`
- Sequência completa gravada em `docs/sequencia-prompts-mycash.md` (prompts 0–24)
- To-do 1 a 1 criado (Prompt 0 concluído; 1–24 pendentes)
- Plano de pastas e componentização (ainda não gerado em código — Prompt 0 não escreve app)

### Frame analisado

- Arquivo: Workshop — Do figma MCP ao Cursor AI v.3
- `fileKey`: `Ge7zSB1zC6baUJFqrpGN09`
- Frame: `home-dashboard-responsive` 1728×1631
- Sidebar aberta: 300px (`sidebar=open`)
- Variante colapsada no DS: `sidebar=close` 80px (`30:1518`)

### Hierarquia visual (Home)

```
home-dashboard-responsive
├── Sidebar (instance)
│   ├── logo Mycash+
│   ├── menu-sidebar
│   │   ├── btn-sidebar Home (ativo, primary-500)
│   │   └── btn-sidebar Cartões (default)
│   ├── Members + dados-usuário (Lucas Marte)
│   └── close (toggle)
└── Conteúdo
    ├── navbar: search, filter, select-date, Members, Btn Nova transação
    ├── cards/card-despesa ×4 (Aluguel, Alimentação, Mercado, Academia)
    ├── resumo-saldo ×3 (Saldo total, Receitas, Despesas)
    ├── Cards & contas (Nubank, Inter, Picpay)
    ├── Fluxo financeiro (Receitas / Despesas, JAN–DEZ)
    ├── Próximas despesas + check
    └── Extrato detalhado + search + pagination
```

### Navegação

- Desktop neste frame: sidebar 300px, empurra o conteúdo; item ativo pill lime; toggle na borda.
- Colapsada no componente: 80px (`sidebar=close`).
- Header mobile existe em frames antigos (`Header` 360px, `hidden`). Nesta Home responsiva o layout é desktop.
- Spec: sidebar só `≥1280px`; abaixo disso Header Mobile, sem renderizar os dois.

### Tokens aplicados neste frame

Semânticas:

- `Colors/Primary/primary-500` → `#D7FF00`
- `Colors/Secondary/secondary-900` → `#060A11`
- `Colors/Secondary/secondary-50` → `#E7E8EA`
- `Colors/Surface/surface-500` → `#FFFFFF`
- `Colors/Background/background-400` → `#F5F6F8`

Primitivas de cor:

- `color/neutral/0` → `#ffffff`
- `color/neutral/300` → `#686c55`
- `color/neutral/400` → `#4b4f35`
- `color/neutral/500` → `#1e2302`
- `color/neutral/1100` → `#080b12`
- `color/brand/700` → `#c4e703`
- `color/blue/600` → `#2a89ef` (valor do Saldo total)
- `color/green/600` → `#15be78`
- `color/red/600` → `#e61e32`

Espaçamento: `space/0`, `space/8`, `space/12`, `space/16`, `space/20`, `space/24`, `space/32`, `space/56`  
Shape: `shape/2`, `shape/20`, `shape/100`  
Size: `size/72`  
Tipo (Inter): Heading Medium 28/36 Bold, Heading Small 24/32 Bold, Heading X-Small 20/28 Bold, Label Large 18/24 Semi Bold, Label Medium 16/20 Semi Bold, Label Small 14/16 Semi Bold, Label X-Small 12/16 Semi Bold, Paragraph Large 18/28 Regular, Paragraph Small 14/20 Regular, Paragraph X-Small 12/20 Regular

### Conversões

Nenhuma nesta etapa (sem código). Na implementação:

- `#D7FF00` do botão Home ativo → `Colors/Primary/primary-500` (não hex solto)
- Fundo da página → `Colors/Background/background-400`
- Texto padrão → `color/neutral/1100`
- Borda de cards → `color/neutral/300`
- Saldo total azul → `color/blue/600`

### Conflitos spec × Figma

- Spec descreve 5 seções; este frame mostra **Home** e **Cartões**.
- Spec: card de saldo preto; Figma: card branco, valor em `color/blue/600`.
- Spec: 5 transações visíveis; Figma: 3 linhas + “Mostrando 1 a 5 de 17”.
- Visual desta tela: Figma. Comportamento (filtros, cálculos, modais): spec.

### Arquitetura planejada (Prompt 0)

O plano inicial citava `src/app` e `src/context`. O Prompt 1 adotou `pages/` e `contexts/` — essa é a árvore canônica (ver playbook).

### Build

Tentativas: 0 | Erros: 0 | Código ainda não gerado

### Commit

feat: estrutura Vite do mycash+ e sidebar desktop  
Hash: `72c20d7`

---

## PROMPT 1: Estrutura Base e Configuração

Status: ✅ | Data: 16/09/2026 | Build: ✅ (1 tentativa)

Playbook: `docs/playbook-prompts-mycash.md` (ficha P1 + decisões oficiais).

### Implementado

- Vite 8 + React 19 + TypeScript + Tailwind v4 (`@theme` em `src/styles/tokens.css`)
- Pastas: `components` (layout, dashboard, cards, modals, ui), `contexts`, `hooks`, `types`, `utils`, `constants`, `pages`
- Tokens semânticos do Figma Home + primitivas da planilha como classes Tailwind (`bg-primary`, `p-space-16`, `rounded-shape-100`)
- Tipos: `Transaction`, `Goal`, `CreditCard`, `BankAccount`, `FamilyMember`
- SPA com 5 rotas: `/`, `/objetivos`, `/cartoes`, `/transacoes`, `/perfil`
- Shell provisório (`AppShell` + `Outlet`): nav lateral ou header, nunca os dois; páginas placeholder

### Auditoria (16/09/2026)

Feito e alinhado ao pedido do Prompt 1:

- Diretórios por domínio, inclusive pastas vazias (`contexts`, `dashboard`, `cards`, `modals`, `ui`, `utils`)
- Tokens mapeados no Tailwind via `@theme`
- Uniões nos tipos (`income | expense`, `pending | completed`, temas `black | lime | white`)
- React Router: só o conteúdo central muda
- `npm run build` passou em 1 tentativa
- Rotas conferidas no preview: Home, Objetivos, Cartões, Transações, Perfil; rota inválida redireciona para `/`

Dívida — **não corrigir agora**; entra nos prompts seguintes (ver playbook):

- `src/constants/breakpoints.ts` e `useIsDesktop` usam **1024**. Oficial: **1280** (P2/P3)
- `AppShell` ainda é placeholder (P2/P3)
- `CreditCard.currentInvoice` vs texto do P14 `currentBill` → manter `currentInvoice`
- P14 pede `holderId` em conta/cartão — tipo ainda não tem; estender no P4 ou P14
- P19 pede `email` — `FamilyMember` ainda não tem; estender no P4 ou P19
- `utils/` vazio; criar `formatCurrency` no **P5**
- Árvore canônica é a do código (`pages/`, `contexts/`), não o rascunho `app/` + `context/` do Prompt 0
- Rota `/objetivos` existe, mas **não há prompt de UI** de Objetivos (gap no playbook)

### Tokens

Semânticas: `--color-primary`, `--color-secondary`, `--color-secondary-50`, `--color-surface`, `--color-background`

Primitivas: `--color-neutral-*`, `--color-brand-*`, `--color-purple-*`, `--color-pink-*`, `--color-red-*`, `--color-orange-*`, `--color-yellow-*`, `--color-green-*`, `--color-blue-*`, `--spacing-space-*`, `--radius-shape-*`, `--size-72`, tipografia Inter

Conversões:

- `Colors/Primary/primary-500` `#D7FF00` → `--color-primary`
- `Colors/Background/background-400` `#F5F6F8` → `--color-background`
- `Colors/Surface/surface-500` `#FFFFFF` → `--color-surface`
- `Colors/Secondary/secondary-900` `#060A11` → `--color-secondary`
- `space/16` → `--spacing-space-16` / `p-space-16`
- `shape/100` → `--radius-shape-100` / `rounded-shape-100`
- Sidebar Figma 300px → largura fluida no placeholder (medida real no Prompt 2)

### Breakpoints

- Código atual (dívida): mobile ≤640, tablet 641–1023, desktop ≥1024
- Oficial (playbook / P23 / rules): mobile `<768`, tablet `≥768`, desktop `≥1280`, wide `≥1920`
- Tailwind: `md` 768, `xl` 1280, `2xl` 1920 (`lg` 1024 existe no CSS, mas a sidebar não deve usá-lo)

### Build

Tentativas: 1 | Erros: 0

### Commit

feat: estrutura Vite do mycash+ e sidebar desktop  
Hash: `72c20d7`

---

## PROMPT 2: Layout e navegação desktop (Sidebar)

Status: ✅ | Data: 16/09/2026 | Build: ✅ (1 tentativa)

Playbook: ficha P2.

### Implementado

- `Sidebar` desktop: expandida 300px / colapsada 80px (Figma `sidebar=open` / `sidebar=close`)
- Toggle circular na borda (seta esquerda / direita), `aria-expanded`
- Transição de largura 300ms; o `main` cresce com `flex-1` (sem margin fixa)
- Tooltip no colapso (delay 200ms, à direita)
- Item ativo: pill `bg-primary` (Figma, não fundo preto)
- 5 seções (spec); perfil placeholder Lucas Marte
- `BREAKPOINTS.desktopMin` = **1280**; `useIsDesktop` atualizado
- Abaixo de 1280: Sidebar **não renderiza**; HeaderMobile no P3

### Tokens

Semânticas: `--color-primary`, `--color-secondary`, `--color-surface`, `--color-background`

Primitivas: `--color-neutral-1100`, `--color-neutral-300`, `--spacing-space-8/12/16/32/56`, `--radius-shape-100`, `--text-label-large/medium`, `--text-paragraph-small`

Conversões:

- 300px / 80px Figma → constantes do componente (não é container de página)
- `#D7FF00` ativo → `--color-primary`
- Borda `#686c55` do frame → `--color-neutral-300` da planilha
- Sombra do toggle `0 4px 2px rgba(0,0,0,0.25)` → `shadow-sm`
- 7px entre nome e e-mail → `--spacing-space-8`
- Ícones Home, Cartões, logo e avatar: assets do Figma em `src/assets/sidebar/`
- Ícones Objetivos / Transações / Perfil: SVGs 16×16 (Figma só tem Home e Cartões)

### Build

Tentativas: 1 | Erros: 0

### Commit

feat: estrutura Vite do mycash+ e sidebar desktop  
Hash: `72c20d7`

---

## PROMPT 3: Layout e navegação mobile (HeaderMobile)

Status: ✅ | Data: 16/09/2026 | Build: ✅ (2 tentativas)

Playbook: ficha P3.

### Implementado

- `HeaderMobile` só abaixo de 1280: sticky, largura 100%, logo à esquerda, avatar à direita (trigger 56×56)
- `MenuDropdown` desliza abaixo do header (não fullscreen): 5 seções ícone + texto, X, overlay, Escape
- Item ativo no overlay: fundo `--color-secondary` (preto) + texto/ícones invertidos — não há menu mobile no DS Figma
- Botão **Sair** `--color-red-600` (fecha o menu; sem auth)
- `AppShell`: `isDesktop ? Sidebar : HeaderMobile` — nunca os dois juntos
- Ícone X: `fi-rr-cross` Figma `30:526`

### Verificação no browser

- 375px: header 375px, dropdown ~489px de 812 (não fullscreen), Home ativo `rgb(6, 10, 17)`, Sair `rgb(230, 30, 50)`, alvos 56px
- Fecha: item (navegou `/cartoes`), X, Escape, overlay
- 768px: HeaderMobile, sem Sidebar, sem overflow horizontal
- 1280px: Sidebar, sem HeaderMobile, sem overflow horizontal

### Tokens

Semânticas: `--color-surface`, `--color-secondary`, `--color-background`

Primitivas: `--color-neutral-300`, `--color-neutral-600`, `--color-red-600`, `--spacing-space-8/12/16/24/32/56`, `--radius-shape-100`, `--text-label-large`

Conversões:

- Frames `Header` 360×120 no Figma (`0:3029` / `0:3197` / `27:11577`) são date picker, não o nav — spec + tokens da Home
- Logo desktop 140×30 → `112×24` (`h-space-24` + `w-[112px]`, ~80% no mobile)
- Overlay 50% → `bg-secondary/50`
- Sombra do painel → `shadow-sm` (igual ao toggle da Sidebar)
- Touch 44×44 → `--spacing-space-56` (56px)
- `fi-rr-cross` 24px → `--spacing-space-24`

### Build

Tentativas: 2 | Erros: 0

### Commit

feat: header mobile com menu dropdown abaixo de 1280px  
Hash: `1cb3f43`

---

## PROMPT 4: Context global e estado (`useFinance`)

Status: ✅ | Data: 16/09/2026 | Build: ✅ (1 tentativa)

Playbook: ficha P4.

### Implementado

- `FinanceProvider` no topo de `App.tsx` (envolve o router)
- Estado em memória (só React state): `transactions`, `goals`, `creditCards`, `bankAccounts`, `familyMembers`
- CRUD completo por entidade + filtros: `selectedMember`, `dateRange` (mês atual), `transactionType`, `searchText`
- Cálculos em `financeCalculations.ts`: filtragem AND, saldo, receitas/despesas, categorias, %, taxa de economia
- Hook `useFinance` como único acesso (também reexportado em `hooks`)
- Mock BR: 3 membros (Lucas/Maria/Pedro), 3 contas + 3 cartões (Nubank/Inter/PicPay), 30 transações (~3 meses), 4 objetivos, categorias
- Tipos: `BankAccount.holderId`, `CreditCard.holderId`, `FamilyMember.email?`, `CategoryDef`
- Sem `localStorage` / storage API (comentário TODO Supabase)

### Tokens / dados

Cores de categoria e contas no mock usam variáveis CSS (`var(--color-*)`), não hex soltos.

Conversões (marcas de banco → primitivas):

- Nubank `#820AD1` → `--color-purple-600`
- Inter `#FF7A00` → `--color-orange-600`
- PicPay `#21C25E` → `--color-green-600`

### Build

Tentativas: 1 | Erros: 0

### Commit

feat: context useFinance com mock e cálculos em memória  
Hash: `d38dcf4`

---

## PROMPT 5: Cards de resumo financeiro

Status: ✅ | Data: 16/09/2026 | Build: ✅ (1 tentativa)

Playbook: ficha P5. Figma: `resumo-saldo` (`42:3108`–`42:3110`) em `42:3107`.

### Implementado

- `BalanceCard`, `IncomeCard`, `ExpenseCard` + `SummaryCards` + shell compartilhado
- Valores via `useFinance` (`calculateTotalBalance` / income / expenses do período filtrado)
- Contagem animada 800ms (`useCountUp`)
- `formatCurrency` com `Intl` pt-BR / BRL
- Layout: 1 col mobile · 2 cols tablet · 3 cols desktop (`xl`)
- Visual Figma: cards brancos, saldo em `--color-blue-600`, sem blob lime / card preto
- Ícones Figma: dollar, seta receita (verde), seta despesa (vermelha)

### Tokens

Semânticas: `--color-surface`

Primitivas: `--color-neutral-300`, `--color-neutral-1100`, `--color-blue-600`, `--spacing-space-4/20/24/32`, `--radius-shape-20`, `--text-paragraph-large`, `--text-heading-medium`

Conversões:

- Border Figma `#686c55` → `--color-neutral-300` (já mapeado no projeto)
- Gap 20px → `--spacing-space-20`
- Padding 24px → `--spacing-space-24`
- Radius 20 → `--radius-shape-20`
- Valor saldo `#2a89ef` → `--color-blue-600`
- Label 18 / valor 28 → `paragraph-large` / `heading-medium`

### Build

Tentativas: 1 | Erros: 0

### Commit

feat: cards de resumo financeiro e ícone target de Objetivos  
Hash: `c363166`
