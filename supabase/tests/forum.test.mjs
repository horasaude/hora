import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const AMIGA = ID(3)
const SEM = ID(4)
const AULA = ID(31)
const soma = (p) =>
  `select coalesce(sum(pontos), 0)::int from public.lancamentos_pontos where perfil_id = '${p}'`
const pergunta = (texto, aula = 'null') =>
  `select public.forum_perguntar('${texto}', 'treino', ${aula === 'null' ? 'null' : `'${aula}'`})`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'aluna@t.com'),($3,'amiga@t.com'),($4,'sem@t.com')`,
    [ADMIN, ALUNA, AMIGA, SEM],
  )
  await db.exec(`
    update public.perfis set papel = 'admin', nome = 'Laís Moraes' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '2 days', nome = 'Maria Silva', apelido = 'mari' where id = '${ALUNA}';
    update public.perfis set acesso_inicio_em = now() - interval '2 days', nome = 'Ana Souza', apelido = 'aninha' where id = '${AMIGA}';
    delete from public.temas;
    insert into public.temas (id, titulo, publicado, tipo) values ('${ID(11)}', 'T', true, 'preparacao');
    insert into public.etapas (id, tema_id, titulo, ordem, publicado) values ('${ID(21)}', '${ID(11)}', 'E', 1, true);
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, publicado) values ('${AULA}', '${ID(21)}', 'Treino 1', 'https://v.t', 1, true);
  `)
}

async function aluna(t) {
  const { esperaValor, esperaErro, db } = t
  await t.comoAluna(SEM)
  await esperaErro('sem acesso não pergunta', pergunta('Posso treinar?'), '42501')
  await esperaErro('sem acesso não lê', `select count(*) from public.forum_listar()`, '42501')
  await t.comoAluna(ALUNA)
  await esperaErro(
    'não escreve direto na tabela',
    `insert into public.forum_topicos (perfil_id, categoria, texto) values ('${ALUNA}', 'treino', 'oi oi')`,
  )
  await esperaValor(
    'pergunta na aula',
    `select (${pergunta('Quantas séries faço?', AULA)}) is not null`,
    true,
  )
  await esperaValor(
    'prazo de 72 horas',
    `select round(extract(epoch from prazo_em - created_at) / 3600)::int from public.forum_topicos`,
    72,
  )
  await esperaValor('primeira dúvida dá 5', soma(ALUNA), 5)
  await db.query(pergunta('Posso treinar em jejum?'))
  await db.query(pergunta('E alongamento antes?'))
  await esperaValor('terceira do dia não pontua', soma(ALUNA), 10)
  await esperaErro(
    'categoria fora da lista',
    `select public.forum_perguntar('Teste longo', 'vendas', null)`,
  )
  await esperaErro('texto curto', `select public.forum_perguntar('ok', 'treino', null)`)
  await t.comoAluna(AMIGA)
  await esperaValor('amiga vê as 3 dúvidas', `select count(*)::int from public.forum_listar()`, 3)
  await esperaValor(
    'aparece pelo apelido',
    `select string_agg(distinct autora, ',') from public.forum_listar()`,
    'mari',
  )
  await esperaValor(
    'amiga não lê a tabela da outra',
    `select count(*)::int from public.forum_topicos`,
    0,
  )
  await esperaValor(
    'filtro da aula',
    `select count(*)::int from public.forum_listar(p_aula => '${AULA}')`,
    1,
  )
  await esperaValor('busca', `select count(*)::int from public.forum_listar(p_busca => 'JEJUM')`, 1)
  await esperaValor(
    'minhas dúvidas da amiga',
    `select count(*)::int from public.forum_listar(p_minhas => true)`,
    0,
  )
  const topico = (await db.query(`select id from public.forum_listar(p_aula => '${AULA}')`)).rows[0]
    .id
  await esperaValor(
    'amiga responde',
    `select (public.forum_responder('${topico}', 'Eu faço 3')) is not null`,
    true,
  )
  await esperaValor(
    'resposta de aluna não fecha a dúvida',
    `select respondida_em is null from public.forum_listar(p_id => '${topico}')`,
    true,
  )
  const resposta = (
    await db.query(
      `select (respostas->0->>'id') as r from public.forum_listar(p_id => '${topico}')`,
    )
  ).rows[0].r
  await t.comoAluna(ALUNA)
  await db.query(`select public.forum_curtir('${resposta}', true)`)
  await db.query(`select public.forum_curtir('${resposta}', true)`)
  await esperaValor(
    'curtir duas vezes conta uma',
    `select (respostas->0->>'curtidas')::int from public.forum_listar(p_id => '${topico}')`,
    1,
  )
  await db.query(`select public.forum_denunciar(null, '${resposta}', 'grosseria')`)
  await esperaErro(
    'não denuncia a própria dúvida',
    `select public.forum_denunciar('${topico}', null, null)`,
    '22023',
  )
  await db.query(`select public.forum_aceitar_regras()`)
  await esperaValor(
    'regras aceitas',
    `select forum_regras_em is not null from public.perfis where id = '${ALUNA}'`,
    true,
  )
  return { topico, resposta }
}

async function equipe(t, { topico, resposta }) {
  const { esperaValor, esperaErro, db } = t
  await t.comoAluna(ALUNA)
  await esperaErro('aluna não marca útil', `select public.forum_marcar_util('${topico}')`, '42501')
  await esperaErro(
    'aluna não oculta',
    `select public.forum_ocultar('${topico}', null, 'x')`,
    '42501',
  )
  await esperaValor(
    'sem aviso antes da equipe',
    `select count(*)::int from public.forum_minhas_respondidas()`,
    0,
  )
  await t.comoAluna(ADMIN)
  await db.query(
    `select public.salvar_perfil_equipe('Laís Moraes', 'treino', 'Educadora física', '${ADMIN}/foto.jpg')`,
  )
  await esperaValor('painel: 3 abertas', `select abertas from public.painel_forum()`, 3)
  await db.query(`select public.forum_responder('${topico}', 'Faça 3 séries de 12.')`)
  await esperaValor(
    'resposta da equipe fecha a dúvida',
    `select respondida_em is not null from public.forum_listar(p_id => '${topico}')`,
    true,
  )
  await esperaValor(
    'equipe aparece primeiro com título',
    `select respostas->0->>'titulo' from public.forum_listar(p_id => '${topico}')`,
    'Educadora física',
  )
  await esperaValor('painel: 2 abertas', `select abertas from public.painel_forum()`, 2)
  await esperaValor('marcar útil', `select public.forum_marcar_util('${topico}')`, true)
  await esperaValor(
    'marcar útil de novo não repete',
    `select public.forum_marcar_util('${topico}')`,
    false,
  )
  await esperaValor('útil dá 10 (5 + 5 + 10)', soma(ALUNA), 20)
  await esperaValor(
    '1 denúncia aberta',
    `select count(*)::int from public.painel_denuncias_forum()`,
    1,
  )
  await db.query(`select public.forum_manter(null, '${resposta}')`)
  await esperaValor(
    'manter resolve',
    `select count(*)::int from public.painel_denuncias_forum()`,
    0,
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aviso de dúvida respondida',
    `select count(*)::int from public.forum_minhas_respondidas()`,
    1,
  )
  await db.query(`select public.forum_marcar_vista('${topico}')`)
  await esperaValor(
    'aviso some depois de ver',
    `select count(*)::int from public.forum_minhas_respondidas()`,
    0,
  )
  await t.comoAluna(ADMIN)
  await esperaErro(
    'ocultar pede motivo',
    `select public.forum_ocultar('${topico}', null, ' ')`,
    '22023',
  )
  await db.query(`select public.forum_ocultar('${topico}', null, 'Prescrição entre alunas')`)
  await esperaValor('ocultar estorna os pontos da dúvida', soma(ALUNA), 5)
  await esperaValor(
    'admin ainda vê a oculta',
    `select oculto from public.forum_listar(p_id => '${topico}')`,
    true,
  )
  await t.comoAluna(AMIGA)
  await esperaValor('aluna não vê a oculta', `select count(*)::int from public.forum_listar()`, 2)
  await esperaErro(
    'não responde dúvida oculta',
    `select public.forum_responder('${topico}', 'oi')`,
    '22023',
  )
  await esperaErro(
    'aluna não lê denúncias',
    `select count(*) from public.painel_denuncias_forum()`,
    '42501',
  )
}

export async function testarForum() {
  const t = await criarBanco()
  await montar(t.db)
  const ids = await aluna(t)
  await equipe(t, ids)
  await t.comoDono()
  return t.fim('fórum')
}
