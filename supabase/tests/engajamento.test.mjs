import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const AMIGA = ID(3)
const OCULTA = ID(4)
const SEM_ACESSO = ID(5)
const AGUA = ID(61)
const FOTO = ID(62)
const FECHADO = ID(63)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'b@t.com'),($4,'c@t.com'),($5,'d@t.com')`,
    [ADMIN, ALUNA, AMIGA, OCULTA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '2 days' where id in ('${ALUNA}', '${AMIGA}', '${OCULTA}');
    update public.perfis set apelido = 'mari' where id = '${ALUNA}';
    update public.perfis set apelido = 'flor' where id = '${AMIGA}';
    update public.perfis set apelido = 'sumida', ocultar_ranking = true where id = '${OCULTA}';
    insert into public.desafios (id, nome, inicio, fim, tipo_checkin, unidade, meta_diaria, meta_dias, pontos_por_dia, bonus_conclusao, publicado, publico)
      values ('${AGUA}', 'Água', public.hoje_brasilia(), public.hoje_brasilia() + 5, 'numero', 'copos', 8, 1, 10, 50, true, 'inscritas'),
             ('${FOTO}', 'Prato', public.hoje_brasilia(), public.hoje_brasilia() + 5, 'foto', null, null, 3, 5, 0, true, 'todas'),
             ('${FECHADO}', 'Velho', public.hoje_brasilia() - 20, public.hoje_brasilia() - 10, 'sim_nao', null, null, 2, 5, 0, true, 'todas');
  `)
}

async function checkins(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'treino com foto e tipo dá 10 pontos',
    `select pontos from public.fazer_checkin('treino', '${ALUNA}/t.webp', 'musculacao', 45)`,
    10,
  )
  await esperaValor(
    'duração do treino fica guardada',
    `select duracao_minutos from public.checkins where tipo = 'treino'`,
    45,
  )
  await esperaErro(
    'tipo de treino fora da lista é recusado',
    `select public.fazer_checkin('treino', '${ALUNA}/t2.webp', 'yoga')`,
    '22023',
  )
  await esperaErro(
    'refeição sem foto é recusada',
    `select public.fazer_checkin('refeicao')`,
    '22023',
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaErro('sem acesso não faz check-in', `select public.fazer_checkin('agua')`, '42501')
}

async function ranking(t) {
  const { db, esperaValor } = t
  await t.comoDono()
  await db.exec(`
    select public.conceder_pontos('${AMIGA}', 'ajuste', 'teste', null, 50);
    select public.conceder_pontos('${OCULTA}', 'ajuste', 'teste', null, 500);
    insert into public.lancamentos_pontos (perfil_id, acao, pontos, dia, origem)
      values ('${AMIGA}', 'ajuste', 900, date_trunc('year', public.hoje_brasilia())::date - 1, 'teste');
  `)
  await t.comoAluna(ALUNA)
  await esperaValor(
    'quem escolheu sumir não aparece para as outras',
    `select count(*)::int from public.ranking_pontos('mes') where apelido = 'sumida'`,
    0,
  )
  await esperaValor(
    'flor lidera o mês',
    `select apelido from public.ranking_pontos('mes') where posicao = 1`,
    'flor',
  )
  await esperaValor(
    'a aluna se vê marcada como você',
    `select posicao from public.ranking_pontos('mes') where eu`,
    2,
  )
  await esperaValor(
    'pontos do ano passado não contam no ano',
    `select pontos from public.ranking_pontos('ano') where apelido = 'flor'`,
    50,
  )
  await t.comoAluna(OCULTA)
  await esperaValor(
    'quem sumiu vê a própria posição',
    `select posicao from public.ranking_pontos('mes') where eu`,
    1,
  )
  await t.comoAluna(SEM_ACESSO)
  await esperaValor(
    'sem acesso não vê ranking',
    `select count(*)::int from public.ranking_pontos('mes')`,
    0,
  )
}

async function desafios(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'lista os desafios publicados',
    `select count(*)::int from public.meus_desafios()`,
    3,
  )
  await esperaValor(
    'ainda não participa',
    `select participando from public.meus_desafios() where id = '${AGUA}'`,
    false,
  )
  await esperaValor(
    'entrar no desafio',
    `select count(*)::int from (select public.entrar_desafio('${AGUA}')) x`,
    1,
  )
  await esperaErro(
    'não entra em desafio encerrado',
    `select public.entrar_desafio('${FECHADO}')`,
    '22023',
  )
  await esperaErro(
    'número é obrigatório no desafio de número',
    `select public.checkin_desafio('${AGUA}')`,
    '22023',
  )
  await esperaValor(
    'bater a meta do dia dá pontos do dia e bônus',
    `select public.checkin_desafio('${AGUA}', 8)`,
    60,
  )
  await esperaValor(
    'repetir no mesmo dia não dá ponto',
    `select public.checkin_desafio('${AGUA}', 9)`,
    0,
  )
  await esperaValor(
    'dia feito e participando',
    `select (feito_hoje and participando and dias_feitos = 1 and participantes = 1) from public.meus_desafios() where id = '${AGUA}'`,
    true,
  )
  await esperaErro('desafio de foto pede foto', `select public.checkin_desafio('${FOTO}')`, '22023')
  await esperaErro(
    'foto de outra pessoa é recusada',
    `select public.checkin_desafio('${FOTO}', null, '${AMIGA}/x.webp')`,
    '42501',
  )
  await esperaValor(
    'desafio de foto pontua',
    `select public.checkin_desafio('${FOTO}', null, '${ALUNA}/x.webp')`,
    5,
  )
  await esperaErro(
    'fora do período não marca',
    `select public.checkin_desafio('${FECHADO}')`,
    '22023',
  )
  await t.comoAluna(OCULTA)
  await t.esperaValor(
    'entra no desafio de água',
    `select count(*)::int from (select public.entrar_desafio('${AGUA}')) x`,
    1,
  )
  await t.comoAluna(AMIGA)
  await esperaValor(
    'ranking do desafio esconde quem escolheu sumir',
    `select count(*)::int from public.ranking_desafio('${AGUA}')`,
    1,
  )
  await esperaValor(
    'ranking do desafio pelo apelido',
    `select apelido from public.ranking_desafio('${AGUA}') where posicao = 1`,
    'mari',
  )
}

async function medidas(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'registra medida',
    `insert into public.medidas (peso, cintura, foto_path) values (72.4, 80, '${ALUNA}/m.webp') returning (peso = 72.4)`,
    true,
  )
  await esperaErro(
    'medida vazia é recusada',
    `insert into public.medidas (dia) values (public.hoje_brasilia())`,
  )
  await esperaErro(
    'foto da medida na pasta de outra',
    `insert into public.medidas (peso, foto_path) values (70, '${AMIGA}/m.webp')`,
  )
  await esperaErro(
    'medida em nome de outra',
    `insert into public.medidas (perfil_id, peso) values ('${AMIGA}', 70)`,
    '42501',
  )
  await t.comoAluna(AMIGA)
  await esperaValor('outra aluna não vê', `select count(*)::int from public.medidas`, 0)
  await t.comoAluna(ADMIN)
  await esperaValor('profissional vê', `select count(*)::int from public.medidas`, 1)
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna apaga a sua',
    `with x as (delete from public.medidas returning 1) select count(*)::int from x`,
    1,
  )
}

async function perfil(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna põe foto na pasta dela',
    `update public.perfis set avatar_path = '${ALUNA}/avatar.webp' where id = '${ALUNA}' returning (avatar_path is not null)`,
    true,
  )
  await esperaErro(
    'foto de perfil na pasta de outra é recusada',
    `update public.perfis set avatar_path = '${AMIGA}/avatar.webp' where id = '${ALUNA}'`,
  )
  await esperaValor(
    'aluna liga e desliga aparecer no ranking',
    `update public.perfis set ocultar_ranking = true where id = '${ALUNA}' returning ocultar_ranking`,
    true,
  )
}

export async function testarEngajamento() {
  const t = await criarBanco()
  await montar(t.db)
  await checkins(t)
  await ranking(t)
  await desafios(t)
  await medidas(t)
  await perfil(t)
  return t.fim('Engajamento')
}
