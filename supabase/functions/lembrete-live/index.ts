// Lembrete da live no celular, 1 hora antes, para quem ativou as notificações.
// Chamada a cada 10 minutos pelo pg_cron (x-cron-segredo); cada live é lembrada uma vez só.
import webpush from 'npm:web-push@3.6.7'
import { mensagemLive } from '../_shared/live.ts'
import { json, servico } from '../_shared/servico.ts'

type Linha = {
  live: string
  tema: string
  data: string
  inscricao: string
  endpoint: string
  p256dh: string
  auth: string
}

Deno.serve(async (req) => {
  const segredo = Deno.env.get('CRON_SEGREDO') ?? ''
  if (req.method !== 'POST' || !segredo || req.headers.get('x-cron-segredo') !== segredo)
    return json({ ok: false }, 401)
  webpush.setVapidDetails(
    Deno.env.get('VAPID_ASSUNTO') ?? 'mailto:acesso@comunidadeora.com.br',
    Deno.env.get('VAPID_PUBLICA') ?? '',
    Deno.env.get('VAPID_PRIVADA') ?? '',
  )
  const { data, error } = await servico.rpc('lembretes_de_live')
  if (error) return json({ ok: false, erro: error.message }, 500)
  const linhas = (data ?? []) as Linha[]
  let enviados = 0
  for (const l of linhas) {
    try {
      await webpush.sendNotification(
        { endpoint: l.endpoint, keys: { p256dh: l.p256dh, auth: l.auth } },
        JSON.stringify(mensagemLive(l.tema, l.data)),
        { TTL: 3600 },
      )
      enviados++
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode
      if (status === 404 || status === 410)
        await servico.from('push_inscricoes').delete().eq('id', l.inscricao)
    }
  }
  const lives = [...new Set(linhas.map((l) => l.live))]
  if (lives.length)
    await servico
      .from('lives')
      .update({ lembrete_push_em: new Date().toISOString() })
      .in('id', lives)
  return json({ ok: true, enviados, lives: lives.length })
})
