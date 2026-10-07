# Demonstração local (nunca produção)

Dados de exemplo para ver e fotografar a área da aluna sem tocar no Supabase.

- `seed.sql`: alunas de teste (dia 3 e dia 40 com Emagrecimento e Arrancada concluída), 10 alunas para o ranking, 7 aulas de preparação, 10 aulas por etapa em Emagrecimento e Composição corporal, cardápios de Preparação e Emagrecimento com receitas, desafio do mês e 3 lives (passada com gravação, hoje e futura). Começa com uma trava que recusa rodar num banco do Supabase, e fica fora de `supabase/` para o CLI nunca aplicar.
- `servidor.mjs`: sobe um Postgres em memória (PGlite) com todas as migrações e o seed, e uma API mínima no formato do Supabase (`postgrest.mjs`) que roda cada consulta como a aluna logada, com as regras de acesso de verdade.
- `prints.mjs` e `chrome.mjs`: prints no computador (1440 px) e no celular (390 px) em `docs/prints/parte2/` (fora do `public`, não entra no build).

Comandos:

- `npm run demo:build` gera o app apontando para a API local (em `.demo/dist`, fora do Git).
- `npm run demo` sobe a demonstração: abra http://127.0.0.1:4321/__entrar?aluna=40 (ou `aluna=3`).
- `npm run demo:prints` gera o build e tira os prints.
