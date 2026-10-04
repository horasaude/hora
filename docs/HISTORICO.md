# Histórico

Entradas mais novas no topo. Cada entrada: data, branch, o que foi feito, arquivos principais, pendências.

## 2026-10-06 · main · Estrutura inicial (Sprint 0, parte 1)

- Projeto React + Vite + TypeScript com Tailwind, TanStack Query, React Router, Zod, React Hook Form e PWA.
- Lint (oxlint) com limite de linhas, sem any e fronteira entre features; Prettier; Husky com lint-staged.
- Feature auth (login e rota protegida) e feature inicio (placeholder).
- Supabase: migração de perfis com RLS, eh_admin() e trigger de criação de perfil; teste pgTAP.
- CI no GitHub Actions; vercel.json com rotas e cabeçalhos de segurança.
- Documentação: CLAUDE.md, MAPA, HISTORICO, TAREFAS, ARQUITETURA, decisão 0001; comandos /inicio, /tarefa, /fim, /revisar, /arrumar.
- Pendente: criar projetos Supabase (staging e produção), conectar GitHub e Vercel, configurar variáveis.
