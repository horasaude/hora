import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const [ADMIN, NOVA, PAGANTE, OUTRA] = [ID(1), ID(2), ID(3), ID(4)]

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email, encrypted_password) values
      ($1,'admin@t.com','x'),($2,'nova@t.com',''),($3,'pagante@t.com','x'),($4,'outra@t.com','')`,
    [ADMIN, NOVA, PAGANTE, OUTRA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '2 days',
      acesso_fim_em = now() + interval '1 year' where id = '${PAGANTE}';
  `)
}

const registrar = (perfil, meses) =>
  `select public.registrar_parceira('${perfil}', ${meses}, '${ADMIN}')`

async function permissoes(t) {
  await t.comoAnon()
  await t.esperaErro('anônimo não registra parceira', registrar(NOVA, 3), '42501')
  await t.comoAluna(ADMIN)
  await t.esperaErro('nem a profissional pelo site', registrar(NOVA, 3), '42501')
  await t.comoDono()
  await t.db.query(registrar(OUTRA, 1))
  await t.comoAluna(NOVA)
  await t.esperaValor('aluna não vê parceiras', 'select count(*)::int from public.parceiras', 0)
}

async function regras(t) {
  const { esperaValor, esperaErro } = t
  await t.comoServico()
  await esperaErro('prazo fora de 1, 3, 6 e 12', registrar(NOVA, 2), '22023')
  await esperaErro('profissional não vira parceira', registrar(ADMIN, 3))
  await esperaErro('quem já pagou não vira parceira', registrar(PAGANTE, 3))
  await t.db.query(registrar(NOVA, 3))
  await esperaValor(
    'acesso de 3 meses a partir de agora',
    `select (acesso_fim_em - acesso_inicio_em) between interval '89 days' and interval '92 days'
       and acesso_inicio_em <= now() from public.perfis where id = '${NOVA}'`,
    true,
  )
  await esperaValor(
    'histórico com quem liberou',
    `select liberado_por::text from public.acessos_liberados where perfil_id = '${NOVA}'`,
    ADMIN,
  )
  await t.db.query(registrar(NOVA, 6))
  await esperaValor(
    'cadastrar de novo troca o prazo, sem duplicar',
    `select count(*)::int || '-' || max(meses) from public.parceiras where perfil_id = '${NOVA}'`,
    '1-6',
  )
}

async function link(t) {
  const { esperaValor } = t
  const codigo = `(select codigo_acesso from public.parceiras where perfil_id = '${NOVA}')`
  await esperaValor(
    'o link da parceira abre para criar a senha',
    `select email from public.acesso_do_link(${codigo})`,
    'nova@t.com',
  )
  await t.db.exec(
    `update public.perfis set acesso_inicio_em = now() - interval '40 days',
      acesso_fim_em = now() - interval '1 minute' where id = '${OUTRA}'`,
  )
  await esperaValor(
    'parceria vencida não abre o link',
    `select count(*)::int from public.acesso_do_link((select codigo_acesso from public.parceiras where perfil_id = '${OUTRA}'))`,
    0,
  )
  await t.comoAluna(ADMIN)
  await esperaValor(
    'painel marca a parceira',
    `select parceira from public.painel_alunas() where id = '${NOVA}'`,
    true,
  )
  await esperaValor(
    'quem pagou não aparece como parceira',
    `select parceira from public.painel_alunas() where id = '${PAGANTE}'`,
    false,
  )
}

async function encerrar(t) {
  const { esperaValor, esperaErro } = t
  const fim = (id) => `select acesso_fim_em <= now() from public.perfis where id = '${id}'`
  await t.comoAluna(NOVA)
  await esperaErro(
    'aluna não encerra parceria',
    `select public.encerrar_parceria('${NOVA}')`,
    '42501',
  )
  await t.comoAluna(ADMIN)
  await esperaErro(
    'só encerra quem é parceira',
    `select public.encerrar_parceria('${PAGANTE}')`,
    'P0002',
  )
  await t.db.query(`select public.encerrar_parceria('${NOVA}')`)
  await esperaValor('encerrar corta o acesso na hora', fim(NOVA), true)
  await esperaValor(
    'sem acesso ativo depois de encerrar',
    `select count(*)::int from public.painel_alunas() where id = '${NOVA}' and acesso_fim_em > now()`,
    0,
  )
  await t.comoServico()
  await t.db.query(registrar(NOVA, 1))
  await esperaValor('cadastrar de novo devolve o acesso', fim(NOVA), false)
}

export async function testarParceiras() {
  const t = await criarBanco()
  await montar(t.db)
  await permissoes(t)
  await regras(t)
  await link(t)
  await encerrar(t)
  return t.fim('parceiras')
}
