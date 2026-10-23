import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const SEM_ACESSO = ID(3)
const contar = `select count(*)::int from public.materiais_nutricao`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'s@t.com')`,
    [ADMIN, ALUNA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '2 days' where id = '${ALUNA}';
  `)
}

async function regras(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ADMIN)
  await esperaValor('os 5 materiais do Dietbox vieram', contar, 5)
  await esperaValor(
    'na ordem do Dietbox',
    `select string_agg(titulo, ',' order by ordem) from public.materiais_nutricao`,
    'Chás diuréticos,Lista de frutas,Manejo de ansiedade (óleos essenciais),Molhos para salada,Monte sua salada',
  )
  await t.db.query(`insert into public.materiais_nutricao (titulo, texto) values ('Rascunho', 'x')`)
  await esperaValor('equipe vê também o rascunho', contar, 6)
  await esperaErro(
    'título vazio é recusado',
    `insert into public.materiais_nutricao (titulo) values ('  ')`,
    '23514',
  )
  await t.comoAluna(ALUNA)
  await esperaValor('aluna vê só os publicados', contar, 5)
  await esperaValor(
    'aluna não altera',
    `with x as (update public.materiais_nutricao set titulo = 'x' returning 1) select count(*)::int from x`,
    0,
  )
  await esperaErro(
    'aluna não cria',
    `insert into public.materiais_nutricao (titulo, publicado) values ('x', true)`,
    '42501',
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaValor('sem acesso não vê nada', contar, 0)
  await t.comoAnon()
  await esperaErro('anônimo não lê', contar, '42501')
  await t.comoAluna(ADMIN)
  await esperaValor(
    'equipe exclui',
    `with x as (delete from public.materiais_nutricao where titulo = 'Rascunho' returning 1) select count(*)::int from x`,
    1,
  )
  await esperaValor(
    'material novo é da nutricionista por padrão',
    `with x as (insert into public.materiais_nutricao (titulo) values ('Padrão') returning area) select area from x`,
    'nutricao',
  )
  await esperaValor(
    'equipe cria material de saúde',
    `with x as (insert into public.materiais_nutricao (titulo, area) values ('Hidratação', 'saude') returning area) select area from x`,
    'saude',
  )
  await esperaErro(
    'área desconhecida não entra',
    `insert into public.materiais_nutricao (titulo, area) values ('x', 'outra')`,
    '23514',
  )
  await esperaValor(
    'anamnese nova é de treino por padrão',
    `with x as (insert into public.anamneses (titulo) values ('PAR-Q 2') returning area) select area from x`,
    'treino',
  )
}

export async function testarMateriaisNutricao() {
  const t = await criarBanco()
  await montar(t.db)
  await regras(t)
  return t.fim('materiais do plano alimentar')
}
