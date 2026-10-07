// Notificações do Mercado Pago. Só aceita com assinatura x-signature válida (MP_WEBHOOK_SECRET);
// nunca confia no corpo: busca pagamento, assinatura ou cobrança na API antes de mudar qualquer coisa.
import { processar } from './processar.ts'
import { tratar } from './tratar.ts'

Deno.serve((req) => tratar(req, Deno.env.get('MP_WEBHOOK_SECRET') ?? '', processar))
