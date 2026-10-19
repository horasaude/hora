# admin: cancelamentos

Lista (só leitura) dos pedidos de cancelamento feitos pelas alunas em Perfil > Minha conta (Edge Function cancelar-inscricao).

- Até 7 dias da aprovação: o sistema estorna tudo no Asaas e encerra o acesso (etiqueta Estornado). Se o Asaas falhar, a linha fica "Estornar no Asaas": a equipe estorna à mão no painel do Asaas e o webhook encerra o pedido.
- Depois dos 7 dias: "Não renovar". O plano segue até o fim dos 12 meses e a aluna não recebe o convite de renovação.

Lê pedidos.cancelamento_pedido_em, cancelamento_tipo e cancelamento_motivo (migração 20261031090000_cancelamento.sql).
