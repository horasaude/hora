# feature: checkout

Checkout próprio (rota /checkout), no formato do Hotmart e na identidade do ORA. Pagamento pelo Asaas (decisão 0005, de 2026-10-19, no lugar do Mercado Pago): Pix na própria tela; cartão (parcelado e mensal) digitado na página segura do Asaas, que devolve a cliente para /obrigada.

| Arquivo                  | Faz                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| pages/CheckoutPage.tsx   | Banner, formulário (resumo, dados, pagamento) e lateral; troca o pagamento pelo Pix gerado |
| components/Pagamento.tsx | Forma de pagamento, total, aviso de erro e o botão vidro verde "Finalizar compra"          |
| components/PixGerado.tsx | QR grande, "Copiar código Pix", contagem de 30 min, aviso do e-mail                        |
| components/valores.ts    | Texto do valor de cada plano                                                               |
| hooks/useCheckout.ts     | React Hook Form, preenchido com o que veio do popup                                        |
| hooks/useFinalizar.ts    | Chama criar-pedido com UTMs e indicação; Pix na tela, cartão vai para a página do Asaas    |
| hooks/usePixPendente.ts  | Contagem do Pix e consulta da situação a cada 5 s                                          |
| api/pedido.api.ts        | Edge Function criar-pedido, resposta validada com zod (pagar_url só https)                 |
| inscricao.ts             | Passagem popup para checkout pela sessão do navegador (nunca na URL)                       |
| schemas/checkout.ts      | zod; CPF pelos dígitos verificadores (src/domain/cpf.ts)                                   |
| textos.ts                | Toda a copy                                                                                |

## Como o pagamento anda

1. A tela manda dados e plano para criar-pedido. Valor nunca sai da tela: o servidor calcula pela tabela configuracoes (oferta do ORA só na janela do dia 24/10, horário de Brasília).
2. criar-pedido grava o pedido, cria a cliente no Asaas (sem avisos do Asaas) e a cobrança com externalReference = id do pedido: Pix em POST /payments + /pixQrCode; parcelado em POST /payments com installmentCount 12 sobre o total; mensal em POST /subscriptions (MONTHLY, maxPayments 12). Cartão devolve pagar_url (invoiceUrl) e a tela redireciona; o Asaas volta para /obrigada?pedido=.
3. O acesso só nasce no pagamento-webhook: confere o token asaas-access-token, busca a cobrança ou a assinatura na API e chama as funções do banco. Aprovado (CONFIRMED ou RECEIVED) cria ou reaproveita a conta, libera 12 meses (13 com a oferta) e manda o e-mail com "Criar minha senha". Mensalidade recusada manda o e-mail com o link da própria cobrança no Asaas.
4. /obrigada?pedido= consulta situacao_pedido e mostra aprovado, esperando o pagamento ou recusado.

As colunas pedidos.mp_pagamento_id e mp_assinatura_id guardam os ids do Asaas (nome antigo, mantido para não mexer no banco às vésperas do lançamento).

## Teste

- Sandbox do Asaas (sandbox.asaas.com): chave que não começa com $aact_prod_. Cartão de teste 5162306219378829, qualquer validade futura e CVV 318; Pix se confirma no painel do sandbox.
- O motivo de toda falha do Asaas fica em pedidos.status_detalhe.

## Chaves

- Supabase secrets: ASAAS_API_KEY (o prefixo $aact_prod_ liga a produção), ASAAS_WEBHOOK_TOKEN, RESEND_API_KEY, EMAIL_REMETENTE, SITE_URL, WHATSAPP_NUMERO. Gravados pelo script ligar-asaas.sh, que também cria o webhook pela API.
- Webhook do Asaas: https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/pagamento-webhook, eventos de cobrança e de assinatura.

Exporta (index.ts): CheckoutPage, salvarInscricao.
