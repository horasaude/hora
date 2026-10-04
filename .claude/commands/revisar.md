Revise as mudanças ainda não enviadas (git diff origin/main e git diff) com este checklist e responda só com o que precisa mudar:

- Segurança: RLS em toda tabela nova, nenhum segredo no código, service_role fora do front.
- Regra crítica (acesso, pontos, pagamento, liberação) no banco ou em Edge Function, não só no front.
- Idempotência em webhooks, pedidos e pontos.
- Camadas e fronteiras do CLAUDE.md respeitadas; limites de linhas.
- Estados carregando, vazio, erro e sucesso nas telas.
- Teste cobrindo a regra nova.
