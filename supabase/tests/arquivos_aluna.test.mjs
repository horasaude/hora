import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const OUTRA = ID(3)
const VENCIDA = ID(4)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'o@t.com'),($4,'v@t.com')`,
    [ADMIN, ALUNA, OUTRA, VENCIDA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '10 days' where id in ('${ALUNA}', '${OUTRA}');
    insert into storage.objects (bucket_id, name) values
      ('arquivos_aluna', '${ALUNA}/plano.pdf'), ('arquivos_aluna', '${OUTRA}/dieta.pdf'), ('arquivos_aluna', '${VENCIDA}/x.pdf');
  `)
}

async function testes(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ADMIN)
  await t.db
    .query(`insert into public.arquivos_aluna (perfil_id, nome, caminho, tipo, tamanho) values
    ('${ALUNA}', 'Plano de treino', '${ALUNA}/plano.pdf', 'pdf', 1000),
    ('${OUTRA}', 'Dieta', '${OUTRA}/dieta.pdf', 'pdf', 1000),
    ('${VENCIDA}', 'Antigo', '${VENCIDA}/x.pdf', 'pdf', 1000)`)
  await esperaValor('admin vê os 3 arquivos', `select count(*)::int from public.arquivos_aluna`, 3)
  await esperaErro(
    'arquivo precisa ficar na pasta da aluna',
    `insert into public.arquivos_aluna (perfil_id, nome, caminho, tipo) values ('${ALUNA}', 'x', '${OUTRA}/y.pdf', 'pdf')`,
    '23514',
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna vê só o dela',
    `select string_agg(nome, ',') from public.arquivos_aluna`,
    'Plano de treino',
  )
  await esperaValor(
    'aluna lê no espaço só a pasta dela',
    `select string_agg(name, ',') from storage.objects where bucket_id = 'arquivos_aluna'`,
    `${ALUNA}/plano.pdf`,
  )
  await esperaErro(
    'aluna não envia arquivo',
    `insert into public.arquivos_aluna (perfil_id, nome, caminho, tipo) values ('${ALUNA}', 'x', '${ALUNA}/z.pdf', 'pdf')`,
    '42501',
  )
  await esperaErro(
    'aluna não sobe no espaço',
    `insert into storage.objects (bucket_id, name) values ('arquivos_aluna', '${ALUNA}/z.pdf')`,
    '42501',
  )
  await esperaValor(
    'aluna não apaga',
    `with d as (delete from public.arquivos_aluna returning 1) select count(*)::int from d`,
    0,
  )
  await t.comoAluna(VENCIDA)
  await esperaValor(
    'sem acesso ativo, não vê',
    `select count(*)::int from public.arquivos_aluna`,
    0,
  )
  await esperaValor(
    'sem acesso ativo, não baixa',
    `select count(*)::int from storage.objects where bucket_id = 'arquivos_aluna'`,
    0,
  )
  await t.comoAnon()
  await esperaErro('anônimo não lê', `select * from public.arquivos_aluna`, '42501')
  await t.comoAluna(ADMIN)
  await esperaValor(
    'admin apaga',
    `with d as (delete from public.arquivos_aluna where nome = 'Antigo' returning 1) select count(*)::int from d`,
    1,
  )
}

export async function testarArquivosAluna() {
  const t = await criarBanco()
  await montar(t.db)
  await testes(t)
  return t.fim('arquivos da aluna')
}
