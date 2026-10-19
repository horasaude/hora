# 0005 Asaas no lugar do Mercado Pago

Data: 2026-10-19. Substitui a parte de pagamento da decisão 0001 e a opção 1 de 2026-10-05 (Payment Brick).

## Contexto

Em produção o Mercado Pago recusou toda validação de cartão da assinatura mensal (CC_VAL_433, sem chegar ao banco), a conta da cliente tinha pendência de endereço e cada ajuste no painel pedia reconhecimento facial da dona, que está em outro estado. Faltavam 5 dias para o lançamento.

## Decisão

Asaas, na conta da cliente. Pix gerado na tela do checkout (QR e copia e cola). Cartão, no parcelado (1x a 12x sem juros para a cliente, mesmo total) e no mensal (assinatura de 12 cobranças), digitado no próprio checkout, a pedido da dona do projeto (nada de mandar a cliente para outra página). O Asaas não tem campos seguros de cartão para o navegador, então o cartão passa pela Edge Function criar-pedido, por HTTPS, direto para a API do Asaas (creditCard, creditCardHolderInfo, remoteIp), sem gravar nem logar. Primeira versão do dia usava a página do Asaas (invoiceUrl) e foi trocada.

## Consequências

- O cartão passa pelo nosso servidor (escopo PCI maior que com campos hospedados): nunca gravar, logar nem devolver esses campos; o pedido grava só os campos listados no insert.
- O checkout pede CEP e número do endereço do titular, exigidos pelo Asaas no cartão.
- Sem tela própria de trocar cartão: mensalidade recusada manda o link da cobrança no Asaas.
- Webhook autenticado por token fixo (asaas-access-token), comparado em tempo constante; o corpo nunca é confiado, tudo é buscado na API.
- Colunas mp_* em pedidos guardam os ids do Asaas (nome antigo, sem migração).
