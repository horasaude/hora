import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ALUNA = ID(2)
const OUTRA = ID(3)
const SEM_ACESSO = ID(4)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'a@t.com'),($2,'o@t.com'),($3,'s@t.com')`,
    [ALUNA, OUTRA, SEM_ACESSO],
  )
  await db.exec(
    `update public.perfis set acesso_inicio_em = now() - interval '3 days' where id in ('${ALUNA}', '${OUTRA}')`,
  )
}

async function testes(t) {
  const { esperaValor, esperaErro } = t
  const inscrever = (n) =>
    `insert into public.push_inscricoes (endpoint, p256dh, auth) values ('https://push.t/${n}', 'k', 'a') returning 1`
  await t.comoAluna(ALUNA)
  await esperaValor('aluna ativa o lembrete no celular dela', inscrever('a'), 1)
  await t.db.query(`select public.registrar_agua(500)`)
  await t.comoAluna(OUTRA)
  await esperaValor('outra aluna também', inscrever('o'), 1)
  await t.db.query(`select public.registrar_agua(2000)`)
  await esperaValor(
    'outra aluna não vê a inscrição da primeira',
    `select count(*)::int from public.push_inscricoes`,
    1,
  )
  await esperaErro(
    'aluna não chama a lista de lembretes',
    `select * from public.lembretes_de_agua()`,
    '42501',
  )
  await t.comoAluna(SEM_ACESSO)
  await t.db.query(inscrever('s'))
  await t.comoServico()
  await esperaValor(
    'lembra só quem tem acesso e ainda não bateu a meta, com o quanto já bebeu',
    `select endpoint || ':' || total || '/' || meta from public.lembretes_de_agua()`,
    'https://push.t/a:500/2000',
  )
}

async function live(t) {
  const { esperaValor } = t
  await t.comoDono()
  await t.db.exec(`
    insert into public.lives (tema, data, publicado) values
      ('Sono e fome', now() + interval '1 hour', true),
      ('Rascunho', now() + interval '1 hour', false),
      ('Amanhã', now() + interval '1 day', true);
  `)
  await t.comoServico()
  await esperaValor(
    'lembra da live publicada que começa em 1 hora, só para quem tem acesso',
    `select string_agg(distinct tema, ',') || ':' || count(*) from public.lembretes_de_live()`,
    'Sono e fome:2',
  )
  await t.comoDono()
  await t.db.query(`update public.lives set lembrete_push_em = now() where tema = 'Sono e fome'`)
  await t.comoServico()
  await esperaValor(
    'não lembra duas vezes',
    `select count(*)::int from public.lembretes_de_live()`,
    0,
  )
}

export async function testarLembreteAgua() {
  const t = await criarBanco()
  await montar(t.db)
  await testes(t)
  await live(t)
  return t.fim('lembrete de água')
}
