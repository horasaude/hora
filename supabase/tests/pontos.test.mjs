import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const AMIGA = ID(3)
const AULA = ID(31)
const DESAFIO = ID(61)
const soma = (p) =>
  `select coalesce(sum(pontos), 0)::int from public.lancamentos_pontos where perfil_id = '${p}'`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'aluna@t.com'),($3,'amiga@t.com')`,
    [ADMIN, ALUNA, AMIGA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '2 days', cpf = '11122233344' where id in ('${ALUNA}', '${AMIGA}');
    update public.perfis set cpf = '55566677788' where id = '${AMIGA}';
    insert into public.temas (id, titulo, publicado) values ('${ID(11)}', 'T', true);
    insert into public.etapas (id, tema_id, titulo, ordem, publicado) values ('${ID(21)}', '${ID(11)}', 'E', 1, true);
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, publicado) values ('${AULA}', '${ID(21)}', 'A', 'https://v.t', 1, true);
    insert into public.desafios (id, nome, inicio, fim, tipo_checkin, meta_dias, pontos_por_dia, bonus_conclusao, publicado)
      values ('${DESAFIO}', 'Água', public.hoje_brasilia(), public.hoje_brasilia() + 5, 'sim_nao', 1, 10, 100, true);
  `)
}

async function checkins(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'check-in de água dá 5 pontos',
    `select pontos from public.fazer_checkin('agua')`,
    5,
  )
  await esperaValor('soma 5', soma(ALUNA), 5)
  await esperaValor(
    'o mesmo check-in no mesmo dia não pontua de novo',
    `select pontos from public.fazer_checkin('agua')`,
    0,
  )
  await esperaErro(
    'treino sem foto é recusado',
    `select public.fazer_checkin('treino', null, 'corrida')`,
    '22023',
  )
  await esperaValor('ainda 5', soma(ALUNA), 5)
  await esperaErro(
    'foto precisa estar na pasta da aluna',
    `select public.fazer_checkin('refeicao', '${AMIGA}/x.jpg')`,
    '42501',
  )
  await esperaValor(
    'foto da refeição pontua',
    `select pontos from public.fazer_checkin('refeicao', '${ALUNA}/prato.jpg')`,
    5,
  )
  await esperaValor('soma 10', soma(ALUNA), 10)
  await esperaErro(
    'aluna não insere ponto direto',
    `insert into public.lancamentos_pontos (perfil_id, acao, pontos, origem) values ('${ALUNA}', 'ajuste', 999, 'x')`,
    '42501',
  )
  await esperaErro(
    'aluna não chama conceder_pontos',
    `select public.conceder_pontos('${ALUNA}', 'ajuste', 'x', null, 999)`,
    '42501',
  )
  await esperaErro(
    'aluna não edita lançamento',
    `update public.lancamentos_pontos set pontos = 999`,
    '42501',
  )
  await esperaErro(
    'aluna não lança ajuste',
    `select public.lancar_ajuste('${ALUNA}', 50, 'x')`,
    '42501',
  )
  await t.db.query(`insert into public.aulas_concluidas (aula_id) values ('${AULA}')`)
  await esperaValor('concluir aula dá 10', soma(ALUNA), 20)
  await t.db.query(`delete from public.aulas_concluidas where aula_id = '${AULA}'`)
  await t.db.query(`insert into public.aulas_concluidas (aula_id) values ('${AULA}')`)
  await esperaValor('desmarcar e marcar de novo não pontua de novo', soma(ALUNA), 20)
  await t.db.query(`insert into public.desafio_checkins (desafio_id) values ('${DESAFIO}')`)
  await esperaValor('check-in do desafio dá 10 e o bônus de conclusão 100', soma(ALUNA), 130)
  await t.comoAluna(AMIGA)
  await esperaValor(
    'amiga não vê os pontos da aluna',
    `select count(*)::int from public.lancamentos_pontos`,
    0,
  )
}

async function admin(t) {
  const { esperaValor, esperaErro, db } = t
  await t.comoAluna(ADMIN)
  const checkin = (
    await db.query(
      `select id from public.checkins where perfil_id = '${ALUNA}' and tipo = 'refeicao'`,
    )
  ).rows[0].id
  await esperaValor(
    'invalidar foto estorna o ponto do check-in',
    `select public.invalidar_checkin('${checkin}', 'foto repetida')`,
    1,
  )
  await esperaValor('soma cai 5', soma(ALUNA), 125)
  await esperaValor(
    'invalidar de novo não estorna em dobro',
    `select public.invalidar_checkin('${checkin}', 'de novo')`,
    0,
  )
  await esperaValor(
    'ajuste dá pontos com motivo',
    `select (public.lancar_ajuste('${ALUNA}', 20, 'participou do encontro') is not null)`,
    true,
  )
  await esperaValor(
    'ajuste tira pontos com motivo',
    `select (public.lancar_ajuste('${ALUNA}', -15, 'correção') is not null)`,
    true,
  )
  await esperaValor('soma 130', soma(ALUNA), 130)
  await esperaErro(
    'ajuste sem motivo é recusado',
    `select public.lancar_ajuste('${ALUNA}', 20, '  ')`,
    '22023',
  )
  await esperaErro(
    'admin não edita lançamento',
    `update public.lancamentos_pontos set pontos = 1`,
    '42501',
  )
  await esperaErro('admin não apaga lançamento', `delete from public.lancamentos_pontos`, '42501')
  await db.query(`update public.regras_pontos set ativo = false where acao = 'cardio'`)
  await t.comoAluna(ALUNA)
  await esperaValor(
    'regra desligada não pontua',
    `select pontos from public.fazer_checkin('cardio')`,
    0,
  )
  await esperaValor('soma continua 130', soma(ALUNA), 130)
  await t.comoAluna(ADMIN)
  await esperaValor(
    'painel conta check-ins válidos de hoje (sem o invalidado)',
    `select checkins_hoje from public.painel_pontos()`,
    2,
  )
  await esperaValor(
    'participantes do desafio com os dias cumpridos',
    `select dias from public.participantes_desafio('${DESAFIO}')`,
    1,
  )
}

async function indicacoes(t) {
  const { esperaValor, db } = t
  await t.comoServico()
  const codigo = (
    await db.query(`select codigo_indicacao from public.perfis where id = '${ALUNA}'`)
  ).rows[0].codigo_indicacao
  await esperaValor(
    'autoindicação pelo e-mail é recusada',
    `select public.registrar_indicacao('${codigo}', 'Eu', 'ALUNA@t.com', null)`,
    null,
  )
  await esperaValor(
    'autoindicação pelo CPF é recusada',
    `select public.registrar_indicacao('${codigo}', 'Eu', 'outra@t.com', '11122233344')`,
    null,
  )
  await db.query(
    `select public.registrar_indicacao('${codigo.toLowerCase()}', 'Amiga', 'amiga@t.com', '55566677788')`,
  )
  await esperaValor(
    'indicação da amiga entra aguardando garantia',
    `select status from public.indicacoes where indicada_email = 'amiga@t.com'`,
    'aguardando',
  )
  await esperaValor('antes dos 7 dias nada é confirmado', `select public.confirmar_indicacoes()`, 0)
  await db.query(`update public.indicacoes set garantia_ate = now() - interval '1 minute'`)
  await esperaValor('depois da garantia confirma', `select public.confirmar_indicacoes()`, 1)
  await esperaValor('indicação confirmada dá 150', soma(ALUNA), 280)
  await esperaValor('rodar de novo não dá de novo', `select public.confirmar_indicacoes()`, 0)
  await t.comoAluna(AMIGA)
  await t.esperaErro(
    'aluna não confirma indicação',
    `select public.confirmar_indicacoes()`,
    '42501',
  )
}

async function acoesProprias(t) {
  const { esperaValor, esperaErro, db } = t
  await t.comoAluna(ALUNA)
  await esperaErro(
    'aluna não cria ação',
    `select public.criar_acao('Post', 20, 'sem_limite', null)`,
  )
  await t.comoAluna(ADMIN)
  const acao = (
    await db.query(
      `select public.criar_acao(' Post no Instagram ', 20, 'por_referencia', null) as a`,
    )
  ).rows[0].a
  await esperaValor(
    'ação nova nasce própria e ativa',
    `select propria and ativo and nome = 'Post no Instagram' from public.regras_pontos where acao = '${acao}'`,
    true,
  )
  await esperaValor(
    'admin renomeia a ação',
    `with u as (update public.regras_pontos set nome = 'Post da HORA' where acao = '${acao}' returning 1) select count(*)::int from u`,
    1,
  )
  const antes = (await db.query(soma(ALUNA))).rows[0].coalesce
  await esperaValor(
    'dar pontos para duas alunas',
    `select public.dar_pontos_acao('${acao}', array['${ALUNA}', '${AMIGA}', '${ADMIN}']::uuid[])`,
    2,
  )
  await esperaValor('aluna recebe 20', soma(ALUNA), antes + 20)
  await esperaValor(
    'uma vez só não repete',
    `select public.dar_pontos_acao('${acao}', array['${ALUNA}']::uuid[])`,
    0,
  )
  await esperaErro(
    'ação pronta não recebe pontos pelo painel',
    `select public.dar_pontos_acao('agua', array['${ALUNA}']::uuid[])`,
  )
  await esperaErro(
    'nome de ação fora do padrão é recusado',
    `insert into public.regras_pontos (acao, nome, pontos, limite_tipo) values ('qualquer', 'X', 1, 'sem_limite')`,
  )
  await t.comoAluna(ALUNA)
  await esperaErro(
    'aluna não dá pontos',
    `select public.dar_pontos_acao('${acao}', array['${ALUNA}']::uuid[])`,
  )
}

export async function testarPontos() {
  const t = await criarBanco()
  await montar(t.db)
  await checkins(t)
  await admin(t)
  await indicacoes(t)
  await acoesProprias(t)
  await t.comoDono()
  return t.fim('pontos e indicações')
}
