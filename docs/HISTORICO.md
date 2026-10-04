# Histórico

Entradas mais novas no topo. Cada entrada: data, branch, o que foi feito, arquivos principais, pendências.

## 2026-10-04 · main · Cadastro de interessadas

- Tabela interessadas com RLS: nada para visitante e aluna, leitura só para admin (eh_admin()), gravação só pela service role; checagens de formato no banco e 13 testes em PGlite.
- Edge Function cadastrar-interessada: valida com zod (validar.ts, testado no vitest), honeypot no campo "site", origem liberada por ORIGENS_PERMITIDAS, responde só { ok }. verify_jwt desligado (formulário público).
- Na página, os cartões de preço viram a escolha do plano num formulário (React Hook Form + zod, carregado sob demanda) com nome, e-mail, WhatsApp com máscara e aceite do contrato. UTMs da URL ficam na sessão e vão junto.
- Ao gravar, o formulário devolve o plano escolhido e mostra a próxima etapa (botão de pagamento ainda desativado, tarefa 3).
- Arquivos: migração 20261004120000_criar_interessadas, supabase/functions/cadastrar-interessada, _shared/cors.ts, src/features/vendas (Cadastro, EscolhaPlano, opcoes, useCadastro, api, schemas), src/lib/telefone.ts, src/lib/utm.ts, src/domain/termos.ts.
- Pendente: aplicar migração e publicar a função no remoto (comandos em docs/runbooks/interessadas.md); página /contrato e versão final (hoje 2026-10-04-provisorio); política de privacidade; limite de envios por IP se aparecer spam.

## 2026-10-04 · main · Página de vendas, parte 1: rotas e layout

- "/" virou a página de vendas pública (feature vendas, textos provisórios em textos.ts); login segue em /entrar e a área da aluna foi para /app.
- Preços em src/domain/precos.ts: oferta do ORA (12x 198, 12x 215, 1.997 no Pix, 13 meses) até FIM_OFERTA_ORA, cheios depois, com contagem regressiva; testes de domínio e da tela.
- Login, área da aluna, Supabase e React Query carregam sob demanda: JS inicial de 671 KB (196 KB gzip) para 324 KB (103 KB gzip).
- PWA com escopo /app/ e registro só dentro de /app (decisão 0003); service worker antigo de escopo / é removido. Meta tags e imagem de compartilhamento.
- Pendente: fotos das três profissionais, copy final, logo em SVG, botões de pagamento (tarefa 3), páginas de termos e privacidade.

## 2026-10-04 · feat/tela-entrada · Tela de entrada com a logo

- Login mostra a logo ORA (public/logo-ora.png, fundo transparente) e o título "Chegou a sua HORA de começar", com e-mail e senha embaixo.
- Arquivos: src/features/auth/pages/LoginPage.tsx, src/features/auth/textos.ts, public/logo-ora.png.
- Pendente: logo em SVG ou maior resolução; confirmar se existe logo própria da HORA.

## 2026-10-04 · chore/banco-pglite · Infraestrutura conectada (Sprint 0, parte 2)

- GitHub: repositório horasaude/hora, main enviada com chave SSH própria (core.sshCommand do repo), sem mexer no login do gh.
- Banco: testes passam a rodar em PGlite (supabase/tests/harness.mjs), sem Docker; 9 checagens de perfis. Supabase CLI só para o remoto (decisão 0002).
- Migração renomeada para 20261004000000_criar_perfis, sem comentários, e aplicada com db push no projeto zijtjwhvnhfarmfscmnr. seed.sql vazio; teste pgTAP removido.
- Um projeto Supabase só (sem staging), por decisão da dona do projeto. Vercel no time hora3 com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY do tipo Config; login abre em hora-snowy.vercel.app.
- Arquivos: supabase/tests/*, package.json, ci.yml, CLAUDE.md, README.md, ARQUITETURA, MAPA, TAREFAS, decisão 0002.
- Pendente: Site URL do Auth, tela de erro de configuração, backup e keep-alive, aviso de __dirname no vitest.config.ts.

## 2026-10-06 · main · Estrutura inicial (Sprint 0, parte 1)

- Projeto React + Vite + TypeScript com Tailwind, TanStack Query, React Router, Zod, React Hook Form e PWA.
- Lint (oxlint) com limite de linhas, sem any e fronteira entre features; Prettier; Husky com lint-staged.
- Feature auth (login e rota protegida) e feature inicio (placeholder).
- Supabase: migração de perfis com RLS, eh_admin() e trigger de criação de perfil; teste pgTAP.
- CI no GitHub Actions; vercel.json com rotas e cabeçalhos de segurança.
- Documentação: CLAUDE.md, MAPA, HISTORICO, TAREFAS, ARQUITETURA, decisão 0001; comandos /inicio, /tarefa, /fim, /revisar, /arrumar.
- Pendente: criar projetos Supabase (staging e produção), conectar GitHub e Vercel, configurar variáveis.
