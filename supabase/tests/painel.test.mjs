import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const OUTRA = ID(3)
const SEM_ACESSO = ID(4)
const AGUA = ID(61)
const FOTO = ID(62)
const INSCRITAS = ID(63)
const FECHADO = ID(64)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'o@t.com'),($4,'s@t.com')`,
    [ADMIN, ALUNA, OUTRA, SEM_ACESSO],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set nome = 'Mari', acesso_inicio_em = now() - interval '3 days' where id = '${ALUNA}';
    update public.perfis set nome = 'Cris', acesso_inicio_em = now() - interval '1 day' where id = '${OUTRA}';
    insert into public.cardapios (titulo, objetivo, publicado) values ('Leve', 'Preparação', true), ('Rascunho', 'Preparação', false);
    insert into public.desafios (id, nome, inicio, fim, tipo_checkin, unidade, meta_diaria, meta_dias, publico, publicado) values
      ('${AGUA}', 'Água', public.hoje_brasilia() - 1, public.hoje_brasilia() + 5, 'numero', 'copos', 8, 2, 'todas', true),
      ('${FOTO}', 'Prato', public.hoje_brasilia(), public.hoje_brasilia() + 5, 'foto', null, null, 1, 'todas', true),
      ('${INSCRITAS}', 'Treino', public.hoje_brasilia(), public.hoje_brasilia() + 5, 'sim_nao', null, null, 1, 'inscritas', true),
      ('${FECHADO}', 'Rascunho', public.hoje_brasilia(), public.hoje_brasilia() + 5, 'sim_nao', null, null, 1, 'todas', false);
    insert into public.desafio_checkins (desafio_id, perfil_id, dia, valor) values ('${AGUA}', '${ALUNA}', public.hoje_brasilia() - 1, 8);
  `)
}

async function aluna(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna vê só o cardápio publicado',
    `select count(*)::int from public.cardapios`,
    1,
  )
  await esperaValor(
    'aluna vê só desafios publicados',
    `select count(*)::int from public.desafios`,
    3,
  )
  await esperaErro(
    'aluna não cria cardápio',
    `insert into public.cardapios (titulo, objetivo) values ('x', 'y')`,
    '42501',
  )
  await esperaValor(
    'aluna não encerra desafio',
    `with u as (update public.desafios set encerrado_em = now() where id = '${AGUA}' returning 1) select count(*)::int from u`,
    0,
  )
  await esperaValor(
    'aluna marca o check-in de número de hoje',
    `insert into public.desafio_checkins (desafio_id, valor) values ('${AGUA}', 8) returning 1`,
    1,
  )
  await esperaErro(
    'check-in de número sem valor é recusado',
    `insert into public.desafio_checkins (desafio_id) values ('${FOTO}')`,
    '42501',
  )
  await esperaErro(
    'check-in de outro dia é recusado',
    `insert into public.desafio_checkins (desafio_id, dia, valor) values ('${AGUA}', public.hoje_brasilia() + 1, 8)`,
    '42501',
  )
  await esperaErro(
    'check-in em nome de outra é recusado',
    `insert into public.desafio_checkins (desafio_id, perfil_id, valor) values ('${AGUA}', '${OUTRA}', 8)`,
    '42501',
  )
  await esperaErro(
    'desafio só de inscritas exige entrar antes',
    `insert into public.desafio_checkins (desafio_id) values ('${INSCRITAS}')`,
    '42501',
  )
  await esperaValor(
    'aluna entra no desafio de inscritas',
    `insert into public.desafio_participantes (desafio_id) values ('${INSCRITAS}') returning 1`,
    1,
  )
  await esperaValor(
    'depois de entrar, marca o check-in',
    `insert into public.desafio_checkins (desafio_id) values ('${INSCRITAS}') returning 1`,
    1,
  )
  await esperaErro(
    'desafio em rascunho não aceita check-in',
    `insert into public.desafio_checkins (desafio_id) values ('${FECHADO}')`,
    '42501',
  )
  await esperaErro(
    'aluna não usa o painel de alunas',
    `select count(*) from public.painel_alunas()`,
    '42501',
  )
  await esperaErro(
    'aluna não conta participantes',
    `select public.alunas_em_desafios_ativos()`,
    '42501',
  )
  await esperaErro(
    'aluna não vê vencedoras',
    `select count(*) from public.vencedoras_desafio('${AGUA}')`,
    '42501',
  )
  await esperaValor(
    'aluna não muda configurações',
    `with u as (update public.configuracoes set pix_cheio = 1 returning 1) select count(*)::int from u`,
    0,
  )
  await t.db.query(`select public.registrar_acesso()`)
  await t.comoAluna(OUTRA)
  await esperaValor(
    'outra aluna não vê os check-ins dela',
    `select count(*)::int from public.desafio_checkins`,
    0,
  )
}

async function admin(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ADMIN)
  await esperaValor('admin vê todos os cardápios', `select count(*)::int from public.cardapios`, 2)
  await esperaValor(
    'painel conta participantes do desafio de água',
    `select participantes from public.painel_desafios() where id = '${AGUA}'`,
    1,
  )
  await esperaValor(
    'dois dias com 8 copos concluem o desafio de água',
    `select concluintes from public.painel_desafios() where id = '${AGUA}'`,
    1,
  )
  await esperaValor(
    'vencedora aparece com o nome',
    `select nome from public.vencedoras_desafio('${AGUA}')`,
    'Mari',
  )
  await esperaValor(
    'alunas distintas em desafios ativos',
    `select public.alunas_em_desafios_ativos()`,
    1,
  )
  await esperaValor(
    'admin encerra o desafio',
    `update public.desafios set encerrado_em = now() where id = '${AGUA}' returning 1`,
    1,
  )
  await esperaValor(
    'painel de alunas lista só alunas',
    `select count(*)::int from public.painel_alunas()`,
    3,
  )
  await esperaValor(
    'dia da aluna no painel',
    `select dia from public.painel_alunas() where id = '${ALUNA}'`,
    4,
  )
  await esperaValor(
    'último acesso registrado',
    `select (ultimo_acesso_em is not null) from public.painel_alunas() where id = '${ALUNA}'`,
    true,
  )
  await esperaValor(
    'admin muda preço',
    `update public.configuracoes set pix_cheio = 230000 returning pix_cheio`,
    230000,
  )
  await esperaErro(
    'oferta não termina antes de começar',
    `update public.configuracoes set oferta_fim = oferta_inicio - interval '1 hour'`,
    '23514',
  )
  await esperaErro(
    'configuração é uma linha só',
    `insert into public.configuracoes (id) values (false)`,
    '42501',
  )
  await esperaErro(
    'desafio de número exige meta diária e unidade',
    `insert into public.desafios (nome, inicio, fim, tipo_checkin, meta_dias) values ('x', current_date, current_date, 'numero', 1)`,
    '23514',
  )
  await esperaErro(
    'meta de dias não passa do período',
    `insert into public.desafios (nome, inicio, fim, tipo_checkin, meta_dias) values ('x', current_date, current_date + 2, 'sim_nao', 4)`,
    '23514',
  )
}

async function publico(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAnon()
  await esperaValor(
    'visitante lê preços e termos',
    `select jsonb_array_length(termos) > 0 from public.configuracoes`,
    true,
  )
  await esperaErro(
    'visitante não muda configurações',
    `update public.configuracoes set pix_cheio = 1`,
    '42501',
  )
  await esperaErro('visitante não lê cardápios', `select count(*) from public.cardapios`, '42501')
  await esperaErro('visitante não registra acesso', `select public.registrar_acesso()`, '42501')
  await t.comoDono()
  await esperaValor('aluna não mudou o preço', `select pix_cheio from public.configuracoes`, 230000)
  await t.db.query(`update public.configuracoes set termos = '[]'::jsonb`)
  await esperaValor(
    'mudar os termos atualiza a data deles',
    `select termos_atualizado_em > privacidade_atualizado_em from public.configuracoes`,
    true,
  )
}

export async function testarPainel() {
  const t = await criarBanco()
  await montar(t.db)
  await aluna(t)
  await admin(t)
  await publico(t)
  await t.comoDono()
  return t.fim('painel')
}
