import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const SEM_ACESSO = ID(3)
const LIVE = ID(61)
const pendentes = `select string_agg(email || ':' || metodo || ':' || seq, ',' order by email) from public.convites_pendentes(50)`
const marcar = `insert into public.lives_convites (live_id, email, nome, seq, metodo)
  select live, email, nome, seq, metodo from public.convites_pendentes(50)
  on conflict (live_id, email) do update set seq = excluded.seq, metodo = excluded.metodo`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'Equipe@t.com'),($2,'aluna@t.com'),($3,'saiu@t.com')`,
    [ADMIN, ALUNA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '3 days' where id = '${ALUNA}';
    insert into public.lives (id, tema, data, publicado, profissionais) values
      ('${LIVE}', 'Sono e fome', now() + interval '2 days', false, '{ana,lais}');
    insert into public.lives_salas (live_id, link_url) values ('${LIVE}', 'https://meet.t/abc');
  `)
}

async function sigilo(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ADMIN)
  await esperaValor(
    'equipe salva as convidadas',
    `select count(*)::int from public.salvar_convidadas('${LIVE}', '[{"nome":"Dra. Bia","email":" Bia@T.com "}]'::jsonb)`,
    1,
  )
  await esperaValor(
    'e-mail da convidada fica limpo',
    `select email from public.lives_convidadas`,
    'bia@t.com',
  )
  await esperaValor(
    'equipe vê o link da sala',
    `select link_url from public.lives_salas`,
    'https://meet.t/abc',
  )
  await t.db.query(`update public.lives set publicado = true where id = '${LIVE}'`)
  await t.comoAluna(ALUNA)
  await esperaValor('aluna vê a live publicada', `select count(*)::int from public.lives`, 1)
  await esperaValor(
    'aluna não vê o link da sala',
    `select count(*)::int from public.lives_salas`,
    0,
  )
  await esperaValor(
    'aluna não vê as convidadas',
    `select count(*)::int from public.lives_convidadas`,
    0,
  )
  await esperaErro(
    'aluna não lê a fila de convites',
    `select * from public.lives_convites`,
    '42501',
  )
  await esperaErro(
    'aluna não muda convidadas',
    `select public.salvar_convidadas('${LIVE}', '[]'::jsonb)`,
    '42501',
  )
  await esperaErro(
    'aluna não vê os destinos',
    `select * from public.destinos_da_live('${LIVE}')`,
    '42501',
  )
}

async function convites(t) {
  const { esperaValor } = t
  await t.comoServico()
  await esperaValor(
    'publicar convida equipe, convidada e aluna ativa (não quem saiu)',
    pendentes,
    'aluna@t.com:REQUEST:1,bia@t.com:REQUEST:1,equipe@t.com:REQUEST:1',
  )
  await t.db.query(marcar)
  await esperaValor('enviado não repete', pendentes, null)
  await t.db.query(`update public.lives set profissionais = '{ana}' where id = '${LIVE}'`)
  await esperaValor('mudar só a profissional não reenvia', pendentes, null)
  await t.db.query(`update public.lives set data = data + interval '1 hour' where id = '${LIVE}'`)
  await esperaValor(
    'mudar o horário manda a atualização',
    pendentes,
    'aluna@t.com:REQUEST:2,bia@t.com:REQUEST:2,equipe@t.com:REQUEST:2',
  )
  await t.db.query(marcar)
  await t.db.query(`delete from public.lives_convidadas`)
  await esperaValor('convidada tirada recebe o cancelamento', pendentes, 'bia@t.com:CANCEL:2')
  await t.db.query(marcar)
  await t.db.query(`update public.lives set publicado = false where id = '${LIVE}'`)
  await esperaValor(
    'tirar do ar cancela para todas',
    pendentes,
    'aluna@t.com:CANCEL:3,equipe@t.com:CANCEL:3',
  )
  await t.db.query(marcar)
  await esperaValor('cancelado não repete', pendentes, null)
}

export async function testarLivesSala() {
  const t = await criarBanco()
  await montar(t.db)
  await sigilo(t)
  await convites(t)
  return t.fim('sala e convites das lives')
}
