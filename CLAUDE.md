# HORA

Plataforma da comunidade HORA (evento ORA), de Ana Milhomem, Dra. Clara Maria e Laís Moraes.
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
- Acesso só é criado depois do webhook do Mercado Pago e da confirmação do pagamento na API. O acesso começa na hora da confirmação do pagamento (perfis.acesso_inicio_em). Cada aula libera no seu dia_liberacao, contado em horas exatas: 1 = na hora, 8 = 7 x 24 h depois da confirmação.
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
- Alvo de toque 44 px, contraste AA, rótulo em todo campo.
- Textos em português, sem travessão, tom humano e curto, sempre no textos.ts da feature.
- Visual: identidade da Imersão ORA (decisão 0004): fundo creme/branco, títulos em Playfair Display caixa alta com frase em Montserrat itálico leve (componente Destaque), verde ora. Cores em src/styles/index.css. Sem degradê, sem emoji, sem sombra pesada.

## Git

- Trabalho direto na main, sem branch nem pull request: o push na main publica na Vercel (hora-snowy.vercel.app) e a conferência é sempre pelo link.
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
