# ORA

Plataforma da comunidade ORA (evento ORA), de Ana Milhomem, Dra. Clara Maria e Laís Moraes.
Área de membros de 12 meses: trilhas por tema, lives, fórum, check-in com foto, desafios, pontos, ranking, indicação e evolução da aluna.
Stack: React + Vite + TypeScript, Tailwind, TanStack Query, Zod, Supabase (Postgres, Auth, Storage, Edge Functions), Mercado Pago, Vercel.

## Como economizar contexto (leia primeiro)

- NUNCA varra o projeto inteiro. Comece por docs/MAPA.md: ele diz onde está cada coisa.
- Para trabalhar numa feature, leia o README.md dela e só os arquivos que a tarefa exige.
- O que já foi feito está em docs/HISTORICO.md (entradas mais novas no topo). Leia só as últimas.
- A fila de trabalho está em docs/TAREFAS.md.
- Decisões técnicas estão em docs/decisoes/. Regras gerais em docs/ARQUITETURA.md.
- Ao fim de cada tarefa, atualize HISTORICO, MAPA, README da feature e TAREFAS (comando /fim).

## Regras de negócio que nunca podem quebrar

- Regra crítica (acesso, pontos, pagamento, liberação de conteúdo) roda no banco ou em Edge Function, nunca só no front.
- Acesso só é criado depois do webhook do Mercado Pago e da confirmação do pagamento na API. O acesso começa na hora da confirmação do pagamento (perfis.acesso_inicio_em). Dia da aluna = dias de calendário desde a adesão + 1, no fuso de Brasília (muda à meia-noite): no front src/domain/dia.ts (diaAtual), no banco public.dia_atual_de e dia_de_acesso(); as duas contas andam juntas. Preparação: aulas dos dias 1 a 7 pelo dia da aluna. Tema escolhido no dia 8; nas etapas do tema (Arrancada, Constância e Para Sempre; o identificador interno continua manutencao) o dia_liberacao conta a partir do início da etapa, e a próxima etapa só abre com 80% das aulas concluídas e 30 dias na etapa atual (banco: atualizar_etapas, aula_liberada). Aula fechada nunca devolve vídeo nem material.
- Webhook, criação de pedido e pontos são idempotentes. Repetição não gera acesso, cobrança ou ponto em dobro.
- Pontos só via função conceder_pontos. Nunca insert direto em lancamentos_pontos. Correção é novo lançamento.
- Peso e medidas nunca entram em ranking.
- Oferta do ORA (R$ 300 OFF + 1 mês grátis) só no dia do evento, 24/10/2026, de 00h00 a 23h59 (America/Sao_Paulo); antes e depois, preço cheio. Preços e janela ficam na tabela configuracoes (editada no painel); src/domain/configuracao.ts guarda o padrão. Quando houver pedido, o banco checa pela mesma tabela.

## Banco e segurança

- Toda tabela nova tem RLS e teste em supabase/tests.
- Mudança no banco só por migração nova em supabase/migrations. Nunca editar migração aplicada.
- Permissões usam eh_admin() e, quando existir, tem_acesso_ativo().
- Dinheiro em centavos (int). Datas em UTC; regra de dia via src/lib/datas.ts (fuso de Brasília).
- service_role nunca no front. .env nunca no Git. Segredos ficam no Supabase e na Vercel.
- Buckets privados, acesso por link assinado.

## Organização

- Feature em src/features/<nome>/ com index.ts, README.md, pages, components, hooks, api, schemas, textos.ts.
- Camadas: página > componente > hook > api. Regra de negócio só em src/domain (sem React e sem Supabase).
- Componente não chama Supabase. Entre features, só pelo index.ts (o lint bloqueia). Dentro da feature, imports relativos.
- Limites (lint): arquivo 150 linhas, função 60. Passou, quebre antes de continuar.
- Nada de pasta utils genérica: técnico em src/lib, negócio em src/domain.
- Edge Functions: uma pasta por função; comum em supabase/functions/_shared.
- Migrações: AAAAMMDDHHMMSS_assunto.sql.
- Antes de criar arquivo novo, procure no MAPA se já existe algo para reaproveitar.

## Código

- TypeScript estrito, sem any. Zod valida toda entrada.
- Toda tela tem estados carregando, vazio, erro e sucesso.
- Todo o sistema é feito para computador e responsivo para celular. Nenhuma tela é só para celular. No computador, usar a largura da tela, com menu na lateral nas áreas logadas (painel e área da aluna); no celular, o layout se adapta (na área da aluna, o menu vira a barra fixa embaixo com 5 ícones). Conferir em 1440 px e em 360 px.
- Painel no computador: conteúdo usa a largura da tela até 1280 px, sem vazio no meio. O cartão da direita só mostra detalhes de item existente; nunca formulário. Criar e editar abrem a Janela (src/components/ui/Janela.tsx, 760 px, fundo escurecido, título, campos em duas colunas quando couber, Cancelar e Salvar fixos no rodapé, fecha com X, Esc ou clique fora; no celular ocupa a tela). Lista vazia: mensagem e botão de criar no centro da área. Menu lateral rola e "Logada como" fica fixo embaixo. Conferir em 1440 px e 1280 px.
- Contraste AA e rótulo em todo campo. Botões delicados (36 px de altura) por escolha da dona do projeto.
- Textos em português, sem travessão, tom humano e curto, sempre no textos.ts da feature.
- A fonte do sistema (painel das profissionais e área da aluna, tudo em /app) é Arial: títulos em Arial negrito verde ORA, textos em Arial normal com 16 px no corpo e boa entrelinha, números dos cartões de resumo em Arial negrito grande. Nada de fonte serifada no sistema. Aplicada pela classe font-sistema na raiz de /app (src/app/AreaAluna.tsx). No sistema a marca é a logo do ORA (componente LogoOra em src/components/ui, sempre o SVG de public/, sem esticar): logo-ora.svg no fundo branco (menu e topo da área da aluna, entrar, definir senha) e logo-ora-clara.svg no fundo verde (menu do painel). Ícones do app (PWA): icone.svg, icone-192.png, icone-512.png e apple-touch-icon.png, com a ORA clara sobre verde. A página de vendas e o checkout também usam a logo do ORA.
- Padrão visual oficial: docs/referencias/estilo-aluna (área da aluna) e estilo-painel (painel), com os valores exatos nos .html; substituem estilo-brilho e as cores antigas; o layout segue painel-apresentado.png e app-aluna.png. Botões delicados em pílula (13 px, brilho suave só em cima, sombra leve), etiquetas com 11 px, play com 40 px, nada de botão grande. Painel: menu verde escuro com a logo clara e bolinha de cor por módulo, resumo em tons suaves (sálvia, menta, areia, rosado), etiquetas Publicado verde, Rascunho dourado, alerta coral; botões verde escuro editar e salvar, dourado criar, coral tirar do ar ou invalidar. Área da aluna: fundo e menu brancos, item ativo em vidro verde. Usar sempre BotaoBrilho, LinkBrilho, EtiquetaBrilho, BarraProgresso e Cartao de src/components/ui. Sem emoji.
- Página de vendas, checkout e login seguem a identidade da Imersão ORA (decisão 0004): Playfair Display nos títulos, Montserrat nos textos, sem degradê.

## Git

- Trabalho direto na main, sem branch nem pull request: o push na main publica na Vercel (www.comunidadeora.com.br; hora-snowy.vercel.app continua respondendo) e a conferência é sempre pelo link.
- Antes de cada push: npm run check verde (e npm run db:test se mexeu no banco). Nunca enviar com falha.
- Conventional Commits, um commit por tarefa.

## Comandos

- npm run dev | npm run check (typecheck + lint + testes) | npm run build
- npm run db:test (testes de banco em PGlite, sem Docker) | npm run db:push (aplica migrações no projeto ligado) | npm run gen:types
- Supabase CLI só para o remoto (link, db push, functions deploy, gen types). Nada de Supabase local nem Docker (decisão 0002).

## Forma de trabalhar

- Use /inicio no começo da sessão, /tarefa <descrição> para trabalhar e /fim ao terminar.
- Sem plano antes de código: execute direto (pedido da dona do projeto, 2026-10-06). Pergunte só quando houver decisão em aberto ou ação em produção. Uma tarefa por vez, sem mexer fora do escopo dela.
- Biblioteca nova só com justificativa.
- Ao terminar: npm run check verde e lista de arquivos alterados com número de linhas.
