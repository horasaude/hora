# Arquitetura (resumo)

O documento completo de planejamento está no Claude ("ORA: planejamento de desenvolvimento"). Este é o resumo que o Claude Code consulta.

## Princípios

1. O banco é a fonte da verdade; regra crítica no Postgres ou em Edge Function.
2. RLS em todas as tabelas desde a primeira migração.
3. Tudo versionado no Git, nada criado clicando em produção.
4. Dinheiro em centavos; datas em UTC, regra de dia no fuso de Brasília.
5. Pontos, pagamentos, aceites e webhooks são registros só de inclusão.
6. Tudo que vem de fora é idempotente.
7. Regra de negócio em função pura e testada (src/domain).
8. Pontos, desafios, preços e prazos são dados editáveis no painel.
9. Simples antes de esperto.

## Camadas do front

página > componente > hook > api > Supabase; regras em domain.

## Fluxo de pagamento

criar-pedido (Edge) grava pedido e aceite > cobrança no Mercado Pago com chave de idempotência > webhook mp-webhook valida assinatura, grava evento único, consulta o pagamento na API > cria acesso com data de fim > e-mail com contrato.

## Estados do acesso

pendente > ativa > (encerrada | reembolsada | em_atraso > suspensa > cancelada); em_atraso e suspensa voltam a ativa ao pagar.

## Ambientes

Um projeto Supabase só (zijtjwhvnhfarmfscmnr, plano gratuito), usado para desenvolvimento e produção; a Vercel aponta Production e Preview para ele. Testes de banco locais em PGlite. Mercado Pago com credenciais de teste até o go-live; na troca pelas reais, apagar os pedidos de teste.
