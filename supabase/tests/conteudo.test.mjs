import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const SEM_ACESSO = ID(3)
const FUTURA = ID(4)
const VENCIDA = ID(5)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'adm@t.com'),($2,'aluna@t.com'),($3,'sem@t.com'),($4,'fut@t.com'),($5,'venc@t.com')`,
    [ADMIN, ALUNA, SEM_ACESSO, FUTURA, VENCIDA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = (public.hoje_brasilia() - 5)::timestamp at time zone 'America/Sao_Paulo' where id = '${ALUNA}';
    delete from public.temas;
    update public.perfis set acesso_inicio_em = now() + interval '1 hour' where id = '${FUTURA}';
    update public.perfis set acesso_inicio_em = now() - interval '400 days', acesso_fim_em = now() - interval '1 minute' where id = '${VENCIDA}';
    insert into public.temas (id, titulo, publicado, tipo) values ('${ID(11)}', 'Preparação', true, 'preparacao'), ('${ID(12)}', 'Rascunho', false, 'tema');
    insert into public.etapas (id, tema_id, titulo, ordem, publicado) values
      ('${ID(21)}', '${ID(11)}', 'Etapa 1', 1, true),
      ('${ID(22)}', '${ID(11)}', 'Etapa 2', 2, false),
      ('${ID(23)}', '${ID(12)}', 'Etapa do rascunho', 1, true);
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, publicado) values
      ('${ID(31)}', '${ID(21)}', 'Dia 1', 'https://v.t/1', 1, true),
      ('${ID(32)}', '${ID(21)}', 'Dia 6', 'https://v.t/6', 6, true),
      ('${ID(33)}', '${ID(21)}', 'Dia 7', 'https://v.t/7', 7, true),
      ('${ID(34)}', '${ID(21)}', 'Rascunho', 'https://v.t/r', 1, false),
      ('${ID(35)}', '${ID(22)}', 'Etapa rascunho', 'https://v.t/e', 1, true),
      ('${ID(36)}', '${ID(23)}', 'Tema rascunho', 'https://v.t/t', 1, true);
    insert into public.lives (id, tema, data, publicado) values
      ('${ID(41)}', 'Mais energia', now() + interval '2 days', true),
      ('${ID(42)}', 'Rascunho', now() + interval '9 days', false);
    insert into public.avisos (id, titulo, texto, publicar_em, publicado) values
      ('${ID(51)}', 'Bem-vinda', 'Oi', now() - interval '1 hour', true),
      ('${ID(52)}', 'Agendado', 'Depois', now() + interval '1 day', true),
      ('${ID(53)}', 'Rascunho', 'Nada', now() - interval '1 hour', false);
  `)
}

const contar = (tabela) => `select count(*)::int from public.${tabela}`
const TABELAS = ['temas', 'etapas', 'aulas', 'lives', 'avisos']

async function anonimo(t) {
  await t.comoAnon()
  for (const tabela of TABELAS) {
    await t.esperaErro(`anônimo não lê ${tabela}`, contar(tabela), '42501')
  }
  await t.esperaErro(
    'anônimo não usa tem_acesso_ativo',
    'select public.tem_acesso_ativo()',
    '42501',
  )
}

async function alunaComAcesso(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor('aluna está no dia 6 do acesso', 'select public.dia_de_acesso()', 6)
  await esperaValor('aluna vê só o tema publicado', contar('temas'), 1)
  await esperaValor('aluna vê só a etapa publicada de tema publicado', contar('etapas'), 1)
  await esperaValor('aluna vê só as aulas liberadas até o dia 6', contar('aulas'), 2)
  await esperaValor(
    'aula do dia 7 ainda não aparece',
    `select count(*)::int from public.aulas where dia_liberacao = 7`,
    0,
  )
  await esperaValor('aluna vê só a live publicada', contar('lives'), 1)
  await esperaValor('aluna vê só o aviso publicado e já no ar', contar('avisos'), 1)
  await esperaErro('aluna não cria tema', `insert into public.temas (titulo) values ('x')`, '42501')
  await esperaErro(
    'aluna não mexe no próprio acesso',
    `update public.perfis set acesso_fim_em = now() + interval '999 days' where id = '${ALUNA}'`,
    '42501',
  )
  await t.db.query(`update public.aulas set titulo = 'hackeado'`)
  await t.db.query(`delete from public.lives`)
  await t.comoDono()
  await esperaValor(
    'aluna não altera aula',
    `select count(*)::int from public.aulas where titulo = 'hackeado'`,
    0,
  )
  await esperaValor('aluna não apaga live', contar('lives'), 2)
}

async function semAcesso(t) {
  const { esperaValor } = t
  for (const [nome, id] of [
    ['sem acesso', SEM_ACESSO],
    ['com acesso só a partir de amanhã', FUTURA],
    ['com acesso vencido', VENCIDA],
  ]) {
    await t.comoAluna(id)
    await esperaValor(`aluna ${nome} não vê temas`, contar('temas'), 0)
    await esperaValor(`aluna ${nome} não vê aulas`, contar('aulas'), 0)
    await esperaValor(`aluna ${nome} não vê lives`, contar('lives'), 0)
    await esperaValor(`aluna ${nome} não vê avisos`, contar('avisos'), 0)
  }
}

async function admin(t) {
  const { esperaValor, esperaErro, db } = t
  await t.comoAluna(ADMIN)
  await esperaValor('admin vê todos os temas, inclusive rascunho', contar('temas'), 2)
  await esperaValor('admin vê todas as etapas', contar('etapas'), 3)
  await esperaValor('admin vê todas as aulas', contar('aulas'), 6)
  await esperaValor('admin vê todas as lives', contar('lives'), 2)
  await esperaValor('admin vê todos os avisos', contar('avisos'), 3)
  await esperaValor(
    'admin cria tema',
    `insert into public.temas (titulo, publicado) values ('Energia', true) returning 1`,
    1,
  )
  await db.query(`update public.aulas set dia_liberacao = 8 where id = '${ID(33)}'`)
  await esperaValor(
    'admin altera aula',
    `select dia_liberacao from public.aulas where id = '${ID(33)}'`,
    8,
  )
  await db.query(`delete from public.avisos where id = '${ID(53)}'`)
  await esperaValor('admin apaga aviso', contar('avisos'), 2)
  await esperaErro(
    'link de vídeo precisa ser https',
    `insert into public.aulas (etapa_id, titulo, video_url, dia_liberacao) values ('${ID(21)}', 'x', 'http://v.t', 1)`,
    '23514',
  )
  await esperaErro(
    'dia de liberação começa no 1',
    `insert into public.aulas (etapa_id, titulo, video_url, dia_liberacao) values ('${ID(21)}', 'x', 'https://v.t', 0)`,
    '23514',
  )
  await esperaErro(
    'ordem da etapa não se repete no tema',
    `insert into public.etapas (tema_id, titulo, ordem) values ('${ID(11)}', 'dup', 1)`,
    '23505',
  )
}

/** Dia da aluna pelo calendário de Brasília: muda à meia-noite, não a cada 24 h. */
async function viradaDoDia(t) {
  const { db, esperaValor } = t
  await t.comoDono()
  await db.query(`update public.aulas set dia_liberacao = 8 where id = '${ID(33)}'`)
  await db.query(
    `update public.perfis set acesso_inicio_em = (public.hoje_brasilia() - 6)::timestamp at time zone 'America/Sao_Paulo' where id = '${ALUNA}'`,
  )
  await t.comoAluna(ALUNA)
  await esperaValor('seis dias depois da adesão é o dia 7', 'select public.dia_de_acesso()', 7)
  await esperaValor(
    'aula do dia 8 ainda fechada no dia 7',
    `select count(*)::int from public.aulas where id = '${ID(33)}'`,
    0,
  )
  await t.comoDono()
  await db.query(
    `update public.perfis set acesso_inicio_em = (public.hoje_brasilia() - 7)::timestamp at time zone 'America/Sao_Paulo' + interval '23 hours 59 minutes' where id = '${ALUNA}'`,
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'adesão às 23h59 de sete dias atrás: hoje é o dia 8',
    'select public.dia_de_acesso()',
    8,
  )
  await esperaValor(
    'aula do dia 8 libera no dia 8, sem esperar 24 h',
    `select count(*)::int from public.aulas where id = '${ID(33)}'`,
    1,
  )
  await esperaValor(
    'virada da meia-noite em Brasília muda o dia',
    `select public.dia_atual_de('2026-10-05 23:59-03', '2026-10-06 00:00-03')`,
    2,
  )
  await esperaValor(
    'mesmo dia em Brasília continua dia 1, mesmo virando em UTC',
    `select public.dia_atual_de('2026-10-05 20:00-03', '2026-10-05 23:30-03')`,
    1,
  )
}

export async function testarConteudo() {
  const t = await criarBanco()
  await montar(t.db)
  await anonimo(t)
  await alunaComAcesso(t)
  await semAcesso(t)
  await viradaDoDia(t)
  await admin(t)
  await t.comoDono()
  return t.fim('conteudo')
}
