# feature: checkout

Checkout próprio (rota /checkout), no formato do Hotmart e na identidade do ORA. Decisão: opção 1 de 2026-10-05 (checkout próprio com campos seguros do Mercado Pago, em vez da página do Mercado Pago).

| Arquivo                      | Faz                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| pages/CheckoutPage.tsx       | Banner, formulário (resumo, dados, pagamento) e lateral                                            |
| components/Banner.tsx        | Foto das três, logo e a oferta quando vale                                                         |
| components/Resumo.tsx        | Produto, valor e troca de plano                                                                    |
| components/DadosPessoais.tsx | E-mail, nome completo, CPF e WhatsApp, com máscara                                                 |
| components/Pagamento.tsx     | Pix no à vista, cartão no parcelado e mensal; quadro #pagamento-mp; aceite dos termos sem checkbox |
| components/Lateral.tsx       | O que está incluído, garantia, ajuda no WhatsApp, compra segura                                    |
| components/valores.ts        | Texto do valor de cada plano                                                                       |
| hooks/useCheckout.ts         | React Hook Form, preenchido com o que veio do popup                                                |
| inscricao.ts                 | Passagem popup para checkout pela sessão do navegador (nunca na URL)                               |
| schemas/checkout.ts          | zod; CPF pelos dígitos verificadores (src/domain/cpf.ts)                                           |
| textos.ts                    | Toda a copy                                                                                        |

Pagamento: ainda não ligado. Com tudo válido, "Finalizar compra" só avisa que o pagamento será liberado em breve. Quando a conta Mercado Pago da cliente chegar: Payment Brick no #pagamento-mp e Edge Function criar-pedido (Sprint 2).

Exporta (index.ts): CheckoutPage, salvarInscricao.
