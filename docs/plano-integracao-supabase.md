# Plano de integração Supabase — Mycash+ v2

Documento vivo para tornar o Mycash+ **100% funcional** com banco real, autenticação simples, Storage, RLS, CRUD e Functions.

**Projeto Supabase:** `AndreDodo73's Project` (`vumafvjbpwfzvrfnleoq`)  
**Região:** `sa-east-1` (São Paulo)  
**Stack do app:** React + Vite + TypeScript (não é Next.js)

---

## 1. O que já existe hoje

| Item | Status |
|------|--------|
| Projeto Supabase Healthy | ✅ |
| Schema v2 no banco (`users`, `family_members`, `categories`, `accounts`, `transactions`, `recurring_transactions`, `goals`) | ✅ |
| `prisma/schema.prisma` (documentação do modelo) | ✅ |
| Cliente `src/lib/supabase.ts` + `.env.local` | ✅ |
| Esboço `src/services/financeDb.ts` (mappers + CRUD parcial) | 🟡 parcial |
| `FinanceContext` ainda seedado com **mock** | ❌ pendente |
| Auth (login/cadastro) | ❌ |
| Storage (imagens de avatar, objetivos, logos) | ❌ |
| Edge Functions / triggers | ❌ |
| RLS definitiva por usuário | 🟡 hoje: políticas abertas “dev” |

---

## 2. Visão da arquitetura

```text
┌─────────────────────────────────────────────────────────┐
│  Mycash+ (React / Vite)                                 │
│  Telas → useFinance() → services/financeDb.ts           │
│                      → supabase-js                      │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────┐
│  Supabase                                               │
│  • Auth (email/senha simples)                           │
│  • Postgres (tabelas v2 + RLS)                          │
│  • Storage (avatars, goals, logos)                      │
│  • Edge Functions (recorrência, hooks, etc.)            │
└─────────────────────────────────────────────────────────┘
```

**Regra de ouro:** a UI continua falando com `useFinance()`. Quem muda é a implementação (mock → Supabase).

---

## 3. Decisões oficiais (para não reinventar no meio)

### 3.1 Autenticação (simples)
- Provedor: **Supabase Auth — Email + senha**
- Fluxo: Cadastro → Login → sessão persistente → Logout
- Ao criar usuário no Auth, criar linha em `public.users` (mesmo `id` = `auth.users.id`) via **trigger** ou Edge Function
- Um `User` = dono da “casa financeira”; `FamilyMember` = pessoas da família

### 3.2 RLS (conforme pedido atual do curso)
**Fase A (agora / aprendizado):** todos autenticados (e, se necessário, `anon`) têm acesso a **todas** as tabelas — políticas abertas.

**Fase B (produção, depois):** cada linha filtrada por `user_id = auth.uid()`.

> Você pediu “todos possuem acesso a todas as tabelas” → implementamos **Fase A** primeiro, com comentários claros para endurecer depois.

### 3.3 Contas unificadas
Tabela `accounts` com `type`: `CHECKING` | `SAVINGS` | `CREDIT_CARD`.  
No app React, o contexto **continua expondo** `bankAccounts` + `creditCards` (mapeamento), para não quebrar as telas do Figma.

### 3.4 Objetivos (Goals)
Não vinham no Prisma do curso; **já existem no banco** porque a seção Objetivos do Mycash+ depende disso.

### 3.5 Storage
Buckets:
| Bucket | Uso | Público? |
|--------|-----|----------|
| `avatars` | fotos de membros / perfil | sim (leitura) |
| `goals` | imagens dos objetivos | sim (leitura) |
| `account-logos` | logos de banco/cartão | sim (leitura) |
| `media` | uploads genéricos (imagens/vídeos futuros) | privado + signed URL |

Políticas Storage alinhadas à Fase A (leitura/escrita liberada para autenticados).

---

## 4. Plano por fases (ordem de execução)

### Fase 0 — Congelar o modelo (1 passo)
- [x] Schema v2 aplicado no Supabase
- [ ] Migration local em `supabase/migrations/` espelhando o remoto
- [ ] Seed mínimo: usuário demo **ou** só Auth real (escolher um; preferência: Auth real + onboarding vazio)

**Entrega:** banco estável, documentado.

---

### Fase 1 — Auth simples (UI + Supabase)
**Backend**
- [x] Habilitar Email/Password no Auth (padrão do projeto)
- [x] Trigger `on_auth_user_created` → `insert into public.users`
- [ ] (Opcional) confirmação de e-mail desligada no dashboard Supabase

**Frontend**
- [x] Telas: Login, Cadastro
- [x] `AuthProvider` / `useAuth` (sessão, user, signIn, signUp, signOut)
- [x] Proteger rotas do dashboard: sem sessão → login
- [ ] Remover `DEMO_USER_ID` fixo; usar `session.user.id` (Fase 3 — CRUD)

**Entrega:** você entra com e-mail/senha e vê o app “seu”.

---

### Fase 2 — RLS aberta (pedido atual) + preparação Fase B
**SQL**
- [x] Garantir RLS `ENABLE` em todas as tabelas
- [x] Políticas `FOR ALL TO authenticated/anon USING (true) WITH CHECK (true)`
- [x] Documentar políticas futuras `user_id = auth.uid()` (não ativar ainda) — ver comentários no plano

**Entrega:** qualquer usuário logado lê/escreve tudo (modo curso).

---

### Fase 3 — CRUD completo via services
- [x] Reescrever `FinanceContext`: `load` no mount + cada ação chama service
- [x] Estados: `isLoading`, `error`, empty states nas telas
- [x] Remover imports de `mockFinance` do contexto
- [x] `mockFinance.ts` permanece no repo mas **não alimenta mais** o app

**Entrega:** tudo que você cria/edita/exclui no UI aparece no **Table Editor** do Supabase.

---

### Fase 4 — Storage (imagens / mídia)
- [x] Criar buckets (`avatars`, `goals`, `account-logos`, `media`)
- [x] Helpers: `uploadFile` / `uploadDataUrl`
- [x] Integrar avatar em AddMember (upload → Storage)
- [ ] Logo em AddAccountOrCard / imagem custom em AddGoal (opcional — buckets prontos)

---

### Fase 5 — Functions (lógica de servidor)
- [x] `handle_new_user` (trigger Auth)
- [x] `seed_default_categories`
- [x] `generate_recurring_transactions`

---

### Fase 6 — Polimento “100% funcional”
- [x] Empty states / onboarding no Dashboard
- [x] Gráfico de fluxo a partir de transações reais
- [ ] Export CSV/JSON (já usava estado; ok com dados reais)
- [x] Tratamento de erro no Dashboard + console
- [ ] Checklist de segurança Fase B RLS (futuro)
- [ ] Atualizar README + `DOCUMENTATION.md`

---

### Fase 3 — CRUD completo via services
Camada `src/services/` (já iniciada em `financeDb.ts`):

| Domínio | Operações |
|---------|-----------|
| Members | create, read, update, soft-delete (`is_active`) |
| Accounts | create/update/delete conta **e** cartão |
| Categories | create/update/soft-delete |
| Transactions | create/update/delete + regras parcela ≤ 12 e recorrente sem parcela |
| Goals | create/update/delete |
| Recurring | create/update/toggle `is_active` |

**Frontend**
- [ ] Reescrever `FinanceContext`: `load` no mount + cada ação chama service
- [ ] Estados: `isLoading`, `error`, empty states nas telas
- [ ] Remover imports de `mockFinance` do contexto
- [ ] Manter `mockFinance.ts` só como referência/seed opcional **ou** apagar

**Entrega:** tudo que você cria/edita/exclui no UI aparece no **Table Editor** do Supabase.

---

### Fase 4 — Storage (imagens / mídia)
- [ ] Criar buckets (`avatars`, `goals`, `account-logos`, `media`)
- [ ] Helpers: `uploadFile(bucket, path, file)` → retorna URL pública ou signed
- [ ] Integrar:
  - Avatar em Perfil / AddMember
  - Imagem em AddGoal
  - Logo em AddAccountOrCard (opcional)
- [ ] Limites: tipo MIME (image/*, video/*), tamanho máx. (ex.: 5 MB imagem / 50 MB vídeo)

**Entrega:** uploads reais, URLs salvas nas colunas `avatar_url`, `image_url`, `logo_url`.

---

### Fase 5 — Functions (lógica de servidor)
Edge Functions / DB functions recomendadas:

| Function | Para quê |
|----------|----------|
| `handle_new_user` (trigger SQL) | Cria `public.users` no signup |
| `generate_recurring_transactions` | Gera lançamentos do mês a partir de `recurring_transactions` |
| `recalculate_account_balance` (opcional) | Ajusta saldo/fatura após CRUD de transações |
| `onboarding_seed_categories` | Cria categorias padrão (Salário, Mercado…) no primeiro login |

**Entrega:** regras de negócio não dependem só do browser.

---

### Fase 6 — Polimento “100% funcional”
- [ ] Empty states (sem membros / sem contas / sem transações)
- [ ] Gráfico de fluxo financeiro a partir de transações reais (não `financialFlowMock`)
- [ ] Export CSV/JSON lendo do estado já sincronizado
- [ ] Tratamento de erro amigável (toast/banner)
- [ ] Checklist de segurança: remover políticas abertas → Fase B RLS
- [ ] Atualizar README + `DOCUMENTATION.md`

**Entrega:** app usável de ponta a ponta, pronto para demonstração.

---

## 5. Mapa de arquivos a criar/alterar

### Criar
- `src/contexts/AuthContext.tsx`
- `src/pages/LoginPage.tsx` / `RegisterPage.tsx` (ou modal)
- `src/services/storage.ts`
- `src/services/auth.ts`
- `supabase/migrations/*_auth_trigger.sql`
- `supabase/migrations/*_storage_buckets.sql`
- `supabase/functions/generate-recurring/` (quando for a vez)
- `docs/plano-integracao-supabase.md` (este arquivo)

### Alterar
- `src/contexts/FinanceContext.tsx` — fonte = Supabase
- `src/App.tsx` / rotas — gate de Auth
- `src/types/finance.ts` — alinhar IDs UUID / categoryId
- `src/components/modals/*` — upload de imagem onde couber
- Remover dependência de `src/data/mockFinance.ts`

---

## 6. Ordem sugerida na prática (checklist curto)

1. Auth email/senha + telas login/cadastro  
2. Trigger user → `public.users`  
3. Confirmar RLS aberta (Fase A)  
4. Ligar `FinanceContext` ao CRUD real  
5. Apagar mock do fluxo principal  
6. Storage + uploads nas telas  
7. Function de recorrência + seed de categorias  
8. Empty states + gráfico real  
9. (Depois) RLS por `user_id`  

---

## 7. O que você (designer) precisa fazer vs o que o Cursor faz

| Você | Cursor / engenharia |
|------|---------------------|
| Testar login/cadastro no navegador | SQL, policies, código |
| Validar se as telas batem com o Figma | CRUD, Auth, Storage |
| Confirmar uploads de foto | Functions, migrations |
| Dizer “próxima fase” | Executar uma fase por vez |

---

## 8. Riscos e cuidados

- **Não usar Next.js** nas instruções do painel Connect — o app é Vite (`VITE_SUPABASE_*`).
- **Não commitar** `.env.local` (já no `.gitignore`).
- Políticas abertas (Fase A) são **só para aprendizado**; não deixar assim em produção pública.
- Conta Free do Supabase **pausa** se ficar sem uso — reativar quando aparecer pausado.
- Prisma no repo é **documentação do modelo**; o runtime usa `supabase-js` + SQL.

---

## 9. Critério de “pronto / 100% funcional”

- [ ] Cadastro e login funcionam  
- [ ] Após login, dados vêm do Supabase (Table Editor bate com a UI)  
- [ ] CRUD de membros, contas/cartões, categorias, transações, objetivos  
- [ ] Imagens sobem no Storage e aparecem na UI  
- [ ] Sem seed mock no caminho crítico do app  
- [ ] Empty states claros quando não há dados  
- [ ] Build (`npm run build`) passa  

---

## 10. Próximo passo imediato

**Começar pela Fase 1 (Auth simples)** — sem isso, `user_id` real não existe e o resto fica artificial.

Comando para o Cursor:  
`execute a Fase 1 do plano de integração Supabase`
