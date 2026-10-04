# Histórico

Entradas mais novas no topo. Cada entrada: data, branch, o que foi feito, arquivos principais, pendências.

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
