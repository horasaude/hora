import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const OUTRA = ID(3)
const SEM_ACESSO = ID(4)
const ANAMNESE = `(select id from public.anamneses where titulo = 'Anamnese inicial')`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'o@t.com'),($4,'s@t.com')`,
    [ADMIN, ALUNA, OUTRA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '10 days' where id in ('${ALUNA}', '${OUTRA}');
  `)
}

async function painel(t) {
  const { esperaValor, esperaErro } = t
  await t.comoDono()
  await t.db.query(`update public.anamneses set publicada = false`)
  await t.comoAluna(ALUNA)
  await esperaValor(
    'rascunho não aparece para a aluna',
    `select count(*)::int from public.anamneses`,
    0,
  )
  await t.comoAluna(ADMIN)
  await esperaValor(
    'anamnese inicial com 9 perguntas e as 7 do PAR-Q antes da última',
    `select jsonb_array_length(perguntas) || ':' || (perguntas -> 8 ->> 'id') || ':' || (perguntas -> 15 ->> 'id') from public.anamneses`,
    '16:parq_coracao:observacoes',
  )
  await esperaErro(
    'pergunta de escolha sem opções é recusada',
    `insert into public.anamneses (titulo, perguntas) values ('X', '[{"id":"a","texto":"Qual?","tipo":"escolha","opcoes":["so uma"]}]')`,
    '23514',
  )
  await esperaErro(
    'tipo de pergunta desconhecido é recusado',
    `insert into public.anamneses (titulo, perguntas) values ('X', '[{"id":"a","texto":"Qual?","tipo":"nota"}]')`,
    '23514',
  )
  await t.db.query(`update public.anamneses set publicada = true`)
}

async function respostas(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor('aluna vê a publicada', `select count(*)::int from public.anamneses`, 1)
  await esperaValor(
    'aluna começa a responder',
    `insert into public.anamnese_respostas (anamnese_id, respostas) values (${ANAMNESE}, '{"treina":"sim"}') returning 1`,
    1,
  )
  await esperaValor(
    'aluna continua de onde parou',
    `with u as (update public.anamnese_respostas set respostas = respostas || '{"dor":"joelho"}' returning 1) select count(*)::int from u`,
    1,
  )
  await t.db.query(`update public.anamnese_respostas set enviada_em = now()`)
  await esperaValor(
    'depois de enviar, não edita mais',
    `with u as (update public.anamnese_respostas set respostas = '{}' returning 1) select count(*)::int from u`,
    0,
  )
  await esperaErro(
    'não responde em nome de outra',
    `insert into public.anamnese_respostas (anamnese_id, perfil_id) values (${ANAMNESE}, '${OUTRA}')`,
    '42501',
  )
  await t.comoAluna(OUTRA)
  await esperaValor(
    'outra aluna não vê as respostas dela',
    `select count(*)::int from public.anamnese_respostas`,
    0,
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaValor('sem acesso, não vê anamnese', `select count(*)::int from public.anamneses`, 0)
  await esperaErro(
    'sem acesso, não responde',
    `insert into public.anamnese_respostas (anamnese_id) values (${ANAMNESE})`,
    '42501',
  )
  await t.comoAnon()
  await esperaErro('anônimo não lê respostas', `select * from public.anamnese_respostas`, '42501')
  await t.comoAluna(ADMIN)
  await esperaValor(
    'admin lê a resposta enviada',
    `select respostas ->> 'dor' from public.anamnese_respostas`,
    'joelho',
  )
  await esperaValor(
    'admin pede para responder de novo',
    `with d as (delete from public.anamnese_respostas returning 1) select count(*)::int from d`,
    1,
  )
}

export async function testarAnamnese() {
  const t = await criarBanco()
  await montar(t.db)
  await painel(t)
  await respostas(t)
  return t.fim('anamnese')
}
