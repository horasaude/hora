// Notificações do Asaas. Só aceita com o token do cabeçalho asaas-access-token (ASAAS_WEBHOOK_TOKEN);
// nunca confia no corpo: busca a cobrança ou a assinatura na API antes de mudar qualquer coisa.
import { processar } from './processar.ts'
import { tratar } from './tratar.ts'

Deno.serve((req) => tratar(req, Deno.env.get('ASAAS_WEBHOOK_TOKEN') ?? '', processar))
