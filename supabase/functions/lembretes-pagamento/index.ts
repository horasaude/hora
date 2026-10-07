// Lembrete do Pix: se o pagamento não caiu em 15 minutos, manda o copia e cola por e-mail, uma vez.
// Chamada a cada 5 minutos pelo pg_cron, com o cabeçalho x-cron-segredo igual ao secret CRON_SEGREDO.
import { enviarEmail } from '../_shared/email/enviar.ts'
import { lembretePix, linkWhatsApp } from '../_shared/email/modelos.ts'
import { mp } from '../_shared/mp.ts'
import { LEMBRETE_PIX_MINUTOS } from '../_shared/pagamento/regras.ts'
import { json, servico, SITE } from '../_shared/servico.ts'

type Pix = {
  id: string
  nome: string
  email: string
  pix_copia_cola: string
  mp_pagamento_id: string
}

async function lembrar(p: Pix): Promise<boolean> {
  const atual = await mp.pagamento(p.mp_pagamento_id)
  if (atual.status !== 'pending') return false
  const email = lembretePix({
    site: SITE,
    nome: p.nome,
    whatsapp: linkWhatsApp(Deno.env.get('WHATSAPP_NUMERO')),
    copiaCola: p.pix_copia_cola,
    checkout: `${SITE}/checkout`,
  })
  if (!(await enviarEmail(p.email, email, `lembrete-pix-${p.id}`))) return false
  await servico.from('pedidos').update({ lembrete_pix_em: new Date().toISOString() }).eq('id', p.id)
  return true
}

Deno.serve(async (req) => {
  const segredo = Deno.env.get('CRON_SEGREDO') ?? ''
  if (req.method !== 'POST' || !segredo || req.headers.get('x-cron-segredo') !== segredo)
    return json({ ok: false }, 401)
  const agora = Date.now()
  const { data, error } = await servico
    .from('pedidos')
    .select('id, nome, email, pix_copia_cola, mp_pagamento_id')
    .eq('plano', 'pix')
    .eq('status', 'pendente')
    .is('lembrete_pix_em', null)
    .not('pix_copia_cola', 'is', null)
    .not('mp_pagamento_id', 'is', null)
    .lte('created_at', new Date(agora - LEMBRETE_PIX_MINUTOS * 60_000).toISOString())
    .gt('pix_expira_em', new Date(agora).toISOString())
    .limit(50)
  if (error) return json({ ok: false }, 500)
  let enviados = 0
  for (const p of (data ?? []) as Pix[]) {
    try {
      if (await lembrar(p)) enviados++
    } catch (e) {
      console.error('lembrete-pix', p.id, e instanceof Error ? e.message : e)
    }
  }
  return json({ ok: true, enviados })
})
