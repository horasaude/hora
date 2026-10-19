// Cancelamento pedido pela aluna na plataforma (Perfil > Minha conta).
// consultar: devolve o pedido em vigor e o fim do acesso, para a tela mostrar o que vai acontecer.
// cancelar: até 7 dias estorna tudo no Asaas e encerra; depois só registra que não renova.
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { json, servico } from '../_shared/servico.ts'
import { CAMPOS, cancelar, type PedidoAluna } from './cancelar.ts'

const entrada = z.object({
  acao: z.enum(['consultar', 'cancelar']),
  motivo: z.string().trim().max(500).optional(),
})

async function quemPede(autorizacao: string): Promise<string | null> {
  const daAluna = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: { headers: { Authorization: autorizacao } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
  const { data } = await daAluna.auth.getUser()
  return data.user?.id ?? null
}

const ultimo = (perfil: string, soAprovado: boolean) => {
  const q = servico.from('pedidos').select(CAMPOS).eq('perfil_id', perfil)
  return (soAprovado ? q.eq('status', 'aprovado') : q.not('aprovado_em', 'is', null))
    .order('aprovado_em', { ascending: false })
    .limit(1)
    .maybeSingle<PedidoAluna>()
}

/** Compra em vigor (a aprovada mais recente); sem nenhuma, a última que já deu acesso. */
async function pedidoDe(perfil: string) {
  const { data: aprovado } = await ultimo(perfil, true)
  const data = aprovado ?? (await ultimo(perfil, false)).data
  const { data: perfilDados } = await servico
    .from('perfis')
    .select('acesso_fim_em')
    .eq('id', perfil)
    .maybeSingle<{ acesso_fim_em: string | null }>()
  return { pedido: data, fim: perfilDados?.acesso_fim_em ?? null }
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  const cors = cabecalhosCors(origem)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (req.method !== 'POST') return json({ ok: false }, 405, cors)
  const perfil = await quemPede(req.headers.get('authorization') ?? '')
  if (!perfil) return json({ ok: false }, 401, cors)
  const lido = entrada.safeParse(await req.json().catch(() => null))
  if (!lido.success) return json({ ok: false, erro: 'dados' }, 400, cors)
  try {
    const { pedido, fim } = await pedidoDe(perfil)
    if (!pedido) return json({ ok: true, pedido: null }, 200, cors)
    if (lido.data.acao === 'consultar') {
      const { mp_pagamento_id: _c, mp_assinatura_id: _a, ...visivel } = pedido
      return json({ ok: true, pedido: { ...visivel, fim_acesso: fim } }, 200, cors)
    }
    if (pedido.status !== 'aprovado') return json({ ok: false, erro: 'encerrado' }, 409, cors)
    return json(await cancelar(pedido, fim, lido.data.motivo || null), 200, cors)
  } catch (e) {
    console.error('cancelar-inscricao', e instanceof Error ? e.message : e)
    return json({ ok: false, erro: 'falha' }, 500, cors)
  }
})
