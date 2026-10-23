import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const [T1, T2, T3, SOLTO] = [ID(61), ID(62), ID(63), ID(64)]
const ROTINA = ID(71)
const tema = `(select id from public.temas where chave = 'emagrecimento')`
const publicados = `select coalesce(string_agg(nome, ',' order by nome), '') from public.treinos where publicado`

async function montar(db) {
  await db.query(`insert into auth.users (id, email) values ($1,'ad@t.com')`, [ADMIN])
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    insert into public.treinos (id, nome, tema_id, nivel, local, publicado) values
      ('${T1}', 'Detox 1', ${tema}, 'iniciante', 'casa', false),
      ('${T2}', 'Detox 2', ${tema}, 'iniciante', 'casa', false),
      ('${T3}', 'Detox 3', ${tema}, 'iniciante', 'casa', false),
      ('${SOLTO}', 'Solto', ${tema}, 'iniciante', 'casa', false);
    insert into public.rotinas (id, nome, tema_id, nivel, local, publicado) values
      ('${ROTINA}', 'Treino DETOX', ${tema}, 'iniciante', 'casa', false);
    insert into public.rotina_treinos (rotina_id, treino_id, dia_semana) values
      ('${ROTINA}', '${T1}', 1), ('${ROTINA}', '${T2}', 3);
  `)
}

async function regras(t) {
  const { esperaValor } = t
  await t.comoAluna(ADMIN)
  await esperaValor('tipo em rascunho não publica os treinos', publicados, '')
  await t.db.query(`update public.rotinas set publicado = true where id = '${ROTINA}'`)
  await esperaValor('publicar o tipo publica os treinos dele', publicados, 'Detox 1,Detox 2')
  await t.db.query(
    `insert into public.rotina_treinos (rotina_id, treino_id, dia_semana) values ('${ROTINA}', '${T3}', 5)`,
  )
  await esperaValor(
    'treino posto num tipo publicado já aparece',
    publicados,
    'Detox 1,Detox 2,Detox 3',
  )
  await t.db.query(`update public.treinos set publicado = false where id = '${T1}'`)
  await t.db.query(`update public.rotinas set nome = 'Treino DETOX novo' where id = '${ROTINA}'`)
  await esperaValor('tirar um treino do ar continua valendo', publicados, 'Detox 2,Detox 3')
}

export async function testarPublicarTipo() {
  const t = await criarBanco()
  await montar(t.db)
  await regras(t)
  return t.fim('Publicar tipo de treino')
}
