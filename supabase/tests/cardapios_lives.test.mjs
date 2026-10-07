import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const OUTRA = ID(3)
const PUBLICADO = ID(61)
const RASCUNHO = ID(62)
const RECEITA = ID(71)
const AGORA = ID(81)
const AMANHA = ID(82)
const PASSADA = ID(83)
const soma = `select coalesce(sum(pontos), 0)::int from public.lancamentos_pontos where perfil_id = '${ALUNA}'`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'o@t.com')`,
    [ADMIN, ALUNA, OUTRA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '3 days' where id in ('${ALUNA}', '${OUTRA}');
    insert into public.cardapios (id, objetivo, titulo, publicado) values
      ('${PUBLICADO}', 'Emagrecimento', 'Semana leve', true),
      ('${RASCUNHO}', 'Emagrecimento', 'Ainda não', false);
    insert into public.receitas (id, nome, publicado, tempo_minutos, refeicoes, objetivos) values
      ('${RECEITA}', 'Omelete', true, 10, '{cafe}', '{Emagrecimento}');
    insert into public.lives (id, tema, data, publicado, profissional, duracao_minutos, link_url) values
      ('${AGORA}', 'Sono e fome', now() - interval '10 minutes', true, 'clara', 60, 'https://sala.t/1'),
      ('${AMANHA}', 'Treino em casa', now() + interval '1 day', true, 'lais', 60, 'https://sala.t/2'),
      ('${PASSADA}', 'Rótulos', now() - interval '3 days', true, 'ana', 60, 'https://sala.t/3');
  `)
}

async function cardapios(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna vê só o cardápio publicado',
    `select count(*)::int from public.cardapios`,
    1,
  )
  await esperaValor(
    'rascunho nunca aparece',
    `select count(*)::int from public.cardapios where id = '${RASCUNHO}'`,
    0,
  )
  await esperaValor(
    'marca item da lista de compras',
    `insert into public.lista_compras_marcados (cardapio_id, item) values ('${PUBLICADO}', 'Ovo') returning 1`,
    1,
  )
  await esperaErro(
    'não marca item de cardápio rascunho',
    `insert into public.lista_compras_marcados (cardapio_id, item) values ('${RASCUNHO}', 'Ovo')`,
    '42501',
  )
  await esperaErro(
    'não marca item em nome de outra',
    `insert into public.lista_compras_marcados (perfil_id, cardapio_id, item) values ('${OUTRA}', '${PUBLICADO}', 'Pão')`,
    '42501',
  )
  await esperaValor(
    'favorita receita publicada',
    `insert into public.receitas_favoritas (receita_id) values ('${RECEITA}') returning 1`,
    1,
  )
  await esperaValor(
    'marca passo do Comece por aqui',
    `insert into public.comece_aqui_feitos (item) values ('regras') returning 1`,
    1,
  )
  await esperaErro(
    'item desconhecido é recusado',
    `insert into public.comece_aqui_feitos (item) values ('x')`,
    '23514',
  )
  await esperaValor('lê o Comece por aqui', `select count(*)::int from public.comece_aqui`, 1)
  await t.db.query(`update public.comece_aqui set texto = 'hackeado'`)
  await t.comoAluna(OUTRA)
  await esperaValor(
    'outra aluna não vê a lista dela',
    `select count(*)::int from public.lista_compras_marcados`,
    0,
  )
  await esperaValor(
    'outra aluna não vê as favoritas dela',
    `select count(*)::int from public.receitas_favoritas`,
    0,
  )
  await esperaValor(
    'outra aluna não vê o checklist dela',
    `select count(*)::int from public.comece_aqui_feitos`,
    0,
  )
  await t.db.query(`delete from public.lista_compras_marcados`)
  await t.comoAluna(ADMIN)
  await esperaValor(
    'aluna não muda o texto do Comece por aqui',
    `select texto <> 'hackeado' from public.comece_aqui`,
    true,
  )
  await esperaValor(
    'outra aluna não apaga a lista dela',
    `select count(*)::int from public.lista_compras_marcados`,
    0,
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'a lista dela continua lá',
    `select count(*)::int from public.lista_compras_marcados`,
    1,
  )
}

async function lives(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaErro(
    'live de amanhã ainda não abre',
    `select public.entrar_live('${AMANHA}')`,
    '22023',
  )
  await esperaErro(
    'live que já acabou não pontua',
    `select public.entrar_live('${PASSADA}')`,
    '22023',
  )
  await esperaValor(
    'entrar na live ao vivo dá 75 pontos',
    `select (public.entrar_live('${AGORA}') ->> 'pontos')::int`,
    75,
  )
  await esperaValor(
    'entrar de novo não pontua',
    `select (public.entrar_live('${AGORA}') ->> 'pontos')::int`,
    0,
  )
  await esperaValor(
    'a sala vem junto',
    `select public.entrar_live('${AGORA}') ->> 'link'`,
    'https://sala.t/1',
  )
  await esperaValor('os 75 pontos não duplicam', soma, 75)
  await esperaValor('uma presença só', `select count(*)::int from public.lives_presencas`, 1)
  await esperaErro(
    'presença só pela função',
    `insert into public.lives_presencas (perfil_id, live_id) values ('${ALUNA}', '${AMANHA}')`,
    '42501',
  )
  await esperaValor(
    'liga o lembrete',
    `insert into public.lives_lembretes (live_id) values ('${AMANHA}') returning 1`,
    1,
  )
  await t.comoAluna(OUTRA)
  await esperaValor(
    'outra aluna não vê a presença dela',
    `select count(*)::int from public.lives_presencas`,
    0,
  )
  await esperaValor(
    'outra aluna não vê o lembrete dela',
    `select count(*)::int from public.lives_lembretes`,
    0,
  )
  await t.comoAnon()
  await esperaErro('anônimo não entra na live', `select public.entrar_live('${AGORA}')`, '42501')
}

export async function testarCardapiosLives() {
  const t = await criarBanco()
  await montar(t.db)
  await cardapios(t)
  await lives(t)
  return t.fim('cardápios e lives')
}
