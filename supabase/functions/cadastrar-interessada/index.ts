import { createClient } from '@supabase/supabase-js'
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'
import { prepararCadastro } from './validar.ts'

const LIMITE_BYTES = 10_000

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
)

function responder(ok: boolean, status: number, origem: string): Response {
  return new Response(JSON.stringify({ ok }), {
    status,
    headers: { ...cabecalhosCors(origem), 'Content-Type': 'application/json' },
  })
}

async function lerCorpo(req: Request): Promise<unknown> {
  const texto = await req.text()
  if (texto.length > LIMITE_BYTES) throw new Error('corpo grande demais')
  return JSON.parse(texto)
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: cabecalhosCors(origem) })
  if (req.method !== 'POST') return responder(false, 405, origem)

  let corpo: unknown
  try {
    corpo = await lerCorpo(req)
  } catch {
    return responder(false, 400, origem)
  }

  const r = prepararCadastro(corpo, new Date())
  if (r.tipo === 'robo') return responder(true, 200, origem)
  if (r.tipo === 'invalido') return responder(false, 400, origem)

  const { error } = await supabase.from('interessadas').insert(r.linha)
  if (error) {
    console.error('cadastrar-interessada: falha ao gravar', error.code)
    return responder(false, 500, origem)
  }
  return responder(true, 200, origem)
})
