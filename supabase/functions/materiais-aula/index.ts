import { createClient } from '@supabase/supabase-js'
import { cabecalhosCors, origemPermitida } from '../_shared/cors.ts'

// Materiais da aula para a aluna: lê a lista com o token dela (a regra de acesso só devolve material
// de aula liberada) e só então gera links assinados de 10 minutos com a chave de serviço.
// aula_id "comece" devolve os arquivos do Comece por aqui; "tema:<id>" os do tema (só se o tema já abriu para ela);
// "apoio:<id>" os anexos de um material da nutricionista ou da Dra. Clara (só se publicado e o tema aberto).
const URL_SUPABASE = Deno.env.get('SUPABASE_URL') ?? ''
const servico = createClient(URL_SUPABASE, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
  auth: { persistSession: false, autoRefreshToken: false },
})
const VALIDADE = 600
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type Material = { id: string; tipo: string; caminho: string; nome: string; tamanho: number | null }
type Saida = {
  id: string
  tipo: string
  nome: string
  tamanho: number | null
  url: string | null
  baixar: string | null
}

function responder(corpo: unknown, status: number, origem: string): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...cabecalhosCors(origem), 'Content-Type': 'application/json' },
  })
}

async function assinar(m: Material): Promise<Saida> {
  if (m.tipo === 'link') return { ...m, url: m.caminho, baixar: null }
  const ext = m.caminho.split('.').pop() ?? ''
  const [ver, baixar] = await Promise.all([
    servico.storage.from('materiais').createSignedUrl(m.caminho, VALIDADE),
    servico.storage
      .from('materiais')
      .createSignedUrl(m.caminho, VALIDADE, { download: `${m.nome}.${ext}` }),
  ])
  return {
    id: m.id,
    tipo: m.tipo,
    nome: m.nome,
    tamanho: m.tamanho,
    url: ver.data?.signedUrl ?? null,
    baixar: baixar.data?.signedUrl ?? null,
  }
}

Deno.serve(async (req) => {
  const origem = req.headers.get('origin') ?? ''
  if (!origemPermitida(origem)) return new Response(null, { status: 403 })
  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: cabecalhosCors(origem) })
  if (req.method !== 'POST') return responder({ ok: false }, 405, origem)
  const autorizacao = req.headers.get('authorization') ?? ''
  if (!autorizacao) return responder({ ok: false }, 401, origem)
  let aula = ''
  try {
    aula = String(
      (JSON.parse((await req.text()).slice(0, 500)) as { aula_id?: unknown }).aula_id ?? '',
    )
  } catch {
    aula = ''
  }
  const comece = aula === 'comece'
  const [prefixo, resto] = aula.includes(':') ? aula.split(':', 2) : ['', aula]
  const id = resto ?? ''
  if (!comece && !['', 'tema', 'apoio'].includes(prefixo ?? ''))
    return responder({ ok: false, erro: 'invalido' }, 400, origem)
  if (!comece && !UUID.test(id)) return responder({ ok: false, erro: 'invalido' }, 400, origem)
  const daAluna = createClient(URL_SUPABASE, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: { headers: { Authorization: autorizacao } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const campos = 'id, tipo, caminho, nome, tamanho'
  const { data, error } = comece
    ? await daAluna.from('comece_materiais').select(campos).order('ordem')
    : prefixo === 'tema'
      ? await daAluna.from('tema_materiais').select(campos).eq('tema_id', id).order('ordem')
      : prefixo === 'apoio'
        ? await daAluna
            .from('material_arquivos')
            .select(campos)
            .eq('material_id', id)
            .order('ordem')
        : await daAluna.from('aula_materiais').select(campos).eq('aula_id', id).order('ordem')
  if (error) return responder({ ok: false, erro: 'falha' }, 500, origem)
  const materiais = await Promise.all((data ?? []).map((m) => assinar(m as Material)))
  return responder({ ok: true, materiais }, 200, origem)
})
