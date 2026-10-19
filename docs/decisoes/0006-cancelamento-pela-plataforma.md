# 0006 Cancelamento pela plataforma

Data: 2026-10-19.

## Decisão

A aluna pede o cancelamento em Perfil > Minha conta (Edge Function cancelar-inscricao).

- Até 7 dias da aprovação (direito de arrependimento): o sistema estorna tudo no Asaas (cobrança, parcelamento inteiro ou assinatura apagada mais a 1ª mensalidade) e encerra o acesso na hora (encerrar_pedido reembolsado). Se o Asaas falhar, o pedido fica registrado, o acesso continua e o painel mostra "Estornar no Asaas" para a equipe.
- Depois dos 7 dias: não há cancelamento. As cobranças combinadas seguem, o acesso vai até o fim dos 12 meses e o pedido fica marcado como não renovar.
- Ao fim dos 12 meses não há cobrança automática em nenhum plano: quem não pediu para não renovar recebe um e-mail convidando a renovar (a fazer, primeiro vencimento em 10/2027).

## Consequências

- pedidos ganha cancelamento_pedido_em, cancelamento_tipo (arrependimento, nao_renovar) e cancelamento_motivo; só a Edge Function (serviço) grava, a equipe lê no painel (Cancelamentos).
- A regra dos 7 dias está em _shared/pagamento/cancelamento.ts e src/domain/cancelamento.ts, com teste que confere as duas.
- Os termos de uso descrevem o cancelamento, o fim do plano e o convite de renovação.
