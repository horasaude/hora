// Painel: gera o link para conectar a conta Google da ORA e cria a sala do Meet da live.
// Só profissional (papel admin); o token do Google nunca sai do servidor.
import { z } from 'zod'
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { assinarEstado, urlAutorizacao } from '../_shared/google.ts'
import { json, servico } from '../_shared/servico.ts'
import { prepararSala } from './sala.ts'

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
    const [corpo, status] = await prepararSala(lido.data.live)
    return json(corpo, status, cors)
  } catch (e) {
    console.error('google-meet', e instanceof Error ? e.message : e)
    return json({ ok: false, erro: 'falha' }, 502, cors)
  }
})
