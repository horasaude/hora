// Lembrete do desafio no celular: quem entrou no desafio em andamento e ainda não fez o check-in de hoje.
// Chamada pelo pg_cron às 19h de Brasília, com o cabeçalho x-cron-segredo.
import webpush from 'npm:web-push@3.6.7'
import { mensagemDesafio } from '../_shared/desafio.ts'
import { json, servico } from '../_shared/servico.ts'

type Lembrete = {
  inscricao: string
  endpoint: string
  p256dh: string
  auth: string
  desafio: string
  nome: string
  premio: string
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
  const { data, error } = await servico.rpc('lembretes_de_desafio')
  if (error) return json({ ok: false, erro: error.message }, 500)
  let enviados = 0
  for (const l of (data ?? []) as Lembrete[]) {
    try {
      await webpush.sendNotification(
        { endpoint: l.endpoint, keys: { p256dh: l.p256dh, auth: l.auth } },
        JSON.stringify(mensagemDesafio(l.desafio, l.nome, l.premio ?? '')),
        { TTL: 3600 },
      )
      enviados++
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode
      if (status === 404 || status === 410)
        await servico.from('push_inscricoes').delete().eq('id', l.inscricao)
    }
  }
  return json({ ok: true, enviados })
})
