// Posta a gravação das lives: a cada 10 minutos o pg_cron chama (x-cron-segredo) só quando há live
// encerrada sem gravação (até 3 dias depois). Achando o vídeo no Drive, grava o link na live.
import { acessoPor } from '../_shared/google.ts'
import { gravacaoDaSala } from '../_shared/gravacao.ts'
import { json, servico } from '../_shared/servico.ts'

type Pendente = { live: string; sala: string; inicio: string }

async function postar(acesso: string, p: Pendente): Promise<boolean> {
  try {
    const link = await gravacaoDaSala(acesso, p.sala, p.inicio)
    if (!link) return false
    const { error } = await servico
      .from('lives')
      .update({ gravacao_url: link })
      .eq('id', p.live)
      .is('gravacao_url', null)
    if (error) throw new Error(error.message)
    return true
  } catch (e) {
    console.error('gravacao-live', p.live, e instanceof Error ? e.message : e)
    return false
  }
}

Deno.serve(async (req) => {
  const segredo = Deno.env.get('CRON_SEGREDO') ?? ''
  if (req.method !== 'POST' || !segredo || req.headers.get('x-cron-segredo') !== segredo)
    return json({ ok: false }, 401)
  const { data, error } = await servico.rpc('gravacoes_pendentes')
  if (error) return json({ ok: false, erro: error.message }, 500)
  const pendentes = (data ?? []) as Pendente[]
  if (pendentes.length === 0) return json({ ok: true, postadas: 0 })
  const { data: c } = await servico
    .from('conexao_google')
    .select('refresh_token')
    .maybeSingle<{ refresh_token: string }>()
  if (!c) return json({ ok: false, erro: 'sem_conexao' }, 409)
  const acesso = await acessoPor(c.refresh_token)
  let postadas = 0
  for (const p of pendentes) if (await postar(acesso, p)) postadas++
  return json({ ok: true, postadas })
})
