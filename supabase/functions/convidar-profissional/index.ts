import { createClient } from '@supabase/supabase-js'
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { lerPedido, type Pedido } from './validar.ts'

// Só o painel chama: confere que quem pede é profissional (papel admin) antes de usar a chave de serviço.
const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
)

type Resposta = { ok: boolean; link?: string; erro?: string }

function responder(corpo: Resposta, status: number, origem: string): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...cabecalhosCors(origem), 'Content-Type': 'application/json' },
  })
}

async function ehProfissional(req: Request): Promise<boolean> {
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return false
  const { data } = await admin.auth.getUser(token)
  if (!data.user) return false
  const { data: perfil } = await admin
    .from('perfis')
    .select('papel')
    .eq('id', data.user.id)
    .single()
  return perfil?.papel === 'admin'
}

async function convidar(
  p: Extract<Pedido, { acao: 'convidar' }>,
  destino: string,
): Promise<[Resposta, number]> {
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'invite',
    email: p.email,
    options: { redirectTo: destino, data: { nome: p.nome } },
  })
  if (error) {
    const existe = error.code === 'email_exists' || error.status === 422
    return [{ ok: false, erro: existe ? 'ja_existe' : 'falha' }, existe ? 409 : 500]
  }
  const { error: erroPerfil } = await admin
    .from('perfis')
    .update({
      papel: 'admin',
      nome: p.nome,
      especialidade: p.especialidade,
      titulo_profissional: p.titulo,
    })
    .eq('id', data.user.id)
  if (erroPerfil) return [{ ok: false, erro: 'falha' }, 500]
  return [{ ok: true, link: data.properties.action_link }, 200]
}

async function novoLink(perfil: string, destino: string): Promise<[Resposta, number]> {
  const { data: p } = await admin.from('perfis').select('papel').eq('id', perfil).single()
  if (p?.papel !== 'admin') return [{ ok: false, erro: 'nao_encontrada' }, 404]
  const { data: u } = await admin.auth.admin.getUserById(perfil)
  if (!u.user?.email) return [{ ok: false, erro: 'nao_encontrada' }, 404]
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: u.user.email,
    options: { redirectTo: destino },
  })
  if (error) return [{ ok: false, erro: 'falha' }, 500]
  return [{ ok: true, link: data.properties.action_link }, 200]
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: cabecalhosCors(origem) })
  if (req.method !== 'POST') return responder({ ok: false }, 405, origem)
  if (!(await ehProfissional(req)))
    return responder({ ok: false, erro: 'sem_permissao' }, 403, origem)
  let pedido: Pedido | null = null
  try {
    pedido = lerPedido(JSON.parse((await req.text()).slice(0, 5000)))
  } catch {
    pedido = null
  }
  if (!pedido) return responder({ ok: false, erro: 'invalido' }, 400, origem)
  const destino = `${origem}/definir-senha`
  const [corpo, status] =
    pedido.acao === 'convidar'
      ? await convidar(pedido, destino)
      : await novoLink(pedido.perfil, destino)
  if (!corpo.ok) console.error('convidar-profissional:', pedido.acao, corpo.erro)
  return responder(corpo, status, origem)
})
