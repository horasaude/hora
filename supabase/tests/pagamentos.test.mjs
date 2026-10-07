import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const MADRINHA = ID(3)
const PIX = ID(101)
const OFERTA = ID(102)
const MENSAL = ID(103)
const MENSAL_NOVA = ID(104)
const tabelas = ['pedidos', 'eventos_pagamento', 'assinaturas']
const meses = (id) =>
  `select extract(month from age(acesso_fim_em, acesso_inicio_em))::int + 12 * extract(year from age(acesso_fim_em, acesso_inicio_em))::int from public.perfis where id = '${id}'`
const ativo = (id) =>
  `select acesso_inicio_em <= now() and now() < acesso_fim_em and acesso_suspenso_em is null from public.perfis where id = '${id}'`

const pedido = (id, plano, oferta, extra = 'null') => `
  insert into public.pedidos (id, nome, email, cpf, whatsapp, plano, valor_centavos, oferta, meses_acesso, codigo_indicacao)
  values ('${id}', 'Ana Souza', 'ana@t.com', '52998224725', '11999998888', '${plano}', 100, ${oferta}, ${oferta ? 13 : 12}, ${extra})`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'ana@t.com'),($3,'ma@t.com')`,
    [ADMIN, ALUNA, MADRINHA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set codigo_indicacao = 'MADRINHA1' where id = '${MADRINHA}';
    ${pedido(PIX, 'pix', false, "'MADRINHA1'")};
    ${pedido(OFERTA, 'parcelado', true)};
  `)
}

async function sigilo(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAnon()
  for (const tabela of tabelas)
    await esperaErro(`anônimo não lê ${tabela}`, `select * from public.${tabela}`, '42501')
  await esperaValor(
    'anônimo vê só a situação do pedido que conhece',
    `select public.situacao_pedido('${PIX}') ->> 'status'`,
    'criado',
  )
  await esperaErro(
    'anônimo não aprova pedido',
    `select public.aprovar_pedido('${PIX}', '${ALUNA}', now())`,
    '42501',
  )
  await t.comoAluna(ALUNA)
  for (const tabela of tabelas)
    await esperaValor(`aluna não lê ${tabela}`, `select count(*)::int from public.${tabela}`, 0)
  await esperaErro('aluna não cria pedido direto', pedido(ID(199), 'pix', false), '42501')
  await esperaErro(
    'aluna não libera o próprio acesso',
    `select public.aprovar_pedido('${PIX}', '${ALUNA}', now())`,
    '42501',
  )
  await esperaErro(
    'aluna não descobre conta pelo e-mail',
    `select public.perfil_por_email('ad@t.com')`,
    '42501',
  )
  await t.comoAluna(ADMIN)
  await esperaValor('admin lê os pedidos', `select count(*)::int from public.pedidos`, 2)
}

async function aprovacao(t) {
  const { esperaValor } = t
  await t.comoServico()
  await esperaValor(
    'acha a conta pelo e-mail',
    `select public.perfil_por_email(' ANA@t.com ')::text`,
    ALUNA,
  )
  await esperaValor(
    'aprova o Pix uma vez',
    `select public.aprovar_pedido('${PIX}', '${ALUNA}', now())`,
    true,
  )
  await esperaValor(
    'notificação repetida não aprova de novo',
    `select public.aprovar_pedido('${PIX}', '${ALUNA}', now())`,
    false,
  )
  await esperaValor('acesso de 12 meses', meses(ALUNA), 12)
  await esperaValor('acesso ativo', ativo(ALUNA), true)
  await esperaValor(
    'histórico com uma liberação',
    `select count(*)::int from public.acessos_liberados where perfil_id = '${ALUNA}'`,
    1,
  )
  await esperaValor(
    'indicação registrada aguardando a garantia',
    `select status from public.indicacoes where indicada_email = 'ana@t.com'`,
    'aguardando',
  )
  await esperaValor(
    'pontos da indicação só depois de 7 dias',
    `select count(*)::int from public.lancamentos_pontos where perfil_id = '${MADRINHA}'`,
    0,
  )
}

async function oferta(t) {
  const { esperaValor, db } = t
  await t.comoServico()
  await db.query(
    `update public.perfis set acesso_inicio_em = null, acesso_fim_em = null where id = '${ALUNA}'`,
  )
  await esperaValor(
    'aprova o pedido da oferta',
    `select public.aprovar_pedido('${OFERTA}', '${ALUNA}', now())`,
    true,
  )
  await esperaValor('oferta do dia 24 dá 13 meses', meses(ALUNA), 13)
}

async function reembolso(t) {
  const { esperaValor } = t
  await t.comoServico()
  await esperaValor(
    'reembolso encerra o pedido',
    `select public.encerrar_pedido('${PIX}', 'reembolsado')`,
    true,
  )
  await esperaValor(
    'reembolso repetido não faz nada',
    `select public.encerrar_pedido('${PIX}', 'reembolsado')`,
    false,
  )
  await esperaValor('acesso encerrado na hora', ativo(ALUNA), false)
  await esperaValor(
    'indicação cancelada',
    `select status from public.indicacoes where indicada_email = 'ana@t.com'`,
    'cancelada',
  )
  await esperaValor(
    'pedido reembolsado não volta a aprovado',
    `select public.aprovar_pedido('${PIX}', '${ALUNA}', now())`,
    false,
  )
  await esperaValor(
    'fim do acesso fica em agora',
    `select acesso_fim_em <= now() from public.perfis where id = '${ALUNA}'`,
    true,
  )
}

export { ID, MENSAL, MENSAL_NOVA, pedido, ativo, montar, sigilo, aprovacao, oferta, reembolso }

export async function testarPagamentos() {
  const t = await criarBanco()
  await montar(t.db)
  await sigilo(t)
  await aprovacao(t)
  await oferta(t)
  await reembolso(t)
  return t.fim('pagamentos')
}
