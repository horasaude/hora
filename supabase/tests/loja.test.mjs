import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)
const SEM = ID(3)
const P1 = ID(51)
const P2 = ID(52)

async function montar(db) {
  await db.query(
    `insert into auth.users (id, email) values ($1,'ad@t.com'),($2,'al@t.com'),($3,'sem@t.com')`,
    [ADMIN, ALUNA, SEM],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    update public.perfis set acesso_inicio_em = now() - interval '1 day' where id = '${ALUNA}';
  `)
}

async function painel(t) {
  const { esperaValor, esperaErro, db } = t
  await t.comoAluna(ADMIN)
  await esperaValor(
    'Active Life já vem cadastrada',
    `select count(*)::int from public.loja_parceiros where nome = 'Active Life' and ativo`,
    1,
  )
  const al = (await db.query(`select id from public.loja_parceiros`)).rows[0].id
  await db.query(
    `insert into public.loja_parceiros (id, nome, cupom, site_url, ativo) values ('${ID(41)}', 'Inativa', 'X10', 'https://x.com', false)`,
  )
  await db.query(`insert into public.loja_produtos (id, parceiro_id, nome, categoria, preco_centavos, preco_final_centavos, link_url, publicado, destaque)
    values ('${P1}', '${al}', 'Whey', 'suplementos', 20000, 16000, 'https://al.com/whey', true, true),
           ('${P2}', '${al}', 'Rascunho', 'outros', 5000, 5000, 'https://al.com/r', false, false),
           ('${ID(53)}', '${ID(41)}', 'De inativa', 'outros', 5000, 4000, 'https://x.com/p', true, false)`)
  await esperaErro(
    'preço final maior que o cheio',
    `insert into public.loja_produtos (parceiro_id, nome, categoria, preco_centavos, preco_final_centavos, link_url) values ('${al}', 'X', 'outros', 100, 200, 'https://a.com')`,
  )
  await esperaErro(
    'link precisa ser https',
    `insert into public.loja_produtos (parceiro_id, nome, categoria, preco_centavos, preco_final_centavos, link_url) values ('${al}', 'X', 'outros', 100, 90, 'http://a.com')`,
  )
  await esperaErro(
    'categoria fora da lista',
    `insert into public.loja_produtos (parceiro_id, nome, categoria, preco_centavos, preco_final_centavos, link_url) values ('${al}', 'X', 'roupas', 100, 90, 'https://a.com')`,
  )
  await esperaErro(
    'não apaga parceiro com produto',
    `delete from public.loja_parceiros where id = '${al}'`,
  )
  return al
}

async function aluna(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(SEM)
  await esperaValor(
    'sem acesso não vê produto',
    `select count(*)::int from public.loja_produtos`,
    0,
  )
  await esperaErro(
    'sem acesso não registra clique',
    `select public.registrar_clique_loja('${P1}')`,
    '42501',
  )
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna vê só o publicado de parceiro ativo',
    `select string_agg(nome, ',') from public.loja_produtos`,
    'Whey',
  )
  await esperaValor(
    'aluna vê só parceiro ativo',
    `select count(*)::int from public.loja_parceiros`,
    1,
  )
  await esperaErro(
    'aluna não cria produto',
    `insert into public.loja_produtos (parceiro_id, nome, categoria, preco_centavos, preco_final_centavos, link_url) values ('${ID(41)}', 'X', 'outros', 100, 90, 'https://a.com')`,
  )
  await esperaErro(
    'aluna não clica em rascunho',
    `select public.registrar_clique_loja('${P2}')`,
    '22023',
  )
  await t.db.query(`select public.registrar_clique_loja('${P1}')`)
  await t.db.query(`select public.registrar_clique_loja('${P1}')`)
  await esperaValor('aluna não lê cliques', `select count(*)::int from public.loja_cliques`, 0)
  await esperaErro('aluna não lê o resumo', `select * from public.painel_loja()`, '42501')
  await t.comoAluna(ADMIN)
  await esperaValor(
    'clique repetido no mesmo minuto conta 1',
    `select count(*)::int from public.loja_cliques`,
    1,
  )
  await esperaValor('resumo: publicados', `select publicados from public.painel_loja()`, 2)
  await esperaValor(
    'resumo: parceiros ativos',
    `select parceiros_ativos from public.painel_loja()`,
    1,
  )
  await esperaValor(
    'resumo: mais clicado',
    `select mais_clicado || ':' || mais_clicado_cliques from public.painel_loja()`,
    'Whey:1',
  )
  await esperaValor(
    '8 semanas de cliques',
    `select count(*)::int from public.cliques_por_semana('${P1}')`,
    8,
  )
  await esperaValor(
    'clique na semana atual',
    `select cliques from public.cliques_por_semana('${P1}') order by semana desc limit 1`,
    1,
  )
}

export async function testarLoja() {
  const t = await criarBanco()
  await montar(t.db)
  await painel(t)
  await aluna(t)
  await t.comoDono()
  return t.fim('loja')
}
