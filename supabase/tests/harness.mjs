// Postgres de verdade, em memória, para os testes de banco (sem Docker).
// As migrações são lidas da pasta, em ordem: migração nova entra no teste sozinha.
import { PGlite } from '@electric-sql/pglite'
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const MIGRACOES = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations')

/** O que o Supabase dá pronto e o PGlite não tem: auth, papéis e grants padrão. */
const SHIM = `
create schema if not exists auth;
create schema if not exists extensions;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  raw_user_meta_data jsonb default '{}'::jsonb,
  raw_app_meta_data jsonb default '{}'::jsonb
);
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role bypassrls; end if;
end $$;
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
create or replace function auth.uid() returns uuid
  language sql stable
  as $$ select nullif(current_setting('app.usuario', true), '')::uuid $$;
create or replace function auth.role() returns text
  language sql stable
  as $$ select nullif(current_setting('app.papel', true), '') $$;
`

export async function criarBanco() {
  const db = await PGlite.create({ extensions: { pgcrypto } })
  let falhas = 0
  let passou = 0

  const ok = (m) => {
    passou++
    console.log('  ok    ' + m)
  }
  const falha = (m, e) => {
    falhas++
    console.log('  FALHA ' + m + '\n        ' + String(e).split('\n')[0])
  }

  await db.exec(SHIM)
  for (const arquivo of readdirSync(MIGRACOES).sort()) {
    if (!arquivo.endsWith('.sql')) continue
    try {
      await db.exec(readFileSync(join(MIGRACOES, arquivo), 'utf8'))
      ok('migração ' + arquivo)
    } catch (e) {
      falha('migração ' + arquivo, e)
      throw e
    }
  }

  async function esperaValor(nome, sql, esperado) {
    try {
      const r = await db.query(sql)
      const veio = r.rows.length ? Object.values(r.rows[0])[0] : null
      if (veio === esperado) ok(nome)
      else falha(nome, `esperava ${esperado}, veio ${veio}`)
    } catch (e) {
      falha(nome, e)
    }
  }

  /** Espera erro; se codigo vier, confere o SQLSTATE (ex.: 42501, permissão negada). */
  async function esperaErro(nome, sql, codigo) {
    try {
      await db.query(sql)
      falha(nome, 'não deu erro, mas deveria')
    } catch (e) {
      if (!codigo || e.code === codigo) ok(nome)
      else falha(nome, `esperava erro ${codigo}, veio ${e.code}: ${e.message}`)
    }
  }

  async function como(papel, usuario = '') {
    await db.exec('reset role')
    await db.query('select set_config($1, $2, false)', ['app.usuario', usuario])
    await db.query('select set_config($1, $2, false)', ['app.papel', papel === 'dono' ? '' : papel])
    if (papel !== 'dono') await db.exec(`set role ${papel}`)
  }

  const comoAluna = (id) => como('authenticated', id)
  const comoAnon = () => como('anon')
  const comoServico = () => como('service_role')
  const comoDono = () => como('dono')

  function fim(titulo) {
    console.log(
      falhas
        ? `\n${titulo}: ${falhas} falha(s) em ${passou + falhas} checagens`
        : `\n${titulo}: ${passou} checagens, todas passaram`
    )
    return falhas
  }

  return { db, ok, falha, esperaValor, esperaErro, comoAluna, comoAnon, comoServico, comoDono, fim }
}
