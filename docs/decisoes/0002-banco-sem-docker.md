# 0002 · Banco sem Docker: PGlite nos testes, CLI só para o remoto

Data: 2026-10-04

## Contexto

O Supabase local exige Docker, que não está instalado no computador de desenvolvimento, e a dona do projeto preferiu não instalar. Os testes pgTAP (`supabase test db`) dependiam dele.

## Decisão

Os testes de banco rodam em PGlite (Postgres em memória dentro do Node), com um shim que imita o Supabase: schema auth, auth.uid(), papéis anon, authenticated e service_role e os grants padrão. O harness fica em supabase/tests/harness.mjs e cada suíte sobe o próprio banco. É o mesmo modelo usado no projeto Pronto Riso.

A Supabase CLI fica instalada só para falar com os projetos online: link, db push, functions deploy e gen types. Nada de db start ou db reset.

## Consequências

- Sem Docker; npm run db:test roda em poucos segundos, local e no CI.
- O shim não é o Supabase completo: Storage, Realtime e extensões ausentes no PGlite não são testados aqui. Recurso novo que dependa disso precisa de teste manual no staging.
- Migração nova entra no teste sozinha, porque o harness lê a pasta em ordem.
