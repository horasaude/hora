# 0001 · Stack do projeto

Data: 2026-10-06

## Contexto

Plataforma para 30 a 50 alunas no início, com pagamento, dados de saúde e prazo curto até o ORA (24/10).

## Decisão

React + Vite + TypeScript no front (PWA), Supabase para banco, login, arquivos e funções de servidor, Mercado Pago para pagamentos, Vercel para hospedagem. Oxlint em vez de ESLint, por ser o padrão do template atual do Vite e bem mais rápido.

## Consequências

Sem servidor próprio para manter. Toda regra sensível vai para RLS, funções do banco e Edge Functions. O plano gratuito do Supabase exige backup e keep-alive próprios.
