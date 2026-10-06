import { criarBanco } from './harness.mjs'

const ID = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`
const ADMIN = ID(1)
const ALUNA = ID(2)

const ordemTemas = `select string_agg(titulo, ',' order by ordem) from public.temas`
const ordemEtapas = `select string_agg(titulo, ',' order by ordem) from public.etapas where tema_id = '${ID(11)}'`
const ordemAulas = `select string_agg(titulo, ',' order by ordem) from public.aulas where etapa_id = '${ID(21)}'`

export async function testarOrdem() {
  const t = await criarBanco()
  const { db, esperaValor, esperaErro } = t
  await db.query(
    `insert into auth.users (id, email) values ($1, 'adm@t.com'), ($2, 'aluna@t.com')`,
    [ADMIN, ALUNA],
  )
  await db.exec(`
    update public.perfis set papel = 'admin' where id = '${ADMIN}';
    insert into public.temas (id, titulo, ordem) values ('${ID(11)}', 'A', 0), ('${ID(12)}', 'B', 0), ('${ID(13)}', 'C', 0);
    insert into public.etapas (id, tema_id, titulo, ordem) values
      ('${ID(21)}', '${ID(11)}', 'E1', 1), ('${ID(22)}', '${ID(11)}', 'E2', 2), ('${ID(23)}', '${ID(11)}', 'E3', 3);
    insert into public.aulas (id, etapa_id, titulo, video_url, dia_liberacao) values
      ('${ID(31)}', '${ID(21)}', 'X', 'https://v.t/x', 1),
      ('${ID(32)}', '${ID(21)}', 'Y', 'https://v.t/y', 1),
      ('${ID(33)}', '${ID(21)}', 'Z', 'https://v.t/z', 8);
  `)

  await t.comoAluna(ALUNA)
  await esperaErro('aluna não reordena temas', `select public.mover_tema('${ID(12)}', -1)`, '42501')
  await esperaErro(
    'aluna não reordena etapas',
    `select public.mover_etapa('${ID(22)}', -1)`,
    '42501',
  )
  await esperaErro('aluna não reordena aulas', `select public.mover_aula('${ID(32)}', 1)`, '42501')
  await t.comoAnon()
  await esperaErro('anônimo não reordena', `select public.mover_tema('${ID(12)}', -1)`, '42501')

  await t.comoAluna(ADMIN)
  await db.query(`select public.mover_tema('${ID(12)}', -1)`)
  await esperaValor('admin sobe o tema B (ordens repetidas viram 1, 2, 3)', ordemTemas, 'B,A,C')
  await db.query(`select public.mover_tema('${ID(12)}', -1)`)
  await esperaValor('subir o primeiro não muda nada', ordemTemas, 'B,A,C')
  await db.query(`select public.mover_etapa('${ID(23)}', -1)`)
  await esperaValor('admin sobe a etapa E3 sem violar a ordem única', ordemEtapas, 'E1,E3,E2')
  await db.query(`select public.mover_etapa('${ID(21)}', 1)`)
  await esperaValor('admin desce a etapa E1', ordemEtapas, 'E3,E1,E2')
  await db.query(`select public.mover_aula('${ID(31)}', 1)`)
  await esperaValor('admin desce a aula X', ordemAulas, 'Y,X,Z')
  await db.query(`select public.mover_aula('${ID(33)}', 5)`)
  await esperaValor('descer a última não muda nada', ordemAulas, 'Y,X,Z')

  await t.comoDono()
  return t.fim('ordem')
}
