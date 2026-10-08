# feature: checkout

Checkout próprio (rota /checkout), no formato do Hotmart e na identidade do ORA, com o Payment Brick do Mercado Pago. Decisão: opção 1 de 2026-10-05 (checkout próprio com campos seguros do Mercado Pago).

| Arquivo                       | Faz                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| pages/CheckoutPage.tsx        | Banner, formulário (resumo, dados, pagamento) e lateral; troca o pagamento pelo Pix ou recusa   |
| pages/TrocarCartaoPage.tsx    | /checkout/cartao?pedido=: troca o cartão da assinatura mensal (link do e-mail de recusa)        |
| components/Pagamento.tsx      | Quadro #pagamento-mp com o Brick, total, aviso de erro e o botão vidro verde "Finalizar compra" |
| components/brick.ts           | Ajustes do Brick: só Pix no à vista, só crédito no parcelado (12x) e no mensal; cores do ORA    |
| components/PixGerado.tsx      | QR grande, "Copiar código Pix", contagem de 30 min, aviso do e-mail                             |
| components/CartaoRecusado.tsx | Recusa em português pelo motivo (saldo, dados, banco) e "Tentar outro cartão"                   |
| components/valores.ts         | Texto do valor de cada plano e o valor que o Brick cobra                                        |
| hooks/useCheckout.ts          | React Hook Form, preenchido com o que veio do popup                                             |
| hooks/useBrick.ts             | Monta e remonta o Brick; entrega o token do cartão                                              |
| hooks/useFinalizar.ts         | Chama criar-pedido com UTMs e indicação; Pix na tela, cartão vai para /obrigada?pedido=         |
| hooks/usePixPendente.ts       | Contagem do Pix e consulta da situação a cada 5 s                                               |
| api/pedido.api.ts             | Edge Function criar-pedido (criar e trocar cartão), resposta validada com zod                   |
| inscricao.ts                  | Passagem popup para checkout pela sessão do navegador (nunca na URL)                            |
| schemas/checkout.ts           | zod; CPF pelos dígitos verificadores (src/domain/cpf.ts)                                        |
| textos.ts                     | Toda a copy                                                                                     |

## Como o pagamento anda

1. A tela manda dados, plano e (no cartão) o token do Brick para criar-pedido. Valor nunca sai da tela: o servidor calcula pela tabela configuracoes (oferta do ORA só na janela do dia 24/10, horário de Brasília).
2. criar-pedido grava o pedido (status criado) e chama o Mercado Pago com X-Idempotency-Key = id do pedido: Pix em POST /v1/payments (expira em 30 min), parcelado em POST /v1/payments com 12 parcelas sobre o total, mensal em POST /preapproval (12 cobranças, cartão do Brick).
3. O acesso só nasce no pagamento-webhook: confere a assinatura, busca o pagamento, a assinatura ou a cobrança na API e chama as funções do banco. Aprovado cria ou reaproveita a conta, libera 12 meses (13 com a oferta) e manda o e-mail com "Criar minha senha".
4. /obrigada?pedido= consulta situacao_pedido e mostra aprovado, esperando o Pix ou recusado.

## Chaves (trocar só isso quando chegar a conta das clientes)

- Supabase secrets: MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET, RESEND_API_KEY, EMAIL_REMETENTE (ex.: ORA <acesso@dominio>), EMAIL_TESTE (só enquanto o Resend não tiver domínio; desvia todo envio para esse endereço), SITE_URL (vendas e checkout, https://comunidadeora.com.br), APP_URL (plataforma, https://app.comunidadeora.com.br; o link de criar senha vai para lá), WHATSAPP_NUMERO.
- Vercel e .env.local: VITE_MP_PUBLIC_KEY (tipo Config). Sem ela, o checkout avisa que o pagamento não está disponível.
- Painel do Mercado Pago: Suas integrações > aplicação > Webhooks > URL https://zijtjwhvnhfarmfscmnr.supabase.co/functions/v1/pagamento-webhook com os eventos Pagamentos, Planos e assinaturas (subscription_preapproval e subscription_authorized_payment).

Exporta (index.ts): CheckoutPage, TrocarCartaoPage, salvarInscricao.
