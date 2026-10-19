# 0005 Asaas no lugar do Mercado Pago

Data: 2026-10-19. Substitui a parte de pagamento da decisão 0001 e a opção 1 de 2026-10-05 (Payment Brick).

## Contexto

Em produção o Mercado Pago recusou toda validação de cartão da assinatura mensal (CC_VAL_433, sem chegar ao banco), a conta da cliente tinha pendência de endereço e cada ajuste no painel pedia reconhecimento facial da dona, que está em outro estado. Faltavam 5 dias para o lançamento.

## Decisão

Asaas, na conta da cliente. Pix gerado na tela do checkout (QR e copia e cola). Cartão, no parcelado (12x sem juros para a cliente) e no mensal (assinatura de 12 cobranças), digitado na página segura do Asaas (invoiceUrl), que volta para /obrigada. O Asaas não tem campos seguros de cartão para o navegador; mandar o número do cartão pelo nosso servidor traria o ORA para dentro do escopo PCI.

## Consequências

- A cliente sai do site para digitar o cartão; a escolha de 1x a 12x deixa de existir (sempre 12x, total igual).
- Sem tela própria de trocar cartão: mensalidade recusada manda o link da cobrança no Asaas.
- Webhook autenticado por token fixo (asaas-access-token), comparado em tempo constante; o corpo nunca é confiado, tudo é buscado na API.
- Colunas mp_* em pedidos guardam os ids do Asaas (nome antigo, sem migração).
