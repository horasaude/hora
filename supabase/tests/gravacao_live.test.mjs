import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ACABOU = ID(61)
const AO_VIVO = ID(62)
const COM_GRAVACAO = ID(63)
const ANTIGA = ID(64)
const RASCUNHO = ID(65)
const SEM_SALA = ID(66)
const pendentes = `select coalesce(string_agg(live::text, ',' order by inicio), '') from public.gravacoes_pendentes()`

async function montar(db) {
  await db.query(`insert into auth.users (id, email) values ($1,'ad@t.com')`, [ADMIN])
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    insert into public.lives (id, tema, data, publicado, profissionais, duracao_minutos, gravacao_url) values
      ('${ACABOU}', 'Acabou', now() - interval '2 hours', true, '{ana}', 60, null),
      ('${AO_VIVO}', 'Ao vivo', now() - interval '30 minutes', true, '{ana}', 60, null),
      ('${COM_GRAVACAO}', 'Postada', now() - interval '3 hours', true, '{ana}', 60, 'https://drive.google.com/file/d/x/view'),
      ('${ANTIGA}', 'Antiga', now() - interval '5 days', true, '{ana}', 60, null),
      ('${RASCUNHO}', 'Rascunho', now() - interval '2 hours', false, '{ana}', 60, null),
      ('${SEM_SALA}', 'Sem sala', now() - interval '2 hours', true, '{ana}', 60, null);
    insert into public.lives_salas (live_id, link_url, google_sala) values
      ('${ACABOU}', 'https://meet.t/1', 'spaces/1'),
      ('${AO_VIVO}', 'https://meet.t/2', 'spaces/2'),
      ('${COM_GRAVACAO}', 'https://meet.t/3', 'spaces/3'),
      ('${ANTIGA}', 'https://meet.t/4', 'spaces/4'),
      ('${RASCUNHO}', 'https://meet.t/5', 'spaces/5');
  `)
}

async function regras(t) {
  const { esperaValor, esperaErro } = t
  await t.comoServico()
  await esperaValor(
    'busca só a live publicada que acabou, com sala e sem gravação',
    pendentes,
    ACABOU,
  )
  await esperaValor(
    'devolve a sala do Meet',
    `select sala from public.gravacoes_pendentes()`,
    'spaces/1',
  )
  await t.comoAluna(ADMIN)
  await esperaErro('nem a equipe chama pelo navegador', pendentes, '42501')
  await t.comoAnon()
  await esperaErro('anônimo não chama', pendentes, '42501')
}

export async function testarGravacaoLive() {
  const t = await criarBanco()
  await montar(t.db)
  await regras(t)
  return t.fim('gravação da live')
}
