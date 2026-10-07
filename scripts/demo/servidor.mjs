// Demonstração local (nunca produção): banco em memória (PGlite) com as migrações e o seed de
// demonstração, e uma API mínima no formato do Supabase. Cada consulta roda como a aluna logada,
// com as regras de acesso (RLS) de verdade. Serve também o build gerado em .demo/dist.
// Uso: npm run demo:build && node scripts/demo/servidor.mjs   (app em http://127.0.0.1:4321)
import http from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { criarBanco } from '../../supabase/tests/harness.mjs'
import { executarRest, executarRpc, lerChaves } from './postgrest.mjs'
import { criarSite } from './site.mjs'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = join(AQUI, '..', '..')
const DIST = join(RAIZ, '.demo', 'dist')
export const PORTA_API = 54399
export const PORTA_APP = 4321

export const ALUNAS = {
  3: { id: 'aaaaaaaa-0000-0000-0000-000000000003', email: 'bia.demo@exemplo.com' },
  40: { id: 'aaaaaaaa-0000-0000-0000-000000000040', email: 'mari.demo@exemplo.com' },
  admin: { id: 'aaaaaaaa-0000-0000-0000-000000000099', email: 'equipe.demo@exemplo.com' },
}

async function montarBanco() {
  const log = console.log
  console.log = () => {}
  const t = await criarBanco()
  console.log = log
  await t.db.exec(readFileSync(join(AQUI, 'seed.sql'), 'utf8'))
  return t.db
}

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET,POST,PATCH,DELETE,HEAD,OPTIONS',
  'access-control-expose-headers': 'content-range',
}

function responder(res, status, corpo, extra = {}) {
  res.writeHead(status, { 'content-type': 'application/json', ...cors, ...extra })
  res.end(corpo === undefined ? '' : JSON.stringify(corpo))
}

const lerCorpo = (req) =>
  new Promise((ok) => {
    let b = ''
    req.on('data', (c) => (b += c))
    req.on('end', () => ok(b ? JSON.parse(b) : null))
  })

/** Uma consulta por vez no banco (a sessão guarda a usuária e o papel). */
let fila = Promise.resolve()
const naFila = (fn) => (fila = fila.then(fn, fn))

function usuariaDo(req) {
  const token = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '')
  return token.startsWith('demo:') ? token.slice(5) : null
}

async function comoUsuaria(db, uid) {
  await db.exec('reset role')
  await db.query('select set_config($1, $2, false)', ['app.usuario', uid ?? ''])
  await db.query('select set_config($1, $2, false)', ['app.papel', uid ? 'authenticated' : 'anon'])
  await db.exec(`set role ${uid ? 'authenticated' : 'anon'}`)
}

/** Imita a Edge Function materiais-aula: lê como a aluna (só aula liberada); arquivos não existem na demonstração. */
async function materiaisDaAula(db, req, res) {
  const { aula_id } = (await lerCorpo(req)) ?? {}
  const linhas = await naFila(async () => {
    await comoUsuaria(db, usuariaDo(req))
    const sql =
      'select id, tipo, caminho, nome, tamanho from public.aula_materiais where aula_id = $1 order by ordem'
    return (await db.query(sql, [aula_id])).rows
  })
  const materiais = linhas.map((m) => ({
    ...m,
    url: m.tipo === 'link' ? m.caminho : null,
    baixar: null,
  }))
  responder(res, 200, { ok: true, materiais })
}

function apiDemo(db, chaves) {
  return async (req, res) => {
    const url = new URL(req.url, 'http://x')
    if (req.method === 'OPTIONS') return responder(res, 204)
    if (url.pathname === '/auth/v1/user') {
      const uid = usuariaDo(req)
      const aluna = Object.values(ALUNAS).find((a) => a.id === uid)
      return aluna
        ? responder(res, 200, {
            id: aluna.id,
            aud: 'authenticated',
            role: 'authenticated',
            email: aluna.email,
          })
        : responder(res, 401, {})
    }
    if (url.pathname.startsWith('/auth/v1/')) return responder(res, 200, {})
    if (url.pathname.startsWith('/storage/v1/object/sign/')) {
      const corpo = (await lerCorpo(req)) ?? {}
      return responder(
        res,
        200,
        (corpo.paths ?? []).map((p) => ({
          path: p,
          signedURL: null,
          error: 'sem arquivo na demonstração',
        })),
      )
    }
    if (url.pathname === '/functions/v1/materiais-aula') return materiaisDaAula(db, req, res)
    if (!url.pathname.startsWith('/rest/v1/')) return responder(res, 404, {})
    const corpo = req.method === 'POST' || req.method === 'PATCH' ? await lerCorpo(req) : null
    const r = await naFila(async () => {
      await comoUsuaria(db, usuariaDo(req))
      const nome = url.pathname.replace('/rest/v1/', '')
      return nome.startsWith('rpc/')
        ? executarRpc(db, chaves, nome.slice(4), corpo ?? {})
        : executarRest(db, chaves, {
            metodo: req.method,
            tabela: nome,
            busca: url.searchParams,
            corpo,
            cabecalhos: req.headers,
          })
    })
    responder(res, r.status, r.corpo, r.cabecalhos)
  }
}

/** Sobe banco, API e app; devolve o banco (só leitura nos prints) e como desligar. */
export async function iniciarDemo() {
  if (!existsSync(join(DIST, 'index.html'))) throw new Error('Rode antes: npm run demo:build')
  const db = await montarBanco()
  const chaves = await lerChaves(db)
  const api = http.createServer(apiDemo(db, chaves)).listen(PORTA_API, '127.0.0.1')
  const site = http.createServer(criarSite(DIST, ALUNAS)).listen(PORTA_APP, '127.0.0.1')
  const fechar = () => {
    api.close()
    site.close()
  }
  return { db, fechar }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await iniciarDemo()
  console.log(`Demonstração local: http://127.0.0.1:${PORTA_APP}/__entrar?aluna=40 (ou aluna=3)`)
}
