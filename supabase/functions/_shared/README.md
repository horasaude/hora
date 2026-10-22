# _shared

Código comum das Edge Functions. Cada função fica em supabase/functions/<nome>/index.ts e importa daqui.

| Arquivo             | Faz                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| cors.ts             | CORS pela lista ORIGENS_PERMITIDAS                                                                   |
| servico.ts          | cliente com a chave de serviço, SITE_URL e resposta JSON                                             |
| asaas.ts            | API do Asaas v3: clientes, cobranças, Pix, assinaturas (ASAAS_API_KEY; prefixo define o ambiente)    |
| pagamento/regras.ts | preço decidido no servidor, fim do acesso, formato de valor e data, CPF (testado no Vitest)          |
| pagamento/status.ts | status do MP para o pedido, motivo da recusa, ação do webhook (testado)                              |
| email/boasVindas.ts | pagamento confirmado: resumo da compra, plataforma, usuário, criar senha (24 h), instalar no celular |
| email/modelos.ts    | boas-vindas, lembrete do Pix e cobrança recusada (HTML simples, Arial, botão verde ORA)              |
| email/enviar.ts     | envio único pelo SMTP do Google Workspace (SMTP_USUARIO, SMTP_SENHA, EMAIL_REMETENTE, EMAIL_TESTE)   |

Arquivos sem Deno (pagamento/ e email/modelos.ts) rodam no Vitest; o resto só no Deno.
