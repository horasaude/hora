import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const NOVA = ID(3)
const ABERTA = ID(31)
const FECHADA = ID(32)
const prep = `(select e.id from public.etapas e join public.temas t on t.id = e.tema_id where t.chave = 'preparacao')`
const tema = `(select id from public.temas where chave = 'emagrecimento')`
const material = (aula, nome) =>
  `[{"tipo": "pdf", "caminho": "aulas/${aula}/${nome}.pdf", "nome": "${nome}", "tamanho": 1000}, {"tipo": "link", "caminho": "https://site.t/${nome}", "nome": "Link ${nome}"}]`

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'a@t.com'),($3,'n@t.com')`,
    [ADMIN, ALUNA, NOVA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = (public.hoje_brasilia() - 1)::timestamp at time zone 'America/Sao_Paulo' where id = '${ALUNA}';
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao, publicado) values
      ('${ABERTA}', ${prep}, 'Dia 1', 'https://v.t/1', 1, true),
      ('${FECHADA}', ${prep}, 'Dia 5', 'https://v.t/5', 5, true);
    insert into public.aulas (etapa_id, titulo, video_url, dia_liberacao, publicado)
      select e.id, 'Arrancada 1', 'https://v.t/a', 1, true from public.etapas e where e.tema_id = ${tema} and e.chave = 'arrancada';
    insert into storage.objects (bucket_id, name) values
      ('materiais', 'aulas/${ABERTA}/aberta.pdf'), ('materiais', 'aulas/${FECHADA}/fechada.pdf'), ('materiais', 'capas/live.jpg');
  `)
}

async function materiais(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ADMIN)
  for (const [aula, nome] of [
    [ABERTA, 'aberta'],
    [FECHADA, 'fechada'],
  ])
    await t.db.query(`select public.salvar_materiais('${aula}', '${material(aula, nome)}'::jsonb)`)
  await esperaValor('admin vê os 4 materiais', `select count(*)::int from public.aula_materiais`, 4)
  await esperaErro(
    'arquivo precisa estar na pasta aulas/',
    `select public.salvar_materiais('${ABERTA}', '[{"tipo": "pdf", "caminho": "outra/x.pdf", "nome": "x"}]'::jsonb)`,
    '23514',
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna lê só os materiais da aula liberada',
    `select string_agg(nome, ',' order by ordem) from public.aula_materiais`,
    'aberta,Link aberta',
  )
  await esperaValor(
    'aula bloqueada não devolve material',
    `select count(*)::int from public.aula_materiais where aula_id = '${FECHADA}'`,
    0,
  )
  await esperaValor(
    'aluna não lê o espaço materiais direto (só as capas)',
    `select string_agg(name, ',') from storage.objects where bucket_id = 'materiais'`,
    'capas/live.jpg',
  )
  await esperaErro(
    'aluna não grava material',
    `select public.salvar_materiais('${ABERTA}', '[]'::jsonb)`,
    '42501',
  )
  await esperaErro(
    'aluna não insere material direto',
    `insert into public.aula_materiais (aula_id, tipo, caminho, nome) values ('${ABERTA}', 'link', 'https://x.t', 'x')`,
    '42501',
  )
}

async function previa(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ADMIN)
  await esperaValor(
    'admin sem acesso pago vê a pré-visualização do dia 10 com tema',
    `select (public.trilha_previa(10, ${tema}) #>> '{etapas,0,dia_na_etapa}')`,
    '3',
  )
  await esperaValor(
    'no dia 3, a aula do dia 5 aparece fechada',
    `select (public.trilha_previa(3) #>> '{preparacao,1,liberada}')`,
    'false',
  )
  await esperaValor(
    'antes do dia 8 não há tema',
    `select (public.trilha_previa(5, ${tema}) ->> 'tema_atual')`,
    null,
  )
  await esperaValor(
    'Constância abre no dia 38 numa trilha ideal',
    `select (public.trilha_previa(38, ${tema}) #>> '{etapas,1,dia_na_etapa}')`,
    '1',
  )
  await esperaValor(
    'a pré-visualização não grava conclusão, etapa nem pontos',
    `select ((select count(*) from public.aulas_concluidas) + (select count(*) from public.etapas_iniciadas) + (select count(*) from public.lancamentos_pontos))::int`,
    0,
  )
  await esperaErro('dia fora de 1 a 365', `select public.trilha_previa(400)`, '22023')
  await t.comoAluna(ALUNA)
  await esperaErro('aluna não usa a pré-visualização', `select public.trilha_previa(10)`, '42501')
}

async function liberar(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(NOVA)
  await esperaValor('sem acesso, não tem dia', `select public.dia_de_acesso()`, null)
  await t.comoAluna(ALUNA)
  await esperaErro(
    'aluna não libera acesso',
    `select public.liberar_acesso('${NOVA}', public.hoje_brasilia())`,
    '42501',
  )
  await t.comoAluna(ADMIN)
  await t.db.query(`select public.liberar_acesso('${NOVA}', public.hoje_brasilia())`)
  await esperaValor(
    'fica registrado quem liberou',
    `select (acesso_liberado_por = '${ADMIN}' and acesso_liberado_em is not null) from public.perfis where id = '${NOVA}'`,
    true,
  )
  await esperaValor(
    'e o histórico da liberação',
    `select count(*)::int from public.acessos_liberados where perfil_id = '${NOVA}'`,
    1,
  )
  await t.comoAluna(NOVA)
  await esperaValor('liberado hoje, é o dia 1', `select public.dia_de_acesso()`, 1)
}

export async function testarMateriais() {
  const t = await criarBanco()
  await montar(t.db)
  await materiais(t)
  await previa(t)
  await liberar(t)
  return t.fim('materiais, pré-visualização e acesso')
}
