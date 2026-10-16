// Painel: gera o link para conectar a conta Google da ORA e cria a sala do Meet da live.
// Só profissional (papel admin); o token do Google nunca sai do servidor.
import { z } from 'zod'
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { acessoPor, assinarEstado, criarSala, urlAutorizacao } from '../_shared/google.ts'
import { json, servico } from '../_shared/servico.ts'

const esquema = z.union([
  z.object({ acao: z.literal('conectar') }),
  z.object({ acao: z.literal('sala'), live: z.uuid() }),
])

async function profissional(req: Request): Promise<string | null> {
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data } = await servico.auth.getUser(token)
  if (!data.user) return null
  const { data: perfil } = await servico
    .from('perfis')
    .select('papel')
    .eq('id', data.user.id)
    .single<{ papel: string }>()
  return perfil?.papel === 'admin' ? data.user.id : null
}

async function sala(live: string): Promise<[Record<string, unknown>, number]> {
  const { data: l } = await servico
    .from('lives')
    .select('id, link_url')
    .eq('id', live)
    .maybeSingle<{ id: string; link_url: string | null }>()
  if (!l) return [{ ok: false, erro: 'sem_live' }, 404]
  if (l.link_url) return [{ ok: true, link: l.link_url }, 200]
  const { data: c } = await servico
    .from('conexao_google')
    .select('refresh_token')
    .maybeSingle<{ refresh_token: string }>()
  if (!c) return [{ ok: false, erro: 'sem_conexao' }, 409]
  const s = await criarSala(await acessoPor(c.refresh_token))
  const { error } = await servico
    .from('lives')
    .update({ link_url: s.meetingUri, google_evento_id: s.name })
    .eq('id', l.id)
    .is('link_url', null)
  if (error) throw new Error(error.message)
  return [{ ok: true, link: s.meetingUri }, 200]
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  const cors = cabecalhosCors(origem)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  const perfil = await profissional(req)
  if (!perfil) return json({ ok: false, erro: 'sem_permissao' }, 401, cors)
  const lido = esquema.safeParse(await req.json().catch(() => null))
  if (!lido.success) return json({ ok: false, erro: 'dados' }, 400, cors)
  try {
    if (lido.data.acao === 'conectar') {
      const estado = await assinarEstado(perfil, Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '')
      return json({ ok: true, url: urlAutorizacao(estado) }, 200, cors)
    }
    const [corpo, status] = await sala(lido.data.live)
    return json(corpo, status, cors)
  } catch (e) {
    console.error('google-meet', e instanceof Error ? e.message : e)
    return json({ ok: false, erro: 'falha' }, 502, cors)
  }
})
