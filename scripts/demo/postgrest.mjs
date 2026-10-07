// Tradução mínima das chamadas do supabase-js (formato PostgREST) para SQL, só para a demonstração local.
// Cobre o que a área da aluna usa: select com relações, filtros, ordem, faixa, contagem, insert, update, delete e rpc.

import { filtros, lerSelect, objeto, ordem, q } from './consulta.mjs'

/** Chaves estrangeiras e funções do schema public. */
export async function lerChaves(db) {
  const fks = await db.query(`
    select c.conrelid::regclass::text as filha, a.attname as coluna, c.confrelid::regclass::text as mae
    from pg_constraint c join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
    where c.contype = 'f' and c.connamespace = 'public'::regnamespace`)
  const fns = await db.query(`
    select p.proname as nome, coalesce(p.proargnames, '{}') as args,
      coalesce((select array_agg(format_type(t, null) order by i) from unnest(p.proargtypes) with ordinality as x(t, i)), '{}') as tipos,
      p.proretset as conjunto, format_type(p.prorettype, null) as retorno
    from pg_proc p where p.pronamespace = 'public'::regnamespace`)
  return { fks: fks.rows, fns: fns.rows }
}

function erro(e) {
  const status =
    e.code === '42501' ? 403 : e.code === '23505' ? 409 : e.code === 'P0002' ? 404 : 400
  return {
    status,
    corpo: { code: e.code ?? 'PGRST', message: e.message, details: null, hint: null },
  }
}

async function selecionar(db, ch, { tabela, busca, cabecalhos, metodo }) {
  const params = []
  const onde = filtros(busca, 't0', params)
  const faixa = cabecalhos.range?.match(/^(\d+)-(\d+)$/)
  const limite = faixa ? Number(faixa[2]) - Number(faixa[1]) + 1 : busca.get('limit')
  const pulo = faixa ? Number(faixa[1]) : busca.get('offset')
  const pedaco = `${limite ? `limit ${Number(limite)}` : ''} ${pulo ? `offset ${Number(pulo)}` : ''}`
  const obj = objeto(ch, tabela, 't0', lerSelect(busca.get('select') ?? '*'))
  const linhas = (
    await db.query(
      `select coalesce(jsonb_agg(x.o), '[]') as r from (select ${obj} as o from public.${q(tabela)} t0 ${onde} ${ordem(busca.get('order'), 't0')} ${pedaco}) x`,
      params,
    )
  ).rows[0].r
  const contar = /count=exact/.test(cabecalhos.prefer ?? '')
  const total = contar
    ? (await db.query(`select count(*)::int as n from public.${q(tabela)} t0 ${onde}`, params))
        .rows[0].n
    : linhas.length
  const inicio = Number(pulo ?? 0)
  const cab = { 'content-range': `${inicio}-${inicio + Math.max(linhas.length - 1, 0)}/${total}` }
  if (metodo === 'HEAD') return { status: 200, cabecalhos: cab }
  const objeto1 = (cabecalhos.accept ?? '').includes('vnd.pgrst.object')
  return { status: 200, corpo: objeto1 ? (linhas[0] ?? null) : linhas, cabecalhos: cab }
}

async function escrever(db, { metodo, tabela, busca, corpo, cabecalhos }) {
  const params = []
  const volta = /return=representation/.test(cabecalhos.prefer ?? '')
    ? `returning to_jsonb(public.${q(tabela)}.*) as o`
    : ''
  let sql
  if (metodo === 'POST') {
    const linhas = Array.isArray(corpo) ? corpo : [corpo]
    const cols = Object.keys(linhas[0] ?? {})
    const valores = linhas.map(
      (l) => `(${cols.map((c) => (params.push(l[c] ?? null), `$${params.length}`)).join(', ')})`,
    )
    sql = `insert into public.${q(tabela)} (${cols.map(q).join(', ')}) values ${valores.join(', ')} ${volta}`
  } else if (metodo === 'PATCH') {
    const sets = Object.entries(corpo ?? {}).map(
      ([c, v]) => (params.push(v), `${q(c)} = $${params.length}`),
    )
    sql = `update public.${q(tabela)} t0 set ${sets.join(', ')} ${filtros(busca, 't0', params)} ${volta.replace(`public.${q(tabela)}`, 't0')}`
  } else sql = `delete from public.${q(tabela)} t0 ${filtros(busca, 't0', params)}`
  const r = await db.query(sql, params)
  return { status: volta ? 201 : 204, corpo: volta ? r.rows.map((x) => x.o) : undefined }
}

export async function executarRest(db, ch, pedido) {
  try {
    return pedido.metodo === 'GET' || pedido.metodo === 'HEAD'
      ? await selecionar(db, ch, pedido)
      : await escrever(db, pedido)
  } catch (e) {
    return erro(e)
  }
}

export async function executarRpc(db, ch, nome, args) {
  const fn = ch.fns.find(
    (f) => f.nome === nome && Object.keys(args).every((k) => f.args.includes(k)),
  )
  if (!fn) return { status: 404, corpo: { message: `função ${nome} não encontrada` } }
  const params = []
  const lista = Object.entries(args).map(([k, v]) => {
    params.push(v === null || typeof v !== 'object' ? v : JSON.stringify(v))
    const tipo = fn.tipos[fn.args.indexOf(k)]
    return `${q(k)} => $${params.length}::${tipo}`
  })
  const chamada = `public.${q(nome)}(${lista.join(', ')})`
  try {
    if (fn.conjunto) {
      const r = await db.query(
        `select coalesce(jsonb_agg(to_jsonb(f)), '[]') as r from ${chamada} f`,
        params,
      )
      return { status: 200, corpo: r.rows[0].r }
    }
    if (fn.retorno === 'void') {
      await db.query(`select ${chamada}`, params)
      return { status: 200, corpo: null }
    }
    const r = await db.query(`select to_jsonb(${chamada}) as r`, params)
    return { status: 200, corpo: r.rows[0].r }
  } catch (e) {
    return erro(e)
  }
}
