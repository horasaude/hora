# _shared

Código comum das Edge Functions. Cada função fica em supabase/functions/<nome>/index.ts e importa daqui.

| Arquivo                 | Faz                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| cors.ts                 | CORS pela lista ORIGENS_PERMITIDAS                                                                   |
| servico.ts              | cliente com a chave de serviço, SITE_URL e resposta JSON                                             |
| mp.ts                   | API do Mercado Pago: /v1/payments, /preapproval, /authorized_payments (MP_ACCESS_TOKEN)              |
| pagamento/regras.ts     | preço decidido no servidor, fim do acesso, formato de valor e data, CPF (testado no Vitest)          |
| pagamento/status.ts     | status do MP para o pedido, motivo da recusa, ação do webhook (testado)                              |
| pagamento/assinatura.ts | validação do x-signature (HMAC SHA-256, manifesto id/request-id/ts) (testado)                        |
| email/boasVindas.ts     | pagamento confirmado: resumo da compra, plataforma, usuário, criar senha (24 h), instalar no celular |
| email/modelos.ts        | boas-vindas, lembrete do Pix e cobrança recusada (HTML simples, Arial, botão verde ORA)              |
| email/enviar.ts         | envio único pelo Resend (RESEND_API_KEY, EMAIL_REMETENTE, EMAIL_TESTE)                               |

Arquivos sem Deno (pagamento/ e email/modelos.ts) rodam no Vitest; o resto só no Deno.
