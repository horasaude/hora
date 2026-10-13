import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const OUTRA = ID(3)
const ABERTA = ID(41)
const FECHADA = ID(42)
const prep = `(select e.id from public.etapas e join public.temas t on t.id = e.tema_id where t.chave = 'preparacao')`
const soma = `select coalesce(sum(pontos), 0)::int from public.lancamentos_pontos where perfil_id = '${ALUNA}'`
const progresso = (aula, trechos) =>
  `insert into public.aulas_progresso (aula_id, trechos, posicao, duracao) values ('${aula}', '${trechos}'::jsonb, 120, 600)
   on conflict (perfil_id, aula_id) do update set trechos = excluded.trechos, posicao = excluded.posicao returning 1`
const concluir = `insert into public.aulas_concluidas (aula_id) values ('${ABERTA}') on conflict do nothing`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'o@t.com')`,
    [ADMIN, ALUNA, OUTRA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = (public.hoje_brasilia() - 1)::timestamp at time zone 'America/Sao_Paulo' where id in ('${ALUNA}', '${OUTRA}');
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, publicado) values
      ('${ABERTA}', ${prep}, 'Dia 1', 'https://youtu.be/abcdefghijk', 1, true),
      ('${FECHADA}', ${prep}, 'Dia 6', 'https://youtu.be/abcdefghijk', 6, true);
  `)
}

async function word(t) {
  const { esperaValor } = t
  await t.comoAluna(ADMIN)
  await t.db.query(
    `select public.salvar_materiais('${ABERTA}', '[{"tipo": "word", "caminho": "aulas/${ABERTA}/roteiro.docx", "nome": "Roteiro", "tamanho": 5000}]'::jsonb)`,
  )
  await t.comoDono()
  await esperaValor(
    'arquivo Word aceito no espaço de materiais',
    `select 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' = any(allowed_mime_types) from storage.buckets where id = 'materiais'`,
    true,
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna vê o Word da aula liberada',
    `select tipo from public.aula_materiais where aula_id = '${ABERTA}'`,
    'word',
  )
}

async function progressoDoVideo(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor('guarda o progresso da aula liberada', progresso(ABERTA, '[[0,120]]'), 1)
  await esperaValor('atualiza o mesmo progresso', progresso(ABERTA, '[[0,300]]'), 1)
  await esperaValor(
    'uma linha só por aula',
    `select count(*)::int from public.aulas_progresso`,
    1,
  )
  await esperaErro('não grava progresso de aula fechada', progresso(FECHADA, '[]'), '42501')
  await esperaErro(
    'não grava progresso em nome de outra',
    `insert into public.aulas_progresso (perfil_id, aula_id) values ('${OUTRA}', '${ABERTA}')`,
    '42501',
  )
  await t.comoAluna(OUTRA)
  await esperaValor(
    'outra aluna não vê o progresso dela',
    `select count(*)::int from public.aulas_progresso`,
    0,
  )
  await t.comoAnon()
  await esperaErro('anônimo não lê progresso', `select * from public.aulas_progresso`, '42501')
}

async function conclusaoAutomatica(t) {
  const { esperaValor, db } = t
  await t.comoAluna(ALUNA)
  await db.query(concluir)
  await esperaValor('concluir pelo vídeo dá 10 pontos', soma, 10)
  await db.query(concluir)
  await db.query(concluir)
  await esperaValor('o vídeo concluindo de novo não duplica pontos', soma, 10)
  await db.query(`delete from public.aulas_concluidas where aula_id = '${ABERTA}'`)
  await db.query(concluir)
  await esperaValor('nem desmarcando e concluindo outra vez', soma, 10)
}

export async function testarAulaAssistida() {
  const t = await criarBanco()
  await montar(t.db)
  await word(t)
  await progressoDoVideo(t)
  await conclusaoAutomatica(t)
  return t.fim('aula assistida e arquivos Word')
}
