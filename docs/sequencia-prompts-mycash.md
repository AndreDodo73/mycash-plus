# Sequência de prompts — mycash+

Fonte: [Sequência de Prompts para Construção do mycash+](https://docs.google.com/document/d/1s-KKXi3hROSBsgfxXOKpeMOxD318U7z9hSJ0UiIRT4Q/edit?tab=t.0)

**Antes de executar qualquer prompt**, use o playbook (comportamentos por breakpoint, conflitos e decisões oficiais):

→ [`docs/playbook-prompts-mycash.md`](playbook-prompts-mycash.md)

Progresso no código: [`docs/DOCUMENTATION.md`](DOCUMENTATION.md)

Este arquivo guarda o **texto original** da sequência. Não copie o playbook para cá. Em caso de conflito (ex.: sidebar em 1024 vs 1280), vale o playbook.

Execução: **um prompt por vez**, com aprovação humana entre eles. Tokens: @docs/tokens-primitivos.md. Visual: Figma Home `42:3096`. Comportamento: @docs/documento-descritivo-mycash.md.

---

🎯 Sequência de Prompts para Construção do mycash+ 
📋 PROMPT 0: Análise e Planejamento Inicial 
 
Cursor, antes de começarmos a implementação, preciso que você faça uma análise completa do projeto: 
Primeiro, acesse o design do mycash+ via Figma MCP e identifique todos os componentes visuais presentes nas telas Dashboard, Cartões, Transações e Perfil. Mapeie a hierarquia visual e a relação entre os componentes. 
Segundo, identifique todas as variables semânticas e primitivas disponíveis no design system. Liste quais tokens de cor, espaçamento, tipografia e shape existem e estão prontos para uso. 
Terceiro, analise a estrutura de navegação proposta nas imagens e na documentação. Identifique os estados da sidebar desktop (expandida/colapsada), o header mobile e como a transição entre seções deve funcionar. 
Por fim, me apresente um resumo da arquitetura que você pretende seguir, explicando como vai organizar a estrutura de pastas, a hierarquia de componentes e a estratégia de componentização. Não escreva código ainda, apenas planeje e confirme sua compreensão do projeto antes de prosseguirmos. 
 
 
🧭 Cursor — Modo Execução Semi-Autônoma Guiada por Aprovação 
Você deve operar em modo semi-autônomo, sempre guiado por aprovação humana. 
________________ 
 
 
🔁 Fluxo Automático por Tarefa 
Ao receber uma sequência de prompts numerados, execute o seguinte fluxo para cada prompt: 
1. Gerar ToDo completo 
2. Executar o prompt atual 
3. Rodar npm run build (corrigir até passar) 
4. Informar o que foi implementado 
5. Parar e aguardar aprovação (“Fazer commit e documentar” ou ajustes) 
6. Atualizar DOCUMENTATION.md 
7. Depois do commit perguntar se pode seguir para o próximo prompt 
 
 
________________ 
 
 
🔒 Ciclo Obrigatório (ANTES de CADA Prompt) 
1. Reler Rules + Documentação 
2. Consultar Figma (layout + variáveis) 
3. Executar prompt 
4. npm run build (até sucesso) 
5. Informar e aguardar aprovação 
6. Documentar + Commit 
Nenhuma etapa pode ser pulada. 
________________ 
 
 
🎨 Hierarquia de Variáveis (CRÍTICO) 
Ordem obrigatória ao converter estilos do Figma: 
1º Variável SEMÂNTICA aplicada? 
 → Usar 
2º Variável PRIMITIVA aplicada? 
 → Usar 
3º Valor local (hex, px, etc)? 
 → Buscar semântica equivalente 
 → Se não existir, usar primitiva mais próxima 
 → NUNCA usar hardcoded 
 
 
Exemplos corretos / incorretos: 
Figma: var(--color-primary) → usar var(--color-primary) ✅ 
Figma: var(--gray-900) → usar var(--gray-900) ✅ 
Figma: #E5E5E5 → converter p/ --gray-200 ou --border-color ✅ 
Figma: 24px → converter p/ --spacing-md ou similar ✅ 
Figma: #E5E5E5 → usar #E5E5E5 ❌ 
 
 
________________ 
 
 
📤 Formato de Resposta (APÓS cada Prompt) 
✅ PROMPT [N]: [Nome] — CONCLUÍDO 
📚 PRÉ-EXECUÇÃO 
✓ Rules relidas 
✓ Figma consultado 
✓ Hierarquia de variáveis respeitada 
📦 IMPLEMENTADO 
- Item 1 
- Item 2 
🎨 TOKENS 
Semânticas: --color-primary, --spacing-container 
Primitivas: --gray-100, --spacing-md 
Conversões: 
- #F5F5F5 → --gray-50 
- 28px → --spacing-lg 
📁 ARQUIVOS 
- src/components/X.tsx 
- src/hooks/Y.ts 
🔨 BUILD 
✅ Sucesso (tentativas: 1) 
💾 COMMIT 
feat: descrição curta (hash: abc123) 
🤔 Avançar? 
⏭️ PROMPT [N+1]: [Nome] 
Comandos: "Próximo" | "Revisar [arquivo]" | "Refazer" 
 
 
 
 
________________ 
 
 
📘 DOCUMENTATION.md — Estrutura Padrão 
# mycash+ — Documentação 
## Progresso 
- [x] PROMPT 0: Análise 
- [x] PROMPT 1: Estrutura 
- [ ] PROMPT 2: Layout Desktop 
--- 
## PROMPT 1: Estrutura Base 
Status: ✅ | Data: DD/MM | Build: ✅ (1 tentativa) 
### Implementado 
- Estrutura de pastas 
- Componentes base 
### Tokens 
Semânticas: --color-bg, --spacing-page 
Primitivas: --gray-100, --spacing-md 
Conversões: 
- #FAFAFA → --gray-50 
- 28px → --spacing-lg 
### Build 
Tentativas: 1 | Erros: 0 
________________ 
 
 
🧠 Checklist Mental Pré-Execução 
□ Rules relidas 
□ Figma consultado 
□ Auto Layout entendido 
□ Hierarquia de variáveis definida 
□ Conversões mapeadas 
________________ 
 
 
💾 Padrão de Commits 
tipo: descrição curta 
* feat: nova funcionalidade 
* fix: correção 
* docs: documentação 
* refactor: refatoração 
________________ 
 
 
🕹️ Comandos Reconhecidos 
* Próximo 
* Revisar [arquivo] 
* Refazer 
* Status 
* Ver conversões 
________________ 
 
 
✅ Fazer | ❌ Não Fazer 
DEVE 
* Reler rules antes de cada prompt 
* Consultar Figma antes de cada prompt 
* Seguir hierarquia: semântica → primitiva → conversão 
* Documentar TODAS conversões 
* Build antes de commit 
* Aguardar aprovação entre prompts 
NÃO DEVE 
* Commit sem build OK 
* Usar hardcoded quando existir variável 
* Pular hierarquia 
* Avançar sem aprovação 
* Implementar fora do escopo 
________________ 
 
 
▶️ Primeira Ação ao Receber Prompts 
📋 [N] prompts recebidos 
[ ] PROMPT 0: Análise 
[ ] PROMPT 1: Estrutura 
... 
Iniciando execução congelada. 
________________ 
 
 
✅ Confirmação Obrigatória 
Responda exatamente: 
🤖 Modo Semi-Autônomo ATIVADO 
 
 
Fonte de verdade: Figma 
Hierarquia: semântica → primitiva → conversão 
Build obrigatório antes de commit 
Nunca usar hardcoded 
Pronto para receber todos os prompts. 
________________ 
 
 
Confirme entendimento completo da hierarquia de variáveis. 
________________ 
 
 
 
 
 
🏗️ PROMPT 1: Estrutura Base e Configuração 
Cursor, agora vamos criar a estrutura base do projeto: 
Configure a estrutura de pastas seguindo boas práticas de arquitetura React. Crie diretórios separados para componentes, contexts, hooks, types, utils e constants. Dentro de components, organize subpastas por domínio: layout (sidebar, header), dashboard, cards, modals, etc. 
Configure o Tailwind CSS para reconhecer e utilizar as variables do Figma como classes customizadas. Garanta que todos os tokens semânticos e primitivos estejam mapeados corretamente no arquivo de configuração do Tailwind. 
Crie os tipos TypeScript fundamentais que representam as cinco entidades principais do sistema: Transaction, Goal, CreditCard, BankAccount e FamilyMember. Cada tipo deve conter todos os campos descritos na documentação, com tipagens precisas incluindo tipos de união onde apropriado (exemplo: tipo de transação sendo "income" ou "expense"). 
Configure o React Router para gerenciar as cinco rotas principais do sistema, mantendo o conceito de single page application onde apenas o conteúdo central muda enquanto a estrutura de navegação permanece visível. 
📱 Requisitos de Responsividade: - Desktop (≥1024px): [comportamento] - Tablet (641-1023px): [comportamento] - Mobile (≤640px): [comportamento] 
________________ 
 
 
🎨 PROMPT 2: Sistema de Layout e Navegação Desktop 
Cursor, vamos implementar o sistema de navegação desktop com a sidebar: 
Crie o componente Sidebar que ocupa o lado esquerdo da tela com altura total do viewport. Este componente deve ter dois estados visuais distintos: expandido e colapsado. No estado expandido, mostre o logotipo completo "mycash+", os nomes das seções e as informações completas do perfil do usuário. No estado colapsado, mostre apenas o ícone do logotipo, ícones das seções e apenas o avatar do perfil. 
Implemente a lógica de alternância entre estados através de um botão circular posicionado na borda direita da sidebar. O ícone dentro do botão deve mudar de acordo com o estado atual: seta para esquerda quando expandida, seta para direita quando colapsada. 
Configure as transições suaves entre os dois estados. Quando a sidebar expande ou colapsa, o conteúdo principal à direita deve ajustar sua margem esquerda de forma fluida e animada. Todas as transições devem ter duração adequada para serem perceptíveis mas não lentas. 
Implemente o sistema de tooltip que aparece ao passar o mouse sobre itens de navegação quando a sidebar está colapsada. O tooltip deve aparecer ao lado direito do item com leve delay e conter o nome completo da seção. 
Adicione o comportamento de item ativo: o item de navegação correspondente à seção atual deve ter fundo preto com texto branco e ícone verde-limão. Itens inativos devem ter fundo transparente com texto cinza. 
Utilize exclusivamente as variables do design system do Figma para todas as cores, espaçamentos, tamanhos de fonte e raios de borda. Priorize sempre tokens semânticos e, quando não disponíveis, utilize tokens primitivos. 
📱 Requisitos de Responsividade: - Desktop (≥1024px): [comportamento] - Tablet (641-1023px): [comportamento] - Mobile (≤640px): [comportamento] 
________________ 
 
 
📱 PROMPT 3: Sistema de Layout e Navegação Mobile 
Cursor, agora vamos criar a versão mobile da navegação: 
Implemente o componente HeaderMobile que substitui completamente a sidebar em viewports menores que 1024 pixels. Este header deve ser fixo no topo, ocupar largura total e permanecer visível mesmo durante scroll. 
O header deve conter o logotipo "mycash+" à esquerda em tamanho apropriado para mobile e o avatar do usuário à direita. O avatar deve ser clicável e funcionar como trigger para o menu dropdown. 
Crie o componente MenuDropdown que aparece quando o avatar é tocado. Este menu deve deslizar de cima para baixo com animação suave e cobrir o conteúdo abaixo sem ocupar a tela inteira (não é fullscreen). 
Dentro do dropdown, liste todos os itens de navegação com ícone e texto. O item da seção atual deve aparecer destacado com fundo preto. Adicione um botão vermelho "Sair" na parte inferior do menu para logout. 
Implemente a lógica de fechamento do menu: deve fechar ao clicar em qualquer item de navegação, ao clicar no botão X no canto superior direito do menu, ou ao clicar/tocar fora da área do menu no overlay escuro semi-transparente. 
Configure os breakpoints corretamente para que em desktop (acima de 1024px) apenas a sidebar apareça, e em mobile/tablet (abaixo de 1024px) apenas o header apareça. Nunca devem aparecer simultaneamente. 
Utilize as variables do design system para todos os estilos visuais, respeitando a hierarquia de tokens semânticos primeiro, primitivos depois. 
📱 Requisitos de Responsividade: - Desktop (≥1024px): [comportamento] - Tablet (641-1023px): [comportamento] - Mobile (≤640px): [comportamento] 
________________ 
 
 
💾 PROMPT 4: Context Global e Gerenciamento de Estado 
 
⚠️ REGRA CRÍTICA DE ARMAZENAMENTO: Este sistema NÃO suporta localStorage, sessionStorage ou qualquer browser storage API. TODO o estado deve ser gerenciado EXCLUSIVAMENTE via React state (useState, useReducer). Os dados são temporários e existem apenas durante a sessão do navegador. Futuramente, integraremos com Supabase para persistência real. Cursor, vamos criar o coração do sistema - o gerenciamento de estado global: 
Crie um Context Provider chamado FinanceProvider que vai armazenar e gerenciar todo o estado da aplicação. Este provider deve ser colocado no nível mais alto da árvore de componentes para que todos possam acessá-lo. 
Dentro deste context, mantenha os cinco arrays principais: transactions, goals, creditCards, bankAccounts e familyMembers. Cada array deve ser tipado corretamente com os tipos TypeScript que você criou anteriormente. 
Implemente as funções CRUD básicas para cada entidade: adicionar novo item, atualizar item existente, deletar item. Estas funções devem atualizar os arrays no estado e, consequentemente, causar re-renderização de todos os componentes que dependem desses dados. 
Crie um segundo conjunto de estados para os filtros globais: selectedMember (ID do membro ou null), dateRange (objeto com startDate e endDate), transactionType (string podendo ser "all", "income" ou "expense"), e searchText (string para busca textual). 
Implemente funções de cálculo derivadas que outros componentes vão consumir. Estas funções devem aplicar automaticamente todos os filtros ativos antes de calcular: 
* getFilteredTransactions: retorna array de transações após aplicar todos os filtros ativos 
* calculateTotalBalance: soma saldos de contas e subtrai faturas de cartões 
* calculateIncomeForPeriod: soma todas as receitas do período filtrado 
* calculateExpensesForPeriod: soma todas as despesas do período filtrado 
* calculateExpensesByCategory: agrupa despesas por categoria e retorna array ordenado por valor decrescente 
* calculateCategoryPercentage: para cada categoria, calcula percentual em relação à receita total 
* calculateSavingsRate: calcula (receitas - despesas) / receitas × 100 
Crie um hook customizado useFinance que encapsula o useContext e fornece acesso limpo a todo o estado e funções. Este hook deve ser o único ponto de acesso ao contexto em toda a aplicação. 
Popule o estado inicial com dados mock realistas seguindo as especificações da documentação: três membros da família brasileira, três cartões de bancos conhecidos, vinte a trinta transações distribuídas nos últimos três meses, quatro objetivos variados, e categorias padrão brasileiras. 
 
NÃO use localStorage, sessionStorage ou qualquer browser storage API. Use apenas React state (useState, useReducer) para armazenamento em memória. 
________________ 
 
 
📊 PROMPT 5: Cards de Resumo Financeiro 
Cursor, vamos criar os três cards de resumo que aparecem no topo do dashboard: 
Implemente o componente BalanceCard (Card de Saldo Total) com fundo completamente preto e texto branco. Este card deve ter destaque visual através de um elemento decorativo de fundo: um círculo grande desfocado (blur intenso) na cor verde-limão com opacidade baixa, parcialmente cortado pelas bordas do card. 
No topo do card coloque um label pequeno "Saldo Total" em cinza claro. Abaixo, em fonte muito grande, mostre o valor do saldo total formatado como moeda brasileira completa com cifrão, separador de milhar com ponto e decimais com vírgula. 
Abaixo do valor adicione um badge arredondado com fundo semi-transparente branco contendo um ícone de gráfico crescente e texto mostrando crescimento percentual comparado ao mês anterior (por exemplo "+12% esse mês"). Este cálculo deve comparar o saldo atual com o saldo de 30 dias atrás. 
O valor exibido deve vir da função calculateTotalBalance do contexto global e atualizar automaticamente quando filtros mudarem. 
Crie o componente IncomeCard (Card de Receitas) com fundo branco e borda sutil. No topo à esquerda coloque label "Receitas" em preto negrito. No topo à direita adicione um círculo com fundo cinza claro contendo ícone de seta diagonal apontando para baixo-esquerda, simbolizando entrada de dinheiro. 
Abaixo, em fonte grande e negrito, mostre o valor total das receitas formatado como moeda. Este valor deve vir da função calculateIncomeForPeriod e respeitar os filtros ativos. 
Crie o componente ExpenseCard (Card de Despesas) com estrutura similar ao de receitas mas com diferenças visuais: label "Despesas" em cinza médio, ícone em círculo com fundo vermelho muito claro mostrando seta diagonal apontando para cima-direita simbolizando saída. 
O valor deve vir de calculateExpensesForPeriod e também respeitar os filtros. 
Organize estes três cards horizontalmente no desktop e verticalmente no mobile. No desktop devem ter larguras proporcionais (o card de saldo pode ser um pouco maior). No mobile cada card ocupa largura total. 
Implemente animações suaves de contagem nos valores: quando um valor muda devido a filtros ou novos dados, anime de zero até o valor final em aproximadamente 800ms, mostrando números intermediários rapidamente. 
Siga rigorosamente a hierarquia de variáveis das Project Rules. 
________________ 
 
 
🎯 PROMPT 6: Header do Dashboard com Controles 
Cursor, vamos implementar a barra de controles no topo do dashboard: 
Crie o componente DashboardHeader que contém todos os controles de filtro e ação. Este componente deve ser uma barra horizontal responsiva que se adapta conforme o tamanho da tela. 
Implemente o campo de busca à esquerda com ícone de lupa. O campo deve ter placeholder "Pesquisar..." e largura fixa no desktop, ocupando largura total no mobile. Configure busca em tempo real: a cada caractere digitado, dispare a atualização do filtro searchText no contexto global sem necessidade de pressionar Enter. 
A busca deve ser case-insensitive e procurar correspondências parciais tanto na descrição quanto na categoria das transações. 
Adicione o botão de filtros ao lado da busca: botão circular com ícone de controles deslizantes. No desktop este botão abre um popover flutuante abaixo dele. No mobile abre um modal fullscreen que desliza de baixo para cima. 
Crie o componente FilterPopover para desktop com fundo branco semi-transparente e efeito glassmorphism (backdrop blur). Dentro coloque uma seção "Tipo de Transação" com três opções de rádio: "Todos", "Receitas", "Despesas". A opção selecionada deve ter fundo preto com texto branco. Ao clicar em uma opção, atualize imediatamente o filtro transactionType no contexto global. 
Implemente o seletor de período: botão que mostra o período atual formatado como "01 jan - 31 jan, 2024". Ao clicar, abra um calendário interativo. No desktop mostre dois meses lado a lado. No mobile mostre um mês por vez com setas de navegação. 
O calendário deve permitir seleção de intervalo: primeiro clique define data inicial, segundo clique define data final. O intervalo selecionado fica destacado visualmente. Adicione botões de atalho rápido: "Este mês", "Mês passado", "Últimos 3 meses", "Este ano" que definem automaticamente o intervalo correspondente. 
Quando o usuário confirma a seleção (clicando fora ou em OK), atualize o filtro dateRange no contexto e o texto do botão para refletir o novo período. 
Crie o widget de membros da família: mostre os avatares circulares dos membros parcialmente sobrepostos criando efeito de pilha. Cada avatar tem borda branca para destacar. Ao passar o mouse, o avatar cresce levemente e move-se para frente. 
Ao clicar em um avatar, aplique o filtro de membro: o avatar selecionado ganha borda preta grossa e ícone de check verde no canto inferior direito. Todo o dashboard filtra para mostrar apenas dados daquele membro. Clicar novamente remove o filtro. 
Adicione um botão circular com "+" após os avatares que abre o modal de adicionar novo membro. 
No canto direito coloque o botão de destaque "Nova Transação" com fundo preto e texto branco, ícone de "+" incluído. No mobile este botão ocupa largura total com altura maior para facilitar toque. 
Utilize as variables do design system rigorosamente para todos os estilos. 
________________ 
 
 
🍩 PROMPT 7: Carrossel de Gastos por Categoria 
Cursor, vamos criar o widget de categorias com gráficos donut: 
Implemente o componente ExpensesByCategoryCarousel que processa e exibe despesas agrupadas por categoria. Este componente deve buscar os dados da função calculateExpensesByCategory do contexto global, que retorna um array já filtrado e ordenado. 
Para cada categoria retornada, calcule o percentual que ela representa em relação à receita total do período usando calculateCategoryPercentage. Se a receita total for zero, trate este caso retornando 0% para evitar divisão por zero. 
Crie o componente CategoryDonutCard que representa visualmente cada categoria. Cada card deve ter fundo branco, borda cinza clara, largura fixa de 160px e altura automática. Os cards ficam alinhados horizontalmente com espaço entre eles. 
No topo de cada card renderize um gráfico donut com diâmetro de 64 pixels. O donut deve ter anel externo colorido representando o percentual e anel interno vazio (branco). A cor do anel externo vem de um array de cores que rota: primeira categoria verde-limão, segunda preta, terceira cinza médio, e assim por diante. 
No centro exato do donut, sobreposto, mostre o percentual calculado em texto formatado com uma casa decimal: "30.0%". 
Abaixo do donut, centralizado, mostre o nome da categoria em texto pequeno. Se o nome for muito longo e não couber na largura do card, truncue com reticências. 
Abaixo do nome mostre o valor total da categoria formatado como moeda brasileira. 
Configure o carrossel para ser scrollável horizontalmente. Implemente três formas de navegação: mouse wheel que move horizontalmente ao girar a rodinha, clique e arrasta para deslizar manualmente, e setas de navegação que aparecem quando o mouse está sobre a área do carrossel. 
As setas devem ser botões circulares flutuantes com fundo branco e sombra, um à esquerda e outro à direita. Clicar neles desloca o carrossel aproximadamente 200 pixels na direção correspondente. As setas desaparecem quando o mouse sai da área. 
Adicione gradiente de máscara nas bordas: a borda esquerda e direita do carrossel ficam progressivamente transparentes, criando efeito fade e indicando visualmente que há mais conteúdo para scrollar. 
Implemente hover nos cards individuais: quando o mouse passa sobre um card, sua borda muda de cinza clara para verde-limão. 
No mobile remova as setas de navegação e permita apenas scroll por toque/deslize, comportamento natural em dispositivos touch. 
Utilize variables do design system para todas as cores, espaçamentos e tamanhos. 
________________ 
 
 
📈 PROMPT 8: Gráfico de Fluxo Financeiro 
Cursor, vamos criar o gráfico de evolução de receitas e despesas: 
Implemente o componente FinancialFlowChart usando uma biblioteca de gráficos que suporte gráficos de área responsivos (sugiro Recharts). Este componente deve ser um card grande contendo título, legenda e o gráfico propriamente dito. 
No topo do card coloque título "Fluxo Financeiro" com ícone de gráfico crescente à esquerda. À direita adicione uma legenda horizontal mostrando dois itens: círculo pequeno verde-limão com texto "Receitas" e círculo preto com texto "Despesas". 
Configure o gráfico com altura fixa de 300 pixels e largura responsiva ocupando 100% do card. O fundo deve ser cinza claro muito suave. 
Configure dois eixos: eixo horizontal (X) mostrando os nomes dos meses abreviados (Jan, Fev, Mar, etc) na parte inferior com fonte pequena e cor cinza média. Eixo vertical (Y) mostrando valores monetários formatados de forma compacta (R$ 2k, R$ 4k, R$ 6k, etc) do lado esquerdo. 
Adicione linhas horizontais tracejadas muito sutis (cinza claríssimo) atravessando o gráfico em cada marca do eixo Y, criando grid que facilita leitura sem poluir visualmente. 
Renderize duas áreas representando receitas e despesas. A área de receitas deve ter linha de borda verde-limão com 3 pixels de espessura conectando os pontos com curva suave. O preenchimento abaixo usa gradiente vertical: topo com verde-limão 30% opaco, base transparente. 
A área de despesas tem linha de borda preta com 3 pixels de espessura, também com curva suave. O preenchimento usa gradiente: topo com preto 10% opaco, base transparente. A opacidade menor garante que ambas áreas sejam visíveis quando sobrepostas. 
Implemente tooltip interativo: quando o mouse se move sobre o gráfico, uma linha vertical fina cinza clara acompanha o cursor. Ao parar sobre um ponto, mostre tooltip flutuante com fundo branco, sombra elevada e bordas arredondadas. 
Dentro do tooltip exiba três linhas: nome do mês em negrito, "Receitas: R$ X.XXX,XX" em verde escuro, e "Despesas: R$ X.XXX,XX" em preto. Valores formatados com moeda completa. 
Por enquanto use dados mock fixos para sete meses. Estruture o código de forma que no futuro estes dados possam vir de transações reais agrupadas por mês. 
Utilize variables do design system para todas as cores e espaçamentos. 
________________ 
 
 
💳 PROMPT 9: Widget de Cartões de Crédito 
Cursor, vamos criar o widget que exibe os cartões de crédito: 
Implemente o componente CreditCardsWidget com container de fundo cinza muito claro, bordas amplamente arredondadas e espaçamento interno confortável. Este widget deve se destacar visualmente do restante do dashboard através de contraste de fundo. 
No header do widget coloque ícone simples de cartão de crédito à esquerda seguido do título "Cartões" com tipografia legível e peso médio. À direita adicione botão circular com fundo branco, bordas arredondadas e ícone "+". Este botão abre o modal de criação de novo cartão. 
Configure hover no botão: fundo muda suavemente para cinza claro mantendo ícone contrastante. 
Abaixo do header renderize a lista de cartões verticalmente. Cada cartão deve vir do array creditCards do contexto global e ser exibido como um card independente com fundo branco, cantos arredondados e sombra suave. 
Estruture cada card de cartão horizontalmente em três zonas: ícone à esquerda, informações ao centro e indicador de uso à direita. 
À esquerda crie um bloco visual quadrado com cantos arredondados que recebe a cor do tema do cartão (preto, verde-limão ou branco com borda). Dentro deste bloco mostre ícone de cartão em estilo outline com cor contrastante ao fundo. 
Ao centro organize verticalmente: primeira linha com nome do cartão/banco em fonte menor e cor neutra, abaixo o valor da fatura atual em fonte maior, peso forte e cor escura formatado como moeda brasileira, e por último o final do número mascarado no formato "•••• 1234" em fonte menor e cor suave. 
À direita crie um badge circular ou levemente oval com texto centralizado mostrando o percentual de uso calculado como (fatura atual ÷ limite total) × 100, arredondado para inteiro e seguido de "%". A cor do badge varia com o tema do cartão, sempre garantindo contraste adequado. 
Implemente interatividade: ao passar mouse sobre um card, ele eleva levemente no eixo vertical (translateY -4px ou -8px) acompanhado de aumento sutil da sombra. Transição suave de 200-300ms. Cursor muda para ponteiro indicando clicabilidade. 
Ao clicar em um card, abra o modal de detalhes do cartão mostrando informações completas. 
Se houver mais de três cartões visíveis, implemente paginação simples abaixo da lista com controles de avançar/voltar e indicador de página atual. No mobile suporte também gesto de swipe horizontal. 
Utilize rigorosamente variables do design system para cores, espaçamentos, tamanhos e raios de borda. 
________________ 
 
 
 
📋 PROMPT 10: Widget de Próximas Despesas 
Cursor, vamos criar o widget de próximas despesas com lista cronológica de contas a pagar: 
Crie um widget com fundo branco, borda clara e cantos arredondados. No header mostre à esquerda um ícone de carteira (20px) seguido do título "Próximas despesas" em texto grande e negrito. À direita adicione um botão circular (40px de diâmetro) com ícone "+" e borda clara. Ao clicar neste botão, abra o modal de adicionar nova transação. 
No corpo do widget renderize uma lista vertical de despesas pendentes. Busque todas as transações do tipo "despesa" que ainda não foram pagas. Ordene estas despesas por data de vencimento em ordem crescente, mostrando as mais próximas do vencimento no topo. 
Cada item da lista ocupa uma linha horizontal com padding vertical generoso. Separe os itens com uma linha divisória fina cinza clara. Estruture cada item em duas colunas principais: 
Do lado esquerdo empilhe verticalmente três informações: Na primeira linha mostre o título ou descrição da despesa em texto negrito médio. Na segunda linha mostre a data de vencimento formatada como "Vence dia DD/MM" em texto menor cinza escuro. Na terceira linha mostre o nome da conta ou cartão de onde será debitado em texto pequeno cinza claro. 
Para identificar a origem do pagamento, implemente uma lógica: se for conta bancária, mostre apenas o nome como "Nubank conta". Se for cartão de crédito, mostre no formato "Crédito [Banco] **** [últimos 4 dígitos]" como "Crédito Nubank **** 5897". 
Do lado direito alinhe à direita: Mostre o valor em texto grande e negrito no formato "R$ XXX,XX". Abaixo do valor posicione um botão circular (32px) com borda cinza, fundo transparente e ícone de check (✓) centralizado. 
Configure o botão de check para que ao passar o mouse apareça fundo verde claro, borda verde e ícone verde. Ao clicar no botão, execute as seguintes ações: 
Primeiro, marque a despesa como paga atualizando seu status no sistema. Segundo, anime o botão com as cores verdes. Terceiro, remova o item da lista com animação suave de desaparecimento. Quarto, se a despesa for recorrente (como assinaturas mensais), crie automaticamente uma nova ocorrência para o próximo mês com a mesma data de vencimento mas status pendente. Quinto, se a despesa for parcelada, verifique se há próxima parcela e atualize o contador. Sexto, exiba mensagem de confirmação "Despesa marcada como paga!". 
Quando não houver nenhuma despesa pendente na lista, mostre uma área centralizada com ícone de check circular verde, mensagem "Nenhuma despesa pendente" em texto cinza claro e borda tracejada cinza suave ao redor da área. 
Por enquanto use dados fictícios de despesas pendentes com diferentes datas de vencimento para testar se a ordenação está funcionando corretamente. No futuro estas despesas serão buscadas automaticamente do sistema baseadas em transações recorrentes e parcelas de compras. 
Utilize as variáveis do design system para cores, espaçamentos e tamanhos. Mantenha consistência visual com os demais widgets da dashboard. 
________________ 
 
 
 
 
📋 PROMPT 11: Tabela de Transações Detalhada 
Cursor, vamos criar a tabela completa de transações no dashboard: 
Implemente o componente TransactionsTable começando com um header horizontal. À esquerda coloque título "Extrato Detalhado" em fonte grande e negrito. À direita adicione controles de busca e filtro específicos desta tabela. 
Crie campo de busca local com ícone de lupa, placeholder "Buscar lançamentos..." e largura média (256px no desktop, 100% no mobile). Configure busca em tempo real que filtra conforme usuário digita, procurando correspondências em descrição OU categoria. 
Ao lado da busca adicione select de tipo: dropdown com opções "Todos", "Receitas", "Despesas". Largura fixa de 140px no desktop e 100% no mobile. Ao selecionar uma opção, filtre a tabela mostrando apenas transações daquele tipo. 
Configure a estrutura da tabela com borda clara arredondada contornando toda ela. O header da tabela (linha com nomes das colunas) tem fundo cinza claro se diferenciando das linhas de dados. 
Defina sete colunas: 
Avatar: estreita (50px) mostrando foto circular pequena (24px) do membro responsável. Se não houver, mostre ícone de usuário genérico. 
Data: mostra data formatada como "DD/MM/AAAA" em texto cinza médio. 
Descrição: mostra ícone indicativo do tipo seguido da descrição textual. Para receitas, ícone é seta diagonal para baixo-esquerda em círculo com fundo verde claro. Para despesas, ícone é seta diagonal para cima-direita em círculo com fundo vermelho claro. Descrição em texto negrito preto. 
Categoria: nome da categoria em badge arredondado com fundo cinza claro e texto cinza médio. 
Conta/Cartão: nome da conta bancária ou cartão vinculado em texto cinza médio. Busque primeiro em bankAccounts; se não encontrar, busque em creditCards; se não encontrar em nenhuma, mostre "Desconhecido". 
Parcelas: se transação foi parcelada, mostre "3x", "6x", etc. Se foi à vista (installments = 1), mostre apenas "-". 
Valor: alinhado à direita, mostra valor com prefixo de sinal. Receitas têm "+" em verde. Despesas têm "-" em preto. Fonte negrito. Formatação completa de moeda brasileira. 
Configure zebra striping sutil: linhas alternam entre fundo completamente branco e fundo com levíssimo cinza para facilitar leitura. 
Implemente hover nas linhas: ao passar mouse, linha inteira fica com fundo cinza claro mais perceptível, destacando a linha. 
Crie a lógica de filtragem combinada. A tabela deve considerar: 
Filtros globais do contexto: se há filtro de membro ativo, mostre apenas transações daquele membro. Se há filtro de período ativo, mostre apenas transações dentro do intervalo. 
Filtros locais da tabela: busca textual adiciona mais filtro procurando em descrição OU categoria. Select de tipo filtra por income ou expense. 
Todos estes filtros trabalham em conjunto (AND lógico). Uma transação só aparece se passar por TODOS os filtros. 
Configure ordenação: transações sempre ordenadas por data em ordem decrescente (mais recente primeiro). 
Implemente paginação mostrando apenas 5 transações por vez. Abaixo da tabela, à esquerda, mostre contador: "Mostrando 1 a 5 de 47" indicando quais itens estão visíveis e total existente. 
À direita adicione controles de navegação: botão Anterior (seta esquerda), números de página clicáveis, botão Próxima (seta direita). A página atual tem fundo preto com texto branco. Outras páginas têm fundo transparente com texto cinza médio. 
Se houver mais de 7 páginas, mostre apenas primeiras 3, reticências "...", e últimas 2. Sempre mostre página atual e adjacentes. 
Botões Anterior/Próxima ficam disabled (cor cinza clara, cursor normal) quando não aplicáveis (primeira/última página respectivamente). 
Ao mudar página, role suavemente até o topo da tabela e carregue novas 5 transações com leve fade-in. 
Quando qualquer filtro muda, resete automaticamente para página 1 e recalcule total de páginas baseado no novo número de transações filtradas. 
Se após aplicar todos os filtros não houver transações, mostre linha especial ocupando todas as colunas com altura generosa (96px) e mensagem centralizada em cinza médio: "Nenhum lançamento encontrado." 
Busque dados de getFilteredTransactions do contexto global que já aplica filtros globais. Adicione então os filtros locais da tabela. 
Utilize variables do design system para todas as cores, espaçamentos e tamanhos. 
________________ 
 
 
🗂️ PROMPT 12: Modal de Nova Transação 
 
 
Cursor, vamos criar o modal completo para adicionar transações: 
Implemente o modal que aparece em tela cheia ocupando 100% da largura e altura da viewport com fundo branco. Divida em três áreas: header fixo no topo, conteúdo scrollável no centro e footer fixo na base. 
No header crie um layout horizontal com padding generoso e borda inferior sutil. À esquerda mostre um ícone grande em círculo (64px) que muda conforme o tipo: se receita, use fundo verde-limão com ícone de seta para baixo-esquerda; se despesa, use fundo preto com ícone de seta para cima-direita em branco. Ao lado do ícone empilhe verticalmente o título "Nova Transação" em fonte muito grande e negrito, e abaixo um subtítulo descritivo em texto menor cinza. À direita do header coloque botão circular grande (48px) com ícone X para fechar. 
No conteúdo crie área scrollável com fundo levemente cinza e conteúdo centralizado em largura máxima (600-700px). Organize o formulário verticalmente com espaçamento generoso entre campos: 
Toggle de tipo no topo: dois botões grandes lado a lado em container com fundo cinza claro e cantos arredondados. "Receita" à esquerda e "Despesa" à direita. Apenas um selecionado por vez. Selecionado tem fundo branco com sombra sutil. Não selecionado tem fundo transparente com texto cinza. 
Campo de valor: input numérico grande (altura 56px) com label "Valor da Transação" acima. Adicione símbolo "R$" fixo à esquerda dentro do input. Campo obrigatório com bordas arredondadas e fundo branco. 
Campo de descrição: input de texto grande (altura 56px) com label "Descrição" e placeholder "Ex: Supermercado Semanal". Campo obrigatório. 
Campo de categoria: dropdown grande com label "Categoria". No topo da lista de opções adicione botão "+ Nova Categoria" que ao clicar revela inline um input de texto com botão de confirmar e cancelar para criar categoria na hora. Filtre categorias conforme tipo selecionado: se receita, mostre apenas categorias de receita; se despesa, mostre apenas categorias de despesa. Campo obrigatório. 
Crie grid de duas colunas para os próximos dois campos: 
Coluna 1 - Select de membro: dropdown com label "Membro". Liste todos os membros da família com opção "Família (Geral)" no topo que define memberId como null. Campo opcional. 
Coluna 2 - Select de conta/cartão: dropdown com label "Conta / Cartão". Agrupe as opções em duas seções com headers: "Contas Bancárias" listando todas as contas, e "Cartões de Crédito" listando todos os cartões. Campo obrigatório. 
Campo de parcelamento condicional: este campo só aparece se a conta selecionada for um cartão de crédito E o tipo for despesa. Quando aparecer, use animação suave de fade-in deslizando de cima. Mostre dropdown com label "Parcelamento" contendo opções "À vista (1x)" e depois "2x" até "12x". Se o usuário marcar o checkbox de despesa recorrente (descrito abaixo), desabilite este campo e mostre texto pequeno em itálico "Parcelamento desabilitado para despesas recorrentes". 
Checkbox de despesa recorrente: este campo só aparece se o tipo for despesa. Crie um container destacado com fundo azul (#3247FF) muito suave, borda azul sutil e cantos arredondados. Dentro mostre checkbox à esquerda e à direita label em negrito "Despesa Recorrente" com ícone de repetição, e abaixo texto explicativo pequeno em cinza. Se o parcelamento estiver em mais de 1x, desabilite este checkbox e mude o texto explicativo para "Não disponível para compras parceladas". Quando o usuário marcar este checkbox, force o parcelamento a voltar para 1x automaticamente. 
No footer com fundo branco e borda superior sutil, alinhe dois botões à direita: "Cancelar" com borda e fundo transparente com cantos arredondados totais (pill), e "Salvar Transação" com fundo preto, texto branco e cantos arredondados totais (pill) mais largo com padding horizontal generoso. 
Implemente validação ao clicar em "Salvar Transação": 
Valor: deve ser maior que zero. Se inválido, mostre mensagem de erro abaixo em vermelho e borda vermelha no campo. 
Descrição: deve ter pelo menos 3 caracteres. Se menor, mostre erro abaixo do campo. 
Categoria: deve estar selecionada. Se vazia, mostre erro. 
Conta: deve estar selecionada. Se vazia, mostre erro. 
Se houver erro, não submeta. Se todas validações passarem, crie novo objeto de transação com ID único, tipo, valor, descrição, categoria, data atual, accountId, memberId (ou null), número de parcelas (1 se não for cartão ou se for à vista), status "completed", isRecurring (true se checkbox marcado), e isPaid false. 
Adicione ao array de transações no contexto global. Feche o modal com animação deslizante para baixo. Mostre notificação toast "Transação registrada com sucesso!" com ícone de check. 
Limpe o formulário para próxima abertura. Se usuário clicar em cancelar, X ou overlay, feche sem salvar. 
Utilize variables do design system para cores, espaçamentos e tamanhos. 
 
 
 
________________ 
 
👥 PROMPT 13: Modal de Adicionar Membro 
Cursor, vamos criar o modal para adicionar membros da família: 
Implemente o componente AddMemberModal com estrutura similar ao modal de transação: overlay escuro, modal centralizado branco com header, conteúdo e footer. 
No header coloque título "Adicionar Membro da Família" e botão X. No footer botões "Cancelar" e "Adicionar Membro". 
No conteúdo crie formulário com os seguintes campos: 
Nome completo: input de texto obrigatório com label "Nome Completo" e placeholder "Ex: João Silva". Validação: mínimo 3 caracteres. 
Função/papel: input de texto obrigatório com label "Função na Família" e placeholder "Ex: Pai, Mãe, Filho, Avô...". Configure como combobox que permite texto livre mas oferece sugestões comuns em dropdown: "Pai", "Mãe", "Filho", "Filha", "Avô", "Avó", "Tio", "Tia". 
Avatar: crie campo especial com duas abas/opções: 
"URL": input de texto onde usuário cola URL de imagem da internet "Upload": botão para fazer upload de arquivo (aceita JPG, PNG, max 5MB) 
Se nenhuma imagem for fornecida, use avatar padrão genérico do sistema. Campo opcional. 
Renda mensal: input numérico opcional com label "Renda Mensal Estimada (opcional)" e formatação automática de moeda. Campo usado para planejamento futuro mas não obrigatório. 
Implemente validação ao clicar em "Adicionar Membro": 
Nome: obrigatório, mínimo 3 caracteres. Erro: "Por favor, insira um nome válido". Função: obrigatória. Erro: "Por favor, informe a função na família". 
Se válido, crie novo objeto de membro com ID único gerado, nome, função, URL do avatar (ou URL de avatar padrão se não fornecido) e renda (ou zero se não informado). 
Adicione ao array familyMembers do contexto global usando função apropriada. 
Feche modal com fade-out. Mostre toast de sucesso: "Membro adicionado com sucesso!". 
O novo membro aparece imediatamente nos avatares do header do dashboard e nos dropdowns de seleção de membro em formulários. 
Se clicar em cancelar/X/fora, feche sem salvar. 
Utilize variables do design system para estilos. 
________________ 
 
 
💳 PROMPT 14: Modal de Adicionar Cartão 
 
Cursor, vamos criar o modal para adicionar contas bancárias e cartões de crédito: 
Implemente modal centralizado sobre overlay escuro semi-transparente. Modal tem fundo branco, bordas arredondadas generosas, sombra forte e largura média (500-600px no desktop, 90% da tela no mobile). 
Divida em três áreas: header fixo, conteúdo scrollável e footer fixo. 
No header coloque título "Adicionar Conta/Cartão" à esquerda em fonte grande e negrito, e botão circular pequeno com ícone X à direita. Separe do conteúdo com borda inferior sutil. 
No footer coloque dois botões: "Cancelar" à esquerda (borda e fundo transparente) e "Adicionar" à direita (fundo preto e texto branco). 
No conteúdo crie formulário vertical: 
Toggle de tipo no topo: dois botões grandes lado a lado ocupando largura total. "Conta Bancária" à esquerda e "Cartão de Crédito" à direita. Apenas um selecionado por vez. Selecionado tem fundo preto com texto branco. Não selecionado tem fundo branco com borda e texto cinza. 
Campo de nome: input de texto grande com label "Nome da Conta" (se conta bancária) ou "Nome do Cartão" (se cartão de crédito) e placeholder "Ex: Nubank Conta" ou "Ex: Nubank Mastercard". Campo obrigatório com mínimo 3 caracteres. 
Campo de titular: dropdown obrigatório com label "Titular". Liste todos os membros da família cadastrados. Campo obrigatório - deve selecionar quem é o dono principal desta conta ou cartão. 
Campos condicionais para Conta Bancária: 
Saldo inicial: input numérico com label "Saldo Inicial" e formatação automática de moeda. Campo obrigatório. 
Campos condicionais para Cartão de Crédito: 
Dia de fechamento: input numérico com label "Dia de Fechamento" e placeholder "1 a 31". Aceita apenas inteiros entre 1 e 31. Campo obrigatório. 
Dia de vencimento: input numérico com label "Dia de Vencimento" e placeholder "1 a 31". Aceita apenas inteiros entre 1 e 31. Campo obrigatório. 
Limite total: input numérico com label "Limite Total" e formatação automática de moeda. Campo obrigatório, deve ser maior que zero. 
Últimos 4 dígitos: input numérico opcional com label "Últimos 4 Dígitos (opcional)". Aceita exatamente 4 dígitos. Ajuda identificar cartão físico. 
Tema visual para cartão: seção com label "Tema Visual" e três cards clicáveis lado a lado: retângulo com fundo preto e label "Black", retângulo com fundo verde-limão e label "Lime", retângulo com fundo branco com borda e label "White". Usuário clica no tema desejado. Apenas um selecionado por vez com borda destacada azul. Campo obrigatório para cartões. 
Implemente validação ao clicar em "Adicionar": 
Nome: obrigatório, mínimo 3 caracteres. 
Titular: obrigatório, deve selecionar um membro. 
Se conta bancária: saldo inicial obrigatório. 
Se cartão: fechamento entre 1-31, vencimento entre 1-31, limite maior que zero, tema selecionado. 
Se inválido, mostre erros abaixo dos campos com borda vermelha. Se válido, crie objeto com ID único, nome, tipo (account ou creditCard), holderId do membro selecionado, e campos específicos conforme tipo. 
Se conta: balance com saldo inicial. 
Se cartão: closingDay, dueDay, limit, currentBill zero, theme, lastDigits. 
Adicione ao array apropriado (accounts ou creditCards) no contexto global. Feche modal. Toast de sucesso: "Conta adicionada com sucesso!" ou "Cartão adicionado com sucesso!". 
Nova conta/cartão aparece imediatamente nos dropdowns de seleção e widgets da dashboard. 
Utilize variables do design system para estilos. 
 
 
________________ 
 
 
📊 PROMPT 15: Modal de Detalhes do Cartão 
Cursor, vamos criar o modal que mostra informações completas do cartão: 
Implemente o componente CardDetailsModal que abre ao clicar em qualquer cartão no widget. Este modal é maior que os anteriores (largura média-grande) para acomodar mais informações. 
No header mostre o nome do cartão como título e botão X à direita. 
Divida o conteúdo em duas áreas principais: 
Área de informações: seção superior com cards ou lista organizada mostrando: 
Limite total formatado como moeda Fatura atual formatada como moeda Limite disponível calculado como (limite - fatura) e formatado como moeda Percentual de uso calculado como (fatura ÷ limite) × 100 com uma casa decimal Data de fechamento formatada como "Dia DD" Data de vencimento formatada como "Dia DD" Últimos 4 dígitos se cadastrado, no formato "•••• 1234" 
Organize estas informações em grid responsivo de 2 ou 3 colunas no desktop, coluna única no mobile. Cada informação em card pequeno com label em cinza médio e valor em preto negrito. 
Adicione também representação visual do uso do limite: pode ser gráfico donut grande mostrando percentual usado versus disponível, ou barra de progresso horizontal com preenchimento proporcional ao uso. 
Área de despesas: seção inferior contendo tabela que lista todas as transações de despesa vinculadas a este cartão. 
Filtre o array de transações do contexto global mantendo apenas aquelas onde type = "expense" E accountId igual ao ID deste cartão. 
Renderize tabela simplificada com colunas: Data, Descrição, Categoria, Parcelas e Valor. Similar à tabela principal do dashboard mas focada apenas neste cartão. Use mesma formatação e estilos. 
Se houver muitas despesas (mais de 10), implemente paginação mostrando 10 por vez com controles similares à tabela principal. 
Se não houver despesas vinculadas, mostre mensagem: "Nenhuma despesa registrada neste cartão ainda." 
Na área inferior ou superior do modal adicione botões de ação: 
"Ver Extrato Completo": navega para view de transações aplicando automaticamente filtro deste cartão "Adicionar Despesa": abre modal de nova transação com campo de conta pré-preenchido com este cartão "Editar Cartão": abre formulário para editar informações do cartão (nome, limite, datas, etc) "Fechar": fecha o modal voltando ao dashboard 
Configure fechamento: clicar em Fechar, no X ou fora do modal fecha com fade-out. 
Utilize variables do design system para cores, espaçamentos e estilos. 
________________ 
 
 
📱 PROMPT 16: Modal de Filtros Mobile 
Cursor, vamos criar o modal de filtros específico para mobile: 
Implemente o componente FiltersMobileModal que aparece quando usuário toca no botão de filtros (ícone de sliders) no header mobile. 
Configure animação de entrada: modal desliza de baixo para cima (slide-in vertical), iniciando abaixo da viewport e subindo até ocupar toda a altura. Animação suave e rápida de 300ms. 
Estruture o modal em três áreas fixas: 
Header fixo: ocupa topo da tela com fundo branco e borda inferior. Contém título "Filtros" à esquerda em fonte grande e negrito, e botão X grande à direita com área de toque adequada (mínimo 44x44px). Este header permanece fixo mesmo quando conteúdo abaixo rola. 
Conteúdo scrollável: ocupa área central entre header e footer. Permite scroll vertical se necessário. Contém todas as opções de filtro organizadas em seções com espaçamento generoso para facilitar toque. 
Footer fixo: ocupa base da tela com fundo branco e borda superior. Contém único botão grande ocupando quase toda a largura: "Aplicar Filtros" com altura de 56px, fundo preto, texto branco, totalmente acessível por toque. Botão permanece visível mesmo durante scroll. 
No conteúdo organize as seções de filtro: 
Seção tipo de transação: label "Tipo de Transação" em negrito seguido de grid de 3 colunas com botões: "Todos", "Receitas", "Despesas". Cada botão ocupa 33% da largura com altura generosa de 48px. Selecionado tem fundo preto com texto branco, não selecionado tem fundo branco com borda cinza. 
Seção membro da família: label "Membro da Família" em negrito seguido de botões horizontais com wrap. Primeiro botão "Todos" sozinho, depois um botão para cada membro cadastrado. Cada botão de membro mostra avatar circular pequeno (32px) à esquerda e nome à direita. Altura de 48px, padding horizontal adequado, bordas arredondadas completas (pill shape). Selecionado tem fundo preto, texto branco e avatar com borda branca. Não selecionado tem fundo branco, borda cinza e texto cinza. 
Seção período: label "Período" em negrito seguido de calendário de um único mês ocupando largura total. Calendário permite seleção de intervalo: primeiro toque define início, segundo toque define fim. Intervalo selecionado fica destacado com fundo. Calendário tem controles de navegação (setas) no topo para mudar de mês. 
Configure comportamento: usuário pode ajustar quantos filtros quiser. As seleções ficam em estado temporário local do componente (não aplicadas ao contexto global ainda). 
Ao tocar em "Aplicar Filtros", copie os filtros temporários para o estado global do contexto (transactionType, selectedMember, dateRange). Feche o modal com animação slide-out (desliza para baixo). Todo o dashboard atualiza automaticamente refletindo os novos filtros. 
Se usuário tocar no X ou fora da área do modal no overlay escuro, feche SEM aplicar os filtros, descartando as mudanças temporárias. 
Utilize variables do design system para cores, espaçamentos e tamanhos, garantindo que tudo seja touch-friendly com áreas de toque mínimas adequadas. 
________________ 
 
 
💳 PROMPT 17: View Completa de Cartões 
Cursor, vamos criar a tela completa dedicada aos cartões de crédito: 
Implemente o componente CardsView que é uma das seções principais navegáveis. Esta view substitui o conteúdo quando usuário clica em "Cartões" na navegação. 
No topo coloque header com título "Cartões de Crédito" à esquerda em fonte muito grande e negrito, e botão "Novo Cartão" à direita com fundo preto e ícone "+". 
Abaixo do header renderize todos os cartões em grid responsivo: 
Mobile: 1 coluna Tablet: 2 colunas Desktop: 3 colunas 
Cada cartão deve ser exibido como card grande e detalhado, mostrando informações mais completas que no widget do dashboard. Organize cada card verticalmente: 
Topo: nome do cartão em fonte grande e negrito com logo do banco se cadastrado (imagem pequena ao lado). 
Seção de valores: apresente em layout organizado: 
* Limite total 
* Fatura atual destacada (fonte grande, cor vermelha se próxima do limite) 
* Limite disponível 
* Percentual de uso 
Representação visual: adicione barra de progresso horizontal grande ou gráfico donut mostrando visualmente quanto do limite foi usado. 
Datas: mostre dia de fechamento e dia de vencimento formatados claramente com ícones de calendário. 
Tema visual: o card deve refletir o tema escolhido (preto, verde-limão ou branco) através de borda colorida grossa ou fundo sutil. 
Últimos dígitos: se cadastrados, mostre no formato "•••• 1234" em tipografia monoespaçada. 
Ações: adicione botões pequenos no rodapé do card: 
* "Ver Detalhes": abre modal de detalhes 
* "Adicionar Despesa": abre modal de nova transação pré-configurado 
Configure hover: card eleva com sombra aumentada. Configure clicável: tocar/clicar no card abre modal de detalhes. 
Se não houver cartões cadastrados, mostre estado vazio: ícone de cartão cinza claro, título "Nenhum cartão cadastrado" e botão "Cadastrar Primeiro Cartão". 
Busque dados do array creditCards do contexto global. Ordene cartões por fatura decrescente (mais gasto primeiro) ou alfabeticamente. 
Utilize variables do design system mantendo consistência visual. 
________________ 
 
 
📋 PROMPT 18: View Completa de Transações 
Cursor, vamos criar a tela completa dedicada às transações: 
Implemente o componente TransactionsView que é uma das seções principais. Esta view apresenta a tabela de transações em formato expandido com mais opções de filtro e visualização. 
No topo coloque header com título "Transações" à esquerda e botão "Nova Transação" à direita. 
Abaixo do header crie barra de filtros avançados horizontal (desktop) ou vertical (mobile) com mais opções que a versão do dashboard: 
Campo de busca textual similar ao dashboard Select de tipo (todos/receitas/despesas) Select de categoria permitindo filtrar por categoria específica Select de conta/cartão permitindo filtrar por origem específica Select de membro permitindo filtrar por responsável Date range picker para período customizado Select de status (todos/concluído/pendente) 
Configure que todos estes filtros trabalhem em conjunto (AND lógico), adicionando-se aos filtros globais do contexto. 
Adicione acima da tabela uma linha de resumo mostrando estatísticas das transações filtradas: 
Total de receitas filtradas Total de despesas filtradas Diferença (receitas - despesas) com cor verde se positivo, vermelha se negativo Quantidade de transações encontradas 
Renderize a tabela de transações usando o mesmo componente TransactionsTable do dashboard, mas configure-o para modo expandido: mostre mais linhas por página (10 ao invés de 5) e ocupe largura total disponível. 
Adicione opção de ordenação clicável nos headers das colunas: clicar em "Data" alterna entre ordem decrescente e crescente, clicar em "Valor" ordena por valor, etc. Mostre ícone de seta indicando ordem atual. 
Configure exportação: adicione botão "Exportar" no header que permite baixar as transações filtradas em CSV ou PDF para análise offline. 
Se não houver transações (array vazio ou todos filtrados), mostre estado vazio apropriado: "Nenhuma transação registrada ainda" com botão para adicionar primeira transação. 
Busque dados através de getFilteredTransactions do contexto aplicando adicionalmente os filtros locais desta view. 
Utilize variables do design system para consistência. 
________________ 
 
 
👤 PROMPT 19: View de Perfil - Aba Informações 
Cursor, vamos criar a tela de perfil do usuário: 
Implemente o componente ProfileView que é a última seção principal navegável. Esta view deve ter um sistema de abas no topo: "Informações" e "Configurações". 
Configure que ao entrar na view, sempre mostre a aba "Informações" ativa primeiro. As abas ficam lado a lado horizontalmente com borda inferior destacando a aba ativa. 
Na aba "Informações" mostre as informações do usuário atual logado (primeiro membro do array familyMembers que representa o usuário principal): 
Seção de perfil: card grande no topo com fundo branco contendo: 
* Avatar grande (120px) centralizado ou à esquerda 
* Nome completo em fonte grande e negrito 
* Função na família em texto cinza médio 
* Email em texto cinza com ícone de envelope 
* Renda mensal estimada formatada como moeda com ícone de cifrão 
Opcionalmente adicione botão "Editar Perfil" que permite alterar estas informações. 
Seção membros da família: card abaixo com título "Membros da Família" e lista vertical de todos os membros cadastrados. Cada item da lista mostra: 
* Avatar circular médio (48px) 
* Nome e função em duas linhas 
* Renda mensal à direita formatada como moeda 
* Fundo cinza claro suave 
* Espaçamento entre items 
Se houver apenas um membro (o próprio usuário), mostre mensagem incentivando adicionar outros membros com botão "Adicionar Membro da Família". 
Configure hover nos items da lista: fundo muda para cinza um pouco mais escuro. Configure clicável: tocar em um membro pode abrir modal para editar suas informações. 
Adicione na parte inferior botão vermelho "Sair" com ícone de logout que executa ação de deslogar do sistema. 
Utilize variables do design system para cores, espaçamentos e tipografia. 
________________ 
 
 
⚙️ PROMPT 20: View de Perfil - Aba Configurações 
Cursor, agora vamos criar a aba "Configurações" dentro da view de perfil: 
Implemente o conteúdo da aba "Configurações" que aparece quando usuário clica nesta aba no topo da ProfileView. 
Organize as configurações em seções distintas: 
Seção preferências de exibição: card com título "Preferências de Exibição" contendo: 
Toggle switch "Modo Escuro" com label à esquerda e switch à direita (desabilitado por enquanto com badge "Em breve") 
Select de moeda padrão mostrando "Real Brasileiro (R$)" (apenas visual por enquanto, sem funcionalidade) 
Select de formato de data mostrando "DD/MM/AAAA" (padrão brasileiro) 
Seção notificações: card com título "Notificações" contendo múltiplos toggle switches: 
"Lembrete de vencimento de contas" - ativado por padrão "Alerta de aproximação do limite de cartão" - ativado por padrão 
"Resumo mensal por email" - desativado por padrão "Notificações de novos objetivos alcançados" - ativado por padrão 
Cada toggle deve ter label descritivo à esquerda e switch à direita. Por enquanto estes toggles apenas alteram estado visual local sem integração real. 
Seção categorias: card com título "Gerenciar Categorias" contendo: 
Subtítulo "Categorias de Receita" com lista de categorias atuais mostrando nome e cor. Botão "Adicionar Categoria" que abre modal simples para criar nova categoria de receita. 
Subtítulo "Categorias de Despesa" com lista similar. Botão para adicionar nova categoria de despesa. 
Cada categoria na lista tem ícone de editar (lápis) e ícone de deletar (lixeira) ao passar mouse. 
Seção dados e privacidade: card com título "Dados e Privacidade" contendo: 
Botão "Exportar Todos os Dados" que gera JSON ou CSV com todas as informações do sistema para backup Botão "Limpar Todos os Dados" em vermelho com confirmação obrigatória antes de executar Texto pequeno em cinza: "Esta ação não pode ser desfeita" 
Seção sobre: card final com título "Sobre o mycash+" contendo: 
Versão do sistema: "v1.0.0" Texto pequeno: "Sistema de gestão financeira familiar" Link "Termos de Uso" Link "Política de Privacidade" 
Organize todos os cards verticalmente com espaçamento generoso. No mobile empilhe tudo verticalmente. No desktop pode organizar alguns cards lado a lado se houver espaço. 
Utilize variables do design system mantendo consistência. 
________________ 
 
 
🎨 PROMPT 21: Animações e Transições Globais 
Cursor, vamos implementar animações e transições suaves em todo o sistema: 
Primeiro, configure transições de navegação entre seções principais. Quando usuário clica em um item de navegação (Dashboard, Objetivos, Cartões, etc), o conteúdo atual deve ter fade-out suave (opacity de 1 para 0 em 200ms) enquanto o novo conteúdo tem fade-in (opacity de 0 para 1 em 200ms). As transições devem ser ligeiramente defasadas para evitar piscada. 
Implemente animações de entrada para cards e componentes que aparecem em listas ou grids: 
Cards de transações na tabela: aparecem com fade-in + slide-up suave (translateY de 20px para 0) em 300ms com stagger de 50ms entre cada card (primeiro aparece, depois segundo, etc). 
Cards de objetivos e cartões em grids: mesmo efeito de fade-in + slide-up com stagger de 80ms. 
Donuts do carrossel de categorias: aparecem com scale (de 0.8 para 1) + fade-in em 400ms com stagger de 100ms. 
Configure animações de hover consistentes em todo o sistema: 
Botões: transição suave de background-color em 200ms com easing ease-in-out Cards clicáveis: transição de transform (translateY) e box-shadow em 250ms com easing ease-out Avatares: transição de transform (scale) em 200ms com easing ease-in-out 
Implemente animações de loading para valores monetários nos cards de resumo: 
Quando um valor muda devido a filtros ou novos dados, anime de zero até o valor final em 800ms mostrando números intermediários. Use easing ease-out para desaceleração natural no final. 
Configure animações de barras de progresso: 
Barras de progresso de objetivos e uso de cartão devem preencher suavemente da esquerda para direita em 1000ms com easing ease-out quando aparecem ou atualizam. 
Implemente animações de modais: 
Abertura: overlay faz fade-in de opacity 0 para 0.5 em 200ms. Modal faz fade-in + scale (de 0.95 para 1) em 250ms com easing ease-out. 
Fechamento: modal faz fade-out + scale (de 1 para 0.95) em 200ms. Overlay faz fade-out em 200ms. 
Modal mobile de filtros: slide-in de translateY(100%) para 0 em 300ms com easing ease-out. Slide-out inverte a direção. 
Configure animações de toasts de notificação: 
Entrada: slide-in da direita (translateX de 100% para 0) + fade-in em 300ms com easing ease-out Saída após delay: fade-out + slide-out para direita em 250ms 
Implemente skeleton loaders para estados de carregamento (preparação futura): 
Cards de estatísticas: blocos retangulares cinza claro com animação de pulse suave (opacity oscila entre 0.6 e 1 em 1500ms infinitamente) 
Linhas de tabela: retângulos cinza claro com animação de shimmer (gradiente linear se move da esquerda para direita) 
Adicione micro-interações sutis: 
Checkboxes e toggles: animação de scale leve (1 para 1.1 e volta) ao clicar Inputs em foco: borda transiciona suavemente para cor de destaque em 200ms Dropdowns abrindo: aparecem com fade-in + slide-down (translateY de -10px para 0) em 200ms 
Utilize Framer Motion ou CSS transitions/animations conforme apropriado. Configure durações e easings consistentes definindo constantes reutilizáveis para manter padrão em todo o sistema. 
Garanta que todas as animações respeitem prefers-reduced-motion: se usuário tem essa preferência ativada no sistema operacional, desabilite ou reduza drasticamente todas as animações. 
________________ 
 
 
🎯 PROMPT 22: Formatação e Utilitários 
Cursor, vamos criar funções utilitárias para formatação consistente em todo o sistema: 
Crie arquivo de utilitários para formatação de valores monetários: 
Função formatCurrency que recebe número e retorna string formatada como moeda brasileira: "R$ 1.234,56". Use Intl.NumberFormat com locale pt-BR e currency BRL. Configure para sempre mostrar duas casas decimais. 
Função formatCompactCurrency para valores grandes em gráficos: recebe número e retorna string compacta como "R$ 2,5k" para 2500 ou "R$ 1,2M" para 1200000. Útil para eixos de gráficos onde espaço é limitado. 
Função parseCurrencyInput que converte string de input do usuário em número limpo. Remove "R$", pontos de milhar, troca vírgula por ponto. Útil para processar valores digitados em formulários antes de salvar. 
Crie utilitários para formatação de datas: 
Função formatDate que recebe objeto Date e retorna string formatada como "DD/MM/AAAA". Use date-fns com locale pt-BR. 
Função formatDateLong que retorna formato extenso: "15 de Janeiro de 2024". Útil para títulos e cabeçalhos. 
Função formatDateRange que recebe duas datas e retorna intervalo formatado: "01 jan - 31 jan, 2024". Se o intervalo cruza anos, inclua ano em ambas as datas. 
Função formatRelativeDate que retorna data relativa: "Hoje", "Ontem", "Há 3 dias", "Há 2 semanas". Use date-fns formatDistanceToNow com locale pt-BR. 
Crie utilitários para manipulação de arrays e objetos: 
Função groupByCategory que recebe array de transações e retorna objeto agrupado por categoria com valores somados. 
Função filterByDateRange que recebe array de transações e objeto com startDate e endDate, retornando apenas transações dentro do intervalo. 
Função sortByDate que ordena array de transações por data (ascendente ou descendente). 
Crie utilitários para cálculos financeiros: 
Função calculatePercentage que recebe valor parcial e valor total, retornando percentual com uma casa decimal. Trata divisão por zero retornando 0. 
Função calculateDifference que recebe dois valores e retorna objeto com diferença absoluta e percentual de variação. 
Função calculateInstallmentValue que recebe valor total e número de parcelas, retornando valor de cada parcela arredondado para duas casas decimais. 
Crie utilitários para validação: 
Função isValidEmail que valida formato de email usando regex apropriado. 
Função isValidCPF que valida CPF brasileiro (apenas estrutura, sem consulta online). 
Função isValidDate que verifica se data é válida e não é futura quando aplicável. 
Função isPositiveNumber que verifica se valor é número positivo maior que zero. 
Crie utilitários para geração de IDs: 
Função generateUniqueId que gera ID único usando UUID v4 ou similar. Use biblioteca uuid ou crypto.randomUUID se disponível. 
Organize todos estes utilitários em arquivo separado por categoria: currency.utils.ts, date.utils.ts, array.utils.ts, validation.utils.ts, etc. Export nomeado de cada função. 
Adicione JSDoc comments em cada função explicando parâmetros, retorno e exemplo de uso. 
Crie testes unitários básicos para funções críticas garantindo comportamento correto. 
________________ 
 
 
🎨 PROMPT 23: Responsividade e Ajustes Finais 
 
 
Cursor, faça uma revisão completa de responsividade do sistema já implementado, aplicando apenas ajustes incrementais de layout, sem refatorar arquitetura, lógica de negócio ou recriar componentes existentes. 
Este projeto é 100% mobile-first. O layout base sempre parte do mobile, e os breakpoints apenas evoluem o layout progressivamente, nunca o recriam. 
Utilize exclusivamente os breakpoints oficiais do projeto: 
Mobile (base): <768px 
Tablet (md): ≥768px e <1280px 
Desktop (lg): ≥1280px e <1920px 
Wide / 4K (xl): ≥1920px 
 
 
O layout deve ser sempre fluido, com containers principais usando width: 100%. Limite de leitura deve ser feito apenas com max-width, nunca com largura fixa. Overflow horizontal é proibido em qualquer resolução. 
A sidebar só existe no desktop (≥1280px). Em mobile e tablet ela não deve ser renderizada, nem mesmo como display:none. A navegação nesses tamanhos ocorre exclusivamente via Header Mobile com menu em drawer. No desktop, a sidebar aparece por padrão, possui estados expanded e collapsed, empurra o conteúdo e nunca sobrepõe nem gera overflow horizontal. Sidebar e Header Mobile nunca podem coexistir. 
O Header Mobile deve renderizar apenas abaixo de 1280px, contendo botão de menu e ações principais, e desaparecer completamente no desktop. 
Todos os grids devem seguir a lógica mobile-first: no mobile, 1 coluna com cards empilhados; no tablet, evoluir para 2 colunas quando fizer sentido; no desktop, 3 ou 4 colunas dependendo do componente. Grids devem ser fluidos (auto-fit / auto-fill), nunca hardcoded. Aplique essa lógica a cards de resumo financeiro, objetivos, cartões e listas em geral. 
Os espaçamentos do conteúdo principal devem usar px-4 no mobile, px-6 no tablet e px-8 no desktop. No desktop, limite a largura de leitura com max-w-[1400px] e no wide com max-w-[1600px], sempre centralizando com mx-auto. 
A tipografia deve reduzir cerca de 15% no mobile e evoluir progressivamente nos breakpoints (ex: text-base md:text-lg lg:text-xl), priorizando sempre legibilidade acima de densidade. 
A tabela de transações deve ser mobile-first: no mobile, não usar tabela horizontal, cada transação vira um card vertical com todas as informações e labels claros; no tablet, usar versão híbrida ocultando colunas secundárias; no desktop, exibir tabela completa sem scroll horizontal. 
Gráficos devem se adaptar progressivamente: no mobile usar menor altura, labels simplificados e tooltips que não causem overflow; no tablet e desktop aumentar altura e margens de forma proporcional. Nunca permitir overflow lateral do canvas. 
Modais devem ser responsivos e fluídos: no mobile, modais grandes ocupam 100% da viewport; no tablet e desktop, usar width: 100% combinado com max-width adequado, nunca largura fixa absoluta. Quando houver muito conteúdo, apenas o corpo do modal deve rolar, mantendo header e footer fixos. 
Interações touch são obrigatórias no mobile: touch targets mínimos de 44x44px, espaçamento mínimo de 8px entre ações, inputs com altura mínima de 48px e font-size mínimo de 16px para evitar zoom no iOS. 
Garanta acessibilidade básica em todo o sistema: navegação completa por teclado, foco visível com focus:ring, aria-label em botões de ícone, alt em imagens e contraste mínimo de 4.5:1 conforme WCAG AA. 
Valide obrigatoriamente o sistema em 375px, 768px, 1280px e 1920px, corrigindo qualquer problema de overflow, quebra de grid, desalinhamento ou inconsistência visual encontrada. 
________________ 
 
 
✅ PROMPT 24: Testes e Validação Final 
Cursor, vamos finalizar o projeto com testes e validação completa do sistema: 
Crie fluxo de teste completo simulando jornada de usuário real: 
1. Usuário abre o sistema pela primeira vez 
2. Vê dados mock pré-carregados no dashboard 
3. Clica em um membro da família para filtrar 
4. Verifica que todos os cards, gráficos e tabela atualizam mostrando apenas dados daquele membro 
5. Clica novamente no membro para remover filtro 
6. Abre o seletor de período e escolhe "Últimos 3 meses" 
7. Verifica que dados atualizam para mostrar 3 meses 
8. Digita texto no campo de busca 
9. Verifica que tabela filtra em tempo real 
10. Clica em "Nova Transação" 
11. Preenche formulário completo com todos os campos 
12. Salva transação 
13. Verifica que modal fecha, toast aparece, e nova transação aparece na tabela 
14. Clica em cartão no widget 
15. Modal de detalhes abre mostrando informações corretas 
16. Navega para "Cartões" 
17. Verifica que todos os cartões aparecem com informações corretas 
18. Navega para "Transações" 
19. Usa filtros avançados 
20. Verifica resultados 
21. Navega para "Perfil" 
22. Vê informações do usuário e membros da família 
23. Troca para aba "Configurações" 
24. Interage com toggles e configurações 
25. Retorna ao Dashboard 
Execute este fluxo manualmente verificando cada passo funciona corretamente. Anote qualquer problema encontrado. 
Valide cálculos financeiros: 
Adicione transações mock com valores conhecidos Calcule manualmente o que saldo total deveria ser Verifique se o valor exibido no card está correto Faça o mesmo para receitas, despesas, percentuais de categoria 
Valide filtros combinados: 
Ative filtro de membro + período + busca simultaneamente Conte manualmente quantas transações deveriam aparecer Verifique se a tabela mostra exatamente esse número Confirme que todas as transações exibidas atendem a TODOS os critérios 
Valide formatações: 
Verifique se todos os valores monetários usam format o brasileiro: R$ 1.234,56 Verifique se todas as datas usam formato brasileiro: 15/01/2024 Verifique se percentuais mostram uma casa decimal: 35,5% 
Valide responsividade: 
Redimensione o navegador de desktop (1920px) até mobile (375px) gradualmente Verifique se sidebar desaparece e header mobile aparece no breakpoint correto (1024px) Verifique se grids ajustam número de colunas nos breakpoints corretos Verifique se não há overflow horizontal em nenhum tamanho de tela Verifique se todos os textos permanecem legíveis Verifique se todos os botões permanecem clicáveis/tocáveis 
Valide modais: 
Abra todos os modais um por um Verifique se aparecem centralizados Verifique se overlay escuro aparece Verifique se fecham ao clicar no X Verifique se fecham ao clicar fora Verifique se fecham ao pressionar Escape Verifique se validações funcionam ao tentar salvar com campos vazios 
Valide acessibilidade: 
Navegue todo o sistema usando apenas teclado (Tab, Enter, Escape, Setas) Verifique se todos elementos interativos são alcançáveis Verifique se elementos focados têm anel de foco visível Verifique se ordem de tabulação é lógica Use leitor de tela (NVDA ou JAWS no Windows, VoiceOver no Mac) para verificar se informações são anunciadas corretamente 
Valide performance: 
Abra DevTools e monitore Performance Navegue entre seções verificando se transições são suaves Adicione 100 transações mock e verifique se tabela com paginação ainda funciona rápido Verifique se não há memory leaks ao abrir/fechar modais múltiplas vezes 
Corrija quaisquer bugs encontrados durante estes testes. 
Adicione tratamento de erros em pontos críticos: 
Funções de cálculo devem tratar divisão por zero Funções de busca/filtro devem tratar arrays vazios Formulários devem validar dados antes de processar 
Adicione mensagens de feedback apropriadas: 
Toasts de sucesso para ações bem-sucedidas Toasts de erro para ações que falharam 
Estados vazios amigáveis com CTAs claros Mensagens de validação descritivas em formulários 
Documente qualquer comportamento não óbvio ou decisão de design tomada durante a implementação. 
Crie README.md do projeto descrevendo: 
Objetivo do sistema Tecnologias utilizadas Como instalar dependências Como rodar localmente Estrutura de pastas Principais componentes e suas responsabilidades 
________________ 
 
 
🎉 PROMPT FINAL: Revisão e Entrega 
Cursor, vamos fazer a revisão final e preparação para entrega do projeto mycash+: 
Execute checklist completo de qualidade: 
✅ Todas as cinco seções principais estão implementadas e navegáveis ✅ Sistema de navegação (sidebar desktop + header mobile) funciona perfeitamente ✅ Context global gerencia todo o estado corretamente ✅ Todos os cálculos financeiros estão corretos e testados ✅ Todos os filtros (globais e locais) funcionam em combinação ✅ Todos os modais estão implementados com validação ✅ Todos os componentes usam exclusivamente variables do design system ✅ Todo o sistema é totalmente responsivo (mobile, tablet, desktop) ✅ Todas as animações e transições estão suaves e consistentes ✅ Formatações de moeda e data seguem padrão brasileiro ✅ Navegação por teclado funciona em todo o sistema ✅ Contraste de cores atende WCAG AA ✅ Sistema funciona corretamente com dados mock 
Revise organização do código: 
Confirme que estrutura de pastas está clara e lógica Confirme que componentes estão bem nomeados e responsabilidades claras Confirme que não há código duplicado desnecessariamente Confirme que tipos TypeScript estão corretos em todo o sistema Confirme que imports estão organizados (React, bibliotecas, locais) 
Revise comentários e documentação: 
Adicione comentários JSDoc em funções complexas Adicione comentários explicativos em lógica não-óbvia Remova comentários obsoletos ou console.logs de debug Garanta que README está completo e claro 
Otimize performance final: 
Verifique se não há re-renders desnecessários em componentes críticos Verifique se imagens estão otimizadas (se houver) Verifique se bundle size é razoável Verifique se não há imports desnecessários inflando o bundle 
Prepare para integração futura com Supabase: 
Identifique pontos onde dados virão do backend ao invés de mock Adicione comentários // TODO: integrar com Supabase nestes pontos Garanta que estrutura de dados está compatível com schema planejado 
Crie documentação de componentes principais: 
Liste todos os componentes criados agrupados por domínio Descreva brevemente responsabilidade de cada um Documente props aceitas pelos componentes mais importantes Documente hooks customizados e suas finalidades 
Gere relatório final: 
Total de componentes criados Total de linhas de código (aproximado) Funcionalidades implementadas completamente Funcionalidades parcialmente implementadas ou pendentes Próximos passos sugeridos para evolução do projeto 
Celebre! O sistema mycash+ está completo e funcional. Um sistema robusto de gestão financeira familiar com: 
✨ Interface moderna e responsiva ✨ Navegação fluida e intuitiva ✨ Gerenciamento completo de transações, objetivos e cartões ✨ Filtros e buscas poderosos ✨ Visualizações gráficas claras ✨ Acessibilidade e boas práticas ✨ Código limpo e organizado ✨ Preparado para integração com backend 
O projeto está pronto para uso, testes mais extensivos e futura integração com Supabase via MCP.
