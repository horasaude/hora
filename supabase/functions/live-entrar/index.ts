// Aluna clica em "Entrar na live" no ORA: o banco confere acesso e horário e dá os pontos
// (entrar_live); aqui ela vira membro da sala restrita do Meet, para entrar sem pedir.
// O link da sala só sai por aqui, na hora da live; repassado, cai no "Pedir para participar".
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { acessoPor } from '../_shared/google.ts'
import { adicionarMembro } from '../_shared/meet.ts'
import { json, servico } from '../_shared/servico.ts'

const entrada = z.object({ live: z.uuid() })

const ERROS: Record<string, [string, number]> = {
  '42501': ['sem_acesso', 403],
  P0002: ['sem_live', 404],
  '22023': ['fora_do_horario', 409],
}

/** Põe a aluna como membro; se o Google falhar, ela ainda entra pedindo para participar. */
async function virarMembro(live: string, email: string) {
  try {
    const [{ data: s }, { data: c }] = await Promise.all([
      servico.from('lives_salas').select('google_sala').eq('live_id', live).maybeSingle(),
      servico.from('conexao_google').select('refresh_token').maybeSingle(),
    ])
    if (!s?.google_sala || !c?.refresh_token) return
    await adicionarMembro(await acessoPor(c.refresh_token), s.google_sala, email)
  } catch (e) {
    console.error('live-entrar membro', e instanceof Error ? e.message : e)
  }
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  const cors = cabecalhosCors(origem)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return json({ ok: false }, 405, cors)
  const lido = entrada.safeParse(await req.json().catch(() => null))
  if (!lido.success) return json({ ok: false, erro: 'dados' }, 400, cors)
  const daAluna = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: { headers: { Authorization: req.headers.get('authorization') ?? '' } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
  const { data: quem } = await daAluna.auth.getUser()
  if (!quem.user?.email) return json({ ok: false, erro: 'sem_acesso' }, 401, cors)
  const { data, error } = await daAluna.rpc('entrar_live', { p_live: lido.data.live })
  if (error) {
    const [erro, status] = ERROS[error.code ?? ''] ?? ['falha', 500]
    return json({ ok: false, erro }, status, cors)
  }
  const r = (data ?? {}) as { link?: string | null; pontos?: number }
  if (r.link) await virarMembro(lido.data.live, quem.user.email)
  return json({ ok: true, link: r.link ?? null, pontos: r.pontos ?? 0 }, 200, cors)
})
