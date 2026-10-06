import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ALUNA = ID(2)
const OUTRA = ID(3)
const SEM_ACESSO = ID(4)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'a@t.com'),($2,'o@t.com'),($3,'s@t.com')`,
    [ALUNA, OUTRA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set acesso_inicio_em = now() - interval '2 days 1 hour' where id in ('${ALUNA}', '${OUTRA}');
    insert into public.temas (id, titulo, ordem, publicado) values ('${ID(11)}', 'Comece por aqui', 1, true), ('${ID(12)}', 'Rascunho', 2, false);
    insert into public.etapas (id, tema_id, titulo, ordem, publicado) values
      ('${ID(21)}', '${ID(11)}', 'Arrancada', 1, true),
      ('${ID(22)}', '${ID(11)}', 'Escondida', 2, false),
      ('${ID(23)}', '${ID(12)}', 'Do rascunho', 1, true);
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, ordem, publicado, duracao_minutos, profissional) values
      ('${ID(31)}', '${ID(21)}', 'Dia 1', 'https://v.t/1', 1, 1, true, 8, 'Ana'),
      ('${ID(32)}', '${ID(21)}', 'Dia 3', 'https://v.t/3', 3, 2, true, 10, 'Clara'),
      ('${ID(33)}', '${ID(21)}', 'Dia 8', 'https://v.t/8', 8, 3, true, 12, 'Laís'),
      ('${ID(34)}', '${ID(21)}', 'Rascunho', 'https://v.t/r', 1, 4, false, null, null),
      ('${ID(35)}', '${ID(22)}', 'Etapa escondida', 'https://v.t/e', 1, 1, true, null, null),
      ('${ID(36)}', '${ID(23)}', 'Tema escondido', 'https://v.t/t', 1, 1, true, null, null);
  `)
}

const trilha = `select count(*)::int from public.minha_trilha()`

async function aluna(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor('trilha mostra só aulas publicadas de etapa e tema publicados', trilha, 3)
  await esperaValor('aula do dia 8 aparece fechada', `select count(*)::int from public.minha_trilha() where not liberada`, 1)
  await esperaValor('função existe com as colunas da trilha', `select count(*)::int from pg_proc where proname = 'minha_trilha' and 'liberada' = any(proargnames)`, 1)
  await esperaValor('trilha não entrega link de vídeo', `select count(*)::int from pg_proc where proname = 'minha_trilha' and 'video_url' = any(proargnames)`, 0)
  await esperaValor('aula fechada não abre pela tabela', `select count(*)::int from public.aulas where id = '${ID(33)}'`, 0)
  await esperaValor('aluna marca aula liberada', `insert into public.aulas_concluidas (aula_id) values ('${ID(31)}') returning 1`, 1)
  await esperaValor('trilha mostra a aula concluída', `select count(*)::int from public.minha_trilha() where concluida`, 1)
  await esperaErro('aluna não marca aula fechada', `insert into public.aulas_concluidas (aula_id) values ('${ID(33)}')`, '42501')
  await esperaErro('aluna não marca aula em nome de outra', `insert into public.aulas_concluidas (perfil_id, aula_id) values ('${OUTRA}', '${ID(32)}')`, '42501')
  await esperaErro('aluna não marca a mesma aula duas vezes', `insert into public.aulas_concluidas (aula_id) values ('${ID(31)}')`, '23505')
  await esperaValor('aluna altera apelido e consentimento', `update public.perfis set apelido = 'mari', consentimento_saude_em = now() where id = '${ALUNA}' returning 1`, 1)
  await t.comoAluna(OUTRA)
  await esperaValor('outra aluna não vê as conclusões dela', `select count(*)::int from public.aulas_concluidas`, 0)
  await esperaValor('outra aluna não vê o concluído dela na trilha', `select count(*)::int from public.minha_trilha() where concluida`, 0)
  await t.db.query(`delete from public.aulas_concluidas`)
  await t.comoAluna(ALUNA)
  await esperaValor('outra aluna não apaga a conclusão dela', `select count(*)::int from public.aulas_concluidas`, 1)
  await esperaValor('aluna desmarca a aula', `delete from public.aulas_concluidas where aula_id = '${ID(31)}' returning 1`, 1)
}

async function semAcesso(t) {
  await t.comoAluna(SEM_ACESSO)
  await t.esperaValor('sem acesso, trilha vazia', trilha, 0)
  await t.esperaErro('sem acesso, não marca aula', `insert into public.aulas_concluidas (aula_id) values ('${ID(31)}')`, '42501')
  await t.comoAnon()
  await t.esperaErro('anônimo não usa minha_trilha', trilha, '42501')
  await t.esperaErro('anônimo não lê conclusões', `select count(*)::int from public.aulas_concluidas`, '42501')
}

export async function testarTrilha() {
  const t = await criarBanco()
  await montar(t.db)
  await aluna(t)
  await semAcesso(t)
  await t.comoDono()
  return t.fim('trilha')
}
