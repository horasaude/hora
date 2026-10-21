// Profissional toca em "Lembrar" na ficha da aluna: o banco confere que é da equipe e que a tarefa
// ainda está pendente (lembrar_aluna); aqui o aviso também vai para o celular dela, se ativou as notificações.
import webpush from 'npm:web-push@3.6.7'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { json, servico } from '../_shared/servico.ts'

const entrada = z.object({ perfil: z.uuid(), item: z.string().min(1).max(60) })

type Inscricao = { id: string; endpoint: string; p256dh: string; auth: string }

async function avisarNoCelular(perfil: string, item: string, nome: string, para: string) {
  webpush.setVapidDetails(
    Deno.env.get('VAPID_ASSUNTO') ?? 'mailto:acesso@comunidadeora.com.br',
    Deno.env.get('VAPID_PUBLICA') ?? '',
    Deno.env.get('VAPID_PRIVADA') ?? '',
  )
  const { data } = await servico
    .from('push_inscricoes')
    .select('id, endpoint, p256dh, auth')
    .eq('perfil_id', perfil)
  let enviados = 0
  for (const i of (data ?? []) as Inscricao[]) {
    try {
      await webpush.sendNotification(
        { endpoint: i.endpoint, keys: { p256dh: i.p256dh, auth: i.auth } },
        JSON.stringify({
          title: 'A equipe ORA pediu',
          body: nome,
          url: para,
          tag: `pedido-${item}`,
        }),
        { TTL: 86400 },
      )
      enviados++
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode
      if (status === 404 || status === 410)
        await servico.from('push_inscricoes').delete().eq('id', i.id)
    }
  }
  return enviados
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  const cors = cabecalhosCors(origem)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return json({ ok: false }, 405, cors)
  const lido = entrada.safeParse(await req.json().catch(() => null))
  if (!lido.success) return json({ ok: false, erro: 'dados' }, 400, cors)
  const daEquipe = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: { headers: { Authorization: req.headers.get('authorization') ?? '' } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
  const { data, error } = await daEquipe.rpc('lembrar_aluna', {
    p_perfil: lido.data.perfil,
    p_item: lido.data.item,
  })
  if (error)
    return json(
      { ok: false, erro: error.code === '42501' ? 'sem_acesso' : 'falha' },
      error.code === '42501' ? 403 : 409,
      cors,
    )
  const r = ((data ?? []) as { nome: string; para: string; novo: boolean }[])[0]
  if (!r) return json({ ok: false, erro: 'falha' }, 409, cors)
  const enviados = r.novo
    ? await avisarNoCelular(lido.data.perfil, lido.data.item, r.nome, r.para).catch(() => 0)
    : 0
  return json({ ok: true, novo: r.novo, celular: enviados }, 200, cors)
})
