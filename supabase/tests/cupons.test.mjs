import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)

const pedido = (cupom, status, criado = 'now()') => `
  insert into public.pedidos (nome, email, cpf, whatsapp, plano, valor_centavos, meses_acesso, status, cupom_id, created_at)
  values ('Ana Lima', 'a@t.com', '52998224725', '98999999999', 'pix', 1000, 12, '${status}',
    (select id from public.cupons where codigo = '${cupom}'), ${criado})`

async function montar(db) {
  await db.query(`insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'al@t.com')`, [
    ADMIN,
    ALUNA,
  ])
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '1 day' where id = '${ALUNA}';
  `)
}

async function testes(t) {
  const { esperaValor, esperaErro, db } = t
  await t.comoAluna(ADMIN)
  await esperaValor(
    'admin cria cupons',
    `insert into public.cupons (codigo, tipo, valor, planos, limite_usos, valido_ate) values
      ('ORA10', 'porcentagem', 10, '{pix,parcelado,recorrente}', null, null),
      ('DOIS', 'valor', 5000, '{pix}', 2, null),
      ('VENCIDO', 'porcentagem', 5, '{pix}', null, now() - interval '1 hour')
     returning 1`,
    1,
  )
  await esperaErro(
    'porcentagem acima de 90 não passa',
    `insert into public.cupons (codigo, tipo, valor) values ('MUITO', 'porcentagem', 95)`,
    '23514',
  )
  await esperaErro(
    'código só com letras e números',
    `insert into public.cupons (codigo, tipo, valor) values ('ora 10', 'porcentagem', 10)`,
    '23514',
  )
  await t.comoAluna(ALUNA)
  await esperaValor('aluna não vê a lista de cupons', `select count(*)::int from public.cupons`, 0)
  await esperaErro(
    'aluna não cria cupom',
    `insert into public.cupons (codigo, tipo, valor) values ('MEU', 'porcentagem', 50)`,
    '42501',
  )
  await t.comoAnon()
  await esperaErro('visitante não lê a tabela', `select count(*) from public.cupons`, '42501')
  await esperaValor(
    'visitante consulta o cupom pelo código, sem diferença de maiúscula',
    `select codigo || ':' || tipo || ':' || valor from public.consultar_cupom(' ora10 ')`,
    'ORA10:porcentagem:10',
  )
  await esperaValor(
    'cupom vencido não volta',
    `select count(*)::int from public.consultar_cupom('VENCIDO')`,
    0,
  )
  await t.comoDono()
  await db.exec(pedido('DOIS', 'aprovado'))
  await db.exec(pedido('DOIS', 'pendente', "now() - interval '2 hours'"))
  await t.comoAnon()
  await esperaValor(
    'Pix esquecido não segura o cupom',
    `select count(*)::int from public.consultar_cupom('DOIS')`,
    1,
  )
  await t.comoDono()
  await db.exec(pedido('DOIS', 'pendente'))
  await t.comoAnon()
  await esperaValor(
    'chegou no limite de usos, contando o pagamento em andamento',
    `select count(*)::int from public.consultar_cupom('DOIS')`,
    0,
  )
  await t.comoAluna(ADMIN)
  await esperaValor(
    'painel conta só os pedidos pagos',
    `select public.usos(c) from public.cupons c where codigo = 'DOIS'`,
    1,
  )
  await db.exec(`update public.cupons set ativo = false where codigo = 'ORA10'`)
  await t.comoAnon()
  await esperaValor(
    'cupom desligado não volta',
    `select count(*)::int from public.consultar_cupom('ORA10')`,
    0,
  )
}

export async function testarCupons() {
  const t = await criarBanco()
  await montar(t.db)
  await testes(t)
  return t.fim('cupons')
}
