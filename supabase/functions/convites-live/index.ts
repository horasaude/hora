// Convites de agenda das lives (.ics por e-mail). Chamada a cada minuto pelo pg_cron (x-cron-segredo)
// só quando há convite pendente: live publicada vai para equipe, convidadas e alunas com acesso;
// mudança de tema ou horário manda a atualização; tirar do ar ou perder o acesso manda o cancelamento.
import { emailConvite } from '../_shared/email/conviteLive.ts'
import { enviarEmail } from '../_shared/email/enviar.ts'
import { json, servico, SITE } from '../_shared/servico.ts'

type Pendente = {
  live: string
  email: string
  nome: string | null
  metodo: 'REQUEST' | 'CANCEL'
  seq: number
  tema: string
  data: string
  duracao_minutos: number
}

const POR_RODADA = 40
const INTERVALO_MS = 600
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** E-mail do remetente (EMAIL_REMETENTE vem como "ORA <contato@...>"). */
const organizador = () =>
  /<([^>]+)>/.exec(Deno.env.get('EMAIL_REMETENTE') ?? '')?.[1] ?? 'contato@comunidadeora.com.br'

async function enviar(c: Pendente): Promise<boolean> {
  const email = emailConvite({
    live: c.live,
    seq: c.seq,
    metodo: c.metodo,
    tema: c.tema,
    inicio: new Date(c.data),
    minutos: c.duracao_minutos,
    para: c.email,
    nome: c.nome,
    organizador: organizador(),
    site: SITE,
  })
  if (!(await enviarEmail(c.email, email, `convite-${c.live}-${c.email}-${c.metodo}-${c.seq}`)))
    return false
  const { error } = await servico.from('lives_convites').upsert({
    live_id: c.live,
    email: c.email,
    nome: c.nome,
    seq: c.seq,
    metodo: c.metodo,
    enviado_em: new Date().toISOString(),
  })
  return !error
}

Deno.serve(async (req) => {
  const segredo = Deno.env.get('CRON_SEGREDO') ?? ''
  if (req.method !== 'POST' || !segredo || req.headers.get('x-cron-segredo') !== segredo)
    return json({ ok: false }, 401)
  const { data, error } = await servico.rpc('convites_pendentes', { p_limite: POR_RODADA })
  if (error) return json({ ok: false, erro: error.message }, 500)
  let enviados = 0
  let falhas = 0
  for (const c of (data ?? []) as Pendente[]) {
    if (await enviar(c)) enviados++
    else falhas++
    await espera(INTERVALO_MS)
  }
  if (falhas) console.error('convites-live: falhas', falhas)
  return json({ ok: true, enviados, falhas })
})
