// Montagem do SQL a partir do formato PostgREST (select com relações, filtros e ordem), para a demonstração local.

const nomeOk = (n) => /^[a-z_][a-z0-9_]*$/.test(n)
export const q = (n) => {
  if (!nomeOk(n)) throw new Error(`nome inválido: ${n}`)
  return `"${n}"`
}

/** "a,b,rel(c,d,sub(e))" vira árvore de colunas e relações. */
export function lerSelect(texto) {
  const itens = []
  let nivel = 0
  let atual = ''
  for (const c of texto) {
    if (c === ',' && nivel === 0) {
      itens.push(atual)
      atual = ''
      continue
    }
    if (c === '(') nivel++
    if (c === ')') nivel--
    atual += c
  }
  if (atual) itens.push(atual)
  return itens.map((i) => {
    const m = i.trim().match(/^([a-z_0-9*]+)(?:\((.*)\))?$/)
    if (!m) throw new Error(`select não suportado: ${i}`)
    return m[2] !== undefined ? { rel: m[1], filhos: lerSelect(m[2]) } : { col: m[1] }
  })
}

/** Objeto jsonb de uma linha (alias a) com as colunas e relações pedidas. */
export function objeto(ch, tabela, a, nos, prof = 0) {
  const cols = nos.filter((n) => n.col)
  const base = cols.some((n) => n.col === '*')
    ? `to_jsonb(${a})`
    : `jsonb_build_object(${cols.map((n) => `'${n.col}', ${a}.${q(n.col)}`).join(', ') || ''})`
  const rels = nos
    .filter((n) => n.rel)
    .map((n) => {
      const b = `r${prof}_${n.rel}`
      const filha = ch.fks.find((f) => f.filha === n.rel && f.mae === tabela)
      if (filha)
        return `'${n.rel}', (select coalesce(jsonb_agg(${objeto(ch, n.rel, b, n.filhos, prof + 1)}), '[]') from public.${q(n.rel)} ${b} where ${b}.${q(filha.coluna)} = ${a}.id)`
      const mae = ch.fks.find((f) => f.filha === tabela && f.mae === n.rel)
      if (!mae) throw new Error(`relação desconhecida: ${tabela} -> ${n.rel}`)
      return `'${n.rel}', (select ${objeto(ch, n.rel, b, n.filhos, prof + 1)} from public.${q(n.rel)} ${b} where ${b}.id = ${a}.${q(mae.coluna)})`
    })
  return rels.length ? `(${base} || jsonb_build_object(${rels.join(', ')}))` : base
}

const RESERVADOS = new Set(['select', 'order', 'limit', 'offset', 'columns', 'on_conflict'])
const OPS = {
  eq: '=',
  neq: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  like: 'like',
  ilike: 'ilike',
  cs: '@>',
}

/** Filtros da URL (col=op.valor) em SQL com parâmetros. */
export function filtros(busca, a, params) {
  const partes = []
  for (const [col, bruto] of busca) {
    if (RESERVADOS.has(col)) continue
    const [, nao, op, valor] = bruto.match(/^(not\.)?([a-z]+)\.(.*)$/s) ?? []
    const campo = `${a}.${q(col)}`
    let sql
    if (op === 'is')
      sql = `${campo} is ${valor === 'null' ? 'null' : valor === 'true' ? 'true' : 'false'}`
    else if (op === 'in') {
      const lista = valor
        .replace(/^\(|\)$/g, '')
        .split(',')
        .map((v) => v.replace(/^"|"$/g, ''))
      sql = `${campo} in (${lista.map((v) => (params.push(v), `$${params.length}`)).join(', ')})`
    } else if (OPS[op]) {
      params.push(op.endsWith('like') ? valor.replace(/\*/g, '%') : valor)
      sql = `${campo} ${OPS[op]} $${params.length}`
    } else throw new Error(`filtro não suportado: ${col}=${bruto}`)
    partes.push(nao ? `not (${sql})` : sql)
  }
  return partes.length ? `where ${partes.join(' and ')}` : ''
}

export function ordem(texto, a) {
  if (!texto) return ''
  return `order by ${texto
    .split(',')
    .map((p) => {
      const [col, ...mods] = p.split('.')
      return `${a}.${q(col)} ${mods.includes('desc') ? 'desc' : 'asc'}${mods.includes('nullslast') ? ' nulls last' : mods.includes('nullsfirst') ? ' nulls first' : ''}`
    })
    .join(', ')}`
}
