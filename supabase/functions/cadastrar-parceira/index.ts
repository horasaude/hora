// Painel, Membros > Alunas > Cadastrar parceira: cria a conta (ou usa a que já existe), libera o
// acesso pelo prazo escolhido (registrar_parceira) e manda o e-mail para ela criar a senha.
// Só profissional (papel admin) chama; a chave de serviço nunca sai daqui.
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { enviarEmail } from '../_shared/email/enviar.ts'
import { linkWhatsApp } from '../_shared/email/modelos.ts'
import { parceria } from '../_shared/email/parceria.ts'
import { servico, SITE } from '../_shared/servico.ts'
import { lerPedido, type Pedido } from './validar.ts'

type Resposta = { ok: boolean; enviado?: boolean; erro?: string }

function responder(corpo: Resposta, status: number, origem: string): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...cabecalhosCors(origem), 'Content-Type': 'application/json' },
  })
}

/** Id de quem pede, se for profissional; senão null. */
async function profissional(req: Request): Promise<string | null> {
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data } = await servico.auth.getUser(token)
  if (!data.user) return null
  const { data: p } = await servico.from('perfis').select('papel').eq('id', data.user.id).single()
  return p?.papel === 'admin' ? data.user.id : null
}

async function conta(nome: string, email: string): Promise<string> {
  const { data: existente } = await servico.rpc('perfil_por_email', { p_email: email })
  if (typeof existente === 'string') {
    await servico.from('perfis').update({ nome }).eq('id', existente).eq('nome', '')
    return existente
  }
  const { data, error } = await servico.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { nome },
  })
  if (error || !data.user) throw new Error(`criar conta: ${error?.message}`)
  return data.user.id
}

const mandar = (d: { nome: string; email: string; meses: number; codigo: string }) =>
  enviarEmail(
    d.email,
    parceria({
      site: SITE,
      nome: d.nome,
      email: d.email,
      meses: d.meses,
      whatsapp: linkWhatsApp(Deno.env.get('WHATSAPP_NUMERO')),
      link: `${SITE}/acesso/${d.codigo}`,
    }),
  )

async function cadastrar(
  p: Extract<Pedido, { acao: 'cadastrar' }>,
  por: string,
): Promise<[Resposta, number]> {
  const perfil = await conta(p.nome, p.email)
  const { data: codigo, error } = await servico.rpc('registrar_parceira', {
    p_perfil: perfil,
    p_meses: p.meses,
    p_por: por,
  })
  if (error) {
    const motivo = ['ja_tem_acesso', 'equipe'].find((m) => error.message.includes(m))
    if (motivo) return [{ ok: false, erro: motivo }, 409]
    throw new Error(`registrar_parceira: ${error.message}`)
  }
  const enviado = await mandar({ ...p, codigo: String(codigo) })
  return [{ ok: true, enviado }, 200]
}

async function reenviar(perfil: string): Promise<[Resposta, number]> {
  const { data: pa } = await servico
    .from('parceiras')
    .select('meses, codigo_acesso')
    .eq('perfil_id', perfil)
    .maybeSingle()
  const { data: u } = await servico.auth.admin.getUserById(perfil)
  if (!pa || !u.user?.email) return [{ ok: false, erro: 'nao_encontrada' }, 404]
  const { data: pe } = await servico.from('perfis').select('nome').eq('id', perfil).single()
  const enviado = await mandar({
    nome: pe?.nome ?? '',
    email: u.user.email,
    meses: pa.meses,
    codigo: pa.codigo_acesso,
  })
  return [{ ok: true, enviado }, 200]
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: cabecalhosCors(origem) })
  if (req.method !== 'POST') return responder({ ok: false }, 405, origem)
  const por = await profissional(req)
  if (!por) return responder({ ok: false, erro: 'sem_permissao' }, 403, origem)
  let pedido: Pedido | null = null
  try {
    pedido = lerPedido(JSON.parse((await req.text()).slice(0, 5000)))
  } catch {
    pedido = null
  }
  if (!pedido) return responder({ ok: false, erro: 'invalido' }, 400, origem)
  try {
    const [corpo, status] =
      pedido.acao === 'cadastrar' ? await cadastrar(pedido, por) : await reenviar(pedido.perfil)
    return responder(corpo, status, origem)
  } catch (e) {
    console.error('cadastrar-parceira:', e instanceof Error ? e.message : e)
    return responder({ ok: false, erro: 'falha' }, 500, origem)
  }
})
